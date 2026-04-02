window.agentChatUI = (() => {
  const runs = {};
  const activeStreams = {};
  let surfaceObserver = null;
  const STREAM_RENDER_BATCH_SIZE = 8;
  const STREAM_RENDER_INTERVAL_MS = 10;
  const aiMessageIconMarkup = `
    <svg class="ai-svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"/>
    </svg>
  `;
  const localModePlans = {
    post_creation: [
      { key: 'load_context', title: 'Load context', phase: 'load' },
      { key: 'draft_post', title: 'Draft post', phase: 'draft' },
      { key: 'draft_media_plan', title: 'Draft visuals', phase: 'draft' },
      { key: 'verify_outputs', title: 'Review draft', phase: 'verify' },
      { key: 'approval', title: 'Ready to review', phase: 'approval' },
      { key: 'apply_post', title: 'Apply changes', phase: 'apply' }
    ]
  };

  function getAgentSurfaceRoots() {
    if (typeof window.getAiChatSurfaceRoots === 'function') {
      return window.getAiChatSurfaceRoots() || [];
    }
    return Array.from(document.querySelectorAll('.ai-chat-surface'));
  }

  function getAgentActiveChatBody() {
    if (typeof window.getActiveAiChatBodyElement === 'function') {
      return window.getActiveAiChatBodyElement();
    }
    return document.getElementById('ai-chat-body');
  }

  function getAgentChatSessionStore() {
    return window.agentChatSessionStore || null;
  }

  function syncRunToSessionStore(runId) {
    const store = getAgentChatSessionStore();
    const run = runs[runId];
    if (!store || !run) {
      return;
    }

    const surfaceKey = run.setup?.surfaceKey === 'home' ? 'ai_home' : 'ai_chat';
    store.ensureCurrentSession({ surface: surfaceKey });
    store.upsertRun({
      runId,
      mode: run.setup?.mode || 'post_creation',
      generationId: run.setup?.generationId || null,
      effort: run.setup?.effort || 'normal',
      prompt: run.setup?.promptText || '',
      startedAt: run.startedAt,
      completedAt: run.completedAt || null,
      durationMs: run.completedAt && run.startedAt ? Math.max(0, run.completedAt - run.startedAt) : null,
      liveMessageId: run.liveMessageId || null,
      liveMessagePlacement: run.liveMessagePlacement || 'after_run',
      deferAssistantMessage: !!run.deferAssistantMessage,
      deferredAssistantMessage: run.deferredAssistantMessage || '',
      processItems: run.processItems || [],
      stepStatuses: run.stepStatuses || {},
      verification: run.verification || {},
      approval: run.approval || null,
      finalOutput: run.finalOutput || null,
      mediaPlan: run.mediaPlan || null,
      mediaPlanRequested: !!run.mediaPlanRequested,
      mediaGenerating: !!run.mediaGenerating,
      statusText: run.statusText || '',
      note: run.note || '',
      failed: !!run.failed,
      postId: run.postId || null,
      status: run.completedAt ? (run.failed ? 'failed' : 'completed') : 'running',
      meta: {
        plan: run.setup?.plan || []
      }
    });
  }

  function syncLiveAssistantMessageToSessionStore(runId, text = '', status = 'streaming') {
    const store = getAgentChatSessionStore();
    const run = runs[runId];
    if (!store || !run?.liveMessageId) {
      return;
    }

    const surfaceKey = run.setup?.surfaceKey === 'home' ? 'ai_home' : 'ai_chat';
    store.ensureCurrentSession({ surface: surfaceKey });
    store.upsertMessage({
      messageId: run.liveMessageId,
      role: 'assistant',
      messageType: 'ai-message',
      text: String(text || ''),
      status,
      runId,
      createEntry: true,
      meta: {
        placement: run.liveMessagePlacement || 'after_run'
      }
    });
    syncRunToSessionStore(runId);
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function ensureStepPunctuation(value, state = '') {
    const text = String(value || '').trim();
    if (!text) {
      return '';
    }

    if (state === 'completed' && !/[.!?…]$/.test(text)) {
      return `${text}.`;
    }

    return text;
  }

  function shouldShowCompletedDot(value, state = '') {
    if (state !== 'completed') {
      return false;
    }

    return /\bed[.!?…]?$/i.test(String(value || '').trim());
  }

  function extractErrorMessage(payload, fallback = 'Something went wrong.') {
    if (!payload) {
      return fallback;
    }

    if (typeof payload === 'string') {
      return payload;
    }

    if (typeof payload?.error === 'string') {
      return payload.error;
    }

    if (typeof payload?.error?.message === 'string') {
      return payload.error.message;
    }

    if (typeof payload?.message === 'string') {
      return payload.message;
    }

    return fallback;
  }

  function requestJson(url, body) {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {})
    }).then(async response => {
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(extractErrorMessage(data, 'Agent request failed.'));
      }
      return data;
    });
  }

  function newLocalRunId() {
    if (window.crypto?.randomUUID) {
      return `agent_run_${window.crypto.randomUUID().replace(/-/g, '')}`;
    }

    return `agent_run_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  }

  function createLocalSetup(payload = {}) {
    const mode = payload.mode || window.agentContracts?.modes?.postCreation || 'post_creation';
    const plan = localModePlans[mode] || localModePlans.post_creation;

    return {
      runId: payload.runId || newLocalRunId(),
      mode,
      plan,
      promptText: payload.promptText || '',
      surfaceKey: payload.surfaceKey || 'post',
      compactRun: !!payload.compactRun,
      generationId: payload.generationId || null,
      effort: payload.effort || 'normal',
      deferAssistantMessage: !!payload.deferAssistantMessage,
      liveMessagePlacement: payload.deferAssistantMessage ? 'tail' : 'after_run',
      streamBootstrap: []
    };
  }

  function flattenMediaPlan(mediaPlan) {
    const images = (mediaPlan?.images || []).map(item => ({ ...item, mediaType: 'image' }));
    const videos = (mediaPlan?.videos || []).map(item => ({ ...item, mediaType: 'video' }));
    return [...images, ...videos];
  }

  function formatRunDuration(startedAt, completedAt = Date.now()) {
    const start = Number(startedAt || 0);
    const end = Number(completedAt || Date.now());
    if (!start || !end || end <= start) {
      return '0s';
    }

    const totalSeconds = Math.max(1, Math.round((end - start) / 1000));
    if (totalSeconds < 60) {
      return `${totalSeconds}s`;
    }

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (!seconds) {
      return `${minutes}m`;
    }

    return `${minutes}m ${seconds}s`;
  }

  function formatTextMessage(value) {
    return renderMarkdownHtml(value, false);
  }

  function prepareStreamingMarkdown(value) {
    let text = String(value || '').replace(/—/g, ', ');
    const fencedBlocks = (text.match(/```/g) || []).length;
    if (fencedBlocks % 2 === 1) {
      text += '\n```';
    }

    const withoutTripleBackticks = text.replace(/```/g, '');
    if (((withoutTripleBackticks.match(/`/g) || []).length) % 2 === 1) {
      text += '`';
    }

    if (((text.match(/\*\*/g) || []).length) % 2 === 1) {
      text += '**';
    }
    if (((text.match(/__/g) || []).length) % 2 === 1) {
      text += '__';
    }

    const singleStarCount = (text.replace(/\*\*/g, '').match(/\*/g) || []).length;
    if (singleStarCount % 2 === 1) {
      text += '*';
    }

    const singleUnderscoreCount = (text.replace(/__/g, '').match(/_/g) || []).length;
    if (singleUnderscoreCount % 2 === 1) {
      text += '_';
    }

    text = text.replace(/\[([^\]]*)\]\(([^)]*)$/gm, '$1');
    text = text.replace(/\[([^\]]*)$/gm, '$1');
    text = text.replace(/\]\(([^)]*)$/gm, '');

    return text;
  }

  function cleanStreamingTail(value) {
    let text = String(value || '').replace(/—/g, ', ');
    text = text.replace(/\[([^\]]*)$/gm, '$1');
    text = text.replace(/\]\(([^)]*)$/gm, '');
    text = text.replace(/```+$/gm, '');
    text = text.replace(/`$/gm, '');
    text = text.replace(/\*\*$/gm, '');
    text = text.replace(/__$/gm, '');
    text = text.replace(/\*$/gm, '');
    text = text.replace(/_$/gm, '');
    return text;
  }

  function renderStreamingTailHtml(value) {
    const tail = cleanStreamingTail(value);
    if (!tail.trim()) {
      return tail ? `<p>${escapeHtml(tail)}</p>` : '';
    }

    const preparedTail = prepareStreamingMarkdown(tail);
    try {
      return markdownToHtml(preparedTail)
        .replace(/&mdash;|&#8212;/g, ', ')
        .replace(/—/g, ', ');
    } catch (error) {
      console.debug('Unable to render streaming tail markdown:', error);
      return `<p>${escapeHtml(tail)}</p>`;
    }
  }

  function renderMarkdownHtml(value, streaming = false) {
    if (streaming) {
      const normalized = String(value || '').replace(/—/g, ', ');
      const lastLineBreak = normalized.lastIndexOf('\n');
      const stablePart = lastLineBreak >= 0 ? normalized.slice(0, lastLineBreak + 1) : '';
      const tailPart = lastLineBreak >= 0 ? normalized.slice(lastLineBreak + 1) : normalized;
      let stableHtml = '';

      if (stablePart.trim()) {
        const preparedStable = prepareStreamingMarkdown(stablePart);
        try {
          stableHtml = markdownToHtml(preparedStable)
            .replace(/&mdash;|&#8212;/g, ', ')
            .replace(/—/g, ', ');
        } catch (error) {
          console.debug('Unable to render stable streamed markdown:', error);
          stableHtml = escapeHtml(stablePart).replace(/\n/g, '<br>');
        }
      } else if (stablePart) {
        stableHtml = stablePart.replace(/\n/g, '<br>');
      }

      return `${stableHtml}${renderStreamingTailHtml(tailPart)}`;
    }

    const sourceText = String(value || '').replace(/—/g, ', ');

    if (typeof markdownToHtml === 'function') {
      try {
        return markdownToHtml(sourceText)
          .replace(/&mdash;|&#8212;/g, ', ')
          .replace(/—/g, ', ');
      } catch (error) {
        console.debug('Unable to render streamed markdown:', error);
      }
    }

    return escapeHtml(sourceText).replace(/\n/g, '<br>');
  }

  function tokenizeStreamingDelta(delta) {
    return String(delta || '').match(/\n|[^\s\n]+\s*|\s+/g) || [];
  }

  function segmentGraphemes(value) {
    const text = String(value || '');
    if (!text) {
      return [];
    }

    if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
      const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
      return [...segmenter.segment(text)].map(part => part.segment);
    }

    return Array.from(text);
  }

  function drainStreamingBuffer(streamState, isFinal = false) {
    const buffer = String(streamState?.bufferedDelta || '');
    if (!buffer) {
      return [];
    }

    const graphemes = segmentGraphemes(buffer);
    if (!graphemes.length) {
      return [];
    }

    const safeCount = isFinal ? graphemes.length : Math.max(0, graphemes.length - 1);
    if (!safeCount) {
      return [];
    }

    const ready = graphemes.slice(0, safeCount);
    streamState.bufferedDelta = graphemes.slice(safeCount).join('');
    return ready;
  }

  function scheduleChatScroll() {
    return;
  }

  function clearStreamLoop(runId) {
    const streamState = runs[runId]?.streamState;
    if (!streamState?.flushTimer) {
      return;
    }

    clearTimeout(streamState.flushTimer);
    streamState.flushTimer = null;
  }

  function flushStreamingQueue(runId) {
    const run = runs[runId];
    const streamState = run?.streamState;
    if (!run || !streamState) {
      return;
    }

    streamState.flushTimer = null;

    const messageNode = ensureLiveAssistantMessage(runId);
    if (streamState.pendingTokens.length && messageNode) {
      const nextChunk = streamState.pendingTokens.splice(0, STREAM_RENDER_BATCH_SIZE).join('');
      streamState.displayedText += nextChunk;
      messageNode.innerHTML = renderMarkdownHtml(streamState.displayedText, true);
      messageNode.setAttribute('data-streaming', 'true');
      syncLiveAssistantMessageToSessionStore(runId, streamState.displayedText, 'streaming');
      scheduleChatScroll();
    }

    if (streamState.pendingTokens.length) {
      streamState.flushTimer = setTimeout(() => flushStreamingQueue(runId), STREAM_RENDER_INTERVAL_MS);
      return;
    }

    if (streamState.finalText !== null) {
      const finalText = streamState.finalText;
      clearStreamLoop(runId);
      run.streamState = null;
      if (messageNode) {
        messageNode.innerHTML = renderMarkdownHtml(finalText, false);
        messageNode.setAttribute('data-streaming', 'false');
        syncLiveAssistantMessageToSessionStore(runId, finalText, 'completed');
        scheduleChatScroll(true);
      }
    }
  }

  function queueLiveAssistantMessage(runId, fullText, delta = '') {
    const run = runs[runId];
    if (!run) {
      return;
    }

    const streamState = run.streamState || {
      rawText: '',
      displayedText: '',
      pendingTokens: [],
      bufferedDelta: '',
      finalText: null,
      flushTimer: null
    };

    run.streamState = streamState;
    streamState.rawText = String(fullText || '');
    streamState.finalText = null;

    streamState.bufferedDelta += String(delta || '');
    const normalizedTokens = drainStreamingBuffer(streamState, false).filter(token => token !== '');

    if (normalizedTokens.length) {
      streamState.pendingTokens.push(...normalizedTokens);
    }

    const messageNode = ensureLiveAssistantMessage(runId);
    if (messageNode) {
      messageNode.setAttribute('data-streaming', 'true');
    }

    if (!streamState.flushTimer && streamState.pendingTokens.length) {
      streamState.flushTimer = setTimeout(() => flushStreamingQueue(runId), STREAM_RENDER_INTERVAL_MS);
    }
  }

  function playDeferredAssistantMessage(runId, text = '') {
    const run = runs[runId];
    const finalText = String(text || run?.deferredAssistantMessage || '').trim();
    if (!run || !finalText) {
      return;
    }

    run.deferAssistantMessage = false;
    run.deferredAssistantMessage = '';
    run.liveMessagePlacement = 'tail';
    removeLiveAssistantMessage(runId);
    queueLiveAssistantMessage(runId, finalText, finalText);
    if (run.streamState) {
      const flushedTokens = drainStreamingBuffer(run.streamState, true).filter(token => token !== '');
      if (flushedTokens.length) {
        run.streamState.pendingTokens.push(...flushedTokens);
      }
      run.streamState.finalText = finalText;
    }
  }

  function waitForStreamToSettle(runId, extraDelay = 140) {
    return new Promise(resolve => {
      const check = () => {
        const streamState = runs[runId]?.streamState;
        const isIdle = !streamState || (!streamState.pendingTokens.length && !streamState.flushTimer);
        if (isIdle) {
          setTimeout(resolve, extraDelay);
          return;
        }
        setTimeout(check, 24);
      };

      check();
    });
  }

  function parseSseBlock(block) {
    const lines = block.split(/\r?\n/);
    let eventName = 'message';
    const dataLines = [];

    for (const line of lines) {
      if (!line) {
        continue;
      }
      if (line.startsWith('event:')) {
        eventName = line.slice(6).trim();
        continue;
      }
      if (line.startsWith('data:')) {
        dataLines.push(line.slice(5).trimStart());
      }
    }

    if (!dataLines.length) {
      return null;
    }

    try {
      const data = JSON.parse(dataLines.join('\n'));
      return { event: eventName, data };
    } catch (error) {
      console.error('Unable to parse SSE payload:', error);
      return null;
    }
  }

  function ensureLiveAssistantMessage(runId) {
    const existing = document.getElementById(`agent-live-message-${runId}`);
    if (existing) {
      return existing;
    }

    const chatBody = getAgentActiveChatBody();
    if (!chatBody) {
      return null;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'ai-message ai-text chat-div agent-live-message';
    wrapper.setAttribute('data-live-run-id', runId);
    wrapper.setAttribute('data-live', 'true');
    wrapper.innerHTML = `
      <span class="ai-icon animate-slide-in">${aiMessageIconMarkup}</span>
      <div class="chat-element chat-text" element-type="ai-message" id="agent-live-message-${runId}" data-streaming="true"></div>
    `;

    const placement = runs[runId]?.liveMessagePlacement || 'after_run';
    if (runs[runId]) {
      runs[runId].liveMessageId = `agent-live-message-${runId}`;
    }
    const runCard = chatBody.querySelector(`[data-run-id="${runId}"]`);
    if (placement === 'tail' || !runCard) {
      chatBody.appendChild(wrapper);
    } else if (placement === 'after_run' && runCard) {
      runCard.insertAdjacentElement('afterend', wrapper);
    } else if (runCard) {
      chatBody.insertBefore(wrapper, runCard);
    }

    updateEmptyState();
    scheduleChatScroll();
    syncLiveAssistantMessageToSessionStore(runId, runs[runId]?.streamState?.displayedText || '', 'streaming');
    return wrapper.querySelector('.chat-text');
  }

  function setLiveAssistantMessage(runId, text, isStreaming = true) {
    if (isStreaming) {
      queueLiveAssistantMessage(runId, text, text);
      return;
    }

    const run = runs[runId];
    if (!run) {
      return;
    }

    const messageNode = ensureLiveAssistantMessage(runId);
    if (!messageNode) {
      return;
    }

    if (run.streamState?.pendingTokens?.length) {
      run.streamState.finalText = text;
      return;
    }

    clearStreamLoop(runId);
    run.streamState = null;
    messageNode.innerHTML = formatTextMessage(text);
    messageNode.setAttribute('data-streaming', 'false');
    syncLiveAssistantMessageToSessionStore(runId, text, 'completed');
    scheduleChatScroll();
  }

  function removeLiveAssistantMessage(runId) {
    clearStreamLoop(runId);
    if (runs[runId]) {
      runs[runId].streamState = null;
    }
    $(`.agent-live-message[data-live-run-id="${runId}"]`).remove();
    updateEmptyState();
  }

  function currentChatProfileIds() {
    if (Array.isArray(window.profileIdsList) && window.profileIdsList.length) {
      return [...window.profileIdsList];
    }

    return [];
  }

  function currentChatGroupIds(profileIds) {
    if (typeof window.detectProfilesGroups === 'function') {
      return window.detectProfilesGroups(profileIds) || [];
    }

    return [];
  }

  function buildContextChipsMarkup() {
    const profileIds = currentChatProfileIds();
    const groupIds = currentChatGroupIds(profileIds);
    const chips = [];

    if (groupIds.length && window.profilesGroups) {
      for (const groupId of groupIds) {
        const group = window.profilesGroups[groupId];
        if (group?.groupName) {
          chips.push(`<span class="agent-context-chip strong">${escapeHtml(group.groupName)}</span>`);
        }
      }
    }

    if (profileIds.length && window.profilesData) {
      chips.push(
        `<span class="agent-context-chip">${profileIds.length} profile${profileIds.length > 1 ? 's' : ''} selected</span>`
      );
    }

    return chips.join('');
  }

  function refreshContextBar() {
    const markup = buildContextChipsMarkup();
    getAgentSurfaceRoots().forEach(surfaceRoot => {
      const contextBar = surfaceRoot.querySelector('.agent-chat-context-bar');
      if (!contextBar) {
        return;
      }
      contextBar.innerHTML = markup;
      contextBar.style.display = markup ? '' : 'none';
    });
  }

  function updateEmptyState() {
    getAgentSurfaceRoots().forEach(chatMain => {
      const chatBody = chatMain.querySelector('.ai-chat-body, #ai-chat-body');
      if (!chatBody) {
        return;
      }

      const hasConversation = !!chatBody.querySelector('.user-message, .ai-message, .new-post, .ai-sources, .agent-run-card');
      chatMain.classList.toggle('agent-chat-has-content', hasConversation);
    });
  }

  function ensureAgentSurface() {
    getAgentSurfaceRoots().forEach(chatMain => {
      const chatHeader = chatMain?.querySelector('.chat-header');
      const inputArea = chatMain?.querySelector('.input-area');
      if (!chatMain || !chatHeader || !inputArea) {
        return;
      }

      const headerCopy = chatHeader.querySelector('.agent-chat-header-copy');
      if (headerCopy) {
        headerCopy.remove();
      }

      if (!chatMain.querySelector('.agent-chat-context-bar')) {
        const contextBar = document.createElement('div');
        contextBar.className = 'agent-chat-context-bar';
        inputArea.insertBefore(contextBar, inputArea.firstChild);
      }
    });

    refreshContextBar();
    updateEmptyState();
  }

  function initializeAgentSurface() {
    ensureAgentSurface();

    const chatBodies = getAgentSurfaceRoots()
      .map(surfaceRoot => surfaceRoot.querySelector('.ai-chat-body, #ai-chat-body'))
      .filter(Boolean);
    if (chatBodies.length && !surfaceObserver) {
      surfaceObserver = new MutationObserver(() => {
        updateEmptyState();
      });

      chatBodies.forEach(chatBody => {
        surfaceObserver.observe(chatBody, { childList: true });
      });
    }

    $(document).on(
      'click',
      '.group-checkbox[data-type="agent"], .profile-checkbox[data-type="agent"], .accounts-selector[data-type="agent"], .suggestion-item, .chat-header-icon.close-chat',
      function() {
        setTimeout(() => {
          ensureAgentSurface();
          refreshContextBar();
          updateEmptyState();
        }, 0);
      }
    );

    setInterval(() => {
      refreshContextBar();
      updateEmptyState();
    }, 1500);
  }

  function ensureRunState(setup) {
    const runtime = window.agentRuntimeBlueprint;
    let state = runtime
      ? runtime.createRunState(setup.runId, setup.mode)
      : {
          runId: setup.runId,
          mode: setup.mode,
          plan: [],
          timeline: [],
          status: 'idle',
          draft: null,
          approval: null,
          verification: null
        };

    for (const event of setup.streamBootstrap || []) {
      if (runtime?.applyEvent) {
        state = runtime.applyEvent(state, event);
      }
    }

    const stepStatuses = {};
    const plan = setup.plan || [];
    plan.forEach((step, index) => {
      stepStatuses[step.key] = index === 0 ? 'active' : 'pending';
    });

    runs[setup.runId] = {
      state,
      setup,
      startedAt: Date.now(),
      completedAt: null,
      processExpanded: false,
      statusText: 'Getting things ready…',
      note: '',
      deferAssistantMessage: !!setup.deferAssistantMessage,
      deferredAssistantMessage: '',
      liveMessagePlacement: setup.liveMessagePlacement || (setup.deferAssistantMessage ? 'tail' : 'after_run'),
      processItems: [],
      stepStatuses,
      verification: {},
      mediaPlan: null,
      mediaPlanRequested: false,
      mediaGenerating: false,
      postId: null,
      approval: null,
      finalOutput: null,
      failed: false,
      thinkingHintQueue: [],
      thinkingHintTimer: null,
      currentThinkingHint: ''
    };

    syncRunToSessionStore(setup.runId);

    return runs[setup.runId];
  }

  function upsertProcessItem(run, payload = {}) {
    if (!run || !payload.processKey || !payload.message) {
      return;
    }

    const timestamp = Date.now();

    let nextMessage = payload.message;
    if (payload.processKey === 'thinking' && (payload.processState || 'completed') === 'active' && run.currentThinkingHint) {
      nextMessage = `Thinking… (${run.currentThinkingHint})`;
    }

    const nextItem = {
      key: payload.processKey,
      state: payload.processState || 'completed',
      kind: payload.processKind || 'action',
      message: nextMessage,
      detail: payload.detail || '',
      createdAt: timestamp,
      updatedAt: timestamp,
      completedAt: ['completed', 'failed'].includes(payload.processState || 'completed') ? timestamp : null
    };

    const existingIndex = (run.processItems || []).findIndex(item => item.key === payload.processKey);
    if (existingIndex === -1) {
      run.processItems = [...(run.processItems || []), nextItem];
      return;
    }

    run.processItems[existingIndex] = {
      ...run.processItems[existingIndex],
      ...nextItem,
      createdAt: run.processItems[existingIndex].createdAt || timestamp,
      completedAt: ['completed', 'failed'].includes(nextItem.state)
        ? (run.processItems[existingIndex].completedAt || timestamp)
        : null
    };
  }

  function buildActivityMarkup(run) {
    if (run.processItems?.length) {
      return `
        <div class="agent-run-activity-list">
          ${run.processItems
            .map(
              item => `
                <div class="agent-run-activity-item" data-kind="${escapeHtml(item.kind)}" data-state="${escapeHtml(item.state)}">
                  <div class="agent-run-activity-marker${shouldShowCompletedDot(item.message, item.state) ? ' with-dot' : ''}" aria-hidden="true"></div>
                  <p class="agent-run-activity-text">${escapeHtml(ensureStepPunctuation(item.message, item.state))}</p>
                  ${item.detail ? `<p class="agent-run-activity-detail">${escapeHtml(item.detail)}</p>` : ''}
                </div>
              `
            )
            .join('')}
        </div>
      `;
    }

    const items = [];
    const completedTools = (run.state?.timeline || []).filter(event => event.kind === 'tool_call_completed').slice(-2);
    const verificationGroups = ['post', 'media', 'brand', 'automation']
      .map(key => run.verification?.[key])
      .filter(Boolean);
    const mediaItems = flattenMediaPlan(run.mediaPlan);
    const hasDraft =
      !!Object.keys(run.finalOutput?.post || {}).length ||
      !!Object.keys(run.finalOutput?.brand || {}).length ||
      !!Object.keys(run.finalOutput?.automation || {}).length ||
      !!mediaItems.length;

    if (run.statusText) {
      items.push({ kind: 'status', message: run.statusText });
    }

    for (const event of completedTools) {
      items.push({ kind: 'done', message: event?.payload?.message || 'Fresh context captured.' });
    }

    if (hasDraft) {
      if (Object.keys(run.finalOutput?.post || {}).length) {
        items.push({ kind: 'done', message: 'Post draft prepared.' });
      }
      if (Object.keys(run.finalOutput?.brand || {}).length) {
        items.push({ kind: 'done', message: 'Brand draft prepared.' });
      }
      if (Object.keys(run.finalOutput?.automation || {}).length) {
        items.push({ kind: 'done', message: 'Automation draft prepared.' });
      }
      if (mediaItems.length) {
        items.push({ kind: 'done', message: `Visual plan prepared, ${mediaItems.length} asset${mediaItems.length > 1 ? 's' : ''}.` });
      }
    }

    if (verificationGroups.length) {
      const issues = verificationGroups.flatMap(group => group?.issues || []);
      if (issues.length) {
        for (const issue of issues) {
          items.push({ kind: issue.blocking ? 'warning' : 'note', message: issue.message });
        }
      } else {
        items.push({ kind: 'done', message: 'Checks passed.' });
      }
    }

    if (run.approval?.required) {
      items.push({
        kind: run.approval?.blockingIssues?.length ? 'warning' : 'status',
        message: run.approval?.blockingIssues?.length
          ? 'Ready for review, a few items need attention.'
          : 'Ready for review. Choose what to apply.'
      });
    }

    if (!items.length) {
      return '';
    }

    return `
      <div class="agent-run-activity-list">
        ${items
          .map(
            item => `
              <div class="agent-run-activity-item" data-kind="${escapeHtml(item.kind)}">
                <div class="agent-run-activity-marker${shouldShowCompletedDot(item.message, item.kind === 'done' ? 'completed' : '') ? ' with-dot' : ''}" aria-hidden="true"></div>
                <p class="agent-run-activity-text">${escapeHtml(ensureStepPunctuation(item.message, item.kind === 'done' ? 'completed' : ''))}</p>
              </div>
            `
          )
          .join('')}
      </div>
    `;
  }

  function clearThinkingHintTimer(run) {
    if (!run?.thinkingHintTimer) {
      return;
    }

    clearInterval(run.thinkingHintTimer);
    run.thinkingHintTimer = null;
  }

  function applyThinkingHint(runId, hint = '') {
    const run = runs[runId];
    if (!run) {
      return;
    }

    run.currentThinkingHint = String(hint || '').trim();
    if (!run.currentThinkingHint) {
      return;
    }

    upsertProcessItem(run, {
      processKey: 'thinking',
      processState: 'active',
      processKind: 'thinking',
      message: `Thinking… (${run.currentThinkingHint})`,
      detail: ''
    });
    renderRun(runId);
  }

  function flushThinkingHints(runId) {
    const run = runs[runId];
    if (!run) {
      return;
    }

    const nextHint = run.thinkingHintQueue.shift();
    if (!nextHint) {
      clearThinkingHintTimer(run);
      return;
    }

    applyThinkingHint(runId, nextHint);
  }

  function queueThinkingHint(runId, hint = '') {
    const run = runs[runId];
    const normalizedHint = String(hint || '').trim();
    if (!run || !normalizedHint) {
      return;
    }

    if (run.currentThinkingHint === normalizedHint || run.thinkingHintQueue.includes(normalizedHint)) {
      return;
    }

    run.thinkingHintQueue.push(normalizedHint);
    if (!run.thinkingHintTimer) {
      flushThinkingHints(runId);
      run.thinkingHintTimer = setInterval(() => flushThinkingHints(runId), 500);
    }
  }

  function stopThinkingHints(runId) {
    const run = runs[runId];
    if (!run) {
      return;
    }

    clearThinkingHintTimer(run);
    run.thinkingHintQueue = [];
    run.currentThinkingHint = '';
  }

  function settleActiveProcessItem(run, matcher, nextMessage) {
    if (!run?.processItems?.length) {
      return false;
    }

    const targetIndex = run.processItems.findIndex(item => item.state === 'active' && matcher(item));
    if (targetIndex === -1) {
      return false;
    }

    run.processItems[targetIndex] = {
      ...run.processItems[targetIndex],
      state: 'completed',
      message: nextMessage || run.processItems[targetIndex].message,
      detail: ''
    };
    return true;
  }

  function formatActivityMessage(event) {
    const payload = event?.payload || {};

    if (event?.kind === 'tool_call_completed') {
      return payload.message || 'Fetched fresh context.';
    }

    if (event?.kind === 'draft_ready') {
      const postCount = Array.isArray(payload.output?.posts) && payload.output.posts.length
        ? payload.output.posts.length
        : (!!Object.keys(payload.output?.post || {}).length ? 1 : 0);
      const mediaPlanCount = Array.isArray(payload.output?.mediaPlans) && payload.output.mediaPlans.length
        ? payload.output.mediaPlans.length
        : (flattenMediaPlan(payload.output?.media).length ? 1 : 0);
      const brandCount = Array.isArray(payload.output?.brands) && payload.output.brands.length
        ? payload.output.brands.length
        : (!!Object.keys(payload.output?.brand || {}).length ? 1 : 0);
      const automationCount = Array.isArray(payload.output?.automations) && payload.output.automations.length
        ? payload.output.automations.length
        : (!!Object.keys(payload.output?.automation || {}).length ? 1 : 0);
      const hasPost = postCount > 0;
      const mediaCount = flattenMediaPlan(payload.output?.media).length;
      const hasBrand = brandCount > 0;
      const hasAutomation = automationCount > 0;
      if (postCount > 1 && mediaPlanCount) {
        return `Prepared ${postCount} drafts and ${mediaPlanCount} visual plans.`;
      }
      if (postCount > 1) {
        return `Prepared ${postCount} drafts.`;
      }
      if (brandCount > 1) {
        return `Prepared ${brandCount} brand drafts.`;
      }
      if (automationCount > 1) {
        return `Prepared ${automationCount} automation drafts.`;
      }
      if (mediaPlanCount > 1) {
        return `Prepared ${mediaPlanCount} visual plans.`;
      }
      if (hasPost && mediaCount) {
        return 'Prepared a draft and a visual plan.';
      }
      if (hasPost) {
        return 'Prepared a draft.';
      }
      if (hasBrand) {
        return 'Prepared a brand draft.';
      }
      if (hasAutomation) {
        return 'Prepared an automation draft.';
      }
      if (mediaCount) {
        return 'Prepared a visual plan.';
      }
      return 'Prepared a reply.';
    }

    if (event?.kind === 'verification_result') {
      const postIssues = payload.post?.issues || [];
      const mediaIssues = payload.media?.issues || [];
      const brandIssues = payload.brand?.issues || [];
      const automationIssues = payload.automation?.issues || [];
      const hasBlocking = [...postIssues, ...mediaIssues, ...brandIssues, ...automationIssues].some(issue => issue?.blocking);
      if (hasBlocking) {
        return 'Flagged a few things to review.';
      }
      if (postIssues.length || mediaIssues.length || brandIssues.length || automationIssues.length) {
        return 'Added a few review notes.';
      }
      return 'Checked the draft.';
    }

    if (event?.kind === 'run_failed') {
      return payload.message || 'The run stopped before anything changed.';
    }

    return payload.message || '';
  }

  function buildIssuesMarkup(verification) {
    const issues = verification?.issues || [];
    if (!issues.length) {
      return '<p class="agent-run-issues-empty">Checks passed.</p>';
    }

    return `
      <div class="agent-run-issues-list">
        ${issues
          .map(
            issue => `
              <div class="agent-run-issue" data-blocking="${issue.blocking ? 'true' : 'false'}">
                <span class="agent-run-issue-pill">${issue.blocking ? 'Needs review' : 'Note'}</span>
                <p>${escapeHtml(issue.message)}</p>
              </div>
            `
          )
          .join('')}
      </div>
    `;
  }

  function buildMediaPlanMarkup(run) {
    const items = flattenMediaPlan(run.mediaPlan);
    if (!items.length) {
      return '';
    }

    const firstItem = items[0] || {};
    const mediaType = firstItem.mediaType === 'video' ? 'Video suggestion' : 'Image suggestion';
    const description = firstItem.instruction || 'Suggested visual direction.';
    const totalCount = items.length;
    const helperCopy = totalCount > 1
      ? `${totalCount} media suggestions are ready.`
      : 'One media suggestion is ready.';

    return `
      <div class="agent-artifact-card media-suggestion">
        <div class="agent-artifact-meta">
          <span>${run.mediaPlanRequested ? 'Requested visual' : 'Visual suggestion'}</span>
        </div>
        <h3>${escapeHtml(mediaType)}</h3>
        <p class="agent-artifact-copy">${escapeHtml(description)}</p>
        <p class="agent-artifact-subtle">${escapeHtml(helperCopy)}</p>
        <button
          class="agent-run-button primary agent-generate-media"
          data-run-id="${run.setup.runId}"
          ${run.mediaGenerating ? 'disabled' : ''}
        >
          ${run.mediaGenerating ? (run.mediaPlanRequested ? 'Generating requested media…' : 'Generating visuals…') : (run.mediaPlanRequested ? 'Generate requested media' : 'Generate visuals')}
        </button>
      </div>
    `;
  }

  function buildVerificationMarkup(run) {
    const postVerification = run.verification.post;
    const mediaVerification = run.verification.media;
    const brandVerification = run.verification.brand;
    const automationVerification = run.verification.automation;

    if (!postVerification && !mediaVerification && !brandVerification && !automationVerification) {
      return '';
    }

    const panels = [];

    if (postVerification && (postVerification.ok === false || postVerification?.issues?.length)) {
      panels.push(`
        <div class="agent-run-panel">
          <div class="agent-run-panel-head">
            <h4>Post notes</h4>
          </div>
          ${buildIssuesMarkup(postVerification)}
        </div>
      `);
    }

    if (mediaVerification && (mediaVerification.ok === false || mediaVerification?.issues?.length)) {
      panels.push(`
        <div class="agent-run-panel">
          <div class="agent-run-panel-head">
            <h4>Visual notes</h4>
          </div>
          ${buildIssuesMarkup(mediaVerification)}
        </div>
      `);
    }

    if (brandVerification && (brandVerification.ok === false || brandVerification?.issues?.length)) {
      panels.push(`
        <div class="agent-run-panel">
          <div class="agent-run-panel-head">
            <h4>Brand notes</h4>
          </div>
          ${buildIssuesMarkup(brandVerification)}
        </div>
      `);
    }

    if (automationVerification && (automationVerification.ok === false || automationVerification?.issues?.length)) {
      panels.push(`
        <div class="agent-run-panel">
          <div class="agent-run-panel-head">
            <h4>Automation notes</h4>
          </div>
          ${buildIssuesMarkup(automationVerification)}
        </div>
      `);
    }

    if (!panels.length) {
      return '';
    }

    return `<div class="agent-run-panels">${panels.join('')}</div>`;
  }

  function buildStepMarkup(run) {
    const plan = run.setup.plan || [];
    return plan
      .map(step => {
        const status = run.stepStatuses[step.key] || 'pending';
        return `
          <div class="agent-run-step" data-status="${status}">
            <div class="agent-run-step-dot"></div>
            <div class="agent-run-step-copy">
              <p>${escapeHtml(step.title)}</p>
              <span>${escapeHtml(step.phase || 'action')}</span>
            </div>
          </div>
        `;
      })
      .join('');
  }

  function buildRunMarkup(run) {
    const compactRun = !!run.setup?.compactRun;
    const failedClass = run.failed ? ' failed' : '';
    const activityMarkup = buildActivityMarkup(run);
    const showGenerateMedia = !!flattenMediaPlan(run.mediaPlan).length;
    const showFooter = !!run.approval?.required && !run.processItems?.length;
    const isCompleted = !!run.completedAt;
    const showDisclosure = isCompleted && !!activityMarkup;
    const compactStatus = escapeHtml(run.statusText || (run.failed ? 'Something went wrong.' : 'Generating…'));

    if (compactRun) {
      if (run.failed) {
        return `
          <div class="agent-run-shell${failedClass}">
            <div class="agent-run-footer"><span class="agent-run-footer-copy">${compactStatus}</span></div>
          </div>
        `;
      }

      if (isCompleted) {
        return '';
      }

      return `
        <div class="agent-run-shell${failedClass}">
          <div class="agent-run-footer"><span class="agent-run-footer-copy">${compactStatus}</span></div>
        </div>
      `;
    }

    if (!activityMarkup && !showGenerateMedia && !showFooter) {
      return '';
    }

    return `
      <div class="agent-run-shell${failedClass}">
        ${showDisclosure ? `
          <button
            type="button"
            class="agent-run-disclosure"
            data-run-id="${escapeHtml(run.setup.runId)}"
            data-expanded="${run.processExpanded ? 'true' : 'false'}"
            aria-expanded="${run.processExpanded ? 'true' : 'false'}"
          >
            <span class="agent-run-disclosure-line" aria-hidden="true"></span>
            <span class="agent-run-disclosure-copy">Worked for ${escapeHtml(formatRunDuration(run.startedAt, run.completedAt))}</span>
            <i class="fas fa-chevron-${run.processExpanded ? 'up' : 'down'}" aria-hidden="true"></i>
          </button>
        ` : ''}
        ${!showDisclosure || run.processExpanded ? activityMarkup : ''}
        ${showGenerateMedia ? buildMediaPlanMarkup(run) : ''}
        ${showFooter ? `<div class="agent-run-footer"><span class="agent-run-footer-copy">Review first, then choose what to apply.</span></div>` : ''}
      </div>
    `;
  }

  function renderRun(runId) {
    const run = runs[runId];
    if (!run) {
      return;
    }

    const $container = $(`[data-run-id="${runId}"]`).first();
    if (!$container.length) {
      return;
    }

    $container.html(buildRunMarkup(run));
    syncRunToSessionStore(runId);
    scheduleChatScroll();
  }

  function promoteLoaderToRunCard(setup) {
    const $loader = $(`.ai-chat-surface[data-ai-chat-surface="${setup.surfaceKey || 'post'}"] #ai-message-loader`).last();
    if (!$loader.length) {
      return null;
    }

    const run = ensureRunState(setup);
    $loader.removeAttr('id');
    $loader.attr('data-run-id', setup.runId);
    $loader.addClass('agent-run-card');
    renderRun(setup.runId);
    return setup.runId;
  }

  function setStatus(runId, text) {
    if (!runs[runId]) {
      return;
    }
    runs[runId].statusText = text;
    renderRun(runId);
  }

  function setNote(runId, text) {
    if (!runs[runId]) {
      return;
    }
    runs[runId].note = text;
    renderRun(runId);
  }

  function setStepStatus(runId, stepKey, status) {
    if (!runs[runId]) {
      return;
    }

    runs[runId].stepStatuses[stepKey] = status;
    renderRun(runId);
  }

  function completeStep(runId, stepKey, nextStepKey = '') {
    setStepStatus(runId, stepKey, 'completed');
    if (nextStepKey) {
      setStepStatus(runId, nextStepKey, 'active');
    }
  }

  function attachVerification(runId, kind, verification) {
    if (!runs[runId]) {
      return;
    }
    runs[runId].verification[kind] = verification;
    renderRun(runId);
  }

  function attachPost(runId, postId) {
    if (!runs[runId]) {
      return;
    }
    runs[runId].postId = postId;
    renderRun(runId);
  }

  function attachMediaPlan(runId, mediaPlan, options = {}) {
    if (!runs[runId]) {
      return;
    }
    runs[runId].mediaPlan = mediaPlan;
    runs[runId].mediaPlanRequested = !!options.requested;
    renderRun(runId);
  }

  function markRunFailed(runId, error) {
    if (!runs[runId]) {
      return;
    }

    runs[runId].failed = true;
    runs[runId].completedAt = Date.now();
    runs[runId].statusText = error || 'The agent run failed.';
    runs[runId].note = 'Nothing changed.';
    renderRun(runId);
  }

  function markRunCancelled(runId) {
    if (!runs[runId]) {
      return;
    }

    runs[runId].failed = true;
    runs[runId].completedAt = Date.now();
    runs[runId].statusText = 'Stopped by user.';
    runs[runId].note = 'Nothing changed.';
    removeLiveAssistantMessage(runId);
    renderRun(runId);
  }

  function applyStreamEvent(runId, event) {
    const run = runs[runId];
    if (!run || !event) {
      return;
    }

    if (event.kind !== 'partial_message' && window.agentRuntimeBlueprint?.applyEvent) {
      run.state = window.agentRuntimeBlueprint.applyEvent(run.state, event);
    } else if (event.kind !== 'partial_message') {
      run.state = run.state || { timeline: [] };
      run.state.timeline = [...(run.state.timeline || []), event];
    }

    const payload = event.payload || {};

    if (event.kind === 'status_text') {
      if (Object.prototype.hasOwnProperty.call(payload, 'deferAssistantMessage')) {
        run.deferAssistantMessage = !!payload.deferAssistantMessage;
        run.liveMessagePlacement = run.deferAssistantMessage ? 'tail' : 'after_run';
      }

      if (payload.processKey) {
        if (payload.processKey === 'thinking' && payload.processState === 'completed') {
          stopThinkingHints(runId);
        }
        upsertProcessItem(run, payload);
        renderRun(runId);
        return;
      }

      if (payload.message) {
        run.statusText = payload.message;
      }
      if (payload.note) {
        run.note = payload.note;
      }
      if (payload.stepKey) {
        run.stepStatuses[payload.stepKey] = 'completed';
      }
      if (payload.nextStepKey) {
        Object.keys(run.stepStatuses).forEach(key => {
          if (run.stepStatuses[key] === 'active') {
            run.stepStatuses[key] = 'pending';
          }
        });
        run.stepStatuses[payload.nextStepKey] = 'active';
      }
      renderRun(runId);
      return;
    }

    if (event.kind === 'tool_call_started' || event.kind === 'tool_call_completed') {
      if (payload.message) {
        run.statusText = payload.message;
      }
      renderRun(runId);
      return;
    }

    if (event.kind === 'partial_message') {
      if (run.deferAssistantMessage) {
        run.deferredAssistantMessage = payload.text || run.deferredAssistantMessage || '';
        return;
      }

      run.statusText = '';
      run.note = '';
      renderRun(runId);
      queueLiveAssistantMessage(runId, payload.text || '', payload.delta || '');
      return;
    }

    if (event.kind === 'message_completed') {
      if (run.deferAssistantMessage) {
        run.deferredAssistantMessage = payload.text || run.deferredAssistantMessage || '';
        return;
      }

      run.statusText = '';
      run.note = '';
      setLiveAssistantMessage(runId, payload.text || '', false);
      renderRun(runId);
      return;
    }

    if (event.kind === 'draft_ready') {
      run.finalOutput = payload.output || null;
      settleActiveProcessItem(
        run,
        item => /^draft_|^revision_/.test(item.key),
        formatActivityMessage(event)
      );
      const finalMessage = run.finalOutput?.user_message || '';
      if (finalMessage && !run.deferAssistantMessage) {
        setLiveAssistantMessage(runId, finalMessage, false);
      } else if (finalMessage) {
        run.deferredAssistantMessage = finalMessage;
      }
      renderRun(runId);
      return;
    }

    if (event.kind === 'verification_result') {
      settleActiveProcessItem(
        run,
        item => /^review_/.test(item.key),
        formatActivityMessage(event)
      );
      run.verification = {
        ...(run.verification || {}),
        post: payload.post || run.verification?.post,
        media: payload.media || run.verification?.media,
        brand: payload.brand || run.verification?.brand,
        automation: payload.automation || run.verification?.automation
      };
      renderRun(runId);
      return;
    }

    if (event.kind === 'approval_required') {
      run.approval = payload;
      renderRun(runId);
      return;
    }

    if (event.kind === 'run_failed') {
      upsertProcessItem(run, {
        processKey: 'failed',
        processState: 'failed',
        processKind: 'action',
        message: payload.message || 'The run stopped before anything changed.'
      });
      markRunFailed(runId, payload.message || 'The agent run failed.');
      return;
    }

    if (event.kind === 'run_completed') {
      run.completedAt = Date.now();
      if (payload.message) {
        run.statusText = payload.message;
      }
      renderRun(runId);
    }
  }

  async function streamDraft(payload) {
    const runId = payload.runId;
    if (!runId) {
      throw new Error('Missing agent run id.');
    }

    const controller = new AbortController();
    activeStreams[runId] = controller;

    const response = await fetch('/agent/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      delete activeStreams[runId];
      throw new Error(extractErrorMessage(data, 'Unable to start the agent run.'));
    }

    const reader = response.body?.getReader();
    if (!reader) {
      delete activeStreams[runId];
      throw new Error('Streaming is not supported in this browser.');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        buffer = buffer.replace(/\r\n/g, '\n');

        while (buffer.includes('\n\n')) {
          const boundary = buffer.indexOf('\n\n');
          const rawBlock = buffer.slice(0, boundary);
          buffer = buffer.slice(boundary + 2);
          const parsed = parseSseBlock(rawBlock);
          if (!parsed?.data) {
            continue;
          }
          applyStreamEvent(runId, parsed.data);
        }
      }

      if (buffer.trim()) {
        const parsed = parseSseBlock(buffer);
        if (parsed?.data) {
          applyStreamEvent(runId, parsed.data);
        }
      }

      return {
        output: runs[runId]?.finalOutput || null,
        verification: runs[runId]?.verification || {},
        approval: runs[runId]?.approval || null,
        streamedMessage: true
      };
    } catch (error) {
      if (controller.signal.aborted) {
        markRunCancelled(runId);
        throw new Error('Agent run aborted.');
      }
      throw error;
    } finally {
      delete activeStreams[runId];
      try {
        reader.releaseLock();
      } catch (error) {
        console.debug('Unable to release stream reader lock:', error);
      }
    }
  }

  function cancelRun(runId) {
    const controller = activeStreams[runId];
    if (controller) {
      controller.abort();
      delete activeStreams[runId];
    }
  }

  function clearRuns(surfaceKey = null) {
    Object.keys(activeStreams).forEach(runId => {
      if (surfaceKey && runs[runId]?.setup?.surfaceKey !== surfaceKey) {
        return;
      }
      try {
        activeStreams[runId].abort();
      } catch (error) {
        console.debug('Unable to abort active stream during clearRuns:', error);
      }
      delete activeStreams[runId];
    });

    Object.keys(runs).forEach(runId => {
      if (surfaceKey && runs[runId]?.setup?.surfaceKey !== surfaceKey) {
        return;
      }
      clearStreamLoop(runId);
      stopThinkingHints(runId);
      delete runs[runId];
    });
  }

  function dismissRunCard(runId) {
    $(`.agent-run-card[data-run-id="${runId}"]`).remove();
    updateEmptyState();
  }

  function findRunIdByPostId(postId) {
    return Object.keys(runs).find(runId => runs[runId].postId === postId) || null;
  }

  async function applyMediaPlan(runId) {
    const run = runs[runId];
    if (!run || !run.mediaPlan) {
      return;
    }

    run.mediaGenerating = true;
    setStatus(runId, 'Generating the approved visuals…');
    setNote(runId, 'The draft stays editable while the visuals are being generated.');
    setStepStatus(runId, 'apply_post', 'active');
    renderRun(runId);

    try {
      const data = await requestJson('/agent/apply-media-plan', { media: run.mediaPlan });
      const output = data.output || {};
      const mediaList = output.media || [];

      await loadMediaMetadata();
      loadWorkspace(actualWorkspaceId).then(() => {
        fillWorkspaceSettings(actualWorkspaceId);
      });

      const post = run.postId ? (aiPostsData[run.postId] || postsData[run.postId] || null) : null;
      let fileIndex = post?.files ? Object.keys(post.files).length : 0;

      for (const media of mediaList) {
        const docId = media.docId;
        const fileId = media.fileId;
        const url = media.url;

        if (post) {
          post.files = post.files || {};
          post.files[String(fileIndex)] = { url, fileId };
          fileIndex += 1;
        }

        const mediaElement = renderMediaPreview(docId);
        await addMessageToChat('ai-media', mediaElement, docId);

        pollMediaStatus(docId).then(() => {
          const mediaData = mediaMetadata[docId];
          const aiData = mediaData?.aiData || {};
          const taskId = aiData.taskId || '';
          const state = aiData.state || '';
          const failMsg = aiData.failMsg || '';

          $(`.ai-message[data-taskId="${taskId}"]`).attr('data-state', state);

          if (state !== 'generating' && state !== 'success') {
            $(`.ai-message[data-taskId="${taskId}"] .ai-media-generating-text`)
              .text((languageData?.ai?.mediaGenerationFailed || 'Media generation failed') + ': ' + failMsg)
              .css('color', 'red');
          }
        });
      }

      if (run.postId) {
        const mediaSlot = $(`.preview-media-slot[data-postId="${run.postId}"]`);
        renderPreviewMedias(run.postId, mediaSlot);
      }

      run.mediaGenerating = false;
      run.mediaPlan = null;
      run.mediaPlanRequested = false;
      setStatus(runId, 'Visual generation started. You can keep refining the draft while assets are being prepared.');
      setNote(runId, 'Nothing has been published. Use the draft card actions when you are ready.');
      renderRun(runId);
    } catch (error) {
      run.mediaGenerating = false;
      markRunFailed(runId, error?.message || 'Unable to generate visuals.');
    }
  }

  $(document).on('click', '.agent-open-post-editor', async function() {
    const postId = $(this).attr('data-post-id');
    if (!postId) {
      return;
    }

    const runId = findRunIdByPostId(postId);
    if (runId) {
      setStatus(runId, 'Opened in the editor.');
      setNote(runId, 'You can keep refining it there.');
    }

    await editPost(postId);
    await checkOptionsConformity(true);
    authorizeSchedule(null, 'postEditor');
  });

  $(document).on('click', '.agent-run-disclosure', function() {
    const runId = $(this).attr('data-run-id');
    if (!runId || !runs[runId]) {
      return;
    }

    runs[runId].processExpanded = !runs[runId].processExpanded;
    renderRun(runId);
  });

  $(document).on('click', '.insert-ai-element[element-type="ai-post"][data-action="edit"]', function() {
    const postId = $(this).attr('data-postId');
    const runId = findRunIdByPostId(postId);
    if (!runId) {
      return;
    }

    setStatus(runId, 'Editor opened for refinement.');
    setNote(runId, 'You can keep refining it there.');
  });

  $(document).on('click', '.agent-generate-media', async function() {
    const runId = $(this).attr('data-run-id');
    if (!runId) {
      return;
    }

    await applyMediaPlan(runId);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAgentSurface);
  } else {
    initializeAgentSurface();
  }

  function restoreRun(runSnapshot = {}) {
    const runId = runSnapshot.runId;
    const chatBody = getAgentActiveChatBody();
    if (!runId || !chatBody) {
      return null;
    }

    const plan = Array.isArray(runSnapshot?.meta?.plan) && runSnapshot.meta.plan.length
      ? runSnapshot.meta.plan
      : (localModePlans[runSnapshot.mode] || localModePlans.post_creation);

    runs[runId] = {
      state: {
        runId,
        mode: runSnapshot.mode || 'post_creation',
        plan,
        timeline: [],
        status: runSnapshot.status || 'completed',
        draft: null,
        approval: runSnapshot.approval || null,
        verification: runSnapshot.verification || {}
      },
      setup: {
        runId,
        mode: runSnapshot.mode || 'post_creation',
        plan,
        promptText: runSnapshot.prompt || '',
        generationId: runSnapshot.generationId || null,
        effort: runSnapshot.effort || 'normal',
        deferAssistantMessage: !!runSnapshot.deferAssistantMessage,
        liveMessagePlacement: runSnapshot.liveMessagePlacement || 'after_run',
        streamBootstrap: []
      },
      startedAt: runSnapshot.startedAt || Date.now(),
      completedAt: runSnapshot.completedAt || Date.now(),
      processExpanded: false,
      statusText: runSnapshot.statusText || '',
      note: runSnapshot.note || '',
      deferAssistantMessage: !!runSnapshot.deferAssistantMessage,
      deferredAssistantMessage: runSnapshot.deferredAssistantMessage || '',
      liveMessagePlacement: runSnapshot.liveMessagePlacement || 'after_run',
      processItems: Array.isArray(runSnapshot.processItems) ? runSnapshot.processItems : [],
      stepStatuses: runSnapshot.stepStatuses || {},
      verification: runSnapshot.verification || {},
      mediaPlan: runSnapshot.mediaPlan || null,
      mediaPlanRequested: !!runSnapshot.mediaPlanRequested,
      mediaGenerating: !!runSnapshot.mediaGenerating,
      postId: runSnapshot.postId || null,
      approval: runSnapshot.approval || null,
      finalOutput: runSnapshot.finalOutput || null,
      failed: !!runSnapshot.failed,
      thinkingHintQueue: [],
      thinkingHintTimer: null,
      currentThinkingHint: '',
      liveMessageId: runSnapshot.liveMessageId || null
    };

    const container = document.createElement('div');
    const animateClass = window.__agentChatRestoreAnimationsDisabled ? '' : ' animate-slide-in';
    container.className = `ai-message chat-div${animateClass} agent-run-card`;
    container.setAttribute('data-run-id', runId);
    chatBody.appendChild(container);
    renderRun(runId);
    return runId;
  }

  return {
    createLocalSetup,
    fetchSetup(payload) {
      return requestJson('/agent/setup', payload);
    },

    verifyPostDraft(post) {
      return requestJson('/agent/verify/post-draft', { post });
    },

    verifyMediaPlan(mediaPlan) {
      return requestJson('/agent/verify/media-plan', { media: flattenMediaPlan(mediaPlan) });
    },

    streamDraft,
    cancelRun,
    clearRuns,
    restoreRun,
    dismissRunCard,
    flattenMediaPlan,
    promoteLoaderToRunCard,
    setStatus,
    setNote,
    setStepStatus,
    completeStep,
    attachVerification,
    attachPost,
    attachMediaPlan,
    markRunFailed,
    markRunCancelled,
    applyStreamEvent,
    applyMediaPlan,
    queueThinkingHint,
    stopThinkingHints,
    findRunIdByPostId,
    waitForStreamToSettle,
    playDeferredAssistantMessage,
    initializeAgentSurface
  };
})();
