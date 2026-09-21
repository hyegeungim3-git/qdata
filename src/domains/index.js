/**
 * 도메인 팩 레지스트리
 * 코어 플랫폼(RootApp/UserApp)은 이 레지스트리를 통해서만 도메인 콘텐츠에 접근한다.
 * 새 도메인 추가 = 팩 파일 1개 작성 + 여기 등록이 전부여야 한다.
 */
import standard from "./standard.js";
import expressway from "./expressway.js";
import { demoStorage, makeGlobalStorageKey } from "../core/demoStorage.js";

/* QData 콘솔의 '적용 사례' 레지스트리.
 *  - standard   : 중립 표준 데모(기본값) — 제품 자체를 발주처명 없이 보여준다
 *  - expressway : 한국도로공사 적용 사례
 * 새 적용 사례 = 팩 파일 1개 + 여기 등록 (+ 검증 설정 scan-config.mjs 등록). */
export const DOMAINS = {
  [standard.id]: standard,
  [expressway.id]: expressway,
};

export const DOMAIN_LIST = [standard, expressway];

const STORAGE_KEY = makeGlobalStorageKey("activeDomain");

/* ── 커스텀 팩 (도메인 팩 스튜디오) ─────────────────────────────────
 * localStorage에 { baseId, overrides }로 저장 — 직렬화 가능한 필드만
 * 오버라이드하고 아이콘·함수는 베이스 팩에서 상속한다 (JSON 한계).
 * 정식 팩 승격 시에는 스튜디오의 JSON 내보내기를 _template.js에 옮긴다. */
export const CUSTOM_PACK_KEY = "qdata.customPack";
export const CUSTOM_ID = "custom";

export function loadCustomPack() {
  const pack = demoStorage.readJson(CUSTOM_PACK_KEY, null);
  return pack && pack.baseId && pack.overrides ? pack : null;
}
export function saveCustomPack(pack) {
  return demoStorage.writeJson(CUSTOM_PACK_KEY, pack);
}
export function deleteCustomPack() {
  return demoStorage.remove(CUSTOM_PACK_KEY);
}

/** 베이스 팩 + 오버라이드 병합 — 아이콘·함수·미지정 필드는 베이스 상속 */
export function buildCustomDomain(saved = loadCustomPack()) {
  if (!saved) return null;
  const base = DOMAINS[saved.baseId] || standard;
  const ov = saved.overrides || {};
  const orchBase = Array.isArray(base.orchestration) ? base.orchestration : base.orchestration ? [base.orchestration] : [];
  return {
    ...base,
    id: CUSTOM_ID,
    orgName: ov.orgName || base.orgName,
    orgShort: ov.orgShort || base.orgShort,
    platformTitle: ov.platformTitle || base.platformTitle,
    brandColor: ov.brandColor || base.brandColor,
    welcome: ov.welcome || base.welcome,
    statusBadge: ov.statusBadge || base.statusBadge,
    footerNote: ov.footerNote || base.footerNote,
    user: { ...base.user, ...(ov.user || {}) },
    workspaces: base.workspaces.map((w, i) => (ov.workspaceNames?.[i] ? { ...w, name: ov.workspaceNames[i] } : w)),
    suggestions: base.suggestions.map((s, i) => ({ ...s, ...(ov.suggestions?.[i] || {}) })),
    orchestration: orchBase.map((o, i) => ({ ...o, ...(ov.orchestration?.[i] || {}) })),
  };
}

/** 코어가 도메인을 조회하는 유일한 경로 — 커스텀 팩 포함 */
export function getDomain(id) {
  if (id === CUSTOM_ID) return buildCustomDomain();
  return DOMAINS[id] || null;
}
/** 포털 스위처용 — 커스텀 팩이 있으면 4번째로 노출 */
export function getDomainList() {
  const custom = buildCustomDomain();
  return custom ? [...DOMAIN_LIST, custom] : DOMAIN_LIST;
}

export function getActiveDomainId() {
  const saved = demoStorage.readText(STORAGE_KEY);
  if (saved === CUSTOM_ID && loadCustomPack()) return CUSTOM_ID;
  return saved && DOMAINS[saved] ? saved : standard.id;
}

export function setActiveDomainId(id) {
  return demoStorage.writeText(STORAGE_KEY, id);
}

/** 도메인 팩의 카탈로그 오버라이드를 기본 AGENT_TEAMS 위에 병합 */
export function mergeAgentTeams(baseTeams, domain) {
  const overrides = domain?.agentCatalog || {};
  return baseTeams.map(a => ({ ...a, ...(overrides[a.id] || {}) }));
}

export default DOMAINS;
