import React, { useState, useMemo } from 'react';
import SectionHeader from '../components/SectionHeader';
import MapExplorer from '../components/MapExplorer';
import TripBuilder from '../components/TripBuilder';
import SearchBar from '../components/SearchBar';
import { destinations } from '../data/destinations';
import { continents, travelStyles } from '../data/categories';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatCurrency';
import { Compass, MapPin, SlidersHorizontal, Star, ArrowUpRight } from 'lucide-react';

export default function MapPage() {
  const { currency } = useApp();
  const [search, setSearch] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('All Continents');
  const [selectedStyle, setSelectedStyle] = useState('All Styles');
  const [focusedDestId, setFocusedDestId] = useState(1);
  const [tripBuilderOpen, setTripBuilderOpen] = useState(false);
  const [destinationToAdd, setDestinationToAdd] = useState(null);

  const filteredDestinations = useMemo(() => {
    return destinations.filter((d) => {
      if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.country.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (selectedContinent !== 'All Continents' && d.continent !== selectedContinent) {
        return false;
      }
      if (selectedStyle !== 'All Styles' && d.travelStyle !== selectedStyle) {
        return false;
      }
      return true;
    });
  }, [search, selectedContinent, selectedStyle]);

  const handleAddToTrip = (dest) => {
    setDestinationToAdd(dest);
    setTripBuilderOpen(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-aether-bgLight dark:bg-aether-bgDark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-secondary block mb-1">
              Geographic Cartography
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-aether-textMain dark:text-white">
              INTERACTIVE WORLD MAP
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Pulse markers pinpoint curated sanctuaries across 7 continents. Click any beacon to preview.
            </p>
          </div>
        </div>

        {/* 2-Column Explorer: Left Sidebar List + Right Full Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Discovery Sidebar */}
          <div className="lg:col-span-4 rounded-2xl bg-white dark:bg-surface-cardDark border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-4 max-h-[750px] flex flex-col">
            <div className="shrink-0 space-y-3">
              <SearchBar
                value={search}
                onChange={setSearch}
                onClear={() => setSearch('')}
                placeholder="Find city or country..."
              />

              <div className="flex gap-2">
                <select
                  value={selectedContinent}
                  onChange={(e) => setSelectedContinent(e.target.value)}
                  className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated text-xs font-semibold focus:outline-none"
                >
                  {continents.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated text-xs font-semibold focus:outline-none"
                >
                  {travelStyles.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex justify-between px-1">
                <span>Locations ({filteredDestinations.length})</span>
                <span>Select to Focus</span>
              </div>
            </div>

            {/* Scrollable list of matched destinations */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
              {filteredDestinations.map((dest) => {
                const isFocused = focusedDestId === dest.id;

                return (
                  <div
                    key={dest.id}
                    onClick={() => setFocusedDestId(dest.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isFocused
                        ? 'border-secondary bg-secondary/10 shadow-xs'
                        : 'border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-heading font-bold text-xs sm:text-sm text-aether-textMain dark:text-white truncate">
                          {dest.name}
                        </h4>
                        <span className="text-[11px] text-slate-400 block truncate">
                          {dest.country} · {dest.continent}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-secondary block">
                        {formatCurrency(dest.averageDailyBudget, currency)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {dest.temperature}°C
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Map Canvas */}
          <div className="lg:col-span-8">
            <MapExplorer
              onAddToTrip={handleAddToTrip}
              selectedId={focusedDestId}
            />
          </div>
        </div>
      </div>

      {/* Trip Builder Modal */}
      <TripBuilder
        isOpen={tripBuilderOpen}
        onClose={() => setTripBuilderOpen(false)}
        destinationToAdd={destinationToAdd}
      />
    </div>
  );
}
