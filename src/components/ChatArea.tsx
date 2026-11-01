import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Attachment } from '../types';
import { AttachmentManager } from './AttachmentManager';
import { AttachmentViewerModal } from './AttachmentViewerModal';
import { QUICK_LEGAL_QUESTIONS } from '../data/legalData';
import {
  Send,
  Scale,
  User,
  Copy,
  Check,
  Volume2,
  VolumeX,
  FileDown,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
} from 'lucide-react';

interface ChatAreaProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, attachments: Attachment[], topic: string) => Promise<void>;
  isLoading: boolean;
  onResetChat: () => void;
  onOpenSimulatorWithQuery?: (query: string) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onResetChat,
}) => {
  const [inputText, setInputText] = useState('');
  const [currentAttachments, setCurrentAttachments] = useState<Attachment[]>([]);
  const [selectedTopic, setSelectedTopic] = useState('general');
  const [selectedPreviewAttachment, setSelectedPreviewAttachment] = useState<Attachment | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle send message
  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputText.trim() && currentAttachments.length === 0) || isLoading) return;

    const textToSend = inputText;
    const attachmentsToSend = [...currentAttachments];

    setInputText('');
    setCurrentAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    await onSendMessage(textToSend, attachmentsToSend, selectedTopic);
  };

  // Keyboard shortcut: Enter to submit, Shift+Enter for newline
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
  };

  // Copy message text
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  // Text to speech (French voice)
  const handleSpeak = (id: string, text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeakingId === id) {
      window.speechSynthesis.cancel();
      setIsSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.05;

    // Pick a french voice if available
    const voices = window.speechSynthesis.getVoices();
    const frenchVoice = voices.find((v) => v.lang.startsWith('fr'));
    if (frenchVoice) utterance.voice = frenchVoice;

    utterance.onend = () => setIsSpeakingId(null);
    utterance.onerror = () => setIsSpeakingId(null);

    setIsSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Export conversation as TXT/Doc
  const handleExportChat = () => {
    if (messages.length === 0) return;
    const content = messages
      .map(
        (m) =>
          `[${m.role === 'user' ? 'JUSTICIABLE' : 'MAÎTRE JURISTE'}] - ${m.timestamp}\n${m.text}\n\n`
      )
      .join('--------------------------------------------------\n\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Consultation_Droit_Famille_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto px-4 sm:px-6 py-4">
      {/* Top Banner / Topic selector & Action strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Domaine ciblé :
          </span>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-xs"
          >
            <option value="general">Général (Droit de la Famille)</option>
            <option value="divorce">Divorce & Séparation (Art. 229)</option>
            <option value="garde">Garde d'enfants & Résidence (Art. 373)</option>
            <option value="pension">Pension alimentaire & Barème CAF</option>
            <option value="mariage_pacs">Mariage, PACS & Régimes matrimoniaux</option>
            <option value="succession">Successions & Droits des héritiers</option>
            <option value="protection">Ordonnance de protection & Violences</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportChat}
            disabled={messages.length === 0}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:border-slate-300 disabled:opacity-40 transition-colors shadow-xs"
            title="Exporter l'historique de la consultation"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exporter dossier</span>
          </button>
          <button
            onClick={onResetChat}
            disabled={messages.length === 0}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-600 hover:text-rose-600 bg-white border border-slate-200 rounded-lg hover:border-slate-300 disabled:opacity-40 transition-colors shadow-xs"
            title="Effacer l'échange et recommencer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Effacer</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
        {messages.length === 0 ? (
          /* Empty state / Welcome screen */
          <div className="py-6 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-slate-900 text-amber-500 mx-auto flex items-center justify-center mb-4 shadow-sm border border-amber-600/30 overflow-hidden">
                <img
                  src="/src/assets/images/justice_france_seal_1793539691831.jpg"
                  alt="Sceau République Française"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                Consultation en Droit de la Famille
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
                Posez vos questions sur le divorce, l'autorité parentale, la pension alimentaire ou les successions. Vous pouvez également <strong>joindre des documents</strong> (conventions, jugements), des <strong>photos</strong> (lettres, convocations) ou des <strong>liens officiels</strong> pour analyse.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200/60 rounded-lg text-xs text-blue-900">
                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                <span>Analyses fondées sur le Code civil et la jurisprudence française en vigueur.</span>
              </div>
            </div>

            {/* Quick Suggestions Cards */}
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">
                Questions courantes fréquentes :
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {QUICK_LEGAL_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedTopic(q.category);
                      onSendMessage(q.query, [], q.category);
                    }}
                    className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 rounded-xl text-left transition-all shadow-xs group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-blue-900 group-hover:text-blue-700">
                        {q.title}
                      </span>
                      <Sparkles className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 transition-colors" />
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {q.query}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-4 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-amber-600/30 flex items-center justify-center shrink-0 shadow-xs overflow-hidden mt-1">
                  <img
                    src="/src/assets/images/justice_france_seal_1793539691831.jpg"
                    alt="Sceau Justice"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 sm:p-5 shadow-xs transition-all ${
                  msg.role === 'user'
                    ? 'bg-blue-700 text-white rounded-tr-xs'
                    : 'bg-white border border-slate-200 text-slate-900 rounded-tl-xs'
                }`}
              >
                {/* Header inside bubble */}
                <div className="flex items-center justify-between gap-3 mb-2 pb-1.5 border-b border-black/5 dark:border-white/10 text-xs">
                  <span
                    className={`font-semibold ${
                      msg.role === 'user' ? 'text-blue-100' : 'text-slate-800'
                    }`}
                  >
                    {msg.role === 'user' ? 'Votre situation' : 'Maître Juriste · Droit de la famille'}
                  </span>
                  <span
                    className={`text-[11px] font-mono ${
                      msg.role === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {/* Attachments within message */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mb-3 space-y-1.5">
                    <div
                      className={`text-[11px] font-medium uppercase tracking-wider ${
                        msg.role === 'user' ? 'text-blue-200' : 'text-slate-500'
                      }`}
                    >
                      Pièces et éléments transmis ({msg.attachments.length}) :
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {msg.attachments.map((att) => (
                        <button
                          key={att.id}
                          onClick={() => setSelectedPreviewAttachment(att)}
                          className={`flex items-center gap-2 p-1.5 px-2.5 rounded-lg text-xs font-medium border transition-colors ${
                            msg.role === 'user'
                              ? 'bg-blue-800/80 border-blue-600 text-white hover:bg-blue-800'
                              : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                          }`}
                        >
                          {att.type === 'image' ? (
                            att.previewUrl ? (
                              <img
                                src={att.previewUrl}
                                alt={att.name}
                                className="w-5 h-5 rounded object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-emerald-400" />
                            )
                          ) : att.type === 'document' ? (
                            <FileText className="w-4 h-4 text-blue-400" />
                          ) : (
                            <LinkIcon className="w-4 h-4 text-amber-400" />
                          )}
                          <span className="truncate max-w-[150px]">{att.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Content */}
                <div
                  className={`text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user' ? 'text-blue-50' : 'text-slate-800'
                  }`}
                >
                  {formatLegalMessage(msg.text)}
                </div>

                {/* Assistant footer actions */}
                {msg.role === 'assistant' && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 italic">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Rappel : information juridique, ne remplace pas l'avis d'un avocat.</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleSpeak(msg.id, msg.text)}
                        className={`p-1.5 rounded-md hover:bg-slate-100 transition-colors ${
                          isSpeakingId === msg.id ? 'text-blue-700 bg-blue-50' : 'text-slate-500'
                        }`}
                        title={isSpeakingId === msg.id ? 'Arrêter la lecture' : 'Écouter la réponse'}
                      >
                        {isSpeakingId === msg.id ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        title="Copier le texte"
                      >
                        {copiedMessageId === msg.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center shrink-0 text-blue-800 shadow-xs mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 sm:gap-4 justify-start">
            <div className="w-8 h-8 rounded-full bg-slate-900 border border-amber-600/30 flex items-center justify-center shrink-0 shadow-xs overflow-hidden mt-1">
              <img
                src="/src/assets/images/justice_france_seal_1793539691831.jpg"
                alt="Sceau Justice"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover animate-pulse"
              />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-4 sm:p-5 max-w-lg shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-700">
                <span>Maître Juriste analyse votre dossier...</span>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded-full w-4/5 animate-pulse" />
                <div className="h-3 bg-slate-200 rounded-full w-full animate-pulse" />
                <div className="h-3 bg-slate-200 rounded-full w-2/3 animate-pulse" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer Area */}
      <div className="pt-3 border-t border-slate-200 shrink-0">
        <form onSubmit={handleSend} className="space-y-3">
          {/* Attachments Section */}
          <AttachmentManager
            attachments={currentAttachments}
            onAddAttachment={(att) => setCurrentAttachments((prev) => [...prev, att])}
            onRemoveAttachment={(id) =>
              setCurrentAttachments((prev) => prev.filter((a) => a.id !== id))
            }
            onPreviewAttachment={(att) => setSelectedPreviewAttachment(att)}
          />

          {/* Text Input & Submit Bar */}
          <div className="relative flex items-end gap-2 bg-white rounded-2xl border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 p-2 shadow-xs transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder="Posez votre question ou détaillez les pièces jointes (ex: 'Que signifie cette clause dans mon projet de convention ?')..."
              className="flex-1 max-h-44 min-h-[40px] px-2 py-2 text-sm text-slate-900 bg-transparent resize-none focus:outline-none placeholder:text-slate-400"
            />

            <button
              type="submit"
              disabled={(!inputText.trim() && currentAttachments.length === 0) || isLoading}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 text-white font-medium shadow-xs transition-all shrink-0 active:scale-95"
              title="Envoyer la demande (Entrée)"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 px-1">
          <span>Appuyez sur Entrée pour envoyer, Maj+Entrée pour un saut de ligne</span>
          <span>Formats acceptés : PDF, Word/TXT, Images/Photos, Liens web</span>
        </div>
      </div>

      {/* Full Attachment Preview Modal */}
      <AttachmentViewerModal
        attachment={selectedPreviewAttachment}
        onClose={() => setSelectedPreviewAttachment(null)}
      />
    </div>
  );
};

// Formatter to render bold headers and clean markdown in legal text
function formatLegalMessage(text: string) {
  return text;
}
