import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-4 bg-aether-bgLight dark:bg-aether-bgDark">
      <div className="w-20 h-20 rounded-full bg-secondary/10 dark:bg-secondary/20 text-secondary flex items-center justify-center mb-6">
        <Compass className="w-10 h-10 animate-spin-slow" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-secondary block mb-2">
        Error 404
      </span>

      <h1 className="text-4xl sm:text-6xl font-black font-heading tracking-tight text-aether-textMain dark:text-white uppercase mb-4">
        Uncharted Horizon
      </h1>

      <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
        The coordinates you seek have not been mapped or may have drifted beyond our cartographic bounds.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="px-6 py-3 rounded-full bg-primary dark:bg-white text-white dark:text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-opacity hover:opacity-90"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>

        <Link
          to="/explore"
          className="px-6 py-3 rounded-full bg-secondary text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:bg-secondary-hover transition-colors"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
