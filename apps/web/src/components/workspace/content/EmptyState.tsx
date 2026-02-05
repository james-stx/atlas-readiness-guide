'use client';

import { Compass } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-warm-100">
          <Compass className="h-8 w-8 text-warm-400" />
        </div>
        <h3 className="text-ws-heading text-warm-900">
          Select a domain to begin
        </h3>
        <p className="mt-1.5 max-w-xs text-ws-body text-warm-600">
          Choose a readiness domain from the sidebar to start your assessment.
        </p>
      </div>
    </div>
  );
}
