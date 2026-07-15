const state = {
  documents: [],
  lastResults: [],
};

const aliases = {
  출장: ["여비", "출장여비", "출장신청서", "출장복명서", "출장증빙서류", "여비정산서"],
  출장여비: ["여비", "국내여비", "국외여비", "출장신청서", "출장복명서", "여비정산서"],
  여비: ["출장여비", "국내여비", "국외여비", "운임", "숙박비", "일비", "식비"],
  정산: ["정산서", "증빙", "증빙서류", "첨부서류", "영수증", "집행내역"],
  서류: ["증빙", "증빙서류", "첨부서류", "제출서류", "영수증"],
  증빙: ["증빙서류", "첨부서류", "영수증", "카드전표", "계좌이체증명"],
  국내출장: ["국내여비", "출장신청서", "출장복명서", "운임영수증", "숙박비영수증"],
  해외출장: ["국외출장", "국외여비", "공무국외출장", "출입국사실증명", "E-ticket", "국외출장보고서"],
  국외출장: ["해외출장", "국외여비", "공무국외출장", "출입국사실증명", "E-ticket", "국외출장보고서"],
  회의비: ["회의록", "사전결재", "사전 내부결재 폐지", "참석자명단", "식사비", "다과비", "2026"],
  자문료: ["전문가활용비", "전문가자문료", "자문확인서", "자문보고서"],
  특강비: ["강사료", "강연료", "전문가활용비", "강연료청구서"],
  야근: ["특근", "초과근무", "야근식대", "특근식대", "식대"],
  특근: ["야근", "초과근무", "야근식대", "특근식대", "식대"],
  초과근무: ["야근", "특근", "야근식대", "특근식대", "초과근무일지", "초과근무내역"],
  초과근무일지: ["야근", "특근", "초과근무", "식대", "근무일시", "근무내용"],
  식대: ["야근", "특근", "초과근무", "야근식대", "특근식대"],
  회의: ["회의비", "회의록", "참석자명단"],
  학회: ["학회등록비", "학회참가비", "등록비", "참가확인서", "프로그램"],
  기자재: ["장비", "물품구매", "중앙구매", "비교견적서", "검수조서"],
  맥미니: ["Mac mini", "컴퓨터", "연구활동비", "중앙구매", "물품구매"],
  모니터: ["사무용기기", "사무용 주변기기", "연구실운영비", "연구활동비", "용도설명서"],
  주유비: ["유류비", "자가운전", "국내여비", "출장", "특별한 사유"],
  기름값: ["주유비", "유류비", "자가운전", "출장여비"],
  연구재료비: ["연구재료", "검수", "검수확인서", "100만원", "연차별 1000만원", "2026"],
  논문게재료: ["논문게재료", "게재료", "APC", "연구개발기간 종료", "2년", "2026"],
  kci: ["KCI", "등재지", "등재후보지", "학술지", "논문인정"],
};

