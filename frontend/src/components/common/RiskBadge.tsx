'use client';

interface RiskBadgeProps {
  isRiskFlagged?: boolean;
  riskFlag?: boolean;
  riskFactors?: string[];
  compact?: boolean;
}

const factorLabels: Record<string, string> = {
  BUDGET_OVERRUN: 'Budget Overrun',
  TIMELINE_DELAY: 'Timeline Delay',
  BUDGET_SPIKE: 'Budget Spike',
  GPS_FRAUD: 'GPS Fraud',
  PUBLIC_CONCERN: 'Public Concern',
};

export default function RiskBadge({ isRiskFlagged, riskFlag, riskFactors = [], compact = false }: RiskBadgeProps) {
  const flagged = isRiskFlagged || riskFlag;
  if (!flagged) {
    if (compact) return null;
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success-50 text-success-600 border border-success-200">
        &#10003; Clear
      </span>
    );
  }

  return (
    <span className="relative group inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-danger-50 text-danger-600 border border-danger-200 risk-pulse cursor-help">
      &#9888; RISK
      {riskFactors.length > 0 && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-white border border-surface-200 rounded-xl p-3 text-xs w-48 text-surface-600 shadow-elevated">
          {riskFactors.map((f) => (
            <div key={f} className="py-0.5">{factorLabels[f] || f}</div>
          ))}
        </span>
      )}
    </span>
  );
}
