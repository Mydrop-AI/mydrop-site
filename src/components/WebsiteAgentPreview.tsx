import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import { marked } from "marked";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/vendor/mydrop-agent/css/chat-shell.css";
import "@/vendor/mydrop-agent/css/agent.css";
import agentSurfaceSource from "@/vendor/mydrop-agent/js/surface.js?raw";
import agentContractsSource from "@/vendor/mydrop-agent/js/contracts.js?raw";
import agentRuntimeSource from "@/vendor/mydrop-agent/js/runtime.js?raw";
import agentChatSource from "@/vendor/mydrop-agent/js/chat.js?raw";
import {
  autoResizePromptElement,
  createAiErrorMessageHtml,
  createBrandArtifactMessageHtml,
  createLoaderMessageHtml,
  createNextStepsHtml,
  createPostArtifactMessageHtml,
  createSourcesMessageHtml,
  createUserMessageHtml,
  escapeHtml,
  generateUniqueId,
  installPublicPreviewMarkdownRenderer,
  mergeAiArtifactMediaPlans,
  normalizeAiArtifactBundles,
  promptLikelyNeedsArtifact,
  sanitizeAiNextSteps,
} from "@/vendor/mydrop-agent/js/publicPreviewShared.js";
import "./WebsiteAgentPreview.css";

type PreviewConversationTurn = {
  assistantText?: string;
  messageId: string;
  output?: PreviewOutput | null;
  userText: string;
};

type PreviewOutput = {
  user_message?: string;
  post?: Record<string, unknown>;
  brand?: Record<string, unknown>;
  media?: {
    images?: Array<Record<string, unknown>>;
    videos?: Array<Record<string, unknown>>;
  };
  artifacts?: Array<Record<string, unknown>>;
  next_steps?: string[];
  web_search_calls?: Array<{
    action?: {
      sources?: Array<{
        url?: string;
      }>;
    };
  }>;
};

type StreamEvent = {
  kind?: string;
  payload?: Record<string, unknown>;
};

type ArtifactBundle = {
  post?: Record<string, unknown>;
  brand?: Record<string, unknown>;
  media?: {
    images?: Array<Record<string, unknown>>;
    videos?: Array<Record<string, unknown>>;
  };
};

type PreviewMediaPlan = {
  images?: Array<Record<string, unknown>>;
  videos?: Array<Record<string, unknown>>;
};

type PublicPreviewMediaItem = {
  itemId?: string;
  kind?: string;
  instruction?: string;
  format?: string;
  quality?: string;
  duration_second?: string;
  status?: string;
  state?: string;
  url?: string;
  error?: string;
};

type PlannedPreviewMediaItem = {
  format?: string;
  instruction?: string;
  kind: "image" | "video";
  quality?: string;
  runId: string;
  token: string;
  duration_second?: string;
};

type ActiveRunState = {
  controller: AbortController;
  messageId: string;
  runId: string;
  scrollIntervalId: number | null;
};

type AgentWindow = Window & {
  $?: typeof $;
  jQuery?: typeof $;
  agentChatShell?: {
    mountSurface: (target: Element) => Element | null;
  };
  agentChatUI?: {
    applyStreamEvent: (runId: string, event: StreamEvent) => void;
    cancelRun: (runId: string) => void;
    clearRuns: (surfaceKey?: string | null) => void;
    createLocalSetup: (payload: Record<string, unknown>) => {
      runId: string;
      generationId?: string | null;
    };
    initializeAgentSurface: () => void;
    markRunCancelled: (runId: string) => void;
    markRunFailed: (runId: string, error: string) => void;
    playDeferredAssistantMessage: (runId: string, text: string) => void;
    promoteLoaderToRunCard: (setup: Record<string, unknown>) => string | null;
    setNote: (runId: string, note: string) => void;
    setStatus: (runId: string, status: string) => void;
    attachMediaPlan: (
      runId: string,
      mediaPlan: { images?: Array<Record<string, unknown>>; videos?: Array<Record<string, unknown>> },
      options?: { requested?: boolean },
    ) => void;
    waitForStreamToSettle: (runId: string, extraDelay?: number) => Promise<void>;
  };
  agentContracts?: {
    modes?: {
      postCreation?: string;
    };
  };
  marked?: typeof marked;
  __websiteAgentRuntimeLoaded?: boolean;
};

const PREVIEW_PLACEHOLDER = "Try Mydrop AI";
const PREVIEW_APP_CTA_URL = "https://app.mydropai.com/register";
const AGENT_RUNTIME_SOURCES = [
  ["agent-surface.js", agentSurfaceSource],
  ["agent-contracts.js", agentContractsSource],
  ["agent-runtime.js", agentRuntimeSource],
  ["agent-chat.js", agentChatSource],
] as const;

const SEND_ICON_MARKUP = `
  <svg class="ai-chat-send-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C12.2652 3 12.5196 3.10536 12.7071 3.29289L19.7071 10.2929C20.0976 10.6834 20.0976 11.3166 19.7071 11.7071C19.3166 12.0976 18.6834 12.0976 18.2929 11.7071L13 6.41421V20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20V6.41421L5.70711 11.7071C5.31658 12.0976 4.68342 12.0976 4.29289 11.7071C3.90237 11.3166 3.90237 10.6834 4.29289 10.2929L11.2929 3.29289C11.4804 3.10536 11.7348 3 12 3Z" fill="currentColor"></path>
  </svg>
`;

const GENERATING_ICON_MARKUP = `
  <svg class="ai-chat-generating-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" stroke="currentColor" stroke-width="1.5"/>
  </svg>
`;

const TOOLS_INFO_MARKUP = `
  <div class="attachment-section animate-slide-in ai-tools-info-section website-agent-tools" data-type="ai-tools-info">
    <button type="button" class="ai-tools-info-trigger" aria-expanded="false">
      <span class="ai-tools-info-symbol">?</span>
    </button>
    <div class="ai-tools-info-popup">
      <p class="ai-tools-info-title">What this preview can do</p>
      <div class="ai-tools-info-list">
        <p>Create a first social post draft from one sentence.</p>
        <p>Suggest a light brand direction when you ask for one.</p>
        <p>Propose media ideas and visual prompts.</p>
        <p>Keep short context from the current preview chat.</p>
      </div>
      <p class="ai-tools-info-tip">The website preview is read-only. Open the app to keep or edit results.</p>
    </div>
  </div>
`;

