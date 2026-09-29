import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Scale, X, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { destinations } from '../data/destinations';

export default function ComparePanel() {
  const { compareIds, removeFromCompare, clearCompare } = useApp();
  const navigate = useNavigate();

  if (compareIds.length === 0) return null;

  const comparedDestinations = compareIds
    .map((id) => destinations.find((d) => d.id === id))
    .filter(Boolean);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-xl bg-slate-900/95 backdrop-blur-xl border border-white/20 p-3 sm:p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 text-white"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center gap-1.5 shrink-0">
            <Scale className="w-5 h-5 text-secondary" />
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
              Compare ({comparedDestinations.length}/3)
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {comparedDestinations.map((dest) => (
              <div
                key={dest.id}
                className="flex items-center gap-1.5 pl-1.5 pr-1 py-1 rounded-lg bg-white/10 border border-white/10 text-xs shrink-0"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-5 h-5 rounded-md object-cover"
                />
                <span className="font-medium text-[11px] max-w-[80px] truncate">{dest.name}</span>
                <button
                  type="button"
                  onClick={() => removeFromCompare(dest.id)}
                  className="p-0.5 rounded text-white/60 hover:text-white hover:bg-white/20 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={clearCompare}
            className="text-xs text-white/50 hover:text-white px-2 py-1 transition-colors"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => navigate('/compare')}
            className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary-hover text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
