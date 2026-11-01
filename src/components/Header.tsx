import React from 'react';
import { ActiveTab } from '../types';
import { Scale, PhoneCall, PlusCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onNewChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onNewChat }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark / single element */}
        <button
          onClick={() => setActiveTab('chat')}
          className="flex items-center gap-3 text-left focus:outline-none group whitespace-nowrap shrink-0"
        >
          <div className="w-9 h-9 rounded-full bg-slate-900 border border-amber-600/30 flex items-center justify-center overflow-hidden shadow-sm">
            <img
              src="/src/assets/images/justice_france_seal_1793539691831.jpg"
              alt="Sceau République Française Justice"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Graceful fallback to SVG icon if image fails
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <Scale className="w-5 h-5 text-amber-500 hidden group-hover:block" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            JurisFamille <span className="text-blue-700">France</span>
          </span>
        </button>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('chat')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 pb-0.5 ${
              activeTab === 'chat'
                ? 'text-blue-700 font-semibold border-b-2 border-blue-700'
                : 'text-slate-600'
            }`}
          >
            Assistant Juridique
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 pb-0.5 ${
              activeTab === 'faq'
                ? 'text-blue-700 font-semibold border-b-2 border-blue-700'
                : 'text-slate-600'
            }`}
          >
            FAQ Juridique
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 pb-0.5 ${
              activeTab === 'simulator'
                ? 'text-blue-700 font-semibold border-b-2 border-blue-700'
                : 'text-slate-600'
            }`}
          >
            Simulateur Pension
          </button>
          <button
            onClick={() => setActiveTab('letters')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 pb-0.5 ${
              activeTab === 'letters'
                ? 'text-blue-700 font-semibold border-b-2 border-blue-700'
                : 'text-slate-600'
            }`}
          >
            Modèles de Documents
          </button>
          <button
            onClick={() => setActiveTab('emergency')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 pb-0.5 ${
              activeTab === 'emergency'
                ? 'text-blue-700 font-semibold border-b-2 border-blue-700'
                : 'text-slate-600'
            }`}
          >
            Urgences & Accès Droit
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setActiveTab('chat');
              onNewChat();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 active:scale-[0.98] transition-all shadow-sm whitespace-nowrap shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nouveau dossier</span>
          </button>
        </div>
      </div>
    </header>
  );
};
