'use client';

import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { ArrowRight, Target, AlertTriangle, HelpCircle, ListChecks } from 'lucide-react';

interface UnlockPreviewProps {
  className?: string;
}

const UNLOCK_ITEMS = [
  {
    icon: Target,
    title: 'Readiness Verdict',
    description: 'Clear assessment: Ready / Ready with Caveats / Not Ready with domain-by-domain confidence breakdown',
    color: 'text-[#0F7B6C]',
    bgColor: 'bg-[#DDEDEA]',
  },
  {
    icon: AlertTriangle,
    title: 'Critical Blockers',
    description: 'Specific issues that could derail your expansion with source traceability and recommended actions',
    color: 'text-[#E03E3E]',
    bgColor: 'bg-[#FBE4E4]',
  },
  {
    icon: HelpCircle,
    title: 'Assumptions to Validate',
    description: 'Beliefs embedded in your plan that need testing before committing resources',
    color: 'text-[#D9730D]',
    bgColor: 'bg-[#FAEBDD]',
  },
  {
    icon: ListChecks,
    title: '30-Day Action Plan',
    description: 'Prioritized, sequenced actions organized by week with dependency mapping',
    color: 'text-[#2383E2]',
    bgColor: 'bg-[#DDEBF1]',
  },
];

export function UnlockPreview({ className }: UnlockPreviewProps) {
  const router = useRouter();

  return (
    <div className={cn('bg-white rounded-lg border border-[#E8E6E1] p-5', className)}>
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-[15px] font-semibold text-[#37352F] mb-1">
          Complete Your Assessment to Unlock
        </h3>
        <p className="text-[13px] text-[#5C5A56]">
          Your full readiness report will include:
        </p>
      </div>

      {/* Unlock items */}
      <div className="space-y-3 mb-5">
        {UNLOCK_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex items-start gap-3"
            >
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                item.bgColor
              )}>
                <Icon className={cn('w-4 h-4', item.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[13px] font-medium text-[#37352F]">
                  {item.title}
                </h4>
                <p className="text-[12px] text-[#5C5A56] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <button
        onClick={() => router.push('/workspace')}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2383E2] text-white rounded-lg text-[14px] font-medium hover:bg-[#1A6DC0] transition-colors"
      >
        Continue Assessment
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
