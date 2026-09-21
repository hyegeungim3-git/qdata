/**
 * 04 거버넌스 › 품질·검증 규칙 (제품 페이지 Standards & Governance — "결측·이상·중복 검증을
 * 공통 규칙으로 자동화해 이후 분석과 AI 결과의 신뢰도 향상")
 */
import React, { useState } from "react";
import { PageShell, useToast, ToggleSwitch } from "../../common.jsx";
import { getQdata } from "./schema.js";
import { Card, Stat, SectionTitle, Badge, Table, Td, Note, cx } from "./ui.jsx";

export const QdQualityPage = ({ domain }) => {
  const q = getQdata(domain).quality;
  const toast = useToast();
  const [type, setType] = useState("전체");
  const [auto, setAuto] = useState(() => Object.fromEntries(q.rules.map(r => [r.id, r.auto])));
  // 유형 필터는 팩의 규칙에서 파생 — 목록을 박아 두면 새 유형(예: 적시성) 규칙이 필터에서 사라진다
  const TYPES = ["전체", ...new Set(q.rules.map(r => r.type))];
  const rows = q.rules.filter(r => type === "전체" || r.type === type);
  const violations = q.rules.filter(r => r.result === "위반").length;

  return (
    <PageShell breadcrumb={["QData", "거버넌스", "품질·검증 규칙"]} title="품질·검증 규칙"
      sub="결측·이상·중복·형식 검증을 공통 규칙으로 자동화해, 이후 분석과 AI 결과의 신뢰도를 높입니다."
      action={
        <button onClick={() => toast?.(`품질 규칙 ${q.rules.length}개 검증 완료 — 위반 ${violations}건`, violations ? "warning" : "success")}
          className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-qd-primary hover:bg-qd-deep min-h-[40px]">
          지금 검증 실행
        </button>
      }>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {q.summary.map(s => <Stat key={s.label} {...s} />)}
      </div>

      <Card className="p-4">
        <SectionTitle right={
          <div className="flex flex-wrap gap-1" role="tablist" aria-label="규칙 유형">
            {TYPES.map(t => (
              <button key={t} role="tab" aria-selected={type === t} onClick={() => setType(t)}
                className={cx("px-2.5 py-1 rounded-md text-[12px] font-bold border min-h-[32px]",
                  type === t ? "bg-qd-primary text-white border-qd-primary" : "text-qd-muted border-qd-line hover:bg-qd-warm")}>{t}</button>
            ))}
          </div>}>
          규칙 목록
        </SectionTitle>
        <Table head={["규칙", "유형", "대상", "조건", "최근 결과", "자동 보정"]} minWidth={900}>
          {rows.map(r => (
            <tr key={r.id} className={r.result === "위반" ? "bg-rose-50/40" : undefined}>
              <Td className="font-bold text-qd-ink">{r.name}</Td>
              <Td className="text-qd-muted">{r.type}</Td>
              <Td className="text-qd-muted">{r.target}</Td>
              <Td className="text-qd-ink">{r.condition}</Td>
              <Td><Badge>{r.result}</Badge><div className="text-[11px] text-qd-subtle mt-0.5">{r.detail}</div></Td>
              <Td>
                <ToggleSwitch on={auto[r.id]} label={auto[r.id] ? "자동" : "수동 검토"}
                  onClick={() => {
                    setAuto(a => ({ ...a, [r.id]: !a[r.id] }));
                    toast?.(`${r.name} — ${auto[r.id] ? "수동 검토" : "자동 보정"}으로 전환했습니다`, "info");
                  }} />
              </Td>
            </tr>
          ))}
        </Table>
        <Note>위반 데이터는 다음 단계로 넘어가기 전에 격리되고, 보정 이력은 데이터 변경 이력(계보)에 남습니다.</Note>
      </Card>
    </PageShell>
  );
};
