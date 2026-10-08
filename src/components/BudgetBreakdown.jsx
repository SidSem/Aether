import React, { useState } from 'react';
import { BUDGET_CATEGORIES } from '../utils/calculateBudget';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatCurrency';
import { Users } from 'lucide-react';

export default function BudgetBreakdown({
  totalBudget = 100000,
  travelers = 2,
  onUpdateTravelers = null,
  breakdown = {},
  _onUpdateCategoryRatio = null
}) {
  const { currency } = useApp();
  const [activeCategory, setActiveCategory] = useState(null);

  // SVG Donut calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  const donutSegments = React.useMemo(() => {
    let accumulated = 0;
    const segments = [];
    for (const cat of BUDGET_CATEGORIES) {
      const amount = breakdown[cat.key] || 0;
      const percentage = totalBudget > 0 ? (amount / totalBudget) : 0;
      const strokeDasharray = `${percentage * circumference} ${circumference}`;
      const strokeDashoffset = -accumulated;
      accumulated += percentage * circumference;

      segments.push({
        ...cat,
        amount,
        percentage: Math.round(percentage * 100),
        strokeDasharray,
        strokeDashoffset
      });
    }
    return segments;
  }, [breakdown, totalBudget, circumference]);

  const perPersonCost = Math.round(totalBudget / Math.max(1, travelers));

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-cardDark p-5 sm:p-7 shadow-sm">
      {/* Header: Total Cost & Travelers control */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Estimated Journey Budget
          </span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-aether-textMain dark:text-white">
              {formatCurrency(totalBudget, currency)}
            </h3>
            <span className="text-xs text-slate-400">
              ({formatCurrency(perPersonCost, currency)} / person)
            </span>
          </div>
        </div>

        {onUpdateTravelers && (
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-surface-elevated p-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <Users className="w-4 h-4 text-secondary" />
            <span className="text-xs font-semibold text-aether-textMain dark:text-white">
              Travelers:
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onUpdateTravelers(num)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    travelers === num
                      ? 'bg-secondary text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Donut Chart & Category Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-6">
        {/* SVG Donut Visual */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 180 180">
              <circle
                cx="90"
                cy="90"
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="18"
                fill="transparent"
              />
              {donutSegments.map((segment) => (
                <circle
                  key={segment.key}
                  cx="90"
                  cy="90"
                  r={radius}
                  stroke={segment.color}
                  strokeWidth={activeCategory === segment.key ? "22" : "18"}
                  strokeDasharray={segment.strokeDasharray}
                  strokeDashoffset={segment.strokeDashoffset}
                  fill="transparent"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setActiveCategory(segment.key)}
                  onMouseLeave={() => setActiveCategory(null)}
                />
              ))}
            </svg>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                {activeCategory ? activeCategory : 'Breakdown'}
              </span>
              <span className="text-lg font-bold font-heading text-aether-textMain dark:text-white">
                {activeCategory
                  ? formatCurrency(breakdown[activeCategory] || 0, currency)
                  : `${travelers} ${travelers > 1 ? 'Travelers' : 'Traveler'}`}
              </span>
            </div>
          </div>

          <span className="text-[11px] text-slate-400 mt-2 text-center">
            Estimated allocations based on regional travel data
          </span>
        </div>

        {/* Category List & Proportions */}
        <div className="md:col-span-7 space-y-3">
          {donutSegments.map((cat) => (
            <div
              key={cat.key}
              onMouseEnter={() => setActiveCategory(cat.key)}
              onMouseLeave={() => setActiveCategory(null)}
              className={`p-2.5 rounded-xl border transition-all ${
                activeCategory === cat.key
                  ? 'bg-slate-50 dark:bg-surface-elevated border-secondary/40 shadow-xs'
                  : 'border-transparent hover:bg-slate-50/50 dark:hover:bg-slate-900/30'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-aether-textMain dark:text-white">{cat.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono text-[11px]">{cat.percentage}%</span>
                  <span className="font-bold text-aether-textMain dark:text-white">
                    {formatCurrency(cat.amount, currency)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: cat.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
