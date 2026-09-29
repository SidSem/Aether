import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { journalArticles } from '../data/journal';
import { ArrowLeft, Clock, Calendar, User, Share2, Sparkles, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function JournalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useApp();

  const article = journalArticles.find((a) => a.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold font-heading mb-3">Article Not Found</h2>
        <Link to="/journal" className="text-secondary font-bold hover:underline">
          Return to Journal
        </Link>
      </div>
    );
  }

  const relatedArticles = journalArticles.filter((a) => a.id !== article.id).slice(0, 2);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Article link copied to clipboard', 'success');
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-24 bg-aether-bgLight dark:bg-aether-bgDark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <button
          type="button"
          onClick={() => navigate('/journal')}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-secondary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journal</span>
        </button>

        {/* Header */}
        <div className="space-y-4 mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest">
            {article.category}
          </span>

          <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-aether-textMain dark:text-white leading-[1.1]">
            {article.title}
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 font-light leading-relaxed">
            {article.subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium text-aether-textMain dark:text-white">
                <User className="w-3.5 h-3.5 text-secondary" />
                {article.author}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {article.date}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
              </span>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Share article"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative h-[380px] sm:h-[480px] rounded-3xl overflow-hidden mb-12 shadow-2xl">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Editorial Body */}
        <article className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-light space-y-6">
          {article.content.split('\n\n').map((paragraph, pIdx) => (
            <p key={pIdx}>{paragraph}</p>
          ))}
        </article>

        {/* Related Articles */}
        <div className="mt-20 pt-12 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-bold font-heading text-aether-textMain dark:text-white mb-6">
            Continue Reading
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedArticles.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigate(`/journal/${rel.id}`)}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-cardDark hover:border-secondary cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                    {rel.category} · {rel.readTime}
                  </span>
                  <h4 className="font-heading font-bold text-base text-aether-textMain dark:text-white mt-1">
                    {rel.title}
                  </h4>
                </div>
                <span className="text-xs font-bold text-secondary mt-4 hover:underline">
                  Read dispatch →
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
