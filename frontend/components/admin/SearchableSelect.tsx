'use client';
import { useState, useRef, useEffect } from 'react';

interface Props {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchableSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className = '',
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // When opening, reset search to empty
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`searchable-select ${className}`} ref={containerRef}>
      <label className="form-label">{label}</label>
      <div 
        className={`select-trigger${isOpen ? ' active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'value-text' : 'placeholder'}>
          {value || placeholder}
        </span>
        <div className="arrow">
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="select-dropdown">
          <div className="search-wrap">
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="options-list">
            {filteredOptions.length === 0 ? (
              <div className="no-options">No matches found</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option}
                  className={`option-item${value === option ? ' selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(option);
                  }}
                >
                  {option}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <style>{`
        .searchable-select { position: relative; width: 100%; }
        .select-trigger {
          min-height: 42px;
          padding: 8px 12px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: rgba(255,255,255,0.04);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all var(--transition-fast);
        }
        .select-trigger:hover { border-color: var(--color-text-muted); }
        .select-trigger.active { border-color: var(--color-accent); box-shadow: 0 0 0 2px var(--color-accent-glow); }
        
        .value-text { color: var(--color-text-primary); font-size: 0.95rem; }
        .placeholder { color: var(--color-text-muted); font-size: 0.95rem; }
        
        .select-dropdown {
          position: absolute;
          top: calc(100% + 5px);
          left: 0; right: 0;
          background: #111827;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
          z-index: 1000;
          overflow: hidden;
        }
        .search-wrap { padding: 8px; border-bottom: 1px solid var(--color-border); }
        .search-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--color-border);
          border-radius: 4px;
          padding: 6px 10px;
          color: white;
          font-size: 0.85rem;
          outline: none;
        }
        .search-input:focus { border-color: var(--color-accent); }
        
        .options-list { max-height: 200px; overflow-y: auto; padding: 4px; }
        .option-item {
          padding: 8px 12px;
          cursor: pointer;
          border-radius: 4px;
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          transition: all 0.1s;
        }
        .option-item:hover { background: rgba(255,255,255,0.08); color: white; }
        .option-item.selected { background: var(--color-accent-glow); color: var(--color-accent); font-weight: 600; }
        .no-options { padding: 12px; text-align: center; font-size: 0.85rem; color: var(--color-text-muted); }
        
        .arrow { color: var(--color-text-muted); transition: transform 0.2s; }
        .select-trigger.active .arrow { transform: rotate(180deg); }

        .options-list::-webkit-scrollbar { width: 4px; }
        .options-list::-webkit-scrollbar-track { background: transparent; }
        .options-list::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 10px; }
      `}</style>
    </div>
  );
}
