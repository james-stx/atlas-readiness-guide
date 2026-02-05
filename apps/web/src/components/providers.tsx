'use client';

import { AssessmentProvider } from '@/lib/context/assessment-context';
import { WorkspaceProvider } from '@/lib/context/workspace-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AssessmentProvider>
      <WorkspaceProvider>{children}</WorkspaceProvider>
    </AssessmentProvider>
  );
}
