'use client';
import { useState, useRef, useEffect } from 'react';

interface Props {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
}

export default function MultiSelect({
  label,
  options,
  selected,
  onChange,
  placeholder = 'Select options...',
  emptyMessage = 'No options available',
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    const newSelected = selected.includes(option)
      ? selected.filter((s) => s !== option)
      : [...selected, option];
    onChange(newSelected);
  };

  return (
    <div className="multi-select" ref={containerRef}>
      <label className="form-label">{label}</label>
      <div className={`select-trigger${isOpen ? ' active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <div className="selected-tags">
          {selected.length > 0 ? (
            selected.map((item) => (
              <span key={item} className="tag">
                {item}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(item);
                  }}
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span className="placeholder">{placeholder}</span>
          )}
        </div>
        <div className="arrow">
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="select-dropdown">
          {options.length === 0 ? (
            <div className="no-options">{emptyMessage}</div>
          ) : (
            <div className="options-list">
              {options.map((option) => (
                <div
                  key={option}
                  className={`option-item${selected.includes(option) ? ' selected' : ''}`}
                  onClick={() => toggleOption(option)}
                >
                  <div className="checkbox">
                    {selected.includes(option) && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                        <path d="M20 6L9 17L4 12" />
                      </svg>
                    )}
                  </div>
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        .multi-select { position: relative; margin-bottom: 1rem; }
        .select-trigger {
          min-height: 42px;
          padding: 6px 12px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-bg-card);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          transition: all var(--transition-fast);
        }
        .select-trigger:hover { border-color: var(--color-text-muted); }
        .select-trigger.active { border-color: var(--color-accent); box-shadow: 0 0 0 2px rgba(0,212,255,0.1); }
        
        .selected-tags { display: flex; flex-wrap: wrap; gap: 6px; flex: 1; }
        .tag {
          background: rgba(0,212,255,0.15);
          color: var(--color-accent);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
          border: 1px solid rgba(0,212,255,0.2);
        }
        .tag button {
          background: none; border: none; color: inherit;
          font-size: 14px; cursor: pointer; padding: 0; line-height: 1;
        }
        .placeholder { color: var(--color-text-muted); font-size: 0.875rem; }
        
        .select-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0; right: 0;
          background: #151e2d;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          z-index: 1000;
          max-height: 240px;
          overflow-y: auto;
        }
        .no-options { padding: 12px; text-align: center; color: var(--color-text-muted); font-size: 0.875rem; }
        .options-list { padding: 4px; }
        .option-item {
          padding: 8px 12px;
          cursor: pointer;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }
        .option-item:hover { background: rgba(255,255,255,0.05); color: var(--color-text-primary); }
        .option-item.selected { background: rgba(0,212,255,0.08); color: var(--color-accent); }
        
        .checkbox {
          width: 16px; height: 16px;
          border: 2px solid var(--color-border);
          border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .option-item.selected .checkbox { background: var(--color-accent); border-color: var(--color-accent); }
        .arrow { color: var(--color-text-muted); display: flex; transition: transform 0.2s; }
        .select-trigger.active .arrow { transform: rotate(180deg); }
      `}</style>
    </div>
  );
}
