import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronUp, Edit3, Check, Sparkles, Sun, Sunrise, Moon } from 'lucide-react';
import ActivityCard from './ActivityCard';
import { destinations } from '../data/destinations';
import { useTrip } from '../context/TripContext';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatCurrency';

export default function ItineraryDay({
  day,
  dayIndex,
  totalDays,
  onRemoveDay,
  onRemoveActivity,
  onMoveActivityUp,
  onMoveActivityDown,
  onOpenActivitySelector,
  onOpenCustomEventModal = null,
  onSetActivitySlot = null,
  onUpdateDayTitle = null
}) {
  const { currency } = useApp();
  const { allAvailableActivities } = useTrip();
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeSlotFilter, setActiveSlotFilter] = useState('all'); // 'all' | 'morning' | 'afternoon' | 'evening'
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(day.title || '');

  const destination = destinations.find((d) => d.id === day.destinationId);
  const slots = day.activitySlots || {};

  // Resolve all activities for this day from all available (curated + custom)
  const dayActivitiesWithSlot = (day.activityIds || []).map((id) => {
    const act = (allAvailableActivities || []).find((a) => a.id === id);
    const slot = slots[id] || act?.timeOfDay || 'morning';
    return { activity: act, slot };
  }).filter((item) => Boolean(item.activity));

  // Filter activities based on active slot filter
  const displayedActivities = activeSlotFilter === 'all'
    ? dayActivitiesWithSlot
    : dayActivitiesWithSlot.filter((item) => item.slot === activeSlotFilter);

  // Compute day estimated cost (daily budget fraction + activity costs)
  const dayCost = (destination?.averageDailyBudget || 8000) +
    dayActivitiesWithSlot.reduce((sum, item) => sum + (item.activity.price || 0), 0);

  const handleSaveTitle = () => {
    if (editedTitle.trim() && onUpdateDayTitle) {
      onUpdateDayTitle(dayIndex, editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const morningCount = dayActivitiesWithSlot.filter((i) => i.slot === 'morning').length;
  const afternoonCount = dayActivitiesWithSlot.filter((i) => i.slot === 'afternoon').length;
  const eveningCount = dayActivitiesWithSlot.filter((i) => i.slot === 'evening').length;

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
          <div className="flex items-center gap-3 flex-wrap flex-1 min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary shrink-0">
              Day {day.dayNumber}
            </span>
            {destination && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white dark:bg-surface-elevated text-aether-textMain dark:text-white border border-slate-200 dark:border-slate-700 shadow-xs shrink-0">
                <MapPin className="w-3 h-3 text-secondary" />
                {destination.name}
              </span>
            )}
            
            {/* Title or Title Editor */}
            {isEditingTitle ? (
              <div className="flex items-center gap-1.5 flex-1 max-w-sm">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                  className="px-2.5 py-1 text-sm font-bold rounded-lg border border-secondary bg-white dark:bg-slate-900 text-aether-textMain dark:text-white focus:outline-none w-full"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveTitle}
                  className="p-1.5 rounded-lg bg-secondary text-white hover:bg-secondary-hover"
                  title="Save title"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group/title">
                <h4 className="font-heading font-bold text-sm sm:text-base text-aether-textMain dark:text-white">
                  {day.title}
                </h4>
                {onUpdateDayTitle && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditedTitle(day.title || '');
                      setIsEditingTitle(true);
                    }}
                    className="opacity-0 group-hover/title:opacity-100 text-slate-400 hover:text-secondary transition-opacity p-0.5"
                    title="Edit day title"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
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

        {/* Day Body */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-4 sm:p-5 space-y-4"
            >
              {/* Time of Day Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center gap-1 bg-slate-100/70 dark:bg-slate-900/50 p-1 rounded-xl text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setActiveSlotFilter('all')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      activeSlotFilter === 'all'
                        ? 'bg-white dark:bg-surface-elevated text-aether-textMain dark:text-white font-bold shadow-xs'
                        : 'text-slate-500 hover:text-aether-textMain dark:hover:text-white'
                    }`}
                  >
                    All ({dayActivitiesWithSlot.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSlotFilter('morning')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                      activeSlotFilter === 'morning'
                        ? 'bg-white dark:bg-surface-elevated text-amber-500 font-bold shadow-xs'
                        : 'text-slate-500 hover:text-amber-500'
                    }`}
                  >
                    <Sunrise className="w-3 h-3" />
                    <span>Morning ({morningCount})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSlotFilter('afternoon')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                      activeSlotFilter === 'afternoon'
                        ? 'bg-white dark:bg-surface-elevated text-orange-500 font-bold shadow-xs'
                        : 'text-slate-500 hover:text-orange-500'
                    }`}
                  >
                    <Sun className="w-3 h-3" />
                    <span>Afternoon ({afternoonCount})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSlotFilter('evening')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                      activeSlotFilter === 'evening'
                        ? 'bg-white dark:bg-surface-elevated text-indigo-500 font-bold shadow-xs'
                        : 'text-slate-500 hover:text-indigo-500'
                    }`}
                  >
                    <Moon className="w-3 h-3" />
                    <span>Evening ({eveningCount})</span>
                  </button>
                </div>

                {/* Quick Add Custom Event Shortcut */}
                {onOpenCustomEventModal && (
                  <button
                    type="button"
                    onClick={() => onOpenCustomEventModal(dayIndex, day.destinationId, activeSlotFilter !== 'all' ? activeSlotFilter : 'morning')}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary hover:underline"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>+ Custom Event</span>
                  </button>
                )}
              </div>

              {/* Activities List */}
              {displayedActivities.length > 0 ? (
                <div className="space-y-2.5">
                  {displayedActivities.map((item, actIdx) => (
                    <div key={item.activity.id} className="flex items-center gap-2">
                      <div className="flex-1">
                        <ActivityCard
                          activity={item.activity}
                          timeSlot={item.slot}
                          onChangeSlot={onSetActivitySlot ? (newSlot) => onSetActivitySlot(dayIndex, item.activity.id, newSlot) : null}
                          compact
                          onRemove={() => onRemoveActivity(dayIndex, item.activity.id)}
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
                          disabled={actIdx === displayedActivities.length - 1}
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
                  <p className="text-xs text-slate-400 mb-3">
                    {activeSlotFilter === 'all'
                      ? 'No activities scheduled for this day yet.'
                      : `No ${activeSlotFilter} activities scheduled yet.`}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenActivitySelector(dayIndex, day.destinationId, activeSlotFilter !== 'all' ? activeSlotFilter : 'morning')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-white hover:bg-secondary-hover shadow-xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Browse Experiences</span>
                    </button>
                    {onOpenCustomEventModal && (
                      <button
                        type="button"
                        onClick={() => onOpenCustomEventModal(dayIndex, day.destinationId, activeSlotFilter !== 'all' ? activeSlotFilter : 'morning')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 text-aether-textMain dark:text-white hover:border-secondary transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-secondary" />
                        <span>Add Custom Event</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Add Activity Trigger Bar when items exist */}
              {displayedActivities.length > 0 && (
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenActivitySelector(dayIndex, day.destinationId, activeSlotFilter !== 'all' ? activeSlotFilter : 'morning')}
                    className="w-full sm:flex-1 py-2.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 hover:text-secondary hover:border-secondary flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Curated Experience</span>
                  </button>

                  {onOpenCustomEventModal && (
                    <button
                      type="button"
                      onClick={() => onOpenCustomEventModal(dayIndex, day.destinationId, activeSlotFilter !== 'all' ? activeSlotFilter : 'morning')}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-elevated border border-slate-200 dark:border-slate-700 hover:border-secondary text-xs font-semibold text-aether-textMain dark:text-white flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-secondary" />
                      <span>Custom Event</span>
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

