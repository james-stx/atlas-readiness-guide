'use client';

import type { RoadmapAction, DomainType, ExpansionPositioning } from '@atlas/types';

const DOMAIN_LABELS: Record<DomainType, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'Go-to-Market',
  operations: 'Operations',
  financials: 'Financials',
};

const POSITIONING_LABELS: Record<ExpansionPositioning, string> = {
  early_exploration: 'Early Exploration',
  foundation_building: 'Foundation Building',
  conditionally_positioned: 'Conditionally Positioned',
  well_positioned: 'Well Positioned',
  expansion_ready: 'Expansion Ready',
};

const NEXT_TIER: Partial<Record<ExpansionPositioning, string>> = {
  early_exploration: 'Foundation Building',
  foundation_building: 'Conditionally Positioned',
  conditionally_positioned: 'Well Positioned',
  well_positioned: 'Expansion Ready',
};

interface ReportRoadmapProps {
  positioning: ExpansionPositioning;
  phase1: RoadmapAction[];
  phase2: RoadmapAction[];
}

export function ReportRoadmap({ positioning, phase1, phase2 }: ReportRoadmapProps) {
  const nextTier = NEXT_TIER[positioning];
  const currentLabel = POSITIONING_LABELS[positioning];

  return (
    <section>
      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9B9A97] mb-1">
        Your 90-Day Expansion Roadmap
      </p>
      {nextTier && (
        <p className="text-[12px] text-[#9B9A97] mb-4">
          To move from <span className="font-medium text-[#5C5A56]">{currentLabel}</span> to{' '}
          <span className="font-medium text-[#5C5A56]">{nextTier}</span>, the next 90 days
          need to close your critical gaps and validate your key assumptions.
        </p>
      )}

      <div className="space-y-3">
        {/* Phase 1 */}
        {phase1.length > 0 && (
          <div className="bg-white rounded-lg border border-[#E8E6E1] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#F1F0EC] bg-[#F7F6F3]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#787671]">
                Phase 1 · Days 1–30
              </p>
              <p className="text-[13px] font-semibold text-[#37352F] mt-0.5">Remove the Blockers</p>
              <p className="text-[12px] text-[#9B9A97] mt-1">
                Nothing in Phase 2 or 3 is possible while these remain open. They're not complex —
                but they are the foundation everything else sits on.
              </p>
            </div>
            <div className="divide-y divide-[#F1F0EC]">
              {phase1.map((action, i) => (
                <div key={i} className="px-4 py-3">
                  <div className="flex items-start gap-2.5">
                    <span className="text-[13px] text-[#D4D1CB] shrink-0 mt-0.5">→</span>
                    <div>
                      <p className="text-[13px] text-[#37352F]">{action.action}</p>
                      {action.rationale && (
                        <p className="text-[12px] text-[#9B9A97] mt-0.5">{action.rationale}</p>
                      )}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F7F6F3] text-[#787671] border border-[#E8E6E1]">
                          {DOMAIN_LABELS[action.source_domain]}
                        </span>
                        <span className="text-[10px] text-[#B8B5B1]">{action.source_topic}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Phase 2 */}
        {phase2.length > 0 && (
          <div className="bg-white rounded-lg border border-[#E8E6E1] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#F1F0EC] bg-[#F7F6F3]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#787671]">
                Phase 2 · Days 31–60
              </p>
              <p className="text-[13px] font-semibold text-[#37352F] mt-0.5">Test the Assumptions</p>
              <p className="text-[12px] text-[#9B9A97] mt-1">
                These are the decisions that will determine whether your first 12 months generate
                momentum or burn cash without traction.
              </p>
            </div>
            <div className="divide-y divide-[#F1F0EC]">
              {phase2.map((action, i) => (
                <div key={i} className="px-4 py-3">
                  <div className="flex items-start gap-2.5">
                    <span className="text-[13px] text-[#D4D1CB] shrink-0 mt-0.5">→</span>
                    <div>
                      <p className="text-[13px] text-[#37352F]">{action.action}</p>
                      {action.rationale && (
                        <p className="text-[12px] text-[#9B9A97] mt-0.5">{action.rationale}</p>
                      )}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F7F6F3] text-[#787671] border border-[#E8E6E1]">
                          {DOMAIN_LABELS[action.source_domain]}
                        </span>
                        <span className="text-[10px] text-[#B8B5B1]">{action.source_topic}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Phase 3 — locked teaser */}
        <div className="bg-white rounded-lg border border-[#E8E6E1] overflow-hidden opacity-80">
          <div className="px-4 py-3 border-b border-[#F1F0EC] bg-[#F7F6F3]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#B8B5B1]">
                  Phase 3 · Days 61–90
                </p>
                <p className="text-[13px] font-semibold text-[#9B9A97] mt-0.5">Build the Go-to-Market</p>
              </div>
              <span className="text-[11px] px-2 py-1 rounded bg-[#F1F0EC] text-[#9B9A97] border border-[#E8E6E1]">
                Unlocks after Phase 2
              </span>
            </div>
          </div>
          <div className="px-4 py-4">
            <p className="text-[13px] leading-relaxed text-[#9B9A97]">
              What Phase 3 looks like depends entirely on what you learn in Phase 2. The right
              sales motion, first hire, channel mix, and launch sequence will only become clear
              once your core assumptions have been tested against the actual market.
            </p>
            <p className="text-[13px] leading-relaxed text-[#9B9A97] mt-2">
              Getting Phase 3 right is where most companies either build real momentum or stall.
              It's also where the quality of your plan — and the support behind it — makes the
              biggest difference.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#37352F] rounded-lg p-5 text-center">
          <p className="text-[15px] font-semibold text-white mb-1">
            You now know what you're working with.
          </p>
          <p className="text-[13px] text-[#9B9A97] mb-4 leading-relaxed">
            You know where you're strong, what's at risk, and what needs to happen in the
            next 90 days. The question is whether you want help making it happen.
          </p>
          <p className="text-[12px] text-[#787671] mb-4 leading-relaxed">
            Atlas can work through each phase with you — pressure-testing decisions, validating
            assumptions, and building the execution plan your expansion actually needs.
          </p>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#37352F] rounded-lg text-[13px] font-semibold hover:bg-[#F7F6F3] transition-colors">
            Let's build the plan together →
          </button>
        </div>
      </div>
    </section>
  );
}
