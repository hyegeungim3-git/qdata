/**
 * 06 활용 › 서비스 연계 (제품 페이지 §05 AI Applications + Overview '분석·서비스 활용')
 * QData 산출물을 어떤 서비스가 쓰는지 연결선으로 보여준다. 적용 사례 팩은 link로 실제 서비스 데모를 연결할 수 있다.
 */
import React from "react";
import { ExternalLink } from "lucide-react";
import { PageShell } from "../../common.jsx";
import { getQdata } from "./schema.js";
import { Card, Chip, Note } from "./ui.jsx";

export const QdAppsPage = ({ domain }) => {
  const q = getQdata(domain);
  const outLabel = Object.fromEntries(q.outputs.map(o => [o.id, `${o.label} (${o.engine})`]));
  return (
    <PageShell breadcrumb={["QData", "활용", "서비스 연계"]} title="서비스 연계"
      sub="하나의 데이터 기반에서 만든 산출물을 검색·추천·학습·운영 서비스가 바로 가져다 씁니다.">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {q.apps.map(a => (
          <Card key={a.id} className="p-5">
            {/* 제품명은 원문 표기 그대로 — uppercase를 걸면 'sLLM'이 'SLLM', 'Cubeon'이 'CUBEON'으로 바뀐다 */}
            <div className="text-[12px] font-black text-qd-primary tracking-wide">{a.product}</div>
            <div className="text-[17px] font-black text-qd-ink mt-1">{a.name}</div>
            <p className="text-[13px] text-qd-muted font-medium mt-1.5 leading-relaxed">{a.desc}</p>
            <div className="text-[11px] font-black text-qd-subtle mt-4 mb-1.5">사용하는 산출물</div>
            <div className="flex flex-wrap gap-1.5">
              {a.uses.map(u => <Chip key={u}>{outLabel[u] || u}</Chip>)}
            </div>
            {a.link && (
              <a href={a.link.url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-4 px-3 py-2 rounded-lg text-[13px] font-bold text-white bg-qd-primary hover:bg-qd-deep min-h-[40px]">
                {a.link.label} <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            )}
          </Card>
        ))}
      </div>
      <Note>대시보드·실시간 조회 기능을 제공해 QFactory와 AgentQ가 바로 활용합니다.</Note>
    </PageShell>
  );
};
