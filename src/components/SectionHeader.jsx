import React from 'react';
import { motion } from 'framer-motion';

export default function SectionHeader({
  badge,
  title,
  subtitle,
  centered = false,
  action = null,
  light = false
}) {
  return (
    <div className={`mb-10 md:mb-14 ${centered ? 'text-center mx-auto max-w-2xl' : 'flex flex-col md:flex-row md:items-end justify-between gap-4'}`}>
      <div className={centered ? '' : 'max-w-xl'}>
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold tracking-widest uppercase rounded-full mb-3 ${
              light
                ? 'bg-white/10 text-highlight border border-white/20'
                : 'bg-secondary/10 text-secondary dark:bg-secondary/20 dark:text-highlight border border-secondary/20'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            {badge}
          </motion.div>
        )}

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={`text-3xl sm:text-4xl md:text-5xl font-bold font-heading tracking-tight ${
            light ? 'text-white' : 'text-aether-textMain dark:text-white'
          }`}
        >
          {title}
        </motion.h2>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={`mt-3 text-base sm:text-lg leading-relaxed ${
              light ? 'text-white/70' : 'text-aether-textMuted dark:text-slate-400'
            }`}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {action && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="shrink-0"
        >
          {action}
        </motion.div>
      )}
    </div>
  );
}
