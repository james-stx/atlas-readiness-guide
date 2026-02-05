'use client';

import { ProgressBarMini } from '@/components/ui/progress-bar-mini';
import { DOMAIN_DESCRIPTIONS } from '@atlas/config';
import type { DomainType } from '@atlas/types';
import { DOMAINS } from '@/lib/progress';

interface ContentDomainHeaderProps {
  domain: DomainType;
  count: { current: number; total: number };
}

export function ContentDomainHeader({ domain, count }: ContentDomainHeaderProps) {
  const domainInfo = DOMAINS.find((d) => d.key === domain);
  const label = domainInfo?.label ?? domain;
  const description = DOMAIN_DESCRIPTIONS[domain];

  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-ws-display text-warm-900">
            {label} Readiness
          </h2>
          <p className="mt-1 text-ws-body text-warm-600">
            {description}
          </p>
        </div>
        <ProgressBarMini
          value={count.current}
          max={count.total}
          width="100px"
          showLabel
          labelFormat="fraction"
          fractionParts={count}
          className="shrink-0 pt-1"
        />
      </div>
    </div>
  );
}
