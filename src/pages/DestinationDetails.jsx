import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DestinationHero from '../components/DestinationHero';
import SectionHeader from '../components/SectionHeader';
import DestinationCard from '../components/DestinationCard';
import ActivityCard from '../components/ActivityCard';
import TripBuilder from '../components/TripBuilder';
import Modal from '../components/Modal';
import { destinations } from '../data/destinations';
import { activities } from '../data/activities';
import { useTrip } from '../context/TripContext';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatCurrency';
import {
  Calendar,
  DollarSign,
  Clock,
  CloudSun,
  Globe,
  Languages,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  ArrowRight,
  Compass
} from 'lucide-react';

export default function DestinationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currency } = useApp();
  const { addDestinationToTrip, activeTrip } = useTrip();

  const [tripBuilderOpen, setTripBuilderOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const destination = destinations.find((d) => d.id === Number(id));

  // Scroll to top on id change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!destination) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold font-heading mb-3">Destination Not Found</h2>
        <p className="text-slate-500 mb-6">The requested destination does not exist in our directory.</p>
        <Link
          to="/explore"
          className="px-6 py-3 rounded-full bg-secondary text-white font-bold text-xs uppercase tracking-wider"
        >
          Back to Explore
        </Link>
      </div>
    );
  }

  // Related activities for this destination
  const destActivities = activities.filter((a) => a.destinationId === destination.id);

  // Related destinations (same continent or travel style, excluding current)
  const relatedDestinations = destinations
    .filter((d) => d.id !== destination.id && (d.continent === destination.continent || d.travelStyle === destination.travelStyle))
    .slice(0, 3);

  const galleryImages = destination.gallery || [destination.image];

  const handleOpenLightbox = (index) => {
    setLightboxIndex(index);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-aether-bgLight dark:bg-aether-bgDark">
      {/* 1. Cinematic Destination Hero Banner */}
      <DestinationHero
        destination={destination}
        onAddToTrip={() => setTripBuilderOpen(true)}
      />

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        
        {/* 2. Destination Visual Gallery with Lightbox */}
        <section>
          <SectionHeader
            badge="VISUAL DISPATCH"
            title="Atmosphere & Perspectives"
            subtitle="Click any photograph to enter the full-screen cinematic lightbox."
          />

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 h-[440px] sm:h-[480px]">
            {/* Primary Large Image */}
            <div
              onClick={() => handleOpenLightbox(0)}
              className="sm:col-span-8 h-full rounded-2xl overflow-hidden cursor-pointer group relative shadow-md"
            >
              <img
                src={galleryImages[0]}
                alt={`${destination.name} Perspective 1`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-4 left-4 text-white text-xs font-semibold px-3 py-1 rounded-full bg-black/50 backdrop-blur-md">
                Featured Vista
              </div>
            </div>

            {/* Supporting Images */}
            <div className="sm:col-span-4 grid grid-cols-2 sm:grid-cols-1 gap-4 h-full">
              {galleryImages.slice(1, 3).map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => handleOpenLightbox(idx + 1)}
                  className="rounded-2xl overflow-hidden cursor-pointer group relative shadow-md h-full"
                >
                  <img
                    src={imgUrl}
                    alt={`${destination.name} Perspective ${idx + 2}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Editorial Overview & Destination Specifications */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Narrative Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-secondary block mb-2">
                About {destination.name}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-aether-textMain dark:text-white leading-tight">
                An immortal blend of landscape, heritage, and atmosphere.
              </h2>
            </div>

            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-light space-y-4">
              <p>{destination.description}</p>
            </div>

            {/* Highlights Chips */}
            <div className="pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Signature Destination Highlights
              </h4>
              <div className="flex flex-wrap gap-2">
                {destination.highlights?.map((h, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-surface-elevated text-aether-textMain dark:text-white border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-secondary" />
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Specifications Right Column */}
          <div className="lg:col-span-4 rounded-2xl bg-white dark:bg-surface-cardDark border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-5">
            <h3 className="font-heading font-bold text-lg text-aether-textMain dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Essential Voyager Details
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-secondary" />
                  Best Season
                </span>
                <span className="font-bold text-aether-textMain dark:text-white">{destination.bestSeason}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent" />
                  Recommended Stay
                </span>
                <span className="font-bold text-aether-textMain dark:text-white">{destination.idealStay || '5 Days'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <CloudSun className="w-4 h-4 text-amber-400" />
                  Avg. Temperature
                </span>
                <span className="font-bold text-aether-textMain dark:text-white">{destination.temperature}°C</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <Languages className="w-4 h-4 text-secondary" />
                  Primary Language
                </span>
                <span className="font-bold text-aether-textMain dark:text-white">{destination.language || 'English'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Price Tier
                </span>
                <span className="font-bold text-aether-textMain dark:text-white">{destination.priceLevel}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Est. Daily Budget</span>
                <span className="text-base font-extrabold text-secondary">
                  {formatCurrency(destination.averageDailyBudget, currency)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTripBuilderOpen(true)}
              className="w-full py-3.5 rounded-xl bg-secondary hover:bg-secondary-hover text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add to My Trip</span>
            </button>
          </div>
        </section>

        {/* 4. Things to Do / Curated Activities */}
        <section>
          <SectionHeader
            badge="EXPERIENCES"
            title={`Things to do in ${destination.name}`}
            subtitle="Hand-selected authentic activities to schedule into your journey itinerary."
          />

          {destActivities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onSelect={(act) => setSelectedActivity(act)}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
              <p className="text-sm text-slate-400">General exploration and walking tours available on arrival.</p>
            </div>
          )}
        </section>

        {/* 5. Related Destinations */}
        {relatedDestinations.length > 0 && (
          <section className="pt-8 border-t border-slate-200/60 dark:border-slate-800">
            <SectionHeader
              badge="EXTEND YOUR HORIZONS"
              title="You might also admire"
              subtitle="Similar sanctuaries sharing travel rhythm, geographical climate, or cultural resonance."
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedDestinations.map((rel) => (
                <DestinationCard
                  key={rel.id}
                  destination={rel}
                  showCompare
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Arrows */}
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-4 sm:left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              aria-label="Previous photograph"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-4 sm:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              aria-label="Next photograph"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Active Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
            >
              <img
                src={galleryImages[lightboxIndex]}
                alt={`${destination.name} Lightbox Vista`}
                className="w-full h-full object-contain max-h-[80vh] mx-auto rounded-2xl"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
                {lightboxIndex + 1} / {galleryImages.length}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Activity Details Modal */}
      {selectedActivity && (
        <Modal
          isOpen={Boolean(selectedActivity)}
          onClose={() => setSelectedActivity(null)}
          title={selectedActivity.title}
          subtitle={`${selectedActivity.category} · ${selectedActivity.duration}`}
        >
          <div className="space-y-5">
            {selectedActivity.image && (
              <img
                src={selectedActivity.image}
                alt={selectedActivity.title}
                className="w-full h-52 object-cover rounded-xl"
              />
            )}
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedActivity.description}
            </p>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block uppercase">Est. Experience Fee</span>
                <span className="text-lg font-bold font-heading text-aether-textMain dark:text-white">
                  {selectedActivity.price === 0 ? 'Complimentary / Free' : formatCurrency(selectedActivity.price, currency)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (activeTrip) {
                    // Add to first day or prompt
                    setTripBuilderOpen(true);
                  }
                  setSelectedActivity(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary-hover text-white text-xs font-bold uppercase tracking-wider shadow"
              >
                Schedule in Itinerary
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Trip Builder Modal */}
      <TripBuilder
        isOpen={tripBuilderOpen}
        onClose={() => setTripBuilderOpen(false)}
        destinationToAdd={destination}
      />
    </div>
  );
}
