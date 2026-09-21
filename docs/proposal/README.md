# 제안서 버전 관리

| 버전 | 성격 | 근거 | 상태 |
|---|---|---|---|
| **v1** | QData 중립 소개 + 한국도로공사 **가상 세계관** 적용(데모 콘솔 '한국도로공사 적용 사례'와 같은 수치) | `docs/SOURCE-QDATA.md` · `docs/WORLD-LEDGER-EXPRESSWAY.md` · 레퍼런스 3종(회사소개서 템플릿 · QDrive 대구시 · 한국부동산원 발표자료 아키텍처) | **동결** (git 태그 `v1.0`) — 원고 [v1/PROPOSAL-DRAFT.md](v1/PROPOSAL-DRAFT.md) 32장 |
| **v2** | **2026-09-16 도로공사 미팅 회의록** 기반, **시계열 데이터 전용**(포트홀·이미지·영상 제외). 사용자 조사 68종 · 6개 데이터군 → QData AI-Ready Data → LLM·예측형 AI 서비스 | [v2/BASIS.md](v2/BASIS.md) · [v2/DATA-RESEARCH.md](v2/DATA-RESEARCH.md) · [v2/SERVICE-DESIGN.md](v2/SERVICE-DESIGN.md) | **진행 중** |

- v1과 v2를 섞지 않는다. v1의 가상 수치(결측률 4.8% 등)를 v2 본문에 가져오지 않는다 — v2는 사실(회의록·공개 데이터)과 파일럿 KPI만 쓴다.
- 템플릿은 두 버전 공통: `C:\한국부동산원\회사소개서_작업중_260916.pptx`.
