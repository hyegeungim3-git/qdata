/**
 * 03 AI 데이터 엔진 › AI-Ready 산출물 (제품 페이지 §04 — v2 문구 기준)
 * 하나의 데이터 기반에서 목적별로 만든 산출물 4종과, 각각을 누가 쓰는지.
 */
import React from "react";
import { PageShell } from "../../common.jsx";
import { getQdata } from "./schema.js";
import { Card, SectionTitle, Table, Td, Note } from "./ui.jsx";

export const QdOutputsPage = ({ domain }) => {
  const outs = getQdata(domain).outputs;
  return (
    <PageShell breadcrumb={["QData", "AI 데이터 엔진", "AI-Ready 산출물"]} title="AI-Ready 산출물"
      sub="그대로 가져다 쓰는 산출물 — 검색(RAG)·반복 참조(CAG)·집계(TAG)·학습 목적별로 생성합니다.">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {outs.map(o => (
          <Card key={o.id} className="p-4">
            <div className="flex items-start justify-between gap-3 mb-1">
              <div>
                <div className="text-[16px] font-black text-qd-ink">{o.label}</div>
                <div className="text-[12px] text-qd-muted font-medium mt-0.5">{o.desc}</div>
              </div>
              <span className="px-2 py-1 rounded-md text-[11px] font-black bg-qd-primary text-white whitespace-nowrap">{o.engine}</span>
            </div>
            <div className="flex flex-wrap gap-4 my-3">
              {o.metrics.map(m => (
                <div key={m.label}>
                  <div className="text-[11px] font-bold text-qd-subtle">{m.label}</div>
                  <div className="text-[18px] font-black text-qd-deep tabular-nums">{m.value}</div>
                </div>
              ))}
            </div>
            <SectionTitle>구성</SectionTitle>
            <Table head={["산출물", { label: "규모", right: true }, "갱신", "활용처"]} minWidth={520}>
              {o.items.map(it => (
                <tr key={it.name}>
                  <Td className="font-bold text-qd-ink">{it.name}</Td>
                  <Td right className="text-qd-ink">{it.size}</Td>
                  <Td className="text-qd-muted tabular-nums">{it.updated}</Td>
                  <Td className="text-qd-muted">{it.consumer}</Td>
                </tr>
              ))}
            </Table>
          </Card>
        ))}
      </div>
      <Note>산출물은 모두 출처(원천 데이터·문서 위치)를 메타데이터로 지닙니다 — AI 답변이 근거를 붙일 수 있는 이유입니다.</Note>
    </PageShell>
  );
};
