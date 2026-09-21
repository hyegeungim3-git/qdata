/**
 * 02 코어 파이프라인
 *  - 6단계 파이프라인: Connect → Parse → Clean → Standardize → Contextualize → Ready (제품 페이지 §02)
 *  - 표준화·맥락화: 이름·단위·용어 통일과 관계 부여 (제품 페이지 '의미 기반 지식화' 기둥)
 */
import React, { useMemo, useState } from "react";
import { Check, CircleDot } from "lucide-react";
import { PageShell, useToast } from "../../common.jsx";
import { getQdata } from "./schema.js";
import { Card, Stat, SectionTitle, Badge, Table, Td, Note, cx } from "./ui.jsx";

export const QdPipelinePage = ({ domain }) => {
  const p = getQdata(domain).pipeline;
  const [sel, setSel] = useState(null);
  const stage = sel != null ? p.stages[sel] : null;

  return (
    <PageShell breadcrumb={["QData", "코어 파이프라인", "6단계 파이프라인"]} title="6단계 코어 파이프라인"
      sub="흩어진 원본을 6단계로 다듬어 품질·일관성·맥락을 갖춘 AI-Ready 데이터로 만듭니다. 단계를 누르면 설명이 보입니다.">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 mb-2" role="tablist" aria-label="파이프라인 단계">
        {p.stages.map((s, i) => (
          <button key={s.key} role="tab" aria-selected={sel === i} onClick={() => setSel(sel === i ? null : i)}
            className="text-left rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-qd-primary">
            <Card className={cx("p-3 h-full transition-all", sel === i ? "border-qd-primary bg-qd-cool" : "hover:border-qd-primary")}>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-qd-primary text-white text-[12px] font-black flex items-center justify-center">{i + 1}</span>
                <span className="text-[13px] font-black text-qd-ink">{s.label}</span>
              </div>
              <div className="text-[12px] text-qd-muted font-bold mt-1.5">{s.ko}</div>
              <div className="text-[16px] font-black text-qd-deep tabular-nums mt-2">{s.count}</div>
              <div className="text-[11px] text-qd-subtle font-medium">{s.detail}</div>
            </Card>
          </button>
        ))}
      </div>
      <div className="min-h-[40px] mb-5">
        {stage && (
          <p className="text-[13px] text-qd-ink font-medium px-1 pt-1">
            <span className="font-black text-qd-primary">{stage.label} · {stage.ko}</span> — {stage.desc}
          </p>
        )}
      </div>

      <Card className="p-4">
        <SectionTitle>데이터셋별 진행 상태</SectionTitle>
        <Table head={["데이터셋", "원천", ...p.stages.map(s => s.label), "상태"]} minWidth={980}>
          {p.datasets.map(d => (
            <tr key={d.id}>
              <Td className="font-bold text-qd-ink">{d.name}{d.issue && <div className="text-[11px] text-amber-700 font-medium">{d.issue}</div>}</Td>
              <Td className="text-qd-muted">{d.source}</Td>
              {p.stages.map((s, i) => (
                <Td key={s.key}>
                  {i < d.reached
                    ? <Check className="w-4 h-4 text-emerald-600" aria-label="완료" />
                    : i === d.reached && d.status !== "완료"
                      ? <CircleDot className={cx("w-4 h-4", d.status === "경고" ? "text-amber-600" : "text-qd-primary")} aria-label="진행 중" />
                      : i === d.reached
                        ? <Check className="w-4 h-4 text-emerald-600" aria-label="완료" />
                        : <span className="block w-4 h-1 rounded bg-qd-line" aria-label="대기" />}
                </Td>
              ))}
              <Td><Badge>{d.status}</Badge></Td>
            </tr>
          ))}
        </Table>
        <Note>✓ 완료 · ● 현재 단계 · — 대기. 단계를 건너뛰지 않으며, 품질 규칙을 통과해야 다음 단계로 넘어갑니다.</Note>
      </Card>
    </PageShell>
  );
};

