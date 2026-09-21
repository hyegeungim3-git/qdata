/**
 * RootApp — QData 데모 진입점
 *  #/                          제품 소개(랜딩) — 제품 페이지 요약 + 적용 사례 선택 + 콘솔 입장
 *  #/<caseId>/admin/<menuId>   QData 콘솔 (caseId: standard | expressway)
 * 주소(해시)가 화면 상태의 정본이다 — 새로고침·공유·뒤로가기가 같은 화면을 연다.
 */
import React, { useState, useEffect, Suspense, lazy } from "react";
import { ArrowRight, Workflow, FileText, Share2, Activity } from "lucide-react";
import { getDomain, getDomainList, getActiveDomainId, setActiveDomainId, DOMAIN_LIST } from "./domains/index.js";
import { parseRoute, syncHash, sameRoute, DEFAULT_ADMIN_ID } from "./router.js";

const QDataConsole = lazy(() => import("./App"));

const cx = (...c) => c.filter(Boolean).join(" ");

/* 제품 페이지 히어로의 4대 기둥 (docs/SOURCE-QDATA.md §2 — v2 소제목) */
const PILLARS = [
  { Icon: Workflow, title: "파이프라인", sub: "수집부터 활용까지 한 흐름으로",
    body: "설비 제어기와 계측기부터 운영 시스템까지 표준 커넥터로 연결하고, 통신이 끊겨도 엣지에 임시 저장해 데이터 유실을 막습니다." },
  { Icon: FileText, title: "비정형 처리", sub: "문서·이미지·음성까지",
    body: "표와 도면이 섞인 업무 문서를 의미 단위로 정리하고, 문자 인식(OCR)과 음성 인식(STT)으로 검색·학습 가능한 데이터로 바꿉니다." },
  { Icon: Share2, title: "의미 기반 지식화", sub: "검색을 넘어 추론까지",
    body: "공통 데이터 형식과 용어 체계로 서로 다른 이름과 단위를 통일하고, 데이터 관계와 의미 기반 검색을 함께 지원합니다." },
  { Icon: Activity, title: "데이터·모델 운영", sub: "품질과 성능을 함께",
    body: "데이터 품질과 변경 이력을 확인하고, 변화가 생기면 AI 모델을 재학습·검증해 서비스에 반영합니다." },
];

const STAGES = ["Connect", "Parse", "Clean", "Standardize", "Contextualize", "Ready"];

