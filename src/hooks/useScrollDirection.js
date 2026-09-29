import { useState, useEffect } from 'react';

/**
 * Hook to track scroll direction and scroll position
 */
export function useScrollDirection() {
  const [scrollDir, setScrollDir] = useState('up');
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const updateScrollDir = () => {
      const currentScrollY = window.pageYOffset;
      setScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 50);

      if (Math.abs(currentScrollY - lastScrollY) < 5) {
        return;
      }

      setScrollDir(currentScrollY > lastScrollY ? 'down' : 'up');
      lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
    };

    window.addEventListener('scroll', updateScrollDir, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollDir);
  }, []);

  return { scrollDir, isScrolled, scrollY };
}
