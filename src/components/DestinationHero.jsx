import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Plus, Share2, Star, Calendar, MapPin, DollarSign, Clock, Check } from 'lucide-react';
import { useSaved } from '../context/SavedContext';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatCurrency';

export default function DestinationHero({
  destination,
  onAddToTrip
}) {
  const { isSaved, toggleSaved } = useSaved();
  const { currency, addToast } = useApp();

  const saved = isSaved(destination.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Destination link copied to clipboard', 'success');
    }
  };

  return (
    <div className="relative min-h-[75vh] w-full flex items-end overflow-hidden bg-primary-dark text-white select-none">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32 w-full">
        {/* Country & Continent Pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold tracking-widest uppercase text-highlight mb-4"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{destination.country} · {destination.continent}</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-heading tracking-tight uppercase mb-3"
        >
          {destination.name}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg sm:text-2xl text-white/90 font-light max-w-2xl leading-relaxed mb-8"
        >
          "{destination.tagline || destination.shortDescription}"
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10"
        >
          <button
            type="button"
            onClick={onAddToTrip}
            className="px-6 py-3.5 rounded-full bg-secondary hover:bg-secondary-hover text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Trip</span>
          </button>

          <button
            type="button"
            onClick={() => toggleSaved(destination.id)}
            className={`px-5 py-3.5 rounded-full backdrop-blur-md border text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 ${
              saved
                ? 'bg-rose-500 text-white border-rose-400'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="p-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all"
            title="Share destination"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Rating */}
          <div className="ml-auto hidden sm:flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/15">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-bold text-sm">{destination.rating.toFixed(1)}</span>
            <span className="text-white/60 text-xs">({destination.reviews} reviews)</span>
          </div>
        </motion.div>

        {/* Key Quick Facts Cards Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/15"
        >
          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-highlight mb-1">
              Best Time
            </span>
            <span className="text-sm sm:text-base font-bold text-white">
              {destination.bestSeason}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-highlight mb-1">
              Avg. Daily
            </span>
            <span className="text-sm sm:text-base font-bold text-white">
              {formatCurrency(destination.averageDailyBudget, currency)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-highlight mb-1">
              Ideal Stay
            </span>
            <span className="text-sm sm:text-base font-bold text-white">
              {destination.idealStay || `${destination.duration} Days`}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-highlight mb-1">
              Climate
            </span>
            <span className="text-sm sm:text-base font-bold text-white">
              {destination.temperature}°C Average
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
