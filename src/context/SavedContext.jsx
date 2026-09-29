import React, { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { destinations } from '../data/destinations';
import { useApp } from './AppContext';

const SavedContext = createContext();

export function SavedProvider({ children }) {
  // Initial saved favorites: Kyoto, Amalfi Coast, Zermatt, Santorini
  const [savedIds, setSavedIds] = useLocalStorage('aether_saved_places', [1, 2, 4, 6]);
  const { addToast } = useApp();

  const toggleSaved = (id) => {
    const dest = destinations.find((d) => d.id === id);
    const destName = dest ? dest.name : 'Destination';

    if (savedIds.includes(id)) {
      setSavedIds((prev) => prev.filter((item) => item !== id));
      addToast(`Removed ${destName} from saved places`, 'info');
    } else {
      setSavedIds((prev) => [...prev, id]);
      addToast(`Saved ${destName} to your collection`, 'success');
    }
  };

  const isSaved = (id) => savedIds.includes(id);

  const clearSaved = () => {
    setSavedIds([]);
    addToast('Cleared all saved places', 'info');
  };

  const savedDestinations = useMemo(() => {
    return destinations.filter((dest) => savedIds.includes(dest.id));
  }, [savedIds]);

  return (
    <SavedContext.Provider
      value={{
        savedIds,
        savedDestinations,
        toggleSaved,
        isSaved,
        clearSaved,
        savedCount: savedIds.length,
      }}
    >
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  const context = useContext(SavedContext);
  if (!context) {
    throw new Error('useSaved must be used within a SavedProvider');
  }
  return context;
}
