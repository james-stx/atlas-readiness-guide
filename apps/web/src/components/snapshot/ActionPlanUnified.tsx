'use client';

import { cn } from '@/lib/utils';
import type { CriticalAction, AssumptionV3, ActionPlanItem, DomainType } from '@atlas/types';

interface ActionPlanUnifiedProps {
  criticalActions: CriticalAction[];
  assumptions: AssumptionV3[];
  actionPlan: ActionPlanItem[];
  className?: string;
}

const DOMAIN_LABELS: Record<DomainType, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'GTM',
  operations: 'Operations',
  financials: 'Financials',
};

export function ActionPlanUnified({
  criticalActions,
  assumptions,
  actionPlan,
  className,
}: ActionPlanUnifiedProps) {
  const hasBlockers = criticalActions.length > 0;
  const hasAssumptions = assumptions.length > 0;
  const hasRoadmap = actionPlan.length > 0;

  if (!hasBlockers && !hasAssumptions && !hasRoadmap) {
    return null;
  }

  // Group action plan by week
  const planByWeek = actionPlan.reduce((acc, item) => {
    const weekKey = item.week >= 3 ? 3 : item.week;
    if (!acc[weekKey]) {
      acc[weekKey] = [];
    }
    acc[weekKey].push(item);
    return acc;
  }, {} as Record<number, ActionPlanItem[]>);

  const weeks = Object.keys(planByWeek).map(Number).sort();

  return (
    <div className={cn('bg-white rounded-lg border border-[#E8E6E1] p-6', className)}>
      <h3 className="text-[16px] font-semibold text-[#37352F] mb-6">
        Your Action Plan
      </h3>

      <div className="space-y-8">
        {/* Blockers Section */}
        {hasBlockers && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[14px]">🔴</span>
              <h4 className="text-[11px] font-medium uppercase tracking-wide text-[#E03E3E]">
                Blockers
              </h4>
              <span className="text-[11px] text-[#9B9A97]">
                Address before proceeding
              </span>
            </div>

            <div className="space-y-3 pl-6">
              {criticalActions.map((action, index) => (
                <div key={index} className="border-l-2 border-[#E03E3E] pl-4 py-1">
                  <p className="text-[14px] font-medium text-[#37352F] mb-1">
                    {index + 1}. {action.title}
                  </p>
                  <p className="text-[13px] text-[#5C5A56] mb-2">
                    {action.description}
                  </p>
                  <div className="flex items-center gap-2 text-[12px] text-[#9B9A97]">
                    <span>Source: {DOMAIN_LABELS[action.source_domain]}</span>
                    <span>·</span>
                    <span>Unblocks: {action.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Validate Section */}
        {hasAssumptions && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[14px]">🟡</span>
              <h4 className="text-[11px] font-medium uppercase tracking-wide text-[#D9730D]">
                Validate Before Committing
              </h4>
            </div>

            <div className="space-y-3 pl-6">
              {assumptions.map((assumption, index) => (
                <div key={index} className="border-l-2 border-[#D9730D] pl-4 py-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-[14px] font-medium text-[#37352F]">
                      {assumption.title}
                    </p>
                    <span className="text-[11px] text-[#9B9A97] flex-shrink-0">
                      {DOMAIN_LABELS[assumption.source_domain]}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#5C5A56] mb-2">
                    {assumption.description}
                  </p>
                  <p className="text-[12px]">
                    <span className="text-[#9B9A97]">Test: </span>
                    <span className="text-[#37352F]">{assumption.validation}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 30-Day Roadmap Section */}
        {hasRoadmap && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[14px]">📋</span>
              <h4 className="text-[11px] font-medium uppercase tracking-wide text-[#2383E2]">
                30-Day Roadmap
              </h4>
            </div>

            <div className="space-y-4 pl-6">
              {weeks.map((week) => {
                const items = planByWeek[week];
                const weekLabel = week === 3 ? 'Weeks 3-4: Execution Prep' :
                  week === 1 ? 'Week 1: Foundation' : 'Week 2: Validation';

                return (
                  <div key={week}>
                    <p className="text-[12px] font-medium text-[#5C5A56] mb-2 uppercase tracking-wide">
                      {weekLabel}
                    </p>
                    <div className="space-y-2">
                      {items.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-4 h-4 rounded border border-[#D4D1CB]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] text-[#37352F]">
                              {item.action}
                            </p>
                            <p className="text-[11px] text-[#9B9A97]">
                              {DOMAIN_LABELS[item.source_domain]} · {item.source_topic}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
