import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';

export default function UploadCard() {
  const {
    uploadState,
    setUploadState,
    uploadedFile,
    setUploadedFile,
    uploadProgress,
    processSelectedFile,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadState('dragging');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadState('idle');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadState('idle');
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processSelectedFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processSelectedFile(files[0]);
    }
  };

  const triggerFileBrowser = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerFileBrowser}
      className={`glass-card p-8 rounded-[32px] flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white/80 dark:hover:bg-zinc-900/60 transition-all ${
        uploadState === 'dragging' ? 'bg-primary/5 ring-4 ring-[#00Dbe7]/50' : ''
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".csv,.xlsx,.xls,.json"
        className="hidden"
      />

      <div className="w-full h-full upload-dashed p-4 flex flex-col items-center justify-center border-2 border-transparent transition-all group-hover:border-primary/40">
        {uploadState === 'uploading' ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4" />
            <p className="font-bold text-on-surface dark:text-white text-sm">Uploading {uploadedFile?.name}...</p>
            <p className="text-xs text-zinc-500 mt-1">{uploadProgress}% Complete</p>
          </div>
        ) : uploadState === 'completed' ? (
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-green-500 text-5xl mb-4">check_circle</span>
            <p className="font-bold text-on-surface dark:text-white text-sm">{uploadedFile?.name}</p>
            <p className="text-xs text-green-600 font-semibold mt-1">Processed {uploadedFile?.size} successfully</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUploadState('idle');
                setUploadedFile(null);
              }}
              className="mt-4 text-xs font-bold text-primary underline hover:text-primary/80"
            >
              Upload Another
            </button>
          </div>
        ) : (
          <>
            <div className="w-20 h-20 bg-primary-container/10 rounded-full flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined text-4xl text-primary">cloud_upload</span>
            </div>
            <h3 className="font-headline-md text-xl font-bold text-on-surface dark:text-white">Upload Semester Data</h3>
            <p className="text-on-surface-variant/70 dark:text-white/60 mt-2 max-w-[240px] text-sm">
              Drag and drop your attendance CSV or Excel files here for AI processing.
            </p>
            <div className="mt-8 flex gap-3">
              <span className="text-xs font-bold bg-surface-container dark:bg-zinc-800 px-3 py-1.5 rounded-lg text-on-surface-variant dark:text-white/80">.CSV</span>
              <span className="text-xs font-bold bg-surface-container dark:bg-zinc-800 px-3 py-1.5 rounded-lg text-on-surface-variant dark:text-white/80">.XLSX</span>
              <span className="text-xs font-bold bg-surface-container dark:bg-zinc-800 px-3 py-1.5 rounded-lg text-on-surface-variant dark:text-white/80">.JSON</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
