'use client';
import { useState, useRef } from 'react';
import { adminAPI } from '@/lib/api';

interface Props {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = 'Upload Image' }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (file.type !== 'image/png') {
      setError('Only PNG format is allowed.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Max file size is 2MB.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const res = await adminAPI.uploadImage(file);
      onChange(res.data.data.url);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload">
      <label className="input-label">{label}</label>
      <div className="upload-box">
        {value ? (
          <div className="preview-wrap">
            <img src={value} alt="Preview" className="upload-preview" />
            <button
              type="button"
              className="remove-btn"
              onClick={() => onChange('')}
              title="Remove"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="upload-placeholder"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <div className="spinner-sm" />
            ) : (
              <>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span>Click to upload PNG</span>
              </>
            )}
          </button>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png"
          style={{ display: 'none' }}
        />
      </div>
      {error && <p className="upload-error">{error}</p>}

      <style>{`
        .image-upload { margin-bottom: 1.25rem; }
        .upload-box {
          border: 2px dashed var(--color-border);
          border-radius: var(--radius-md);
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.02);
          transition: all var(--transition-fast);
        }
        .upload-box:hover { border-color: var(--color-accent); background: rgba(0,212,255,0.04); }
        .upload-placeholder {
          background: none; border: none; color: var(--color-text-muted);
          display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
          cursor: pointer; width: 100%; height: 100%; padding: 1rem;
        }
        .upload-placeholder span { font-size: 0.8rem; }
        .preview-wrap { position: relative; padding: 0.5rem; }
        .upload-preview {
          max-width: 100%; max-height: 200px;
          border-radius: var(--radius-sm);
          object-fit: contain;
          box-shadow: var(--shadow-md);
        }
        .remove-btn {
          position: absolute; top: 0rem; right: 0rem;
          width: 24px; height: 24px;
          background: var(--color-error); color: white;
          border: none; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .upload-error { color: var(--color-error); font-size: 0.75rem; margin-top: 0.5rem; }
        .spinner-sm {
          width: 20px; height: 20px;
          border: 2px solid rgba(0,212,255,0.1);
          border-top-color: var(--color-accent);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
