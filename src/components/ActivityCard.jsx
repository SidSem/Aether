import React from 'react';
import { Clock, Tag, X, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatCurrency';

export default function ActivityCard({
  activity,
  onRemove = null,
  onSelect = null,
  compact = false
}) {
  const { currency } = useApp();

  return (
    <div
      onClick={() => onSelect && onSelect(activity)}
      className={`relative group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated overflow-hidden transition-all duration-200 hover:border-secondary hover:shadow-md ${
        compact ? 'p-3 flex items-center gap-3' : 'flex flex-col'
      } ${onSelect ? 'cursor-pointer' : ''}`}
    >
      {compact ? (
        <>
          {activity.image && (
            <img
              src={activity.image}
              alt={activity.title}
              className="w-12 h-12 rounded-lg object-cover shrink-0"
            />
          )}

          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-xs sm:text-sm text-aether-textMain dark:text-white truncate">
              {activity.title}
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {activity.duration}
              </span>
              <span>·</span>
              <span className="font-semibold text-secondary">
                {activity.price === 0 ? 'Free' : formatCurrency(activity.price, currency)}
              </span>
            </div>
          </div>

          {onRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(activity.id);
              }}
              className="p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              title="Remove activity"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </>
      ) : (
        <>
          {activity.image && (
            <div className="relative h-36 overflow-hidden">
              <img
                src={activity.image}
                alt={activity.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/50 text-white backdrop-blur-md">
                {activity.category}
              </span>
            </div>
          )}

          <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <h4 className="font-heading font-bold text-sm sm:text-base text-aether-textMain dark:text-white mb-1.5 line-clamp-2">
                {activity.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                {activity.description}
              </p>
            </div>

            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{activity.duration}</span>
              </div>

              <div className="text-xs font-bold text-secondary">
                {activity.price === 0 ? 'Free' : formatCurrency(activity.price, currency)}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
