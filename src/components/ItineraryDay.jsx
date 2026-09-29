import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import ActivityCard from './ActivityCard';
import { destinations } from '../data/destinations';
import { activities as allActivities } from '../data/activities';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatCurrency';

export default function ItineraryDay({
  day,
  dayIndex,
  totalDays,
  onRemoveDay,
  onAddActivity,
  onRemoveActivity,
  onMoveActivityUp,
  onMoveActivityDown,
  onOpenActivitySelector
}) {
  const { currency } = useApp();
  const [isExpanded, setIsExpanded] = useState(true);

  const destination = destinations.find((d) => d.id === day.destinationId);
  const dayActivities = (day.activityIds || [])
    .map((id) => allActivities.find((a) => a.id === id))
    .filter(Boolean);

  // Compute day estimated cost (daily budget fraction + activity costs)
  const dayCost = (destination?.averageDailyBudget || 8000) +
    dayActivities.reduce((sum, act) => sum + (act.price || 0), 0);

  return (
    <div className="relative pl-6 sm:pl-8 pb-10 last:pb-0 group">
      {/* Vertical Timeline Track */}
      <div className="absolute left-[11px] sm:left-[15px] top-6 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 group-last:hidden" />

      {/* Timeline Node */}
      <div className="absolute left-0 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary dark:bg-secondary text-white flex items-center justify-center font-heading font-bold text-xs shadow-md border-2 border-white dark:border-primary-dark">
        {String(day.dayNumber).padStart(2, '0')}
      </div>

      {/* Day Card Container */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-cardDark shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        {/* Day Header */}
        <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">
              Day {day.dayNumber}
            </span>
            {destination && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white dark:bg-surface-elevated text-aether-textMain dark:text-white border border-slate-200 dark:border-slate-700 shadow-xs">
                <MapPin className="w-3 h-3 text-secondary" />
                {destination.name}
              </span>
            )}
            <h4 className="font-heading font-bold text-sm sm:text-base text-aether-textMain dark:text-white">
              {day.title}
            </h4>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Est. {formatCurrency(dayCost, currency)}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                title={isExpanded ? "Collapse day" : "Expand day"}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {totalDays > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveDay(dayIndex)}
                  className="p-1 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                  title="Remove this day"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Day Body (Activities) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-4 sm:p-5 space-y-3"
            >
              {dayActivities.length > 0 ? (
                <div className="space-y-2.5">
                  {dayActivities.map((act, actIdx) => (
                    <div key={act.id} className="flex items-center gap-2">
                      <div className="flex-1">
                        <ActivityCard
                          activity={act}
                          compact
                          onRemove={() => onRemoveActivity(dayIndex, act.id)}
                        />
                      </div>

                      {/* Reorder Buttons */}
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button
                          type="button"
                          disabled={actIdx === 0}
                          onClick={() => onMoveActivityUp(dayIndex, actIdx)}
                          className="p-1 rounded text-slate-400 hover:text-secondary disabled:opacity-20 disabled:hover:text-slate-400 transition-colors"
                          title="Move activity up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={actIdx === dayActivities.length - 1}
                          onClick={() => onMoveActivityDown(dayIndex, actIdx)}
                          className="p-1 rounded text-slate-400 hover:text-secondary disabled:opacity-20 disabled:hover:text-slate-400 transition-colors"
                          title="Move activity down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  <p className="text-xs text-slate-400 mb-2">No activities scheduled for this day yet.</p>
                  <button
                    type="button"
                    onClick={() => onOpenActivitySelector(dayIndex, day.destinationId)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-secondary hover:bg-secondary/10 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add experiences</span>
                  </button>
                </div>
              )}

              {/* Add Activity Trigger when has items */}
              {dayActivities.length > 0 && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onOpenActivitySelector(dayIndex, day.destinationId)}
                    className="w-full py-2.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 hover:text-secondary hover:border-secondary flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Experience to Day {day.dayNumber}</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
