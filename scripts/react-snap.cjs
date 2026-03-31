const { run } = require("react-snap");

const defaultChromePath =
  process.platform === "darwin"
    ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    : "/usr/bin/google-chrome-stable";

run({
  source: "dist",
  include: [
    "/",
    "/pricing",
    "/blog",
    "/post/which-social-media-management-tool-is-best-for-you",
    "/post/how-to-schedule-a-post-on-social-media",
    "/post/how-to-become-a-good-community-manager",
    "/post/reach-vs-impressions-in-social-media-marketing",
    "/post/how-to-boost-instagram-engagement-in-2026",
    "/privacy-policy",
    "/terms-and-services",
    "/faq",
    "/contact",
  ],
  inlineCss: false,
  skipThirdPartyRequests: true,
  concurrency: 1,
  puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
  puppeteerExecutablePath:
    process.env.PUPPETEER_EXECUTABLE_PATH || defaultChromePath,
});
