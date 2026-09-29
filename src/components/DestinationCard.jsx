import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star, Clock, ArrowUpRight, Plus, Check } from 'lucide-react';
import { useSaved } from '../context/SavedContext';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatCurrency';

export default function DestinationCard({
  destination,
  onAddToTrip = null,
  showCompare = false
}) {
  const navigate = useNavigate();
  const { isSaved, toggleSaved } = useSaved();
  const { currency, isInCompare, addToCompare, removeFromCompare } = useApp();

  const saved = isSaved(destination.id);
  const inCompare = isInCompare(destination.id);

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaved(destination.id);
  };

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(destination.id);
    } else {
      addToCompare(destination.id);
    }
  };

  const handleAddToTripClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToTrip) {
      onAddToTrip(destination);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -6 }}
      onClick={() => navigate(`/destination/${destination.id}`)}
      className="group relative flex flex-col h-[400px] sm:h-[440px] rounded-2xl overflow-hidden cursor-pointer bg-slate-900 shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200/40 dark:border-slate-800"
    >
      {/* Background Image with Zoom */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 group-hover:from-black/95 transition-colors duration-300" />
      </div>

      {/* Top Bar: Country & Save / Compare actions */}
      <div className="relative z-10 p-5 flex items-center justify-between">
        <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase text-white bg-black/40 backdrop-blur-md rounded-full border border-white/10">
          {destination.country}
        </span>

        <div className="flex items-center gap-2">
          {showCompare && (
            <button
              type="button"
              onClick={handleCompareClick}
              title={inCompare ? "Remove from comparison" : "Add to comparison"}
              className={`p-2 rounded-full backdrop-blur-md border transition-all ${
                inCompare
                  ? 'bg-secondary text-white border-secondary'
                  : 'bg-black/30 hover:bg-black/50 text-white/80 hover:text-white border-white/20'
              }`}
            >
              {inCompare ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold px-0.5">VS</span>}
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveClick}
            aria-label={saved ? "Remove from saved" : "Save destination"}
            className={`p-2 rounded-full backdrop-blur-md border transition-all transform active:scale-90 ${
              saved
                ? 'bg-red-500 text-white border-red-400'
                : 'bg-black/30 hover:bg-black/50 text-white/90 hover:text-white border-white/20'
            }`}
          >
            <motion.div
              animate={{ scale: saved ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Bottom Info: Editorial typography & stats */}
      <div className="relative z-10 mt-auto p-5 sm:p-6 text-white transform transition-transform duration-300 group-hover:-translate-y-1">
        {/* Style Tag & Rating */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-medium tracking-wide text-highlight uppercase">
            {destination.travelStyle} · {destination.continent}
          </span>
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 text-xs">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-bold">{destination.rating.toFixed(1)}</span>
            <span className="text-white/60 text-[10px]">({destination.reviews})</span>
          </div>
        </div>

        {/* Destination Name */}
        <h3 className="text-2xl sm:text-3xl font-bold font-heading leading-tight tracking-tight text-white mb-1 group-hover:text-highlight transition-colors">
          {destination.name}
        </h3>

        {/* Short description / tagline */}
        <p className="text-xs sm:text-sm text-white/80 line-clamp-2 mb-4 leading-relaxed font-light">
          {destination.shortDescription}
        </p>

        {/* Card Footer: Budget & Duration + CTA */}
        <div className="pt-3 border-t border-white/15 flex items-center justify-between">
          <div>
            <span className="block text-[10px] tracking-wider uppercase text-white/60">
              Avg. Daily
            </span>
            <span className="text-base sm:text-lg font-bold text-white tracking-tight">
              {formatCurrency(destination.averageDailyBudget, currency)}
            </span>
            <span className="text-[10px] text-white/50 ml-1">/ day</span>
          </div>

          <div className="flex items-center gap-2">
            {onAddToTrip && (
              <button
                type="button"
                onClick={handleAddToTripClick}
                title="Add to Itinerary"
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/25 text-white border border-white/20 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Trip</span>
              </button>
            )}

            <div className="flex items-center gap-1 text-xs font-semibold text-white group-hover:text-highlight transition-colors">
              <span>Explore</span>
              <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
