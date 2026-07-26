'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ChevronDown, Search, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CustomSelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[] | string[] | readonly CustomSelectOption[] | CustomSelectOption[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  /** Optional icon to show in the trigger */
  icon?: React.ReactNode;
}

export function CustomSelect({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select',
  required,
  error,
  disabled,
  searchable = true,
  icon,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropUp, setDropUp] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Normalize options to [{ value: string, label: string }]
  const normalizedOptions = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === 'string') {
        return { value: opt, label: opt };
      }
      return opt as CustomSelectOption;
    });
  }, [options]);

  const showSearch = searchable && normalizedOptions.length > 6;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate dropdown direction & auto-focus search
  useEffect(() => {
    if (isOpen) {
      // Calculate if dropdown should open upward
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        setDropUp(spaceBelow < 280 && spaceAbove > spaceBelow);
      }
      // Auto-focus search input
      requestAnimationFrame(() => {
        if (showSearch && searchInputRef.current) {
          searchInputRef.current.focus();
        }
      });
      // Auto-scroll to the selected item
      if (value && listRef.current) {
        requestAnimationFrame(() => {
          const selectedEl = listRef.current?.querySelector('[data-selected="true"]');
          if (selectedEl) {
            selectedEl.scrollIntoView({ block: 'nearest' });
          }
        });
      }
    } else {
      setHighlightedIndex(-1);
    }
  }, [isOpen, showSearch, value]);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    return normalizedOptions.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [normalizedOptions, search]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          onChange(filteredOptions[highlightedIndex].value);
          setIsOpen(false);
          setSearch('');
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearch('');
        triggerRef.current?.focus();
        break;
    }
  }, [isOpen, highlightedIndex, filteredOptions, onChange]);

  // Auto-scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[role="option"]');
      items[highlightedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  // Get selected option label to display on trigger
  const selectedOption = useMemo(() => {
    return normalizedOptions.find((opt) => opt.value === value);
  }, [normalizedOptions, value]);

  const displayLabel = selectedOption ? selectedOption.label : '';

  return (
    <div
      className="space-y-1.5 w-full relative"
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      {label && (
        <label className="block text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setSearch('');
          }
        }}
        className={cn(
          'w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm flex items-center gap-2 transition-all duration-200 cursor-pointer text-left group',
          'hover:border-primary/40 hover:shadow-sm',
          isOpen ? 'ring-2 ring-primary/20 border-primary shadow-sm' : 'border-border',
          error && 'border-red-400 ring-1 ring-red-200',
          disabled && 'bg-gray-50 text-text-muted cursor-not-allowed border-border/60 opacity-70'
        )}
      >
        {icon && <span className="shrink-0 text-text-muted">{icon}</span>}
        <span className={cn('flex-1 truncate', !displayLabel && 'text-text-muted')}>
          {displayLabel || placeholder}
        </span>
        {value && !disabled && (
          <span
            role="button"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
            className="shrink-0 p-0.5 rounded-full hover:bg-gray-100 text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </span>
        )}
        <ChevronDown className={cn(
          'w-4 h-4 shrink-0 text-text-muted transition-transform duration-200',
          isOpen && 'rotate-180 text-primary'
        )} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className={cn(
            'absolute z-[60] w-full bg-white border border-border rounded-xl shadow-xl overflow-hidden flex flex-col',
            'animate-in fade-in-0 zoom-in-95 duration-150',
            dropUp ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          )}
          style={{ maxHeight: '280px' }}
        >
          {/* Search Bar */}
          {showSearch && (
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border/60 bg-gray-50/80">
              <Search className="w-4 h-4 text-text-muted shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={`Search ${(label || '').toLowerCase()}...`}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setHighlightedIndex(0);
                }}
                className="w-full bg-transparent border-none text-sm outline-none placeholder:text-text-muted/70"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="shrink-0 p-0.5 rounded-full hover:bg-gray-200 text-text-muted cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Options List */}
          <div
            ref={listRef}
            role="listbox"
            className="overflow-y-auto flex-1 py-1"
            style={{ maxHeight: showSearch ? '220px' : '260px' }}
          >
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-text-muted">
                <p className="font-medium">No results found</p>
                <p className="text-xs mt-0.5 opacity-70">Try a different search term</p>
              </div>
            ) : (
              filteredOptions.map((opt, idx) => {
                const isSelected = opt.value === value;
                const isHighlighted = idx === highlightedIndex;
                return (
                  <button
                    key={opt.value}
                    role="option"
                    type="button"
                    data-selected={isSelected}
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={cn(
                      'w-full text-left px-3.5 py-2 text-sm flex items-center gap-2.5 transition-colors duration-100 cursor-pointer',
                      isSelected
                        ? 'bg-primary/8 text-primary font-medium'
                        : isHighlighted
                          ? 'bg-gray-50 text-text-primary'
                          : 'text-text-primary hover:bg-gray-50'
                    )}
                  >
                    <span className={cn(
                      'w-4.5 h-4.5 shrink-0 rounded-full border-2 flex items-center justify-center transition-all',
                      isSelected
                        ? 'border-primary bg-primary text-white scale-100'
                        : 'border-border/70 scale-90'
                    )} style={{ width: '18px', height: '18px' }}>
                      {isSelected && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                    </span>
                    <span className="flex-1 truncate">{opt.label}</span>
                  </button>
                );
              })
            )}
          </div>

          {/* Option count footer for long lists */}
          {normalizedOptions.length > 10 && (
            <div className="px-3 py-1.5 text-[10px] text-text-muted border-t border-border/40 bg-gray-50/50 text-center">
              {filteredOptions.length} of {normalizedOptions.length} options
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
