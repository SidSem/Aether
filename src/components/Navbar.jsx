import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Search,
  Heart,
  Briefcase,
  Moon,
  Sun,
  Menu,
  X,
  Map,
  BookOpen,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSaved } from '../context/SavedContext';
import { useTrip } from '../context/TripContext';
import { useScrollDirection } from '../hooks/useScrollDirection';
import { CURRENCIES } from '../utils/formatCurrency';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isScrolled } = useScrollDirection();
  const { theme, toggleTheme, currency, setCurrency, openSearch } = useApp();
  const { savedCount } = useSaved();
  const { activeTrip, openTripDrawer } = useTrip();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const isHomePage = location.pathname === '/';
  const tripPlacesCount = activeTrip?.destinationIds?.length || 0;

  const navLinks = [
    { name: 'Explore', path: '/explore' },
    { name: 'Destinations', path: '/explore?filter=all' },
    { name: 'Trip Planner', path: '/planner' },
    { name: 'Map', path: '/map' },
    { name: 'Journal', path: '/journal' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled || !isHomePage
            ? 'glass-nav py-3.5 shadow-lg'
            : 'bg-gradient-to-b from-black/60 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Left: Hamburger */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-white/90 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group text-white select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-secondary/20 border border-secondary/40 flex items-center justify-center group-hover:bg-secondary transition-colors">
              <Compass className="w-5 h-5 text-highlight group-hover:text-white transition-colors" />
            </div>
            <span className="font-heading font-black text-xl sm:text-2xl tracking-[0.2em] text-white">
              AETHER
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                    isActive
                      ? 'text-white bg-white/15 backdrop-blur-md shadow-xs'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Search, Saved, My Trip, Currency, Theme */}
          <div className="flex items-center gap-2 sm:gap-3 text-white">
            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={openSearch}
              aria-label="Search destinations"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/15 transition-all"
            >
              <Search className="w-3.5 h-3.5 text-highlight" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white/80 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Currency Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors border border-white/10"
              >
                <span>{CURRENCIES[currency]?.symbol}</span>
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-white/60" />
              </button>

              <AnimatePresence>
                {currencyDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-36 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-1 z-50 overflow-hidden"
                  >
                    {Object.keys(CURRENCIES).map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => {
                          setCurrency(code);
                          setCurrencyDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs font-semibold rounded-lg flex items-center justify-between transition-colors ${
                          currency === code
                            ? 'bg-secondary text-white'
                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span>{CURRENCIES[code].name}</span>
                        <span className="font-mono text-highlight">{CURRENCIES[code].symbol}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Saved Destinations Badge */}
            <Link
              to="/saved"
              aria-label="View saved places"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold border border-white/15 transition-all group"
            >
              <Heart className={`w-3.5 h-3.5 transition-colors ${savedCount > 0 ? 'text-rose-400 fill-rose-400' : 'text-white'}`} />
              <span>{savedCount}</span>
            </Link>

            {/* My Trip Badge / Planner Quick Jump */}
            <Link
              to="/planner"
              aria-label="My trip planner"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-secondary hover:bg-secondary-hover text-white text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>MY TRIP</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>{tripPlacesCount}</span>
            </Link>

            {/* Dark / Light Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme mode"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-highlight" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Animated Fullscreen Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed inset-0 z-50 bg-primary-dark/95 backdrop-blur-2xl text-white p-6 flex flex-col justify-between"
          >
            {/* Top Close Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div className="flex items-center gap-2">
                <Compass className="w-6 h-6 text-highlight" />
                <span className="font-heading font-black text-xl tracking-[0.2em]">
                  AETHER
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full text-white/70 hover:text-white bg-white/10"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-4 py-8">
              {[
                { name: 'Discover Places', path: '/explore', icon: Compass },
                { name: 'Trip Planner', path: '/planner', icon: Briefcase },
                { name: 'Interactive Map', path: '/map', icon: Map },
                { name: 'Saved Places', path: '/saved', icon: Heart },
                { name: 'Compare', path: '/compare', icon: Compass },
                { name: 'Travel Journal', path: '/journal', icon: BookOpen },
                { name: 'About Aether', path: '/about', icon: Compass },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-2xl font-bold font-heading hover:text-highlight transition-colors py-2"
                >
                  <span>{item.name}</span>
                  <item.icon className="w-5 h-5 text-white/40" />
                </Link>
              ))}
            </nav>

            {/* Mobile Footer with Currency & Theme */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/60">Currency:</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-white/10 text-white rounded-lg px-2.5 py-1 text-xs font-bold border border-white/20 focus:outline-none"
                >
                  {Object.keys(CURRENCIES).map((code) => (
                    <option key={code} value={code} className="bg-slate-900 text-white">
                      {code} ({CURRENCIES[code].symbol})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-xs font-semibold"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-highlight" />}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
