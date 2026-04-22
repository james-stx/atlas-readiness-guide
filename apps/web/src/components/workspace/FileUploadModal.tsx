'use client';

import { useRef, useState, useCallback, useEffect, type DragEvent } from 'react';
import { X, Upload, FileText, CheckCircle, Check, Loader2, AlertCircle, ChevronRight, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFiles } from '@/lib/context/files-context';
import { useAssessment } from '@/lib/context/assessment-context';
import type { SessionFile, DocumentType } from '@atlas/types';
import { DOMAINS, DOMAIN_TOPICS } from '@/lib/progress';

const ACCEPTED_TYPES = '.pdf,.docx,.pptx,.txt,.md,.csv,.html,.json';
const ACCEPTED_MIME = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/markdown',
  'text/x-markdown',
  'text/csv',
  'text/html',
  'application/json',
];

const DOC_TYPE_LABELS: Record<DocumentType, string> = {
  pitch_deck: 'Pitch Deck',
  business_plan: 'Business Plan',
  gtm_strategy: 'GTM Strategy',
  financial_model: 'Financial Model',
  market_research: 'Market Research',
  competitive_analysis: 'Competitive Analysis',
  other: 'Document',
};

type ModalView = 'dropzone' | 'processing' | 'results';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
}

export function FileUploadModal({ isOpen, onClose, sessionId }: Props) {
  const { files, mappings, uploadError, uploadAndProcess, clearError } = useFiles();
  const { refreshInputs } = useAssessment();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [view, setView] = useState<ModalView>('dropzone');
  const [newFileIds, setNewFileIds] = useState<string[]>([]);
  // Files staged for upload but not yet sent
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  // Snapshot of how many files were submitted (for display during processing)
  const [processingFileCount, setProcessingFileCount] = useState(0);
  // Animation: 0-25, representing which topic index is currently being "checked"
  const [animTopicIdx, setAnimTopicIdx] = useState(0);

  // Reset to dropzone state every time the modal is opened
  useEffect(() => {
    if (isOpen) {
      setView('dropzone');
      setNewFileIds([]);
      setStagedFiles([]);
      setAnimTopicIdx(0);
      clearError();
    }
  }, [isOpen, clearError]);

  const MAX_FILES = 5;
  const existingCount = files.filter(f => f.status !== 'failed').length;
  const remaining = MAX_FILES - existingCount;

  // Files being processed in this modal session
  const activeFiles = files.filter(f => newFileIds.includes(f.id));
  const allDone = activeFiles.length > 0 && activeFiles.every(f => f.status === 'complete' || f.status === 'failed');

  // Animation driver: advance one topic per tick; fast-forward once processing is done.
  // Guard: never show results until newFileIds is populated (upload has returned IDs).
  // Without this guard the 15s fallback fires before IDs arrive → empty results view.
  useEffect(() => {
    if (view !== 'processing') return;

    if (animTopicIdx >= 25) {
      // Upload hasn't returned file IDs yet — wait; effect re-runs when newFileIds changes
      if (newFileIds.length === 0) return;

      const goToResults = () => {
        setView('results');
      };

      if (allDone) {
        // All processing complete — short pause then show results
        const t = setTimeout(goToResults, 800);
        return () => clearTimeout(t);
      } else {
        // Processing still ongoing — 15s fallback so UI never gets stuck
        const t = setTimeout(goToResults, 15_000);
        return () => clearTimeout(t);
      }
    }

    // Still scanning topics
    const delay = allDone ? 60 : 1200;
    const t = setTimeout(() => setAnimTopicIdx(prev => prev + 1), delay);
    return () => clearTimeout(t);
  }, [view, animTopicIdx, allDone, newFileIds.length]);

  // Stage new files (dedupe by name, respect limit)
  const stageFiles = useCallback((incoming: File[]) => {
    clearError();
    setStagedFiles(prev => {
      const existing = new Set(prev.map(f => f.name));
      const fresh = incoming.filter(f => !existing.has(f.name) && ACCEPTED_MIME.includes(f.type));
      return [...prev, ...fresh].slice(0, remaining);
    });
  }, [clearError, remaining]);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    stageFiles(Array.from(e.dataTransfer.files));
  }, [stageFiles]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    stageFiles(Array.from(e.target.files || []));
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [stageFiles]);

  const handleUpload = useCallback(async () => {
    if (!stagedFiles.length) return;
    setProcessingFileCount(stagedFiles.length);
    setView('processing');
    setAnimTopicIdx(0);

    const addedIds = await uploadAndProcess(sessionId, stagedFiles);
    setStagedFiles([]);

    if (addedIds.length === 0) {
      // Upload failed entirely — return to dropzone so error is visible
      setView('dropzone');
      return;
    }

    // Refresh inputs now that processing is complete (inputs are in DB).
    // We do this here rather than in goToResults so the workspace is already
    // updated by the time the user clicks "Continue to assessment".
    await refreshInputs(sessionId);

    setNewFileIds(prev => [...prev, ...addedIds]);
    // Animation effect handles transitioning to results view
  }, [stagedFiles, sessionId, uploadAndProcess, refreshInputs]);

  // Count total topics found across new files
  const totalTopicsFound = files
    .filter(f => newFileIds.includes(f.id) && f.status === 'complete')
    .reduce((sum, f) => sum + f.topics_found, 0);
  const totalTopicsRemaining = 25 - mappings.length;

  // Domain coverage for a file
  const getDomainCoverage = (file: SessionFile) => {
    const fileMappings = mappings.filter(m => m.file_id === file.id);
    return DOMAINS.map(d => ({
      domain: d,
      count: fileMappings.filter(m => m.domain === d.key).length,
    })).filter(d => d.count > 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => { if (view !== 'processing') onClose(); }}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E6E1]">
          <h2 className="text-[15px] font-semibold text-[#0A0A0A]">
            {view === 'dropzone' && 'Upload your documents'}
            {view === 'processing' && 'Atlas is reading your documents'}
            {view === 'results' && 'Here\'s what we found'}
          </h2>
          {view !== 'processing' && (
            <button
              onClick={onClose}
              className="text-[#9B9A97] hover:text-[#0A0A0A] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ── Drop zone view ── */}
        {view === 'dropzone' && (
          <div className="p-6">
            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                isDragging
                  ? 'border-[#2563EB] bg-[#EBF5FF]'
                  : 'border-[#D4D1CB] hover:border-[#2563EB] hover:bg-[#F7FBFF]'
              )}
            >
              <Upload className="w-7 h-7 text-[#9B9A97] mx-auto mb-2.5" />
              <p className="text-[14px] font-medium text-[#0A0A0A] mb-1">
                Drag files here, or click to browse
              </p>
              <p className="text-[12px] text-[#9B9A97]">
                PDF · DOCX · PPTX · up to 20MB per file
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ACCEPTED_TYPES}
                onChange={handleInputChange}
                className="hidden"
              />
            </div>

            {/* Staged files queue */}
            {stagedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {stagedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-3 py-2 bg-[#F7F6F3] rounded-lg">
                    <FileText className="w-4 h-4 text-[#9B9A97] shrink-0" />
                    <span className="flex-1 text-[13px] text-[#0A0A0A] truncate">{file.name}</span>
                    <span className="text-[11px] text-[#9B9A97] shrink-0">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                    <button
                      onClick={e => { e.stopPropagation(); setStagedFiles(prev => prev.filter((_, i) => i !== idx)); }}
                      className="text-[#9B9A97] hover:text-[#E03E3E] transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {uploadError && (
              <div className="mt-3 flex items-start gap-2 text-[#E03E3E] bg-red-50 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="text-[13px]">{uploadError}</p>
              </div>
            )}

            {/* Upload button — only when files are staged */}
            {stagedFiles.length > 0 ? (
              <button
                onClick={handleUpload}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2563EB] text-white text-[14px] font-medium rounded-lg hover:bg-[#1D4ED8] transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload {stagedFiles.length} {stagedFiles.length === 1 ? 'file' : 'files'}
              </button>
            ) : (
              <>
                <p className="mt-4 text-[13px] text-[#787671] text-center">
                  You don't need to tell us what it is.{' '}
                  <span className="text-[#0A0A0A] font-medium">
                    Atlas will automatically identify what's relevant to your assessment.
                  </span>
                </p>

                <div className="mt-4 pt-4 border-t border-[#E8E6E1]">
                  <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#9B9A97] mb-2">
                    Great for
                  </p>
                  <p className="text-[13px] text-[#787671]">
                    Pitch decks · Business plans · GTM strategies · Financial models · Market research · Board presentations · Text files · Markdown docs · CSVs
                  </p>
                </div>

                <p className="mt-3 text-[11px] text-[#9B9A97] text-center">
                  Up to {remaining} more {remaining === 1 ? 'file' : 'files'} this session
                </p>
              </>
            )}
          </div>
        )}

        {/* ── Processing view ── */}
        {view === 'processing' && (
          <div className="p-6">
            {/* Status header */}
            <div className="flex items-center gap-3 mb-5">
              <div className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors',
                animTopicIdx >= 25 && allDone ? 'bg-[#E6F4F1]' : 'bg-[#EBF5FF]',
              )}>
                {animTopicIdx >= 25 && allDone ? (
                  <CheckCircle className="w-4 h-4 text-[#0F7B6C]" />
                ) : (
                  <Loader2 className="w-4 h-4 text-[#2563EB] animate-spin" />
                )}
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#0A0A0A]">
                  {animTopicIdx >= 25 && allDone
                    ? 'Analysis complete'
                    : animTopicIdx >= 25
                    ? 'Wrapping up…'
                    : `Checking ${processingFileCount === 1 ? '1 document' : `${processingFileCount} documents`}`}
                </p>
                <p className="text-[11px] text-[#787671]">
                  {animTopicIdx >= 25 && !allDone
                    ? 'Saving findings to your assessment…'
                    : 'Mapping content to your 25 assessment topics'}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-[#787671]">Topics checked</span>
                <span className="text-[11px] font-medium text-[#0A0A0A]">
                  {Math.min(animTopicIdx, 25)} / 25
                </span>
              </div>
              <div className="h-1.5 w-full bg-[#E8E6E1] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2563EB] rounded-full transition-all duration-500"
                  style={{ width: `${(Math.min(animTopicIdx, 25) / 25) * 100}%` }}
                />
              </div>
            </div>

            {/* Domain / topic breakdown */}
            <div className="space-y-0.5">
              {DOMAINS.map((domain, di) => {
                const domainStart = di * 5;
                const domainEnd = domainStart + 4;
                const isDone = animTopicIdx > domainEnd;
                const isActive = animTopicIdx >= domainStart && animTopicIdx <= domainEnd;
                const isPending = animTopicIdx < domainStart;
                const topics = DOMAIN_TOPICS[domain.key];

                return (
                  <div key={domain.key}>
                    {/* Domain row */}
                    <div className={cn(
                      'flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors duration-300',
                      isActive && 'bg-[#EBF5FF]',
                    )}>
                      {isDone ? (
                        <CheckCircle className="w-3.5 h-3.5 text-[#0F7B6C] shrink-0" />
                      ) : isActive ? (
                        <span className="w-3.5 h-3.5 rounded-full bg-[#2563EB] animate-pulse shrink-0" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-[#D4D1CB] shrink-0" />
                      )}
                      <span className={cn(
                        'flex-1 text-[13px]',
                        isDone && 'text-[#0F7B6C] font-medium',
                        isActive && 'text-[#0A0A0A] font-semibold',
                        isPending && 'text-[#C2C0BC]',
                      )}>
                        {domain.label}
                      </span>
                      {isDone && (
                        <span className="text-[11px] text-[#0F7B6C]">5 / 5</span>
                      )}
                    </div>

                    {/* Topic rows — only shown for the active domain */}
                    {isActive && (
                      <div className="ml-7 mt-0.5 mb-1.5 space-y-0.5">
                        {topics.map((topic, ti) => {
                          const gIdx = domainStart + ti;
                          const tDone = gIdx < animTopicIdx;
                          const tActive = gIdx === animTopicIdx;

                          return (
                            <div key={topic.id} className="flex items-center gap-2 px-1 py-0.5">
                              {tDone ? (
                                <Check className="w-3 h-3 text-[#0F7B6C] shrink-0" />
                              ) : tActive ? (
                                <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse shrink-0" />
                              ) : (
                                <span className="w-2 h-2 rounded-full border border-[#C2C0BC] shrink-0" />
                              )}
                              <span className={cn(
                                'text-[12px]',
                                tDone && 'text-[#9B9A97]',
                                tActive && 'text-[#0A0A0A] font-medium',
                                !tDone && !tActive && 'text-[#C2C0BC]',
                              )}>
                                {topic.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Results view ── */}
        {view === 'results' && (
          <div className="p-6">
            <div className="space-y-3 max-h-[320px] overflow-y-auto mb-4">
              {activeFiles.filter(f => f.status === 'complete').map(file => {
                const coverage = getDomainCoverage(file);
                return (
                  <div key={file.id} className="border border-[#E8E6E1] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-[#9B9A97] shrink-0" />
                      <span className="text-[13px] font-medium text-[#0A0A0A] truncate flex-1">
                        {file.filename}
                      </span>
                      {file.detected_type && (
                        <span className="text-[11px] font-medium text-[#2563EB] bg-[#EBF5FF] px-2 py-0.5 rounded-full shrink-0">
                          {DOC_TYPE_LABELS[file.detected_type]}
                        </span>
                      )}
                    </div>
                    {coverage.length > 0 ? (
                      <div className="space-y-1.5">
                        {coverage.map(({ domain, count }) => (
                          <div key={domain.key} className="flex items-center gap-2">
                            <span className="text-[12px] text-[#787671] w-24 shrink-0">{domain.label}</span>
                            <div className="flex-1 h-1.5 bg-[#E8E6E1] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#2563EB] rounded-full"
                                style={{ width: `${(count / 5) * 100}%` }}
                              />
                            </div>
                            <span className="text-[11px] text-[#9B9A97] w-12 text-right shrink-0">
                              {count}/5 topics
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[12px] text-[#9B9A97]">No relevant topics found in this document.</p>
                    )}
                  </div>
                );
              })}

              {activeFiles.filter(f => f.status === 'failed').map(file => (
                <div key={file.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#E03E3E] shrink-0" />
                    <span className="text-[13px] text-[#0A0A0A] truncate">{file.filename}</span>
                    <span className="text-[11px] text-[#E03E3E] ml-auto shrink-0">Failed to process</span>
                  </div>
                </div>
              ))}
            </div>

            {totalTopicsFound > 0 && (
              <div className="bg-[#F5F4EF] rounded-lg px-4 py-3 mb-4">
                <p className="text-[13px] text-[#0A0A0A]">
                  <span className="font-semibold">{totalTopicsFound} topics addressed.</span>
                  {totalTopicsRemaining > 0 && (
                    <> {totalTopicsRemaining} remaining. Atlas will focus on the gaps.</>
                  )}
                </p>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2563EB] text-white text-[14px] font-medium rounded-lg hover:bg-[#1D4ED8] transition-colors"
            >
              Continue to assessment
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
