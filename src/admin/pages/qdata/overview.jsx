/**
 * 개요 — QData 5계층 아키텍처(제품 페이지 Architecture)를 '살아 있는 상태'로 보여준다.
 * 계층 카드를 누르면 해당 메뉴로 이동한다. 콘텐츠는 getQdata(domain)만 쓴다.
 */
import React from "react";
import { ArrowRight, AlertTriangle, Info } from "lucide-react";
import { PageShell } from "../../common.jsx";
import { getQdata } from "./schema.js";
import { Card, Stat, SectionTitle, cx } from "./ui.jsx";

const LAYERS = (q) => [
  { no: "01", title: "Data Sources", sub: "조직에 이미 쌓여 있는 데이터", to: "qd.sources",
    body: q.sources.categories.map(c => c.label).join(" · "),
    metric: `커넥터 ${q.sources.connectors.length}개` },
  { no: "02", title: "QData Core Pipeline", sub: "AI가 쓸 수 있는 형태로 바꾸는 6단계", to: "qd.pipeline",
    body: q.pipeline.stages.map(s => s.label).join(" → "),
    metric: `데이터셋 ${q.pipeline.datasets.length}개 처리 중` },
  { no: "03", title: "AI Data Engine", sub: "하나의 데이터 기반에서 목적별로 생성", to: "admin.augment",
    body: "RAG Ready · CAG Ready · TAG Ready",
    metric: "검색·반복 참조·집계 전략" },
  { no: "04", title: "AI-Ready Data Outputs", sub: "그대로 가져다 쓰는 산출물", to: "qd.outputs",
    body: q.outputs.map(o => o.label).join(" · "),
    metric: `산출물 ${q.outputs.length}종` },
  { no: "05", title: "AI Applications", sub: "검색·추천·학습·운영까지 연결", to: "qd.apps",
    body: q.apps.map(a => a.product).join(" · "),
    metric: `연계 서비스 ${q.apps.length}개` },
];

export const QdOverviewPage = ({ domain, onNav }) => {
  const q = getQdata(domain);
  return (
    <PageShell breadcrumb={["QData", "개요"]} title="플랫폼 개요"
      sub={`${q.orgLabel} · ${q.asOf} — 흩어진 데이터를 연결해 AI가 바로 쓰는 데이터로 만드는 전 과정을 한 화면에서 봅니다.`}>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {q.overview.kpis.map(k => <Stat key={k.label} {...k} />)}
      </div>

      <SectionTitle>AI가 활용할 수 있는 데이터 구축 과정</SectionTitle>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-6">
        {LAYERS(q).map((l, i) => (
          <button key={l.no} onClick={() => onNav?.(l.to)}
            className="text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-qd-primary rounded-xl">
            <Card className="p-4 h-full transition-all group-hover:border-qd-primary group-hover:shadow-md relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black text-qd-primary tracking-widest">{l.no}</span>
                {i < 4 && <ArrowRight className="w-4 h-4 text-qd-line hidden lg:block" aria-hidden="true" />}
              </div>
              <div className="text-[15px] font-black text-qd-ink leading-tight">{l.title}</div>
              <div className="text-[12px] text-qd-muted font-medium mt-1">{l.sub}</div>
              <div className="text-[12px] text-qd-ink font-semibold mt-3 leading-relaxed">{l.body}</div>
              <div className="text-[11px] font-black text-qd-deep mt-3 pt-3 border-t border-qd-line">{l.metric}</div>
            </Card>
          </button>
        ))}
      </div>

      <SectionTitle>운영 알림</SectionTitle>
      <div className="space-y-2">
        {q.overview.alerts.map(a => (
          <button key={a.title} onClick={() => onNav?.(a.to)}
            className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-qd-primary rounded-xl">
            <Card className="px-4 py-3 flex items-start gap-3 hover:border-qd-primary transition-colors">
              {a.severity === "warn"
                ? <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                : <Info className="w-4 h-4 text-qd-primary shrink-0 mt-0.5" aria-hidden="true" />}
              <div className="min-w-0 flex-1">
                <div className={cx("text-[13px] font-black", a.severity === "warn" ? "text-amber-800" : "text-qd-ink")}>{a.title}</div>
                <div className="text-[12px] text-qd-muted font-medium mt-0.5">{a.body}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-qd-subtle shrink-0 mt-0.5" aria-hidden="true" />
            </Card>
          </button>
        ))}
      </div>
    </PageShell>
  );
};
