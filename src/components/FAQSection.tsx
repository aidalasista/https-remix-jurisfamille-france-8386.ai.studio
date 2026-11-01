import React, { useState, useMemo } from 'react';
import { FAQ_DATA } from '../data/legalData';
import { FAQItem } from '../types';
import {
  HelpCircle,
  Search,
  ChevronDown,
  Sparkles,
  Scale,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface FAQSectionProps {
  onAskInChat: (query: string, category: string) => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onAskInChat }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(FAQ_DATA[0].id);

  // Filter FAQs based on category and search query
  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.legalArticles.some((art) => art.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const categories = [
    { id: 'all', label: 'Toutes les thématiques' },
    { id: 'divorce', label: 'Divorce & Séparation' },
    { id: 'garde', label: 'Garde & Résidence' },
    { id: 'pension', label: 'Pension alimentaire' },
    { id: 'filiation', label: 'Filiation & Adoption' },
    { id: 'pacs_mariage', label: 'PACS & Mariage' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200/70 rounded-full text-xs font-semibold text-blue-900 mb-3">
          <Scale className="w-3.5 h-3.5 text-blue-700" />
          <span>Foire Aux Questions Juridique · Droit de la Famille en France</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          Questions Courantes & Réponses Légales
        </h1>
        <p className="text-sm text-slate-600">
          Des réponses concises, fiables et à jour sur les règles applicables en matière de divorce, autorité parentale, pension et filiation.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="mb-6 max-w-xl mx-auto">
        <div className="relative flex items-center bg-white rounded-xl border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 shadow-xs px-3 py-2 transition-all">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une question, un mot-clé (ex: délai, notaire, 18 ans, JAF)..."
            className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-1"
            >
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* Category Segmented Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Aucune réponse trouvée pour cette recherche
            </h3>
            <p className="text-xs text-slate-500 mb-4 max-w-md mx-auto">
              Vous pouvez poser directement votre question personnalisée à Maître Juriste dans l'onglet Assistant.
            </p>
            <button
              onClick={() =>
                onAskInChat(
                  searchQuery || 'J\'ai une question juridique en droit de la famille.',
                  'general'
                )
              }
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Interroger l'assistant avec ma question</span>
            </button>
          </div>
        ) : (
          filteredFAQs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className={`bg-white rounded-xl border transition-all overflow-hidden ${
                  isExpanded
                    ? 'border-blue-600 shadow-sm ring-1 ring-blue-600/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full p-4 sm:p-5 flex items-start justify-between gap-4 text-left focus:outline-none"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">
                        {faq.categoryLabel}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  <div
                    className={`p-1 rounded-full text-slate-400 hover:text-slate-600 transition-transform ${
                      isExpanded ? 'rotate-180 text-blue-700' : ''
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {/* Accordion Content */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/40">
                    {/* Legal Articles Pills */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-[11px] font-medium text-slate-500">
                        Fondements juridiques :
                      </span>
                      {faq.legalArticles.map((art, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-mono font-medium text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded-md"
                        >
                          {art}
                        </span>
                      ))}
                    </div>

                    {/* Answer text */}
                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-4">
                      {faq.answer}
                    </div>

                    {/* Key takeaway card */}
                    <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl mb-4 flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-900">
                        <strong className="font-semibold">À retenir : </strong>
                        {faq.keyTakeaway}
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          onAskInChat(
                            `J'aimerais approfondir la question suivante : "${faq.question}". Peux-tu analyser ma situation concrète et m'indiquer la marche à suivre ?`,
                            faq.category
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Approfondir avec Maître Juriste</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
