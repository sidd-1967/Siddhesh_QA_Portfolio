'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ list: 'bullet' }, { list: 'ordered' }],
  [{ indent: '-1' }, { indent: '+1' }],
  ['link'],
  ['clean'],
];

interface Props {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export default function RichTextEditor({
  label,
  value,
  onChange,
  placeholder = 'Write here...',
  minHeight = 180,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="rte-wrapper">
      {label && <label className="form-label">{label}</label>}
      <div className="rte-container">
        {mounted ? (
          <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            modules={{ toolbar: TOOLBAR }}
            style={{ minHeight }}
          />
        ) : (
          <div className="rte-skeleton" style={{ minHeight }} />
        )}
      </div>

      <style>{`
        .rte-wrapper { margin-bottom: 1.25rem; }
        
        .rte-container .ql-toolbar {
          border: 1px solid var(--color-border);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          border-radius: var(--radius-md) var(--radius-md) 0 0;
          background: rgba(255,255,255,0.03);
          padding: 8px;
        }
        .rte-container .ql-toolbar button,
        .rte-container .ql-toolbar .ql-picker {
          color: var(--color-text-secondary);
        }
        .rte-container .ql-toolbar .ql-stroke { stroke: var(--color-text-secondary); }
        .rte-container .ql-toolbar .ql-fill { fill: var(--color-text-secondary); }
        .rte-container .ql-toolbar button:hover .ql-stroke,
        .rte-container .ql-toolbar .ql-active .ql-stroke {
          stroke: var(--color-accent);
        }
        .rte-container .ql-toolbar button:hover .ql-fill,
        .rte-container .ql-toolbar .ql-active .ql-fill {
          fill: var(--color-accent);
        }
        .rte-container .ql-toolbar button:hover,
        .rte-container .ql-toolbar .ql-picker-label:hover {
          color: var(--color-accent);
        }
        .rte-container .ql-toolbar .ql-active {
          color: var(--color-accent);
        }
        .rte-container .ql-toolbar .ql-picker-label { color: var(--color-text-secondary); }
        .rte-container .ql-toolbar .ql-picker-options {
          background: #1a2235;
          border-color: var(--color-border);
          border-radius: var(--radius-sm);
        }
        .rte-container .ql-toolbar .ql-picker-item { color: var(--color-text-secondary); }
        .rte-container .ql-toolbar .ql-picker-item:hover { color: var(--color-accent); }
        
        .rte-container .ql-container {
          border: 1px solid var(--color-border);
          border-top: none;
          border-radius: 0 0 var(--radius-md) var(--radius-md);
          background: rgba(255,255,255,0.04);
          font-family: var(--font-body);
          font-size: 0.9rem;
          color: var(--color-text-primary);
          min-height: ${minHeight}px;
        }
        .rte-container .ql-container:focus-within {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 2px var(--color-accent-glow);
        }
        .rte-container .ql-editor {
          min-height: ${minHeight}px;
          color: var(--color-text-primary);
          line-height: 1.7;
          padding: 12px 16px;
        }
        .rte-container .ql-editor.ql-blank::before {
          color: var(--color-text-muted);
          font-style: normal;
        }
        .rte-container .ql-editor ul,
        .rte-container .ql-editor ol {
          padding-left: 1.5rem;
        }
        .rte-container .ql-editor li { margin-bottom: 0.25rem; }
        .rte-container .ql-editor strong { color: var(--color-text-primary); }
        .rte-container .ql-editor a { color: var(--color-accent); }

        .rte-skeleton {
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: rgba(255,255,255,0.02);
          min-height: ${minHeight}px;
        }
      `}</style>
    </div>
  );
}