const topicTemplates = [
  {
    id: "travelSettlement",
    priority: 100,
    triggers: ["출장여비", "출장 여비", "여비 정산", "출장 정산", "출장 서류", "출장 증빙", "여비 서류", "출장비 정산", "출장비 서류"],
    boostTerms: ["출장", "여비", "출장신청서", "출장복명서", "여비정산서", "국내여비", "국외여비", "운임영수증", "숙박비", "출입국사실증명"],
    suppressUnlessAsked: ["야근", "특근", "초과근무", "야근식대", "특근식대"],
    title: "출장 여비 정산 필요 서류",
    rows: [
      ["결론", "출장 여비 정산 질문은 야근·특근 식대가 아니라 국내여비 또는 국외여비 정산으로 처리합니다."],
      ["공통 서류", "출장신청서 또는 공무국외출장 허가문서, 여비정산서, 출장복명서 또는 결과보고서, 카드전표·계좌이체증명·영수증 등 지출 증빙이 필요합니다."],
      ["국내출장", "운임 영수증, 숙박비 영수증, 학회 프로그램 또는 참가확인 자료, 여비집행내역서를 함께 확인합니다."],
      ["해외출장", "공무국외출장 허가문서, 항공 E-ticket과 탑승권 또는 항공운임 영수증, 숙박비 영수증, 출입국사실증명, 국외출장보고서, 학회 프로그램·참가확인서·발표자료가 필요합니다."],
      ["학회 출장", "학회등록비는 여비와 분리하여 등록비 영수증, 참가자 성명 확인 자료, 학회 프로그램, 발표 초록 또는 발표자료, 참가확인서를 붙입니다."],
      ["중복 확인", "학회 제공 식사, 기내식, 숙박 포함 조식, 회의비와 중복되는 식비는 정산 때 감액 또는 제외 여부를 확인해야 합니다."],
      ["시스템 경로", "연구비요구신청 또는 여비 신청 메뉴에서 출장 구분, 기간, 장소, 운임, 숙박비, 일비, 식비, 환율과 증빙을 입력합니다."],
    ],
  },
  {
    id: "domesticTravel",
    priority: 115,
    triggers: ["국내출장", "국내학회", "국내여비", "국내여비 정산", "국내학회 출장", "관내출장", "관외출장"],
    boostTerms: ["국내여비", "출장신청서", "출장복명서", "운임영수증", "숙박비영수증", "일비", "식비"],
    suppressUnlessAsked: ["야근", "특근", "초과근무"],
    avoidTerms: ["해외출장", "국외출장", "국외여비", "공무국외", "출입국사실증명"],
    title: "국내출장·국내여비",
    rows: [
      ["결론", "국내 학회 출장비는 학회등록비와 국내여비를 분리하여 정산합니다."],
      ["필요 서류", "출장신청서, 출장복명서 또는 결과보고, 운임 영수증, 숙박비 영수증, 학회 프로그램 또는 참가확인서, 여비집행내역서가 필요합니다."],
      ["정산 항목", "교통비, 숙박비, 일비, 식비를 구분하여 입력하고 실제 지급 가능액은 직급, 출장지, 제공식 여부에 따라 확인합니다."],
      ["주의", "학회 제공 식사, 출장지 제공 식사, 회의비 집행 식사는 식비 중복 여부를 확인해야 합니다."],
    ],
  },
  {
    id: "internationalTravel",
    priority: 120,
    triggers: ["해외출장", "국외출장", "해외학회", "해외학회 출장", "국외여비", "국외여비 정산", "공무국외", "출입국"],
    boostTerms: ["국외여비", "공무국외출장", "E-ticket", "출입국사실증명", "국외출장보고서", "환율", "기내식", "비자발급"],
    suppressUnlessAsked: ["야근", "특근", "초과근무"],
    avoidTerms: ["국내출장", "국내여비", "관내출장", "관외출장"],
    title: "해외출장·국외여비",
    rows: [
      ["결론", "해외학회 비용은 학회등록비와 국외여비를 분리하여 처리합니다."],
      ["필요 서류", "공무국외출장 허가문서 또는 출장신청서, 항공 E-ticket과 탑승권, 항공운임 영수증, 숙박비 영수증, 출입국사실증명, 국외출장보고서가 필요합니다."],
      ["학회 증빙", "학회 프로그램, 참가확인서 또는 명찰, 발표자료 또는 논문초록, 발표 일정표를 함께 제출합니다."],
      ["정산 항목", "항공료, 국내·국외 이동비, 숙박비, 일비, 식비, 환율 기준일, 제공식 차감 여부를 확인합니다."],
      ["주의", "기내식, 학회 제공 식사, 숙박 포함 조식, 타 재원 지원액은 중복 지급되지 않도록 감액 또는 제외합니다."],
    ],
  },
  {
    id: "meeting",
    priority: 50,
    triggers: ["회의비", "회의록", "다과", "회의 식사"],
    boostTerms: ["회의비", "회의록", "사전결재", "사전 내부결재 폐지", "같은 연구개발기관", "참석자명단", "카드전표", "2026"],
    title: "회의비",
    rows: [
      ["결론", "2026년 연구재단 교육자료 기준으로 2026.5.6. 사용기준 개정 후 회의비 사용 시 사전 내부결재 폐지 및 같은 연구개발기관 소속 인원끼리 회의비 사용 가능이 확인됩니다."],
      ["필요 서류", "회의록 또는 회의 목적·일시·장소·내용·참석자 명단을 확인할 수 있는 자료, 카드전표 또는 계좌이체증명 등 지출 증빙을 갖춥니다."],
      ["기관 확인", "학교 시스템이나 산학협력단 자체규정, 해당 사업 지침이 더 엄격하면 그 기준을 함께 적용해야 합니다."],
      ["주의", "출장 식비와 회의비가 중복되지 않도록 확인해야 합니다."],
    ],
  },
  {
    id: "material",
    priority: 47,
    triggers: ["연구재료비", "연구재료", "검수확인서", "검수 간소화"],
    boostTerms: ["연구재료비", "연구재료", "검수", "검수확인서", "100만원", "연차별 1,000만원", "2026"],
    title: "연구재료비",
    rows: [
      ["결론", "2026년 정부연구비 사용 Q&A 기준으로 자체규정이 있으면 100만원 이하 연구재료 구매는 연차별 1,000만원 이내에서 검수 절차 간소화가 가능합니다."],
      ["증빙", "자체규정이 마련되어 있는 경우 검수확인서 외 추가 증명자료를 생략할 수 있습니다. 자체규정이 없으면 일반 구매·검수 증빙을 갖추어야 합니다."],
      ["주의", "연구재료비는 과제 종료일까지 구매와 검수가 완료되어야 하며, 장비·연구실운영비와 경계가 애매하면 연구계획서 계상 비목을 확인합니다."],
    ],
  },
  {
    id: "publication",
    priority: 44,
    triggers: ["논문게재료", "게재료", "APC", "논문 게재료"],
    boostTerms: ["논문게재료", "게재료", "APC", "연구개발기간 종료", "2년", "2026"],
    title: "논문게재료",
    rows: [
      ["결론", "2026년 정부연구비 사용 Q&A 기준으로 중앙행정기관의 장이 인정하는 경우 연구개발기간 종료일부터 2년 후까지 논문게재료 사용이 가능합니다."],
      ["입력 기준", "연구비통합관리시스템에는 실제 사용금액을 연구개발기간 종료일부터 2년 이내 입력해야 합니다."],
      ["증빙", "논문과 과제의 관련성, 게재료 청구·결제 자료, 거래명세 또는 영수증, 논문 정보와 게재 확인 자료를 함께 확인합니다."],
    ],
  },
  {
    id: "expert",
    priority: 50,
    triggers: ["자문료", "자문", "특강비", "특강", "강사료", "강연료", "전문가"],
    boostTerms: ["전문가활용비", "자문료", "강사료", "강연료", "자문보고서", "강연료청구서"],
    title: "전문가 활용비·자문료·특강비",
    rows: [
      ["결론", "자문료와 특강비는 연구활동비의 전문가 활용비 성격으로 처리합니다."],
      ["필요 서류", "특강 또는 자문 계획서, 청구서, 이력서, 통장사본, 개인정보 동의서, 자문보고서 또는 강의자료, 진행 사진이나 참석자 서명부가 필요합니다."],
      ["주의", "참여연구원이나 동일 연구과제 내부 구성원에게 지급 가능한지 먼저 확인해야 합니다."],
    ],
  },
  {
    id: "lectureEvidence",
    priority: 75,
    triggers: ["특강 증빙", "특강비 증빙", "특강 사진", "서명부", "학생 명단", "특강비 정산", "강사료 증빙"],
    boostTerms: ["강사료", "특강비", "전문가활용비", "강의자료", "참석자명단", "서명부", "사진", "강연료청구서"],
    title: "특강비 정산 증빙",
    rows: [
      ["결론", "학생 명단만으로 끝내기보다 특강 계획·결과, 강의자료, 참석자 명단 또는 서명부, 진행 사진을 함께 갖추는 방식이 안전합니다."],
      ["핵심 서류", "강사료 청구서, 전문가 계좌이체 승낙서 또는 통장사본, 이력서, 강의자료, 특강 실시 확인 자료, 참석자 명단 또는 서명부, 카드전표·계좌이체증명 등 지급 증빙을 준비합니다."],
      ["사진·서명부", "업로드 자료에서는 전문가 활용 증빙과 강연자료·활용자료가 요구되므로, 실제 실시 여부를 보강하기 위해 사진과 서명부를 같이 첨부하는 것을 권장합니다."],
      ["주의", "참여연구자 또는 동일 최소 단위부서·연구실 소속자에게 전문가활용비를 지급하는 것은 제한될 수 있으므로 대상자 소속을 먼저 확인합니다."],
    ],
  },
  {
    id: "overtimeLog",
    priority: 90,
    triggers: ["초과근무내역", "초과근무 확인서", "초과근무일지", "야근 일지", "특근 일지", "야근특근 일지"],
    boostTerms: ["초과근무내역", "초과근무일지", "근무일시", "근무장소", "근무자", "초과근무시간", "근무내용"],
    title: "초과근무내역 확인서류",
    rows: [
      ["결론", "야근·특근 식대 정산에는 실제 초과근무를 확인할 수 있는 초과근무내역 확인서류 또는 초과근무일지가 필요합니다."],
      ["필수 내용", "과제명, 과제번호, 연구책임자, 초과근무일자, 야근·주말·공휴일 구분, 근무장소, 근무자, 초과근무시간, 과제 관련 근무내용을 적습니다."],
      ["식대 연결", "식대 집행 일시, 식대 집행 장소, 식대 대상 인원, 1인당 10,000원 이내 집행 금액, 총액, 결제수단을 초과근무자 명단과 맞춥니다."],
      ["확인 문구", "해당 식대가 평일 점심, 회의비, 출장 식비와 중복되지 않고 실제 초과근무자에게 제공된 식대임을 확인하는 문구를 넣습니다."],
      ["첨부", "카드매출전표 또는 세금계산서·계좌이체증명, 지출결의서, 초과근무일지, 필요 시 연구자료 작성본이나 보고서 초안 등 연구수행 증빙을 붙입니다."],
    ],
  },
  {
    id: "meal",
    priority: 65,
    triggers: ["야근", "특근", "초과근무", "야근식대", "특근식대"],
    boostTerms: ["야근", "특근", "초과근무", "식대", "카드전표", "지출결의서"],
    title: "야근·특근 식대",
    rows: [
      ["결론", "야근·특근 식대는 현금성 수당이 아니라 연구과제 수행을 위한 초과근무 식대입니다."],
      ["대상", "참여연구자 또는 연구근접지원인력 중 해당 날짜에 실제 초과근무를 한 사람만 포함합니다. 참여연구원 전원이 자동 포함되는 것은 아닙니다."],
      ["금액 기준", "업로드 자료 기준으로 1인당 10,000원 이내이며 총액은 실제 초과근무 인원 수에 따라 계산합니다."],
      ["필요 서류", "카드전표 또는 계좌이체증명, 지출결의서, 초과근무 내역 확인서류 또는 초과근무일지가 필요합니다."],
      ["주의", "출장비 식비, 회의비, 평일 점심 식대와 중복되는 집행은 부적정 처리될 수 있습니다."],
    ],
  },
  {
    id: "conference",
    priority: 45,
    triggers: ["학회등록비", "학회비", "등록비", "참가비"],
    boostTerms: ["학회등록비", "학회 참가비", "등록비 영수증", "참가확인서", "논문초록", "발표자료"],
    title: "학회등록비",
    rows: [
      ["결론", "학회등록비는 출장 여비와 분리하여 학회 참가 비용으로 처리합니다."],
      ["필요 서류", "등록비 영수증, 참가자 성명 확인 자료, 학회 프로그램, 참가확인서 또는 명찰, 발표자료 또는 논문초록이 필요합니다."],
      ["주의", "종신 학회비나 과제와 직접 관련 없는 학회비는 지원이 제한될 수 있습니다."],
    ],
  },
  {
    id: "equipment",
    priority: 40,
    triggers: ["기자재", "장비", "맥미니", "컴퓨터", "중앙구매", "물품구매"],
    boostTerms: ["중앙구매", "물품구매", "비교견적서", "검수조서", "연구활동비", "연구시설장비비"],
    title: "기자재·컴퓨터 구매",
    rows: [
      ["결론", "컴퓨터와 장비는 연구계획서의 계상 비목과 실제 연구 목적성을 먼저 확인한 뒤 구매 절차를 진행합니다."],
      ["필요 서류", "물품구매요청서, 견적서, 비교견적서, 물품 규격서, 연구계획서 관련 근거, 거래명세서, 검수조서, 물품 사진이 필요합니다."],
      ["주의", "연구계획서에 미계상된 장비나 범용성이 큰 사무기기는 사전 승인 또는 비목 확인이 필요합니다."],
    ],
  },
  {
    id: "monitorOffice",
    priority: 85,
    triggers: ["모니터", "연구활동비 모니터", "연구실운영비 모니터", "사무용 주변기기", "용도설명 모니터", "연구실 환경개선"],
    boostTerms: ["모니터", "연구실운영비", "사무용 기기", "사무용 주변기기", "연구활동비", "용도설명서"],
    title: "모니터 구매·연구실운영비",
    rows: [
      ["결론", "모니터는 연구기자재로 단정하지 않고, 연구과제 수행에 필요한 사무용 주변기기라면 연구활동비-연구실운영비로 검토할 수 있습니다."],
      ["권장 논리", "연구실 환경개선만으로 설명하지 말고 연구자료 분석, 논문·보고서 작성, 데이터 코딩, 온라인 회의, 학술발표 준비에 필요한 기존 PC·노트북 연결용 주변기기로 설명합니다."],
      ["용도 문구", "본 모니터는 연구시설·장비가 아닌 연구활동비-연구실운영비의 사무용 주변기기로, 연구자료 분석과 연구성과물 작성을 위해 기존 연구용 PC 또는 노트북에 연결하여 사용합니다."],
      ["증빙", "견적서, 용도설명서, 구매규격서, 연구계획서 또는 실행예산표, 거래명세서, 카드전표 또는 세금계산서, 검수자료와 설치 사진을 갖춥니다."],
      ["주의", "개인 편의, 단순 분위기 개선, TV 겸용, 고가·고사양 필요성 불명확한 구매는 불인정 위험이 있습니다."],
    ],
  },
  {
    id: "fuel",
    priority: 82,
    triggers: ["주유비", "기름값", "유류비", "자가운전", "자차", "개인차량"],
    boostTerms: ["자가운전", "유류비", "국내여비", "출장", "특별한 사유", "도서산간", "무거운 짐"],
    title: "주유비·자가운전 유류비",
    rows: [
      ["결론", "일반적인 연구활동비 항목으로 주유비를 자유롭게 쓰는 것은 어렵고, 출장 여비 중 자가운전 유류비로 인정될 특별한 사유가 있을 때만 검토하는 것이 안전합니다."],
      ["가능 사유", "도서산간·오지 출장, 대중교통 이용 곤란, 과제 관련 무거운 장비나 자료 운반 등 자가운전이 불가피한 사유가 필요합니다."],
      ["처리 방향", "연구활동비의 일반 운영비가 아니라 국내여비 또는 출장비 맥락에서 출장신청서, 출장목적, 이동구간, 자가운전 사유, 영수증을 함께 정리합니다."],
      ["주의", "일상 출퇴근, 연구실 방문, 개인 차량 유지비, 일반 주유비는 연구비 집행으로 보기 어렵습니다."],
    ],
  },
  {
    id: "kci",
    priority: 72,
    triggers: ["KCI", "kci", "등재후보", "등재 후보", "등재지", "학술지 논문 인정", "논문 인정"],
    boostTerms: ["KCI", "등재지", "등재후보지", "학술지", "논문", "연구재단"],
    title: "KCI 학술지 논문 인정",
    rows: [
      ["결론", "KCI 등재지만 가능한지, 등재후보지도 가능한지는 해당 사업 공고·협약·평가지표 문구를 우선 확인해야 합니다."],
      ["판단 기준", "지침에 'KCI 등재지'라고만 되어 있으면 등재후보지는 제외될 수 있고, 'KCI 등재(후보)지' 또는 '등재지 및 등재후보지'라고 되어 있으면 후보지도 포함될 수 있습니다."],
      ["실무 처리", "학술지명, ISSN, KCI 등재 구분, 게재일, 논문과 과제 관련성, 사업별 성과 인정 기준을 함께 확인합니다."],
      ["주의", "연구재단 일반 기준 하나로 단정하지 말고 해당 사업의 성과 인정 문구를 근거로 답해야 합니다."],
    ],
  },
];

