'use client';

import { useState } from 'react';
import { useWorkspace } from '@/lib/context/workspace-context';
import { useAssessment } from '@/lib/context/assessment-context';
import { useDomainInsight } from '@/lib/context/domain-insight-context';
import { useFiles } from '@/lib/context/files-context';
import { DOMAINS } from '@/lib/progress';
import { SidebarDomainItem } from './SidebarDomainItem';
import { SidebarTopicItem } from './SidebarTopicItem';
import { SidebarFooter } from './SidebarFooter';
import { FileUploadModal } from '@/components/workspace/FileUploadModal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { FileText, ChevronRight, Upload, Paperclip, Trash2, Loader2 } from 'lucide-react';

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

  const { session, refreshInputs } = useAssessment();
  const { isNew: hasNewInsight } = useDomainInsight();
  const { files, deleteFile } = useFiles();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; filename: string; topicsFound: number } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isGuest = session?.is_guest === true;
  const uploadedFiles = files.filter(f => f.status !== 'failed');
  const MAX_FILES = 5;

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
        label: isReportStale ? 'Ready to be updated' : `Generated ${date}`,
        color: isReportStale ? 'text-[#D9730D]' : 'text-[#0F7B6C]',
      };
    }
    if (canGenerateReport) {
      return { label: 'Ready to generate', color: 'text-[#0F7B6C]' };
    }
    return { label: `${progressPercent}% complete`, color: 'text-[#91918E]' };
  };

  const reportStatus = getReportStatus();

  return (
    <nav
      className="flex h-full w-[260px] flex-col bg-[#F7F6F3]"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif' }}
      aria-label="Workspace navigation"
    >
      {/* ─── ASSESSMENT SECTION ─── */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Section header */}
        <div className="px-3 pt-4 pb-2 flex items-center justify-between">
          <span className="text-[11px] font-medium tracking-[0.02em] uppercase text-[#91918E]">
            Assessment
          </span>
          <span className="text-[11px] text-[#91918E]">
            {coveredTopics}/{totalTopics}
          </span>
        </div>

        {/* Domain list - always visible */}
        <div
          className="flex-1 overflow-y-auto"
          role="tree"
          aria-label="Assessment domains"
          data-tour-id="tour-sidebar"
        >
          {DOMAINS.map((domain) => {
            const dp = progressState.domainProgress[domain.key];
            const topics = getTopicsForDomain(domain.key);
            const count = getDomainInputCount(domain.key);
            const isSelected = selectedDomain === domain.key && activeView === 'assessment';
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
                  hasNewInsight={hasNewInsight(domain.key)}
                  onSelect={() => {
                    selectDomain(domain.key);
                    switchToAssessment();
                  }}
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
                        isSelected={selectedCategory === topic.id && activeView === 'assessment'}
                        onClick={() => {
                          selectCategory(domain.key, topic.id);
                          switchToAssessment();
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── DOCUMENTS SECTION (signed-in users only) ─── */}
      {!isGuest && session && (
        <div className="border-t border-[#E8E6E1] px-3 py-3" data-tour-id="tour-documents">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium tracking-[0.02em] uppercase text-[#91918E]">
              Documents
            </span>
            {uploadedFiles.length > 0 && uploadedFiles.length < MAX_FILES && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="text-[11px] text-[#2563EB] hover:underline"
              >
                + Add more
              </button>
            )}
          </div>
          {uploadedFiles.length === 0 ? (
            <div className="rounded-lg border border-[#E8E6E1] bg-white px-3 py-3">
              <p className="text-[12px] text-[#787671] leading-relaxed mb-2.5">
                Upload a pitch deck, business plan, or GTM doc and Atlas auto-fills the relevant topics.
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-[#2563EB] text-white text-[12px] font-medium hover:bg-[#1D4ED8] transition-colors"
              >
                <Upload className="w-3 h-3 shrink-0" />
                Upload documents
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {uploadedFiles.map(file => {
                const isProcessing = file.status === 'pending' || file.status === 'processing';
                return (
                  <div
                    key={file.id}
                    className="group flex items-center gap-2 px-2 py-1.5 rounded-md text-[12px] text-[#37352F] hover:bg-[#EBEBEA] transition-colors"
                  >
                    {isProcessing
                      ? <Loader2 className="w-3 h-3 text-[#2563EB] shrink-0 animate-spin" />
                      : <Paperclip className="w-3 h-3 text-[#9B9A97] shrink-0" />
                    }
                    <span className="flex-1 truncate">{file.filename}</span>
                    {isProcessing ? (
                      <span className="text-[11px] text-[#787671] shrink-0">Analysing…</span>
                    ) : file.topics_found > 0 ? (
                      <span className="text-[11px] text-[#9B9A97] shrink-0 group-hover:hidden">
                        {file.topics_found} topics
                      </span>
                    ) : null}
                    {!isProcessing && (
                      <button
                        onClick={() => setDeleteTarget({ id: file.id, filename: file.filename, topicsFound: file.topics_found })}
                        className="hidden group-hover:flex items-center text-[#9B9A97] hover:text-[#E03E3E] transition-colors shrink-0"
                        aria-label={`Remove ${file.filename}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── READINESS REPORT SECTION ─── */}
      <div className="border-t border-[#E8E6E1]" data-tour-id="tour-report">
        <button
          onClick={switchToReport}
          className={`w-full text-left px-3 py-3 flex items-center gap-3 transition-colors ${
            activeView === 'report'
              ? 'bg-[#EBEBEA]'
              : 'hover:bg-[#EBEBEA]/50'
          }`}
        >
          <div className="relative">
            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
              isReportStale
                ? 'bg-[#FAEBDD]'
                : activeView === 'report' ? 'bg-[#37352F]' : 'bg-[#E8E6E1]'
            }`}>
              <FileText className={`w-4 h-4 ${
                isReportStale
                  ? 'text-[#D9730D]'
                  : activeView === 'report' ? 'text-white' : 'text-[#37352F]'
              }`} />
            </div>
            {isReportStale && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#D9730D] animate-pulse" />
            )}
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

      {/* Upload modal */}
      {session && (
        <FileUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          sessionId={session.id}
        />
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Remove document"
        message={
          deleteTarget
            ? `This will also remove ${deleteTarget.topicsFound > 0 ? `the ${deleteTarget.topicsFound} insight${deleteTarget.topicsFound !== 1 ? 's' : ''} extracted from` : 'all data extracted from'} "${deleteTarget.filename}". This cannot be undone.`
            : ''
        }
        confirmLabel={isDeleting ? 'Removing...' : 'Remove document'}
        cancelLabel="Keep it"
        variant="danger"
        onConfirm={async () => {
          if (!deleteTarget || !session) return;
          setIsDeleting(true);
          try {
            await deleteFile(deleteTarget.id);
            await refreshInputs(session.id);
          } finally {
            setIsDeleting(false);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </nav>
  );
}
