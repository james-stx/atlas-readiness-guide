'use client';

import { Compass } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center max-w-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7F6F3]">
          <Compass className="h-8 w-8 text-[#9B9A97]" />
        </div>
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
