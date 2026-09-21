/**
 * 적용 사례 팩 계약 검사 — CI가 push마다 실행한다.
 * 팩이 QData 콘솔 스키마(src/admin/pages/qdata/schema.js)와 재사용 화면 상수 계약을 지키는지 본다.
 * 조용한 누락(키 오타 → 화면이 표준 데모로 폴백)을 빌드 전에 잡기 위해서다.
 */
import { DOMAINS, DOMAIN_LIST } from '../src/domains/index.js'
import * as mocks from '../src/admin/mocks.js'
import fs from 'node:fs'

const errors = []
const check = (cond, msg) => { if (!cond) errors.push(msg) }

const SECTIONS = ['overview', 'sources', 'pipeline', 'standardize', 'outputs', 'quality', 'apps']
const STAGES = ['connect', 'parse', 'clean', 'standardize', 'contextualize', 'ready']
const OUTPUTS = ['knowledge', 'context', 'structured', 'training']
const STATUS = ['정상', '완료', '통과', '매핑', '주의', '진행', '버퍼링', '경고', '미매핑', '위반', '중단']
const TONES = [undefined, 'emerald', 'amber', 'rose']
// 콘솔 메뉴 id는 App.jsx 라우팅 맵이 정본 — 목록을 여기 하드코딩하지 않는다
const app = fs.readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
const MENUS = [...app.matchAll(/'([a-z0-9.]+)':\s*</g)].map(m => m[1])

check(DOMAIN_LIST[0]?.id === 'standard', '기본 팩(DOMAIN_LIST[0])은 중립 standard여야 합니다.')
check(Object.keys(DOMAINS).length === DOMAIN_LIST.length, 'DOMAINS와 DOMAIN_LIST가 일치하지 않습니다.')
check(MENUS.length >= 10, `App.jsx에서 메뉴를 읽지 못했습니다(${MENUS.length}개).`)

for (const d of DOMAIN_LIST) {
  const p = `[${d.id}]`
  for (const k of ['orgName', 'caseLabel', 'caseNote', 'brandColor']) check(typeof d[k] === 'string' && d[k].trim(), `${p} ${k}가 비어 있습니다.`)
  const q = d.qdata
  check(q && typeof q === 'object', `${p} qdata가 없습니다.`)
  if (!q) continue
  // 표준 데모는 전 섹션 필수, 적용 사례는 생략 시 폴백되지만 여기서 드러낸다
  for (const s of SECTIONS) check(q[s] !== undefined, `${p} qdata.${s} 누락 — 화면이 표준 데모로 폴백됩니다.`)
  if (q.pipeline) {
    check(JSON.stringify(q.pipeline.stages?.map(s => s.key)) === JSON.stringify(STAGES), `${p} pipeline.stages는 ${STAGES.join('→')} 6개여야 합니다.`)
    for (const ds of q.pipeline.datasets || []) {
      check(Number.isInteger(ds.reached) && ds.reached >= 0 && ds.reached <= 5, `${p} 데이터셋 ${ds.id} reached는 0~5 정수여야 합니다.`)
      check(STATUS.includes(ds.status), `${p} 데이터셋 ${ds.id} 상태 '${ds.status}'를 배지가 모릅니다.`)
    }
  }
  if (q.outputs) {
    check(JSON.stringify(q.outputs.map(o => o.id).sort()) === JSON.stringify([...OUTPUTS].sort()), `${p} outputs는 ${OUTPUTS.join('·')} 4종이어야 합니다.`)
  }
  if (q.apps && q.outputs) {
    for (const a of q.apps) for (const u of a.uses || []) check(OUTPUTS.includes(u), `${p} apps.${a.id}가 없는 산출물 '${u}'를 씁니다.`)
  }
  if (q.overview) {
    for (const a of q.overview.alerts || []) check(MENUS.includes(a.to), `${p} 알림 '${a.title}'의 이동 대상 '${a.to}'가 콘솔 메뉴에 없습니다.`)
    for (const k of q.overview.kpis || []) check(TONES.includes(k.tone), `${p} KPI '${k.label}' tone '${k.tone}' 미지원`)
  }
  for (const c of q.sources?.connectors || []) check(STATUS.includes(c.status), `${p} 커넥터 ${c.id} 상태 '${c.status}'를 배지가 모릅니다.`)
  for (const r of q.quality?.rules || []) check(STATUS.includes(r.result), `${p} 품질 규칙 ${r.id} 결과 '${r.result}'를 배지가 모릅니다.`)
  // 재사용 화면 콘텐츠: 키는 mocks.js 상수명이어야 applyAdminDomain이 덮어쓴다(오타는 조용히 무시된다)
  for (const key of Object.keys(d.adminContent || {})) check(key in mocks, `${p} adminContent.${key}는 mocks.js에 없는 상수입니다(조용히 무시됨).`)
}

if (errors.length) {
  console.error(`Domain pack validation failed (${errors.length})`)
  for (const e of errors) console.error(`- ${e}`)
  process.exit(1)
}
console.log(`Domain pack validation passed: ${DOMAIN_LIST.length} cases (${DOMAIN_LIST.map(d => d.id).join(', ')}), ${MENUS.length} console menus`)
