'use client';

import { useWorkspace } from '@/lib/context/workspace-context';
import { DOMAINS } from '@/lib/progress';
import { SidebarDomainItem } from './SidebarDomainItem';
import { SidebarTopicItem } from './SidebarTopicItem';
import { SidebarFooter } from './SidebarFooter';

export function Sidebar() {
  const {
    selectedDomain,
    expandedDomains,
    progressState,
    selectDomain,
    selectCategory,
    toggleDomainExpand,
    getTopicsForDomain,
    getDomainInputCount,
  } = useWorkspace();

  return (
    <nav
      className="flex h-full w-sidebar flex-col border-r border-warm-200 bg-warm-100"
      aria-label="Assessment navigation"
    >
      {/* Section header */}
      <div className="px-4 pt-4 pb-2">
        <span className="text-ws-caption-sm uppercase tracking-wider text-warm-500">
          Assessment
        </span>
      </div>

      {/* Domain list */}
      <div
        className="flex-1 overflow-y-auto px-2 scrollbar-thin"
        role="tree"
        aria-label="Assessment domains"
      >
        <div className="space-y-0.5">
          {DOMAINS.map((domain) => {
            const dp = progressState.domainProgress[domain.key];
            const topics = getTopicsForDomain(domain.key);
            const count = getDomainInputCount(domain.key);

            return (
              <SidebarDomainItem
                key={domain.key}
                domain={domain.key}
                label={domain.label}
                status={dp.status}
                isSelected={selectedDomain === domain.key}
                isExpanded={expandedDomains.includes(domain.key)}
                count={count}
                onSelect={() => selectDomain(domain.key)}
                onToggleExpand={() => toggleDomainExpand(domain.key)}
              >
                <div className="ml-2">
                  {topics.map((topic, i) => (
                    <SidebarTopicItem
                      key={topic.id}
                      label={topic.label}
                      covered={topic.covered}
                      isLast={i === topics.length - 1}
                      onClick={() => selectCategory(domain.key, topic.id)}
                    />
                  ))}
                </div>
              </SidebarDomainItem>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <SidebarFooter />
    </nav>
  );
}
