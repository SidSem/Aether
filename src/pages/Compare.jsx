import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import Modal from '../components/Modal';
import { useApp } from '../context/AppContext';
import { destinations } from '../data/destinations';
import { formatCurrency } from '../utils/formatCurrency';
import {
  Scale,
  Plus,
  X,
  Star,
  DollarSign,
  Clock,
  CloudSun,
  Calendar,
  Compass,
  ArrowRight
} from 'lucide-react';

export default function Compare() {
  const navigate = useNavigate();
  const { compareIds, removeFromCompare, addToCompare, currency } = useApp();
  const [selectModalOpen, setSelectModalOpen] = useState(false);

  const selectedDestinations = compareIds
    .map((id) => destinations.find((d) => d.id === id))
    .filter(Boolean);

  const availableDestinations = destinations.filter(
    (d) => !compareIds.includes(d.id)
  );

  return (
    <div className="min-h-screen pt-28 pb-24 bg-aether-bgLight dark:bg-aether-bgDark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <SectionHeader
          badge="SIDE-BY-SIDE EVALUATION"
          title="COMPARE DESTINATIONS"
          subtitle="Evaluate daily costs, optimal seasons, climate ratings, and activity offerings for up to 3 places."
          action={
            selectedDestinations.length < 3 ? (
              <button
                type="button"
                onClick={() => setSelectModalOpen(true)}
                className="px-4 py-2.5 rounded-full bg-secondary hover:bg-secondary-hover text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Destination ({selectedDestinations.length}/3)</span>
              </button>
            ) : null
          }
        />

        {selectedDestinations.length > 0 ? (
          <div className="overflow-x-auto custom-scrollbar pb-6">
            <div className="min-w-[700px] rounded-3xl bg-white dark:bg-surface-cardDark border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              
              {/* Header Row: Images & Names */}
              <div className="grid grid-cols-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                <div className="p-6 flex flex-col justify-end font-bold text-xs uppercase tracking-wider text-slate-400">
                  Feature Matrix
                </div>

                {selectedDestinations.map((dest) => (
                  <div key={dest.id} className="p-5 relative group border-l border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => removeFromCompare(dest.id)}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/90 transition-colors z-10"
                      title="Remove from comparison"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    <div className="relative h-44 rounded-xl overflow-hidden mb-3">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-black/40 px-2 py-0.5 rounded backdrop-blur-md">
                          {dest.country}
                        </span>
                      </div>
                    </div>

                    <h4 className="font-heading font-bold text-lg text-aether-textMain dark:text-white mb-1">
                      {dest.name}
                    </h4>

                    <Link
                      to={`/destination/${dest.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:underline"
                    >
                      <span>View details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}

                {/* Empty slot placeholders */}
                {Array.from({ length: 3 - selectedDestinations.length }).map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectModalOpen(true)}
                    className="p-6 border-l border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors min-h-[220px]"
                  >
                    <div className="w-10 h-10 rounded-full border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 mb-2">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Add to Compare
                    </span>
                  </div>
                ))}
              </div>

              {/* Rows */}
              {[
                {
                  label: 'Average Daily Cost',
                  icon: DollarSign,
                  getValue: (d) => (
                    <span className="font-bold text-secondary text-sm">
                      {formatCurrency(d.averageDailyBudget, currency)} / day
                    </span>
                  )
                },
                {
                  label: 'Traveler Rating',
                  icon: Star,
                  getValue: (d) => (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-bold">{d.rating.toFixed(1)}</span>
                      <span className="text-xs text-slate-400">({d.reviews})</span>
                    </div>
                  )
                },
                {
                  label: 'Best Season',
                  icon: Calendar,
                  getValue: (d) => <span className="font-medium">{d.bestSeason}</span>
                },
                {
                  label: 'Average Climate',
                  icon: CloudSun,
                  getValue: (d) => <span className="font-medium">{d.temperature}°C Average</span>
                },
                {
                  label: 'Travel Style',
                  icon: Compass,
                  getValue: (d) => (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-surface-elevated text-aether-textMain dark:text-white">
                      {d.travelStyle}
                    </span>
                  )
                },
                {
                  label: 'Recommended Stay',
                  icon: Clock,
                  getValue: (d) => <span className="font-medium">{d.idealStay || `${d.duration} Days`}</span>
                },
                {
                  label: 'Top Highlights',
                  icon: Scale,
                  getValue: (d) => (
                    <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                      {d.highlights?.slice(0, 3).map((h, idx) => (
                        <li key={idx}>• {h}</li>
                      ))}
                    </ul>
                  )
                }
              ].map((row, rowIdx) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-4 text-xs sm:text-sm border-b border-slate-100 dark:border-slate-800/80 ${
                    rowIdx % 2 === 0 ? 'bg-white dark:bg-surface-cardDark' : 'bg-slate-50/30 dark:bg-slate-900/20'
                  }`}
                >
                  <div className="p-4 sm:p-5 font-semibold text-slate-400 flex items-center gap-2">
                    <row.icon className="w-4 h-4 text-secondary shrink-0" />
                    <span>{row.label}</span>
                  </div>

                  {selectedDestinations.map((dest) => (
                    <div
                      key={dest.id}
                      className="p-4 sm:p-5 border-l border-slate-100 dark:border-slate-800/80 text-aether-textMain dark:text-white flex items-center"
                    >
                      {row.getValue(dest)}
                    </div>
                  ))}

                  {/* Empty cell fill */}
                  {Array.from({ length: 3 - selectedDestinations.length }).map((_, i) => (
                    <div
                      key={i}
                      className="p-4 sm:p-5 border-l border-slate-100 dark:border-slate-800/80 text-slate-300 dark:text-slate-700 text-center"
                    >
                      —
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-24 text-center max-w-md mx-auto px-4 bg-white/40 dark:bg-surface-cardDark/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <Scale className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-bold font-heading uppercase text-aether-textMain dark:text-white mb-2">
              No destinations in comparison
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
              Pick up to 3 places to compare budgets, weather, seasons, and highlights side-by-side.
            </p>
            <button
              type="button"
              onClick={() => setSelectModalOpen(true)}
              className="px-6 py-3 rounded-full bg-secondary text-white text-xs font-bold uppercase tracking-wider shadow"
            >
              Choose Destinations
            </button>
          </div>
        )}
      </div>

      {/* Select Destination Modal */}
      <Modal
        isOpen={selectModalOpen}
        onClose={() => setSelectModalOpen(false)}
        title="Add to Comparison"
        subtitle="Choose a place from our catalog to benchmark."
        maxWidth="max-w-xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
          {availableDestinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => {
                addToCompare(dest.id);
                setSelectModalOpen(false);
              }}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-secondary hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-3 transition-all"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-12 h-12 rounded-lg object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-heading font-bold text-xs sm:text-sm text-aether-textMain dark:text-white truncate">
                  {dest.name}
                </h4>
                <span className="text-[11px] text-slate-400 block truncate">
                  {dest.country} · {dest.continent}
                </span>
                <span className="text-xs font-bold text-secondary">
                  {formatCurrency(dest.averageDailyBudget, currency)}/day
                </span>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
