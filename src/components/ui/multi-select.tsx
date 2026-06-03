/**
 * MultiSelect Component
 * Allows selecting multiple items with chips/badges display
 * Built with shadcn/ui components for consistency
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';
import { Badge } from './badge';
import { Button } from './button';
import { Input } from './input';
import { cn } from '@/lib/utils';

export interface MultiSelectOption {
  value: string;
  label: string;
  description?: string;
  category?: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

/**
 * MultiSelect Component
 * Displays selected items as removable badges
 * Shows dropdown with searchable checkboxes for selection
 */
export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = 'Select items...',
  disabled = false,
  className,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results found.',
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside — no backdrop overlay so page scroll is never blocked
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((item) => item !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleRemove = (optionValue: string) => {
    onChange(value.filter((item) => item !== optionValue));
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase()) ||
    option.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Group options by category if available
  const groupedOptions = filteredOptions.reduce((acc, option) => {
    const category = option.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(option);
    return acc;
  }, {} as Record<string, MultiSelectOption[]>);

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* Selected Items (Chips/Badges) */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedOptions.map((option) => (
            <Badge
              key={option.value}
              variant="secondary"
              className="gap-1 pr-1 py-1 text-sm hover:bg-secondary/80 transition-colors"
            >
              {option.label}
              <button
                type="button"
                onClick={() => handleRemove(option.value)}
                disabled={disabled}
                className="ml-1 hover:bg-muted rounded-full p-0.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={`Remove ${option.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Dropdown Trigger */}
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          'w-full justify-between',
          !selectedOptions.length && 'text-muted-foreground'
        )}
      >
        <span className="truncate">
          {selectedOptions.length > 0
            ? `${selectedOptions.length} selected`
            : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 opacity-50 transition-transform shrink-0',
            open && 'rotate-180'
          )}
        />
      </Button>

      {/* Dropdown Content */}
      {open && !disabled && (
        <>
          <div className="absolute z-50 mt-2 w-full rounded-md border bg-popover shadow-lg">
            <div className="p-3">
              {/* Search Input */}
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-3"
                autoFocus
              />

              {/* Options List */}
              <div className="max-h-80 overflow-y-auto">
                {filteredOptions.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    {emptyMessage}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(groupedOptions).map(([category, categoryOptions]) => (
                      <div key={category}>
                        {/* Category Header */}
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                          {category}
                        </div>

                        {/* Category Options */}
                        <div className="space-y-1">
                          {categoryOptions.map((option) => {
                            const isSelected = value.includes(option.value);
                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => handleToggle(option.value)}
                                className={cn(
                                  'w-full flex items-start gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors text-left',
                                  isSelected && 'bg-accent'
                                )}
                              >
                                {/* Checkbox */}
                                <div
                                  className={cn(
                                    'mt-0.5 h-4 w-4 shrink-0 rounded border-2 flex items-center justify-center transition-colors',
                                    isSelected
                                      ? 'bg-primary border-primary'
                                      : 'border-input'
                                  )}
                                >
                                  {isSelected && (
                                    <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
                                  )}
                                </div>

                                {/* Option Label & Description */}
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium">{option.label}</div>
                                  {option.description && (
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                      {option.description}
                                    </div>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer with Close Button */}
            <div className="border-t p-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>

        </>
      )}
    </div>
  );
}