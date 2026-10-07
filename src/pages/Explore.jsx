import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import SearchBar from '../components/SearchBar';
import DestinationGrid from '../components/DestinationGrid';
import FilterPanel from '../components/FilterPanel';
import TripBuilder from '../components/TripBuilder';
import Drawer from '../components/Drawer';
import CategoryPill from '../components/CategoryPill';
import { destinations } from '../data/destinations';
import { filterAndSortDestinations } from '../utils/filterDestinations';
import { travelStyles } from '../data/categories';
import { ArrowUpDown } from 'lucide-react';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial query params
  const initialStyle = searchParams.get('style') || 'All Styles';
  const initialSearch = searchParams.get('search') || '';

  const [filters, setFilters] = useState({
    search: initialSearch,
    continent: 'All Continents',
    country: 'All Countries',
    travelStyle: initialStyle,
    maxBudget: null,
    duration: 'All Durations',
    season: 'All Seasons',
    sortBy: 'trending'
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedDestinationForTrip, setSelectedDestinationForTrip] = useState(null);
  const [tripBuilderOpen, setTripBuilderOpen] = useState(false);

  // Sync when searchParams change
  useEffect(() => {
    const styleFromQuery = searchParams.get('style');
    if (styleFromQuery) {
      setFilters((prev) => (prev.travelStyle !== styleFromQuery ? { ...prev, travelStyle: styleFromQuery } : prev));
    }
  }, [searchParams]);

  // Compute filtered results
  const filteredDestinations = useMemo(() => {
    return filterAndSortDestinations(destinations, filters);
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.continent !== 'All Continents') count++;
    if (filters.country !== 'All Countries') count++;
    if (filters.travelStyle !== 'All Styles') count++;
    if (filters.maxBudget !== null) count++;
    if (filters.duration !== 'All Durations') count++;
    if (filters.season !== 'All Seasons') count++;
    return count;
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      continent: 'All Continents',
      country: 'All Countries',
      travelStyle: 'All Styles',
      maxBudget: null,
      duration: 'All Durations',
      season: 'All Seasons',
      sortBy: 'trending'
    });
    setSearchParams({});
  };

  const handleAddToTrip = (destination) => {
    setSelectedDestinationForTrip(destination);
    setTripBuilderOpen(true);
  };

  return (
    <div className="min-h-screen pt-28 pb-24 bg-aether-bgLight dark:bg-aether-bgDark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <SectionHeader
          badge="EXPEDITION CATALOGUE"
          title="EXPLORE THE WORLD"
          subtitle="Search by continent, budget, travel mood, and seasonal climate across our hand-selected sanctuaries."
        />

        {/* Search Bar & Primary Controls */}
        <div className="mb-6">
          <SearchBar
            value={filters.search}
            onChange={(val) => setFilters({ ...filters, search: val })}
            onClear={() => setFilters({ ...filters, search: '' })}
            onToggleFilter={() => setMobileFilterOpen(true)}
            filterCount={activeFilterCount}
            placeholder="Search Kyoto, Dolomites, Amalfi Coast, Beaches, Winter..."
          />
        </div>

        {/* Quick Style Chips Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-8">
          {travelStyles.map((style) => (
            <CategoryPill
              key={style}
              label={style}
              active={filters.travelStyle === style}
              onClick={() => {
                setFilters({ ...filters, travelStyle: style });
                if (style === 'All Styles') {
                  searchParams.delete('style');
                  setSearchParams(searchParams);
                } else {
                  setSearchParams({ style });
                }
              }}
            />
          ))}
        </div>

        {/* Layout: Desktop Sidebar Filters + Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Panel */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 rounded-2xl bg-white dark:bg-surface-cardDark border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Main Destination Results Area */}
          <main className="lg:col-span-9">
            {/* Sort & Count Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <div>
                Showing <span className="font-bold text-aether-textMain dark:text-white">{filteredDestinations.length}</span> destinations
                {activeFilterCount > 0 && <span> (filtered)</span>}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-secondary" />
                <span>Sort by:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="bg-transparent font-bold text-aether-textMain dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="trending" className="dark:bg-slate-900">Trending Now</option>
                  <option value="rating" className="dark:bg-slate-900">Highest Rated</option>
                  <option value="budget-low" className="dark:bg-slate-900">Lowest Daily Budget</option>
                  <option value="budget-high" className="dark:bg-slate-900">Highest Daily Budget</option>
                  <option value="duration-short" className="dark:bg-slate-900">Shortest Trip</option>
                  <option value="duration-long" className="dark:bg-slate-900">Longest Trip</option>
                  <option value="name" className="dark:bg-slate-900">Alphabetical</option>
                </select>
              </div>
            </div>

            {/* Destination Grid */}
            <DestinationGrid
              destinations={filteredDestinations}
              onAddToTrip={handleAddToTrip}
              showCompare
              emptyMessage="Try clearing some filters or searching for another country or style."
              onResetFilters={handleResetFilters}
            />
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <Drawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title="Filter Discoveries"
        subtitle="Refine places by region, budget, and season."
        position="left"
      >
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
        />
        <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(false)}
            className="w-full py-3 rounded-xl bg-secondary text-white text-xs font-bold uppercase tracking-wider shadow-md"
          >
            Show {filteredDestinations.length} Places
          </button>
        </div>
      </Drawer>

      {/* Trip Builder Modal */}
      <TripBuilder
        isOpen={tripBuilderOpen}
        onClose={() => setTripBuilderOpen(false)}
        destinationToAdd={selectedDestinationForTrip}
      />
    </div>
  );
}
