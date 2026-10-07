import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import Hero from '../components/Hero';
import SectionHeader from '../components/SectionHeader';
import DestinationCard from '../components/DestinationCard';
import TripCard from '../components/TripCard';
import MapExplorer from '../components/MapExplorer';
import TripBuilder from '../components/TripBuilder';
import Modal from '../components/Modal';
import { destinations } from '../data/destinations';
import { categories } from '../data/categories';
import { curatedJourneys } from '../data/journeys';
import { journalArticles } from '../data/journal';
import { useTrip } from '../context/TripContext';
import { useApp } from '../context/AppContext';
import { ArrowRight, Compass, Sparkles, MapPin, Clock, Check } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { currency } = useApp();
  const { addDestinationToTrip, activeTrip } = useTrip();

  // Modal states
  const [tripBuilderOpen, setTripBuilderOpen] = useState(false);
  const [selectedDestinationForTrip, setSelectedDestinationForTrip] = useState(null);
  const [previewJourney, setPreviewJourney] = useState(null);

  // Trending destinations (top 6)
  const trendingDestinations = destinations.filter((d) => d.trending).slice(0, 6);

  const handleAddToTrip = (destination) => {
    setSelectedDestinationForTrip(destination);
    setTripBuilderOpen(true);
  };

  const handleAddCuratedJourney = (journey) => {
    // Add all destination IDs in journey to active trip
    if (activeTrip && journey.destinationIds) {
      journey.destinationIds.forEach((destId) => {
        addDestinationToTrip(activeTrip.id, destId);
      });
    }
    setPreviewJourney(null);
    navigate('/planner');
  };

  return (
    <div className="min-h-screen bg-aether-bgLight dark:bg-aether-bgDark overflow-x-hidden">
      {/* 1. Fullscreen Cinematic Hero */}
      <Hero onPlanTripClick={() => navigate('/planner')} />

      {/* 2. Trending Destinations Section */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="TRENDING NOW"
          title="Places travelers are dreaming about."
          subtitle="Curated sanctuaries combining natural wonder, cultural depth, and unforgettable experiences."
          action={
            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-secondary hover:text-secondary-hover uppercase tracking-wider group"
            >
              <span>View All 32 Places</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {trendingDestinations.map((dest) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              onAddToTrip={handleAddToTrip}
              showCompare
            />
          ))}
        </div>
      </section>

      {/* 3. Explore by Mood Section */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-vignette opacity-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeader
            badge="CURATED MOODS"
            title="Where do you want to go?"
            subtitle="Follow how you wish to feel. From quiet mountain restoration to wild Arctic frontiers."
            light
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <motion.div
                key={cat.id}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                onClick={() => navigate(`/explore?style=${cat.name}`)}
                className="group relative h-48 sm:h-56 rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-white/10"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/95 transition-colors" />

                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-highlight">
                    {cat.destinationsCount} Places
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-heading uppercase text-white group-hover:text-highlight transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-white/70 line-clamp-1 font-light mt-0.5">
                    {cat.tagline}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Interactive World Map Section */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="GLOBAL EXPLORER"
          title="Explore the world at a glance."
          subtitle="Navigate continents, inspect live regional markers, and discover authentic journeys."
          action={
            <Link
              to="/map"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-secondary text-white hover:bg-secondary-hover shadow-md transition-all"
            >
              <span>Full Screen Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />

        <MapExplorer embedded onAddToTrip={handleAddToTrip} />
      </section>

      {/* 5. Featured Curated Journeys */}
      <section className="py-20 bg-slate-50 dark:bg-surface-elevated/40 border-y border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="FEATURED EXPEDITIONS"
            title="Curated multi-day itineraries."
            subtitle="Thoughtfully paced routes designed for immersive cultural depth, scenic rails, and restorative stays."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {curatedJourneys.slice(0, 4).map((journey) => (
              <TripCard
                key={journey.id}
                journey={journey}
                onClick={(j) => setPreviewJourney(j)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Travel Journal / Inspiration Section */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="AETHER JOURNAL"
          title="Stories for the thoughtful voyager."
          subtitle="Reflections on slow travel, minimalist packing, and conversations with ancient landscapes."
          action={
            <Link
              to="/journal"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-secondary hover:text-secondary-hover uppercase tracking-wider"
            >
              <span>Read Journal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {journalArticles.slice(0, 3).map((art) => (
            <motion.div
              key={art.id}
              whileHover={{ y: -6 }}
              onClick={() => navigate(`/journal/${art.id}`)}
              className="group cursor-pointer flex flex-col"
            >
              <div className="relative h-64 rounded-2xl overflow-hidden mb-4 shadow-md">
                <img
                  src={art.image}
                  alt={art.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/50 backdrop-blur-md text-white border border-white/15">
                  {art.category}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                <span>{art.date}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {art.readTime}
                </span>
              </div>

              <h3 className="text-xl font-bold font-heading text-aether-textMain dark:text-white group-hover:text-secondary transition-colors mb-2 leading-snug">
                {art.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {art.excerpt}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 7. Trip Planning CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-primary p-8 sm:p-14 lg:p-16 text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-highlight/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-highlight text-xs font-bold uppercase tracking-widest mb-4 border border-white/15">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Travel Planner</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-heading tracking-tight leading-tight uppercase mb-4">
              BUILD YOUR UNFORGETTABLE JOURNEY.
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-light">
              Craft day-by-day itineraries, schedule hand-picked cultural experiences, and balance your trip budget in real-time.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link
              to="/planner"
              className="px-8 py-4 rounded-full bg-white text-primary font-bold text-sm uppercase tracking-wider shadow-2xl hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-secondary" />
              <span>Launch Itinerary Builder</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Curated Journey Preview Modal */}
      {previewJourney && (
        <Modal
          isOpen={Boolean(previewJourney)}
          onClose={() => setPreviewJourney(null)}
          title={previewJourney.title}
          subtitle={`${previewJourney.days} Days · ${previewJourney.travelStyle}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            <div className="relative h-60 rounded-xl overflow-hidden">
              <img
                src={previewJourney.image}
                alt={previewJourney.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <div className="flex items-center gap-2 text-highlight text-xs font-semibold">
                  <MapPin className="w-4 h-4" />
                  <span>Route: {previewJourney.route}</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {previewJourney.overview}
            </p>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Key Journey Highlights
              </h4>
              <div className="space-y-2">
                {previewJourney.highlights?.map((h, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200">
                    <Check className="w-4 h-4 text-secondary shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block uppercase">Est. Budget</span>
                <span className="text-xl font-bold font-heading text-aether-textMain dark:text-white">
                  {formatCurrency(previewJourney.estimatedBudget, currency)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleAddCuratedJourney(previewJourney)}
                className="px-6 py-2.5 rounded-full bg-secondary hover:bg-secondary-hover text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
              >
                <span>Add to My Trip</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Trip Builder Selection Modal */}
      <TripBuilder
        isOpen={tripBuilderOpen}
        onClose={() => setTripBuilderOpen(false)}
        destinationToAdd={selectedDestinationForTrip}
      />
    </div>
  );
}
