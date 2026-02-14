'use client';

import { cn } from '@/lib/utils';
import type { CriticalAction, AssumptionV3, DomainType } from '@atlas/types';

interface CriticalActionsSectionProps {
  criticalActions: CriticalAction[];
  assumptions: AssumptionV3[];
  className?: string;
}

const DOMAIN_LABELS: Record<DomainType, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'GTM',
  operations: 'Operations',
  financials: 'Financials',
};

export function CriticalActionsSection({
  criticalActions,
  assumptions,
  className,
}: CriticalActionsSectionProps) {
  // Guard against undefined arrays
  const safeActions = criticalActions || [];
  const safeAssumptions = assumptions || [];

  const hasCriticalActions = safeActions.length > 0;
  const hasAssumptions = safeAssumptions.length > 0;

  if (!hasCriticalActions && !hasAssumptions) {
    return null;
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Critical Actions */}
      {hasCriticalActions && (
        <div className="bg-white rounded-lg border border-[#E8E6E1] p-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[11px] font-medium uppercase tracking-wide text-[#E03E3E]">
              Critical Actions
            </h3>
            <span className="text-[12px] text-[#9B9A97]">
              {safeActions.length} item{safeActions.length !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-[12px] text-[#9B9A97] mb-4">
            Address before major investment
          </p>

          <div className="space-y-3">
            {safeActions.map((action, index) => (
              <CriticalActionCard
                key={index}
                action={action}
                number={index + 1}
              />
            ))}
          </div>
        </div>
      )}

      {/* Assumptions to Validate */}
      {hasAssumptions && (
        <div className="bg-white rounded-lg border border-[#E8E6E1] p-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[11px] font-medium uppercase tracking-wide text-[#D9730D]">
              Assumptions to Validate
            </h3>
            <span className="text-[12px] text-[#9B9A97]">
              {safeAssumptions.length} item{safeAssumptions.length !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-[12px] text-[#9B9A97] mb-4">
            Test before committing resources
          </p>

          <div className="space-y-3">
            {safeAssumptions.map((assumption, index) => (
              <AssumptionCard key={index} assumption={assumption} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CriticalActionCard({
  action,
  number,
}: {
  action: CriticalAction;
  number: number;
}) {
  return (
    <div className="bg-[#FBE4E4] rounded-lg p-4 border-l-[3px] border-[#E03E3E]">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#E03E3E] text-white text-[12px] font-medium flex items-center justify-center">
          {number}
        </span>
        <div className="flex-1 min-w-0">
          <h4 className="text-[14px] font-medium text-[#37352F] mb-1">
            {action.title}
          </h4>

          <p className="text-[11px] text-[#9B9A97] mb-2">
            Source: {DOMAIN_LABELS[action.source_domain]} → {action.source_topic} ({action.source_status})
          </p>

          <p className="text-[13px] text-[#5C5A56] mb-3">
            {action.description}
          </p>

          <div className="text-[13px]">
            <span className="text-[#E03E3E] font-medium">Action: </span>
            <span className="text-[#37352F]">{action.action}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AssumptionCard({ assumption }: { assumption: AssumptionV3 }) {
  return (
    <div className="bg-white border border-[#E8E6E1] rounded-lg p-4">
      <div className="flex items-start gap-3">
        <span className="text-[#D9730D] text-[16px] flex-shrink-0">◐</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-[14px] font-medium text-[#37352F]">
              {assumption.title}
            </h4>
            <span className="text-[11px] text-[#9B9A97] flex-shrink-0">
              {DOMAIN_LABELS[assumption.source_domain]}
            </span>
          </div>

          <p className="text-[11px] text-[#9B9A97] mb-2">
            Source: {DOMAIN_LABELS[assumption.source_domain]} → {assumption.source_topic}
          </p>

          <p className="text-[13px] text-[#5C5A56] mb-3">
            {assumption.description}
          </p>

          <div className="text-[13px]">
            <span className="text-[#9B9A97]">Validate: </span>
            <span className="text-[#37352F] font-medium">{assumption.validation}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