export const QdStandardizePage = ({ domain }) => {
  const s = getQdata(domain).standardize;
  const toast = useToast();
  const [onlyUnmapped, setOnlyUnmapped] = useState(false);
  const rows = useMemo(() => s.tagMappings.filter(t => !onlyUnmapped || t.status !== "매핑"), [s, onlyUnmapped]);

  return (
    <PageShell breadcrumb={["QData", "코어 파이프라인", "표준화·맥락화"]} title="표준화·맥락화"
      sub="공통 데이터 형식과 용어 체계로 서로 다른 이름과 단위를 통일하고, 데이터 관계와 의미 기반 검색을 함께 지원합니다.">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {s.stats.map(x => <Stat key={x.label} {...x} />)}
      </div>

      <Card className="p-4 mb-4">
        <SectionTitle right={
          <label className="flex items-center gap-2 text-[12px] font-bold text-qd-muted cursor-pointer min-h-[32px]">
            <input type="checkbox" checked={onlyUnmapped} onChange={e => setOnlyUnmapped(e.target.checked)} className="accent-qd-primary w-4 h-4" />
            미매핑만 보기
          </label>}>
          태그 표준 매핑
        </SectionTitle>
        <Table head={["원본 태그", "원천", "표준 이름", "단위", "변환 규칙", "상태", ""]} minWidth={860}>
          {rows.map(t => (
            <tr key={t.raw}>
              <Td className="font-mono text-[12px] text-qd-ink">{t.raw}</Td>
              <Td className="text-qd-muted">{t.source}</Td>
              <Td className="font-bold text-qd-ink">{t.standard}</Td>
              <Td className="text-qd-muted">{t.unit}</Td>
              <Td className="text-qd-muted">{t.rule}</Td>
              <Td><Badge>{t.status}</Badge></Td>
              <Td right>
                {t.status !== "매핑" && (
                  <button onClick={() => toast?.(`${t.raw} — 유사 태그 기반 표준 이름 후보 3건을 제안했습니다(검토 후 확정).`, "info")}
                    className="px-2.5 py-1 rounded-md text-[12px] font-bold text-qd-deep border border-qd-line hover:bg-qd-cool min-h-[32px]">
                    매핑 제안
                  </button>
                )}
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="p-4">
          <SectionTitle>단위 변환 규칙</SectionTitle>
          <div className="space-y-2">
            {s.unitRules.map(u => (
              <div key={u.from + u.to} className="px-3 py-2 rounded-lg border border-qd-line">
                <div className="text-[13px] font-black text-qd-ink">{u.from} → {u.to}</div>
                <div className="text-[12px] text-qd-muted font-medium">{u.factor} · {u.scope}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <SectionTitle>용어 사전</SectionTitle>
          <div className="space-y-2">
            {s.glossary.map(g => (
              <div key={g.term} className="px-3 py-2 rounded-lg border border-qd-line">
                <div className="text-[13px] font-black text-qd-ink">{g.term} <span className="text-[11px] font-bold text-qd-subtle">· {g.owner}</span></div>
                <div className="text-[12px] text-qd-muted font-medium">{g.definition}</div>
                <div className="text-[11px] text-qd-subtle mt-0.5">동의어: {g.synonyms.join(", ")}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <SectionTitle>맥락 관계 (Contextualize)</SectionTitle>
          <div className="space-y-2">
            {s.relations.map(r => (
              <div key={r.from + r.to} className="px-3 py-2 rounded-lg border border-qd-line text-[12px]">
                <span className="font-bold text-qd-ink">{r.from}</span>
                <span className="mx-1.5 px-1.5 py-0.5 rounded bg-qd-cool text-qd-deep font-black text-[11px]">{r.rel}</span>
                <span className="font-bold text-qd-ink">{r.to}</span>
              </div>
            ))}
          </div>
          <Note>관계가 있어야 "왜 이런 결과가 나왔나"를 원천 데이터까지 되짚을 수 있습니다.</Note>
        </Card>
      </div>
    </PageShell>
  );
};
