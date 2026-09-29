// Filter and sort engine for AETHER destinations

export function filterAndSortDestinations(destinations, filters = {}) {
  const {
    search = '',
    continent = 'All Continents',
    country = 'All Countries',
    travelStyle = 'All Styles',
    maxBudget = null,
    duration = 'All Durations',
    season = 'All Seasons',
    sortBy = 'trending'
  } = filters;

  const normalizedSearch = search.trim().toLowerCase();

  let results = destinations.filter((dest) => {
    // 1. Search Query
    if (normalizedSearch) {
      const matchName = dest.name.toLowerCase().includes(normalizedSearch);
      const matchCountry = dest.country.toLowerCase().includes(normalizedSearch);
      const matchContinent = dest.continent.toLowerCase().includes(normalizedSearch);
      const matchDesc = dest.description.toLowerCase().includes(normalizedSearch);
      const matchCategories = dest.categories.some(c => c.toLowerCase().includes(normalizedSearch));
      const matchHighlights = dest.highlights?.some(h => h.toLowerCase().includes(normalizedSearch));

      if (!matchName && !matchCountry && !matchContinent && !matchDesc && !matchCategories && !matchHighlights) {
        return false;
      }
    }

    // 2. Continent
    if (continent && continent !== 'All Continents') {
      if (dest.continent.toLowerCase() !== continent.toLowerCase()) {
        return false;
      }
    }

    // 3. Country
    if (country && country !== 'All Countries') {
      if (dest.country.toLowerCase() !== country.toLowerCase()) {
        return false;
      }
    }

    // 4. Travel Style / Category
    if (travelStyle && travelStyle !== 'All Styles') {
      const styleMatch = dest.travelStyle.toLowerCase() === travelStyle.toLowerCase() ||
                         dest.categories.some(c => c.toLowerCase() === travelStyle.toLowerCase());
      if (!styleMatch) return false;
    }

    // 5. Max Budget (in INR)
    if (maxBudget && dest.averageDailyBudget > maxBudget) {
      return false;
    }

    // 6. Duration filter
    if (duration && duration !== 'All Durations') {
      if (duration === '1-4 Days' && dest.duration > 4) return false;
      if (duration === '5-7 Days' && (dest.duration < 5 || dest.duration > 7)) return false;
      if (duration === '8+ Days' && dest.duration < 8) return false;
    }

    // 7. Season
    if (season && season !== 'All Seasons') {
      const seasonMatch = dest.bestSeason?.toLowerCase().includes(season.toLowerCase());
      if (!seasonMatch) return false;
    }

    return true;
  });

  // Sorting
  results.sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'budget-low':
        return a.averageDailyBudget - b.averageDailyBudget;
      case 'budget-high':
        return b.averageDailyBudget - a.averageDailyBudget;
      case 'duration-short':
        return a.duration - b.duration;
      case 'duration-long':
        return b.duration - a.duration;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'trending':
      default:
        // Priority to trending flag, then rating * reviews score
        if (a.trending && !b.trending) return -1;
        if (!a.trending && b.trending) return 1;
        return (b.rating * b.reviews) - (a.rating * a.reviews);
    }
  });

  return results;
}
