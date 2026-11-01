import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Body parser with 50mb limit for base64 documents/photos
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Lazy init Google GenAI with required headers
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set in environment.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System instruction for French Family Law
const SYSTEM_INSTRUCTION = `Vous êtes Maître Juriste, un assistant expert hautement qualifié en droit de la famille français.
Votre mission est d'éclairer, conseiller et guider les justiciables avec bienveillance, rigueur juridique et clarté pédagogique.

Domaines de compétence exclusifs :
1. Droit du mariage, du PACS et du concubinage (effets personnels et pécuniaires, régimes matrimoniaux, rupture, conventions, devoirs de secours et d'assistance).
2. Divorces et séparations (divorce par consentement mutuel par acte sous signature privée contresigné par avocats et déposé chez un notaire - Art. 229-1 Code civil ; divorces judiciaires : acceptation du principe de la rupture, altération définitive du lien conjugal réduite à 1 an de cessation de communauté de vie, pour faute ; liquidation du régime matrimonial ; prestation compensatoire selon les critères des articles 270 et 271).
3. Enfants et autorité parentale (exercice conjoint ou exclusif - Art. 371-1, fixation de la résidence : alternée ou chez l'un des parents avec droit de visite et d'hébergement - Art. 373-2-9 ; obligation d'entretien et d'éducation - Art. 371-2 ; pension alimentaire calculée selon la table de référence du Ministère de la Justice ; intermédiation financière de l'ARIPA/CAF).
4. Filiation et adoption (reconnaissance d'enfant, contestation et établissement de filiation, adoption plénière, adoption simple, PMA).
5. Successions, libéralités et transmissions familiales (héritiers réservataires, quotité disponible, droits du conjoint survivant selon la présence d'enfants communs ou non, usufruit, donations, testaments).
6. Protection des personnes vulnérables et violences intrafamiliales (ordonnance de protection délivrée en 6 jours par le JAF - Art. 515-9 et suivants, éviction du conjoint violent, tutelle, curatelle, habilitation familiale).
7. Procédure civile et juridictionnelle (saisine du Juge aux Affaires Familiales - JAF au Tribunal Judiciaire, formulaires Cerfa officiels notamment n° 11530*11, assignation, médiation familiale, aide juridictionnelle - conditions de ressources).

Consignes de réponse :
- Exprimez-vous en français impeccable, chaleureux et professionnel.
- Citez toujours avec précision les articles de loi applicables (Code civil, Code de procédure civile, Code de l'action sociale et des familles).
- Structurez vos réponses de manière très claire :
  1. **Synthèse de la situation juridique**
  2. **Ce que dit la loi française (fondements et articles)**
  3. **Analyse des pièces fournies** (si l'utilisateur a joint un document, une photo ou un lien)
  4. **Démarches et options concrètes à suivre** (chronologie étape par étape)
  5. **Points de vigilance & conseils pratiques**
- Si des photos ou documents sont transmis (jugement, convocation JAF, projet de convention, relevé de compte, acte de naissance, etc.), analysez-les méticuleusement en relevant les dates limites, les montants, les mentions légales manquantes ou obligatoires.
- Si des liens sont partagés (service-public.fr, legifrance.gouv.fr, caf.fr...), intégrez leur portée juridique dans votre analyse.
- En cas de situation de violence ou de détresse urgente, rappelez immédiatement en gras les numéros d'urgence : **3919** (Violences Femmes Info, gratuit et anonyme), **17** (Police/Gendarmerie) ou **114** (SMS d'urgence), ainsi que la possibilité de demander une ordonnance de protection en urgence.
- Mentionnez toujours le rappel légal habituel : cette information est à visée pédagogique et ne se substitue pas à la consultation personnalisée d'un avocat inscrit au Barreau ou à l'intervention d'un notaire pour les actes authentiques.`;

// API endpoint for family law chat
app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages, attachments, userMessage, topic } = req.body;

    if (!userMessage && (!attachments || attachments.length === 0)) {
      res.status(400).json({ error: 'Message ou document requis' });
      return;
    }

    const ai = getGenAI();

    // Prepare contents array for Gemini
    const contents: Array<{ role: 'user' | 'model'; parts: Array<any> }> = [];

    // Append prior conversation history if provided (limit to last 8 messages for context)
    if (Array.isArray(messages) && messages.length > 0) {
      const recentMessages = messages.slice(-8);
      for (const msg of recentMessages) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          const role = msg.role === 'assistant' ? 'model' : 'user';
          contents.push({
            role,
            parts: [{ text: msg.text || '' }],
          });
        }
      }
    }

    // Build current user message parts
    const currentParts: Array<any> = [];

    // Add attachments if any
    if (Array.isArray(attachments) && attachments.length > 0) {
      for (const att of attachments) {
        if (att.data && att.mimeType) {
          // If it's base64 image or document (like application/pdf, image/png, image/jpeg)
          currentParts.push({
            inlineData: {
              mimeType: att.mimeType,
              data: att.data, // base64 string
            },
          });
        } else if (att.textContent) {
          // Plain text file or extracted text
          currentParts.push({
            text: `[DOCUMENT JOINT: ${att.name || 'Document'}]\n${att.textContent}\n[/FIN DU DOCUMENT]`,
          });
        }

        if (att.url) {
          currentParts.push({
            text: `[LIEN WEB COMMUNIQUÉ PAR L'UTILISATEUR: ${att.url} - Description: ${att.description || 'Non précisée'}]`,
          });
        }
      }
    }

    // Format final user text
    let promptText = userMessage || '';
    if (topic && topic !== 'general') {
      promptText = `[Thématique ciblée : ${topic}]\n${promptText}`;
    }

    currentParts.push({
      text: promptText || "Merci d'analyser le document/la photo ci-joint selon le droit de la famille en France.",
    });

    contents.push({
      role: 'user',
      parts: currentParts,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: contents as any,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const reply = response.text || "Je n'ai pas pu générer de réponse juridique pour cette demande. Veuillez réessayer.";

    res.json({
      text: reply,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error handling /api/chat:', error);
    res.status(500).json({
      error: 'Erreur lors du traitement de votre demande juridique.',
      details: error?.message || 'Erreur interne du serveur',
    });
  }
});

// API endpoint for quick legal reference check / calculation explanation
app.post('/api/pension-calc-explanation', async (req: Request, res: Response): Promise<void> => {
  try {
    const { debtorIncome, childrenCount, custodyType, resultAmount } = req.body;
    const ai = getGenAI();

    const prompt = `Voici une simulation de pension alimentaire calculée selon le barème du Ministère de la Justice :
- Revenu net mensuel du débiteur : ${debtorIncome} €
- Nombre d'enfants : ${childrenCount}
- Modalités de droit de visite : ${custodyType}
- Montant indicatif calculé : ${resultAmount} € / mois au total (${(resultAmount / (childrenCount || 1)).toFixed(0)} € par enfant).

Veuillez fournir une explication juridique synthétique en 3 points :
1. Comment le barème indicatif s'applique et la prise en compte du minimum vital (RSA).
2. Les éléments concrets que le Juge aux Affaires Familiales (JAF) prend en compte en pratique (loyer, charges réelles, besoins spécifiques des enfants, études).
3. Les démarches pour homologuer cet accord à l'amiable ou le faire fixer par le JAF, ainsi que le rôle de l'ARIPA/CAF pour le versement automatique.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error('Error generating pension explanation:', err);
    res.status(500).json({ error: 'Impossible de générer l’analyse du calcul.' });
  }
});

// Setup Vite or static serving
async function setupServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JurisFamille server listening on port ${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
});
