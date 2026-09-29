import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatCurrency';

export default function TripCard({
  journey,
  onClick,
  onAddToTrip = null
}) {
  const { currency } = useApp();

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      onClick={() => onClick && onClick(journey)}
      className="group relative rounded-2xl overflow-hidden bg-white dark:bg-surface-cardDark border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-2xl transition-all cursor-pointer flex flex-col h-full"
    >
      {/* Header Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={journey.image}
          alt={journey.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/40 backdrop-blur-md text-white border border-white/20">
            {journey.travelStyle}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-secondary text-white shadow">
            {journey.days} Days
          </span>
        </div>

        {/* Route on Image */}
        <div className="absolute bottom-3 left-4 right-4">
          <div className="flex items-center gap-1.5 text-xs text-highlight font-medium">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{journey.route}</span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold font-heading text-aether-textMain dark:text-white group-hover:text-secondary transition-colors mb-1">
            {journey.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-3">
            {journey.subtitle}
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
            {journey.tagline || journey.overview}
          </p>

          {/* Highlights Bullets */}
          <div className="space-y-1.5 mb-5">
            {journey.highlights?.slice(0, 2).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Sparkles className="w-3 h-3 text-accent shrink-0" />
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
              Est. Journey Cost
            </span>
            <span className="text-base sm:text-lg font-bold text-aether-textMain dark:text-white">
              {formatCurrency(journey.estimatedBudget, currency)}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-secondary group-hover:translate-x-1 transition-transform">
            <span>View Route</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
