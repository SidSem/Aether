import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import SavedDestination from '../components/SavedDestination';
import TripBuilder from '../components/TripBuilder';
import { useSaved } from '../context/SavedContext';
import { useApp } from '../context/AppContext';
import { travelStyles } from '../data/categories';
import { Heart, Compass, Trash2, Scale, MapPin } from 'lucide-react';

export default function Saved() {
  const navigate = useNavigate();
  const { savedDestinations, clearSaved, savedCount } = useSaved();
  const { addToCompare } = useApp();
  const [tripBuilderOpen, setTripBuilderOpen] = useState(false);
  const [selectedDestinationForTrip, setSelectedDestinationForTrip] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState('All Styles');
  const [sortBy, setSortBy] = useState('default');

  const handleAddToTrip = (destination) => {
    setSelectedDestinationForTrip(destination);
    setTripBuilderOpen(true);
  };

  const handleCompareAllSaved = () => {
    savedDestinations.slice(0, 3).forEach((d) => addToCompare(d.id));
    navigate('/compare');
  };

  const filteredAndSortedSaved = useMemo(() => {
    let list = [...savedDestinations];

    if (selectedStyle !== 'All Styles') {
      list = list.filter((d) => d.travelStyle === selectedStyle);
    }

    if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price-asc') {
      list.sort((a, b) => a.averageDailyBudget - b.averageDailyBudget);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.averageDailyBudget - a.averageDailyBudget);
    }

    return list;
  }, [savedDestinations, selectedStyle, sortBy]);

  return (
    <div className="min-h-screen pt-28 pb-24 bg-aether-bgLight dark:bg-aether-bgDark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <SectionHeader
          badge="MY COLLECTION"
          title="MY SAVED PLACES"
          subtitle="Places bookmarked for your future horizons. Add them directly into your itinerary, explore them on the map, or compare side-by-side."
          action={
            savedCount > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to="/map"
                  className="text-xs font-bold uppercase tracking-wider text-secondary hover:text-secondary-hover transition-colors flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-secondary/10 border border-secondary/20"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>View on Map</span>
                </Link>

                {savedCount >= 2 && (
                  <button
                    type="button"
                    onClick={handleCompareAllSaved}
                    className="text-xs font-bold uppercase tracking-wider text-white bg-secondary hover:bg-secondary-hover transition-colors flex items-center gap-1.5 px-3.5 py-2 rounded-xl shadow-xs"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Compare Saved</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={clearSaved}
                  className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </div>
            ) : null
          }
        />

        {savedCount > 0 && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-surface-cardDark border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Style:</span>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-surface-elevated text-xs font-semibold focus:outline-none"
              >
                {travelStyles.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-surface-elevated text-xs font-semibold focus:outline-none"
              >
                <option value="default">Default</option>
                <option value="rating">Highest Rating</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </select>
            </div>
          </div>
        )}

        {savedCount > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAndSortedSaved.map((destination) => (
              <SavedDestination
                key={destination.id}
                destination={destination}
                onAddToTrip={handleAddToTrip}
              />
            ))}
          </div>
        ) : (
          /* Empty State as requested in Section 21 */
          <div className="py-24 text-center max-w-md mx-auto px-4 bg-white/40 dark:bg-surface-cardDark/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold font-heading text-aether-textMain dark:text-white uppercase mb-2">
              Your next adventure is still out there.
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Explore our global sanctuaries and save your favorites here with a tap of the heart icon.
            </p>

            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary hover:bg-secondary-hover text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Destinations</span>
            </Link>
          </div>
        )}
      </div>

      {/* Trip Builder Modal */}
      <TripBuilder
        isOpen={tripBuilderOpen}
        onClose={() => setTripBuilderOpen(false)}
        destinationToAdd={selectedDestinationForTrip}
      />
    </div>
  );
}
