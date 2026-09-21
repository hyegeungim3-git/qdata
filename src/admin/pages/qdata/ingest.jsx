/**
 * 01 수집·연계 — 데이터 소스·커넥터 (제품 페이지: Data Sources · 파이프라인 기둥 · 표준 칩)
 * 핵심 메시지: 표준 커넥터로 연결하고, 통신이 끊겨도 엣지에 임시 저장해 유실을 막는다.
 */
import React, { useMemo, useState } from "react";
import { Server, WifiOff } from "lucide-react";
import { PageShell, useToast } from "../../common.jsx";
import { getQdata } from "./schema.js";
import { Card, Stat, SectionTitle, Badge, Chip, Table, Td, Note, cx } from "./ui.jsx";

export const QdSourcesPage = ({ domain }) => {
  const q = getQdata(domain).sources;
  const toast = useToast();
  const [cat, setCat] = useState("all");
  const rows = useMemo(() => q.connectors.filter(c => cat === "all" || c.category === cat), [q, cat]);
  const catLabel = Object.fromEntries(q.categories.map(c => [c.id, c.label]));

  return (
    <PageShell breadcrumb={["QData", "수집·연계", "데이터 소스·커넥터"]} title="데이터 소스·커넥터"
      sub="설비 제어기·계측기부터 운영 시스템까지 표준 커넥터로 연결하고, 통신이 끊겨도 엣지에 임시 저장해 유실을 막습니다.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {q.categories.map(c => {
          const n = q.connectors.filter(x => x.category === c.id).length;
          return (
            <button key={c.id} onClick={() => setCat(cat === c.id ? "all" : c.id)} aria-pressed={cat === c.id}
              className="text-left rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-qd-primary">
              <Card className={cx("px-4 py-3 transition-all", cat === c.id ? "border-qd-primary bg-qd-cool" : "hover:border-qd-primary")}>
                <div className="text-[13px] font-black text-qd-ink">{c.label}</div>
                <div className="text-[12px] text-qd-muted font-medium mt-0.5">{c.examples}</div>
                <div className="text-[11px] font-black text-qd-deep mt-2">커넥터 {n}개</div>
              </Card>
            </button>
          );
        })}
      </div>

      <Card className="p-4 mb-6">
        <SectionTitle right={<span className="text-[12px] text-qd-subtle font-bold">{cat === "all" ? "전체" : catLabel[cat]} · {rows.length}개</span>}>
          연결된 커넥터
        </SectionTitle>
        <Table head={["커넥터", "범주", "프로토콜", "주기", "최근 동기화", { label: "수집량", right: true }, "상태", ""]} minWidth={860}>
          {rows.map(c => (
            <tr key={c.id}>
              <Td className="font-bold text-qd-ink">{c.name}{c.note && <div className="text-[11px] text-amber-700 font-medium">{c.note}</div>}</Td>
              <Td className="text-qd-muted">{catLabel[c.category]}</Td>
              <Td><Chip>{c.protocol}</Chip></Td>
              <Td className="text-qd-muted">{c.cadence}</Td>
              <Td className="text-qd-muted tabular-nums">{c.lastSync}</Td>
              <Td right className="text-qd-ink font-semibold">{c.volume}</Td>
              <Td><Badge>{c.status}</Badge></Td>
              <Td right>
                <button onClick={() => toast?.(`${c.name} 연결 테스트 완료 — 응답 정상`)}
                  className="px-2.5 py-1 rounded-md text-[12px] font-bold text-qd-deep border border-qd-line hover:bg-qd-cool min-h-[32px]">
                  연결 테스트
                </button>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="p-4 xl:col-span-2">
          <SectionTitle>엣지 게이트웨이 — 통신 단절 대비 임시 저장</SectionTitle>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
            {q.edge.summary.map(s => <Stat key={s.label} {...s} />)}
          </div>
          <div className="space-y-2">
            {q.edge.gateways.map(g => (
              <div key={g.id} className="flex flex-wrap items-center gap-3 px-3 py-2.5 rounded-lg border border-qd-line">
                {g.status === "버퍼링" ? <WifiOff className="w-4 h-4 text-amber-600" aria-hidden="true" /> : <Server className="w-4 h-4 text-qd-primary" aria-hidden="true" />}
                <div className="font-bold text-[13px] text-qd-ink">{g.name}</div>
                <div className="text-[12px] text-qd-muted">{g.site}</div>
                <Badge>{g.status}</Badge>
                <div className="text-[12px] text-qd-muted ml-auto">버퍼 {g.buffered} · 최근 단절 {g.lastOutage}</div>
              </div>
            ))}
          </div>
          <Note>{q.edge.note}</Note>
        </Card>
        <Card className="p-4">
          <SectionTitle>지원 표준·프로토콜</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {q.protocols.map(p => <Chip key={p}>{p}</Chip>)}
          </div>
          <Note>산업 데이터 상호운용 표준(OPC-UA·ISA-95)을 참조해 이기종 설비 데이터를 표준 계층으로 통합합니다.</Note>
        </Card>
      </div>
    </PageShell>
  );
};
