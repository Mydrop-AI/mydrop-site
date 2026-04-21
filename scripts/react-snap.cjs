const { run } = require("react-snap");
const fs = require("node:fs");
const net = require("node:net");
const path = require("node:path");
const { readBlogAuthors, readBlogPosts } = require("./blog-content.cjs");

const packageJsonPath = path.resolve(__dirname, "../package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const packageReactSnapConfig = packageJson.reactSnap ?? {};

const linuxChromeCandidates = [
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
];

const defaultChromePath =
  process.platform === "darwin"
    ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    : linuxChromeCandidates.find((candidate) => fs.existsSync(candidate)) ||
      "/usr/bin/google-chrome";

function normalizeBasePath(basePath) {
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

function getBlogPostRoutes() {
  return readBlogPosts().map((post) => post.canonicalPath);
}

function getAuthorRoutes() {
  return readBlogAuthors().map((author) => `/authors/${author.slug}`);
}

const staticRoutes = [
  "/",
  "/pricing",
  "/blog",
  "/privacy-policy",
  "/terms-and-services",
  "/faq",
  "/contact",
];

function getLegacyFrenchRoutes(routes) {
  const legacyAliases = ["/fr", "/fr/home", "/fr/blogs"];
  const prefixedRoutes = routes
    .filter((route) => route !== "/")
    .map((route) => `/fr${route}`);

  return [...new Set([...legacyAliases, ...prefixedRoutes])];
}

function setupBasePathMirror(distDir, basePath) {
  if (basePath === "/") {
    return null;
  }

  const folderName = basePath.slice(1, -1);
  const mirrorDir = path.join(distDir, folderName);
  fs.mkdirSync(mirrorDir, { recursive: true });

  const entries = fs.readdirSync(distDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === folderName) {
      continue;
    }

    const target = path.join(mirrorDir, entry.name);
    if (fs.existsSync(target)) {
      continue;
    }

    const linkTarget = path.join("..", entry.name);
    fs.symlinkSync(linkTarget, target, entry.isDirectory() ? "dir" : "file");
  }

  return mirrorDir;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function rewriteHrefsForBasePath(distDir, basePath) {
  if (basePath === "/") {
    return;
  }

  const baseSegment = basePath.slice(1, -1);
  const rootHrefPattern = new RegExp(
    `href=\"\/(?!${escapeRegExp(baseSegment)}(?:\/|\"))`,
    "g",
  );

  const stack = [distDir];
  while (stack.length > 0) {
    const currentDir = stack.pop();
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }

      if (!entry.isFile() || !entry.name.endsWith(".html")) {
        continue;
      }

      const html = fs.readFileSync(fullPath, "utf8");
      const rewritten = html.replace(rootHrefPattern, `href=\"${basePath}`);
      if (rewritten !== html) {
        fs.writeFileSync(fullPath, rewritten);
      }
    }
  }
}

function resolvePreferredPort() {
  const envPort = Number.parseInt(process.env.REACT_SNAP_PORT ?? "", 10);
  if (Number.isInteger(envPort) && envPort > 0 && envPort <= 65535) {
    return envPort;
  }

  const configPort = Number.parseInt(packageReactSnapConfig.port ?? "", 10);
  if (Number.isInteger(configPort) && configPort > 0 && configPort <= 65535) {
    return configPort;
  }

  return 45678;
}

function getAvailablePort(preferredPort) {
  return new Promise((resolve, reject) => {
    const preferredServer = net.createServer();

    preferredServer.once("error", (error) => {
      if (error && error.code === "EADDRINUSE") {
        const fallbackServer = net.createServer();

        fallbackServer.once("error", reject);
        fallbackServer.listen(0, () => {
          const address = fallbackServer.address();
          const fallbackPort =
            address && typeof address === "object" ? address.port : null;

          fallbackServer.close((closeError) => {
            if (closeError) {
              reject(closeError);
              return;
            }

            if (!fallbackPort) {
              reject(new Error("Unable to determine a free port for react-snap."));
              return;
            }

            resolve(fallbackPort);
          });
        });

        return;
      }

      reject(error);
    });

    preferredServer.listen(preferredPort, () => {
      preferredServer.close((closeError) => {
        if (closeError) {
          reject(closeError);
          return;
        }

        resolve(preferredPort);
      });
    });
  });
}

async function main() {
  const basePath = normalizeBasePath(process.env.BASE_PATH);
  const distDir = path.resolve(__dirname, "../dist");
  const mirrorDir = setupBasePathMirror(distDir, basePath);
  const blogPostRoutes = getBlogPostRoutes();
  const authorRoutes = getAuthorRoutes();
  const allPrimaryRoutes = [...staticRoutes, ...authorRoutes, ...blogPostRoutes];
  const legacyFrenchRoutes = getLegacyFrenchRoutes(allPrimaryRoutes);
  const port = await getAvailablePort(resolvePreferredPort());

  try {
    await run({
      source: packageReactSnapConfig.source ?? "dist",
      port,
      include: [...allPrimaryRoutes, ...legacyFrenchRoutes],
      inlineCss: packageReactSnapConfig.inlineCss ?? false,
      skipThirdPartyRequests: packageReactSnapConfig.skipThirdPartyRequests ?? true,
      concurrency: packageReactSnapConfig.concurrency ?? 1,
      puppeteerArgs: packageReactSnapConfig.puppeteerArgs ?? [
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
      puppeteerExecutablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH ||
        packageReactSnapConfig.puppeteerExecutablePath ||
        defaultChromePath,
    });

    rewriteHrefsForBasePath(distDir, basePath);
  } finally {
    if (mirrorDir) {
      fs.rmSync(mirrorDir, { recursive: true, force: true });
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
