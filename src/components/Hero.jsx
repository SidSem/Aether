import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Calendar, ArrowRight, CloudSun, ChevronDown } from 'lucide-react';
import { destinations } from '../data/destinations';

export default function Hero({ onPlanTripClick = null }) {
  const navigate = useNavigate();
  // Hero featured destination: Amalfi Coast (id 2)
  const heroDest = destinations.find((d) => d.id === 2) || destinations[0];

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-primary-dark text-white select-none">
      {/* Cinematic Background Image with Zoom */}
      <motion.div
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <img
          src="https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2000&auto=format&fit=crop"
          alt="Amalfi Coast Horizon"
          className="w-full h-full object-cover object-center"
        />
        {/* Layered cinematic gradient overlays */}
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-radial-vignette opacity-60" />
      </motion.div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full flex flex-col justify-between min-h-[90vh]">
        {/* Main Editorial Hero Text */}
        <div className="max-w-3xl my-auto">
          {/* Small Label */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold tracking-[0.2em] uppercase text-highlight mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-highlight animate-pulse" />
            <span>TRAVEL / 2026</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-heading tracking-tight leading-[0.95] uppercase mb-6"
          >
            DISCOVER <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-highlight">
              YOUR NEXT
            </span> <br />
            HORIZON.
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-base sm:text-xl text-white/85 max-w-xl font-light leading-relaxed mb-8"
          >
            Curated places, unforgettable journeys, and a better way to plan your next escape.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              to="/explore"
              className="px-7 py-4 rounded-full bg-white text-primary font-bold text-sm tracking-wide uppercase shadow-2xl hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
            >
              <span>Explore Destinations</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              type="button"
              onClick={() => {
                if (onPlanTripClick) onPlanTripClick();
                else navigate('/planner');
              }}
              className="px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-sm tracking-wide uppercase border border-white/20 hover:border-white/40 active:scale-95 transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-highlight" />
              <span>Plan a Trip</span>
            </button>
          </motion.div>
        </div>

        {/* Bottom Strip: Floating Location Card + Scroll Indicator */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-6 pt-12">
          {/* Scroll down indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="hidden md:flex items-center gap-3 text-xs tracking-widest text-white/60 uppercase"
          >
            <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center p-1">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="w-1 h-1.5 rounded-full bg-highlight"
              />
            </div>
            <span>Scroll to explore</span>
          </motion.div>

          {/* Section 10: Floating Hero Location Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            onClick={() => navigate(`/destination/${heroDest.id}`)}
            className="cursor-pointer group animate-float self-end"
          >
            <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center gap-4 hover:border-highlight transition-all max-w-xs sm:max-w-sm">
              <img
                src={heroDest.image}
                alt={heroDest.name}
                className="w-14 h-14 rounded-xl object-cover border border-white/20 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-xs text-highlight font-bold tracking-wider uppercase">
                  <span>📍 {heroDest.name.toUpperCase()}</span>
                </div>
                <p className="text-xs text-white/70 font-medium">
                  {heroDest.country}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-white/90 font-medium mt-1">
                  <span className="inline-flex items-center gap-1">
                    <CloudSun className="w-3.5 h-3.5 text-accent" />
                    {heroDest.temperature}°C
                  </span>
                  <span className="text-white/30">|</span>
                  <span className="text-[10px] tracking-wider text-slate-300 uppercase">
                    BEST: APR — OCT
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
