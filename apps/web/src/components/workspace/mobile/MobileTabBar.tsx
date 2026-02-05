'use client';

import { cn } from '@/lib/utils';
import { useWorkspace } from '@/lib/context/workspace-context';
import { List, FileText, MessageSquare } from 'lucide-react';

type Tab = 'domains' | 'content' | 'chat';

const tabs: { key: Tab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { key: 'domains', label: 'Domains', icon: List },
  { key: 'content', label: 'Content', icon: FileText },
  { key: 'chat', label: 'Chat', icon: MessageSquare },
];

export function MobileTabBar() {
  const { mobileTab, setMobileTab } = useWorkspace();

  return (
    <nav
      className="flex border-t border-warm-200 bg-white safe-area-bottom"
      role="tablist"
      aria-label="Workspace navigation"
    >
      {tabs.map((tab) => {
        const isActive = mobileTab === tab.key;
        const Icon = tab.icon;

        return (
          <button
            key={tab.key}
            onClick={() => setMobileTab(tab.key)}
            className={cn(
              'relative flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors duration-fast',
              isActive ? 'text-accent' : 'text-warm-400'
            )}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.key}`}
          >
            {isActive && (
              <span className="absolute top-0 h-0.5 w-12 rounded-full bg-accent" />
            )}
            <Icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
