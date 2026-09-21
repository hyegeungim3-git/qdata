/**
 * 검증 공통 설정 — verify.mjs(넓고 얕게)와 deepscan.mjs(좁고 깊게)가 함께 쓴다.
 *
 * ⚠️ 새 도메인 팩을 추가하면 여기 DOMAINS에 항목을 추가할 것.
 *    (src/domains/index.js 등록과 나란히 — 빠뜨리면 새 도메인이 검증에서 조용히 빠진다)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/* 도메인별 판정 기준
 *  banned      : 얕은 스캔(verify)용 금칙어 — 타 도메인 조직명·문서번호 접두
 *  deepExtra   : 깊은 스캔(deepscan)에서만 추가로 보는 업무 용어.
 *                해당 도메인에서 '정상 업무 용어'인 것은 절대 넣지 말 것.
 *                (예: 행정·제조는 협력사·사업장 주소를 실제로 다루므로
 *                 도로명주소·법정동·지번을 넣으면 오탐이 된다)
 *  deepSkip    : 깊은 스캔 제외 — 그 용어들이 원래 자기 콘텐츠인 원본 도메인
 */
/* 적용 사례별 판정 기준 — verify.mjs · adminscan.mjs 공용 정본.
 *  banned  : 그 사례 화면 어디에도 나오면 안 되는 말.
 *            표준 데모(중립)는 발주처 용어 전부가 금칙어,
 *            적용 사례는 '표준 데모 전용 말'(샘플 사업장·김지원)도 금칙어 —
 *            팩 섹션을 빠뜨려 중립 콘텐츠로 조용히 폴백된 화면을 잡기 위해서다.
 *  markers : 메뉴별로 첫 화면에 반드시 렌더돼야 하는 문자열(탭 안쪽 문자열 금지).
 * ⚠️ 새 적용 사례 팩을 추가하면 여기에도 등록할 것(안 하면 자동 검증에서 빠진다). */
const OTHER_CLIENTS = ["KOGAS", "kogas", "한국부동산원", "공시지가", "표준지", "한빛정밀", "한성시청", "새빛대학교병원"];
export const CASES = [
  {
    id: "standard", label: "표준 데모",
    // RoadQ는 도로공사 전용 서비스라 중립 화면에서만 금칙어(도로공사 사례에선 짝 서비스로 연결된다)
    banned: [...OTHER_CLIENTS, "한국도로공사", "도로공사", "EXTIS", "VDS", "경부선", "ex.co.kr", "한지훈", "이도현", "디지털계획처", "RoadQ"],
    markers: {
      "qd.overview": ["플랫폼 개요", "샘플 사업장", "AI가 활용할 수 있는 데이터 구축 과정"],
      "qd.sources": ["설비 PLC 라인 A", "엣지 게이트웨이"],
      "qd.pipeline": ["Connect", "Contextualize", "데이터셋별 진행 상태"],
      "qd.standardize": ["태그 표준 매핑", "용어 사전"],
      "qd.outputs": ["Knowledge Data", "Training Data"],
      "qd.quality": ["규칙 목록"],
      "qd.apps": ["AgentQ", "Cubeon"],
    },
  },
  {
    id: "expressway", label: "한국도로공사 적용 사례",
    banned: [...OTHER_CLIENTS, "샘플 사업장", "김지원", "demo.example"],
    markers: {
      "qd.overview": ["한국도로공사"],
      "qd.sources": ["VDS"],
      "qd.apps": ["RoadQ 서비스 데모 열기"],
      "data.catalog": ["VDS 5분 집계 시계열"],
      "eval.predops": ["통행속도 예측 모델"],
    },
  },
];

export const LANDING_MARKERS = ["AI-Ready Data Platform", "수집부터 활용까지 한 흐름으로", "데모 콘솔 열기", "한국도로공사 적용 사례"];

/* adminscan.mjs 호환(적용 사례별 마커·금칙어) — CASES에서 파생한다(정본은 위 한 곳) */
export const ADMIN_PAGES = Object.fromEntries(CASES.map(c => [c.id, Object.entries(c.markers)]));
export const ADMIN_BANNED = Object.fromEntries(CASES.map(c => [c.id, c.banned]));

/* 관리자 메뉴 전체 목록 — App.jsx의 라우팅 맵을 그대로 읽는다.
   여기에 목록을 하드코딩하면 메뉴가 늘어날 때 조용히 스캔에서 빠지므로
   소스를 정본으로 삼는다(등록 지점이 둘로 갈라지는 것을 막는다). */
export function adminMenus() {
  try {
    const here = path.dirname(fileURLToPath(import.meta.url));
    const app = path.resolve(here, "../../../../src/App.jsx");
    const s = fs.readFileSync(app, "utf8");
    const m = s.match(/'([a-z0-9.]+)':\s*<[A-Za-z]/g) || [];
    return [...new Set(m.map(x => x.match(/'([^']+)'/)[1]))];
  } catch {
    return [];
  }
}

export function findChrome() {
  const cands = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    (process.env.LOCALAPPDATA || "") + "\\Google\\Chrome\\Application\\chrome.exe",
  ].filter(Boolean);
  return cands.find(p => { try { return fs.existsSync(p); } catch { return false; } });
}

export const sleep = ms => new Promise(r => setTimeout(r, ms));

/* 캡처·스캔 전 상태 초기화 — 저장된 대화나 UI 설정이 판정을 오염시키지 않게 */
export const RESET_STORAGE = `(() => { try {
  Object.keys(localStorage).filter(k => k.startsWith('qdata.')).forEach(k => localStorage.removeItem(k));
} catch (e) {} })()`;
