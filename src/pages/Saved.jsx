import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import SavedDestination from '../components/SavedDestination';
import TripBuilder from '../components/TripBuilder';
import { useSaved } from '../context/SavedContext';
import { Heart, Compass, Sparkles, Trash2, ArrowRight } from 'lucide-react';

export default function Saved() {
  const { savedDestinations, clearSaved, savedCount } = useSaved();
  const [tripBuilderOpen, setTripBuilderOpen] = useState(false);
  const [selectedDestinationForTrip, setSelectedDestinationForTrip] = useState(null);

  const handleAddToTrip = (destination) => {
    setSelectedDestinationForTrip(destination);
    setTripBuilderOpen(true);
  };

  return (
    <div className="min-h-screen pt-28 pb-24 bg-aether-bgLight dark:bg-aether-bgDark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <SectionHeader
          badge="MY COLLECTION"
          title="MY SAVED PLACES"
          subtitle="Places bookmarked for your future horizons. Add them directly into your itinerary or compare side-by-side."
          action={
            savedCount > 0 ? (
              <button
                type="button"
                onClick={clearSaved}
                className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            ) : null
          }
        />

        {savedCount > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedDestinations.map((destination) => (
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
