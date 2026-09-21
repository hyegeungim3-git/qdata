/**
 * QData 콘솔 — 메뉴 구조는 제품 페이지(docs/SOURCE-QDATA.md) 흐름을 그대로 따른다:
 *   개요 → 01 수집·연계 → 02 코어 파이프라인 → 03 AI 데이터 엔진 → 04 거버넌스 → 05 데이터·모델 운영 → 06 활용
 * 신규 화면(qd.*)은 팩의 qdata 필드를, 재사용 화면은 mocks.js(+ 팩 adminContent)를 쓴다.
 */
import React, { useState } from 'react';
import {
  LayoutDashboard, Plug, RefreshCw, Workflow, FileText, Tags, Layers, Database, Package,
  BookOpen, ShieldCheck, Lock, ScrollText, Network, Activity, Box, Share2,
  Bell, Columns, ChevronDown, Briefcase, LayoutGrid,
} from 'lucide-react';
import { ToastProvider, SidebarItem } from './admin/common.jsx';
import { applyAdminDomain, ADMIN_PERSONA } from './admin/mocks.js';
import { DataCatalogPage } from './admin/pages/catalog.jsx';
import { AugmentStrategyPage } from './admin/pages/augment.jsx';
import { PredictionOpsPage } from './admin/pages/predops.jsx';
import { SecurityArchPage } from './admin/pages/security.jsx';
import { VectorDbPage, AutoLoadPage, ModelRegistry } from './admin/pages/infra.jsx';
import { KnowledgeManagementPage, RagPipelinePage } from './admin/pages/knowledge.jsx';
import { WorkLogPage } from './admin/pages/users.jsx';
import { QdOverviewPage } from './admin/pages/qdata/overview.jsx';
import { QdSourcesPage } from './admin/pages/qdata/ingest.jsx';
import { QdPipelinePage, QdStandardizePage } from './admin/pages/qdata/pipeline.jsx';
import { QdOutputsPage } from './admin/pages/qdata/outputs.jsx';
import { QdQualityPage } from './admin/pages/qdata/governance.jsx';
import { QdAppsPage } from './admin/pages/qdata/apps.jsx';
import { getQdata } from './admin/pages/qdata/schema.js';

// 콘솔 타이포그래피 — 자체 호스팅 Pretendard(index.html에서 로드). 표 수치는 tnum으로 흔들리지 않게.
const ADMIN_TYPE = {
  fontFamily: "'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
  letterSpacing: '-0.011em',
  fontFeatureSettings: '"tnum" 1',
  wordBreak: 'keep-all',
};

export const DEFAULT_MENU_ID = 'qd.overview';

