export interface Attachment {
  id: string;
  name: string;
  type: 'document' | 'image' | 'link';
  size?: number;
  mimeType?: string;
  data?: string; // base64 representation without data URL prefix (for Gemini inlineData)
  previewUrl?: string; // full data URL or preview string
  url?: string; // for web links
  description?: string;
  textContent?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  attachments?: Attachment[];
  topic?: string;
  suggestedFollowUps?: string[];
}

export type ActiveTab = 'chat' | 'simulator' | 'letters' | 'faq' | 'guides' | 'emergency';

export interface PensionParams {
  debtorNetIncome: number;
  creditorNetIncome: number;
  childrenCount: number;
  custodyMode: 'classique' | 'reduit' | 'alterne';
  debtorHousingCosts?: number;
  creditorHousingCosts?: number;
}

export interface LetterTemplate {
  id: string;
  title: string;
  category: 'accord_parental' | 'divorce' | 'pacs' | 'pension' | 'enfants' | 'urgence';
  description: string;
  targetRecipient: string;
  legalBasis: string;
  content: string;
  fields: { key: string; label: string; placeholder: string; defaultValue?: string }[];
}

export interface FAQItem {
  id: string;
  category: 'divorce' | 'garde' | 'pension' | 'filiation' | 'pacs_mariage';
  categoryLabel: string;
  question: string;
  answer: string;
  legalArticles: string[];
  keyTakeaway: string;
}

export interface LegalGuideTopic {
  id: string;
  title: string;
  subtitle: string;
  codeArticles: string[];
  keyRules: string[];
  deadlinesAndCosts: string;
  recommendedSteps: string[];
}
