#!/usr/bin/env node
/**
 * Cloudflare Pages 수동 배포 (보조 경로).
 *
 * 평소에는 main push 시 GitHub Actions의 deploy-cloudflare 잡이 자동 배포한다.
 * 이 스크립트는 '커밋하지 않은 워킹트리'를 급히 공유 주소에 올려야 할 때만 쓴다
 * (그 경우 다음 push가 커밋된 내용으로 다시 덮어쓴다).
 *
 * 왜 이 스크립트가 필요한가:
 *  1) 이 저장소 경로(C:\한국부동산원)는 한글이라 로컬 `vite build`가 조용히 죽는다.
 *     → ASCII 임시 경로로 복사한 뒤 그곳에서 빌드한다 (CLAUDE.md §4 참조).
 *  2) Cloudflare Pages는 루트에서 서빙하므로 base가 '/' 여야 한다 (GitHub Pages는 '/qdata/').
 *     → VITE_BASE=/ 로 덮어쓴다.
 *
 * 사용: npm run deploy:cf
 * 전제: wrangler 로그인(`npx wrangler login`) + Pages 프로젝트 qdata 존재
 *       (최초 1회: npx wrangler pages project create qdata --production-branch main --force)
 *
 * ⚠️ PROJECT는 반드시 이 저장소 전용 이름이어야 한다. 포크 원본 값(agentq-platform)이 남아 있으면
 *    다른 서비스의 라이브 사이트를 덮어쓴다 — 포크 직후 실제로 그 상태였다.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, rmSync } from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const PROJECT = 'qdata'
// pages.dev 하위 도메인은 전역 선점제라 프로젝트명과 다를 수 있다(qdata는 선점돼 qdata-bn3로 배정됨)
const PROD_URL = 'https://qdata-bn3.pages.dev/'
const repo = path.resolve(import.meta.dirname, '..')
const work = path.join(os.tmpdir(), 'qdata-cf')

const run = (cmd, args, opts = {}) => {
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: true, ...opts })
  return r.status ?? 1
}

if (existsSync(work)) rmSync(work, { recursive: true, force: true })

// robocopy 종료코드 0~7은 정상(8 이상이 실패). /XD는 절대경로여야 node_modules/vite/dist가 살아남는다.
const rc = run('robocopy', [
  `"${repo}"`, `"${work}"`, '/E',
  '/XD', `"${path.join(repo, '.git')}"`, `"${path.join(repo, 'dist')}"`,
  '/NFL', '/NDL', '/NJH', '/NJS', '/NC', '/NS',
])
if (rc >= 8) { console.error(`robocopy 실패 (exit ${rc})`); process.exit(1) }

const build = run('node', ['node_modules/vite/bin/vite.js', 'build'], {
  cwd: work,
  env: { ...process.env, VITE_BASE: '/' },
})
if (build !== 0) { console.error(`빌드 실패 (exit ${build})`); process.exit(1) }

const deploy = run('npx', [
  '--yes', 'wrangler@latest', 'pages', 'deploy', 'dist',
  '--project-name', PROJECT, '--branch', 'main', '--commit-dirty=true',
], { cwd: work })
if (deploy !== 0) { console.error(`배포 실패 (exit ${deploy})`); process.exit(1) }

console.log(`\n✅ ${PROD_URL}`)
