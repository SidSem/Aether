import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  onClear,
  onToggleFilter,
  filterCount = 0,
  placeholder = "Where do you want to go?"
}) {
  return (
    <div className="relative flex items-center gap-2.5 w-full">
      <div className="relative flex-1 flex items-center bg-white dark:bg-surface-cardDark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 focus-within:border-secondary transition-all">
        <Search className="w-5 h-5 text-slate-400 ml-4 mr-2 shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full py-3.5 pr-10 bg-transparent text-sm sm:text-base font-medium text-aether-textMain dark:text-white placeholder:text-slate-400 focus:outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {onToggleFilter && (
        <button
          type="button"
          onClick={onToggleFilter}
          className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl border text-sm font-semibold transition-all shrink-0 ${
            filterCount > 0
              ? 'bg-secondary text-white border-secondary shadow-md'
              : 'bg-white dark:bg-surface-cardDark text-aether-textMain dark:text-white border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {filterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-white text-secondary text-xs flex items-center justify-center font-bold">
              {filterCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
