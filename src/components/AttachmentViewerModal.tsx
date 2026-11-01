import React from 'react';
import { Attachment } from '../types';
import { X, ExternalLink, FileText, Download, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

interface AttachmentViewerModalProps {
  attachment: Attachment | null;
  onClose: () => void;
}

export const AttachmentViewerModal: React.FC<AttachmentViewerModalProps> = ({
  attachment,
  onClose,
}) => {
  if (!attachment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 sm:p-6">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs">
              {attachment.type === 'image' ? (
                <ImageIcon className="w-4 h-4 text-emerald-600" />
              ) : attachment.type === 'document' ? (
                <FileText className="w-4 h-4 text-blue-600" />
              ) : (
                <LinkIcon className="w-4 h-4 text-amber-600" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 truncate max-w-md">
                {attachment.name}
              </h3>
              <p className="text-xs text-slate-500">
                {attachment.type === 'image'
                  ? 'Photo / Scan de document'
                  : attachment.type === 'document'
                  ? 'Document juridique'
                  : 'Lien internet officiel'}
                {attachment.size ? ` · ${(attachment.size / 1024).toFixed(0)} Ko` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {attachment.url && (
              <a
                href={attachment.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <span>Ouvrir l'adresse</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-auto p-6 bg-slate-100/50 flex flex-col items-center justify-center">
          {attachment.type === 'image' && attachment.previewUrl ? (
            <div className="w-full max-h-[65vh] flex items-center justify-center overflow-hidden rounded-xl bg-slate-900 shadow-inner">
              <img
                src={attachment.previewUrl}
                alt={attachment.name}
                className="max-h-[65vh] w-auto max-w-full object-contain"
              />
            </div>
          ) : attachment.type === 'document' && attachment.textContent ? (
            <div className="w-full bg-white rounded-xl p-5 border border-slate-200 shadow-xs max-h-[65vh] overflow-auto">
              <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Contenu textuel extrait pour analyse :
              </div>
              <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed">
                {attachment.textContent}
              </pre>
            </div>
          ) : attachment.type === 'document' && attachment.mimeType === 'application/pdf' && attachment.previewUrl ? (
            <div className="w-full h-[65vh] bg-white rounded-xl overflow-hidden border border-slate-200">
              <iframe
                src={attachment.previewUrl}
                className="w-full h-full"
                title={attachment.name}
              />
            </div>
          ) : (
            <div className="text-center py-12 px-6">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 mx-auto flex items-center justify-center mb-3">
                <LinkIcon className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">{attachment.name}</h4>
              <p className="text-xs text-slate-500 max-w-sm mb-4">
                {attachment.description || 'Lien fourni pour enrichir la consultation juridique.'}
              </p>
              {attachment.url && (
                <a
                  href={attachment.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Visiter le site source
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
