import React from 'react';
import { LEGAL_GUIDES } from '../data/legalData';
import { BookOpen, ArrowRight, ShieldCheck, Scale, Clock, CheckCircle2 } from 'lucide-react';

interface LegalGuidesProps {
  onOpenChatWithTopic: (topicTitle: string, category: string) => void;
}

export const LegalGuides: React.FC<LegalGuidesProps> = ({ onOpenChatWithTopic }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200/70 rounded-full text-xs font-semibold text-blue-900 mb-3">
          <Scale className="w-3.5 h-3.5 text-blue-700" />
          <span>Fiches repères du Code civil français</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          Guides Pratiques & Textes de Référence
        </h1>
        <p className="text-sm text-slate-600">
          Synthèse des règles impératives, délais de procédure et droits garantis par la législation française.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {LEGAL_GUIDES.map((guide) => (
          <div
            key={guide.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div>
              {/* Category / Code tags */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {guide.codeArticles.map((art, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-mono font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md"
                  >
                    {art}
                  </span>
                ))}
              </div>

              <h2 className="text-lg font-bold text-slate-900 mb-1">{guide.title}</h2>
              <p className="text-xs text-slate-500 mb-4">{guide.subtitle}</p>

              {/* Key Rules list */}
              <div className="space-y-2 mb-5">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Règles juridiques fondamentales :
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {guide.keyRules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Deadlines and Costs */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 mb-5 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">Délais & Coûts indicatifs :</div>
                  <div className="mt-0.5 text-slate-600">{guide.deadlinesAndCosts}</div>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <button
              onClick={() =>
                onOpenChatWithTopic(
                  `Je souhaite poser des questions juridiques détaillées concernant la thématique suivante : "${guide.title}". Peux-tu m'expliquer mes droits et les démarches exactes ?`,
                  guide.id
                )
              }
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
            >
              <span>Poser une question sur cette thématique</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
