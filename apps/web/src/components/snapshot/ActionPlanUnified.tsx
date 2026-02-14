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
  // Guard against undefined arrays
  const safeActions = criticalActions || [];
  const safeAssumptions = assumptions || [];
  const safeActionPlan = actionPlan || [];

  const hasBlockers = safeActions.length > 0;
  const hasAssumptions = safeAssumptions.length > 0;
  const hasRoadmap = safeActionPlan.length > 0;

  if (!hasBlockers && !hasAssumptions && !hasRoadmap) {
    return null;
  }

  // Group action plan by week
  const planByWeek = safeActionPlan.reduce((acc, item) => {
    const weekKey = item.week >= 3 ? 3 : item.week;
    if (!acc[weekKey]) {
      acc[weekKey] = [];
    }
    acc[weekKey].push(item);
    return acc;
  }, {} as Record<number, ActionPlanItem[]>);

  const weeks = Object.keys(planByWeek).map(Number).sort();

  return (
    <div className={cn('space-y-6', className)}>
      {/* Section: Critical Actions - Red theme per spec */}
      {hasBlockers && (
        <div className="bg-white rounded-lg border border-[#E8E6E1] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[16px] font-semibold text-[#E03E3E]">
                Critical Actions
              </h3>
              <p className="text-[12px] text-[#9B9A97]">
                Address before major investment
              </p>
            </div>
            <span className="text-[12px] text-[#9B9A97]">
              {safeActions.length} item{safeActions.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-4">
            {safeActions.map((action, index) => (
              <div
                key={index}
                className="bg-[#FBE4E4] rounded-lg p-4 border-l-4 border-[#E03E3E]"
              >
                <div className="flex items-start gap-3">
                  <span className="text-[14px] font-bold text-[#E03E3E] mt-0.5">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-[14px] font-semibold text-[#37352F] mb-1">
                      {action.title}
                    </p>
                    {/* Source traceability per spec */}
                    <p className="text-[12px] text-[#9B9A97] mb-2">
                      Source: {DOMAIN_LABELS[action.source_domain]} → {action.source_topic} ({action.source_status || 'not covered'})
                    </p>
                    <p className="text-[13px] text-[#5C5A56] mb-2">
                      {action.description}
                    </p>
                    <p className="text-[13px]">
                      <span className="font-medium text-[#37352F]">Action: </span>
                      <span className="text-[#5C5A56]">{action.action}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section: Assumptions to Validate - Amber theme per spec */}
      {hasAssumptions && (
        <div className="bg-white rounded-lg border border-[#E8E6E1] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[16px] font-semibold text-[#D9730D]">
                Assumptions to Validate
              </h3>
              <p className="text-[12px] text-[#9B9A97]">
                Test before committing resources
              </p>
            </div>
            <span className="text-[12px] text-[#9B9A97]">
              {safeAssumptions.length} item{safeAssumptions.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-4">
            {safeAssumptions.map((assumption, index) => (
              <div
                key={index}
                className="bg-[#FAEBDD] rounded-lg p-4 border-l-4 border-[#D9730D]"
              >
                <div className="flex items-start gap-3">
                  <span className="text-[14px] text-[#D9730D] mt-0.5">◐</span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-[14px] font-semibold text-[#37352F]">
                        {assumption.title}
                      </p>
                      <span className="text-[11px] text-[#9B9A97] flex-shrink-0 uppercase">
                        {DOMAIN_LABELS[assumption.source_domain]}
                      </span>
                    </div>
                    {/* Source traceability */}
                    <p className="text-[12px] text-[#9B9A97] mb-2">
                      Source: {DOMAIN_LABELS[assumption.source_domain]} → {assumption.source_topic}
                    </p>
                    <p className="text-[13px] text-[#5C5A56] mb-2">
                      {assumption.description}
                    </p>
                    <p className="text-[13px]">
                      <span className="font-medium text-[#37352F]">Validate: </span>
                      <span className="text-[#5C5A56]">{assumption.validation}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section: 30-Day Action Plan - Blue theme per spec */}
      {hasRoadmap && (
        <div className="bg-white rounded-lg border border-[#E8E6E1] p-6">
          <h3 className="text-[16px] font-semibold text-[#2383E2] mb-4">
            30-Day Action Plan
          </h3>

          <div className="space-y-6">
            {weeks.map((week) => {
              const items = planByWeek[week];
              const weekLabel = week === 3 ? 'Weeks 3-4' :
                week === 1 ? 'Week 1' : 'Week 2';
              const weekSubtitle = week === 3 ? 'Execution Prep' :
                week === 1 ? 'Foundation' : 'Validation';

              return (
                <div key={week}>
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-[13px] font-semibold text-[#37352F] uppercase tracking-wide">
                      {weekLabel}
                    </p>
                    <span className="text-[12px] text-[#9B9A97]">
                      — {weekSubtitle}
                    </span>
                  </div>
                  <div className="border-l-2 border-[#E8E6E1] pl-4 space-y-4">
                    {items.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        {/* Checkbox style per spec */}
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-4 h-4 rounded border-2 border-[#D4D1CB]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] text-[#37352F]">
                            {item.action}
                          </p>
                          <p className="text-[12px] text-[#9B9A97]">
                            {DOMAIN_LABELS[item.source_domain]} → {item.source_topic}
                          </p>
                          {item.unblocks && (
                            <p className="text-[12px] text-[#5C5A56] mt-1">
                              <span className="font-medium">Unblocks:</span> {item.unblocks}
                            </p>
                          )}
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
  );
}
