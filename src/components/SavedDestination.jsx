import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Star, Scale } from 'lucide-react';
import { useSaved } from '../context/SavedContext';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatCurrency';

export default function SavedDestination({
  destination,
  onAddToTrip
}) {
  const navigate = useNavigate();
  const { toggleSaved } = useSaved();
  const { currency, isInCompare, addToCompare, removeFromCompare } = useApp();

  const inCompare = isInCompare(destination.id);

  const handleCompareClick = (e) => {
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(destination.id);
    } else {
      addToCompare(destination.id);
    }
  };

  return (
    <div
      onClick={() => navigate(`/destination/${destination.id}`)}
      className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-cardDark overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col sm:flex-row"
    >
      {/* Thumbnail */}
      <div className="relative w-full sm:w-56 h-48 sm:h-auto shrink-0 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/50 text-white backdrop-blur-md border border-white/20">
            {destination.country}
          </span>
        </div>
      </div>

      {/* Details & Controls */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                {destination.travelStyle} · {destination.continent}
              </span>
              <h3 className="text-xl font-bold font-heading text-aether-textMain dark:text-white group-hover:text-secondary transition-colors">
                {destination.name}
              </h3>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-surface-elevated px-2 py-0.5 rounded text-xs font-bold text-aether-textMain dark:text-white">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{destination.rating}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {destination.shortDescription}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {destination.highlights?.slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Actions Row */}
        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Estimated Daily
            </span>
            <span className="text-sm font-bold text-aether-textMain dark:text-white">
              {formatCurrency(destination.averageDailyBudget, currency)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Compare Toggle */}
            <button
              type="button"
              onClick={handleCompareClick}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                inCompare
                  ? 'bg-secondary text-white border-secondary'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Compare with other destinations"
            >
              <Scale className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{inCompare ? 'Comparing' : 'Compare'}</span>
            </button>

            {/* Add to Trip */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddToTrip(destination);
              }}
              className="px-3 py-2 rounded-xl bg-primary dark:bg-white text-white dark:text-primary text-xs font-bold flex items-center gap-1 hover:opacity-90 transition-opacity"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Trip</span>
            </button>

            {/* Remove */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleSaved(destination.id);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              title="Remove from saved"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