function renderWebsiteHomeSurface() {
  return `
    <div class="ai-chat-main-div ai-chat-surface agent-home-chat-surface website-home-chat-surface" data-ai-chat-surface="home">
      <div id="ai-chat-body" class="ai-chat-body app-scrollbar"></div>
      <div class="chat-footer">
        <div class="chat-footer-div">
          <div class="website-agent-upgrade-cta" aria-hidden="true">
            <div class="website-agent-upgrade-copy">
              <p class="website-agent-upgrade-title">This is a preview.</p>
              <p class="website-agent-upgrade-text">Get full power in the app and make it work on your own data.</p>
            </div>
            <a class="website-agent-upgrade-button" href="${PREVIEW_APP_CTA_URL}" target="_blank" rel="noreferrer">
              Register
            </a>
          </div>
          <div class="input-area ai-chat-input-area website-agent-input-row">
            <div class="ai-default-prompt website-agent-prompt-wrap">
              <textarea data-value="default" class="ai-prompt auto-resize app-scrollbar" maxlength="50000"></textarea>
            </div>
            <div class="attachments-tab website-agent-inline-actions">
              ${TOOLS_INFO_MARKUP}
              <button class="ai-chat-send-button">
                ${SEND_ICON_MARKUP}
                ${GENERATING_ICON_MARKUP}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `.trim();
}

function getPublicAgentBaseUrl() {
  const configuredBase = String(import.meta.env.VITE_MYDROP_APP_URL || "")
    .trim()
    .replace(/\/+$/, "");

  if (configuredBase) {
    return configuredBase;
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "mydropai.com" || host === "www.mydropai.com") {
      return "https://app.mydropai.com";
    }

    if (host === "127.0.0.1" || host === "localhost" || host === "0.0.0.0") {
      return "http://127.0.0.1:5000";
    }
  }

  return "https://app.mydropai.com";
}

function parseSseBlock(block: string): StreamEvent | null {
  const dataLines = block
    .split(/\r?\n/)
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart());

  if (!dataLines.length) {
    return null;
  }

  try {
    return JSON.parse(dataLines.join("\n")) as StreamEvent;
  } catch {
    return null;
  }
}

function runGlobalScript(source: string, sourceName: string) {
  const wrappedSource = `${source}\n//# sourceURL=${sourceName}`;
  new Function(wrappedSource)();
}

function ensureAgentRuntimeLoaded() {
  const globalWindow = window as AgentWindow;
  globalWindow.$ = $;
  globalWindow.jQuery = $;
  globalWindow.marked = marked;
  installPublicPreviewMarkdownRenderer(marked);

  if (globalWindow.__websiteAgentRuntimeLoaded) {
    return;
  }

  AGENT_RUNTIME_SOURCES.forEach(([sourceName, source]) => {
    runGlobalScript(source, sourceName);
  });

  globalWindow.__websiteAgentRuntimeLoaded = true;
}

function formatTranscript(turns: PreviewConversationTurn[]) {
  return turns
    .slice(-8)
    .flatMap((turn) => {
      const transcriptEntries = [`User: ${turn.userText}`];
      if (String(turn.assistantText || "").trim()) {
        transcriptEntries.push(`Assistant: ${String(turn.assistantText || "").trim()}`);
      }
      return transcriptEntries;
    })
    .join("\n\n");
}

function getLatestPreviewOutput(turns: PreviewConversationTurn[]) {
  for (let index = turns.length - 1; index >= 0; index -= 1) {
    const output = turns[index]?.output || null;
    if (output && Object.keys(output).length > 0) {
      return output;
    }
  }
  return null;
}

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function copyTextToClipboard(value: string) {
  const text = String(value || "").trim();
  if (!text) {
    return false;
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "readonly");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } finally {
    textarea.remove();
  }

  return copied;
}

function createWebsitePreviewMediaMessageHtml(item: PublicPreviewMediaItem) {
  const mediaUrl = String(item.url || "").trim();
  const mediaKind = String(item.kind || "").trim().toLowerCase() === "video" ? "Video" : "Image";
  const instruction = String(item.instruction || "").trim();
  const formatValue = String(item.format || "").trim();
  const qualityValue = String(item.quality || "").trim();
  const durationValue = String(item.duration_second || "").trim();
  const itemId = String(item.itemId || generateUniqueId("preview_media")).trim();
  const previewMedia = mediaKind === "Video"
    ? `
      <div class="preview-media-slot" data-type="chat">
        <div class="calendar-media-preview">
          <video controls playsinline preload="metadata">
            <source src="${escapeHtml(mediaUrl)}" type="video/mp4">
          </video>
        </div>
      </div>
    `
    : `
      <div class="preview-media-slot" data-type="chat">
        <div class="calendar-media-preview">
          <img src="${escapeHtml(mediaUrl)}" alt="${escapeHtml(instruction || "Temporary generated media")}" loading="lazy">
        </div>
      </div>
    `;

  return `
    <div class="ai-message chat-div chat-element" element-type="ai-media-preview" data-preview-item-id="${escapeHtml(itemId)}" data-preview-url="${escapeHtml(mediaUrl)}">
      ${previewMedia}
      <p class="ai-media-generating-text">Temporary preview generated. It is not saved to your workspace.</p>
      <div class="ai-media-infos">
        <p><strong>Type:</strong> ${escapeHtml(mediaKind)}</p>
        ${instruction ? `<p><strong>Prompt:</strong> ${escapeHtml(instruction)}</p>` : ""}
        ${formatValue ? `<p><strong>Shape:</strong> ${escapeHtml(formatValue)}</p>` : ""}
        ${durationValue && mediaKind === "Video" ? `<p><strong>Duration:</strong> ${escapeHtml(durationValue)}s</p>` : ""}
        ${qualityValue ? `<p><strong>Quality:</strong> ${escapeHtml(qualityValue)}</p>` : ""}
      </div>
      <div class="ai-message-post-actions app-scrollbar">
        <div class="insert-ai-element hover-button" data-action="downloadPreviewMedia" element-type="ai-media-preview" data-preview-url="${escapeHtml(mediaUrl)}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
            <path d="M12 3V14M12 14L7.5 9.5M12 14L16.5 9.5M4 16.5V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V16.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p>Download</p>
        </div>
        <div class="insert-ai-element hover-button" data-action="openPreviewMediaApp" element-type="ai-media-preview">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
            <path d="M3 12H21M21 12L15 6M21 12L15 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p>Open in app</p>
        </div>
      </div>
    </div>
  `.trim();
}

