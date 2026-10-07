import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Compass, ArrowRight, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useDebounce } from '../hooks/useDebounce';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { destinations } from '../data/destinations';
import { formatCurrency } from '../utils/formatCurrency';

export default function SearchOverlay() {
  const { isSearchOpen, closeSearch, currency } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 200);
  const [recentSearches, setRecentSearches] = useLocalStorage('aether_recent_searches', [
    'Kyoto', 'Amalfi Coast', 'Iceland', 'Beach'
  ]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => inputRef.current?.focus(), 80);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSearchOpen]);

  // Compute live matched destinations
  const results = React.useMemo(() => {
    if (!debouncedSearch.trim()) return [];
    const q = debouncedSearch.trim().toLowerCase();
    return destinations
      .filter((d) => {
        return (
          d.name.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q) ||
          d.continent.toLowerCase().includes(q) ||
          d.travelStyle.toLowerCase().includes(q) ||
          d.categories.some((c) => c.toLowerCase().includes(q)) ||
          d.highlights.some((h) => h.toLowerCase().includes(q))
        );
      })
      .slice(0, 6);
  }, [debouncedSearch]);

  const handleSelectDestination = (dest) => {
    // Add to recent searches
    if (!recentSearches.includes(dest.name)) {
      setRecentSearches([dest.name, ...recentSearches.slice(0, 5)]);
    }
    closeSearch();
    navigate(`/destination/${dest.id}`);
  };

  const handleRecentClick = (term) => {
    setSearchTerm(term);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-[80] overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
            className="fixed inset-0 bg-primary-dark/85 backdrop-blur-xl"
          />

          {/* Search Content */}
          <div className="relative min-h-screen px-4 py-8 sm:py-16 max-w-3xl mx-auto flex flex-col">
            {/* Top Bar with ESC guide */}
            <div className="flex items-center justify-between text-white/60 mb-6 text-xs font-mono uppercase tracking-widest">
              <span>Quick Search</span>
              <button
                type="button"
                onClick={closeSearch}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <span>ESC</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Big Search Input Field */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative flex items-center bg-white/10 dark:bg-white/5 border border-white/20 rounded-2xl p-2 sm:p-3 shadow-2xl focus-within:border-highlight transition-colors"
            >
              <Search className="w-6 h-6 text-highlight ml-3 mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search destinations, countries, experiences..."
                className="w-full bg-transparent text-white placeholder:text-white/40 text-lg sm:text-xl font-heading font-medium focus:outline-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="p-2 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </motion.div>

            {/* Results or Recent Searches */}
            <div className="mt-8 flex-1">
              {results.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-highlight uppercase px-2">
                    <span>Destinations Found ({results.length})</span>
                    <span>Press destination to view</span>
                  </div>

                  <div className="grid gap-2.5">
                    {results.map((dest) => (
                      <motion.button
                        key={dest.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        type="button"
                        onClick={() => handleSelectDestination(dest)}
                        className="w-full p-3 sm:p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between text-left group"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={dest.image}
                            alt={dest.name}
                            className="w-14 h-14 rounded-lg object-cover"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-heading font-bold text-base sm:text-lg text-white group-hover:text-highlight transition-colors">
                                {dest.name}
                              </h4>
                              <span className="text-xs text-white/60">({dest.country})</span>
                            </div>
                            <p className="text-xs text-white/70 line-clamp-1 max-w-md mt-0.5">
                              {dest.shortDescription}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-right shrink-0">
                          <div className="hidden sm:block">
                            <span className="text-xs text-white/50 block">From</span>
                            <span className="text-sm font-bold text-white">
                              {formatCurrency(dest.averageDailyBudget, currency)}
                            </span>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-highlight group-hover:text-primary transition-all">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : debouncedSearch.trim() ? (
                <div className="text-center py-16 text-white/70">
                  <Compass className="w-12 h-12 mx-auto text-highlight mb-3 opacity-60" />
                  <p className="text-lg font-heading font-bold text-white">No places found for "{debouncedSearch}"</p>
                  <p className="text-sm text-white/60 mt-1">Try searching for Japan, Italy, Beach, or Nature</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-white/50 uppercase px-1 mb-3">
                        <span className="flex items-center gap-1.5">
                          <History className="w-3.5 h-3.5" />
                          Recent Searches
                        </span>
                        <button
                          type="button"
                          onClick={clearRecentSearches}
                          className="hover:text-white transition-colors"
                        >
                          Clear
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => handleRecentClick(term)}
                            className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors flex items-center gap-1.5"
                          >
                            <MapPin className="w-3 h-3 text-secondary" />
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular quick jump categories */}
                  <div>
                    <span className="block text-xs font-semibold tracking-wider text-white/50 uppercase px-1 mb-3">
                      Trending Moods
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {['Romantic', 'Adventure', 'Culture', 'Beach'].map((mood) => (
                        <button
                          key={mood}
                          type="button"
                          onClick={() => {
                            closeSearch();
                            navigate(`/explore?style=${mood}`);
                          }}
                          className="p-3.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-left transition-all"
                        >
                          <span className="block text-sm font-bold text-white">{mood}</span>
                          <span className="text-[11px] text-highlight">Discover places →</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
