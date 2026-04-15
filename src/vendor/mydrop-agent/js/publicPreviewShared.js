const MIN_PROMPT_HEIGHT = 35;
const MAX_PROMPT_HEIGHT = 300;

const refreshIconMarkup = `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6V11H15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4 18V13H9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7.2 9.2C8.1 7.3 10 6 12.2 6C14 6 15.7 6.9 16.7 8.3L20 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16.8 14.8C15.9 16.7 14 18 11.8 18C10 18 8.3 17.1 7.3 15.7L4 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`;

const editIconMarkup = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
        <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`;

const usePostIconMarkup = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
        <path d="M3 4C3 3.44772 3.44772 3 4 3C4.55228 3 5 3.44772 5 4V11C5 11.7956 5.31607 12.5587 5.87868 13.1213C6.44129 13.6839 7.20435 14 8 14H17.5858L14.2929 10.7071C13.9024 10.3166 13.9024 9.68342 14.2929 9.29289C14.6834 8.90237 15.3166 8.90237 15.7071 9.29289L20.7071 14.2929C21.0976 14.6834 21.0976 15.3166 20.7071 15.7071L15.7071 20.7071C15.3166 21.0976 14.6834 21.0976 14.2929 20.7071C13.9024 20.3166 13.9024 19.6834 14.2929 19.2929L17.5858 16H8C6.67392 16 5.40215 15.4732 4.46447 14.5355C3.52678 13.5979 3 12.3261 3 11V4Z" fill="currentColor"/>
    </svg>
`;

const applyDraftIconMarkup = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
        <path d="M8 8.5C8 7.11929 9.11929 6 10.5 6H18C19.1046 6 20 6.89543 20 8V18C20 19.1046 19.1046 20 18 20H10.5C9.11929 20 8 18.8807 8 17.5V8.5Z" stroke="currentColor" stroke-width="1.5"></path>
        <path d="M5.5 15C4.11929 15 3 13.8807 3 12.5V6C3 4.89543 3.89543 4 5 4H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
    </svg>
