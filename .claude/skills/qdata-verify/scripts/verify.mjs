/**
 * QData 데모 자동 검증 — 랜딩 + 콘솔 전 메뉴 × 적용 사례 전부
 *
 * 사용법: node .claude/skills/qdata-verify/scripts/verify.mjs [baseUrl] [caseId]
 *   baseUrl  기본 http://localhost:5178/qdata/ (라이브: https://qdata-bn3.pages.dev/)
 *   caseId   지정 시 그 적용 사례만 (standard | expressway)
 * 판정: 페이지 에러 0 · 각 메뉴 본문 렌더 · 사례별 금칙어 0 · 메뉴별 마커 존재 · 375px 가로 스크롤 없음
 * 종료 코드: 0 = 전 항목 통과, 1 = 실패 있음, 2 = 실행 불가(서버/크롬)
 * 메뉴 목록은 src/App.jsx 라우팅 맵이 정본(adminMenus) — 여기 하드코딩하지 않는다.
 */
import puppeteer from "puppeteer-core";
import { CASES, LANDING_MARKERS, adminMenus, findChrome, sleep, RESET_STORAGE } from "./scan-config.mjs";

const BASE = (process.argv[2] || "http://localhost:5178/qdata/").replace(/\/?$/, "/");
const ONLY = process.argv[3] || null;
const MENUS = adminMenus();

const chrome = findChrome();
if (!chrome) { console.error("[실행 불가] Chrome을 찾지 못함 — CHROME_PATH 환경변수 지정"); process.exit(2); }
if (MENUS.length < 10) { console.error(`[실행 불가] App.jsx에서 메뉴를 읽지 못함(${MENUS.length}개)`); process.exit(2); }

const browser = await puppeteer.launch({ executablePath: chrome, headless: "new", args: ["--no-sandbox", "--disable-gpu"] });
let failed = 0;

async function newPage(width = 1440) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900 });
  const errs = [];
  page.on("pageerror", e => errs.push(String(e.message || e).slice(0, 160)));
  page.on("console", m => { if (m.type() === "error" && !/favicon|manifest|sw\.js/i.test(m.text())) errs.push("console: " + m.text().slice(0, 160)); });
  return { page, errs };
}
const text = page => page.evaluate(() => document.body.innerText);

try {
  // ── 1. 랜딩 ─────────────────────────────────────────
  {
    const fails = [];
    const { page, errs } = await newPage();
    try { await page.goto(BASE, { waitUntil: "networkidle2", timeout: 30000 }); }
    catch (e) { console.error(`[실행 불가] 서버 접속 실패: ${e.message}`); process.exit(2); }
    await page.evaluate(RESET_STORAGE); await page.reload({ waitUntil: "networkidle2" }); await sleep(600);
    const t = await text(page);
    for (const m of LANDING_MARKERS) if (!t.includes(m)) fails.push(`랜딩 마커 누락: "${m}"`);
    for (const e of errs) fails.push(`랜딩 에러: ${e}`);
    await page.setViewport({ width: 375, height: 812 }); await sleep(400);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    if (sw > 375) fails.push(`랜딩 375px 가로 스크롤 (scrollWidth ${sw})`);
    await page.close();
    failed += fails.length;
    console.log(`\n[${fails.length ? "FAIL" : "PASS"}] 랜딩`);
    for (const f of fails) console.log(`  ✗ ${f}`);
  }

  // ── 2. 적용 사례 × 콘솔 전 메뉴 ──────────────────────
  for (const c of CASES.filter(x => !ONLY || x.id === ONLY)) {
    const fails = [];
    const { page, errs } = await newPage();
    await page.goto(BASE, { waitUntil: "networkidle2" });
    await page.evaluate(RESET_STORAGE);
    for (const menu of MENUS) {
      const before = errs.length;
      await page.goto(`${BASE}#/${c.id}/admin/${menu}`, { waitUntil: "networkidle2" });
      await sleep(700);
      const info = await page.evaluate(() => {
        const m = document.querySelector("main");
        return { body: document.body.innerText, main: m ? m.innerText.trim().length : 0, h2: m?.querySelector("h2")?.innerText || "" };
      });
      if (info.main < 120) fails.push(`${menu}: 본문이 비었음(${info.main}자)`);
      for (const b of c.banned) if (info.body.includes(b)) fails.push(`${menu}: 금칙어 "${b}"`);
      for (const m of c.markers[menu] || []) if (!info.body.includes(m)) fails.push(`${menu}: 마커 누락 "${m}"`);
      for (const e of errs.slice(before)) fails.push(`${menu}: ${e}`);
    }
    // 모바일 — 콘솔 개요가 375에서 가로로 밀리지 않는가
    await page.setViewport({ width: 375, height: 812 });
    await page.goto(`${BASE}#/${c.id}/admin/qd.overview`, { waitUntil: "networkidle2" }); await sleep(600);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    if (sw > 375) fails.push(`콘솔 375px 가로 스크롤 (scrollWidth ${sw})`);
    await page.close();
    failed += fails.length;
    console.log(`\n[${fails.length ? "FAIL" : "PASS"}] ${c.label} (${c.id}) — 콘솔 ${MENUS.length}개 메뉴`);
    if (fails.length) for (const f of fails.slice(0, 40)) console.log(`  ✗ ${f}`);
    else console.log(`  ✓ 전 메뉴 렌더 · 금칙어 0 · 마커 전부 · 페이지 에러 0 · 375px 정상`);
  }
} finally {
  await browser.close();
}

console.log(`\n결과: ${failed ? `FAIL (${failed}건)` : "PASS"}`);
process.exit(failed ? 1 : 0);
