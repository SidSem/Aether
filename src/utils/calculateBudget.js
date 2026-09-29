// Budget calculation engine for AETHER

export const DEFAULT_BUDGET_RATIOS = {
  accommodation: 0.38,
  food: 0.24,
  transport: 0.18,
  activities: 0.12,
  shopping: 0.05,
  miscellaneous: 0.03,
};

export const BUDGET_CATEGORIES = [
  { key: 'accommodation', label: 'Accommodation', color: '#2F80ED', icon: 'Hotel' },
  { key: 'food', label: 'Food & Dining', color: '#F2994A', icon: 'Utensils' },
  { key: 'transport', label: 'Transport', color: '#56CCF2', icon: 'Plane' },
  { key: 'activities', label: 'Activities', color: '#27AE60', icon: 'Compass' },
  { key: 'shopping', label: 'Shopping', color: '#9B51E0', icon: 'ShoppingBag' },
  { key: 'miscellaneous', label: 'Miscellaneous', color: '#627D98', icon: 'ShieldAlert' },
];

/**
 * Calculates budget breakdown given a total amount
 */
export function calculateBudgetBreakdown(totalAmount = 0, customRatios = DEFAULT_BUDGET_RATIOS) {
  const breakdown = {};
  
  Object.keys(customRatios).forEach((key) => {
    breakdown[key] = Math.round(totalAmount * (customRatios[key] || 0));
  });

  return breakdown;
}

/**
 * Calculates estimated trip budget based on destinations, days, and travelers
 */
export function estimateTripBudget(destinations = [], totalDays = 7, travelers = 1) {
  if (!destinations.length) {
    // Default base daily estimate if no destinations chosen yet
    const baseDaily = 9000;
    return baseDaily * totalDays * travelers;
  }

  const avgDaily = destinations.reduce((sum, d) => sum + (d.averageDailyBudget || 8000), 0) / destinations.length;
  // Account for shared room savings when > 1 traveler (approx 15% discount on shared costs)
  const travelerMultiplier = travelers === 1 ? 1 : 1 + (travelers - 1) * 0.75;
  
  return Math.round(avgDaily * totalDays * travelerMultiplier);
}
