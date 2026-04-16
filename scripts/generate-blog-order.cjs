const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const rootDir = path.resolve(__dirname, "..");
const blogDir = path.join(rootDir, "src", "content", "blog");
const outputFile = path.join(rootDir, "src", "generated", "blog-order.ts");

function getBlogFiles() {
  if (!fs.existsSync(blogDir)) {
    return [];
  }

  return fs
    .readdirSync(blogDir)
    .filter((fileName) => fileName.endsWith(".md"))
    .filter((fileName) => !fileName.startsWith("_"))
    .map((fileName) => path.join(blogDir, fileName));
}

function getCreatedTimestampFromGit(relativeFilePath) {
  try {
    const output = execFileSync(
      "git",
      ["log", "--diff-filter=A", "--follow", "--format=%ct", "-1", "--", relativeFilePath],
      {
        cwd: rootDir,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      },
    ).trim();

    if (output) {
      return Number(output) * 1000;
    }
  } catch (_error) {
    // Fall through to filesystem timestamps.
  }

  return null;
}

function getCreatedTimestamp(filePath) {
  const relativeFilePath = path.relative(rootDir, filePath);
  const gitTimestamp = getCreatedTimestampFromGit(relativeFilePath);

  if (gitTimestamp) {
    return gitTimestamp;
  }

  const stats = fs.statSync(filePath);
  const birthtimeMs = Number(stats.birthtimeMs || 0);
  const mtimeMs = Number(stats.mtimeMs || 0);

  if (birthtimeMs > 0) {
    return birthtimeMs;
  }

  return mtimeMs;
}

function buildModuleSource(entries) {
  return [
    "export const blogOrderTimestamps: Record<string, number> = {",
    ...entries.map(
      ({ slug, createdAtTimestamp }) => `  ${JSON.stringify(slug)}: ${Math.trunc(createdAtTimestamp)},`,
    ),
    "};",
    "",
  ].join("\n");
}

function main() {
  const entries = getBlogFiles()
    .map((filePath) => ({
      slug: path.basename(filePath, ".md"),
      createdAtTimestamp: getCreatedTimestamp(filePath),
    }))
    .sort((left, right) => right.createdAtTimestamp - left.createdAtTimestamp);

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, buildModuleSource(entries), "utf8");

  console.log(`Generated blog order manifest for ${entries.length} blog posts.`);
}

main();
