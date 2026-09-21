# QData — AI-Ready Data Platform 데모 콘솔

> **이 문서는 모든 AI 모델·모든 세션의 공통 진입점이다.** 작업 전 끝까지 읽고, 규모 있는 작업 후 §8 "현재 상태"에 한 줄을 남겨라.
> 읽는 순서: 이 문서 → [docs/SOURCE-QDATA.md](docs/SOURCE-QDATA.md)(제품 원문 — 무엇을 보여줘야 하나) → [docs/DECISIONS.md](docs/DECISIONS.md)(왜 이 구조인가) → [docs/PACK-GUIDE.md](docs/PACK-GUIDE.md)(적용 사례 팩 작성법) → 원장 2종.
> 이 저장소의 모든 변경 작업은 **`qdata-work` 스킬**이 진입점이다.

## 1. 정체

- **무엇**: 오큐브(OCUBE)의 데이터 플랫폼 제품 **QData**(AI-Ready Data Platform)를 보여주는 라이브 데모 콘솔. 제품 페이지(https://ocube-homepage-next-v2.pages.dev/solution-dataq)의 구조 — 4대 기둥 · 5계층 아키텍처 · 6단계 코어 파이프라인 · RAG/CAG/TAG · AI-Ready 산출물 · 5대 기능 · 표준/거버넌스 — 를 실제로 조작 가능한 화면으로 만든 것.
- **원칙**: 제품 자체는 **중립**(발주처명 없음). 발주처 적용 모습은 **'적용 사례' 팩**으로 전환해 본다. 현재 적용 사례: **한국도로공사**.
- **짝 제품**: 도로공사용 AI 서비스 데모 **RoadQ**(https://ex-road-ai.pages.dev/) — QData 산출물을 쓰는 서비스 예시로 '서비스 연계' 화면에서 연결된다.
- **스택**: React 19 + Vite 7 + Tailwind CSS v4 + recharts. **백엔드 없음 — 모든 수치·화면 데이터는 시뮬레이션.**

## 2. 배포

| 역할 | 주소 | 비고 |
|---|---|---|
| **GitHub Pages** | https://hyegeungim3-git.github.io/qdata/ | `origin` = `qdata`, `main` push 시 자동 배포 (base `/qdata/`) |
| **Cloudflare Pages** | https://qdata-bn3.pages.dev/ | 같은 워크플로의 `deploy-cloudflare` 잡(base `/`). 시크릿 `CLOUDFLARE_API_TOKEN` + 변수 `CLOUDFLARE_ACCOUNT_ID` 필요 — 없으면 경고 남기고 건너뜀 |
| 로컬 dev | `npm run dev` → http://localhost:5178/qdata/ | 루트 `C:\한국부동산원\.claude\launch.json`의 `qdata` 구성 |

- 배포 판정: CI 3잡 성공 **+ 런 Summary의 `✅ Cloudflare 배포 완료`**(토큰이 없으면 잡은 초록인데 배포는 안 됐다) + 라이브 200.
- Pages 배포 일시 오류(deploy만 실패)가 재발하면 rerun 대신 `gh workflow run`으로 새 런.

## 3. 화면 구조 (메뉴 = 제품 페이지 흐름)

```
#/                         랜딩 — 4대 기둥 · 6단계 · 적용 사례 선택 · 콘솔 입장
#/<caseId>/admin/<menuId>  콘솔 (caseId: standard | expressway)

개요            qd.overview      5계층 아키텍처(클릭 이동) · KPI · 운영 알림
01 수집·연계     qd.sources       데이터 소스 4범주 · 커넥터 · 엣지 버퍼 · 표준 프로토콜
                data.autoload    자동 적재                           (재사용)
02 코어 파이프라인 qd.pipeline     6단계 보드 · 데이터셋별 진행
                admin.rag        문서 처리(처리 현황·청크·임베딩·재처리)  (재사용)
                qd.standardize   태그 매핑 · 단위 규칙 · 용어 사전 · 관계
03 AI 데이터 엔진 admin.augment    RAG·CAG·TAG 전략                   (재사용)
                data.vectordb    벡터 색인                           (재사용)
                qd.outputs       AI-Ready 산출물 4종
04 거버넌스      data.catalog     카탈로그·계보                       (재사용)
                qd.quality       품질·검증 규칙
                admin.knowledge  권한·개인정보                       (재사용)
                admin.worklog    감사 로그                           (재사용)
                security.arch    보안·망분리                         (재사용)
05 운영          eval.predops     모델 성능·재학습                    (재사용)
                model.registry   모델 레지스트리                     (재사용)
06 활용          qd.apps          서비스 연계(LLM·에이전트·예측·Cubeon)
```

- **신규 화면(`qd.*`)** → 팩의 `qdata` 필드. 조회는 반드시 `getQdata(domain)`(섹션 단위로 표준 데모에 폴백). 스키마 정본: `src/admin/pages/qdata/schema.js`.
- **재사용 화면** → `src/admin/mocks.js` 상수(기본 = 중립) + 팩 `adminContent`(상수명 키로 덮어씀, `applyAdminDomain`).
- 메뉴 id 목록의 정본은 `src/App.jsx` 라우팅 맵 — 검증 스크립트·계약 검사가 여기서 읽는다.

## 4. 적용 사례 팩

```
src/domains/
├── index.js               레지스트리 — DOMAIN_LIST[0]은 반드시 standard(중립)
├── standard.js            표준 데모(중립) — qdata 전 섹션 = 새 팩 작성 예시
├── expressway.js          한국도로공사 적용 사례
├── expressway.qdata.js    └ 신규 화면 콘텐츠
└── expressway.admin.js    └ 재사용 화면 콘텐츠(mocks.js 상수명 키)
```

- **새 적용 사례 = 팩 파일(+qdata·admin 파일) + `index.js` 등록 + `scan-config.mjs`의 `CASES` 등록.** 등록을 빠뜨리면 자동 검증에서 조용히 빠진다.
- 적용 사례 팩은 qdata **전 섹션을 채운다**. 빠뜨리면 화면이 중립 콘텐츠로 폴백되고, 검증기가 '샘플 사업장' 금칙어로 잡는다.

## 5. 콘텐츠 규율 — 원장

- 중립: [docs/WORLD-LEDGER-STANDARD.md](docs/WORLD-LEDGER-STANDARD.md) / 도로공사: [docs/WORLD-LEDGER-EXPRESSWAY.md](docs/WORLD-LEDGER-EXPRESSWAY.md)(RoadQ와 같은 세계관)
- 제품 기능·용어는 [docs/SOURCE-QDATA.md](docs/SOURCE-QDATA.md) 표현 그대로. **원문에 없는 기능을 제품 기능처럼 쓰지 말 것.** 공식 사이트 §04 문구 중복은 원문 오류이므로 v2 기준.
- 새 수치는 원장에 먼저 등재하고 쓴다.

## 6. 작업 규칙 (위반 시 실제 사고 이력 있음 — 포크 원본에서 승계)

1. **파일 수정은 Edit 도구(또는 Python `io.open(..., encoding='utf-8')`)만.** PowerShell `-replace`/`Set-Content`는 한글 UTF-8을 파괴한다.
2. git 커밋 메시지에 쌍따옴표 금지. 여러 줄은 heredoc/here-string.
3. **이 머신에서 `npx vite build`는 한글 경로 탓에 "transformed" 직후 조용히 죽는다.** 판정은 EXIT 0 + "✓ built in Xs". 로컬은 ASCII 경로 복사 빌드(`npm run deploy:cf`가 그 절차를 담고 있다) 또는 CI.
4. **블록 주석 안에 `*/` 포함 문자열 금지.**
5. `mocks.js`에 새 상수를 추가하면 `export let` · `__REB_DEFAULTS` · `applyAdminDomain` 3곳 등록(이름 `__REB_DEFAULTS`는 포크 유산 — 리졸버 계약이라 유지).
6. 화면 텍스트에 CSS `uppercase`를 걸지 말 것 — 제품명 원문 표기('sLLM', 'Cubeon')가 바뀌고 검증 마커도 깨진다(실제로 밟음).
7. Windows에서 `npm install --package-lock-only`로 재생성한 락파일은 리눅스 선택 의존성이 빠져 CI `npm ci`가 실패한다 — 검증된 락파일을 쓰고 name만 교체.

## 7. 하네스

| 자산 | 역할 |
|---|---|
| `.claude/skills/qdata-work` | 작업 오케스트레이터(진입점) · `references/pitfalls.md` 실사고 전집 |
| `.claude/skills/qdata-pack` | 적용 사례 팩 콘텐츠 작성 방법론 |
| `.claude/skills/qdata-verify` | `verify.mjs`(랜딩 + 콘솔 전 메뉴 × 전 사례 · 금칙어 · 마커 · 375px) / `adminscan.mjs`(버튼 클릭 스윕) |

```bash
node .claude/skills/qdata-verify/scripts/verify.mjs http://localhost:5178/qdata/
```

CI: lint → `check:domains`(팩 계약: 섹션·단계·산출물·알림 대상·adminContent 키) → `check:storage` → build ×2 → 배포 ×2.

## 7-1. 포크 이력

2026-09-21, 한국도로공사 AI 서비스 데모 RoadQ(`ex-road-ai`, 커밋 `90c82c1`)에서 포크. 사용자 포털·에이전트 13종·관리자 비-데이터 메뉴를 제거하고 관리자를 QData 제품 구조로 재편, 기본 콘텐츠를 중립으로 전환했다. git 이력은 새로 시작.

## 8. 현재 상태

- **2026-09-21 초기 구축(M1)**: 랜딩 + 콘솔 17메뉴(신규 7 · 재사용 10), 적용 사례 2종(표준 데모·한국도로공사), 브랜드 토큰(OCUBE 제품 페이지 실측), 반응형 콘솔(모바일 사이드바 오버레이), 검증 하네스 재작성.
- **제안서 — 버전 분리 관리**: [docs/proposal/README.md](docs/proposal/README.md). **v1**(가상 세계관, 원고 32장) = git 태그 `v1.0`로 동결. **v2**(2026-09-16 미팅 회의록 기반 · 시계열 전용 · 사용자 조사 68종/6개 군) = `docs/proposal/v2/` 진행 중. 템플릿 공통 `C:\한국부동산원\회사소개서_작업중_260916.pptx`.