const form = document.querySelector("#searchForm");
const queryInput = document.querySelector("#queryInput");
const conversation = document.querySelector("#conversation");
const sources = document.querySelector("#sources");
const resultCount = document.querySelector("#resultCount");
const kbStatus = document.querySelector("#kbStatus");
const statusPanel = document.querySelector(".status-panel");
const clearButton = document.querySelector("#clearButton");

init();

async function init() {
  try {
    const response = await fetch("./data/kb-index.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    state.documents = payload.documents || [];
    kbStatus.textContent = `${state.documents.length.toLocaleString("ko-KR")}개 근거 로드됨`;
    statusPanel.classList.add("ready");
  } catch (error) {
    kbStatus.textContent = "자료 로드 실패";
    addMessage("assistant", "자료 파일을 불러오지 못했습니다. GitHub Pages 배포 경로에서 data/kb-index.json 파일이 있는지 확인해 주세요.");
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = queryInput.value.trim();
  if (!query) return;
  runSearch(query);
  queryInput.value = "";
});

document.querySelectorAll("[data-query]").forEach((button) => {
  button.addEventListener("click", () => {
    const query = button.getAttribute("data-query");
    queryInput.value = query;
    runSearch(query);
    queryInput.value = "";
  });
});

clearButton.addEventListener("click", () => {
  queryInput.value = "";
  conversation.innerHTML = "";
  sources.innerHTML = "";
  resultCount.textContent = "0개";
  addMessage("assistant", "검색 대화를 초기화했습니다.");
});

function runSearch(query) {
  addMessage("user", escapeHtml(query));
  const topic = detectTopic(query);
  const results = searchDocuments(query, 8, topic);
  state.lastResults = results;
  addMessage("assistant", buildAnswer(topic, results));
  renderSources(query, results);
}

function searchDocuments(query, limit, topic) {
  const terms = expandTerms(tokenize(query));
  return state.documents
    .map((document) => ({ ...document, score: scoreDocument(document, terms, query, topic) }))
    .filter((document) => document.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function tokenize(value) {
  return value
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);
}

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^0-9a-z가-힣]/g, "");
}