const Landing = ({ domain, onChangeCase, onEnter }) => (
  <div className="min-h-dvh w-full bg-qd-warm text-qd-ink"
    style={{ fontFamily: "'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", wordBreak: "keep-all" }}>
    <header className="bg-qd-ink text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-qd-primary flex items-center justify-center font-black">Q</div>
          <div>
            <div className="text-[11px] font-black tracking-[0.3em] text-white/50">OCUBE</div>
            <div className="text-[18px] font-black leading-tight">QData</div>
          </div>
        </div>
        <button onClick={onEnter}
          className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-qd-primary hover:bg-qd-deep text-[14px] font-bold min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
          콘솔 입장 <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-12">
        <div className="text-[13px] font-black tracking-widest text-qd-primary">AI-Ready Data Platform</div>
        <h1 className="text-[34px] sm:text-[48px] font-black leading-tight mt-2">QData</h1>
        <p className="text-[16px] sm:text-[18px] text-white/80 font-medium mt-3 max-w-2xl leading-relaxed">
          정형·비정형·시계열·문서 데이터를 연결하고<br className="hidden sm:block" />
          RAG·CAG·TAG 기반 AI가 바로 활용할 수 있는 데이터로 가공합니다.
        </p>
        <div className="flex flex-wrap items-center gap-1.5 mt-6" aria-label="6단계 코어 파이프라인">
          {STAGES.map((s, i) => (
            <React.Fragment key={s}>
              <span className="px-2.5 py-1 rounded-md bg-white/10 text-[12px] font-bold">{i + 1} {s}</span>
              {i < STAGES.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-white/40" aria-hidden="true" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </header>

    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PILLARS.map(({ Icon, title, sub, body }) => (
          <div key={title} className="bg-white rounded-xl border border-qd-line p-5">
            <Icon className="w-6 h-6 text-qd-primary" aria-hidden="true" />
            <div className="text-[16px] font-black mt-3">{title}</div>
            <div className="text-[12px] font-bold text-qd-deep mt-0.5">{sub}</div>
            <p className="text-[13px] text-qd-muted font-medium mt-2 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      <section className="mt-10 bg-white rounded-xl border border-qd-line p-5 sm:p-6" aria-labelledby="case-title">
        <h2 id="case-title" className="text-[18px] font-black">데모 콘솔 열기</h2>
        <p className="text-[13px] text-qd-muted font-medium mt-1">같은 QData 콘솔을 어떤 데이터로 볼지 고르세요. 제품 자체는 표준 데모, 발주처 적용 모습은 적용 사례에서 확인합니다.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4" role="radiogroup" aria-label="적용 사례">
          {getDomainList().map(d => {
            const on = d.id === domain.id;
            return (
              <button key={d.id} role="radio" aria-checked={on} onClick={() => onChangeCase(d.id)}
                className={cx("text-left rounded-xl border-2 p-4 transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-qd-primary",
                  on ? "border-qd-primary bg-qd-cool" : "border-qd-line bg-white hover:border-qd-primary")}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[15px] font-black">{d.caseLabel || d.orgName}</span>
                  <span className={cx("w-4 h-4 rounded-full border-2 shrink-0", on ? "border-qd-primary bg-qd-primary" : "border-qd-line")} aria-hidden="true" />
                </div>
                <p className="text-[12px] text-qd-muted font-medium mt-1.5 leading-relaxed">{d.caseNote}</p>
              </button>
            );
          })}
        </div>
        <button onClick={onEnter}
          className="mt-5 w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-lg bg-qd-primary hover:bg-qd-deep text-white text-[15px] font-black min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-qd-deep focus-visible:ring-offset-2">
          {domain.caseLabel || domain.orgName} 콘솔 입장 <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </section>

      <p className="text-[12px] text-qd-subtle font-medium mt-8">
        본 데모의 모든 수치와 화면 데이터는 시뮬레이션입니다. 제품 정보 출처: 오큐브(주) QData 제품 소개 페이지.
      </p>
    </main>
  </div>
);

const LoadingFallback = () => (
  <div className="h-dvh w-full flex flex-col items-center justify-center bg-qd-warm">
    <div className="w-14 h-14 rounded-2xl bg-qd-primary flex items-center justify-center text-white text-2xl font-black animate-pulse">Q</div>
    <p className="text-qd-muted font-bold text-[14px] mt-3">QData · 로딩 중…</p>
  </div>
);

const RootApp = () => {
  const [route, setRoute] = useState(() => {
    const r = parseRoute();
    const id = (r.domainId && getDomain(r.domainId)) ? r.domainId : getActiveDomainId();
    // 사용자 포털 주소(#/…/user/…)는 QData에 없으므로 랜딩으로 보낸다
    return { ...r, view: r.view === "ADMIN" ? "ADMIN" : "SELECTOR", domainId: id };
  });
  const [extNonce, setExtNonce] = useState(0);
  const domainId = route.domainId;
  const domain = getDomain(domainId) || DOMAIN_LIST[0];

  useEffect(() => {
    document.title = route.view === "ADMIN" ? `QData 콘솔 · ${domain.caseLabel || domain.orgName}` : "QData · AI-Ready Data Platform";
  }, [domain, route.view]);
  useEffect(() => { syncHash(route); }, [route]);
  useEffect(() => { if (domainId) setActiveDomainId(domainId); }, [domainId]);
  useEffect(() => {
    const onHash = () => {
      const next = parseRoute();
      setRoute(prev => {
        const merged = { ...next, view: next.view === "ADMIN" ? "ADMIN" : "SELECTOR",
          domainId: (next.domainId && getDomain(next.domainId)) ? next.domainId : prev.domainId };
        if (sameRoute(prev, merged)) return prev;
        setExtNonce(n => n + 1);
        return merged;
      });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (patch) => setRoute(r => ({ ...r, ...patch }));

  if (route.view === "ADMIN") {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <QDataConsole key={`${domainId}-${extNonce}`} domain={domain}
          initialMenuId={route.adminId}
          onRouteChange={(adminId) => go({ adminId })}
          onExitPortal={() => go({ view: "SELECTOR" })} />
      </Suspense>
    );
  }
  return (
    <Landing domain={domain}
      onChangeCase={(id) => go({ domainId: id })}
      onEnter={() => go({ view: "ADMIN", adminId: route.adminId || DEFAULT_ADMIN_ID })} />
  );
};

export default RootApp;
