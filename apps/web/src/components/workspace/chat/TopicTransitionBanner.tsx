'use client';

import { ArrowRight } from 'lucide-react';
import type { DomainType } from '@atlas/types';
import { DOMAINS } from '@/lib/progress';

interface TopicTransitionBannerProps {
  fromDomain?: DomainType;
  toDomain: DomainType;
}

export function TopicTransitionBanner({ fromDomain, toDomain }: TopicTransitionBannerProps) {
  const toLabel = DOMAINS.find(d => d.key === toDomain)?.label || toDomain;
  const fromLabel = fromDomain ? DOMAINS.find(d => d.key === fromDomain)?.label : null;

  return (
    <div className="flex items-center justify-center py-3 my-2">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F7F6F3] border border-[#E8E7E4]">
        {fromLabel && (
          <>
            <span className="text-[12px] text-[#9B9B9B]">{fromLabel}</span>
            <ArrowRight className="h-3 w-3 text-[#9B9B9B]" />
          </>
        )}
        <span className="text-[12px] font-medium text-[#37352F]">
          Now discussing: {toLabel}
        </span>
      </div>
    </div>
  );
}
