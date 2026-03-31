const fs = require("fs");
const path = require("path");

const root = process.cwd();

const ensureDir = (dirPath) => fs.mkdirSync(dirPath, { recursive: true });

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");

const walkFiles = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const files = [];
  const stack = [dirPath];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else {
        files.push(fullPath);
      }
    }
  }

  return files;
};

const destination = {
  originalImg: path.join(root, "public/media/images/original-site"),
  pricingImg: path.join(root, "public/media/images/pricing"),
  aiImg: path.join(root, "public/media/images/ai-gallery"),
  aiVid: path.join(root, "public/media/videos/ai-gallery"),
  platformImg: path.join(root, "public/images/platforms"),
};

Object.values(destination).forEach(ensureDir);

const isVideoExt = (ext) => [".mp4", ".mov", ".webm"].includes(ext);

const resolveMovePlan = (relativePath) => {
  const rel = relativePath.toLowerCase();
  const ext = path.extname(rel);
  const video = isVideoExt(ext);

  if (rel.startsWith("files/platforms-icons/")) {
    return { dir: destination.platformImg, prefix: "platform" };
  }

  if (
    rel.startsWith("files/ai-media-examples/") ||
    rel.startsWith("public/images/ai-media-examples/")
  ) {
    return {
      dir: video ? destination.aiVid : destination.aiImg,
      prefix: "ai",
    };
  }

  if (rel.startsWith("files/pricing/")) {
    return { dir: destination.pricingImg, prefix: "pricing" };
  }

  if (rel.startsWith("public/images/original-site-files/")) {
    return {
      dir: video ? destination.aiVid : destination.originalImg,
      prefix: "legacy",
    };
  }

  if (rel.startsWith("files/")) {
    return {
      dir: video ? destination.aiVid : destination.originalImg,
      prefix: "legacy",
    };
  }

  return null;
};

const getUniqueTarget = (targetDir, prefix, baseName, ext) => {
  const cleanBase = slugify(baseName) || "asset";
  const stem = prefix ? `${prefix}-${cleanBase}` : cleanBase;
  const extLower = ext.toLowerCase();

  let candidate = path.join(targetDir, `${stem}${extLower}`);
  let counter = 2;

  while (fs.existsSync(candidate)) {
    candidate = path.join(targetDir, `${stem}-${counter}${extLower}`);
    counter += 1;
  }

  return candidate;
};

const pruneEmptyDirs = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      pruneEmptyDirs(path.join(dirPath, entry.name));
    }
  }

  if (fs.readdirSync(dirPath).length === 0) {
    fs.rmdirSync(dirPath);
  }
};

const sourceRoots = [
  path.join(root, "files"),
  path.join(root, "public/images/original-site-files"),
  path.join(root, "public/images/ai-media-examples"),
];

let movedCount = 0;

for (const sourceRoot of sourceRoots) {
  const files = walkFiles(sourceRoot);

  for (const sourcePath of files) {
    if (path.basename(sourcePath) === ".DS_Store") {
      fs.unlinkSync(sourcePath);
      continue;
    }

    const rel = path.relative(root, sourcePath).replace(/\\/g, "/");
    const plan = resolveMovePlan(rel);
    if (!plan) {
      continue;
    }

    const ext = path.extname(sourcePath);
    const base = path.basename(sourcePath, ext);
    const targetPath = getUniqueTarget(plan.dir, plan.prefix, base, ext);

    ensureDir(path.dirname(targetPath));
    fs.renameSync(sourcePath, targetPath);
    movedCount += 1;
  }
}

["files", "public/images/original-site-files", "public/images/ai-media-examples"].forEach(
  (relativeDir) => {
    const absoluteDir = path.join(root, relativeDir);
    if (fs.existsSync(absoluteDir)) {
      pruneEmptyDirs(absoluteDir);
    }
  }
);

console.log(`normalize-media: moved ${movedCount} files`);
