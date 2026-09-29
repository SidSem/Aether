import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700); // Swift, branded intro reveal

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-primary-dark text-white select-none"
        >
          <div className="flex flex-col items-center">
            {/* Logo */}
            <motion.h1
              initial={{ opacity: 0, letterSpacing: '0.4em' }}
              animate={{ opacity: 1, letterSpacing: '0.25em' }}
              transition={{ duration: 0.4 }}
              className="text-3xl sm:text-4xl font-bold font-heading text-white"
            >
              AETHER
            </motion.h1>

            {/* Animated Horizon Line */}
            <div className="w-44 h-0.5 bg-slate-800 relative mt-4 overflow-hidden rounded-full">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
                className="w-full h-full bg-gradient-to-r from-transparent via-highlight to-transparent"
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.2 }}
              className="text-xs tracking-widest text-slate-400 uppercase mt-3"
            >
              Go somewhere unforgettable
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
