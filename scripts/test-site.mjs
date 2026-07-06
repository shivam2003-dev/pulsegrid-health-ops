import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const requiredPages = [
  "index.html",
  "dashboard.html",
  "intake.html",
  "forecasts.html",
  "redistribution.html",
  "facilities.html",
  "architecture.html",
  "submission.html",
];

const forbiddenPatterns = [
  /sk-or-v1-/i,
  /href=["'][^"']*github\.(?:com|io)[^"']*["']/i,
  /href=["'][^"']*\.md["']/i,
  /Read the write-up/i,
  /Full solution blueprint/i,
];

async function exists(file) {
  try {
    await stat(path.join(root, file));
    return true;
  } catch {
    return false;
  }
}

function hrefs(html) {
  return [...html.matchAll(/\bhref=["']([^"']+)["']/g)].map((match) => match[1]);
}

for (const page of requiredPages) {
  if (!(await exists(page))) {
    throw new Error(`Missing required page: ${page}`);
  }
}

const files = await readdir(root);
const htmlPages = files.filter((file) => file.endsWith(".html"));

for (const file of [...htmlPages, "app.js", "styles.css", "phase.md"]) {
  const text = await readFile(path.join(root, file), "utf8");
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(text)) {
      throw new Error(`Forbidden pattern ${pattern} found in ${file}`);
    }
  }
}

for (const file of htmlPages) {
  const html = await readFile(path.join(root, file), "utf8");
  if (!html.includes('href="styles.css"')) {
    throw new Error(`${file} does not include shared stylesheet`);
  }
  for (const href of hrefs(html)) {
    if (href.startsWith("#") || href === "styles.css") continue;
    if (/^https?:\/\//i.test(href)) {
      throw new Error(`${file} has external link: ${href}`);
    }
    const target = href.split("#")[0];
    if (target && !(await exists(target))) {
      throw new Error(`${file} links to missing target: ${href}`);
    }
  }
}

console.log(`site-ok: ${htmlPages.length} pages, ${requiredPages.length} required pages`);
