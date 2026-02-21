'use client';

import type { RiskItem, DomainType } from '@atlas/types';
import { AlertTriangle } from 'lucide-react';

const DOMAIN_LABELS: Record<DomainType, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'Go-to-Market',
  operations: 'Operations',
  financials: 'Financials',
};

interface ReportRisksProps {
  risks: RiskItem[];
}

export function ReportRisks({ risks }: ReportRisksProps) {
  if (!risks || risks.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9B9A97]">
          Risks
        </p>
      </div>
      <p className="text-[12px] text-[#9B9A97] mb-3 -mt-1">
        Concerning signals that don't block expansion today — but will compound if left unaddressed.
      </p>

      <div className="space-y-2">
        {risks.map((r, i) => (
          <div key={i} className="bg-white rounded-lg border border-[#E8E6E1] overflow-hidden">
            {/* Source tag row */}
            <div className="flex items-center gap-2 px-4 pt-3 pb-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#FBF3DB] text-[#9A6700]">
                {DOMAIN_LABELS[r.source_domain]}
              </span>
              <span className="text-[11px] text-[#9B9A97]">·</span>
              <span className="text-[11px] text-[#787671]">{r.source_topic}</span>
              <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#FBF3DB] text-[#9A6700]">
                ◑ Medium
              </span>
            </div>

            <div className="px-4 pb-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-[#D9730D] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] font-semibold text-[#37352F] mb-1">{r.title}</p>
                  <p className="text-[13px] leading-relaxed text-[#5C5A56]">{r.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
