const fs = require("node:fs");

const app = fs.readFileSync("assets/app.js", "utf8");
const html = fs.readFileSync("index.html", "utf8");
const kb = JSON.parse(fs.readFileSync("data/kb-index.json", "utf8"));
const errors = [];

if (!app.includes("출장 여비 정산 필요 서류")) errors.push("Korean app content is missing or corrupted.");
if (!html.includes('<meta charset="utf-8"')) errors.push("UTF-8 declaration is missing.");
if (!html.includes('lang="ko"')) errors.push("Korean language declaration is missing.");
if (!Array.isArray(kb.documents) || kb.documents.length !== kb.documentCount) {
  errors.push(`Knowledge-base count mismatch: documents=${kb.documents?.length}, declared=${kb.documentCount}`);
}
if (kb.documents.some((document) => String(document.id || "").startsWith("TRAVEL_EXPENSE_FILE:"))) {
  errors.push("Private travel-expense source is present in the public knowledge base.");
}
if (kb.documents.some((document) => String(document.title || "").includes("26년 해외출장 정리"))) {
  errors.push("Private travel summary is present in the public knowledge base.");
}

const raw = JSON.stringify(kb);
const sensitivePatterns = [
  [/\b\d{6}-?[1-4]\d{6}\b/g, "resident registration number"],
  [/\b01[016789]-?\d{3,4}-?\d{4}\b/g, "mobile phone number"],
];

for (const [pattern, label] of sensitivePatterns) {
  const matches = raw.match(pattern) || [];
  if (matches.length) errors.push(`${label}: ${matches.length} possible unmasked value(s)`);
}

if (errors.length) {
  errors.forEach((error) => console.error(`FAIL ${error}`));
  process.exit(1);
}

console.log(`PASS content integrity: ${kb.documents.length} documents`);
console.log("PASS sensitive numeric pattern scan");
