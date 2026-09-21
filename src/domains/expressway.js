/**
 * 도메인 팩 — 한국도로공사 적용 사례
 *
 * QData(중립 제품)를 한국도로공사 데이터 환경에 적용했을 때의 화면.
 * 수치·식별자 정본: docs/WORLD-LEDGER-EXPRESSWAY.md (RoadQ 데모와 같은 세계관)
 *  - qdata:        신규 QData 화면 콘텐츠 → expressway.qdata.js
 *  - adminContent: 재사용 관리자 화면 콘텐츠 → expressway.admin.js (mocks.js 상수명 키)
 */
import expresswayAdmin from "./expressway.admin.js";
import expresswayQdata from "./expressway.qdata.js";

const expressway = {
  id: "expressway",
  orgName: "한국도로공사",
  orgShort: "EX",
  sectorLabel: "도로·교통",
  platformTitle: "QData × 한국도로공사",
  brandColor: "#00539F",
  caseLabel: "한국도로공사 적용 사례",
  caseNote: "도로 시계열(VDS·프로브·RWIS)·시설 계측·기술문서를 QData로 AI-Ready 데이터화한 화면입니다.",
  qdata: expresswayQdata,
  adminContent: expresswayAdmin,
};

export default expressway;
