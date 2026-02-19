'use client';

import { useWorkspace } from '@/lib/context/workspace-context';
import { useAssessment } from '@/lib/context/assessment-context';
import { DOMAINS } from '@/lib/progress';
import { SidebarDomainItem } from './SidebarDomainItem';
import { SidebarTopicItem } from './SidebarTopicItem';
import { SidebarFooter } from './SidebarFooter';
import { FileText, ChevronRight } from 'lucide-react';

export function Sidebar() {
  const {
    selectedDomain,
    selectedCategory,
    expandedDomains,
    progressState,
    activeView,
    reportState,
    isReportStale,
    selectDomain,
    selectCategory,
    toggleDomainExpand,
    getTopicsForDomain,
    getDomainInputCount,
    switchToAssessment,
    switchToReport,
  } = useWorkspace();

  const { snapshot } = useAssessment();

  // Calculate overall progress
  const totalTopics = 25;
  const coveredTopics = Object.values(progressState.domainProgress).reduce(
    (sum, dp) => sum + dp.coveredTopics.length,
    0
  );
  const progressPercent = Math.round((coveredTopics / totalTopics) * 100);

  // Check if report can be generated (60% coverage + all domains have 2+)
  const allDomainsHaveMinimum = DOMAINS.every(
    (d) => progressState.domainProgress[d.key].coveredTopics.length >= 2
  );
  const hasMinimumCoverage = progressPercent >= 60;
  const canGenerateReport = hasMinimumCoverage && allDomainsHaveMinimum;

  // Determine report status text
  const getReportStatus = () => {
    if (reportState.hasGenerated) {
      const date = reportState.lastGeneratedAt
        ? new Date(reportState.lastGeneratedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
        : '';
      return {
        label: isReportStale ? 'Needs refresh' : `Generated ${date}`,
        color: isReportStale ? 'text-[#D9730D]' : 'text-[#0F7B6C]',
      };
    }
    if (canGenerateReport) {
      return { label: 'Ready to generate', color: 'text-[#0F7B6C]' };
    }
    return { label: `${progressPercent}% complete`, color: 'text-[#91918E]' };
  };

  const reportStatus = getReportStatus();

  // Handle assessment section click
  const handleAssessmentClick = () => {
    switchToAssessment();
    // If no domain selected, select first one
    if (!selectedDomain) {
      selectDomain('market');
    }
  };

  return (
    <nav
      className="flex h-full w-[260px] flex-col bg-[#F7F6F3]"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif' }}
      aria-label="Workspace navigation"
    >
      {/* ─── ASSESSMENT SECTION ─── */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Section header - clickable */}
        <button
          onClick={handleAssessmentClick}
          className={`w-full text-left px-3 pt-4 pb-2 flex items-center justify-between transition-colors ${
            activeView === 'assessment' ? 'bg-[#EBEBEA]' : 'hover:bg-[#EBEBEA]/50'
          }`}
        >
          <span className={`text-[11px] font-medium tracking-[0.02em] uppercase ${
            activeView === 'assessment' ? 'text-[#37352F]' : 'text-[#91918E]'
          }`}>
            Assessment
          </span>
          <span className="text-[11px] text-[#91918E]">
            {coveredTopics}/{totalTopics}
          </span>
        </button>

        {/* Domain list - only show when assessment view is active */}
        {activeView === 'assessment' && (
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
        )}
      </div>

      {/* ─── READINESS REPORT SECTION ─── */}
      <div className="border-t border-[#E8E6E1]">
        <button
          onClick={switchToReport}
          className={`w-full text-left px-3 py-3 flex items-center gap-3 transition-colors ${
            activeView === 'report'
              ? 'bg-[#EBEBEA]'
              : 'hover:bg-[#EBEBEA]/50'
          }`}
        >
          <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
            activeView === 'report' ? 'bg-[#37352F]' : 'bg-[#E8E6E1]'
          }`}>
            <FileText className={`w-4 h-4 ${
              activeView === 'report' ? 'text-white' : 'text-[#37352F]'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-[13px] font-medium ${
              activeView === 'report' ? 'text-[#37352F]' : 'text-[#37352F]'
            }`}>
              Readiness Report
            </div>
            <div className={`text-[11px] ${reportStatus.color}`}>
              {reportStatus.label}
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 text-[#91918E] transition-transform ${
            activeView === 'report' ? 'rotate-90' : ''
          }`} />
        </button>
      </div>

      {/* Footer */}
      <SidebarFooter />
    </nav>
  );
}
