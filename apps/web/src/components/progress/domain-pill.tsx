'use client';

import { cn } from '@/lib/utils';
import type { DomainType } from '@atlas/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export type DomainStatus = 'not_started' | 'in_progress' | 'adequate';

interface DomainPillProps {
  domain: DomainType;
  label: string;
  status: DomainStatus;
  isCurrent?: boolean;
  inputCount: number;
  onClick?: () => void;
  size?: 'sm' | 'md';
  className?: string;
}

const domainLabels: Record<DomainType, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'Go-to-Market',
  operations: 'Operations',
  financials: 'Financials',
};

export function DomainPill({
  domain,
  label,
  status,
  isCurrent = false,
  inputCount,
  onClick,
  size = 'md',
  className,
}: DomainPillProps) {
  const sizeClasses = size === 'sm' ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs';

  const statusClasses = {
    not_started: 'bg-white border-slate-300 text-slate-400',
    in_progress: 'bg-primary-50 border-primary-300 text-primary',
    adequate: 'bg-primary border-primary text-white',
  };

  const tooltipText = `${domainLabels[domain]}: ${inputCount} input${inputCount !== 1 ? 's' : ''} captured`;
  const ariaLabel = `${domainLabels[domain]} domain: ${inputCount} inputs captured, ${status === 'adequate' ? 'adequate' : status === 'in_progress' ? 'in progress' : 'not started'} coverage${isCurrent ? '. Current domain.' : ''}`;

  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={cn(
              'rounded-full border-2 font-semibold flex items-center justify-center',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2',
              sizeClasses,
              statusClasses[status],
              isCurrent && 'ring-2 ring-primary-300 ring-offset-1 scale-110',
              className
            )}
            aria-label={ariaLabel}
            aria-current={isCurrent ? 'step' : undefined}
          >
            {label}
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="bg-slate-900 text-white text-xs px-3 py-2 rounded-md"
        >
          <p className="font-medium">{domainLabels[domain]}</p>
          <p className="text-slate-300">{inputCount} input{inputCount !== 1 ? 's' : ''} captured</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
