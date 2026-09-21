---
name: qdata-pack
description: QData 콘솔의 적용 사례 팩(발주처별 화면 콘텐츠) 작성·보완 방법론. 새 발주처 적용 사례 만들기, 기존 팩(standard·expressway)의 qdata 섹션·adminContent 채우기, "OO기관 사례로 보여줘" 요청 시 사용.
---

# 적용 사례 팩 작성

작성법·계약의 정본은 `docs/PACK-GUIDE.md`. 순서:
1. 원장 먼저 — `docs/WORLD-LEDGER-<ID>.md`에 조직·시스템·식별자·핵심 수치를 확정한다(모든 화면이 같은 수치를 쓰게).
2. `standard.js`의 qdata를 복사해 **원문 기능은 그대로, 예시만** 발주처 데이터로 번역한다(SOURCE-QDATA 표현 유지).
3. `<id>.admin.js` — 재사용 화면 상수를 발주처 버전으로(키 = mocks.js 상수명, 구조 불변).
4. 등록 3곳: `domains/index.js` · `scan-config.mjs` CASES · 원장.
5. `npm run check:domains` → `verify.mjs <url> <id>` 통과 후 커밋.
