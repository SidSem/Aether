import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MapMarker from './MapMarker';
import { destinations } from '../data/destinations';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatCurrency';
import { Plus, ArrowUpRight, ZoomIn, ZoomOut, RotateCcw, CloudSun, Star } from 'lucide-react';

// Continent ViewBox presets for quick zoom
const REGION_VIEWS = {
  all: { x: 0, y: 0, width: 1000, height: 500, label: 'Global' },
  europe: { x: 420, y: 80, width: 280, height: 180, label: 'Europe' },
  asia: { x: 600, y: 100, width: 340, height: 240, label: 'Asia' },
  americas: { x: 100, y: 70, width: 380, height: 350, label: 'Americas' },
  africa: { x: 420, y: 180, width: 260, height: 240, label: 'Africa' },
  oceania: { x: 740, y: 260, width: 240, height: 180, label: 'Oceania' },
};

export default function MapExplorer({
  onAddToTrip = null,
  embedded = false,
  selectedId = null
}) {
  const navigate = useNavigate();
  const { currency } = useApp();
  const [activeRegion, setActiveRegion] = useState('all');
  const [selectedDestination, setSelectedDestination] = useState(() => {
    return selectedId ? destinations.find((d) => d.id === selectedId) : destinations[0];
  });
  const [hoveredData, setHoveredData] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Projection formula: Equirectangular SVG (1000 x 500)
  const getCoordinates = (lat, lng) => {
    const x = ((lng + 180) / 360) * 1000;
    const y = ((90 - lat) / 180) * 500;
    return { x, y };
  };

  const currentView = REGION_VIEWS[activeRegion] || REGION_VIEWS.all;

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.3, 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.3, 0.8));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setActiveRegion('all');
  };

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden border border-slate-700/60 bg-primary-dark shadow-2xl flex flex-col ${embedded ? 'h-[580px]' : 'h-[calc(100vh-140px)] min-h-[600px]'}`}>
      
      {/* Top Map Toolbar: Continent Selectors & Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Continent Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 pointer-events-auto overflow-x-auto no-scrollbar max-w-full">
          {Object.keys(REGION_VIEWS).map((regionKey) => (
            <button
              key={regionKey}
              type="button"
              onClick={() => {
                setActiveRegion(regionKey);
                setZoomLevel(1);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-full tracking-wider uppercase transition-all ${
                activeRegion === regionKey
                  ? 'bg-secondary text-white shadow'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {REGION_VIEWS[regionKey].label}
            </button>
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 pointer-events-auto">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Reset map view"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Stylized Map Display */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing bg-[#081b2e]">
        <svg
          viewBox={`${currentView.x} ${currentView.y} ${currentView.width} ${currentView.height}`}
          className="w-full h-full transition-all duration-700 ease-in-out"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            {/* Gradients */}
            <radialGradient id="oceanGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0b2844" />
              <stop offset="100%" stopColor="#071829" />
            </radialGradient>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* Ocean Background */}
          <rect width="1000" height="500" fill="url(#oceanGlow)" />
          <rect width="1000" height="500" fill="url(#grid)" />

          {/* Latitude Lines */}
          <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(86,204,242,0.12)" strokeDasharray="3,3" strokeWidth="0.8" /> {/* Equator */}
          <line x1="0" y1="125" x2="1000" y2="125" stroke="rgba(255,255,255,0.05)" strokeDasharray="2,2" strokeWidth="0.5" />
          <line x1="0" y1="375" x2="1000" y2="375" stroke="rgba(255,255,255,0.05)" strokeDasharray="2,2" strokeWidth="0.5" />

          {/* Stylized Continents Landmass Shapes */}
          <g fill="#123456" stroke="#1b4975" strokeWidth="1" opacity="0.95">
            {/* North America */}
            <path d="M 120 70 Q 180 50 250 80 Q 280 110 240 180 Q 210 210 190 240 Q 150 220 130 180 Q 90 140 120 70 Z" />
            <path d="M 190 240 L 220 280 L 210 300 L 190 270 Z" /> {/* Central America */}

            {/* South America */}
            <path d="M 220 300 Q 290 310 300 370 Q 280 430 250 480 Q 220 460 210 380 Q 200 330 220 300 Z" />

            {/* Europe */}
            <path d="M 440 80 Q 520 70 540 120 Q 510 150 480 160 Q 440 150 430 120 Z" />
            <path d="M 410 100 Q 430 100 420 120 Z" /> {/* UK */}

            {/* Africa */}
            <path d="M 450 170 Q 550 170 560 240 Q 540 330 500 380 Q 460 360 440 270 Q 430 210 450 170 Z" />

            {/* Asia */}
            <path d="M 540 80 Q 750 60 850 120 Q 890 200 820 250 Q 730 280 670 240 Q 600 230 560 170 Z" />
            <path d="M 660 240 Q 700 240 680 300 Q 640 270 660 240 Z" /> {/* India */}

            {/* Japan */}
            <path d="M 860 160 Q 880 170 870 210 Q 850 200 860 160 Z" />

            {/* Oceania / Australia */}
            <path d="M 760 330 Q 860 320 870 380 Q 830 420 770 410 Q 730 370 760 330 Z" />
            <path d="M 880 400 Q 900 410 890 440 Z" /> {/* New Zealand */}
          </g>

          {/* Destination Markers */}
          {destinations.map((dest) => {
            const { x, y } = getCoordinates(dest.coordinates.lat, dest.coordinates.lng);
            const isSelected = selectedDestination?.id === dest.id;

            return (
              <MapMarker
                key={dest.id}
                destination={dest}
                x={x}
                y={y}
                isSelected={isSelected}
                onClick={(d) => setSelectedDestination(d)}
                onHover={(d, mx, my) => setHoveredData({ dest: d, x: mx, y: my })}
                onLeave={() => setHoveredData(null)}
              />
            );
          })}
        </svg>
      </div>

      {/* Floating Hover Tooltip */}
      <AnimatePresence>
        {hoveredData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-16 left-6 z-30 pointer-events-none bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-highlight/40 text-white shadow-xl"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-highlight">{hoveredData.dest.name}</span>
              <span className="text-xs text-slate-300">· {hoveredData.dest.country}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Avg. {formatCurrency(hoveredData.dest.averageDailyBudget, currency)}/day · {hoveredData.dest.temperature}°C
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Selected Destination Preview Panel */}
      {selectedDestination && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 z-20 max-w-xl mx-auto bg-slate-900/90 backdrop-blur-xl border border-white/15 p-4 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <img
              src={selectedDestination.image}
              alt={selectedDestination.name}
              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold font-heading text-white">
                  {selectedDestination.name}
                </h4>
                <span className="text-xs text-white/60">({selectedDestination.country})</span>
              </div>
              <p className="text-xs text-white/70 line-clamp-1 max-w-xs mt-0.5">
                {selectedDestination.tagline || selectedDestination.shortDescription}
              </p>
              <div className="flex items-center gap-3 text-xs text-highlight font-medium mt-1">
                <span>{formatCurrency(selectedDestination.averageDailyBudget, currency)} / day</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <CloudSun className="w-3 h-3 text-amber-400" />
                  {selectedDestination.temperature}°C
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  {selectedDestination.rating}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onAddToTrip && (
              <button
                type="button"
                onClick={() => onAddToTrip(selectedDestination)}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5 text-highlight" />
                <span>Trip</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => navigate(`/destination/${selectedDestination.id}`)}
              className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary-hover text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <span>Explore</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
