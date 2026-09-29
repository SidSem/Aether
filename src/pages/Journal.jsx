import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { journalArticles } from '../data/journal';
import { Clock, BookOpen, ArrowRight, Sparkles } from 'lucide-react';

export default function Journal() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Philosophy', 'Culture', 'Adventure', 'Coastal', 'Guides', 'Nature'];

  const filteredArticles = selectedCategory === 'All'
    ? journalArticles
    : journalArticles.filter((a) => a.category.toLowerCase() === selectedCategory.toLowerCase());

  const heroArticle = journalArticles[0];
  const supportingArticles = filteredArticles.filter((a) => a.id !== (selectedCategory === 'All' ? heroArticle.id : null));

  return (
    <div className="min-h-screen pt-28 pb-24 bg-aether-bgLight dark:bg-aether-bgDark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <SectionHeader
          badge="TRAVEL ESSAYS"
          title="THE AETHER JOURNAL"
          subtitle="Editorial essays, wanderlust perspectives, and field notes exploring the transformative power of mindful exploration."
        />

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-primary dark:bg-white text-white dark:text-primary shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Lead Hero Editorial Article (When 'All' selected) */}
        {selectedCategory === 'All' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate(`/journal/${heroArticle.id}`)}
            className="group rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl mb-16 cursor-pointer grid grid-cols-1 lg:grid-cols-12"
          >
            <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden">
              <img
                src={heroArticle.image}
                alt={heroArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 lg:hidden" />
            </div>

            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between text-white">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-highlight block mb-3">
                  Featured Cover Story · {heroArticle.category}
                </span>

                <h2 className="text-2xl sm:text-4xl font-extrabold font-heading tracking-tight leading-tight group-hover:text-highlight transition-colors mb-4">
                  {heroArticle.title}
                </h2>

                <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed mb-6">
                  {heroArticle.excerpt}
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                <span>By {heroArticle.author} · {heroArticle.readTime}</span>
                <span className="flex items-center gap-1 font-bold text-white group-hover:text-highlight transition-colors">
                  <span>Read Story</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Supporting Editorial Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {supportingArticles.map((art) => (
            <motion.div
              key={art.id}
              whileHover={{ y: -6 }}
              onClick={() => navigate(`/journal/${art.id}`)}
              className="group cursor-pointer rounded-2xl bg-white dark:bg-surface-cardDark border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={art.image}
                  alt={art.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/50 text-white backdrop-blur-md">
                  {art.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                    <span>{art.date}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {art.readTime}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-lg sm:text-xl text-aether-textMain dark:text-white group-hover:text-secondary transition-colors mb-2 leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-secondary font-bold group-hover:translate-x-1 transition-transform">
                  <span>Explore dispatch</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
