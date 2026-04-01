declare module "@mydrop-app/static/js/agent/publicPreviewShared.js" {
  export function autoResizePromptElement(element: HTMLTextAreaElement | null): void;
  export function createAiErrorMessageHtml(message: string): string;
  export function createBrandArtifactMessageHtml(brandDraft?: Record<string, unknown>): string;
  export function createLoaderMessageHtml(): string;
  export function createNextStepsHtml(nextSteps?: string[]): string;
  export function createPostArtifactMessageHtml(postDraft?: Record<string, unknown>): string;
  export function createSourcesMessageHtml(
    sources?: Array<{
      url?: string;
    }>,
  ): string;
  export function createUserMessageHtml(
    message: string,
    options?: {
      messageId?: string;
    },
  ): string;
  export function escapeHtml(value: unknown): string;
  export function generateUniqueId(prefix?: string): string;
  export function installPublicPreviewMarkdownRenderer(markedInstance?: unknown): (text: string) => string;
  export function mergeAiArtifactMediaPlans(artifactBundles?: Array<Record<string, unknown>>): {
    images?: Array<Record<string, unknown>>;
    videos?: Array<Record<string, unknown>>;
  };
  export function normalizeAiArtifactBundles(output?: Record<string, unknown>): Array<Record<string, unknown>>;
  export function promptLikelyNeedsArtifact(promptText?: string): boolean;
  export function sanitizeAiNextSteps(nextSteps?: string[]): string[];
}