function flattenPreviewMediaPlan(runId: string, mediaPlan: PreviewMediaPlan): PlannedPreviewMediaItem[] {
  const images = Array.isArray(mediaPlan?.images) ? mediaPlan.images : [];
  const videos = Array.isArray(mediaPlan?.videos) ? mediaPlan.videos : [];

  return [
    ...images.map((item, index) => ({
      runId,
      token: `${runId}-image-${index}`,
      kind: "image" as const,
      instruction: String(item?.instruction || "").trim(),
      format: String(item?.format || item?.aspect_ratio || "").trim(),
      quality: String(item?.quality || item?.size || "").trim(),
      duration_second: "",
    })),
    ...videos.map((item, index) => ({
      runId,
      token: `${runId}-video-${index}`,
      kind: "video" as const,
      instruction: String(item?.instruction || "").trim(),
      format: String(item?.format || item?.aspect_ratio || "").trim(),
      quality: String(item?.quality || item?.size || "").trim(),
      duration_second: String(item?.duration_second || item?.duration || item?.n_frames || "").trim(),
    })),
  ];
}

function createWebsitePreviewMediaLoadingHtml(item: PlannedPreviewMediaItem) {
  const mediaKind = item.kind === "video" ? "Video" : "Image";

  return `
    <div class="ai-message chat-div chat-element website-preview-media-loading" element-type="ai-media-preview-loading" data-preview-loading-token="${escapeHtml(item.token)}" data-run-id="${escapeHtml(item.runId)}">
      <div class="preview-media-slot" data-type="chat">
        <div class="calendar-media-preview preview-media-skeleton" aria-hidden="true">
          <div class="preview-media-shimmer"></div>
        </div>
      </div>
      <p class="ai-media-generating-text">Generating temporary ${escapeHtml(mediaKind.toLowerCase())} preview…</p>
      <div class="ai-media-infos">
        <p><strong>Type:</strong> ${escapeHtml(mediaKind)}</p>
        ${item.instruction ? `<p><strong>Prompt:</strong> ${escapeHtml(item.instruction)}</p>` : ""}
        ${item.format ? `<p><strong>Shape:</strong> ${escapeHtml(item.format)}</p>` : ""}
        ${item.duration_second && item.kind === "video" ? `<p><strong>Duration:</strong> ${escapeHtml(item.duration_second)}s</p>` : ""}
        ${item.quality ? `<p><strong>Quality:</strong> ${escapeHtml(item.quality)}</p>` : ""}
      </div>
    </div>
  `.trim();
}

function buildContextItems(turns: PreviewConversationTurn[]) {
  const context: Array<{ title: string; value: string }> = [];
  const transcript = formatTranscript(turns);

  if (transcript.trim()) {
    context.push({
      title: "Previous discussion between You and User",
      value: `${transcript}\n\nEND OF DISCUSSION.`,
    });
  }

  const latestOutput = getLatestPreviewOutput(turns);
  const bundles = normalizeAiArtifactBundles(latestOutput || {}) as ArtifactBundle[];
  const latestPost = bundles.find((bundle) => bundle?.post && Object.keys(bundle.post || {}).length)?.post;
  const latestBrand = bundles.find((bundle) => bundle?.brand && Object.keys(bundle.brand || {}).length)?.brand;
  const latestMedia = (latestOutput?.media?.images?.length || latestOutput?.media?.videos?.length)
    ? latestOutput.media
    : mergeAiArtifactMediaPlans(bundles);

  if (latestPost && Object.keys(latestPost).length) {
    context.push({
      title: "Post you created here in chat",
      value: JSON.stringify(latestPost, null, 2),
    });
  }

  if (latestBrand && Object.keys(latestBrand).length) {
    context.push({
      title: "Brand draft you created here in chat",
      value: JSON.stringify(latestBrand, null, 2),
    });
  }

  if ((latestMedia?.images?.length || 0) + (latestMedia?.videos?.length || 0) > 0) {
    context.push({
      title: "Media you created here in chat",
      value: JSON.stringify(latestMedia, null, 2),
    });
  }

  return context;
}

function extractSources(output: PreviewOutput | null) {
  return (output?.web_search_calls || [])
    .flatMap((call) => call?.action?.sources || [])
    .filter((source) => String(source?.url || "").trim());
}

function openPreviewCta() {
  window.open(PREVIEW_APP_CTA_URL, "_blank", "noopener,noreferrer");
}

type WebsiteAgentPreviewProps = {
  quickActions?: Array<{ cta: string; prompt: string }>;
};

