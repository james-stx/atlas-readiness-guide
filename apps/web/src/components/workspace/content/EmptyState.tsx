'use client';

import { AtlasLogo } from '@/components/AtlasLogo';

export function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center max-w-sm">
        <AtlasLogo variant="blue" size={64} className="mx-auto mb-5" />
        <h3 className="text-[18px] font-semibold text-[#37352F]">
          Select a domain to begin
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-[#787671]">
          Choose a readiness domain from the sidebar to start your assessment journey.
        </p>
      </div>
    </div>
  );
}
