'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ImageUploadZoneProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

export default function ImageUploadZone({ onFilesChange, maxFiles = 5, maxSizeMB = 5 }: ImageUploadZoneProps) {
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [error, setError] = useState('');

  const onDrop = useCallback((accepted: File[], rejected: any[]) => {
    setError('');
    if (rejected.length > 0) {
      setError('Some files were rejected. Check type/size limits.');
    }
    const remaining = maxFiles - previews.length;
    const toAdd = accepted.slice(0, remaining);
    const newPreviews = toAdd.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    const updated = [...previews, ...newPreviews];
    setPreviews(updated);
    onFilesChange(updated.map((p) => p.file));
  }, [previews, maxFiles, onFilesChange]);

  const remove = (idx: number) => {
    URL.revokeObjectURL(previews[idx].url);
    const updated = previews.filter((_, i) => i !== idx);
    setPreviews(updated);
    onFilesChange(updated.map((p) => p.file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxSize: maxSizeMB * 1024 * 1024,
    maxFiles: maxFiles - previews.length,
    disabled: previews.length >= maxFiles,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-brand-500 bg-brand-50'
            : previews.length >= maxFiles
            ? 'border-surface-200 bg-surface-50 cursor-not-allowed'
            : 'border-surface-300 hover:border-brand-300'
        }`}
      >
        <input {...getInputProps()} />
        <ArrowUpTrayIcon className="w-8 h-8 mx-auto text-surface-400 mb-2" />
        <p className="text-sm text-surface-500">
          {isDragActive ? 'Drop files here...' : `Drag & drop images or click (max ${maxFiles}, ${maxSizeMB}MB each)`}
        </p>
      </div>
      {error && <p className="text-danger-600 text-xs mt-1">{error}</p>}
      {previews.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {previews.map((p, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden group">
              <img src={p.url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => remove(i)}
                className="absolute top-0.5 right-0.5 bg-black/70 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XMarkIcon className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
