# 완료 전 검수 체크리스트

## A. 자동 (전부 통과해야 완료)
1. `npx eslint src scripts` — 0 errors
2. `npm run check:domains` · `npm run check:storage`
3. `node .claude/skills/qdata-verify/scripts/verify.mjs <baseUrl>` — 랜딩 + 콘솔 전 메뉴 × 전 사례 PASS
4. 버튼을 건드렸다면 `node .claude/skills/qdata-verify/scripts/adminscan.mjs <baseUrl> <caseId>` (클릭 스윕)
5. 빌드: ASCII 경로 복사 빌드 EXIT 0 + "✓ built in Xs" — 또는 CI build 잡 성공으로 갈음

## B. 수동 (변경 지점만)
- 바꾼 화면에서 실제 조작(필터·토글·연결 테스트·검증 실행) → 상태 변화 확인. 스크린샷보다 DOM 텍스트로 판정.
- 새 콘텐츠의 수치가 원장과 같은가(다른 화면의 같은 대상과 대조).
- 375 / 768 / 1280 폭에서 페이지 전체가 가로로 밀리지 않는가(표는 표 안에서만 스크롤).

## C. 배포
- CI 3잡 성공 + Summary `✅ Cloudflare 배포 완료` + 두 주소 200 + 변경이 든 화면 DOM 확인.
