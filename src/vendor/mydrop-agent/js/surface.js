function getVisibleAiChatSurfaces() {
    return $('.ai-chat-surface').filter(function() {
        return $(this).is(':visible');
    });
}

function getActiveAiChatSurfaceKey() {
    if ($('#modal-new-publication').is(':visible')) {
        return 'post';
    }

    const currentPath = String(window.location.pathname || '');
    if (currentPath === '/' || currentPath === '/home' || currentPath === '/home/' || currentPath.startsWith('/home/')) {
        return 'home';
    }

    const firstVisibleSurface = getVisibleAiChatSurfaces().first();
    return firstVisibleSurface.attr('data-ai-chat-surface') || 'post';
}

function getAiSurfaceRoot(surfaceKey = null) {
    const resolvedSurfaceKey = surfaceKey || getActiveAiChatSurfaceKey();
    let $surfaceRoot = $(`.ai-chat-surface[data-ai-chat-surface="${resolvedSurfaceKey}"]`).first();

    if (!$surfaceRoot.length) {
        $surfaceRoot = getVisibleAiChatSurfaces().first();
    }

    return $surfaceRoot;
}

function getAiSurfaceElement(selector, options = {}) {
    const $surfaceRoot = getAiSurfaceRoot(options.surfaceKey || null);
    if (!$surfaceRoot.length) {
        return $();
    }
    return $surfaceRoot.find(selector).first();
}

function getAiSurfaceElements(selector, options = {}) {
    const $surfaceRoot = getAiSurfaceRoot(options.surfaceKey || null);
    if (!$surfaceRoot.length) {
        return $();
    }
    return $surfaceRoot.find(selector);
}

function getAiChatBody(options = {}) {
    return getAiSurfaceElement('.ai-chat-body, #ai-chat-body', options);
}

function getAiChatBodyElement(surfaceKey = null) {
    return getAiChatBody({ surfaceKey }).get(0) || null;
}

function getAiPromptInput(options = {}) {
    return getAiSurfaceElement('.ai-prompt[data-value="default"]', options);
}

function getAiPromptWrapper(options = {}) {
    return getAiSurfaceElement('.ai-default-prompt, #ai-default-prompt', options);
}

function getAiSendButton(options = {}) {
    return getAiSurfaceElement('.ai-chat-send-button, #ai-chat-send-button', options);
}

function getAiEffortSelect(options = {}) {
    return getAiSurfaceElement('.ai-effort-select, #ai-effort-select', options);
}

function getAiChatSessionStore() {
    return window.agentChatSessionStore || null;
}

function cloneAiChatSessionValue(value) {
    if (value === undefined) {
        return undefined;
    }

    if (typeof structuredClone === 'function') {
        try {
            return structuredClone(value);
        } catch (error) {
            console.debug('Unable to structuredClone AI chat value:', error);
        }
    }

    try {
        return JSON.parse(JSON.stringify(value));
    } catch (error) {
        console.debug('Unable to JSON clone AI chat value:', error);
        return value;
    }
}

window.getActiveAiChatSurfaceRoot = () => getAiSurfaceRoot();
window.getAiChatSurfaceRoots = () => $('.ai-chat-surface').toArray();
window.getActiveAiChatBodyElement = () => getAiChatBodyElement();
window.getAiChatSessionStore = getAiChatSessionStore;
window.cloneAiChatSessionValue = cloneAiChatSessionValue;
