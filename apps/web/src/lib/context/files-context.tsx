'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { SessionFile, FileTopicMapping, DomainType } from '@atlas/types';
import * as api from '../api-client';

interface FilesState {
  files: SessionFile[];
  mappings: FileTopicMapping[];
  isUploading: boolean;
  processingFileIds: string[];
  uploadError: string | null;
}

interface FilesContextValue extends FilesState {
  loadFiles: (sessionId: string) => Promise<void>;
  uploadAndProcess: (sessionId: string, files: File[]) => Promise<string[]>;
  deleteFile: (fileId: string) => Promise<void>;
  getFilesForDomain: (domain: DomainType) => FileTopicMapping[];
  getSourceFile: (fileId: string) => SessionFile | undefined;
  clearError: () => void;
}

const FilesContext = createContext<FilesContextValue | null>(null);

export function FilesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FilesState>({
    files: [],
    mappings: [],
    isUploading: false,
    processingFileIds: [],
    uploadError: null,
  });

  const loadFiles = useCallback(async (sessionId: string) => {
    try {
      const { files, mappings } = await api.getSessionFiles(sessionId);
      setState(s => ({ ...s, files, mappings }));
    } catch {
      // Non-fatal — silently ignore on load
    }
  }, []);

  const uploadAndProcess = useCallback(async (sessionId: string, files: File[]): Promise<string[]> => {
    setState(s => ({ ...s, isUploading: true, uploadError: null }));

    try {
      // Upload all files at once
      const { files: uploaded } = await api.uploadFiles(sessionId, files);
      const newFileIds = uploaded.map(f => f.id);

      // Add uploaded files to state immediately with pending status
      const pendingFiles: SessionFile[] = uploaded.map(f => ({
        id: f.id,
        session_id: sessionId,
        filename: f.filename,
        storage_path: '',
        mime_type: '',
        size_bytes: 0,
        detected_type: null,
        status: 'pending',
        topics_found: 0,
        created_at: new Date().toISOString(),
        processed_at: null,
      }));

      setState(s => ({
        ...s,
        isUploading: false,
        files: [...s.files, ...pendingFiles],
        processingFileIds: [...s.processingFileIds, ...uploaded.map(f => f.id)],
      }));

      // Process all files in parallel
      await Promise.allSettled(
        uploaded.map(async (uploadedFile) => {
          try {
            const { file: processedFile, mappings: newMappings } = await api.processFile(uploadedFile.id);

            setState(s => ({
              ...s,
              files: s.files.map(f => f.id === processedFile.id ? processedFile : f),
              mappings: [
                ...s.mappings.filter(m => m.file_id !== processedFile.id),
                ...newMappings,
              ],
              processingFileIds: s.processingFileIds.filter(id => id !== processedFile.id),
            }));
          } catch {
            setState(s => ({
              ...s,
              files: s.files.map(f =>
                f.id === uploadedFile.id ? { ...f, status: 'failed' } : f
              ),
              processingFileIds: s.processingFileIds.filter(id => id !== uploadedFile.id),
            }));
          }
        })
      );

      return newFileIds;
    } catch (err) {
      setState(s => ({
        ...s,
        isUploading: false,
        uploadError: err instanceof Error ? err.message : 'Upload failed. Please try again.',
      }));
      return [];
    }
  }, []);

  const getFilesForDomain = useCallback((domain: DomainType) => {
    return state.mappings.filter(m => m.domain === domain);
  }, [state.mappings]);

  const getSourceFile = useCallback((fileId: string) => {
    return state.files.find(f => f.id === fileId);
  }, [state.files]);

  const deleteFile = useCallback(async (fileId: string): Promise<void> => {
    await api.deleteFile(fileId);
    setState(s => ({
      ...s,
      files: s.files.filter(f => f.id !== fileId),
      mappings: s.mappings.filter(m => m.file_id !== fileId),
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(s => ({ ...s, uploadError: null }));
  }, []);

  return (
    <FilesContext.Provider value={{
      ...state,
      loadFiles,
      uploadAndProcess,
      deleteFile,
      getFilesForDomain,
      getSourceFile,
      clearError,
    }}>
      {children}
    </FilesContext.Provider>
  );
}

export function useFiles() {
  const ctx = useContext(FilesContext);
  if (!ctx) throw new Error('useFiles must be used within FilesProvider');
  return ctx;
}