const App = ({ onExitPortal, domain, initialMenuId, onRouteChange }) => {
  // 도메인 리졸버: 재사용 화면이 import하는 mocks.js 상수를 팩 adminContent로 교체 (렌더 최상단 — 페이지 렌더보다 먼저)
  applyAdminDomain(domain);
  const q = getQdata(domain);
  const admin = ADMIN_PERSONA;
  const [activeId, setActiveId] = useState(initialMenuId || DEFAULT_MENU_ID);
  React.useEffect(() => { onRouteChange && onRouteChange(activeId); }, [activeId]);
  // 모바일(<768)은 사이드바를 접은 채 시작하고, 펼치면 본문 위에 겹쳐 띄운다
  const isWide = () => typeof window === 'undefined' || window.matchMedia('(min-width: 768px)').matches;
  const [sidebarOpen, setSidebarOpen] = useState(isWide);
  const nav = (id) => { setActiveId(id); if (!isWide()) setSidebarOpen(false); };
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifRead, setNotifRead] = useState(false);
  const notifItems = q.overview.alerts.map((a, i) => ({ id: `n${i}`, title: a.title, body: a.body, to: a.to }));

  const menu = [
    { id: 'qd.overview', label: '개요', icon: LayoutDashboard },

    { id: '_s1', label: '01 수집 · 연계', section: true },
    { id: 'qd.sources', label: '데이터 소스·커넥터', icon: Plug },
    { id: 'data.autoload', label: '자동 적재', icon: RefreshCw },

    { id: '_s2', label: '02 코어 파이프라인', section: true },
    { id: 'qd.pipeline', label: '6단계 파이프라인', icon: Workflow },
    { id: 'admin.rag', label: '문서 처리 파이프라인', icon: FileText },
    { id: 'qd.standardize', label: '표준화·맥락화', icon: Tags },

    { id: '_s3', label: '03 AI 데이터 엔진', section: true },
    { id: 'admin.augment', label: 'RAG·CAG·TAG 전략', icon: Layers },
    { id: 'data.vectordb', label: '벡터 색인', icon: Database },
    { id: 'qd.outputs', label: 'AI-Ready 산출물', icon: Package },

    { id: '_s4', label: '04 거버넌스', section: true },
    { id: 'data.catalog', label: '카탈로그·계보', icon: BookOpen },
    { id: 'qd.quality', label: '품질·검증 규칙', icon: ShieldCheck },
    { id: 'admin.knowledge', label: '권한·개인정보', icon: Lock },
    { id: 'admin.worklog', label: '감사 로그', icon: ScrollText },
    { id: 'security.arch', label: '보안·망분리', icon: Network },

    { id: '_s5', label: '05 데이터·모델 운영', section: true },
    { id: 'eval.predops', label: '모델 성능·재학습', icon: Activity },
    { id: 'model.registry', label: '모델 레지스트리', icon: Box },

    { id: '_s6', label: '06 활용', section: true },
    { id: 'qd.apps', label: '서비스 연계', icon: Share2 },
  ];

  const pages = {
    'qd.overview': <QdOverviewPage domain={domain} onNav={nav} />,
    'qd.sources': <QdSourcesPage domain={domain} />,
    'data.autoload': <AutoLoadPage />,
    'qd.pipeline': <QdPipelinePage domain={domain} />,
    'admin.rag': <RagPipelinePage />,
    'qd.standardize': <QdStandardizePage domain={domain} />,
    'admin.augment': <AugmentStrategyPage />,
    'data.vectordb': <VectorDbPage />,
    'qd.outputs': <QdOutputsPage domain={domain} />,
    'data.catalog': <DataCatalogPage />,
    'qd.quality': <QdQualityPage domain={domain} />,
    'admin.knowledge': <KnowledgeManagementPage />,
    'admin.worklog': <WorkLogPage />,
    'security.arch': <SecurityArchPage />,
    'eval.predops': <PredictionOpsPage />,
    'model.registry': <ModelRegistry />,
    'qd.apps': <QdAppsPage domain={domain} />,
  };

  return (
    <ToastProvider>
    <div className="flex h-screen bg-qd-warm text-qd-ink" style={ADMIN_TYPE}>
      {sidebarOpen && <div className="md:hidden fixed inset-0 bg-black/40 z-30" onClick={() => setSidebarOpen(false)} aria-hidden="true" />}
      {/* Sidebar */}
      <nav aria-label="QData 콘솔 메뉴" className={`bg-white flex-col h-full border-r border-qd-line shrink-0 w-60 max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-40 max-md:shadow-xl ${sidebarOpen ? 'flex' : 'hidden'}`}>
        <div className="px-5 py-4 flex items-center space-x-3 border-b border-qd-line bg-qd-ink">
          <div className="w-8 h-8 bg-qd-primary rounded-lg flex items-center justify-center text-white font-black text-sm">Q</div>
          <div>
            <div className="text-[15px] font-black tracking-tight text-white leading-tight">QData</div>
            <div className="text-[10px] font-bold tracking-wide text-white/60">AI-Ready Data Platform</div>
          </div>
        </div>
        <div className="px-4 py-2.5 border-b border-qd-line bg-qd-cool">
          <div className="text-[10px] font-black text-qd-subtle tracking-widest">적용 사례</div>
          <div className="text-[13px] font-black text-qd-deep truncate">{domain?.caseLabel || domain?.orgName}</div>
        </div>
        <div className="flex-1 py-2 overflow-y-auto text-sm" style={{ scrollbarWidth: 'thin' }}>
          {menu.map(item =>
            item.section
              ? <div key={item.id} className="px-4 pt-5 pb-1.5">
                  <span className="text-[10px] font-black text-qd-subtle tracking-widest whitespace-nowrap">{item.label}</span>
                </div>
              : <SidebarItem key={item.id} item={item} activeId={activeId} onNav={nav} />
          )}
        </div>
        <div className="p-3 border-t border-qd-line">
          <div className="flex items-center space-x-2.5 p-2 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-qd-ink flex items-center justify-center text-white text-xs font-bold">{admin.name.charAt(0)}</div>
            <div className="flex-1 min-w-0"><div className="text-sm font-bold truncate">{admin.name}·{admin.role}</div><div className="text-xs text-qd-subtle truncate">{admin.dept}</div></div>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="h-14 bg-white border-b border-qd-line flex items-center justify-end px-3 sm:px-6 shrink-0 gap-1 sm:gap-2">
          {onExitPortal && (
            <button onClick={onExitPortal} className="flex items-center gap-1.5 px-3 py-1.5 bg-qd-warm text-qd-muted rounded-lg text-sm font-bold hover:bg-qd-warm2 transition-colors border border-qd-line">
              <LayoutGrid size={15} /> <span className="hidden sm:inline">제품 소개</span>
            </button>
          )}
          <button onClick={() => setSidebarOpen(v => !v)} aria-label={sidebarOpen ? '사이드바 접기' : '사이드바 펼치기'} aria-pressed={!sidebarOpen}
            title={sidebarOpen ? '사이드바 접기' : '사이드바 펼치기'}
            className={`p-2 rounded-lg hover:bg-qd-warm ${sidebarOpen ? 'text-qd-subtle' : 'text-qd-primary bg-qd-cool'}`}><Columns size={18} /></button>
          <div className="relative">
            <button onClick={() => { setNotifOpen(v => !v); setNotifRead(true); }} aria-label="알림" aria-expanded={notifOpen} title="알림"
              className="p-2 text-qd-subtle hover:text-qd-ink hover:bg-qd-warm rounded-lg relative"><Bell size={18} />
              {!notifRead && notifItems.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />}</button>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <div className="absolute right-0 top-11 z-50 w-80 max-w-[calc(100vw-24px)] bg-white rounded-xl border border-qd-line shadow-xl overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-qd-line text-xs font-bold text-qd-muted">운영 알림 {notifItems.length}건</div>
                  {notifItems.map(n => (
                    <button key={n.id} onClick={() => { nav(n.to); setNotifOpen(false); }}
                      className="w-full text-left px-4 py-3 hover:bg-qd-cool border-b border-qd-line last:border-b-0 transition-colors">
                      <div className="text-[13px] font-bold text-qd-ink">{n.title}</div>
                      <div className="text-[11px] text-qd-muted mt-0.5 leading-snug">{n.body}</div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="hidden sm:flex items-center space-x-2 ml-3 pl-3 border-l border-qd-line text-sm font-medium text-qd-ink">
            <div className="w-7 h-7 rounded-full bg-qd-ink flex items-center justify-center text-white text-[10px] font-bold">{admin.name.charAt(0)}</div>
            <span>{admin.name}</span><ChevronDown size={14} />
          </div>
        </div>
        <div className="flex-1 overflow-hidden bg-qd-warm">
          {pages[activeId] || (
            <div className="flex flex-col items-center justify-center h-full text-qd-subtle">
              <Briefcase size={48} className="mb-4 opacity-40" /><h3 className="text-lg font-medium">준비 중인 페이지입니다</h3><p className="text-sm mt-1 font-mono bg-white px-3 py-1 rounded">{activeId}</p>
            </div>
          )}
        </div>
      </main>
    </div>
    </ToastProvider>
  );
};

export default App;
