import React, { useState } from 'react';
import Modal from './Modal';
import { useTrip } from '../context/TripContext';
import { Plus, Check, Calendar, Users, MapPin } from 'lucide-react';

export default function TripBuilder({
  isOpen,
  onClose,
  destinationToAdd = null
}) {
  const { trips, activeTripId, setActiveTripId, addDestinationToTrip, createTrip } = useTrip();
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newTripName, setNewTripName] = useState('');
  const [newTripTravelers, setNewTripTravelers] = useState(2);
  const [newTripStartDate, setNewTripStartDate] = useState('');

  const handleSelectTrip = (tripId) => {
    if (destinationToAdd) {
      addDestinationToTrip(tripId, destinationToAdd.id);
    }
    setActiveTripId(tripId);
    onClose();
  };

  const handleCreateAndAdd = (e) => {
    e.preventDefault();
    if (!newTripName.trim()) return;

    const initialDestIds = destinationToAdd ? [destinationToAdd.id] : [];
    const created = createTrip({
      name: newTripName.trim(),
      travelers: Number(newTripTravelers) || 2,
      startDate: newTripStartDate,
      destinationIds: initialDestIds
    });

    setNewTripName('');
    setIsCreatingNew(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={destinationToAdd ? `Add ${destinationToAdd.name} to Trip` : "Manage Trips"}
      subtitle="Select an existing itinerary or start a brand new adventure."
      maxWidth="max-w-md"
    >
      {!isCreatingNew ? (
        <div className="space-y-4">
          <div className="space-y-2.5">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Existing Trips ({trips.length})
            </span>

            {trips.map((trip) => {
              const hasDestination = destinationToAdd && trip.destinationIds.includes(destinationToAdd.id);

              return (
                <button
                  key={trip.id}
                  type="button"
                  onClick={() => handleSelectTrip(trip.id)}
                  className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                    trip.id === activeTripId
                      ? 'border-secondary bg-secondary/5 dark:bg-secondary/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-aether-textMain dark:text-white">
                      {trip.name}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-aether-textMuted dark:text-slate-400 mt-1">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-secondary" />
                        {trip.destinationIds.length} places
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-accent" />
                        {trip.days?.length || 0} days
                      </span>
                    </div>
                  </div>

                  {hasDestination ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <Check className="w-3 h-3" />
                      Added
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-secondary hover:underline">
                      + Add here
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Button to show Create New form */}
          <button
            type="button"
            onClick={() => setIsCreatingNew(true)}
            className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-secondary text-aether-textMain dark:text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
          >
            <Plus className="w-4 h-4 text-secondary" />
            <span>Create New Journey</span>
          </button>
        </div>
      ) : (
        /* Create New Trip Form */
        <form onSubmit={handleCreateAndAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Trip Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Alpine Summer Escape 2026"
              value={newTripName}
              onChange={(e) => setNewTripName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-aether-textMain dark:text-white focus:outline-none focus:border-secondary text-sm"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={newTripStartDate}
                onChange={(e) => setNewTripStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-aether-textMain dark:text-white focus:outline-none focus:border-secondary text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Travelers
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={newTripTravelers}
                onChange={(e) => setNewTripTravelers(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-aether-textMain dark:text-white focus:outline-none focus:border-secondary text-xs"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-primary dark:bg-white text-white dark:text-primary text-xs font-bold hover:opacity-90 transition-opacity"
            >
              Create & Save
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
