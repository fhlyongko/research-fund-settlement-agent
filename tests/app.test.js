const fs = require("node:fs");
const vm = require("node:vm");

function element() {
  return {
    textContent: "",
    innerHTML: "",
    value: "",
    className: "",
    scrollTop: 0,
    scrollHeight: 0,
    classList: { add() {} },
    addEventListener() {},
    appendChild() {},
    getAttribute() { return ""; },
  };
}

const sandbox = {
  console,
  fetch: async () => ({ ok: true, json: async () => ({ documents: [] }) }),
  document: {
    querySelector() { return element(); },
    querySelectorAll() { return []; },
    createElement() { return element(); },
  },
};

vm.createContext(sandbox);
vm.runInContext(fs.readFileSync("assets/app.js", "utf8"), sandbox);

const cases = [
  ["출장 여비 정산시 필요한 서류 알려줘", "travelSettlement"],
  ["국내학회 출장 국내여비 숙박 교통 일비 식비 정산", "domesticTravel"],
  ["해외학회 출장 국외여비 정산 증빙 서류", "internationalTravel"],
  ["회의비 카드를 주말에 사용할 수 있나", "meeting"],
  ["자문료 지급 절차와 증빙", "expert"],
  ["특강비 정산 학생 명단 사진 서명부", "lectureEvidence"],
  ["야근 특근 식대 참여연구원 모두 포함 가능한가", "meal"],
  ["초과근무내역 확인서류 야근 특근 일지", "overtimeLog"],
  ["연구활동비 연구실운영비 모니터 구매 용도설명", "monitorOffice"],
  ["연구활동비 주유비 기름값 청구", "fuel"],
  ["KCI 등재후보지 논문 인정", "kci"],
  ["2026 연구재료비 100만원 이하 검수확인서", "material"],
  ["논문게재료 APC 연구기간 종료 후 정산", "publication"],
  ["맥미니 200만원 중앙구매 절차", "equipment"],
  ["내년도 예산을 올해 미리 당겨서 사용할 수 있나", "budgetAdvance"],
];

let failed = 0;
for (const [query, expected] of cases) {
  const actual = vm.runInContext(`detectTopic(${JSON.stringify(query)})?.id || null`, sandbox);
  if (actual !== expected) {
    failed += 1;
    console.error(`FAIL ${JSON.stringify(query)}: expected=${expected}, actual=${actual}`);
  } else {
    console.log(`PASS ${expected}: ${query}`);
  }
}

if (failed) process.exit(1);
