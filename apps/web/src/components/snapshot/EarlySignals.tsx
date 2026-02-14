'use client';

import { cn } from '@/lib/utils';
import type { CrossDomainSignal, DomainType, SignalType } from '@atlas/types';

interface EarlySignalsProps {
  signals: CrossDomainSignal[];
  className?: string;
}

const SIGNAL_CONFIG: Record<SignalType, {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}> = {
  strength: {
    label: 'STRENGTH',
    color: 'text-[#0F7B6C]',
    bgColor: 'bg-[#DDEDEA]',
    icon: '●',
  },
  pattern: {
    label: 'PATTERN',
    color: 'text-[#2383E2]',
    bgColor: 'bg-[#DDEBF1]',
    icon: '◉',
  },
  risk: {
    label: 'RISK',
    color: 'text-[#D9730D]',
    bgColor: 'bg-[#FAEBDD]',
    icon: '◐',
  },
  unknown: {
    label: 'UNKNOWN',
    color: 'text-[#9B9A97]',
    bgColor: 'bg-[#FAF9F7]',
    icon: '○',
  },
};

const DOMAIN_LABELS: Record<DomainType, string> = {
  market: 'Market',
  product: 'Product',
  gtm: 'GTM',
  operations: 'Operations',
  financials: 'Financials',
};

export function EarlySignals({ signals, className }: EarlySignalsProps) {
  if (!signals || signals.length === 0) {
    return null;
  }

  return (
    <div className={cn('bg-white rounded-lg border border-[#E8E6E1] p-5', className)}>
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-[15px] font-semibold text-[#37352F] mb-1">
          Early Signals
        </h3>
        <p className="text-[13px] text-[#5C5A56]">
          What we can see from your inputs so far
        </p>
      </div>

      {/* Signals */}
      <div className="space-y-4">
        {signals.map((signal, index) => {
          const config = SIGNAL_CONFIG[signal.type] || SIGNAL_CONFIG.unknown;

          return (
            <div
              key={index}
              className={cn(
                'rounded-lg p-4 border-l-[3px]',
                signal.type === 'strength' && 'bg-[#DDEDEA]/30 border-[#0F7B6C]',
                signal.type === 'pattern' && 'bg-[#DDEBF1]/30 border-[#2383E2]',
                signal.type === 'risk' && 'bg-[#FAEBDD]/30 border-[#D9730D]',
                signal.type === 'unknown' && 'bg-[#FAF9F7] border-[#9B9A97]'
              )}
            >
              {/* Signal header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={cn('text-[14px]', config.color)}>{config.icon}</span>
                  <h4 className="text-[14px] font-medium text-[#37352F]">
                    {signal.title}
                  </h4>
                </div>
                <span className={cn(
                  'px-2 py-0.5 rounded text-[10px] font-medium flex-shrink-0',
                  config.bgColor,
                  config.color
                )}>
                  {config.label}
                </span>
              </div>

              {/* Description */}
              <p className="text-[13px] text-[#5C5A56] leading-relaxed mb-3">
                {signal.description}
              </p>

              {/* Implication - the "so what?" */}
              {signal.implication && (
                <div className="bg-white/60 rounded p-2 mb-3">
                  <p className="text-[12px] text-[#37352F]">
                    <span className="font-medium">Implication: </span>
                    {signal.implication}
                  </p>
                </div>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#9B9A97]">
                {signal.derived_from && signal.derived_from.length > 0 && (
                  <span>
                    Derived from: {signal.derived_from.join(', ')}
                  </span>
                )}
                {signal.blocked_by && signal.blocked_by.length > 0 && (
                  <span className="text-[#D9730D]">
                    Blocked by: {signal.blocked_by.map(d => DOMAIN_LABELS[d]).join(', ')} incomplete
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
