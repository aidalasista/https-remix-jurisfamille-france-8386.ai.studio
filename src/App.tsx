import React, { useState, useEffect } from 'react';
import { ActiveTab, ChatMessage, Attachment } from './types';
import { Header } from './components/Header';
import { ChatArea } from './components/ChatArea';
import { PensionSimulator } from './components/PensionSimulator';
import { LetterTemplates } from './components/LetterTemplates';
import { FAQSection } from './components/FAQSection';
import { LegalGuides } from './components/LegalGuides';
import { EmergencyDirectory } from './components/EmergencyDirectory';
import { MessageSquare, Calculator, FileText, BookOpen, PhoneCall, HelpCircle } from 'lucide-react';

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome_1',
  role: 'assistant',
  text: `Bonjour et bienvenue au service **JurisFamille France**. 

Je suis votre assistant juridique spécialisé en **droit de la famille en France** (Code civil, Code de procédure civile et jurisprudence).

Je peux vous éclairer sur :
- **Divorces et séparations** (consentement mutuel sans juge par acte d'avocat, divorce contentieux, liquidation de régime matrimonial, prestation compensatoire).
- **Enfants et autorité parentale** (résidence alternée, droit de visite et d'hébergement, calcul de pension alimentaire selon le barème officiel du Ministère de la Justice, intermédiation ARIPA).
- **Mariage, PACS et union libre** (contrats, devoirs entre époux, rupture de PACS, concubinage).
- **Filiation et adoption** (reconnaissance, adoption simple ou plénière).
- **Successions et transmissions familiales** (réserve héréditaire des enfants, quotité disponible, droits du conjoint survivant).
- **Protection contre les violences intrafamiliales** (ordonnance de protection délivrée en urgence sous 6 jours par le JAF - Art. 515-9).

📎 **Analyse de vos pièces :** Vous pouvez joindre à tout moment vos **documents** (conventions, jugements, formulaires Cerfa), vos **photos** (photos de lettres, convocations, relevés) ou vos **liens internet** (Légifrance, Service-Public.fr, CAF).

*Avertissement légal : Cet échange fournit des renseignements juridiques et méthodologiques généraux et ne remplace pas une consultation formelle auprès d'un avocat inscrit à un Barreau français.*

Comment puis-je vous accompagner aujourd'hui ?`,
  timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('jurisfamille_messages_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [INITIAL_WELCOME_MESSAGE];
  });
  const [isLoading, setIsLoading] = useState(false);

  // Persist messages
  useEffect(() => {
    try {
      localStorage.setItem('jurisfamille_messages_v1', JSON.stringify(messages));
    } catch {
      // ignore quota exceeded
    }
  }, [messages]);

  // Send message to Gemini backend
  const handleSendMessage = async (
    text: string,
    attachments: Attachment[] = [],
    topic: string = 'general'
  ) => {
    const userMsgId = 'usr_' + Date.now();
    const timeStr = new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMessage: ChatMessage = {
      id: userMsgId,
      role: 'user',
      text: text || '(Analyse des pièces jointes demandée)',
      timestamp: timeStr,
      attachments: attachments.length > 0 ? attachments : undefined,
      topic,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages, // history
          userMessage: text,
          attachments: attachments.map((a) => ({
            name: a.name,
            mimeType: a.mimeType,
            data: a.data,
            textContent: a.textContent,
            url: a.url,
            description: a.description,
          })),
          topic,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Erreur serveur (${response.status})`);
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: 'ast_' + Date.now(),
        role: 'assistant',
        text: data.text,
        timestamp: new Date().toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: 'err_' + Date.now(),
        role: 'assistant',
        text: `⚠️ **Une difficulté technique est survenue lors du traitement :** ${
          err?.message || 'Erreur inconnue'
        }.

Veuillez vérifier votre connexion ou reformuler votre question. Si vous avez joint des documents volumineux, essayez de transmettre un extrait de texte ou une photo plus légère.`,
        timestamp: new Date().toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    if (window.confirm('Voulez-vous effacer l’historique de cette consultation juridique ?')) {
      setMessages([INITIAL_WELCOME_MESSAGE]);
      localStorage.removeItem('jurisfamille_messages_v1');
    }
  };

  const handleTransferToChat = (query: string, category: string) => {
    setActiveTab('chat');
    handleSendMessage(query, [], category);
  };

  return (
    <div className="min-h-full flex flex-col bg-slate-50 text-slate-900">
      {/* Universal 3-Zone Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewChat={() => {
          setMessages([INITIAL_WELCOME_MESSAGE]);
          localStorage.removeItem('jurisfamille_messages_v1');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16 md:pb-0">
        {activeTab === 'chat' && (
          <ChatArea
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onResetChat={handleResetChat}
            onOpenSimulatorWithQuery={(q) => handleTransferToChat(q, 'pension')}
          />
        )}

        {activeTab === 'faq' && (
          <FAQSection onAskInChat={handleTransferToChat} />
        )}

        {activeTab === 'simulator' && (
          <PensionSimulator onTransferToChat={handleTransferToChat} />
        )}

        {activeTab === 'letters' && (
          <LetterTemplates onTransferToChat={handleTransferToChat} />
        )}

        {activeTab === 'guides' && (
          <LegalGuides onOpenChatWithTopic={handleTransferToChat} />
        )}

        {activeTab === 'emergency' && <EmergencyDirectory />}
      </main>

      {/* Mobile Bottom Navigation Bar (≤15% of viewport height) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex items-center justify-around h-14 px-2 shadow-lg">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
            activeTab === 'chat' ? 'text-blue-700 font-semibold' : 'text-slate-500'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Chat</span>
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
            activeTab === 'faq' ? 'text-blue-700 font-semibold' : 'text-slate-500'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">FAQ</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
            activeTab === 'simulator' ? 'text-blue-700 font-semibold' : 'text-slate-500'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Pension</span>
        </button>

        <button
          onClick={() => setActiveTab('letters')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
            activeTab === 'letters' ? 'text-blue-700 font-semibold' : 'text-slate-500'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Modèles</span>
        </button>

        <button
          onClick={() => setActiveTab('emergency')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
            activeTab === 'emergency' ? 'text-blue-700 font-semibold' : 'text-slate-500'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Urgences</span>
        </button>
      </nav>
    </div>
  );
}
