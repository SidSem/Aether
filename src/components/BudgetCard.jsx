import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatCurrency';

export default function BudgetCard({
  totalAmount = 0,
  averageDaily = 0,
  travelers = 1,
  days = 5
}) {
  const { currency } = useApp();

  return (
    <div className="rounded-2xl bg-gradient-to-br from-primary via-primary-light to-[#18426b] p-6 text-white shadow-xl relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-highlight/10 blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-highlight">
          Estimated Trip Budget
        </span>
        <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
          <TrendingUp className="w-4 h-4 text-highlight" />
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight">
          {formatCurrency(totalAmount, currency)}
        </h4>
        <p className="text-xs text-white/70 mt-1">
          Based on {days} days for {travelers} {travelers > 1 ? 'travelers' : 'traveler'}
        </p>
      </div>

      <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
        <div>
          <span className="block text-[10px] uppercase tracking-wider text-white/60">
            Est. Daily Rate
          </span>
          <span className="text-sm font-bold text-white">
            {formatCurrency(averageDaily, currency)} / day
          </span>
        </div>
        <div>
          <span className="block text-[10px] uppercase tracking-wider text-white/60">
            Per Traveler
          </span>
          <span className="text-sm font-bold text-white">
            {formatCurrency(Math.round(totalAmount / Math.max(1, travelers)), currency)}
          </span>
        </div>
      </div>
    </div>
  );
}
