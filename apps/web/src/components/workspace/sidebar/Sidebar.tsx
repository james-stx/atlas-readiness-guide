'use client';

import { useWorkspace } from '@/lib/context/workspace-context';
import { useAssessment } from '@/lib/context/assessment-context';
import { useRouter, usePathname } from 'next/navigation';
import { DOMAINS } from '@/lib/progress';
import { SidebarDomainItem } from './SidebarDomainItem';
import { SidebarTopicItem } from './SidebarTopicItem';
import { SidebarFooter } from './SidebarFooter';
import { FileText } from 'lucide-react';

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { snapshot } = useAssessment();
  const {
    selectedDomain,
    selectedCategory,
    expandedDomains,
    progressState,
    selectDomain,
    selectCategory,
    toggleDomainExpand,
    getTopicsForDomain,
    getDomainInputCount,
  } = useWorkspace();

  const hasReport = !!snapshot;
  const isReportPage = pathname === '/snapshot';

  return (
    <nav
      className="flex h-full w-[260px] flex-col bg-[#F7F6F3]"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif' }}
      aria-label="Assessment navigation"
    >
      {/* Report link - shown when report exists */}
      {hasReport && (
        <div className="px-2 pt-3 pb-1">
          <button
            onClick={() => router.push('/snapshot')}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-[3px] text-[13px] transition-colors ${
              isReportPage
                ? 'bg-[#37352F] text-white'
                : 'text-[#37352F] hover:bg-[#EBEBEA]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="font-medium">Readiness Report</span>
          </button>
        </div>
      )}

      {/* Section header - Notion style */}
      <div className="px-3 pt-4 pb-1">
        <span className="text-[11px] font-medium text-[#91918E] tracking-[0.02em] uppercase">
          Assessment
        </span>
      </div>

      {/* Domain list */}
      <div
        className="flex-1 overflow-y-auto"
        role="tree"
        aria-label="Assessment domains"
      >
        {DOMAINS.map((domain) => {
          const dp = progressState.domainProgress[domain.key];
          const topics = getTopicsForDomain(domain.key);
          const count = getDomainInputCount(domain.key);
          const isSelected = selectedDomain === domain.key;
          const isExpanded = expandedDomains.includes(domain.key);

          return (
            <div key={domain.key}>
              <SidebarDomainItem
                domain={domain.key}
                label={domain.label}
                status={dp.status}
                isSelected={isSelected}
                isExpanded={isExpanded}
                count={count}
                onSelect={() => selectDomain(domain.key)}
                onToggleExpand={() => toggleDomainExpand(domain.key)}
              />

              {/* Expanded topics */}
              {isExpanded && (
                <div>
                  {topics.map((topic) => (
                    <SidebarTopicItem
                      key={topic.id}
                      label={topic.label}
                      covered={topic.covered}
                      confidence={topic.confidence}
                      isSelected={selectedCategory === topic.id}
                      onClick={() => selectCategory(domain.key, topic.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <SidebarFooter />
    </nav>
  );
}
