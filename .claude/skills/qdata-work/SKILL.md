---
name: qdata-work
description: qdata 저장소(오큐브 QData — AI-Ready Data Platform 데모 콘솔) 작업 오케스트레이터. 콘솔 화면 추가·수정, 적용 사례 팩(standard·expressway 등) 콘텐츠 작성, 제품 원문 반영, 검수, 배포, 버그 수정 등 이 저장소의 어떤 변경 작업이든 요청받으면 먼저 사용할 것. 단순 질문·코드 읽기만은 직접 응답 가능.
---

# QData 작업 오케스트레이터

## Phase 0 — 컨텍스트
1. `CLAUDE.md`를 끝까지 읽는다(화면 구조 §3, 팩 §4, 작업 규칙 §6).
2. 제품 기능·문구를 건드리면 `docs/SOURCE-QDATA.md`가 근거다 — 원문에 없는 기능을 제품 기능처럼 만들지 않는다.
3. 수용 기준을 1~3문장으로 확정(불명확하면 추천안과 함께 질문).

## Phase 1 — 유형 판별
| 유형 | 실행 |
|---|---|
| 적용 사례 콘텐츠(신규 팩·섹션 채우기) | `pack-author` 에이전트 위임 — 원장(`docs/WORLD-LEDGER-*.md`)·스키마(`src/admin/pages/qdata/schema.js`)·예시(`src/domains/standard.js`)를 프롬프트에 명시 |
| 콘솔 화면·코어 | 메인 루프 직접. 신규 화면은 `getQdata(domain)` 경로로 — 콘텐츠를 컴포넌트에 박지 않는다 |
| 검수 | `qdata-verify` 스킬(스크립트 우선) |
| 배포 | 메인 루프 — push 한 번으로 GitHub Pages + Cloudflare |

## Phase 2 — 구현 원칙
- 새 화면: `src/admin/pages/qdata/*`에 만들고 `App.jsx`의 `menu`·`pages` 두 곳에 등록. 메뉴 위치는 제품 흐름(ADR-2)에 맞춘다.
- 새 qdata 섹션: `schema.js` 주석(정본) → `standard.js`(중립) → 적용 사례 팩 → `scripts/check-domain-packs.mjs` 계약 순으로 같은 커밋에서.
- mocks.js 새 상수: `export let`·`__REB_DEFAULTS`·`applyAdminDomain` 3곳 등록.
- 함정이 많은 작업(빌드·배포·주석·락파일) 전에 `references/pitfalls.md`를 읽는다.

## Phase 3 — 검증 (완료 = 실행 증거)
1. `npx eslint src scripts` · `npm run check:domains` · `npm run check:storage`
2. `node .claude/skills/qdata-verify/scripts/verify.mjs http://localhost:5178/qdata/` — 전 사례 PASS
3. 변경 지점 수동 조작(DOM 텍스트로 판정)
4. 빌드 EXIT 0 + "✓ built in Xs"(ASCII 경로) 또는 CI build 잡

## Phase 4 — 배포·기록
1. 커밋(한국어·무엇을·왜) → push → `gh run watch <id> --exit-status`
2. 런 Summary `✅ Cloudflare 배포 완료` 확인 + 두 주소 200 + `verify.mjs https://qdata-bn3.pages.dev/`
3. `CLAUDE.md` §8 현재 상태에 한 줄(커밋·증거)
