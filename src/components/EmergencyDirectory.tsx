import React from 'react';
import { EMERGENCY_CONTACTS } from '../data/legalData';
import { Phone, ShieldAlert, HeartHandshake, Landmark, ExternalLink, HelpCircle } from 'lucide-react';

export const EmergencyDirectory: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200/70 rounded-full text-xs font-semibold text-rose-800 mb-3">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          <span>Services publics officiels gratuits et confidentiels</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          Numéros d'Urgence & Accès Gratuit au Droit
        </h1>
        <p className="text-sm text-slate-600">
          En cas de péril immédiat, de violences conjugales ou pour bénéficier d'une consultation juridique gratuite dans un Point-Justice.
        </p>
      </div>

      {/* Emergency Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {EMERGENCY_CONTACTS.map((contact, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-900">
                  {contact.number}
                </span>
                <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  {contact.badge}
                </span>
              </div>
              <h2 className="text-sm font-bold text-slate-900 mb-1">{contact.name}</h2>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                {contact.description}
              </p>
            </div>

            <a
              href={contact.number === '114' ? 'sms:114' : `tel:${contact.number}`}
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{contact.number === '114' ? 'Envoyer SMS au 114' : `Appeler le ${contact.number}`}</span>
            </a>
          </div>
        ))}
      </div>

      {/* Free Legal Aid (Points-Justice & Aide Juridictionnelle) */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
            <HeartHandshake className="w-4 h-4" />
            <span>Consultations Gratuites & Aide Juridictionnelle</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-3">
            Comment obtenir un avocat gratuit ou commis d'office ?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            Si vos ressources sont modestes, l'État français prend en charge la totalité ou une partie des honoraires de votre avocat et des frais d'expertise ou de notaire grâce à l'<strong>Aide Juridictionnelle (AJ)</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60">
              <div className="font-bold text-amber-300 mb-1">Point-Justice le plus proche (3039)</div>
              <p className="text-slate-300 mb-3">
                Prenez rendez-vous dans une Maison de Justice et du Droit (MJD) ou un Point d'Accès au Droit (PAD) pour une consultation confidentielle avec un avocat ou notaire.
              </p>
              <a
                href="https://www.justice.fr/point-justice"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-400 hover:underline font-medium"
              >
                <span>Trouver mon Point-Justice (justice.fr)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60">
              <div className="font-bold text-amber-300 mb-1">Dossier Cerfa d'Aide Juridictionnelle</div>
              <p className="text-slate-300 mb-3">
                Déposez votre demande Cerfa 16146*03 en ligne sur justice.fr ou auprès du bureau d'aide juridictionnelle de votre Tribunal Judiciaire.
              </p>
              <a
                href="https://www.service-public.fr/particuliers/vosdroits/R60037"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-400 hover:underline font-medium"
              >
                <span>Demander l'Aide Juridictionnelle en ligne</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
