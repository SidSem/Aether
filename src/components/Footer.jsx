import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Send, Heart, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { addToast } = useApp();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    addToast('Welcome to the AETHER dispatch. Unforgettable horizons await.', 'success');
  };

  return (
    <footer className="relative bg-primary-dark text-white border-t border-slate-800 overflow-hidden pt-16 pb-12">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-14 border-b border-white/10">
          {/* Brand & Manifesto */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-2 select-none group">
              <div className="w-8 h-8 rounded-lg bg-secondary/20 border border-secondary/40 flex items-center justify-center group-hover:bg-secondary transition-colors">
                <Compass className="w-5 h-5 text-highlight group-hover:text-white transition-colors" />
              </div>
              <span className="font-heading font-black text-2xl tracking-[0.2em] text-white">
                AETHER
              </span>
            </Link>

            <p className="text-sm text-white/70 max-w-sm leading-relaxed font-light">
              "Go somewhere unforgettable." <br />
              An editorial discovery platform and trip planner built for the modern voyager.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <span className="block text-xs uppercase font-bold tracking-wider text-highlight mb-2">
                The Aether Dispatch
              </span>
              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="flex items-center gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-xs focus:outline-none focus:border-highlight"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary-hover text-white text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
                  >
                    <span>Join</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>You are subscribed to weekly horizon stories.</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Discover Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Discover
            </h4>
            <ul className="space-y-2 text-xs font-medium text-white/75">
              <li><Link to="/explore?style=Culture" className="hover:text-white transition-colors">Ancient Culture</Link></li>
              <li><Link to="/explore?style=Adventure" className="hover:text-white transition-colors">Alpine & Arctic</Link></li>
              <li><Link to="/explore?style=Romantic" className="hover:text-white transition-colors">Romantic Cliffs</Link></li>
              <li><Link to="/explore?style=Beach" className="hover:text-white transition-colors">Coastal Sanctuaries</Link></li>
              <li><Link to="/explore?style=Food" className="hover:text-white transition-colors">Culinary Capitals</Link></li>
            </ul>
          </div>

          {/* Planning Platform Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Planning
            </h4>
            <ul className="space-y-2 text-xs font-medium text-white/75">
              <li><Link to="/planner" className="hover:text-white transition-colors">Itinerary Builder</Link></li>
              <li><Link to="/map" className="hover:text-white transition-colors">World Map Explorer</Link></li>
              <li><Link to="/saved" className="hover:text-white transition-colors">Saved Destinations</Link></li>
              <li><Link to="/compare" className="hover:text-white transition-colors">Trip Comparison</Link></li>
              <li><Link to="/journal" className="hover:text-white transition-colors">Travel Journal</Link></li>
            </ul>
          </div>

          {/* Editorial / About */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Philosophy
            </h4>
            <ul className="space-y-2 text-xs font-medium text-white/75">
              <li><Link to="/about" className="hover:text-white transition-colors">About AETHER</Link></li>
              <li><Link to="/journal/art-1" className="hover:text-white transition-colors">The Art of Slow Travel</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Responsible Travel Code</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Editorial Standards</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Tagline */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© 2026 AETHER Inc. All rights reserved. Pure frontend architecture.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/about" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/about" className="hover:text-white transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
