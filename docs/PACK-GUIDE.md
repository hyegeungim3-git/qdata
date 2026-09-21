# 적용 사례 팩 작성 가이드

> 새 발주처 적용 사례를 만들 때 이 문서만 보고 따라 할 수 있어야 한다. 정본은 코드다 — 스키마는 `src/admin/pages/qdata/schema.js`, 예시는 `src/domains/standard.js`.

## 1. 파일 구성

```
src/domains/<id>.js         팩 본체 — 아래 필드 + qdata + adminContent 연결
src/domains/<id>.qdata.js   신규 화면(qd.*) 콘텐츠 — standard.js의 qdata와 같은 모양
src/domains/<id>.admin.js   재사용 화면 콘텐츠 — 키 = mocks.js 상수명
```
등록 3곳: `src/domains/index.js`(DOMAINS·DOMAIN_LIST 뒤쪽에 추가, 0번은 standard 유지) · `.claude/skills/qdata-verify/scripts/scan-config.mjs`(`CASES`) · 원장 문서 `docs/WORLD-LEDGER-<ID>.md`.

## 2. 팩 본체 필드 (필수)

| 필드 | 쓰이는 곳 |
|---|---|
| `id` | 주소 `#/<id>/admin/...`, 저장소 키 |
| `orgName` · `orgShort` | 로딩·예비 표기 |
| `caseLabel` · `caseNote` | 랜딩의 적용 사례 카드, 콘솔 사이드바 '적용 사례' |
| `brandColor` | 예비 |
| `qdata` | 신규 7화면 |
| `adminContent` | 재사용 10화면 (생략하면 중립 기본값 노출 — 적용 사례라면 결함) |

## 3. qdata 섹션 (7개 모두 채울 것)

`overview` · `sources` · `pipeline` · `standardize` · `outputs` · `quality` · `apps` — 필드는 schema.js 주석이 정본.

지켜야 할 계약(`npm run check:domains`가 검사):
- `pipeline.stages` = connect → parse → clean → standardize → contextualize → ready **6개, 이 순서**
- `pipeline.datasets[].reached` = 0~5 정수(도달한 단계 인덱스)
- `outputs[].id` = knowledge · context · structured · training 4종
- `apps[].uses`는 outputs id만
- `overview.alerts[].to`는 실제 콘솔 메뉴 id
- 상태 문자열은 배지가 아는 것만: 정상·완료·통과·매핑·주의·진행·버퍼링·경고·미매핑·위반·중단 / tone: emerald·amber·rose
- `adminContent` 키는 mocks.js에 실제로 있는 상수명(오타는 조용히 무시된다)

## 4. 콘텐츠 원칙

1. **원문 번역**: 제품 기능은 SOURCE-QDATA 표현 그대로, 예시만 발주처 데이터로 바꾼다(PLC·MES → 그 기관의 실제 시스템).
2. **하나의 세계관**: 여러 화면에 같은 대상이 나오면 같은 수치. 원장에 먼저 등재.
3. **폴백 금지**: 적용 사례 화면에 '샘플 사업장'·'김지원'이 보이면 섹션을 빠뜨린 것.
4. 법령·표준은 실재하는 것만 인용.