export default function WebsiteAgentPreview({ quickActions = [] }: WebsiteAgentPreviewProps) {
  const [mediaViewer, setMediaViewer] = useState<{ kind: "image" | "video"; url: string } | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const resetButtonRef = useRef<HTMLButtonElement | null>(null);
  const shellTargetRef = useRef<HTMLDivElement | null>(null);
  const turnsRef = useRef<PreviewConversationTurn[]>([]);
  const activeRunRef = useRef<ActiveRunState | null>(null);
  const mediaPlansRef = useRef<Map<string, PreviewMediaPlan>>(new Map());
  const activeMediaRunIdsRef = useRef<Set<string>>(new Set());
  const previewVersionRef = useRef(0);
  const submitPromptRef = useRef<((prompt: string) => void) | null>(null);

  useEffect(() => {
    const previewRoot = rootRef.current;
    const resetButton = resetButtonRef.current;
    const shellTarget = shellTargetRef.current;
    const heroSection = previewRoot?.closest(".hero-full") as HTMLElement | null;
    if (!shellTarget) {
      return undefined;
    }

    ensureAgentRuntimeLoaded();

    const globalWindow = window as AgentWindow;
    shellTarget.innerHTML = renderWebsiteHomeSurface();
    shellTarget.setAttribute("data-agent-chat-mounted", "true");
    const surface = shellTarget.querySelector(".ai-chat-surface") as HTMLElement | null;
    if (!surface) {
      return undefined;
    }

    globalWindow.agentChatUI?.clearRuns?.("home");
    globalWindow.agentChatUI?.initializeAgentSurface?.();

    const chatBody = surface.querySelector(".ai-chat-body") as HTMLDivElement | null;
    const promptInput = surface.querySelector(".ai-prompt[data-value='default']") as HTMLTextAreaElement | null;
    const promptWrapper = surface.querySelector(".ai-default-prompt") as HTMLDivElement | null;
    const sendButton = surface.querySelector(".ai-chat-send-button") as HTMLButtonElement | null;
    const toolsInfoSection = surface.querySelector(".ai-tools-info-section") as HTMLDivElement | null;
    const toolsInfoTrigger = surface.querySelector(".ai-tools-info-trigger") as HTMLButtonElement | null;
    const upgradeCta = surface.querySelector(".website-agent-upgrade-cta") as HTMLDivElement | null;

    if (!chatBody || !promptInput || !promptWrapper || !sendButton) {
      return undefined;
    }

    const isEmbedded = window.top !== window.self;
    const updatePreviewChrome = () => {
      const hasContent = Boolean(
        chatBody.querySelector(".user-message, .ai-message, .agent-run-card, .ai-next-steps, .ai-sources"),
      );
      const shouldShowUpgradeCta = turnsRef.current.length >= 2;
      surface.classList.toggle("agent-chat-has-content", hasContent);
      previewRoot?.classList.toggle("is-home-chat-active", hasContent);
      previewRoot?.classList.toggle("website-agent-preview-has-content", hasContent);
      upgradeCta?.classList.toggle("visible", shouldShowUpgradeCta);
      upgradeCta?.setAttribute("aria-hidden", shouldShowUpgradeCta ? "false" : "true");
      heroSection?.classList.toggle("is-home-chat-active", hasContent);
      if (resetButton) {
        resetButton.disabled = !hasContent;
        resetButton.setAttribute("aria-hidden", hasContent ? "false" : "true");
      }
    };

    const clearPreviewMessages = () => {
      chatBody
        .querySelectorAll(".user-message, .ai-message, .agent-run-card, .ai-next-steps, .ai-sources")
        .forEach((node) => node.remove());
      updatePreviewChrome();
    };

    const clearRunScrollInterval = () => {
      const activeRun = activeRunRef.current;
      if (activeRun?.scrollIntervalId) {
        window.clearInterval(activeRun.scrollIntervalId);
      }
      if (activeRun) {
        activeRun.scrollIntervalId = null;
      }
    };

    const invalidatePreviewMediaState = () => {
      previewVersionRef.current += 1;
      activeMediaRunIdsRef.current.clear();
      mediaPlansRef.current.clear();
      chatBody.querySelectorAll("[data-preview-loading-token]").forEach((node) => node.remove());
    };

    const insertGeneratedPreviewMedia = (item: PublicPreviewMediaItem) => {
      const itemId = String(item.itemId || "").trim();
      const mediaUrl = String(item.url || "").trim();
      if (!itemId || !mediaUrl) {
        return false;
      }

      if (chatBody.querySelector(`[data-preview-item-id="${itemId}"]`)) {
        return false;
      }

      chatBody.querySelectorAll("[data-preview-loading-token]").forEach((node) => node.remove());
      chatBody.insertAdjacentHTML("beforeend", createWebsitePreviewMediaMessageHtml(item));
      updatePreviewChrome();
      scrollChatToBottom();
      return true;
    };

    const insertPreviewMediaPlaceholders = (runId: string, mediaPlan: PreviewMediaPlan) => {
      chatBody.querySelectorAll(`[data-run-id="${runId}"][data-preview-loading-token]`).forEach((node) => node.remove());
      flattenPreviewMediaPlan(runId, mediaPlan).forEach((item) => {
        chatBody.insertAdjacentHTML("beforeend", createWebsitePreviewMediaLoadingHtml(item));
      });
      updatePreviewChrome();
      scrollChatToBottom();
    };

    const scrollChatToBottom = () => {
      chatBody.scrollTo({
        top: chatBody.scrollHeight,
        behavior: "smooth",
      });
    };

    const setRunMediaButtonVisualState = (runId: string, label: string, disabled: boolean) => {
      const button = chatBody.querySelector(`.agent-generate-media[data-run-id="${runId}"]`) as HTMLButtonElement | null;
      if (!button) {
        return;
      }

      button.textContent = label;
      button.disabled = disabled;
    };

    const setSendGenerating = (isGenerating: boolean) => {
      sendButton.classList.toggle("generating", isGenerating);
      sendButton.setAttribute("aria-busy", isGenerating ? "true" : "false");
    };

    const updateSendDisabledState = () => {
      const shouldDisable = isEmbedded || (!promptInput.value.trim() && !sendButton.classList.contains("generating"));
      sendButton.classList.toggle("disabled", shouldDisable);
      sendButton.setAttribute("aria-disabled", shouldDisable ? "true" : "false");
    };

    const setPromptValue = (value: string) => {
      promptInput.value = value;
      autoResizePromptElement(promptInput);
      updateSendDisabledState();
    };

    const flashPromptError = () => {
      promptWrapper.classList.add("website-agent-input-error");
      window.setTimeout(() => {
        promptWrapper.classList.remove("website-agent-input-error");
      }, 800);
    };

    const finalizeRunUi = () => {
      clearRunScrollInterval();
      activeRunRef.current = null;
      setSendGenerating(false);
      updateSendDisabledState();
      updatePreviewChrome();
    };

    const cancelActiveRun = () => {
      const activeRun = activeRunRef.current;
      if (!activeRun) {
        return;
      }

      activeRun.controller.abort();
      globalWindow.agentChatUI?.cancelRun?.(activeRun.runId);
    };

    const resetPreviewChat = () => {
      cancelActiveRun();
      finalizeRunUi();
      globalWindow.agentChatUI?.clearRuns?.("home");
      invalidatePreviewMediaState();
      turnsRef.current = [];
      clearPreviewMessages();
      setPromptValue("");
      surface.classList.remove("agent-chat-has-content");
      updatePreviewChrome();
    };

    const trimConversationFromMessage = (messageId: string) => {
      if (!messageId) {
        return false;
      }

      const messageTurnIndex = turnsRef.current.findIndex((turn) => turn.messageId === messageId);
      const userMessageNode = chatBody.querySelector(
        `.user-message .chat-element.chat-text[data-id="${messageId}"]`,
      )?.closest(".user-message");

      if (messageTurnIndex === -1 || !(userMessageNode instanceof HTMLElement)) {
        return false;
      }

      cancelActiveRun();
      finalizeRunUi();
      globalWindow.agentChatUI?.clearRuns?.("home");
      invalidatePreviewMediaState();

      let currentNode: Element | null = userMessageNode;
      while (currentNode) {
        const nextNode: Element | null = currentNode.nextElementSibling;
        currentNode.remove();
        currentNode = nextNode;
      }

      turnsRef.current = turnsRef.current.slice(0, messageTurnIndex);
      updatePreviewChrome();
      return true;
    };

    const generatePreviewMedia = async (runId: string) => {
      const mediaPlan = mediaPlansRef.current.get(runId);
      if (!runId || !mediaPlan || activeMediaRunIdsRef.current.has(runId) || isEmbedded) {
        return;
      }

      activeMediaRunIdsRef.current.add(runId);
      const generationVersion = previewVersionRef.current;
      globalWindow.agentChatUI?.setStatus?.(runId, "Generating visuals…");
      globalWindow.agentChatUI?.setNote?.(runId, "These previews are temporary and are not saved to your workspace.");
      setRunMediaButtonVisualState(runId, "Generating visuals…", true);
      insertPreviewMediaPlaceholders(runId, mediaPlan);

      try {
        const startResponse = await fetch(`${getPublicAgentBaseUrl()}/agent/public/media/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ media: mediaPlan }),
        });

        if (!startResponse.ok) {
          const errorData = (await startResponse.json().catch(() => ({}))) as { error?: string };
          throw new Error(errorData.error || "Unable to start temporary media generation.");
        }

        const startData = (await startResponse.json()) as { previewToken?: string };
        const previewToken = String(startData.previewToken || "").trim();
        if (!previewToken) {
          throw new Error("The temporary media preview could not start.");
        }

        let pollCount = 0;
        while (pollCount < 120) {
          if (previewVersionRef.current !== generationVersion) {
            return;
          }

          const statusResponse = await fetch(`${getPublicAgentBaseUrl()}/agent/public/media/status`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ previewToken }),
          });

          if (!statusResponse.ok) {
            const errorData = (await statusResponse.json().catch(() => ({}))) as { error?: string };
            throw new Error(errorData.error || "Unable to fetch temporary media status.");
          }

          const statusData = (await statusResponse.json()) as {
            status?: string;
            items?: PublicPreviewMediaItem[];
          };
          const items = Array.isArray(statusData.items) ? statusData.items : [];
          let insertedAnyItem = false;

          items
            .filter((item) => String(item.status || "").trim() === "success" && String(item.url || "").trim())
            .forEach((item) => {
              insertedAnyItem = insertGeneratedPreviewMedia(item) || insertedAnyItem;
            });

          if (statusData.status === "success" || statusData.status === "partial") {
            chatBody.querySelectorAll(`[data-run-id="${runId}"][data-preview-loading-token]`).forEach((node) => node.remove());
            globalWindow.agentChatUI?.setStatus?.(runId, insertedAnyItem ? "Visuals ready below." : "Visuals are ready.");
            globalWindow.agentChatUI?.setNote?.(runId, "They use expiring preview URLs and are not saved to your workspace.");
            setRunMediaButtonVisualState(runId, "Visuals ready", true);
            return;
          }

          if (statusData.status === "fail") {
            const failureMessage = items.find((item) => String(item.error || "").trim())?.error || "Temporary media generation failed.";
            throw new Error(failureMessage);
          }

          pollCount += 1;
          await wait(3000);
        }

        throw new Error("Temporary media generation timed out.");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Temporary media generation failed.";
        chatBody.querySelectorAll(`[data-run-id="${runId}"][data-preview-loading-token]`).forEach((node) => node.remove());
        globalWindow.agentChatUI?.setStatus?.(runId, "Temporary media generation failed.");
        globalWindow.agentChatUI?.setNote?.(runId, "Open the app if you want saved visual generation.");
        setRunMediaButtonVisualState(runId, "Try generating visuals again", false);
        chatBody.insertAdjacentHTML("beforeend", createAiErrorMessageHtml(message));
        updatePreviewChrome();
        scrollChatToBottom();
      } finally {
        activeMediaRunIdsRef.current.delete(runId);
      }
    };

    const submitPrompt = async (rawPrompt?: string, options: { messageId?: string } = {}) => {
      const promptText = String(rawPrompt ?? promptInput.value ?? "").trim();
      if (!promptText) {
        flashPromptError();
        return;
      }

      if (activeRunRef.current) {
        return;
      }

      if (isEmbedded) {
        return;
      }

      const messageId = options.messageId || generateUniqueId("user");
      chatBody.querySelectorAll(".ai-next-steps").forEach((node) => node.remove());
      chatBody.insertAdjacentHTML("beforeend", createUserMessageHtml(promptText, { messageId }));
      chatBody.insertAdjacentHTML("beforeend", createLoaderMessageHtml());
      turnsRef.current = [
        ...turnsRef.current,
        {
          assistantText: "",
          messageId,
          output: null,
          userText: promptText,
        },
      ];

      setPromptValue("");
      setSendGenerating(true);
      updatePreviewChrome();
      scrollChatToBottom();

      const shouldDeferAssistantMessage = promptLikelyNeedsArtifact(promptText);
      const effort = "normal";
      const setup = globalWindow.agentChatUI?.createLocalSetup({
        mode: globalWindow.agentContracts?.modes?.postCreation || "post_creation",
        promptText,
        generationId: generateUniqueId("generation"),
        effort,
        deferAssistantMessage: shouldDeferAssistantMessage,
        surfaceKey: "home",
      });

      const runId = setup ? globalWindow.agentChatUI?.promoteLoaderToRunCard(setup as Record<string, unknown>) : null;
      if (!setup || !runId) {
        finalizeRunUi();
        chatBody.insertAdjacentHTML(
          "beforeend",
          createAiErrorMessageHtml("The public website preview could not start the agent run."),
        );
        scrollChatToBottom();
        return;
      }

      globalWindow.agentChatUI?.setStatus?.(runId, "Thinking…");
      globalWindow.agentChatUI?.setNote?.(runId, "");

      const controller = new AbortController();
      activeRunRef.current = {
        controller,
        messageId,
        runId,
        scrollIntervalId: window.setInterval(scrollChatToBottom, 150),
      };

      const contextItems = buildContextItems(turnsRef.current.slice(0, -1));
      const payload = {
        prompt: promptText,
        text_context: contextItems,
        runId,
        generationId: setup.generationId || generateUniqueId("generation"),
        effort,
        search_context_size: "low",
      };

      let output: PreviewOutput | null = null;
      let completedAssistantText = "";
      let latestPartialAssistantText = "";
      let backendDeferredAssistant = shouldDeferAssistantMessage;

      try {
        const response = await fetch(`${getPublicAgentBaseUrl()}/agent/public/chat/stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = (await response.json().catch(() => ({}))) as { error?: string };
          throw new Error(errorData.error || "Unable to start the website preview.");
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("Streaming is not supported in this browser.");
        }

        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              break;
            }

            buffer += decoder.decode(value, { stream: true });
            buffer = buffer.replace(/\r\n/g, "\n");

            while (buffer.includes("\n\n")) {
              const boundary = buffer.indexOf("\n\n");
              const rawBlock = buffer.slice(0, boundary);
              buffer = buffer.slice(boundary + 2);
              const event = parseSseBlock(rawBlock);
              if (!event?.kind) {
                continue;
              }

              globalWindow.agentChatUI?.applyStreamEvent?.(runId, event);

              if (event.kind === "status_text" && typeof event.payload?.deferAssistantMessage === "boolean") {
                backendDeferredAssistant = Boolean(event.payload.deferAssistantMessage);
              }

              if (event.kind === "partial_message") {
                latestPartialAssistantText = String(event.payload?.text || latestPartialAssistantText || "");
              }

              if (event.kind === "draft_ready") {
                output = (event.payload?.output || null) as PreviewOutput | null;
              }

              if (event.kind === "message_completed") {
                completedAssistantText = String(event.payload?.text || "");
              }
            }
          }

          if (buffer.trim()) {
            const event = parseSseBlock(buffer);
            if (event?.kind) {
              globalWindow.agentChatUI?.applyStreamEvent?.(runId, event);

              if (event.kind === "status_text" && typeof event.payload?.deferAssistantMessage === "boolean") {
                backendDeferredAssistant = Boolean(event.payload.deferAssistantMessage);
              }

              if (event.kind === "partial_message") {
                latestPartialAssistantText = String(event.payload?.text || latestPartialAssistantText || "");
              }

              if (event.kind === "draft_ready") {
                output = (event.payload?.output || null) as PreviewOutput | null;
              }

              if (event.kind === "message_completed") {
                completedAssistantText = String(event.payload?.text || "");
              }
            }
          }
        } finally {
          try {
            reader.releaseLock();
          } catch {
            // no-op
          }
        }

        const artifactBundles = normalizeAiArtifactBundles(output || {}) as ArtifactBundle[];
        const postDrafts = artifactBundles
          .map((bundle: ArtifactBundle) => bundle.post || {})
          .filter((postDraft: Record<string, unknown>) => Object.keys(postDraft || {}).length > 0);
        const brandDrafts = artifactBundles
          .map((bundle: ArtifactBundle) => bundle.brand || {})
          .filter((brandDraft: Record<string, unknown>) => Object.keys(brandDraft || {}).length > 0);
        const mergedMediaPlan = output?.media?.images?.length || output?.media?.videos?.length
          ? output.media
          : mergeAiArtifactMediaPlans(artifactBundles);
        const hasMediaPlan = (mergedMediaPlan?.images?.length || 0) + (mergedMediaPlan?.videos?.length || 0) > 0;
        const sources = extractSources(output);
        const nextSteps = sanitizeAiNextSteps(output?.next_steps || []);
        const assistantText = String(output?.user_message || completedAssistantText || latestPartialAssistantText || "").trim();
        const shouldPlayDeferredAssistant = backendDeferredAssistant || shouldDeferAssistantMessage || postDrafts.length > 0 || brandDrafts.length > 0 || hasMediaPlan || sources.length > 0;

        if (hasMediaPlan) {
          mediaPlansRef.current.set(runId, mergedMediaPlan as PreviewMediaPlan);
          globalWindow.agentChatUI?.attachMediaPlan?.(runId, mergedMediaPlan, { requested: true });
        }

        postDrafts.forEach((postDraft: Record<string, unknown>) => {
          chatBody.insertAdjacentHTML("beforeend", createPostArtifactMessageHtml(postDraft));
        });

        brandDrafts.forEach((brandDraft: Record<string, unknown>) => {
          chatBody.insertAdjacentHTML("beforeend", createBrandArtifactMessageHtml(brandDraft));
        });

        if (sources.length) {
          chatBody.insertAdjacentHTML("beforeend", createSourcesMessageHtml(sources));
        }

        if (shouldPlayDeferredAssistant) {
          globalWindow.agentChatUI?.playDeferredAssistantMessage?.(runId, assistantText);
          await globalWindow.agentChatUI?.waitForStreamToSettle?.(runId, 80);
        } else {
          await globalWindow.agentChatUI?.waitForStreamToSettle?.(runId, 80);
        }

        const turnIndex = turnsRef.current.findIndex((turn) => turn.messageId === messageId);
        if (turnIndex !== -1) {
          turnsRef.current[turnIndex] = {
            ...turnsRef.current[turnIndex],
            assistantText,
            output,
          };
        }

        if (nextSteps.length) {
          chatBody.insertAdjacentHTML("beforeend", createNextStepsHtml(nextSteps));
        }

        updatePreviewChrome();
        scrollChatToBottom();
      } catch (error) {
        if (controller.signal.aborted) {
          globalWindow.agentChatUI?.markRunCancelled?.(runId);
        } else {
          const message = error instanceof Error ? error.message : "The public website preview failed.";
          globalWindow.agentChatUI?.markRunFailed?.(runId, message);
        }
      } finally {
        finalizeRunUi();
      }
    };

    submitPromptRef.current = (prompt: string) => {
      void submitPrompt(prompt);
    };

    invalidatePreviewMediaState();
    clearPreviewMessages();
    turnsRef.current = [];
    promptInput.disabled = isEmbedded;
    promptInput.placeholder = isEmbedded ? "Preview unavailable in embedded mode" : PREVIEW_PLACEHOLDER;
    autoResizePromptElement(promptInput);
    updateSendDisabledState();
    updatePreviewChrome();

    const handleInput = () => {
      autoResizePromptElement(promptInput);
      updateSendDisabledState();
    };

    const handlePromptKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Enter"
        && !event.shiftKey
        && !event.ctrlKey
        && !event.metaKey
      ) {
        event.preventDefault();
        if (sendButton.classList.contains("generating")) {
          return;
        }
        void submitPrompt();
      }
    };

    const handleSendClick = (event: MouseEvent) => {
      if (sendButton.classList.contains("disabled") && !sendButton.classList.contains("generating")) {
        return;
      }

      if (sendButton.classList.contains("generating")) {
        const clickedStopIcon = event.target instanceof Element
          && !!event.target.closest(".ai-chat-generating-icon");

        if (clickedStopIcon) {
          cancelActiveRun();
        }
        return;
      }

      void submitPrompt();
    };

    const handleToolsInfoHoverState = (isOpen: boolean) => {
      if (!toolsInfoSection || !toolsInfoTrigger) {
        return;
      }
      toolsInfoSection.classList.toggle("open", isOpen);
      toolsInfoTrigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    };

    const handleResetClick = () => {
      resetPreviewChat();
    };

    const handleSurfaceClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) {
        return;
      }

      const nextStepButton = target.closest(".ai-next-step-button") as HTMLButtonElement | null;
      if (nextStepButton) {
        const nextPrompt = decodeURIComponent(nextStepButton.getAttribute("data-prompt") || "");
        nextStepButton.closest(".ai-next-steps")?.remove();
        setPromptValue(nextPrompt);
        void submitPrompt(nextPrompt);
        return;
      }

      const regenerateButton = target.closest(".ai-regenerate") as HTMLDivElement | null;
      if (regenerateButton) {
        const nextPrompt = decodeURIComponent(regenerateButton.getAttribute("data-message") || "");
        const messageId = regenerateButton
          .closest(".user-message")
          ?.querySelector(".chat-element.chat-text[data-id]")
          ?.getAttribute("data-id");
        if (nextPrompt && messageId && trimConversationFromMessage(messageId)) {
          setPromptValue(nextPrompt);
          void submitPrompt(nextPrompt);
        }
        return;
      }

      const editButton = target.closest(".ai-edit-message") as HTMLDivElement | null;
      if (editButton) {
        const messageId = editButton.getAttribute("data-id");
        const originalMessage = decodeURIComponent(editButton.getAttribute("data-message") || "");
        if (!messageId) {
          return;
        }

        const chatText = chatBody.querySelector(`.chat-element.chat-text[data-id="${messageId}"]`) as HTMLElement | null;
        const editDiv = chatBody.querySelector(`.ai-edit-message-input-div[data-id="${messageId}"]`) as HTMLDivElement | null;
        const editInput = chatBody.querySelector(`.ai-edit-message-input[data-id="${messageId}"]`) as HTMLTextAreaElement | null;

        if (!chatText || !editDiv || !editInput) {
          return;
        }

        chatText.style.display = "none";
        editDiv.style.display = "flex";
        editInput.value = originalMessage;
        autoResizePromptElement(editInput);
        editInput.focus();
        editInput.select();
        return;
      }

      const cancelEditButton = target.closest(".ai-edit-message-cancel") as HTMLButtonElement | null;
      if (cancelEditButton) {
        const messageId = cancelEditButton.getAttribute("data-id");
        if (!messageId) {
          return;
        }

        const chatText = chatBody.querySelector(`.chat-element.chat-text[data-id="${messageId}"]`) as HTMLElement | null;
        const editDiv = chatBody.querySelector(`.ai-edit-message-input-div[data-id="${messageId}"]`) as HTMLDivElement | null;
        if (chatText) {
          chatText.style.display = "";
        }
        if (editDiv) {
          editDiv.style.display = "none";
        }
        return;
      }

      const validateEditButton = target.closest(".ai-edit-message-validate") as HTMLButtonElement | null;
      if (validateEditButton) {
        const messageId = validateEditButton.getAttribute("data-id");
        if (!messageId) {
          return;
        }

        const editInput = chatBody.querySelector(`.ai-edit-message-input[data-id="${messageId}"]`) as HTMLTextAreaElement | null;
        const editedPrompt = String(editInput?.value || "").trim();

        if (!editedPrompt || !trimConversationFromMessage(messageId)) {
          return;
        }

        setPromptValue(editedPrompt);
        void submitPrompt(editedPrompt);
        return;
      }

      const copyCaptionButton = target.closest(
        '.insert-ai-element[element-type="ai-post"][data-action="copy-caption"]',
      ) as HTMLDivElement | null;
      if (copyCaptionButton) {
        const caption = String(copyCaptionButton.getAttribute("data-caption") || "").trim();
        if (caption) {
          const label = copyCaptionButton.querySelector("p");
          const originalLabel = label?.textContent || "Copy";
          void copyTextToClipboard(caption).then((copied) => {
        if (!copied || !label) {
          return;
        }

        label.textContent = "Copied!";
        window.setTimeout(() => {
          label.textContent = originalLabel;
        }, 1200);
          });
        }
        return;
      }

      const generateMediaButton = target.closest(".agent-generate-media") as HTMLButtonElement | null;
      if (generateMediaButton) {
        event.preventDefault();
        event.stopPropagation();
        const runId = String(generateMediaButton.getAttribute("data-run-id") || "").trim();
        if (runId) {
          void generatePreviewMedia(runId);
        }
        return;
      }

      const downloadPreviewMediaButton = target.closest(
        '.insert-ai-element[data-action="downloadPreviewMedia"]',
      ) as HTMLDivElement | null;
      if (downloadPreviewMediaButton) {
        const mediaUrl = String(downloadPreviewMediaButton.getAttribute("data-preview-url") || "").trim();
        if (mediaUrl) {
          window.open(mediaUrl, "_blank", "noopener,noreferrer");
        }
        return;
      }

      const openPreviewMediaAppButton = target.closest(
        '.insert-ai-element[data-action="openPreviewMediaApp"]',
      ) as HTMLDivElement | null;
      if (openPreviewMediaAppButton) {
        openPreviewCta();
        return;
      }

      const previewMediaSlot = target.closest(
        '.ai-message[element-type="ai-media-preview"] .calendar-media-preview',
      ) as HTMLDivElement | null;
      if (previewMediaSlot) {
        const previewMessage = previewMediaSlot.closest('.ai-message[element-type="ai-media-preview"]') as HTMLDivElement | null;
        const mediaUrl = String(previewMessage?.getAttribute("data-preview-url") || "").trim();
        const mediaKind = previewMessage?.querySelector("video") ? "video" : "image";
        if (mediaUrl) {
          setMediaViewer({ kind: mediaKind, url: mediaUrl });
        }
        return;
      }

      const artifactAction = target.closest(".insert-ai-element") as HTMLDivElement | null;
      if (artifactAction) {
        openPreviewCta();
        return;
      }

      const sourcesToggle = target.closest(".brand-sources-more") as HTMLDivElement | null;
      if (sourcesToggle) {
        const sourcesContainer = sourcesToggle.closest(".preview-sources");
        const hiddenList = sourcesContainer?.querySelector(".brand-sources-list-toggle") as HTMLDivElement | null;
        if (hiddenList) {
          hiddenList.style.display = hiddenList.style.display === "none" ? "grid" : "none";
        }
      }
    };

    promptInput.addEventListener("input", handleInput);
    promptInput.addEventListener("keydown", handlePromptKeyDown);
    toolsInfoSection?.addEventListener("mouseenter", () => handleToolsInfoHoverState(true));
    toolsInfoSection?.addEventListener("mouseleave", () => handleToolsInfoHoverState(false));
    toolsInfoTrigger?.addEventListener("focus", () => handleToolsInfoHoverState(true));
    toolsInfoSection?.addEventListener("focusout", (event) => {
      const nextTarget = event.relatedTarget instanceof Node ? event.relatedTarget : null;
      if (nextTarget && toolsInfoSection?.contains(nextTarget)) {
        return;
      }
      handleToolsInfoHoverState(false);
    });
    resetButton?.addEventListener("click", handleResetClick);
    sendButton.addEventListener("click", handleSendClick);
    surface.addEventListener("click", handleSurfaceClick);
    const chatMutationObserver = new MutationObserver(updatePreviewChrome);
    chatMutationObserver.observe(chatBody, { childList: true, subtree: true });

    return () => {
      submitPromptRef.current = null;
      promptInput.removeEventListener("input", handleInput);
      promptInput.removeEventListener("keydown", handlePromptKeyDown);
      resetButton?.removeEventListener("click", handleResetClick);
      sendButton.removeEventListener("click", handleSendClick);
      surface.removeEventListener("click", handleSurfaceClick);
      chatMutationObserver.disconnect();
      cancelActiveRun();
      clearRunScrollInterval();
      invalidatePreviewMediaState();
      previewRoot?.classList.remove("is-home-chat-active", "website-agent-preview-has-content");
      heroSection?.classList.remove("is-home-chat-active");
    };
  }, []);

  return (
    <>
      <div ref={rootRef} className="website-agent-preview-root">
        <button
          ref={resetButtonRef}
          type="button"
          className="website-agent-reset chat-header-icon close-chat"
          aria-label="Clear chat"
          title="Clear chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M1.5 3.75C1.08579 3.75 0.75 4.08579 0.75 4.5C0.75 4.91421 1.08579 5.25 1.5 5.25V3.75ZM22.5 5.25C22.9142 5.25 23.25 4.91421 23.25 4.5C23.25 4.08579 22.9142 3.75 22.5 3.75V5.25ZM1.5 5.25H22.5V3.75H1.5V5.25Z" fill="currentColor" />
            <path d="M9.75 1.5V0.75V1.5ZM8.25 3H7.5H8.25ZM7.5 4.5C7.5 4.91421 7.83579 5.25 8.25 5.25C8.66421 5.25 9 4.91421 9 4.5H7.5ZM15 4.5C15 4.91421 15.3358 5.25 15.75 5.25C16.1642 5.25 16.5 4.91421 16.5 4.5H15ZM15.75 3H16.5H15.75ZM14.25 0.75H9.75V2.25H14.25V0.75ZM9.75 0.75C9.15326 0.75 8.58097 0.987053 8.15901 1.40901L9.21967 2.46967C9.36032 2.32902 9.55109 2.25 9.75 2.25V0.75ZM8.15901 1.40901C7.73705 1.83097 7.5 2.40326 7.5 3H9C9 2.80109 9.07902 2.61032 9.21967 2.46967L8.15901 1.40901ZM7.5 3V4.5H9V3H7.5ZM16.5 4.5V3H15V4.5H16.5ZM16.5 3C16.5 2.40326 16.2629 1.83097 15.841 1.40901L14.7803 2.46967C14.921 2.61032 15 2.80109 15 3H16.5ZM15.841 1.40901C15.419 0.987053 14.8467 0.75 14.25 0.75V2.25C14.4489 2.25 14.6397 2.32902 14.7803 2.46967L15.841 1.40901Z" fill="currentColor" />
            <path d="M9 17.25C9 17.6642 9.33579 18 9.75 18C10.1642 18 10.5 17.6642 10.5 17.25H9ZM10.5 9.75C10.5 9.33579 10.1642 9 9.75 9C9.33579 9 9 9.33579 9 9.75H10.5ZM10.5 17.25V9.75H9V17.25H10.5Z" fill="currentColor" />
            <path d="M13.5 17.25C13.5 17.6642 13.8358 18 14.25 18C14.6642 18 15 17.6642 15 17.25H13.5ZM15 9.75C15 9.33579 14.6642 9 14.25 9C13.8358 9 13.5 9.33579 13.5 9.75H15ZM15 17.25V9.75H13.5V17.25H15Z" fill="currentColor" />
            <path d="M18.865 21.124L18.1176 21.0617L18.1176 21.062L18.865 21.124ZM17.37 22.5L17.3701 21.75H17.37V22.5ZM6.631 22.5V21.75H6.63093L6.631 22.5ZM5.136 21.124L5.88343 21.062L5.88341 21.0617L5.136 21.124ZM4.49741 4.43769C4.46299 4.0249 4.10047 3.71818 3.68769 3.75259C3.2749 3.78701 2.96818 4.14953 3.00259 4.56231L4.49741 4.43769ZM20.9974 4.56227C21.0318 4.14949 20.7251 3.78698 20.3123 3.75259C19.8995 3.7182 19.537 4.02495 19.5026 4.43773L20.9974 4.56227ZM18.1176 21.062C18.102 21.2495 18.0165 21.4244 17.878 21.5518L18.8939 22.6555C19.3093 22.2732 19.5658 21.7486 19.6124 21.186L18.1176 21.062ZM17.878 21.5518C17.7396 21.6793 17.5583 21.75 17.3701 21.75L17.3699 23.25C17.9345 23.25 18.4785 23.0379 18.8939 22.6555L17.878 21.5518ZM17.37 21.75H6.631V23.25H17.37V21.75ZM6.63093 21.75C6.44274 21.75 6.26142 21.6793 6.12295 21.5518L5.10713 22.6555C5.52253 23.0379 6.06649 23.25 6.63107 23.25L6.63093 21.75ZM6.12295 21.5518C5.98449 21.4244 5.89899 21.2495 5.88343 21.062L4.38857 21.186C4.43524 21.7486 4.69172 22.2732 5.10713 22.6555L6.12295 21.5518ZM5.88341 21.0617L4.49741 4.43769L3.00259 4.56231L4.38859 21.1863L5.88341 21.0617ZM19.5026 4.43773L18.1176 21.0617L19.6124 21.1863L20.9974 4.56227L19.5026 4.43773Z" fill="currentColor" />
          </svg>
        </button>
        <div
          ref={shellTargetRef}
          className="website-agent-shell"
          data-agent-chat-shell="home"
          data-agent-chat-shell-wrap="true"
        />
        {quickActions.length ? (
          <div className="hero-example-actions" aria-label="Try concrete AI examples">
            {quickActions.map((example) => (
              <button
                key={example.cta}
                type="button"
                className="hero-example-button"
                onClick={() => submitPromptRef.current?.(example.prompt)}
              >
                <span className="hero-example-label">{example.cta}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {mediaViewer ? (
        <div className="website-media-viewer" role="dialog" aria-modal="true" onClick={() => setMediaViewer(null)}>
          <button
            type="button"
            className="website-media-viewer-close"
            aria-label="Close media preview"
            onClick={() => setMediaViewer(null)}
          >
            ×
          </button>
          <div className="website-media-viewer-dialog" onClick={(event) => event.stopPropagation()}>
            {mediaViewer.kind === "video" ? (
              <video controls autoPlay playsInline preload="metadata" className="website-media-viewer-media">
                <source src={mediaViewer.url} type="video/mp4" />
              </video>
            ) : (
              <img src={mediaViewer.url} alt="Generated media preview" className="website-media-viewer-media" />
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
