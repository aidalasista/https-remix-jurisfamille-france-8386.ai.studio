import React, { useState, useRef } from 'react';
import { Attachment } from '../types';
import { FileText, Image as ImageIcon, Link as LinkIcon, X, Plus, ExternalLink, Eye, Sparkles } from 'lucide-react';
import { SAMPLE_DOCUMENTS } from '../data/legalData';

interface AttachmentManagerProps {
  attachments: Attachment[];
  onAddAttachment: (att: Attachment) => void;
  onRemoveAttachment: (id: string) => void;
  onPreviewAttachment: (att: Attachment) => void;
}

export const AttachmentManager: React.FC<AttachmentManagerProps> = ({
  attachments,
  onAddAttachment,
  onRemoveAttachment,
  onPreviewAttachment,
}) => {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlDescription, setUrlDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Handle document upload (PDF, TXT, DOCX)
  const handleDocumentChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        if (file.type === 'application/pdf') {
          // Read PDF as base64
          const base64Data = await readFileAsBase64(file);
          onAddAttachment({
            id: 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            name: file.name,
            type: 'document',
            size: file.size,
            mimeType: 'application/pdf',
            data: base64Data.split(',')[1] || base64Data,
            previewUrl: base64Data,
          });
        } else {
          // Read plain text / markdown / code
          const text = await readFileAsText(file);
          onAddAttachment({
            id: 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            name: file.name,
            type: 'document',
            size: file.size,
            mimeType: file.type || 'text/plain',
            textContent: text,
          });
        }
      } catch (err) {
        console.error('Failed to read file:', err);
      }
    }
    setIsProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle photo/image upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const base64Data = await readFileAsBase64(file);
        const mimeType = file.type || 'image/jpeg';
        onAddAttachment({
          id: 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          name: file.name,
          type: 'image',
          size: file.size,
          mimeType,
          data: base64Data.split(',')[1] || base64Data,
          previewUrl: base64Data,
        });
      } catch (err) {
        console.error('Failed to read image:', err);
      }
    }
    setIsProcessing(false);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  // Handle adding web link
  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    let validUrl = urlInput.trim();
    if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
      validUrl = 'https://' + validUrl;
    }

    try {
      const parsed = new URL(validUrl);
      onAddAttachment({
        id: 'link_' + Date.now(),
        name: parsed.hostname + (parsed.pathname.length > 1 ? parsed.pathname.slice(0, 20) + '...' : ''),
        type: 'link',
        url: validUrl,
        description: urlDescription.trim() || 'Lien juridique vers ' + parsed.hostname,
      });
      setUrlInput('');
      setUrlDescription('');
      setShowLinkModal(false);
    } catch {
      // invalid URL
    }
  };

  // Load a pre-made sample document for instant testing
  const handleLoadSample = (sample: typeof SAMPLE_DOCUMENTS[0]) => {
    onAddAttachment({
      id: 'sample_' + Date.now(),
      name: sample.name,
      type: 'document',
      size: sample.textContent.length,
      mimeType: 'text/plain',
      textContent: sample.textContent,
    });
  };

  return (
    <div className="w-full">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.txt,.doc,.docx,.rtf"
        onChange={handleDocumentChange}
        className="hidden"
      />
      <input
        ref={imageInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      {/* Attachments Chips Bar */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-3 p-2.5 bg-slate-100 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
            Pièces jointes ({attachments.length}) :
          </span>

          {attachments.map((att) => (
            <div
              key={att.id}
              className="group flex items-center gap-2 py-1 px-2.5 bg-white rounded-lg border border-slate-200 text-xs shadow-xs hover:border-slate-300 transition-all"
            >
              {att.type === 'image' ? (
                att.previewUrl ? (
                  <img
                    src={att.previewUrl}
                    alt={att.name}
                    className="w-5 h-5 rounded object-cover cursor-pointer"
                    onClick={() => onPreviewAttachment(att)}
                  />
                ) : (
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                )
              ) : att.type === 'document' ? (
                <FileText className="w-4 h-4 text-blue-600" />
              ) : (
                <LinkIcon className="w-4 h-4 text-amber-600" />
              )}

              <span
                onClick={() => onPreviewAttachment(att)}
                className="max-w-[140px] truncate font-medium text-slate-700 cursor-pointer hover:text-blue-700"
                title={att.name}
              >
                {att.name}
              </span>

              {att.size && (
                <span className="text-[10px] text-slate-400 font-mono">
                  {(att.size / 1024).toFixed(0)}Ko
                </span>
              )}

              <button
                type="button"
                onClick={() => onPreviewAttachment(att)}
                className="text-slate-400 hover:text-slate-700 transition-colors p-0.5"
                title="Prévisualiser"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onRemoveAttachment(att.id)}
                className="text-slate-400 hover:text-rose-600 transition-colors p-0.5"
                title="Supprimer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Attachment Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors hover:border-slate-300"
        >
          <FileText className="w-3.5 h-3.5 text-blue-600" />
          <span>Ajouter document (PDF, TXT)</span>
        </button>

        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          disabled={isProcessing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors hover:border-slate-300"
        >
          <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
          <span>Ajouter photo / scan</span>
        </button>

        <button
          type="button"
          onClick={() => setShowLinkModal(true)}
          disabled={isProcessing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors hover:border-slate-300"
        >
          <LinkIcon className="w-3.5 h-3.5 text-amber-600" />
          <span>Ajouter un lien web</span>
        </button>

        {/* Dropdown or quick button for sample documents */}
        <div className="relative group ml-auto">
          <button
            type="button"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors font-medium text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Tester avec document exemple</span>
          </button>
          <div className="hidden group-hover:block absolute right-0 bottom-full mb-1 w-64 bg-white border border-slate-200 shadow-lg rounded-xl p-1.5 z-30">
            <div className="text-[11px] font-semibold text-slate-400 px-2 py-1">
              Documents types à analyser :
            </div>
            {SAMPLE_DOCUMENTS.map((sample) => (
              <button
                key={sample.name}
                type="button"
                onClick={() => handleLoadSample(sample)}
                className="w-full text-left px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-md truncate font-medium"
              >
                {sample.name.replace('.txt', '')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal to add link */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <LinkIcon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Joindre un lien internet
                </h3>
              </div>
              <button
                onClick={() => setShowLinkModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Indiquez l’adresse d’un article de loi (Légifrance), d’une fiche Service-Public.fr, de la CAF ou d’un document en ligne pour examen juridique.
            </p>

            <form onSubmit={handleAddLink} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL du lien *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://www.service-public.fr/particuliers/vosdroits/..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description ou contexte (optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Ex : Barème officiel CAF ou fiche divorce par consentement mutuel"
                  value={urlDescription}
                  onChange={(e) => setUrlDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium shadow-xs"
                >
                  Ajouter à la consultation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper utilities for files
function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
