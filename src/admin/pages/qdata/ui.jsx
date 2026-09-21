/**
 * QData 콘솔 공용 UI 조각 — 색은 index.css의 qd 토큰만 쓴다(임의 색 금지).
 * 상태 색만 의미색(emerald/amber/rose)을 쓴다: 정상·주의·위험은 브랜드와 별개 의미라서.
 */
import React from "react";

export const cx = (...c) => c.filter(Boolean).join(" ");

const TONE_TEXT = { emerald: "text-emerald-700", amber: "text-amber-700", rose: "text-rose-700" };

export const Card = ({ className, children }) => (
  <div className={cx("bg-white rounded-xl border border-qd-line", className)}>{children}</div>
);

export const SectionTitle = ({ children, right }) => (
  <div className="flex items-center justify-between gap-3 mb-3">
    <h3 className="text-[15px] font-black text-qd-ink">{children}</h3>
    {right}
  </div>
);

export const Stat = ({ label, value, note, tone }) => (
  <Card className="px-4 py-3 min-w-0">
    <div className="text-[12px] font-bold text-qd-muted truncate">{label}</div>
    <div className={cx("text-[22px] font-black tabular-nums leading-tight mt-1", TONE_TEXT[tone] || "text-qd-ink")}>{value}</div>
    {note && <div className="text-[11px] text-qd-subtle font-medium mt-0.5 truncate">{note}</div>}
  </Card>
);

const STATUS_STYLE = {
  정상: "bg-emerald-50 text-emerald-700 border-emerald-200",
  완료: "bg-emerald-50 text-emerald-700 border-emerald-200",
  통과: "bg-emerald-50 text-emerald-700 border-emerald-200",
  매핑: "bg-emerald-50 text-emerald-700 border-emerald-200",
  주의: "bg-amber-50 text-amber-700 border-amber-200",
  진행: "bg-qd-cool text-qd-deep border-qd-line",
  버퍼링: "bg-amber-50 text-amber-700 border-amber-200",
  경고: "bg-amber-50 text-amber-700 border-amber-200",
  미매핑: "bg-amber-50 text-amber-700 border-amber-200",
  위반: "bg-rose-50 text-rose-700 border-rose-200",
  중단: "bg-rose-50 text-rose-700 border-rose-200",
};

export const Badge = ({ children, className }) => (
  <span className={cx("inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-black border whitespace-nowrap",
    STATUS_STYLE[children] || "bg-qd-warm text-qd-muted border-qd-line", className)}>{children}</span>
);

export const Chip = ({ children }) => (
  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold bg-qd-cool text-qd-deep border border-qd-line">{children}</span>
);

/** 표 — 좁은 화면에서는 가로 스크롤(페이지 전체가 밀리지 않게 표 안에서만) */
export const Table = ({ head, children, minWidth = 640 }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left" style={{ minWidth }}>
      <thead>
        <tr className="text-[11px] font-black text-qd-subtle tracking-wide border-b border-qd-line">
          {head.map((h, i) => <th key={i} className={cx("py-2.5 px-3", h.right && "text-right")}>{h.label || h}</th>)}
        </tr>
      </thead>
      <tbody className="text-[13px]">{children}</tbody>
    </table>
  </div>
);

export const Td = ({ children, className, right }) => (
  <td className={cx("py-2.5 px-3 border-b border-qd-line/70", right && "text-right tabular-nums", className)}>{children}</td>
);

export const Note = ({ children }) => (
  <p className="text-[12px] text-qd-subtle font-medium mt-3">{children}</p>
);
