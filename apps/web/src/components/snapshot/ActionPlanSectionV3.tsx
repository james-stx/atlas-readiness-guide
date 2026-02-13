'use client';

import { cn } from '@/lib/utils';
import type { ActionPlanItem, DomainType } from '@atlas/types';

interface ActionPlanSectionV3Props {
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

const WEEK_LABELS: Record<number, { title: string; subtitle: string }> = {
  1: { title: 'Week 1', subtitle: 'Foundation - Unblock critical dependencies' },
  2: { title: 'Week 2', subtitle: 'Validation - Test assumptions and fill gaps' },
  3: { title: 'Weeks 3-4', subtitle: 'Execution Prep - Prepare for launch' },
  4: { title: 'Weeks 3-4', subtitle: 'Execution Prep - Prepare for launch' },
};

export function ActionPlanSectionV3({ actionPlan, className }: ActionPlanSectionV3Props) {
  if (actionPlan.length === 0) {
    return null;
  }

  // Group by week, combining weeks 3 and 4
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
      <h3 className="text-[11px] font-medium uppercase tracking-wide text-[#2383E2] mb-1">
        30-Day Action Plan
      </h3>
      <p className="text-[12px] text-[#9B9A97] mb-6">
        Prioritized actions to improve your readiness
      </p>

      <div className="space-y-6">
        {weeks.map((week) => {
          const weekConfig = WEEK_LABELS[week];
          const items = planByWeek[week];

          return (
            <div key={week}>
              <div className="mb-3">
                <h4 className="text-[11px] font-medium uppercase tracking-wide text-[#9B9A97]">
                  {weekConfig.title}
                </h4>
                <p className="text-[12px] text-[#9B9A97]">
                  {weekConfig.subtitle}
                </p>
                <div className="border-t border-[#E8E6E1] mt-2" />
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <ActionItem key={index} item={item} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActionItem({ item }: { item: ActionPlanItem }) {
  return (
    <div className="flex gap-3">
      {/* Checkbox (visual only for printing) */}
      <div className="flex-shrink-0 mt-0.5">
        <div className="w-5 h-5 rounded border-2 border-[#E8E6E1] flex items-center justify-center" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium text-[#37352F] mb-1">
          {item.action}
        </p>

        <div className="flex items-center gap-2 flex-wrap text-[12px] text-[#9B9A97]">
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2383E2]" />
            {DOMAIN_LABELS[item.source_domain]} → {item.source_topic}
          </span>
        </div>

        {item.unblocks && (
          <p className="text-[12px] text-[#9B9A97] mt-1">
            Unblocks: {item.unblocks}
          </p>
        )}
      </div>
    </div>
  );
}
