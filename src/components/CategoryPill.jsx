import React from 'react';

export default function CategoryPill({
  label,
  active = false,
  onClick,
  count = null,
  icon = null
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 shrink-0 select-none ${
        active
          ? 'bg-primary dark:bg-white text-white dark:text-primary shadow-md scale-105'
          : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-aether-textMuted dark:text-slate-300'
      }`}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      <span>{label}</span>
      {count !== null && (
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-full ${
            active
              ? 'bg-white/20 dark:bg-primary/20 text-white dark:text-primary font-bold'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
