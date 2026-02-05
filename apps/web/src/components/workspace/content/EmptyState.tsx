'use client';

import { Compass } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--bg-tertiary)]">
          <Compass className="h-8 w-8 text-[var(--text-tertiary)]" />
        </div>
        <h3 className="text-h3-workspace text-[var(--text-primary)]">
          Select a domain to begin
        </h3>
        <p className="mt-1.5 max-w-xs text-body text-[var(--text-secondary)]">
          Choose a readiness domain from the sidebar to start your assessment.
        </p>
      </div>
    </div>
  );
}
