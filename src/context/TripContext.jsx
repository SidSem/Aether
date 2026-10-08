import React, { createContext, useContext, useMemo, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { destinations } from '../data/destinations';
import { activities as curatedActivities } from '../data/activities';
import { useApp } from './AppContext';
import { estimateTripBudget, calculateBudgetBreakdown, DEFAULT_BUDGET_RATIOS } from '../utils/calculateBudget';

const TripContext = createContext();

export function inferTimeOfDay(activity) {
  if (!activity) return 'morning';
  if (activity.timeOfDay) return activity.timeOfDay;
  const text = `${activity.title || ''} ${activity.description || ''}`.toLowerCase();
  if (text.includes('sunrise') || text.includes('morning') || text.includes('breakfast') || text.includes('early')) {
    return 'morning';
  }
  if (text.includes('sunset') || text.includes('night') || text.includes('evening') || text.includes('dinner') || text.includes('bar')) {
    return 'evening';
  }
  return 'afternoon';
}

const SEED_TRIPS = [
  {
    id: "trip-japan-2026",
    name: "Japan Autumn Discovery",
    startDate: "2026-10-10",
    endDate: "2026-10-17",
    travelers: 2,
    destinationIds: [7, 1], // Tokyo, Kyoto
    budgetOverride: null,
    budgetRatios: { ...DEFAULT_BUDGET_RATIOS },
    days: [
      {
        dayNumber: 1,
        title: "Arrival in Tokyo & Shibuya Sunset",
        destinationId: 7,
        activityIds: ["act-18"],
        activitySlots: { "act-18": "evening" }
      },
      {
        dayNumber: 2,
        title: "Digital Art & Shinjuku Nightlife",
        destinationId: 7,
        activityIds: ["act-17"],
        activitySlots: { "act-17": "afternoon" }
      },
      {
        dayNumber: 3,
        title: "Bullet Train Shinkansen to Kyoto",
        destinationId: 1,
        activityIds: ["act-4"],
        activitySlots: { "act-4": "morning" }
      },
      {
        dayNumber: 4,
        title: "Sacred Torii Gates & Tea Tradition",
        destinationId: 1,
        activityIds: ["act-1", "act-2"],
        activitySlots: { "act-1": "morning", "act-2": "afternoon" }
      },
      {
        dayNumber: 5,
        title: "Arashiyama Bamboo Forest Serenity",
        destinationId: 1,
        activityIds: ["act-3"],
        activitySlots: { "act-3": "morning" }
      }
    ]
  },
  {
    id: "trip-amalfi-2026",
    name: "Amalfi & Cyclades Escape",
    startDate: "2026-06-15",
    endDate: "2026-06-25",
    travelers: 2,
    destinationIds: [2, 4], // Amalfi Coast, Santorini
    budgetOverride: null,
    budgetRatios: { ...DEFAULT_BUDGET_RATIOS },
    days: [
      {
        dayNumber: 1,
        title: "Arrival on the Amalfi Coast",
        destinationId: 2,
        activityIds: ["act-7"],
        activitySlots: { "act-7": "afternoon" }
      },
      {
        dayNumber: 2,
        title: "Path of the Gods Clifftop Trek",
        destinationId: 2,
        activityIds: ["act-5"],
        activitySlots: { "act-5": "morning" }
      },
      {
        dayNumber: 3,
        title: "Wooden Boat Sail to Capri Island",
        destinationId: 2,
        activityIds: ["act-6"],
        activitySlots: { "act-6": "afternoon" }
      },
      {
        dayNumber: 4,
        title: "Ferry to Santorini & Oia Sunset",
        destinationId: 4,
        activityIds: ["act-12"],
        activitySlots: { "act-12": "evening" }
      },
      {
        dayNumber: 5,
        title: "Caldera Ridge Walk to Fira",
        destinationId: 4,
        activityIds: ["act-11"],
        activitySlots: { "act-11": "morning" }
      }
    ]
  }
];

export function TripProvider({ children }) {
  const [trips, setTrips] = useLocalStorage('aether_user_trips', SEED_TRIPS);
  const [customActivities, setCustomActivities] = useLocalStorage('aether_custom_activities', []);
  const [activeTripId, setActiveTripId] = useLocalStorage('aether_active_trip_id', SEED_TRIPS[0].id);
  const [isTripDrawerOpen, setIsTripDrawerOpen] = useState(false);
  const { addToast } = useApp();

  // Combine curated and user-created activities
  const allAvailableActivities = useMemo(() => {
    return [...curatedActivities, ...customActivities];
  }, [customActivities]);

  const getActivityById = (id) => {
    return allAvailableActivities.find((a) => a.id === id) || null;
  };

  // Retrieve active trip object
  const activeTrip = useMemo(() => {
    return trips.find((t) => t.id === activeTripId) || trips[0] || null;
  }, [trips, activeTripId]);

  // Retrieve destinations objects for active trip
  const activeTripDestinations = useMemo(() => {
    if (!activeTrip) return [];
    return activeTrip.destinationIds
      .map((id) => destinations.find((d) => d.id === id))
      .filter(Boolean);
  }, [activeTrip]);

  // Compute active trip budget including daily base estimate + scheduled activities
  const activeTripBudget = useMemo(() => {
    if (!activeTrip) return 0;
    if (activeTrip.budgetOverride) return activeTrip.budgetOverride;
    const daysCount = activeTrip.days?.length || 5;
    const baseBudget = estimateTripBudget(activeTripDestinations, daysCount, activeTrip.travelers || 1);
    
    // Add total activity prices for all travelers
    const scheduledActivityCost = (activeTrip.days || []).reduce((dayAcc, day) => {
      const dayTotal = (day.activityIds || []).reduce((actAcc, actId) => {
        const act = allAvailableActivities.find((a) => a.id === actId);
        return actAcc + (act?.price || 0) * (activeTrip.travelers || 1);
      }, 0);
      return dayAcc + dayTotal;
    }, 0);

    return baseBudget + scheduledActivityCost;
  }, [activeTrip, activeTripDestinations, allAvailableActivities]);

  // Compute active trip budget breakdown
  const activeTripBudgetBreakdown = useMemo(() => {
    if (!activeTrip) return {};
    return calculateBudgetBreakdown(activeTripBudget, activeTrip.budgetRatios || DEFAULT_BUDGET_RATIOS);
  }, [activeTrip, activeTripBudget]);

  // Helper to update specific trip
  const updateTrip = (tripId, updates) => {
    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id === tripId) {
          return { ...trip, ...updates };
        }
        return trip;
      })
    );
  };

  // Create trip
  const createTrip = ({ name, startDate, endDate, travelers = 2, destinationIds = [] }) => {
    const newTripId = `trip-${Date.now()}`;
    const initialDest = destinationIds.length ? destinationIds : [1];
    
    // Seed 3 initial days
    const initialDays = [
      {
        dayNumber: 1,
        title: "Arrival & Orientation",
        destinationId: initialDest[0],
        activityIds: [],
        activitySlots: {}
      },
      {
        dayNumber: 2,
        title: "Discovery & Local Culture",
        destinationId: initialDest[0],
        activityIds: [],
        activitySlots: {}
      },
      {
        dayNumber: 3,
        title: "Hidden Gems & Leisure",
        destinationId: initialDest[0],
        activityIds: [],
        activitySlots: {}
      }
    ];

    const newTrip = {
      id: newTripId,
      name: name || "My New Journey",
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || "",
      travelers: Number(travelers) || 1,
      destinationIds: initialDest,
      budgetOverride: null,
      budgetRatios: { ...DEFAULT_BUDGET_RATIOS },
      days: initialDays
    };

    setTrips((prev) => [newTrip, ...prev]);
    setActiveTripId(newTripId);
    addToast(`Created trip: ${newTrip.name}`, 'success');
    return newTrip;
  };

  // Delete trip
  const deleteTrip = (tripId) => {
    if (trips.length <= 1) {
      addToast('Cannot delete the only trip', 'warning');
      return;
    }
    const remaining = trips.filter((t) => t.id !== tripId);
    setTrips(remaining);
    if (activeTripId === tripId) {
      setActiveTripId(remaining[0].id);
    }
    addToast('Trip deleted', 'info');
  };

  // Add destination to trip
  const addDestinationToTrip = (tripId, destinationId) => {
    const targetTrip = trips.find((t) => t.id === tripId);
    if (!targetTrip) return;

    if (targetTrip.destinationIds.includes(destinationId)) {
      addToast('Destination is already in this trip', 'info');
      return;
    }

    const dest = destinations.find((d) => d.id === destinationId);
    const updatedDestIds = [...targetTrip.destinationIds, destinationId];
    
    // Append a new day dedicated to this new destination
    const newDayNumber = (targetTrip.days?.length || 0) + 1;
    const newDay = {
      dayNumber: newDayNumber,
      title: `Explore ${dest ? dest.name : 'New Destination'}`,
      destinationId,
      activityIds: [],
      activitySlots: {}
    };

    updateTrip(tripId, {
      destinationIds: updatedDestIds,
      days: [...(targetTrip.days || []), newDay]
    });

    addToast(`Added ${dest?.name || 'destination'} to ${targetTrip.name}`, 'success');
  };

  // Remove destination from trip
  const removeDestinationFromTrip = (tripId, destinationId) => {
    const targetTrip = trips.find((t) => t.id === tripId);
    if (!targetTrip) return;

    if (targetTrip.destinationIds.length <= 1) {
      addToast('A trip needs at least one destination', 'warning');
      return;
    }

    const updatedDestIds = targetTrip.destinationIds.filter((id) => id !== destinationId);
    const fallbackDestId = updatedDestIds[0];

    // Reassign days that used the removed destination
    const updatedDays = targetTrip.days.map((day) => {
      if (day.destinationId === destinationId) {
        return { ...day, destinationId: fallbackDestId };
      }
      return day;
    });

    updateTrip(tripId, {
      destinationIds: updatedDestIds,
      days: updatedDays
    });

    addToast('Destination removed from trip', 'info');
  };

  // Add activity to specific day
  const addActivityToDay = (tripId, dayIndex, activityId, preferredSlot = null) => {
    const targetTrip = trips.find((t) => t.id === tripId);
    if (!targetTrip || !targetTrip.days[dayIndex]) return;

    const currentActivities = targetTrip.days[dayIndex].activityIds || [];
    if (currentActivities.includes(activityId)) {
      addToast('Activity already in this day', 'info');
      return;
    }

    const foundAct = allAvailableActivities.find((a) => a.id === activityId);
    const slot = preferredSlot || inferTimeOfDay(foundAct);

    const updatedDays = [...targetTrip.days];
    const currentSlots = updatedDays[dayIndex].activitySlots || {};
    updatedDays[dayIndex] = {
      ...updatedDays[dayIndex],
      activityIds: [...currentActivities, activityId],
      activitySlots: {
        ...currentSlots,
        [activityId]: slot
      }
    };

    updateTrip(tripId, { days: updatedDays });
    addToast(`Added "${foundAct?.title || 'Activity'}" to Day ${dayIndex + 1}`, 'success');
  };

  // Add custom event directly to day
  const addCustomActivityToDay = (tripId, dayIndex, customData) => {
    const targetTrip = trips.find((t) => t.id === tripId);
    if (!targetTrip || !targetTrip.days[dayIndex]) return;

    const customId = `custom-act-${Date.now()}`;
    const newCustomActivity = {
      id: customId,
      destinationId: targetTrip.days[dayIndex].destinationId,
      title: customData.title || "Custom Adventure",
      duration: customData.duration || "2 hrs",
      price: Number(customData.price) || 0,
      category: customData.category || "Sightseeing",
      description: customData.description || "Custom planned experience",
      timeOfDay: customData.timeOfDay || "morning",
      isCustom: true,
      image: customData.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop"
    };

    // Save custom activity
    setCustomActivities((prev) => [newCustomActivity, ...prev]);

    // Attach to day
    const currentDay = targetTrip.days[dayIndex];
    const updatedDays = [...targetTrip.days];
    updatedDays[dayIndex] = {
      ...currentDay,
      activityIds: [...(currentDay.activityIds || []), customId],
      activitySlots: {
        ...(currentDay.activitySlots || {}),
        [customId]: newCustomActivity.timeOfDay
      }
    };

    updateTrip(tripId, { days: updatedDays });
    addToast(`Added custom event "${newCustomActivity.title}" to Day ${dayIndex + 1}`, 'success');
  };

  // Change activity time-of-day slot
  const setActivitySlot = (tripId, dayIndex, activityId, slot) => {
    const targetTrip = trips.find((t) => t.id === tripId);
    if (!targetTrip || !targetTrip.days[dayIndex]) return;

    const updatedDays = [...targetTrip.days];
    updatedDays[dayIndex] = {
      ...updatedDays[dayIndex],
      activitySlots: {
        ...(updatedDays[dayIndex].activitySlots || {}),
        [activityId]: slot
      }
    };

    updateTrip(tripId, { days: updatedDays });
  };

  // Update day title
  const updateDayTitle = (tripId, dayIndex, newTitle) => {
    const targetTrip = trips.find((t) => t.id === tripId);
    if (!targetTrip || !targetTrip.days[dayIndex]) return;

    const updatedDays = [...targetTrip.days];
    updatedDays[dayIndex] = {
      ...updatedDays[dayIndex],
      title: newTitle
    };

    updateTrip(tripId, { days: updatedDays });
  };

  // Remove activity from specific day
  const removeActivityFromDay = (tripId, dayIndex, activityId) => {
    const targetTrip = trips.find((t) => t.id === tripId);
    if (!targetTrip || !targetTrip.days[dayIndex]) return;

    const updatedDays = [...targetTrip.days];
    const updatedSlots = { ...(updatedDays[dayIndex].activitySlots || {}) };
    delete updatedSlots[activityId];

    updatedDays[dayIndex] = {
      ...updatedDays[dayIndex],
      activityIds: (updatedDays[dayIndex].activityIds || []).filter((id) => id !== activityId),
      activitySlots: updatedSlots
    };

    updateTrip(tripId, { days: updatedDays });
    addToast('Activity removed from day', 'info');
  };

  // Reorder activities within a day
  const reorderDayActivities = (tripId, dayIndex, newActivityIds) => {
    const targetTrip = trips.find((t) => t.id === tripId);
    if (!targetTrip || !targetTrip.days[dayIndex]) return;

    const updatedDays = [...targetTrip.days];
    updatedDays[dayIndex] = {
      ...updatedDays[dayIndex],
      activityIds: newActivityIds
    };

    updateTrip(tripId, { days: updatedDays });
  };

  // Add a new day to trip
  const addDayToTrip = (tripId, destinationId) => {
    const targetTrip = trips.find((t) => t.id === tripId);
    if (!targetTrip) return;

    const destId = destinationId || targetTrip.destinationIds[0] || 1;
    const dest = destinations.find((d) => d.id === destId);
    const newDayNumber = (targetTrip.days?.length || 0) + 1;

    const newDay = {
      dayNumber: newDayNumber,
      title: `Day in ${dest?.name || 'Paradise'}`,
      destinationId: destId,
      activityIds: [],
      activitySlots: {}
    };

    updateTrip(tripId, {
      days: [...(targetTrip.days || []), newDay]
    });
    addToast(`Added Day ${newDayNumber} to itinerary`, 'success');
  };

  // Remove a day from trip
  const removeDayFromTrip = (tripId, dayIndex) => {
    const targetTrip = trips.find((t) => t.id === tripId);
    if (!targetTrip) return;

    if (targetTrip.days.length <= 1) {
      addToast('Itinerary must have at least one day', 'warning');
      return;
    }

    const filtered = targetTrip.days.filter((_, idx) => idx !== dayIndex);
    // Renumber days
    const renumbered = filtered.map((day, idx) => ({
      ...day,
      dayNumber: idx + 1
    }));

    updateTrip(tripId, { days: renumbered });
    addToast('Day removed from itinerary', 'info');
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        activeTripId,
        setActiveTripId,
        activeTrip,
        activeTripDestinations,
        activeTripBudget,
        activeTripBudgetBreakdown,
        allAvailableActivities,
        getActivityById,
        createTrip,
        deleteTrip,
        updateTrip,
        addDestinationToTrip,
        removeDestinationFromTrip,
        addActivityToDay,
        addCustomActivityToDay,
        removeActivityFromDay,
        reorderDayActivities,
        setActivitySlot,
        updateDayTitle,
        addDayToTrip,
        removeDayFromTrip,
        isTripDrawerOpen,
        openTripDrawer: () => setIsTripDrawerOpen(true),
        closeTripDrawer: () => setIsTripDrawerOpen(false),
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
}

