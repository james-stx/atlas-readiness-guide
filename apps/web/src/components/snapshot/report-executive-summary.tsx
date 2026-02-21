'use client';

import type { ExpansionPositioning } from '@atlas/types';

const POSITIONING_CONFIG: Record<ExpansionPositioning, {
  label: string;
  index: number;
  color: string;
  bg: string;
  border: string;
}> = {
  early_exploration:       { label: 'Early Exploration',       index: 0, color: '#9B9A97', bg: '#F7F6F3', border: '#E8E6E1' },
  foundation_building:     { label: 'Foundation Building',     index: 1, color: '#D9730D', bg: '#FAEBDD', border: '#D9730D' },
  conditionally_positioned:{ label: 'Conditionally Positioned',index: 2, color: '#9A6700', bg: '#FBF3DB', border: '#E9B949' },
  well_positioned:         { label: 'Well Positioned',         index: 3, color: '#0F7B6C', bg: '#DDEDEA', border: '#0F7B6C' },
  expansion_ready:         { label: 'Expansion Ready',         index: 4, color: '#0F7B6C', bg: '#DDEDEA', border: '#0F7B6C' },
};

const TIERS: ExpansionPositioning[] = [
  'early_exploration',
  'foundation_building',
  'conditionally_positioned',
  'well_positioned',
  'expansion_ready',
];

interface ReportExecutiveSummaryProps {
  positioning: ExpansionPositioning;
  executiveSummary?: string;
}

export function ReportExecutiveSummary({ positioning, executiveSummary }: ReportExecutiveSummaryProps) {
  const cfg = POSITIONING_CONFIG[positioning];

  return (
    <section>
      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9B9A97] mb-3">
        Executive Summary
      </p>

      {/* Positioning tier + scale */}
      <div
        className="rounded-lg border p-5 mb-4"
        style={{ borderColor: cfg.border, backgroundColor: cfg.bg }}
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.06em] mb-1" style={{ color: cfg.color }}>
          Expansion Positioning
        </p>
        <p className="text-[20px] font-semibold mb-4" style={{ color: cfg.color }}>
          {cfg.label}
        </p>

        {/* Tier scale */}
        <div className="flex items-center gap-0">
          {TIERS.map((tier, i) => {
            const isCurrent = tier === positioning;
            const isPast = i < cfg.index;
            const tierCfg = POSITIONING_CONFIG[tier];
            return (
              <div key={tier} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-2.5 h-2.5 rounded-full border-2 transition-all"
                    style={{
                      backgroundColor: isCurrent ? cfg.color : isPast ? '#D4D1CB' : 'transparent',
                      borderColor: isCurrent ? cfg.color : isPast ? '#D4D1CB' : '#D4D1CB',
                      transform: isCurrent ? 'scale(1.3)' : 'scale(1)',
                    }}
                  />
                  <span
                    className="text-[9px] font-medium text-center leading-tight max-w-[52px]"
                    style={{ color: isCurrent ? cfg.color : '#B8B5B1' }}
                  >
                    {tierCfg.label}
                  </span>
                </div>
                {i < TIERS.length - 1 && (
                  <div
                    className="w-10 h-px mb-4"
                    style={{ backgroundColor: i < cfg.index ? '#D4D1CB' : '#E8E6E1' }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Narrative */}
      {executiveSummary && (
        <div className="bg-white rounded-lg border border-[#E8E6E1] p-5">
          <p className="text-[14px] leading-[1.7] text-[#37352F]">
            {executiveSummary}
          </p>
        </div>
      )}
    </section>
  );
}
