function normalizeBasePath(basePath: string) {
  if (!basePath || basePath === "/") {
    return "/";
  }

  let normalized = basePath;
  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }
  if (!normalized.endsWith("/")) {
    normalized = `${normalized}/`;
  }

  return normalized;
}

export function resolveAssetPath(path: string) {
  if (!path) {
    return path;
  }

  if (/^(https?:)?\/\//i.test(path) || path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }

  const basePath = normalizeBasePath(import.meta.env.BASE_URL || "/");
  const relativePath = path.startsWith("/") ? path.slice(1) : path;

  return `${basePath}${relativePath}`;
}

export function getRouterBasename() {
  const configuredBase = normalizeBasePath(import.meta.env.BASE_URL || "/");

  if (configuredBase === "/") {
    return undefined;
  }

  if (typeof window !== "undefined" && !window.location.pathname.startsWith(configuredBase)) {
    return undefined;
  }

  return configuredBase.endsWith("/") ? configuredBase.slice(0, -1) : configuredBase;
}
