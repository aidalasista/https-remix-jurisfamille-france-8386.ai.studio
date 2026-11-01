import React, { useState } from 'react';
import { MINIMUM_VITAL_RSA, PENSION_RATES } from '../data/legalData';
import {
  Calculator,
  ArrowRight,
  ShieldCheck,
  Info,
  Sparkles,
  Scale,
  Users,
  Coins,
  FileSpreadsheet,
  BookOpen,
} from 'lucide-react';

interface PensionSimulatorProps {
  onTransferToChat: (query: string, category: string) => void;
}

export const PensionSimulator: React.FC<PensionSimulatorProps> = ({ onTransferToChat }) => {
  const [debtorIncome, setDebtorIncome] = useState<number>(2400);
  const [creditorIncome, setCreditorIncome] = useState<number>(1700);
  const [childrenCount, setChildrenCount] = useState<number>(2);
  const [custodyMode, setCustodyMode] = useState<'classique' | 'reduit' | 'alterne'>('classique');
  const [debtorRent, setDebtorRent] = useState<number>(750);
  const [creditorRent, setCreditorRent] = useState<number>(700);
  const [showAdvancedCharges, setShowAdvancedCharges] = useState<boolean>(false);

  // Calculation Logic:
  // 1. Debtor base after basic minimum vital (RSA 2026: 635 €)
  const availableBasis = Math.max(0, debtorIncome - MINIMUM_VITAL_RSA);

  // 2. Official Ministry of Justice rates
  const rates = PENSION_RATES[custodyMode];
  const ratePerChild = rates[Math.min(childrenCount, 6)] || 0.10;

  // 3. Gross calculated amount from table
  let baseAmountPerChild = Math.round(availableBasis * ratePerChild);

  // In alternate custody, if parents have unequal incomes, the difference in faculties is balanced:
  if (custodyMode === 'alterne') {
    const totalIncome = debtorIncome + creditorIncome;
    const debtorRatio = totalIncome > 0 ? debtorIncome / totalIncome : 0.5;
    // Adjustment factor based on relative inequality
    const disparityFactor = Math.max(0, debtorRatio - 0.5) * 2; // 0 if equal, 1 if all debtor
    baseAmountPerChild = Math.round(availableBasis * ratePerChild * (0.6 + 0.4 * disparityFactor));
  }

  const amountPerChild = Math.max(0, baseAmountPerChild);
  const totalPension = amountPerChild * childrenCount;

  // Total household faculties comparison
  const totalNetIncomes = debtorIncome + creditorIncome;
  const debtorContributionShare =
    totalNetIncomes > 0 ? Math.round((debtorIncome / totalNetIncomes) * 100) : 50;
  const creditorContributionShare = 100 - debtorContributionShare;

  const handleAskAI = () => {
    const custodyLabel =
      custodyMode === 'classique'
        ? 'Droit de visite classique (1 week-end sur 2 et la moitié des vacances)'
        : custodyMode === 'reduit'
        ? 'Droit de visite réduit (vacances uniquement)'
        : 'Résidence alternée (50/50 avec péréquation pour équilibrer les charges)';

    const query = `J'ai effectué une simulation détaillée de pension alimentaire :
- Revenu net mensuel du parent débiteur : ${debtorIncome} € (loyer/emprunt : ${debtorRent} €)
- Revenu net mensuel du parent créancier : ${creditorIncome} € (loyer/emprunt : ${creditorRent} €)
- Répartition des ressources du couple : ${debtorContributionShare}% pour le débiteur / ${creditorContributionShare}% pour le créancier
- Mode de résidence : ${custodyLabel}
- Nombre d'enfants : ${childrenCount}
- Minimum vital déduit (RSA 2026) : ${MINIMUM_VITAL_RSA} €
- Taux légal indicatif : ${(ratePerChild * 100).toFixed(1)}% par enfant
- Montant indicatif calculé : ${amountPerChild} € / mois par enfant, soit ${totalPension} € / mois au total.

Peux-tu analyser ce montant au regard de la jurisprudence du JAF, m'indiquer comment les charges réelles (loyers, cantine, activités extrascolaires) et les allocations familiales influent sur la fixation finale, et m'expliquer la procédure d'homologation ou de prélèvement automatique par l'ARIPA ?`;

    onTransferToChat(query, 'pension');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200/70 rounded-full text-xs font-semibold text-blue-900 mb-3">
          <Scale className="w-3.5 h-3.5 text-blue-700" />
          <span>Barème Officiel du Ministère de la Justice & Jurisprudence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          Simulateur de Pension Alimentaire (Deux Parents)
        </h1>
        <p className="text-sm text-slate-600">
          Calculez la contribution à l'entretien et à l'éducation en intégrant les revenus des deux parents, le mode de garde et le nombre d'enfants.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
        {/* Form Controls */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Calculator className="w-4 h-4 text-blue-700" />
            <span>1. Situation des deux parents</span>
          </h2>

          {/* Debtor Income Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Revenu net mensuel du parent débiteur (qui verse)
              </label>
              <span className="text-sm font-mono font-bold text-blue-700 tabular-nums">
                {debtorIncome.toLocaleString('fr-FR')} € / mois
              </span>
            </div>
            <input
              type="range"
              min="700"
              max="9000"
              step="50"
              value={debtorIncome}
              onChange={(e) => setDebtorIncome(Number(e.target.value))}
              className="w-full accent-blue-700 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
              <span>700 €</span>
              <span>2 500 €</span>
              <span>5 000 €</span>
              <span>9 000 €</span>
            </div>
          </div>

          {/* Creditor Income Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Revenu net mensuel du parent créancier (qui accueille)
              </label>
              <span className="text-sm font-mono font-bold text-emerald-700 tabular-nums">
                {creditorIncome.toLocaleString('fr-FR')} € / mois
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="9000"
              step="50"
              value={creditorIncome}
              onChange={(e) => setCreditorIncome(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
              <span>500 €</span>
              <span>2 500 €</span>
              <span>5 000 €</span>
              <span>9 000 €</span>
            </div>
          </div>

          {/* Relative faculties comparison progress bar */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
            <div className="flex justify-between items-center text-slate-700 font-medium mb-1.5">
              <span>Répartition des capacités financières globales :</span>
              <span className="font-mono tabular-nums text-slate-900 font-semibold">
                {debtorContributionShare}% vs {creditorContributionShare}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${debtorContributionShare}%` }}
                title={`Parent débiteur: ${debtorContributionShare}%`}
              />
              <div
                className="bg-emerald-600 h-full transition-all duration-300"
                style={{ width: `${creditorContributionShare}%` }}
                title={`Parent créancier: ${creditorContributionShare}%`}
              />
            </div>
          </div>

          {/* Children count selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              2. Nombre d'enfants communs à charge
            </label>
            <div className="grid grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setChildrenCount(num)}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                    childrenCount === num
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {num} {num > 1 ? 'enfants' : 'enfant'}
                </button>
              ))}
            </div>
          </div>

          {/* Custody mode */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              3. Modalités d'accueil et de résidence
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setCustodyMode('classique')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  custodyMode === 'classique'
                    ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-xs text-slate-900 mb-0.5">Classique</div>
                <div className="text-[11px] text-slate-500 leading-tight">
                  1 week-end sur 2 et la moitié des vacances scolaires
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCustodyMode('reduit')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  custodyMode === 'reduit'
                    ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-xs text-slate-900 mb-0.5">Réduit</div>
                <div className="text-[11px] text-slate-500 leading-tight">
                  Moins d'un week-end sur deux / vacances seulement
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCustodyMode('alterne')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  custodyMode === 'alterne'
                    ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-xs text-slate-900 mb-0.5">Alternée</div>
                <div className="text-[11px] text-slate-500 leading-tight">
                  Résidence partagée (péréquation si écart de revenus)
                </div>
              </button>
            </div>
          </div>

          {/* Optional housing charges toggle */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAdvancedCharges((prev) => !prev)}
              className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>
                {showAdvancedCharges
                  ? 'Masquer les charges de logement'
                  : 'Prendre en compte les loyers / emprunts de logement (facultatif)'}
              </span>
            </button>

            {showAdvancedCharges && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Loyer / crédit débiteur (€/mois)
                  </label>
                  <input
                    type="number"
                    value={debtorRent}
                    onChange={(e) => setDebtorRent(Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Loyer / crédit créancier (€/mois)
                  </label>
                  <input
                    type="number"
                    value={creditorRent}
                    onChange={(e) => setCreditorRent(Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              Résultat indicatif légal
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums font-mono text-white mb-1">
              {totalPension.toLocaleString('fr-FR')} €
              <span className="text-sm font-normal text-slate-300"> / mois</span>
            </div>
            <p className="text-xs text-slate-300 mb-6">
              Soit <strong>{amountPerChild.toLocaleString('fr-FR')} €</strong> par enfant ({childrenCount} {childrenCount > 1 ? 'enfants' : 'enfant'}).
            </p>

            <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Revenu net débiteur :</span>
                <span className="font-mono tabular-nums text-white">{debtorIncome} €</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Revenu net créancier :</span>
                <span className="font-mono tabular-nums text-emerald-300">{creditorIncome} €</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Minimum vital déduit (RSA 2026) :</span>
                <span className="font-mono tabular-nums text-rose-300">-{MINIMUM_VITAL_RSA} €</span>
              </div>
              <div className="flex justify-between items-center text-slate-300 font-semibold">
                <span>Assiette contributive retenue :</span>
                <span className="font-mono tabular-nums text-emerald-400">{availableBasis} €</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Taux légal indicatif :</span>
                <span className="font-mono tabular-nums text-amber-300">
                  {(ratePerChild * 100).toFixed(1)}% / enfant
                </span>
              </div>
            </div>

            <button
              onClick={handleAskAI}
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold rounded-xl transition-all shadow-md text-xs uppercase tracking-wider cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Demander l'analyse de Maître Juriste</span>
            </button>
          </div>

          {/* Quick Notice Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Bases légales et facteurs d'influence</span>
            </div>
            <ul className="space-y-1.5 list-disc pl-4 text-[12px] leading-relaxed">
              <li>
                <strong>Article 371-2 du Code civil :</strong> Chacun des parents contribue à proportion de ses ressources et des besoins de l'enfant.
              </li>
              <li>
                <strong>Intermédiation ARIPA :</strong> Prélèvement automatique sécurisé par la CAF sans frais.
              </li>
              <li>
                <strong>Frais exceptionnels :</strong> Non inclus dans ce montant forfaitaire (orthodontie, voyages scolaires, permis).
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Explanatory Guide Section: Bases du calcul et facteurs influençant */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-700" />
          <span>Comprendre les bases du calcul et les critères du JAF</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
          <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">1. La table de référence officielle</h3>
            <p className="leading-relaxed">
              Instaurée par le Ministère de la Justice, la table détermine le montant par enfant après soustraction d'un montant incompressible correspondant au <strong>RSA pour une personne seule (635 € en 2026)</strong>. Ce seuil garantit que le parent débiteur conserve de quoi subvenir à ses besoins vitaux.
            </p>
          </div>

          <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">2. La prise en compte des deux parents</h3>
            <p className="leading-relaxed">
              Bien que la formule de base s'applique sur le revenu du débiteur, le Juge aux Affaires Familiales (JAF) compare systématiquement les <strong>facultés contributives des deux parents</strong>. En cas de revenus très élevés de l'un ou de précarité de l'autre, le juge module le montant pour respecter la proportionnalité légale.
            </p>
          </div>

          <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">3. Les facteurs d'ajustement du JAF</h3>
            <p className="leading-relaxed">
              Le juge n'est pas un robot : il examine les <strong>charges incompressibles</strong> (loyer, remboursements de crédit immobilier ou consommation souscrit durant l'union), l'existence de nouveaux enfants d'une seconde union, et les besoins spécifiques de l'enfant (handicap, études supérieures coûteuses).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
