# QData — AI-Ready Data Platform 데모 콘솔

오큐브(OCUBE)의 데이터 플랫폼 **QData**를 직접 조작해 볼 수 있는 데모입니다.
정형·비정형·시계열·문서 데이터를 연결하고, 6단계 코어 파이프라인(Connect → Parse → Clean → Standardize → Contextualize → Ready)을 거쳐 RAG·CAG·TAG 기반 AI가 바로 쓰는 데이터로 만드는 과정을 한 콘솔에서 보여줍니다.

- **라이브**: https://qdata-bn3.pages.dev/ · https://hyegeungim3-git.github.io/qdata/
- **적용 사례**: 표준 데모(중립, 기본) · 한국도로공사 — 랜딩에서 골라 콘솔에 들어갑니다.
- **짝 서비스**: QData 산출물을 쓰는 도로공사 AI 서비스 데모 RoadQ — https://ex-road-ai.pages.dev/

## 실행
```bash
npm install
npm run dev      # http://localhost:5174/qdata/ (포트는 PORT 환경변수로 변경)
```

## 구조
- `src/RootApp.jsx` 랜딩 · `src/App.jsx` 콘솔(메뉴 = 제품 페이지 흐름)
- `src/admin/pages/qdata/*` 신규 화면(개요·소스·6단계·표준화·산출물·품질 규칙·서비스 연계)
- `src/domains/*` 적용 사례 팩 — `standard`(중립), `expressway`(한국도로공사)
- 문서: `CLAUDE.md`(진입점) · `docs/SOURCE-QDATA.md`(제품 원문 정리) · `docs/DECISIONS.md` · `docs/PACK-GUIDE.md`

> 모든 수치와 화면 데이터는 시뮬레이션입니다.
