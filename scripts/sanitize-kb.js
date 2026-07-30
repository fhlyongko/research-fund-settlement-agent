const fs = require("node:fs");

const path = "data/kb-index.json";
const payload = JSON.parse(fs.readFileSync(path, "utf8"));
let residentNumbers = 0;
let phoneNumbers = 0;
const beforeCount = (payload.documents || []).length;

payload.documents = (payload.documents || []).filter((document) => {
  if (document.sourceType === "verified") return true;
  return /^S0[1-9]_/.test(String(document.id || ""));
});
payload.documentCount = payload.documents.length;

for (const document of payload.documents || []) {
  document.text = String(document.text || "")
    .replace(/\b\d{6}-?[1-4]\d{6}\b/g, () => {
      residentNumbers += 1;
      return "[resident-number redacted]";
    })
    .replace(/\b01[016789]-?\d{3,4}-?\d{4}\b/g, () => {
      phoneNumbers += 1;
      return "[phone redacted]";
    });
}

fs.writeFileSync(path, JSON.stringify(payload), "utf8");
console.log(`Masked resident-number patterns: ${residentNumbers}`);
console.log(`Masked phone-number patterns: ${phoneNumbers}`);
console.log(`Public documents: ${beforeCount} -> ${payload.documentCount}`);
