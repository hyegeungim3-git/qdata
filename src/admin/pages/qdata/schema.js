/**
 * QData 콘솔 신규 화면의 데이터 스키마 정본 + 조회 경로.
 *
 * 팩(domain)의 `qdata` 필드가 화면 콘텐츠를 공급한다. 섹션 단위로 병합하며,
 * 팩이 어떤 섹션을 생략하면 표준 데모(standard 팩)의 같은 섹션으로 폴백한다 —
 * 새 적용 사례 팩을 만들 때 모든 섹션을 한 번에 채우지 않아도 화면이 깨지지 않게.
 * (단, 폴백은 '중립 콘텐츠 노출'이므로 적용 사례 팩은 결국 전 섹션을 채워야 한다.)
 *
 * qdata = {
 *   orgLabel, asOf,
 *   overview:    { kpis:[{label,value,note?,tone?}], alerts:[{severity,title,body,to}] },
 *   sources:     { categories:[{id,label,examples}],
 *                  connectors:[{id,name,category,protocol,cadence,status,lastSync,volume,note?}],
 *                  edge:{ gateways:[{id,name,site,status,buffered,lastOutage}], summary:[{label,value,tone?}], note },
 *                  protocols:[string] },
 *   pipeline:    { stages:[{key,label,ko,desc,count,detail}] (6개 고정 — Connect~Ready),
 *                  datasets:[{id,name,source,reached(0~5),status,issue?}] },
 *   standardize: { stats:[{label,value,note?,tone?}], tagMappings:[{raw,source,standard,unit,rule,status}],
 *                  unitRules:[{from,to,factor,scope}], glossary:[{term,synonyms,definition,owner}],
 *                  relations:[{from,rel,to}] },
 *   outputs:     [{id:'knowledge'|'context'|'structured'|'training',label,engine,desc,metrics:[{label,value}],
 *                  items:[{name,size,updated,consumer}]}],
 *   quality:     { summary:[{label,value,note?,tone?}], rules:[{id,name,type,target,condition,result,detail,auto}] },
 *   apps:        [{id,product,name,desc,uses:[output id],link?:{label,url}}],
 * }
 * tone: 'emerald' | 'amber' | 'rose' (생략 시 중립)
 */
import standard from "../../../domains/standard.js";

const SECTIONS = ["overview", "sources", "pipeline", "standardize", "outputs", "quality", "apps"];

/** 팩의 qdata를 섹션 단위로 표준 데모와 병합해 돌려준다 — 신규 화면의 유일한 조회 경로 */
export function getQdata(domain) {
  const base = standard.qdata;
  const own = domain?.qdata || {};
  const out = { orgLabel: own.orgLabel || base.orgLabel, asOf: own.asOf || base.asOf };
  for (const k of SECTIONS) out[k] = own[k] !== undefined ? own[k] : base[k];
  return out;
}

export const STAGE_KEYS = ["connect", "parse", "clean", "standardize", "contextualize", "ready"];