`;

const statusIconMarkup = {
    posted: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.8"/>
            <path d="M8.5 12.2L10.8 14.5L15.8 9.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
    waiting: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.8"/>
            <path d="M12 8V12L14.8 13.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
    warning: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L20 18H4L12 4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
            <path d="M12 9V13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <circle cx="12" cy="16.2" r="1" fill="currentColor"/>
        </svg>`,
    failed: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.8"/>
            <path d="M9.2 9.2L14.8 14.8M14.8 9.2L9.2 14.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>`,
    pending: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.8"/>
            <path d="M10 9V15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M14 9V15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>`,
    uploading: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 17.5H7.5C5.01472 17.5 3 15.4853 3 13C3 10.7178 4.6993 8.83253 6.90312 8.54076C7.67089 5.90749 10.1046 4 13 4C16.4188 4 19.2397 6.58878 19.6071 9.91032C20.994 10.3967 22 11.7184 22 13.2759C22 15.2476 20.4014 16.8462 18.4296 16.8462H16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 19V11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M9.5 13.5L12 11L14.5 13.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
    draft: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 3H8C6.89543 3 6 3.89543 6 5V19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19V7L14 3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
            <path d="M14 3V7H18" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
            <path d="M9.5 15.5L13.8 11.2C14.1905 10.8095 14.8237 10.8095 15.2142 11.2V11.2C15.6047 11.5905 15.6047 12.2237 15.2142 12.6142L10.9 16.9L9 17.4L9.5 15.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
        </svg>`
};

const postStatusTitles = {
    posted: "Posted on",
    warning: "Posted on",
    waiting: "Scheduled for",
    failed: "Unable to post on",
    pending: "Waiting for approval",
    uploading: "Scheduling post",
    draft: "Draft saved"
};

function formatBoolean(value) {
    return value ? "Yes" : "No";
}

export function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export function markdownToHtml(text) {
    if (typeof text !== "string") {
        return "";
    }

    const markedInstance = typeof window !== "undefined" ? window.marked : null;
    if (!markedInstance?.parse || !markedInstance?.setOptions) {
        return escapeHtml(text).replace(/\n/g, "<br>");
    }

    markedInstance.setOptions({
        gfm: true,
        tables: true,
        breaks: true,
        smartLists: true,
        smartypants: false
    });

    return markedInstance
        .parse(text.replace(/, /g, ", "))
        .replace(/&mdash;|&#8212;/g, ", ")
        .replace(/, /g, ", ");
}

export function installPublicPreviewMarkdownRenderer(markedInstance = null) {
    if (typeof window !== "undefined") {
        if (markedInstance?.parse && markedInstance?.setOptions) {
            window.marked = markedInstance;
        }
        window.markdownToHtml = markdownToHtml;
    }

    return markdownToHtml;
}

export function generateUniqueId(prefix = "agent") {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return `${prefix}_${crypto.randomUUID().replace(/-/g, "")}`;
    }

    return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

export function autoResizePromptElement(element) {
    if (!element) {
        return;
    }

    element.style.height = `${MIN_PROMPT_HEIGHT}px`;
    const neededHeight = element.scrollHeight;

    if (neededHeight <= MAX_PROMPT_HEIGHT) {
        element.style.height = `${Math.max(neededHeight, MIN_PROMPT_HEIGHT)}px`;
        element.style.overflowY = "hidden";
    } else {
        element.style.height = `${MAX_PROMPT_HEIGHT}px`;
        element.style.overflowY = "auto";
    }

    element.style.overflowX = "hidden";
}

export function promptLikelyNeedsArtifact(promptText = "") {
    const normalized = String(promptText || "").toLowerCase();
    const greetingOnly = /^(hi|hello|hey|yo|sup|hey there|hello there)\b/.test(normalized.trim());
    const questionOnly = /^(what|why|how|can|could|should|would|do|does|is|are|will)\b/.test(normalized.trim());
    const artifactDomain = /\b(post|caption|copy|brand|visual|visuals|image|images|video|videos|reel|carousel|campaign|hook|ad|thread)\b/i.test(normalized);
    const actionIntent = /\b(create|make|generate|draft|write|rewrite|build|update|plan|prepare|need|want|new|improve|edit|repurpose|turn this into|use|attach|add|insert|put)\b/i.test(normalized);
    const explicitChatOnly = /\b(what can you do|what do you recommend|what should i do|give me ideas|brainstorm|help me think)\b/i.test(normalized);
    const existingMediaArtifactIntent = /\b(use|attach|add|insert|put)\b[\s\S]*\b(image|images|photo|photos|video|videos|media|file|files|asset|assets)\b/i.test(normalized);

    if (greetingOnly || explicitChatOnly) {
        return false;
    }

    if (existingMediaArtifactIntent) {
        return true;
    }

    if (artifactDomain && actionIntent) {
        return true;
    }

    if (artifactDomain && !questionOnly) {
        return true;
    }

    return false;
}

export function sanitizeAiNextSteps(nextSteps = []) {
    const seen = new Set();
    const unsupportedPatterns = [
        /\b(update|change|set|rewrite)\b[\s\S]{0,32}\b(linkedin|instagram|facebook|x|threads|tiktok|youtube|pinterest)\b[\s\S]{0,24}\b(bio|tagline|headline|profile|pinned post|pinned)\b/i,
        /\b(update|change|set|rewrite)\b[\s\S]{0,24}\b(bio|tagline|headline|profile|pinned post|pinned)\b[\s\S]{0,24}\b(linkedin|instagram|facebook|x|threads|tiktok|youtube|pinterest)\b/i,
        /\b(publish|post live|push live|go live|pin)\b[\s\S]{0,30}\b(linkedin|instagram|facebook|x|threads|tiktok|youtube|pinterest)\b/i
    ];

    return (nextSteps || [])
        .map(step => String(step || "").trim())
        .filter(step => {
            if (!step) {
                return false;
            }
            if (unsupportedPatterns.some(pattern => pattern.test(step))) {
                return false;
            }

            const key = step.toLowerCase();
            if (seen.has(key)) {
                return false;
            }

            seen.add(key);
            return true;
        })
        .slice(0, 3);
}

function isMeaningfulPost(post = {}) {
    const caption = String(post?.caption || "").trim();
    const customized = Object.values(post?.customizedCaptions || {}).some(value => String(value || "").trim());
    return Boolean(caption || customized);
}

function isMeaningfulBrand(brand = {}) {
    return Boolean(String(brand?.groupName || "").trim());
}

export function hasMediaPlanItems(mediaOutput = {}) {
    if (!mediaOutput || typeof mediaOutput !== "object") {
        return false;
    }

    return (mediaOutput.images || []).length > 0 || (mediaOutput.videos || []).length > 0;
}

function normalizeAiArtifactBundle(bundle = {}) {
    return {
        post: bundle?.post && typeof bundle.post === "object" ? bundle.post : {},
        media: hasMediaPlanItems(bundle?.media) ? bundle.media : { images: [], videos: [] },
        brand: bundle?.brand && typeof bundle.brand === "object" ? bundle.brand : {}
    };
}

function bundleHasArtifactContent(bundle = {}) {
    const normalized = normalizeAiArtifactBundle(bundle);

    return Boolean(
        isMeaningfulPost(normalized.post)
        || isMeaningfulBrand(normalized.brand)
        || hasMediaPlanItems(normalized.media)
    );
}

export function normalizeAiArtifactBundles(output = {}) {
    const explicitArtifacts = Array.isArray(output?.artifacts) ? output.artifacts : [];
    const normalizedArtifacts = explicitArtifacts
        .map(bundle => normalizeAiArtifactBundle(bundle))
        .filter(bundle => bundleHasArtifactContent(bundle));

    if (normalizedArtifacts.length) {
        return normalizedArtifacts;
    }

    const fallbackBundle = normalizeAiArtifactBundle({
        post: output?.post || {},
        media: output?.media || { images: [], videos: [] },
        brand: output?.brand || {}
    });

    return bundleHasArtifactContent(fallbackBundle) ? [fallbackBundle] : [];
}

export function mergeAiArtifactMediaPlans(artifactBundles = []) {
    return (artifactBundles || []).reduce((merged, bundle) => {
        const media = normalizeAiArtifactBundle(bundle).media;
        merged.images.push(...(media.images || []));
        merged.videos.push(...(media.videos || []));
        return merged;
    }, { images: [], videos: [] });
}

export function getStatusIconSvg(status = "draft", className = "") {
    const icon = statusIconMarkup[status] || statusIconMarkup.waiting;
    return `<span class="app-inline-icon ${className}" data-status="${escapeHtml(status)}" aria-hidden="true" style="color: var(--${escapeHtml(status)}, currentColor);">${icon}</span>`;
}

export function getPostPrimaryCaption(post = {}) {
    const caption = post.caption ?? "";
    const customizeCaption = post.customizeCaption ?? false;
    const customizedCaptions = post.customizedCaptions ?? {};

    if (customizeCaption && Object.keys(customizedCaptions).length) {
        const filteredCaptions = Object.entries(customizedCaptions).filter(([key]) => key !== "common");
        return filteredCaptions.length > 0 ? filteredCaptions[0][1] : "";
    }

    return caption || "";
}

function renderPostPreview(post, type = "chat") {
    const postId = post.postId || generateUniqueId("post");
    let dateTime = String(post?.dateTime || "").trim();

    console.log("Rendering post preview with dateTime:", { dateTime, post });

    if (!dateTime) {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const hh = String(now.getHours()).padStart(2, "0");
        const min = String(now.getMinutes()).padStart(2, "0");
        dateTime = `${yyyy}-${mm}-${dd} ${hh}:${min}`;
    }

    const posted = post?.posted ?? "pending";
    const titlePrefix = postStatusTitles[posted] || "Edit the";
    const title = `${titlePrefix} ${dateTime}`.trim();
    const caption = getPostPrimaryCaption(post);
    const formattedCaption = typeof caption === "string" ? caption.replace(/\n/g, "<br>") : "";
    const uniqueId = generateUniqueId("profiles");
    const date = new Date(dateTime.replace(" ", "T"));
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const timeDisplay = type === "calendar" ? `${hours}:${minutes}` : `${day}/${month} ${hours}:${minutes}`;

    return `
        <div class="new-post animate-slide-in" data-type="${escapeHtml(type)}" postId="${escapeHtml(postId)}" data-posted="${escapeHtml(posted)}" title="${escapeHtml(title)}">
            <div class="post-preview-left" style="background-color: var(--${escapeHtml(posted)});"></div>
            <div class="post-preview-right">
                <div class="post-preview-header">
                    <div class="post-profiles" data-id="${escapeHtml(uniqueId)}"></div>
                    <div class="post-preview-header-right">
                        <p class="post-time">${escapeHtml(timeDisplay)}</p>
                        ${getStatusIconSvg(posted, "post-status-img")}
                    </div>
                </div>
                <div class="post-preview-content">
                    <div class="preview-media-slot" data-type="${escapeHtml(type)}" data-postId="${escapeHtml(postId)}"></div>
                    <p class="post-caption">${formattedCaption}</p>
                </div>
            </div>
        </div>
    `;
}

function humanizeArtifactFieldLabel(key = "") {
    return String(key || "")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[_-]+/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase())
        .trim();
}

function normalizeArtifactComparableValue(value) {
    if (value === undefined || value === null) {
        return "";
    }

    if (Array.isArray(value)) {
        return value.map(item => normalizeArtifactComparableValue(item)).join(" | ");
    }

    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return String(value).trim();
}

function formatArtifactValue(value) {
    if (value === undefined || value === null || value === "") {
        return "Empty";
    }

    if (typeof value === "boolean") {
        return formatBoolean(value);
    }

    if (Array.isArray(value)) {
        return value.length ? value.map(item => formatArtifactValue(item)).join(", ") : "Empty";
    }

    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return String(value);
}

function truncateArtifactDiffValue(value, maxLength = 40) {
    const formatted = formatArtifactValue(value);
    return formatted.length > maxLength ? `${formatted.slice(0, maxLength).trimEnd()}...` : formatted;
}

function buildArtifactDiffMarkup(changes = []) {
    if (!changes.length) {
        return "";
    }

    return `
        <div class="agent-artifact-diff-list">
            ${changes.map(change => `
                <div class="agent-artifact-diff-row">
                    <p class="agent-artifact-diff-field">${escapeHtml(change.label)}</p>
                    <div class="agent-artifact-diff-values">
                        <span class="old">${escapeHtml(truncateArtifactDiffValue(change.before))}</span>
                        <span class="arrow">→</span>
                        <span class="new">${escapeHtml(formatArtifactValue(change.after))}</span>
                    </div>
                </div>
            `).join("")}
        </div>
    `;
}

function hasArtifactPatchValue(value) {
    if (value === undefined || value === null) {
        return false;
    }

    if (typeof value === "boolean" || typeof value === "number") {
        return true;
    }

    if (typeof value === "string") {
        return value.trim() !== "";
    }

    if (Array.isArray(value)) {
        return value.length > 0;
    }

    if (typeof value === "object") {
        return Object.keys(value).length > 0;
    }

    return false;
}

function compactArtifactPatchObject(source = {}) {
    return Object.fromEntries(
        Object.entries(source || {}).filter(([, value]) => hasArtifactPatchValue(value))
    );
}

function sanitizeBrandDraftForArtifact(brandDraft = {}) {
    return {
        ...brandDraft,
        groupInfos: compactArtifactPatchObject(brandDraft.groupInfos || {})
    };
}

function buildBrandDraftChanges(brandDraft = {}) {
    const normalizedDraft = sanitizeBrandDraftForArtifact(brandDraft);
    const changes = [];

    if (normalizedDraft.action === "update" && hasArtifactPatchValue(normalizedDraft.groupName)) {
        changes.push({
            label: "Brand name",
            before: "",
            after: normalizedDraft.groupName || ""
        });
    }

    Object.entries(normalizedDraft.groupInfos || {}).forEach(([key, value]) => {
        if (!hasArtifactPatchValue(value)) {
            return;
        }

        changes.push({
            label: humanizeArtifactFieldLabel(key),
            before: "",
            after: value
        });
    });

    return changes.filter(change => normalizeArtifactComparableValue(change.before) !== normalizeArtifactComparableValue(change.after));
}

function renderAgentBrandPreview(draftId, brandDraft = {}) {
    const draft = sanitizeBrandDraftForArtifact(brandDraft);
    const groupInfos = draft.groupInfos || {};
    const highlights = [
        groupInfos.activitySector,
        groupInfos.targetAudience,
        groupInfos.tone
    ].filter(Boolean);
    const description = groupInfos.description || "";
    const changes = buildBrandDraftChanges(draft);
    const summary = draft.action === "update"
        ? (changes.length
            ? `Updating ${changes.length} brand field${changes.length !== 1 ? "s" : ""} for ${draft.groupName || "this brand"}.`
            : `No brand fields are changing for ${draft.groupName || "this brand"}.`)
        : `Creating a new brand draft for ${draft.groupName || "this brand"}.`;

    return `
        <div class="agent-artifact-card brand" data-brand-draft-id="${escapeHtml(draftId)}">
            <div class="agent-artifact-meta">
                <span>${draft.action === "update" ? "Brand update" : "Brand draft"}</span>
            </div>
            <h3>${escapeHtml(draft.groupName || "Untitled brand")}</h3>
            <p class="agent-artifact-copy">${escapeHtml(summary)}</p>
            ${draft.action === "update"
                ? buildArtifactDiffMarkup(changes)
                : `${description ? `<p class="agent-artifact-copy">${escapeHtml(description)}</p>` : ""}${highlights.length ? `<p class="agent-artifact-subtle">${escapeHtml(highlights.join(" • "))}</p>` : ""}`
            }
            <div class="ai-message-post-actions app-scrollbar">
                <div class="insert-ai-element hover-button" data-action="apply" element-type="ai-brand" data-brandDraftId="${escapeHtml(draftId)}">
                    ${applyDraftIconMarkup}
                    <p>${draft.action === "update" ? "Apply brand update" : "Create brand"}</p>
                </div>
            </div>
        </div>
    `;
}

export function createUserMessageHtml(message, options = {}) {
    const value = String(message || "").trim();
    if (!value) {
        return "";
    }

    const messageId = options.messageId || generateUniqueId("user");
    const encodedMessage = encodeURIComponent(value);
    const formattedValue = escapeHtml(value).replace(/\n/g, "<br>");

    return `
        <div class="user-message chat-div animate-slide-in">
            <p data-id="${escapeHtml(messageId)}" class="chat-element chat-text" element-type="user-message">${formattedValue}</p>

            <div data-id="${escapeHtml(messageId)}" class="ai-edit-message-input-div">
                <textarea data-id="${escapeHtml(messageId)}" class="ai-edit-message-input app-scrollbar"></textarea>
                <div class="ai-edit-message-buttons">
                    <button data-id="${escapeHtml(messageId)}" class="ai-edit-message-button ai-edit-message-cancel" title="Cancel">Cancel</button>
                    <button data-id="${escapeHtml(messageId)}" class="ai-edit-message-button ai-edit-message-validate" title="Save">Save</button>
                </div>
            </div>

            <div class="ai-message-tools">
                <div title="Regenerate" class="ai-regenerate" data-message="${encodedMessage}">
                    <span class="app-inline-icon" aria-hidden="true">${refreshIconMarkup}</span>
                </div>
                <div data-id="${escapeHtml(messageId)}" title="Edit" class="ai-edit-message" data-message="${encodedMessage}">
                    ${editIconMarkup}
                </div>
            </div>
        </div>
    `;
}

export function createLoaderMessageHtml() {
    return `
        <div class="ai-message chat-div animate-slide-in" id="ai-message-loader">
            <div class="ai-loader"><span></span><span></span><span></span></div>
            <div class="brand-message"></div>
        </div>
    `;
}

export function createAiErrorMessageHtml(message) {
    const value = String(message || "").trim();
    if (!value) {
        return "";
    }

    return `
        <div class="ai-message ai-error ai-text chat-div animate-slide-in">
            <span class="ai-icon animate-slide-in">
                <svg class="ai-svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                </svg>
            </span>
            <div class="chat-element chat-text" element-type="ai-message-error">${markdownToHtml(value)}</div>
        </div>
    `;
}

export function createNextStepsHtml(nextSteps = []) {
    const safeNextSteps = sanitizeAiNextSteps(nextSteps);
    if (!safeNextSteps.length) {
        return "";
    }

    return `
        <div class="ai-next-steps chat-div chat-element animate-slide-in" element-type="ai-next-steps">
            <div class="ai-next-steps-buttons">
                ${safeNextSteps.map(step => `
                    <button class="ai-next-step-button" type="button" data-prompt="${encodeURIComponent(step)}">
                        ${escapeHtml(step)}
                    </button>
                `).join("")}
            </div>
        </div>
    `;
}

export function createPostArtifactMessageHtml(postDraft = {}) {
    const postId = postDraft.postId || generateUniqueId("post");
    const primaryCaption = getPostPrimaryCaption(postDraft);
    const post = {
        ...postDraft,
        postId,
        suggestion: true,
        posted: postDraft.posted || "pending",
        created: "ai"
    };

    return `
        <div class="ai-message chat-div chat-element animate-slide-in" element-type="ai-post" data-postId="${escapeHtml(postId)}">
            ${renderPostPreview(post, "chat")}
            <div class="ai-message-post-actions app-scrollbar">
                <div title="Copy caption" class="insert-ai-element hover-button" data-action="copy-caption" data-caption="${escapeHtml(primaryCaption)}" element-type="ai-post" data-postId="${escapeHtml(postId)}">
                    ${applyDraftIconMarkup}
                    <p>Copy caption</p>
                </div>
                <div title="Edit post" class="insert-ai-element hover-button" data-action="edit" element-type="ai-post" data-postId="${escapeHtml(postId)}">
                    ${usePostIconMarkup}
                    <p class="edit-text">Edit post</p>
                </div>
            </div>
        </div>
    `;
}

export function createBrandArtifactMessageHtml(brandDraft = {}) {
    const draftId = brandDraft.draftId || generateUniqueId("brand");

    return `
        <div class="ai-message chat-div chat-element animate-slide-in" element-type="ai-brand" data-brandDraftId="${escapeHtml(draftId)}">
            ${renderAgentBrandPreview(draftId, brandDraft)}
        </div>
    `;
}

export function createSourcesMessageHtml(sources = []) {
    if (!Array.isArray(sources) || !sources.length) {
        return "";
    }

    const visibleSources = sources.slice(0, 3);
    const hiddenSources = sources.slice(3);
    const renderLink = (source = {}) => {
        const url = String(source?.url || "").trim();
        if (!url) {
            return "";
        }

        let displayUrl = url;
        try {
            const tempUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
            displayUrl = new URL(tempUrl).hostname.replace(/^www\./, "");
        } catch (_error) {
            displayUrl = url;
        }

        return `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer" title="Open in new tab" class="brand-source-item animate-slide-in"><i class="fas fa-link"></i><p>${escapeHtml(displayUrl)}</p></a>`;
    };

    return `
        <div class="ai-sources chat-div chat-element animate-slide-in" element-type="ai-sources">
            <div class="preview-sources app-scrollbar">
                <div class="brand-sources-div">
                    <div class="brand-sources-list">${visibleSources.map(renderLink).join("")}</div>
                    ${hiddenSources.length ? `<div class="brand-sources-more">+${hiddenSources.length} <i class="fas fa-chevron-down"></i></div>` : ""}
                </div>
                ${hiddenSources.length ? `<div class="brand-sources-list-toggle" style="display:none;">${hiddenSources.map(renderLink).join("")}</div>` : ""}
            </div>
        </div>
    `;
}
