'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AutocompleteSelectOption {
  value: string;
  label: string;
}

interface AutocompleteSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[] | string[] | readonly AutocompleteSelectOption[] | AutocompleteSelectOption[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  allowCustom?: boolean;
  icon?: React.ReactNode;
}

export function AutocompleteSelect({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  required,
  error,
  disabled,
  allowCustom = true,
  icon,
}: AutocompleteSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Normalize options to [{ value: string, label: string }]
  const normalizedOptions = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === 'string') {
        return { value: opt, label: opt };
      }
      return opt as AutocompleteSelectOption;
    });
  }, [options]);

  // Find label of the current selected value
  const displayLabel = useMemo(() => {
    const selectedOpt = normalizedOptions.find((opt) => opt.value === value);
    return selectedOpt ? selectedOpt.label : value;
  }, [normalizedOptions, value]);

  // Sync search input with displayLabel when not focused or dropdown closed
  useEffect(() => {
    if (!isOpen) {
      setSearch(displayLabel || '');
    }
  }, [isOpen, displayLabel]);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    const filtered = normalizedOptions.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );

    if (allowCustom && search.trim() !== '') {
      const hasExactMatch = normalizedOptions.some(
        (opt) => opt.label.toLowerCase() === search.trim().toLowerCase()
      );
      if (!hasExactMatch) {
        return [
          { value: search.trim(), label: `Use "${search.trim()}"`, isCustom: true },
          ...filtered,
        ];
      }
    }
    return filtered;
  }, [normalizedOptions, search, allowCustom]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Tab focus out
  useEffect(() => {
    function handleFocusOutside(event: FocusEvent) {
      if (containerRef.current && !containerRef.current.contains(event.relatedTarget as Node)) {
        setIsOpen(false);
      }
    }
    const el = containerRef.current;
    el?.addEventListener('focusout', handleFocusOutside);
    return () => el?.removeEventListener('focusout', handleFocusOutside);
  }, []);

  // Focus management: auto-select text on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Select all text in input when opened so typing easily overwrites
      inputRef.current.select();
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          const selected = filteredOptions[highlightedIndex];
          onChange(selected.value);
          setIsOpen(false);
          inputRef.current?.blur();
        } else if (filteredOptions.length > 0) {
          // If something is filtered, default to selecting the first match
          const selected = filteredOptions[0];
          onChange(selected.value);
          setIsOpen(false);
          inputRef.current?.blur();
        } else if (allowCustom && search.trim() !== '') {
          onChange(search.trim());
          setIsOpen(false);
          inputRef.current?.blur();
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  }, [isOpen, highlightedIndex, filteredOptions, onChange, search, allowCustom]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[role="option"]');
      items[highlightedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearch('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    setSearch(displayLabel || '');
  };

  return (
    <div className="space-y-1.5 w-full relative" ref={containerRef} onKeyDown={handleKeyDown}>
      {label && (
        <label className="block text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Input Field acting as combobox trigger */}
      <div className="relative w-full group">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary">
            {icon}
          </span>
        )}
        <input
          ref={inputRef}
          type="text"
          disabled={disabled}
          placeholder={placeholder}
          value={isOpen ? search : displayLabel}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={handleInputFocus}
          className={cn(
            'w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm transition-all duration-200 text-left outline-none cursor-pointer',
            icon ? 'pl-10' : 'pl-3.5',
            'pr-10',
            'hover:border-primary/40 hover:shadow-sm focus:cursor-text',
            isOpen ? 'ring-2 ring-primary/20 border-primary shadow-sm' : 'border-border',
            error && 'border-red-400 ring-1 ring-red-200',
            disabled && 'bg-gray-50 text-text-muted cursor-not-allowed border-border/60 opacity-70'
          )}
        />

        {/* Clear Button */}
        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-9 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Chevron Icon */}
        <ChevronDown
          className={cn(
            'w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted transition-transform duration-200 pointer-events-none',
            isOpen && 'rotate-180 text-primary'
          )}
        />
      </div>

      {/* Floating Dropdown Panel */}
      {isOpen && (
        <div
          className={cn(
            'absolute z-[60] w-full bg-white border border-border rounded-xl shadow-xl overflow-hidden flex flex-col',
            'animate-in fade-in-0 zoom-in-95 duration-150',
            'top-full mt-1.5'
          )}
          style={{ maxHeight: '280px' }}
        >
          {/* Options List */}
          <div
            ref={listRef}
            role="listbox"
            className="overflow-y-auto flex-1 py-1"
            style={{ maxHeight: '260px' }}
          >
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-text-muted">
                <p className="font-medium">No results found</p>
                <p className="text-xs mt-0.5 opacity-70">
                  {allowCustom ? 'Press Enter to use your typed input' : 'Try a different search term'}
                </p>
              </div>
            ) : (
              filteredOptions.map((opt, idx) => {
                const isSelected = opt.value === value;
                const isHighlighted = idx === highlightedIndex;
                const isCustomOption = (opt as any).isCustom;

                return (
                  <button
                    key={`${opt.value}-${idx}`}
                    role="option"
                    type="button"
                    data-selected={isSelected}
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={cn(
                      'w-full text-left px-3.5 py-2 text-sm flex items-center gap-2.5 transition-colors duration-100 cursor-pointer',
                      isSelected
                        ? 'bg-primary/8 text-primary font-medium'
                        : isHighlighted
                        ? 'bg-gray-50 text-text-primary'
                        : 'text-text-primary hover:bg-gray-50',
                      isCustomOption && 'text-primary font-medium border-b border-border/40'
                    )}
                  >
                    <span
                      className={cn(
                        'w-4.5 h-4.5 shrink-0 rounded-full border-2 flex items-center justify-center transition-all',
                        isSelected
                          ? 'border-primary bg-primary text-white scale-100'
                          : isCustomOption
                          ? 'border-primary/50 text-primary scale-90 border-dashed'
                          : 'border-border/70 scale-90'
                      )}
                      style={{ width: '18px', height: '18px' }}
                    >
                      {isSelected ? (
                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                      ) : isCustomOption ? (
                        <span className="text-[10px] font-bold">+</span>
                      ) : null}
                    </span>
                    <span className="flex-1 truncate">
                      {isCustomOption ? (
                        <span>
                          Use <span className="underline italic">"{opt.value}"</span>
                        </span>
                      ) : (
                        opt.label
                      )}
                    </span>
                    {isCustomOption && (
                      <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        New Custom
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Option count footer */}
          {normalizedOptions.length > 5 && (
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