function expandTerms(terms) {
  const expanded = new Set();
  terms.forEach((term) => {
    expanded.add(term);
    expanded.add(normalize(term));
    (aliases[term] || []).forEach((alias) => expanded.add(alias));
    (aliases[normalize(term)] || []).forEach((alias) => expanded.add(alias));
  });
  return Array.from(expanded).filter(Boolean);
}

function detectTopic(query) {
  const compactQuery = normalize(query);
  const candidates = topicTemplates
    .map((topic) => {
      const triggerHits = topic.triggers.filter((trigger) => compactQuery.includes(normalize(trigger))).length;
      const boostHits = (topic.boostTerms || []).filter((term) => compactQuery.includes(normalize(term))).length;
      return { topic, score: triggerHits * 10 + boostHits };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.topic.priority + b.score - (a.topic.priority + a.score));

  return candidates[0]?.topic || null;
}

function scoreDocument(document, terms, query, topic) {
  const title = String(document.title || "");
  const unit = String(document.unit || "");
  const text = String(document.text || "");
  const haystack = `${title} ${unit} ${text}`.toLowerCase();
  const compactHaystack = normalize(haystack);
  const compactQuery = normalize(query);
  const compactTitle = normalize(title);
  const compactUnit = normalize(unit);
  const compactTitleUnit = normalize(`${title} ${unit}`);
  let score = document.sourceType === "verified" ? 28 : 0;

  terms.forEach((term) => {
    const lower = term.toLowerCase();
    const compact = normalize(term);
    if (!compact) return;
    score += countOccurrences(haystack, lower) * 4;
    if (compactHaystack.includes(compact)) score += 3;
    if (compactTitle.includes(compact)) score += 14;
    if (compactUnit.includes(compact)) score += 8;
  });

  const officialQuery =
    /(2026|연구재단|정부연구비|사용기준|교육자료|Q&A|상세정산|지적사례|연구지원INFO)/i.test(query) ||
    /(회의비|사전결재|사전내부결재|연구재료비|검수|논문게재료|정산|증빙)/.test(query);

  if (officialQuery) {
    if (/2026년한국연구재단권역별연구개발비교육자료/.test(compactTitle)) score += 220;
    if (/2026년정부연구비사용q/.test(compactTitle)) score += 220;
    if (/2025실시대학재정지원사업비상세정산/.test(compactTitle)) score += 160;
    if (/연구지원info2026622/.test(compactTitle)) score += 130;
    if (/26년해외출장|jalt2026|출장정리/.test(compactTitle)) score -= 90;
  }

  if (topic) {
    if (topic.id === "domesticTravel") {
      if (/(국내출장|국내여비|국내학회|관내출장|관외출장)/.test(compactTitleUnit)) score += 160;
      if (/(해외출장|국외출장|국외여비|공무국외)/.test(compactTitleUnit)) score -= 160;
    }
    if (topic.id === "internationalTravel") {
      if (/(해외출장|국외출장|국외여비|공무국외)/.test(compactTitleUnit)) score += 160;
      if (/(국내출장|국내여비|국내학회|관내출장|관외출장)/.test(compactTitleUnit)) score -= 160;
    }
    if (topic.id === "meeting") {
      if (/2026년한국연구재단권역별연구개발비교육자료/.test(compactTitle)) score += 260;
      if (/회의비사용기준변경|사전내부결재폐지|같은연구개발기관/.test(compactHaystack)) score += 120;
      if (/26년해외출장|jalt2026|출장정리/.test(compactTitle)) score -= 120;
    }
    if (topic.id === "material") {
      if (/2026년정부연구비사용q/.test(compactTitle)) score += 260;
      if (/연구재료구입시증명자료생략가능|100만원이하|검수절차간소화/.test(compactHaystack)) score += 140;
      if (/26년해외출장|jalt2026|출장정리/.test(compactTitle)) score -= 120;
    }
    if (topic.id === "publication") {
      if (/2026년정부연구비사용q/.test(compactTitle)) score += 280;
      if (/논문게재료과제종료후2년|연구개발기간종료일로부터2년|논문게재료/.test(compactHaystack)) score += 120;
      if (/26년해외출장|jalt2026|출장정리/.test(compactTitle)) score -= 120;
    }
    if (topic.id === "overtimeLog" || topic.id === "meal") {
      if (/야근특근식대|초과근무내역|초과근무일지|식대야간주말/.test(compactHaystack)) score += 180;
      if (/(출장여비|국내여비|국외여비|회의비)/.test(compactTitleUnit) && !/(출장|회의)/.test(compactQuery)) score -= 90;
    }
    if (topic.id === "monitorOffice") {
      if (/연구실운영비|사무용기기|사무용소프트웨어|연구실운영에필요한/.test(compactHaystack)) score += 180;
      if (/연구시설장비비/.test(compactTitleUnit) && !/장비/.test(compactQuery)) score -= 70;
    }
    if (topic.id === "fuel") {
      if (/자가운전|유류비|도서산간|무거운짐|국내여비/.test(compactHaystack)) score += 150;
      if (/야근특근식대|회의비/.test(compactHaystack)) score -= 80;
    }

    (topic.boostTerms || []).forEach((term) => {
      if (compactHaystack.includes(normalize(term))) score += 18;
    });
    topic.triggers.forEach((trigger) => {
      if (compactHaystack.includes(normalize(trigger))) score += 10;
    });

    (topic.suppressUnlessAsked || []).forEach((term) => {
      const compactTerm = normalize(term);
      if (compactHaystack.includes(compactTerm) && !compactQuery.includes(compactTerm)) {
        score -= 120;
      }
    });

    (topic.avoidTerms || []).forEach((term) => {
      if (compactHaystack.includes(normalize(term))) score -= 80;
    });
  }

  return score;
}

function countOccurrences(text, term) {
  if (!term) return 0;
  let count = 0;
  let index = text.indexOf(term);
  while (index !== -1) {
    count += 1;
    index = text.indexOf(term, index + term.length);
  }
  return count;
}

function buildAnswer(topic, results) {
  if (!results.length && !topic) {
    return `
      <div class="answer-section">
        <h3>업로드 자료에서 확인 불가</h3>
        <p>현재 공개 지식베이스에서 질문과 직접 연결되는 근거를 찾지 못했습니다. 비목, 금액, 증빙, 메뉴 이름을 함께 입력해 주세요.</p>
      </div>
    `;
  }

  if (!topic) {
    const topSources = buildTopSources(results);
    return `
      <div class="answer-section">
        <h3>검색 결과 요약</h3>
        <p>질문과 관련된 근거 ${results.length}건을 찾았습니다. 오른쪽 근거 자료에서 문서명과 내용을 확인해 주세요.</p>
        <div class="answer-grid">
          <div class="answer-row"><span>상위 근거</span><span>${topSources}</span></div>
          <div class="answer-row"><span>주의</span><span>근거 문서에서 직접 확인되는 내용만 확정 답변으로 사용하세요.</span></div>
        </div>
      </div>
    `;
  }

  const rows = topic.rows
    .map(([label, value]) => `<div class="answer-row"><span>${escapeHtml(label)}</span><span>${escapeHtml(value)}</span></div>`)
    .join("");
  const topSources = buildTopSources(results);

  return `
    <div class="answer-section">
      <h3>${escapeHtml(topic.title)}</h3>
      <div class="answer-grid">${rows}</div>
      <div class="answer-grid">
        <div class="answer-row"><span>근거</span><span>${topSources || "검색 근거 없음. 업로드 자료를 추가 확인하세요."}</span></div>
      </div>
    </div>
  `;
}

function buildTopSources(results) {
  return results
    .slice(0, 3)
    .map((result) => `${escapeHtml(result.title || "제목 없음")} ${escapeHtml(result.unit || "")}`)
    .join("<br>");
}

function renderSources(query, results) {
  resultCount.textContent = `${results.length}개`;
  if (!results.length) {
    sources.innerHTML = '<div class="empty-state">검색 결과가 없습니다.</div>';
    return;
  }

  const terms = tokenize(query);
  sources.innerHTML = results
    .map((result) => {
      const snippet = makeSnippet(result.text, terms);
      return `
        <article class="source-card">
          <h3>${escapeHtml(result.title || "제목 없음")}</h3>
          <div class="source-meta">
            <span>${escapeHtml(result.unit || "")}</span>
            <span class="score-pill">score ${result.score}</span>
          </div>
          <p>${snippet}</p>
        </article>
      `;
    })
    .join("");
}

function makeSnippet(text, terms) {
  const raw = String(text || "").replace(/\s+/g, " ").trim();
  const normalizedRaw = raw.toLowerCase();
  const found = terms.find((term) => normalizedRaw.includes(term.toLowerCase()));
  const index = found ? normalizedRaw.indexOf(found.toLowerCase()) : 0;
  const start = Math.max(0, index - 90);
  const snippet = raw.slice(start, start + 360);
  return highlight(escapeHtml(`${start > 0 ? "..." : ""}${snippet}${raw.length > start + 360 ? "..." : ""}`), terms);
}

function highlight(html, terms) {
  let output = html;
  terms
    .filter((term) => term.length > 1)
    .slice(0, 6)
    .forEach((term) => {
      const safeTerm = escapeRegExp(escapeHtml(term));
      output = output.replace(new RegExp(safeTerm, "gi"), (match) => `<mark>${match}</mark>`);
    });
  return output;
}

function addMessage(role, html) {
  const article = document.createElement("article");
  article.className = `message ${role}`;
  article.innerHTML = `<div class="bubble">${html}</div>`;
  conversation.appendChild(article);
  conversation.scrollTop = conversation.scrollHeight;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
