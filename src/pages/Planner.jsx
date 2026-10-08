import React, { useState } from 'react';
import ItineraryDay from '../components/ItineraryDay';
import BudgetBreakdown from '../components/BudgetBreakdown';
import BudgetCard from '../components/BudgetCard';
import Modal from '../components/Modal';
import { useTrip } from '../context/TripContext';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatCurrency';
import { activities as allActivities } from '../data/activities';
import {
  Calendar,
  Users,
  Plus,
  Compass,
  MapPin,
  Trash2,
  Share2,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Planner() {
  const {
    trips,
    activeTripId,
    setActiveTripId,
    activeTrip,
    activeTripDestinations,
    activeTripBudget,
    activeTripBudgetBreakdown,
    createTrip,
    deleteTrip,
    updateTrip,
    removeDestinationFromTrip,
    addDayToTrip,
    removeDayFromTrip,
    addActivityToDay,
    addCustomActivityToDay,
    removeActivityFromDay,
    reorderDayActivities,
    setActivitySlot,
    updateDayTitle
  } = useTrip();

  const { currency, addToast } = useApp();

  // Modals & form state
  const [newTripModalOpen, setNewTripModalOpen] = useState(false);
  const [newTripName, setNewTripName] = useState('');
  const [newTripTravelers, setNewTripTravelers] = useState(2);
  const [newTripStartDate, setNewTripStartDate] = useState('');

  // Activity picker modal state
  const [activityPickerState, setActivityPickerState] = useState(null); // { dayIndex, destinationId, preferredSlot }
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Custom Event modal state
  const [customEventModalState, setCustomEventModalState] = useState(null); // { dayIndex, destinationId }
  const [customEventForm, setCustomEventForm] = useState({
    title: '',
    slot: 'morning',
    category: 'Sightseeing',
    duration: '2 hrs',
    price: 0,
    description: ''
  });

  // Trip switcher handler
  const handleSelectTrip = (id) => {
    setActiveTripId(id);
  };

  const handleCreateTripSubmit = (e) => {
    e.preventDefault();
    if (!newTripName.trim()) return;

    createTrip({
      name: newTripName.trim(),
      travelers: Number(newTripTravelers) || 2,
      startDate: newTripStartDate,
      destinationIds: [1] // default Kyoto
    });

    setNewTripName('');
    setNewTripModalOpen(false);
  };

  const handleOpenActivitySelector = (dayIndex, destinationId, preferredSlot = 'morning') => {
    setActivityPickerState({ dayIndex, destinationId, preferredSlot });
  };

  const handleSelectActivityForDay = (actId) => {
    if (activityPickerState) {
      addActivityToDay(
        activeTrip.id,
        activityPickerState.dayIndex,
        actId,
        activityPickerState.preferredSlot || 'morning'
      );
      setActivityPickerState(null);
    }
  };

  const handleOpenCustomEventModal = (dayIndex, destinationId, slot = 'morning') => {
    setCustomEventForm({
      title: '',
      slot,
      category: 'Sightseeing',
      duration: '2 hrs',
      price: 0,
      description: ''
    });
    setCustomEventModalState({ dayIndex, destinationId });
  };

  const handleCreateCustomEventSubmit = (e) => {
    e.preventDefault();
    if (!customEventForm.title.trim() || !customEventModalState) return;

    addCustomActivityToDay(activeTrip.id, customEventModalState.dayIndex, {
      title: customEventForm.title.trim(),
      timeOfDay: customEventForm.slot,
      category: customEventForm.category,
      duration: customEventForm.duration || '2 hrs',
      price: Number(customEventForm.price) || 0,
      description: customEventForm.description.trim()
    });

    setCustomEventModalState(null);
  };

  const handleSetActivitySlot = (dayIndex, actId, slot) => {
    setActivitySlot(activeTrip.id, dayIndex, actId, slot);
  };

  const handleUpdateDayTitle = (dayIndex, newTitle) => {
    updateDayTitle(activeTrip.id, dayIndex, newTitle);
  };

  const handleMoveActivityUp = (dayIndex, actIndex) => {
    const currentDay = activeTrip.days[dayIndex];
    if (!currentDay || actIndex === 0) return;
    const newOrder = [...currentDay.activityIds];
    const [moved] = newOrder.splice(actIndex, 1);
    newOrder.splice(actIndex - 1, 0, moved);
    reorderDayActivities(activeTrip.id, dayIndex, newOrder);
  };

  const handleMoveActivityDown = (dayIndex, actIndex) => {
    const currentDay = activeTrip.days[dayIndex];
    if (!currentDay || actIndex >= currentDay.activityIds.length - 1) return;
    const newOrder = [...currentDay.activityIds];
    const [moved] = newOrder.splice(actIndex, 1);
    newOrder.splice(actIndex + 1, 0, moved);
    reorderDayActivities(activeTrip.id, dayIndex, newOrder);
  };

  const handleExportPlan = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
    setExportModalOpen(true);
  };

  if (!activeTrip) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold font-heading mb-3">Start Planning Your Next Journey</h2>
        <p className="text-slate-500 mb-6">Create a trip to build custom day-by-day itineraries.</p>
        <button
          type="button"
          onClick={() => setNewTripModalOpen(true)}
          className="px-6 py-3 rounded-full bg-secondary text-white font-bold text-xs uppercase tracking-wider"
        >
          Create First Trip
        </button>
      </div>
    );
  }

  // Available activities for picker modal
  const availableActivitiesForPicker = activityPickerState
    ? allActivities.filter((a) => a.destinationId === activityPickerState.destinationId)
    : [];

  return (
    <div className="min-h-screen pt-28 pb-24 bg-aether-bgLight dark:bg-aether-bgDark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Strip: Title, Trip Switcher & Create Trip */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary dark:bg-secondary/20 dark:text-highlight text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Itinerary Engine</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-heading text-aether-textMain dark:text-white uppercase tracking-tight">
              BUILD YOUR JOURNEY
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Curate day-by-day moments, customize group travelers, and calibrate real-time budgets.
            </p>
          </div>

          {/* Trip Selector & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={activeTripId}
              onChange={(e) => handleSelectTrip(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated font-heading font-bold text-xs sm:text-sm text-aether-textMain dark:text-white shadow-xs focus:outline-none focus:border-secondary cursor-pointer"
            >
              {trips.map((t) => (
                <option key={t.id} value={t.id} className="dark:bg-slate-900">
                  {t.name} ({t.days?.length || 0} Days)
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setNewTripModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-surface-cardDark hover:border-secondary border border-slate-200 dark:border-slate-700 text-xs font-bold text-aether-textMain dark:text-white flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Plus className="w-4 h-4 text-secondary" />
              <span>New Journey</span>
            </button>

            <button
              type="button"
              onClick={handleExportPlan}
              className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Active Journey Overview Ribbon */}
        <div className="rounded-3xl bg-white dark:bg-surface-cardDark border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm mb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left Trip Info */}
            <div className="md:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  value={activeTrip.name}
                  onChange={(e) => updateTrip(activeTrip.id, { name: e.target.value })}
                  className="text-2xl sm:text-3xl font-extrabold font-heading text-aether-textMain dark:text-white bg-transparent border-b border-dashed border-transparent hover:border-slate-300 focus:border-secondary focus:outline-none transition-colors"
                />
              </div>

              {/* Destinations Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1">
                  Places ({activeTripDestinations.length}):
                </span>
                {activeTripDestinations.map((dest) => (
                  <span
                    key={dest.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-surface-elevated text-aether-textMain dark:text-white border border-slate-200 dark:border-slate-700 shadow-2xs"
                  >
                    <MapPin className="w-3.5 h-3.5 text-secondary" />
                    <span>{dest.name}</span>
                    {activeTripDestinations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDestinationFromTrip(activeTrip.id, dest.id)}
                        className="text-slate-400 hover:text-red-500 ml-1"
                        title="Remove destination"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400 pt-2 font-medium">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-secondary" />
                  <span>Duration: <strong className="text-aether-textMain dark:text-white">{activeTrip.days?.length || 0} Days</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-accent" />
                  <span>Travelers: <strong className="text-aether-textMain dark:text-white">{activeTrip.travelers || 1}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span>Base Currency: <strong className="text-aether-textMain dark:text-white">{currency}</strong></span>
                </div>
              </div>
            </div>

            {/* Right Summary Card */}
            <div className="md:col-span-4">
              <BudgetCard
                totalAmount={activeTripBudget}
                averageDaily={Math.round(activeTripBudget / Math.max(1, activeTrip.days?.length || 1))}
                travelers={activeTrip.travelers || 1}
                days={activeTrip.days?.length || 1}
              />
            </div>
          </div>
        </div>

        {/* 2-Column Section: Day-by-Day Itinerary Left + Budget Breakdown Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Day-by-day Itinerary (8 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="text-xl font-bold font-heading text-aether-textMain dark:text-white">
                  Trip Schedule & Activities
                </h3>
                <p className="text-xs text-slate-400">
                  Organize daily milestones, reorder activities, and attach authentic local tours.
                </p>
              </div>

              <button
                type="button"
                onClick={() => addDayToTrip(activeTrip.id)}
                className="px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary-hover text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Day</span>
              </button>
            </div>

            {/* Days Timeline */}
            <div className="pt-2">
              {activeTrip.days?.map((day, idx) => (
                <ItineraryDay
                  key={`${day.dayNumber}-${idx}`}
                  day={day}
                  dayIndex={idx}
                  totalDays={activeTrip.days.length}
                  onRemoveDay={(dIdx) => removeDayFromTrip(activeTrip.id, dIdx)}
                  onRemoveActivity={(dIdx, actId) => removeActivityFromDay(activeTrip.id, dIdx, actId)}
                  onMoveActivityUp={handleMoveActivityUp}
                  onMoveActivityDown={handleMoveActivityDown}
                  onOpenActivitySelector={handleOpenActivitySelector}
                  onOpenCustomEventModal={handleOpenCustomEventModal}
                  onSetActivitySlot={handleSetActivitySlot}
                  onUpdateDayTitle={handleUpdateDayTitle}
                />
              ))}
            </div>

            {/* Bottom Add Day bar */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => addDayToTrip(activeTrip.id)}
                className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-secondary hover:border-secondary flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-all"
              >
                <Plus className="w-4 h-4 text-secondary" />
                <span>Extend Journey by Another Day</span>
              </button>
            </div>
          </div>

          {/* Interactive Budget Calculator & Allocations (5 Columns) */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <BudgetBreakdown
              totalBudget={activeTripBudget}
              travelers={activeTrip.travelers || 2}
              onUpdateTravelers={(num) => updateTrip(activeTrip.id, { travelers: num })}
              breakdown={activeTripBudgetBreakdown}
            />

            {/* Delete Trip Safety Action */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-cardDark flex items-center justify-between text-xs text-slate-400">
              <span>Manage Journey State</span>
              {trips.length > 1 && (
                <button
                  type="button"
                  onClick={() => deleteTrip(activeTrip.id)}
                  className="text-red-500 hover:text-red-600 font-semibold flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Trip</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Selector Modal */}
      {activityPickerState && (
        <Modal
          isOpen={Boolean(activityPickerState)}
          onClose={() => setActivityPickerState(null)}
          title={`Experiences for Day ${activityPickerState.dayIndex + 1}`}
          subtitle="Choose curated tours and cultural walks to schedule."
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            {availableActivitiesForPicker.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {availableActivitiesForPicker.map((act) => (
                  <div
                    key={act.id}
                    onClick={() => handleSelectActivityForDay(act.id)}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-secondary hover:bg-secondary/5 dark:hover:bg-secondary/10 cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                        {act.category} · {act.duration}
                      </span>
                      <h4 className="font-heading font-bold text-sm text-aether-textMain dark:text-white mt-1">
                        {act.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                        {act.description}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-secondary">
                        {act.price === 0 ? 'Free' : formatCurrency(act.price, currency)}
                      </span>
                      <span className="text-xs font-bold text-secondary hover:underline">
                        + Select
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400">
                <p className="text-sm">No specialized activities found for this destination.</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Create New Trip Modal */}
      <Modal
        isOpen={newTripModalOpen}
        onClose={() => setNewTripModalOpen(false)}
        title="Create New Journey"
        subtitle="Start fresh with a dedicated itinerary and budget."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateTripSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Journey Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Nordic Fjords 2026"
              value={newTripName}
              onChange={(e) => setNewTripName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm text-aether-textMain dark:text-white focus:outline-none focus:border-secondary"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Departure Date
              </label>
              <input
                type="date"
                value={newTripStartDate}
                onChange={(e) => setNewTripStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs text-aether-textMain dark:text-white focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Travelers
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={newTripTravelers}
                onChange={(e) => setNewTripTravelers(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs text-aether-textMain dark:text-white focus:outline-none focus:border-secondary"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setNewTripModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-secondary text-white text-xs font-bold uppercase tracking-wider shadow"
            >
              Create Itinerary
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Custom Event Modal */}
      {customEventModalState && (
        <Modal
          isOpen={Boolean(customEventModalState)}
          onClose={() => setCustomEventModalState(null)}
          title={`Custom Event for Day ${customEventModalState.dayIndex + 1}`}
          subtitle="Schedule a personalized experience, reservation, or transit."
          maxWidth="max-w-md"
        >
          <form onSubmit={handleCreateCustomEventSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Event Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sunset Rooftop Aperitivo at Positano"
                value={customEventForm.title}
                onChange={(e) => setCustomEventForm({ ...customEventForm, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm text-aether-textMain dark:text-white focus:outline-none focus:border-secondary"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Time of Day
                </label>
                <select
                  value={customEventForm.slot}
                  onChange={(e) => setCustomEventForm({ ...customEventForm, slot: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs text-aether-textMain dark:text-white focus:outline-none focus:border-secondary"
                >
                  <option value="morning">🌅 Morning</option>
                  <option value="afternoon">☀️ Afternoon</option>
                  <option value="evening">🌙 Evening</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Category
                </label>
                <select
                  value={customEventForm.category}
                  onChange={(e) => setCustomEventForm({ ...customEventForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs text-aether-textMain dark:text-white focus:outline-none focus:border-secondary"
                >
                  <option value="Sightseeing">Sightseeing</option>
                  <option value="Dining">Dining</option>
                  <option value="Culture">Culture</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Leisure">Leisure</option>
                  <option value="Transport">Transport</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Duration
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2 hrs"
                  value={customEventForm.duration}
                  onChange={(e) => setCustomEventForm({ ...customEventForm, duration: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs text-aether-textMain dark:text-white focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Cost per person
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  placeholder="0"
                  value={customEventForm.price}
                  onChange={(e) => setCustomEventForm({ ...customEventForm, price: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs text-aether-textMain dark:text-white focus:outline-none focus:border-secondary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Description / Notes
              </label>
              <textarea
                rows="2"
                placeholder="Optional reservation details, location, or notes..."
                value={customEventForm.description}
                onChange={(e) => setCustomEventForm({ ...customEventForm, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs text-aether-textMain dark:text-white focus:outline-none focus:border-secondary resize-none"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCustomEventModalState(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-secondary text-white text-xs font-bold uppercase tracking-wider shadow"
              >
                Add to Itinerary
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Export / Share Modal */}
      <Modal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="Voyage Plan Ready"
        subtitle={`Summary for "${activeTrip.name}"`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-center py-2">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="font-heading font-bold text-lg text-aether-textMain dark:text-white">
            {activeTrip.name}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {activeTrip.days?.length || 0} Days across {activeTripDestinations.map(d => d.name).join(', ')}. <br />
            Total estimated budget: <strong className="text-secondary">{formatCurrency(activeTripBudget, currency)}</strong>.
          </p>

          <div className="p-3 bg-slate-50 dark:bg-surface-elevated rounded-xl text-left text-xs text-slate-600 dark:text-slate-300 font-mono">
            {`AETHER Voyage: ${activeTrip.name}\nDays: ${activeTrip.days?.length}\nTravelers: ${activeTrip.travelers}\nEst. Budget: ${formatCurrency(activeTripBudget, currency)}`}
          </div>

          <button
            type="button"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(`AETHER Voyage: ${activeTrip.name}\nDays: ${activeTrip.days?.length}\nBudget: ${formatCurrency(activeTripBudget, currency)}`);
                addToast('Itinerary details copied to clipboard', 'success');
              }
              setExportModalOpen(false);
            }}
            className="w-full py-3 rounded-xl bg-secondary text-white font-bold text-xs uppercase tracking-wider shadow-md"
          >
            Copy Summary to Clipboard
          </button>
        </div>
      </Modal>
    </div>
  );
}
