import React from 'react';
import DestinationCard from './DestinationCard';
import { Compass, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DestinationGrid({
  destinations = [],
  onAddToTrip = null,
  showCompare = false,
  emptyMessage = "No destinations match your criteria",
  onResetFilters = null
}) {
  if (!destinations.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20 px-4 bg-white/50 dark:bg-surface-cardDark/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 max-w-lg mx-auto"
      >
        <div className="w-16 h-16 rounded-full bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center mx-auto mb-4 text-secondary dark:text-highlight">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>
        <h3 className="text-xl font-bold font-heading text-aether-textMain dark:text-white mb-2">
          We couldn't find that place
        </h3>
        <p className="text-sm text-aether-textMuted dark:text-slate-400 mb-6">
          {emptyMessage}
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-primary dark:bg-white text-white dark:text-primary hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-4 h-4" />
            Reset all filters
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {destinations.map((dest) => (
        <DestinationCard
          key={dest.id}
          destination={dest}
          onAddToTrip={onAddToTrip}
          showCompare={showCompare}
        />
      ))}
    </div>
  );
}
