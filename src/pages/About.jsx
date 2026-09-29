import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { Compass, Sparkles, Shield, Heart, Globe, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen pt-28 pb-24 bg-aether-bgLight dark:bg-aether-bgDark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-primary p-8 sm:p-16 lg:p-20 text-white shadow-2xl mb-20">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop"
              alt="Mountain Vista"
              className="w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-transparent" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-highlight text-xs font-bold uppercase tracking-widest border border-white/20">
              <Compass className="w-3.5 h-3.5" />
              <span>THE AETHER MANIFESTO</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight leading-[1.05] uppercase">
              ABOUT AETHER
            </h1>

            <p className="text-lg sm:text-2xl text-white/90 font-light leading-relaxed">
              "We believe planning a journey should feel like the beginning of the journey itself."
            </p>
          </div>
        </div>

        {/* Our Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary block">
              OUR PHILOSOPHY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-aether-textMain dark:text-white leading-tight">
              Travel designed around curiosity, not algorithms.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-light">
              Mainstream travel tools have turned exploration into a transactional blur of flight tickers, crowded tourist buses, and impersonal reviews. AETHER was born from a desire to reclaim the poetry of wandering.
            </p>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-light">
              We curate only places that leave an indelible imprint: ancient cedar forests in Kansai, lemon groves clinging to vertical Amalfi limestone, and silent desert dunes under cosmic Milky Way skies.
            </p>
          </div>

          <div className="lg:col-span-6 relative h-[380px] sm:h-[450px] rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=1000&auto=format&fit=crop"
              alt="Nature Reflection"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* How AETHER Works */}
        <div className="mb-24">
          <SectionHeader
            badge="PLATFORM PRINCIPLES"
            title="How AETHER Works"
            subtitle="An integrated ecosystem engineered to move seamlessly from dreaming to departure."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white dark:bg-surface-cardDark border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 dark:bg-secondary/20 text-secondary flex items-center justify-center mb-4">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-aether-textMain dark:text-white">
                1. Discover & Map
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Filter sanctuaries by mood, continent, climate, or budget. Explore interactive coordinates on our custom projection map.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-surface-cardDark border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-accent/10 dark:bg-accent/20 text-accent flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-aether-textMain dark:text-white">
                2. Plan Day-by-Day
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Schedule authentic local activities, reorder milestones, and visualize routes along an interactive vertical timeline.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-surface-cardDark border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-aether-textMain dark:text-white">
                3. Calibrate & Save
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Watch dynamic multi-currency budget models calculate per-traveler allocations, persisted safely in your browser.
              </p>
            </div>
          </div>
        </div>

        {/* Responsible Travel Code */}
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-highlight">
              OUR COMMITMENT
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-heading">
              The Responsible Travel Pledge
            </h3>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              We champion slow travel, local artisan economies, respectful interaction with sacred heritage, and low-impact exploration across vulnerable ecosystems.
            </p>
          </div>

          <Link
            to="/explore"
            className="px-6 py-3 rounded-full bg-secondary hover:bg-secondary-hover text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-md"
          >
            <span>Begin Discovery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
