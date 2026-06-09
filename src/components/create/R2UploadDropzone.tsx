'use client';

import React, { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface R2UploadDropzoneProps {
  onClientUploadComplete?: (res: { ufsUrl: string }[]) => void;
  onUploadError?: (err: Error) => void;
  content?: {
    button?: string;
    label?: string;
    allowedContent?: string;
  };
  appearance?: {
    button?: string;
    container?: string;
    label?: string;
    allowedContent?: string;
  };
  multiple?: boolean;
  endpoint?: string; // Ignored, but kept for compatibility with legacy UploadThing props
}

export function R2UploadDropzone({
  onClientUploadComplete,
  onUploadError,
  content,
  appearance,
  multiple = false,
}: R2UploadDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFiles = async (files: File[]) => {
    setIsUploading(true);
    setProgress(0);
    const uploadedResults: { ufsUrl: string }[] = [];

    try {
      const filesToUpload = multiple ? files : [files[0]];
      
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        
        // 1. Request presigned URL from API
        const response = await fetch('/api/upload/r2-presigned', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filename: file.name,
            fileType: file.type,
          }),
        });

        const data = await response.json();
        
        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Gagal mendapatkan upload token');
        }

        const { uploadUrl, fileUrl } = data.data;

        // 2. Upload directly to Cloudflare R2
        // We track progress using XMLHttpRequest for a nice user experience
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', uploadUrl, true);
          xhr.setRequestHeader('Content-Type', file.type);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentComplete = Math.round((event.loaded / event.total) * 100);
              // Calculate overall progress if uploading multiple
              const totalProgress = Math.round(
                (i * 100 + percentComplete) / filesToUpload.length
              );
              setProgress(totalProgress);
            }
          };

          xhr.onload = () => {
            if (xhr.status === 200) {
              uploadedResults.push({ ufsUrl: fileUrl });
              resolve();
            } else {
              reject(new Error(`R2 Upload failed with status ${xhr.status}`));
            }
          };

          xhr.onerror = () => reject(new Error('Network error during R2 upload'));
          xhr.send(file);
        });
      }

      if (onClientUploadComplete) {
        onClientUploadComplete(uploadedResults);
      }
    } catch (err: unknown) {
      console.error('Upload error:', err);
      if (onUploadError) {
        onUploadError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-4 transition-all duration-300 ${
        isDragging
          ? 'border-rose-500 bg-rose-50/10 scale-[0.99]'
          : 'border-stone-200 hover:border-rose-400 bg-transparent'
      } ${appearance?.container || ''}`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
        multiple={multiple}
        accept="image/*,audio/*"
      />

      {isUploading ? (
        <div className="flex flex-col items-center gap-3 py-4">
          <Loader2 className="h-8 w-8 text-rose-500 animate-spin" />
          <div className="text-sm font-semibold text-stone-700">
            Mengunggah... {progress}%
          </div>
          <div className="w-48 bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-rose-500 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="p-3 bg-stone-50 rounded-2xl text-stone-400 mb-1 group-hover:text-rose-500 transition-colors">
            <Upload className="h-6 w-6" />
          </div>
          <p className={`text-xs text-stone-500 ${appearance?.label || ''}`}>
            {content?.label || 'Seret file ke sini, atau klik untuk memilih'}
          </p>
          {content?.allowedContent && (
            <p className={`text-[10px] text-stone-400 ${appearance?.allowedContent || ''}`}>
              {content.allowedContent}
            </p>
          )}
          <button
            type="button"
            onClick={triggerFileInput}
            className={`mt-2 bg-[#1c1c1c] text-white hover:bg-stone-800 text-[10px] uppercase font-bold tracking-wider px-4 py-2 rounded-xl transition-all ${
              appearance?.button || ''
            }`}
          >
            {content?.button || 'Pilih File'}
          </button>
        </div>
      )}
    </div>
  );
}
