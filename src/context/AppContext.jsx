import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Theme state
  const [theme, setTheme] = useLocalStorage('aether_theme', 'dark');
  
  // Currency state (Default INR)
  const [currency, setCurrency] = useLocalStorage('aether_currency', 'INR');

  // Search Modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Compare Destinations state (max 3)
  const [compareIds, setCompareIds] = useLocalStorage('aether_compare', [1, 2]);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  // Sync dark class on documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Keyboard shortcut Cmd/Ctrl+K or "/" to trigger search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const addToast = (message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCompare = (id) => {
    if (compareIds.includes(id)) {
      addToast('Already in comparison', 'info');
      return false;
    }
    if (compareIds.length >= 3) {
      addToast('You can compare up to 3 destinations at once', 'warning');
      return false;
    }
    setCompareIds([...compareIds, id]);
    addToast('Added to comparison', 'success');
    return true;
  };

  const removeFromCompare = (id) => {
    setCompareIds(compareIds.filter((item) => item !== id));
    addToast('Removed from comparison', 'info');
  };

  const clearCompare = () => {
    setCompareIds([]);
  };

  const isInCompare = (id) => compareIds.includes(id);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currency,
        setCurrency,
        isSearchOpen,
        openSearch: () => setIsSearchOpen(true),
        closeSearch: () => setIsSearchOpen(false),
        toasts,
        addToast,
        removeToast,
        compareIds,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
