import React from 'react';
import { continents, travelStyles, seasons } from '../data/categories';
import { countries } from '../data/countries';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatCurrency';
import { RotateCcw } from 'lucide-react';

export default function FilterPanel({
  filters,
  onChange,
  onReset,
  maxBudgetLimit = 25000
}) {
  const { currency } = useApp();

  const handleFieldChange = (field, value) => {
    onChange({
      ...filters,
      [field]: value
    });
  };

  return (
    <div className="space-y-6 text-sm">
      {/* Reset Action */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <span className="font-bold text-xs uppercase tracking-wider text-slate-400">
          Refine Discoveries
        </span>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-secondary hover:text-secondary-hover flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset all</span>
        </button>
      </div>

      {/* Continent Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Continent
        </label>
        <select
          value={filters.continent}
          onChange={(e) => handleFieldChange('continent', e.target.value)}
          className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated text-aether-textMain dark:text-white text-xs font-medium focus:outline-none focus:border-secondary"
        >
          {continents.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Travel Style Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Travel Style / Mood
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto custom-scrollbar pr-1">
          {travelStyles.map((style) => {
            const isActive = filters.travelStyle === style;
            return (
              <button
                key={style}
                type="button"
                onClick={() => handleFieldChange('travelStyle', style)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-secondary text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {style}
              </button>
            );
          })}
        </div>
      </div>

      {/* Max Daily Budget Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Max Daily Budget
          </label>
          <span className="text-xs font-bold text-secondary">
            {filters.maxBudget ? formatCurrency(filters.maxBudget, currency) : 'Any'}
          </span>
        </div>
        <input
          type="range"
          min="4000"
          max={maxBudgetLimit}
          step="1000"
          value={filters.maxBudget || maxBudgetLimit}
          onChange={(e) => {
            const val = Number(e.target.value);
            handleFieldChange('maxBudget', val >= maxBudgetLimit ? null : val);
          }}
          className="w-full accent-secondary cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>{formatCurrency(4000, currency)}</span>
          <span>{formatCurrency(maxBudgetLimit, currency)}+</span>
        </div>
      </div>

      {/* Trip Duration Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Ideal Trip Length
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['All Durations', '1-4 Days', '5-7 Days', '8+ Days'].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => handleFieldChange('duration', d)}
              className={`p-2 rounded-xl text-xs font-medium text-center border transition-all ${
                filters.duration === d
                  ? 'border-secondary bg-secondary/10 text-secondary font-bold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Season Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Best Season
        </label>
        <div className="grid grid-cols-2 gap-2">
          {seasons.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleFieldChange('season', s)}
              className={`p-2 rounded-xl text-xs font-medium text-center border transition-all ${
                filters.season === s
                  ? 'border-accent bg-accent/10 text-accent font-bold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Country selection dropdown */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Country
        </label>
        <select
          value={filters.country}
          onChange={(e) => handleFieldChange('country', e.target.value)}
          className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated text-aether-textMain dark:text-white text-xs font-medium focus:outline-none focus:border-secondary"
        >
          <option value="All Countries">All Countries</option>
          {countries.map((cty) => (
            <option key={cty.name} value={cty.name}>{cty.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
