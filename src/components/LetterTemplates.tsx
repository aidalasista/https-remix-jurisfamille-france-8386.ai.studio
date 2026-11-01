import React, { useState } from 'react';
import { LETTER_TEMPLATES } from '../data/legalData';
import { LetterTemplate } from '../types';
import { FileText, Copy, Check, Download, MessageSquare, Sparkles, Scale } from 'lucide-react';

interface LetterTemplatesProps {
  onTransferToChat: (query: string, category: string) => void;
}

export const LetterTemplates: React.FC<LetterTemplatesProps> = ({ onTransferToChat }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<LetterTemplate>(LETTER_TEMPLATES[0]);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  // Update a field
  const handleFieldChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  // Replace placeholders in content
  const getRenderedContent = () => {
    let result = selectedTemplate.content;
    for (const field of selectedTemplate.fields) {
      const val = formValues[field.key] || `[${field.label}]`;
      result = result.split(`{${field.key}}`).join(val);
    }
    return result;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getRenderedContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([getRenderedContent()], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedTemplate.id}_courrier_juridique.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePersonalizeWithAI = () => {
    const rendered = getRenderedContent();
    const query = `Je prépare le courrier juridique suivant : "${selectedTemplate.title}".
Voici le projet de lettre :
---
${rendered}
---
Peux-tu relire ce courrier, vérifier qu'il est juridiquement inattaquable selon le Code civil et le Code de procédure civile, m'indiquer les pièces justificatives obligatoires à joindre et me préciser la démarche d'envoi recommandée (LRAR, commissaire de justice, greffe JAF) ?`;

    onTransferToChat(query, selectedTemplate.category);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200/70 rounded-full text-xs font-semibold text-blue-900 mb-3">
          <Scale className="w-3.5 h-3.5 text-blue-700" />
          <span>Modèles conformes au Code civil français</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          Modèles de Lettres & Démarches Types
        </h1>
        <p className="text-sm text-slate-600">
          Courriers types rédigés par des juristes pour vos démarches amiables ou contentieuses auprès du JAF, de votre ex-conjoint ou de l'ARIPA.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Template Selection List */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Sélectionner un modèle :
          </h2>
          {LETTER_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => {
                setSelectedTemplate(tmpl);
                setFormValues({});
              }}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedTemplate.id === tmpl.id
                  ? 'border-blue-600 bg-white ring-2 ring-blue-600/10 shadow-sm'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                  {tmpl.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {tmpl.fields.length} champs
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">{tmpl.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{tmpl.description}</p>
            </button>
          ))}
        </div>

        {/* Right Column: Customizer & Real-time Document Preview */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Top Bar of Editor */}
          <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">{selectedTemplate.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Base légale : <span className="font-medium text-slate-700">{selectedTemplate.legalBasis}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-700 shadow-xs transition-colors"
                title="Copier le texte"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-700 shadow-xs transition-colors"
                title="Télécharger en fichier texte"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger</span>
              </button>

              <button
                onClick={handlePersonalizeWithAI}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Faire valider par l'IA</span>
              </button>
            </div>
          </div>

          {/* Form Fields Accordion / Grid */}
          <div className="p-5 bg-slate-50/80 border-b border-slate-200">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Remplir vos données (mise à jour instantanée du courrier) :
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedTemplate.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={formValues[field.key] || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Letter text display */}
          <div className="p-6 bg-white overflow-auto max-h-[500px]">
            <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed">
              {getRenderedContent()}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
