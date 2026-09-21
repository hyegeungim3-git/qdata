---
name: qdata-verify
description: qdata(QData 데모 콘솔) 검증 실행. 화면·콘텐츠 변경 후 검수, 적용 사례별 금칙어·마커 스캔, 버튼 클릭 스윕, 빌드 판정, 라이브 배포 확인, "검증해줘/검수해줘/확인해줘" 요청과 완료 보고 직전에 사용.
---

# QData 검증

| 스크립트 | 보는 것 | 시간 |
|---|---|---|
| `scripts/verify.mjs [baseUrl] [caseId]` | 랜딩 + 콘솔 전 메뉴 × 전 적용 사례: 본문 렌더 · 사례별 금칙어 · 메뉴별 마커 · 페이지 에러 · 375px 가로 스크롤 | ~1분 |
| `scripts/adminscan.mjs [baseUrl] [caseId] [--no-click]` | 1단계 전 메뉴 누수·마커, 2단계 버튼 전부 클릭(크래시·흰 화면) | 5~8분 |

- 판정 기준의 정본은 `scripts/scan-config.mjs`의 `CASES`(적용 사례별 banned·markers)와 `LANDING_MARKERS`. 메뉴 목록은 `src/App.jsx`에서 자동으로 읽는다.
- **새 적용 사례 팩을 만들면 `CASES`에 등록** — 안 하면 검증에서 조용히 빠진다.
- 적용 사례의 banned에는 표준 데모 전용 말(샘플 사업장·김지원)을 넣는다 — 팩 섹션 누락으로 중립 콘텐츠가 폴백 노출되는 걸 잡는다.
- 마커는 첫 화면에 실제로 렌더되는 문자열만(탭 안쪽 금지). CSS `uppercase`가 걸린 텍스트는 innerText가 대문자로 나온다.
- 종료 코드: 0 통과 / 1 실패 / 2 실행 불가(서버·크롬).
