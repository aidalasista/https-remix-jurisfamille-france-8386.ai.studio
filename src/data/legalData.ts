import { LetterTemplate, LegalGuideTopic, FAQItem } from '../types';

// Table de référence 2026 du Ministère de la Justice (pension alimentaire)
// RSA socle / minimum vital forfaitaire déduit (valeur revalorisée 2026 : 635 €)
export const MINIMUM_VITAL_RSA = 635;

export const PENSION_RATES: Record<'classique' | 'reduit' | 'alterne', Record<number, number>> = {
  // Droit de visite classique (1 week-end sur 2 et la moitié des vacances scolaires)
  classique: {
    1: 0.135, // 13.5% par enfant
    2: 0.115, // 11.5% par enfant
    3: 0.100, // 10.0% par enfant
    4: 0.088, // 8.8% par enfant
    5: 0.080, // 8.0% par enfant
    6: 0.072, // 7.2% par enfant
  },
  // Droit de visite réduit (moins d'un week-end sur deux, vacances seulement)
  reduit: {
    1: 0.180, // 18.0%
    2: 0.155, // 15.5%
    3: 0.133, // 13.3%
    4: 0.117, // 11.7%
    5: 0.106, // 10.6%
    6: 0.095, // 9.5%
  },
  // Résidence alternée (dépenses quotidiennes partagées mais disparité de ressources)
  alterne: {
    1: 0.090, // 9.0%
    2: 0.078, // 7.8%
    3: 0.068, // 6.8%
    4: 0.059, // 5.9%
    5: 0.053, // 5.3%
    6: 0.048, // 4.8%
  },
};

export const QUICK_LEGAL_QUESTIONS = [
  {
    title: 'Calcul de pension alimentaire',
    query: 'Comment est calculée la pension alimentaire pour 2 enfants avec un revenu net débiteur de 2 400 € et un revenu créancier de 1 600 € selon la table du Ministère de la Justice ?',
    category: 'pension',
  },
  {
    title: 'Divorce sans juge (Consentement mutuel)',
    query: 'Quelle est la procédure exacte du divorce sans juge par acte d’avocats déposé chez le notaire (Art. 229-1) ? Quels sont les délais et les pièces nécessaires ?',
    category: 'divorce',
  },
  {
    title: 'Accord parental amiable (JAF)',
    query: 'Comment rédiger et faire homologuer par le JAF un accord parental pour fixer la résidence alternée et la pension sans passer par un procès conflictuel ?',
    category: 'accord_parental',
  },
  {
    title: 'Garde alternée et désaccord',
    query: 'Mon ex-conjoint refuse la garde alternée pour notre enfant de 5 ans. Quels critères le Juge aux Affaires Familiales (JAF) retient-il selon l’article 373-2-9 du Code civil ?',
    category: 'garde',
  },
  {
    title: 'Déclaration et convention de PACS',
    query: 'Quelles sont les formalités en mairie ou devant notaire pour conclure un PACS ? Comment choisir entre séparation de biens et indivision ?',
    category: 'pacs',
  },
  {
    title: 'Filiation & Reconnaissance paternelle',
    query: 'Comment s’établit la filiation d’un enfant né hors mariage en France ? Comment faire une reconnaissance anticipée en mairie ?',
    category: 'filiation',
  },
];

export const FAQ_DATA: FAQItem[] = [
  // --- DIVORCE ---
  {
    id: 'faq-divorce-amiable',
    category: 'divorce',
    categoryLabel: 'Divorce & Séparation',
    question: 'Comment fonctionne le divorce par consentement mutuel sans juge ?',
    answer: `Depuis la loi de modernisation de la justice du 18 novembre 2016, les époux d'accord sur le principe et sur toutes les conséquences de leur séparation divorcent sans passer devant un magistrat. 
Chaque époux doit obligatoirement avoir son propre avocat indépendant (aucun avocat commun n'est admis). Les avocats rédigent une convention sous signature privée réglant le sort des biens, la résidence des enfants, la pension alimentaire et l'éventuelle prestation compensatoire.
Après un délai de réflexion obligatoire et incompressible de 15 jours à compter de la réception du projet en recommandé, la convention est signée puis déposée au rang des minutes d'un notaire dans les 7 jours. Le dépôt confère à la convention force exécutoire et date certaine de divorce.
Attention : si un enfant mineur demande expressément à être entendu par un juge, la procédure judiciaire classique redevient obligatoire.`,
    legalArticles: ['Article 229-1 du Code civil', 'Article 229-3 du Code civil', 'Articles 1144 et suivants du CPC'],
    keyTakeaway: 'Délai de réflexion de 15 jours obligatoire, 2 avocats obligatoires, dépôt chez notaire (frais fixes ~50 €).',
  },
  {
    id: 'faq-divorce-conjoint-refuse',
    category: 'divorce',
    categoryLabel: 'Divorce & Séparation',
    question: 'Que faire si mon conjoint refuse de divorcer ?',
    answer: `Le refus de l'autre époux ne peut pas vous empêcher de divorcer. En France, le divorce ne requiert pas obligatoirement l'accord des deux conjoints. Vous pouvez engager un divorce contentieux par l'intermédiaire d'un avocat :
1. Le divorce pour altération définitive du lien conjugal (Articles 237 et 238 du Code civil) : il suffit de prouver la cessation de la communauté de vie (séparation matérielle) depuis au moins 1 an à la date de la demande en divorce.
2. Le divorce pour faute (Article 242 du Code civil) : en cas de violation grave ou renouvelée des devoirs et obligations du mariage (violences, adultère, abandon de domicile, injures graves).
3. Le divorce pour acceptation du principe de la rupture (Article 233 du Code civil) : si les deux époux acceptent de divorcer mais sont en désaccord sur les conséquences (garde, pensions, biens).`,
    legalArticles: ['Article 237 du Code civil', 'Article 238 du Code civil', 'Article 242 du Code civil'],
    keyTakeaway: 'La séparation matérielle continue d\'un an suffit à prononcer le divorce de droit, même en cas de refus total du conjoint.',
  },
  {
    id: 'faq-prestation-compensatoire',
    category: 'divorce',
    categoryLabel: 'Divorce & Séparation',
    question: 'Comment est fixée la prestation compensatoire et qui y a droit ?',
    answer: `La prestation compensatoire est destinée à compenser, autant qu'il est possible, la disparité que la rupture du mariage crée dans les conditions de vie respectives des époux (Article 270 du Code civil). 
Elle est fixée selon les besoins de l'époux créancier et les ressources de l'époux débiteur, en tenant compte de la situation au moment du divorce et de son évolution dans un avenir prévisible.
Les critères légaux fixés par l'article 271 du Code civil comprennent :
- La durée du mariage ;
- L'âge et l'état de santé des époux ;
- Leur qualification et leur situation professionnelles ;
- Les conséquences des choix professionnels faits pendant la vie commune pour l'éducation des enfants ou pour favoriser la carrière de l'autre conjoint ;
- Le patrimoine estimé ou prévisible des époux, tant en capital qu'en revenu ;
- Les droits existants et prévisibles (retraite).
Elle est versée par principe sous forme d'un capital (somme d'argent, abandon d'un bien en pleine propriété ou en usufruit) ou exceptionnellement sous forme de rente viagère si l'âge ou la santé le justifie.`,
    legalArticles: ['Article 270 du Code civil', 'Article 271 du Code civil'],
    keyTakeaway: 'Versement en capital par principe pour effacer la disparité de train de vie consécutive aux choix du couple.',
  },

  // --- GARDE D'ENFANTS ---
  {
    id: 'faq-garde-alternee-criteres',
    category: 'garde',
    categoryLabel: 'Garde & Autorité Parentale',
    question: 'Quels critères le juge prend-il en compte pour accorder la résidence alternée ?',
    answer: `En application de l'article 373-2-9 du Code civil, la résidence de l'enfant peut être fixée en alternance au domicile de chacun des parents ou au domicile de l'un d'eux. Le Juge aux Affaires Familiales statue exclusivement au regard de l'intérêt supérieur de l'enfant en évaluant plusieurs critères concrets :
1. La proximité géographique des domiciles des parents (permettant de conserver la même école, les mêmes activités et les mêmes repères) ;
2. L'âge de l'enfant (l'alternance stricte est souvent déconseillée par les pédopsychiatres avant l'âge de 2 ou 3 ans) ;
3. La disponibilité de chaque parent et sa capacité d'accueil matériel (chambre pour l'enfant, horaires de travail compatibles) ;
4. La capacité des parents à communiquer un minimum sans conflit violent devant l'enfant ;
5. Les habitudes antérieures prises par l'enfant durant la vie commune.
Le juge peut d'abord ordonner une résidence alternée à titre provisoire (généralement 6 mois) avant de statuer définitivement.`,
    legalArticles: ['Article 373-2-9 du Code civil', 'Article 371-1 du Code civil'],
    keyTakeaway: 'Proximité des domiciles, stabilité scolaire, disponibilité parentale et âge de l\'enfant priment sur toute autre considération.',
  },
  {
    id: 'faq-audition-enfant-juge',
    category: 'garde',
    categoryLabel: 'Garde & Autorité Parentale',
    question: 'Un enfant mineur peut-il choisir lui-même chez quel parent il veut vivre ?',
    answer: `Non, un enfant mineur ne décide pas juridiquement de son lieu de résidence ; c'est le Juge aux Affaires Familiales (ou les parents d'un commun accord) qui décide. 
Cependant, l'article 388-1 du Code civil dispose que dans toute procédure le concernant, le mineur capable de discernement (généralement apprécié à partir de 8-10 ans selon la maturité) a le droit d'être entendu par le juge ou par une personne désignée par lui.
Si le mineur en fait lui-même la demande écrite, son audition est de droit (obligatoire pour le juge). Il peut être entendu seul, avec un avocat d'enfant (commis d'office et gratuit par l'aide juridictionnelle), ou avec une personne de son choix.
Le juge écoute la parole de l'enfant avec une grande attention, mais il reste libre de sa décision s'il estime que les souhaits de l'enfant sont influencés par un parent ou contraires à son équilibre et à sa sécurité.`,
    legalArticles: ['Article 388-1 du Code civil', 'Article 338-1 du CPC'],
    keyTakeaway: 'L\'enfant capable de discernement a le droit d\'être entendu avec un avocat gratuit, mais c\'est le magistrat qui tranche.',
  },
  {
    id: 'faq-non-representation-enfant',
    category: 'garde',
    categoryLabel: 'Garde & Autorité Parentale',
    question: 'Que faire si l’autre parent refuse de me remettre les enfants lors de mon droit de visite ?',
    answer: `Le refus délibéré de remettre un enfant mineur à la personne qui a le droit de le réclamer constitue le délit pénal de non-représentation d'enfant (Article 227-5 du Code pénal), passible d'un an d'emprisonnement et de 15 000 € d'amende.
Démarches à entreprendre :
1. Tentez d'abord de contacter l'autre parent par écrit (SMS, email) pour acter votre présence à l'heure et au lieu fixés par le jugement.
2. Rendez-vous au commissariat de police ou à la brigade de gendarmerie pour déposer une plainte formelle pour non-représentation d'enfant (munissez-vous d'une copie exécutoire du jugement ou de la convention homologuée).
3. Vous pouvez également faire constater la carence par un commissaire de justice (huissier).
4. Si la situation se répète, saisissez le JAF en référé pour solliciter le transfert de la résidence habituelle de l'enfant à votre domicile en raison du non-respect de vos droits parentaux.`,
    legalArticles: ['Article 227-5 du Code pénal', 'Article 373-2 du Code civil'],
    keyTakeaway: 'Délit pénal passible de prison et amende. Déposer plainte avec la décision exécutoire et solliciter le JAF si récidive.',
  },

  // --- PENSION ALIMENTAIRE ---
  {
    id: 'faq-pension-bareme-calcul',
    category: 'pension',
    categoryLabel: 'Pension Alimentaire',
    question: 'Comment est calculée la pension alimentaire et que couvre-t-elle ?',
    answer: `L'obligation d'entretien et d'éducation des enfants découle de l'article 371-2 du Code civil. Chaque parent y contribue à proportion de ses ressources et des besoins de l'enfant.
Le Ministère de la Justice publie une table de référence indicative utilisée par la majorité des juges :
- Calcul de l'assiette disponible : Revenu net mensuel du parent débiteur déduction faite du minimum vital vital (fixé au montant forfaitaire du RSA pour une personne seule, soit 635 € en 2026).
- Application d'un pourcentage par enfant selon l'amplitude du droit de visite (en moyenne 11,5% par enfant pour 2 enfants en garde classique, 18% en garde réduite, et 7,8% en garde alternée).
Que couvre la pension ? Elle couvre les dépenses courantes de la vie quotidienne de l'enfant (nourriture, vêtements, hébergement, cantine scolaire usuelle). Les dépenses exceptionnelles (voyages scolaires coûteux, permis de conduire, soins médicaux non remboursés comme l'orthodontie) sont généralement partagées par moitié entre les parents en sus de la pension.`,
    legalArticles: ['Article 371-2 du Code civil', 'Table de référence Ministère de la Justice'],
    keyTakeaway: 'Assiette contributive = Revenu net débiteur moins le minimum vital RSA (635 €), multipliée par le taux indicatif officiel.',
  },
  {
    id: 'faq-pension-aripa-caf',
    category: 'pension',
    categoryLabel: 'Pension Alimentaire',
    question: 'Comment fonctionne l’intermédiation financière automatique de la CAF / ARIPA ?',
    answer: `Depuis le 1er janvier 2023, le service public d'intermédiation financière des pensions alimentaires (IFPA), géré par l'ARIPA (branche de la CAF et de la MSA), est devenu obligatoire et automatique pour toutes les décisions de justice et conventions homologuées fixant une pension pour enfants.
Fonctionnement :
- La CAF prélève chaque mois la pension directement sur le compte bancaire du parent débiteur et la reverse sans délai sur le compte du parent créancier.
- En cas de défaillance ou de compte non approvisionné, la CAF verse immédiatement à l'autre parent l'Allocation de Soutien Familial (ASF) à titre d'avance et engage elle-même les poursuites de recouvrement forcé contre le débiteur sans frais pour le créancier.
- Les parents peuvent uniquement refuser l'intermédiation par accord conjoint exprès mentionné dans la décision de justice ou convention d'avocats.`,
    legalArticles: ['Article L. 582-1 du Code de la sécurité sociale', 'Article 373-2-2 du Code civil'],
    keyTakeaway: 'Prélèvement et virement gérés gratuitement par la CAF pour éliminer définitivement les retards et les impayés.',
  },
  {
    id: 'faq-pension-apres-18-ans',
    category: 'pension',
    categoryLabel: 'Pension Alimentaire',
    question: 'La pension alimentaire s’arrête-t-elle automatiquement à la majorité (18 ans) ?',
    answer: `Non, absolument pas. C'est une idée reçue très fréquente. L'article 371-2 alinéa 2 du Code civil énonce expressément que l'obligation d'entretien ne cesse pas de plein droit lorsque l'enfant est majeur.
La pension reste due tant que le jeune adulte n'est pas en mesure de subvenir lui-même à ses besoins, notamment lorsqu'il poursuit des études supérieures de manière assidue et sérieuse, ou lorsqu'il est en recherche effective d'un premier emploi.
Le parent qui verse la pension ne peut pas décider unilatéralement de stopper les virements à 18 ans. Pour faire cesser la pension, il doit obtenir soit l'accord écrit de l'autre parent (ou de l'enfant majeur s'il perçoit directement la somme), soit une décision du JAF constatant l'autonomie financière de l'enfant (justifiée par un contrat de travail à temps plein ou la fin des études).`,
    legalArticles: ['Article 371-2 du Code civil'],
    keyTakeaway: 'La pension continue d\'être due au-delà de 18 ans tant que l\'enfant étudie assidûment ou recherche son premier emploi.',
  },

  // --- FILIATION & ADOPTION ---
  {
    id: 'faq-reconnaissance-enfant-naturel',
    category: 'filiation',
    categoryLabel: 'Filiation & Adoption',
    question: 'Comment reconnaître un enfant né de parents non mariés ?',
    answer: `Pour la mère, la filiation est automatiquement établie dès lors que son nom figure sur l'acte de naissance de l'enfant (Article 311-25 du Code civil).
Pour le père non marié, la reconnaissance est obligatoire pour créer le lien de filiation juridique :
1. Reconnaissance anticipée (fortement recommandée) : le père peut se présenter dans n'importe quelle mairie avant la naissance, muni de sa pièce d'identité et d'un justificatif de domicile de moins de 3 mois. L'officier d'état civil dresse immédiatement un acte de reconnaissance prénatale.
2. Reconnaissance lors de la déclaration de naissance : à la mairie du lieu de naissance dans les 5 jours qui suivent l'accouchement.
3. Reconnaissance postérieure : possible à tout moment de la vie de l'enfant dans n'importe quelle mairie.
Important : si le père reconnaît l'enfant après son premier anniversaire, la mère conserve l'exercice exclusif de l'autorité parentale. Pour obtenir l'autorité conjointe, une déclaration conjointe devant le directeur de greffe du tribunal judiciaire ou une saisine du JAF sera nécessaire (Article 372 du Code civil).`,
    legalArticles: ['Article 316 du Code civil', 'Article 311-25 du Code civil', 'Article 372 du Code civil'],
    keyTakeaway: 'Reconnaissance anticipée gratuite en mairie avant la naissance pour conférer immédiatement les pleins droits paternels.',
  },
  {
    id: 'faq-adoption-simple-pleniere',
    category: 'filiation',
    categoryLabel: 'Filiation & Adoption',
    question: 'Quelle est la différence fondamentale entre adoption simple et adoption plénière ?',
    answer: `Le droit civil français distingue deux formes d'adoption aux conséquences juridiques très différentes :
1. L'Adoption Plénière (Article 356 du Code civil) :
- Elle confère à l'enfant une filiation qui se substitue entièrement à sa filiation d'origine.
- Les liens avec la famille par le sang sont totalement rompus (sauf pour les empêchements à mariage).
- L'adopté prend le nom de l'adoptant et acquiert les mêmes droits successoraux qu'un enfant biologique.
- L'adoption plénière est irrévocable.
2. L'Adoption Simple (Article 364 du Code civil) :
- Elle crée un nouveau lien de filiation entre l'adoptant et l'adopté, mais maintient les liens avec la famille d'origine.
- L'adopté conserve tous ses droits successoraux dans sa famille biologique tout en héritant de l'adoptant.
- Le nom de l'adoptant s'ajoute au nom d'origine (ou le remplace avec l'accord de l'adopté).
- L'adoption simple est fréquemment utilisée pour adopter l'enfant de son conjoint ou un adulte, et peut être révoquée pour motifs très graves.`,
    legalArticles: ['Article 356 du Code civil', 'Article 364 du Code civil', 'Article 368 du Code civil'],
    keyTakeaway: 'L\'adoption plénière rompt totalement les liens avec la famille biologique (irrévocable) ; l\'adoption simple superpose les deux familles.',
  },
  {
    id: 'faq-pma-reconnaissance-femmes',
    category: 'filiation',
    categoryLabel: 'Filiation & Adoption',
    question: 'Comment s’établit la filiation d’un enfant né par PMA au sein d’un couple de femmes ?',
    answer: `Depuis la loi bioéthique du 2 août 2021 (Article 342-11 du Code civil), la procréation médicalement assistée (PMA) est ouverte aux couples de femmes et aux femmes célibataires.
Pour un couple de femmes ayant recours à une PMA avec don de spermatozoïdes en France ou à l'étranger :
- Démarche préalable obligatoire : Avant la conception, les deux femmes doivent obligatoirement se rendre chez un notaire pour signer une Reconnaissance Conjointe Anticipée (RCA) conjointe à leur consentement au don.
- À la naissance : La femme qui accouche est déclarée mère sur l'acte de naissance. La seconde femme transmet la reconnaissance notariée à l'officier d'état civil lors de la déclaration de naissance.
- Effets : Les deux femmes figurent immédiatement sur l'acte de naissance de l'enfant avec un double lien de filiation maternel et exercent conjointement l'autorité parentale dès le premier jour, sans avoir à passer par une procédure d'adoption.`,
    legalArticles: ['Article 342-11 du Code civil', 'Loi n° 2021-1017 du 2 août 2021'],
    keyTakeaway: 'Reconnaissance conjointe préalable devant notaire garantissant la filiation des deux mères dès l\'acte de naissance.',
  },

  // --- PACS & MARIAGE ---
  {
    id: 'faq-difference-mariage-pacs-concubinage',
    category: 'pacs_mariage',
    categoryLabel: 'Mariage, PACS & Union libre',
    question: 'Quelles sont les différences clés entre Mariage, PACS et Union libre (concubinage) ?',
    answer: `Les trois formes d'union ont des régimes protecteurs très inégaux :
1. En matière de succession et héritage :
- Mariage : Le conjoint survivant est héritier légal protégé (droits au logement viager, réserve héréditaire en l'absence d'enfants, usufruit de tout ou quart en pleine propriété) et totalement exonéré de droits de succession.
- PACS : Le partenaire N'EST PAS héritier légal. Il n'hérite de rien sans testament express. En présence d'un testament, il est exonéré de droits de succession.
- Concubinage (union libre) : Les concubins sont juridiquement des étrangers. Sans testament, aucun droit. Avec testament, les droits de succession sont taxés à hauteur de 60 % (taux applicable aux tiers).
2. Devoir de secours et solidarité :
- Le mariage impose un devoir de secours (pension entre époux durant l'instance, prestation compensatoire).
- Le PACS prévoit une aide matérielle et une solidarité pour les dettes de la vie courante, mais pas de prestation compensatoire en cas de rupture.
- Le concubinage n'emporte aucune solidarité financière légale.`,
    legalArticles: ['Articles 212 et suivants (Mariage)', 'Articles 515-1 et suivants (PACS)', 'Article 515-8 (Concubinage)'],
    keyTakeaway: 'Le conjoint marié est protégé de plein droit ; le partenaire de PACS doit impérativement rédiger un testament ; les concubins sont taxés à 60%.',
  },
  {
    id: 'faq-dissolution-pacs-demarches',
    category: 'pacs_mariage',
    categoryLabel: 'Mariage, PACS & Union libre',
    question: 'Comment dissoudre un PACS unilatéralement ou d’un commun accord ?',
    answer: `Le PACS peut être dissous de deux façons principales (Article 515-7 du Code civil) :
1. D'un commun accord : Les partenaires adressent ou déposent à la mairie (ou à l'étude notariale) qui a enregistré le pacte une déclaration conjointe de dissolution (formulaire Cerfa 15789*03) accompagnée de la copie de leurs pièces d'identité. La dissolution prend effet immédiatement entre eux.
2. De façon unilatérale (à la demande d'un seul partenaire) : Le partenaire qui souhaite rompre n'a pas besoin de justifier d'un motif ni d'obtenir l'accord de l'autre. Il fait signifier sa décision à l'autre partenaire par un commissaire de justice (huissier). Le commissaire de justice en informe ensuite la mairie d'enregistrement, qui procède à la mention en marge de l'état civil.
Attention : la rupture d'un PACS n'ouvre droit à aucune prestation compensatoire, sauf abus caractérisé ouvrant droit à des dommages et intérêts de droit commun.`,
    legalArticles: ['Article 515-7 du Code civil', 'Cerfa n° 15789*03'],
    keyTakeaway: 'Rupture conjointe simple en mairie, ou rupture unilatérale par acte de commissaire de justice sans justification exigée.',
  },
];

export const LETTER_TEMPLATES: LetterTemplate[] = [
  // 1. Accord parental complet (Art. 373-2-7)
  {
    id: 'accord-parental-homologation',
    title: 'Convention parentale amiable & Requête en homologation JAF',
    category: 'accord_parental',
    description: 'Modèle officiel complet d’accord parental fixant l’autorité parentale conjointe, la résidence, le calendrier des vacances et la pension, destiné à être homologué sans audience par le JAF.',
    targetRecipient: 'Juge aux Affaires Familiales - Tribunal Judiciaire compétent',
    legalBasis: 'Articles 373-2-7 et 373-2 du Code civil / Article 1143 du CPC',
    fields: [
      { key: 'parent1_identite', label: 'Identité complète Parent 1 (Nom, prénom, profession, adresse)', placeholder: 'Ex: M. Thomas DUPONT, né le 12/04/1985, Ingénieur, 14 rue de Rennes, 75006 Paris' },
      { key: 'parent2_identite', label: 'Identité complète Parent 2 (Nom, prénom, profession, adresse)', placeholder: 'Ex: Mme Claire MARTIN, née le 05/09/1987, Architecte, 28 bd Saint-Germain, 75005 Paris' },
      { key: 'enfants_liste', label: 'Prénom(s), nom(s) et date(s) de naissance des enfants', placeholder: 'Ex: Lucas DUPONT (né le 15/06/2018) et Juliette DUPONT (née le 22/11/2021)' },
      { key: 'mode_residence', label: 'Modalités de résidence convenues', placeholder: 'Ex: Résidence alternée par quinzaine ou Résidence habituelle chez la mère avec droit de visite classique' },
      { key: 'pension_montant', label: 'Montant de la contribution financière par enfant (€/mois)', placeholder: 'Ex: 250 € par enfant, soit 500 € par mois au total versés par le père' },
      { key: 'tribunal_jaf', label: 'Tribunal Judiciaire compétent pour homologation', placeholder: 'Ex: Tribunal Judiciaire de Paris' },
    ],
    content: `CONVENTION PARENTALE AMIABLE RELATIVE À L'EXERCICE DE L'AUTORITÉ PARENTALE
ET REQUÊTE CONJOINTE EN HOMOLOGATION AUPRÈS DU JUGE AUX AFFAIRES FAMILIALES
(Articles 373-2-7 du Code civil et 1143 du Code de procédure civile)

ENTRE LES SOUSSIGNÉS :

1. {parent1_identite}
D'une part,

ET

2. {parent2_identite}
D'autre part,

Parents de l'enfant / des enfants commun(s) mineur(s) suivant(s) :
{enfants_liste}

PRÉAMBULE :
Les parents, soucieux de préserver l'équilibre, le bien-être et le lien affectif et éducatif continu de leur(s) enfant(s), ont convenu d'un commun accord des mesures d'organisation suivantes et sollicitent conjointement leur homologation par le Juge aux Affaires Familiales du {tribunal_jaf} afin de conférer à cet accord force exécutoire.

ARTICLE 1 - EXERCICE DE L'AUTORITÉ PARENTALE
Les parents continuent d'exercer en commun l'autorité parentale sur leur(s) enfant(s) conformément à l'article 371-1 du Code civil. 
Ils s'engagent à se consulter et à prendre ensemble toutes les décisions importantes relatives à la santé, la scolarité, l'orientation professionnelle et religieuse de l'enfant, et à respecter mutuellement les liens affectifs de l'enfant avec l'autre parent.

ARTICLE 2 - RÉSIDENCE HABITUELLE ET DROIT DE VISITE ET D'HÉBERGEMENT
Les parents conviennent que la résidence de(s) l'enfant(s) est fixée selon les modalités suivantes :
{mode_residence}

Vacances scolaires :
À défaut de meilleur accord amiable entre les parties, les périodes de vacances scolaires seront partagées par moitié :
- Première moitié les années paires pour le Parent 1, seconde moitié pour le Parent 2 ;
- L'inverse s'appliquant les années impaires.

ARTICLE 3 - CONTRIBUTION À L'ENTRETIEN ET À L'ÉDUCATION (PENSION ALIMENTAIRE)
Au titre de son obligation légale d'entretien (Article 371-2 du Code civil) et au regard des facultés respectives des parties, il est convenu du versement d'une pension alimentaire :
- Montant : {pension_montant}.
- Échéance : Payable d'avance au plus tard le 5 de chaque mois, y compris pendant les périodes de vacances.
- Indexation : Cette somme sera réévaluée automatiquement au 1er janvier de chaque année selon la variation de l'indice INSEE des prix à la consommation.
- Frais exceptionnels : Les frais exceptionnels (frais médicaux non remboursés, séjours linguistiques, permis de conduire) dûment convenus au préalable seront partagés par moitié entre les parents sur justificatifs.

ARTICLE 4 - DEMANDE D'HOMOLOGATION CONJOINTE
Les parties certifient l'exactitude des informations susvisées et sollicitent respectueusement du Juge aux Affaires Familiales du {tribunal_jaf} l'homologation de la présente convention parentale, en application de l'article 373-2-7 du Code civil.

Fait en trois exemplaires originaux,
À [Ville], le [Date du jour]

Signature Parent 1 :                                Signature Parent 2 :`,
  },

  // 2. Projet complet de Convention de Divorce Amiable (Art. 229-1)
  {
    id: 'projet-convention-divorce-amiable',
    title: 'Projet de Convention de Divorce par Consentement Mutuel (sans juge)',
    category: 'divorce',
    description: 'Trame complète d’acte sous signature privée contresigné par deux avocats et déposé au rang des minutes d’un notaire, conforme aux exigences de l’Art. 229-1 du Code civil.',
    targetRecipient: 'Avocats des époux & Notaire dépositaire',
    legalBasis: 'Articles 229-1, 229-3 et suivants du Code civil',
    fields: [
      { key: 'epoux_identite', label: 'Nom, prénom, date et lieu de naissance de l’Époux', placeholder: 'Ex: M. Antoine LEROY, né le 10/02/1982 à Lyon' },
      { key: 'epouse_identite', label: 'Nom de jeune fille, prénom, date et lieu de naissance de l’Épouse', placeholder: 'Ex: Mme Élodie BLANCHARD, née le 18/07/1984 à Marseille' },
      { key: 'mariage_details', label: 'Date, lieu et régime matrimonial du mariage', placeholder: 'Ex: Mariés le 12/09/2015 à la Mairie de Nantes, sous le régime légal de la communauté réduite aux acquêts' },
      { key: 'avocat_epoux', label: 'Nom et Barreau de l’avocat de l’Époux', placeholder: 'Ex: Me Jean DUPONT, Avocat au Barreau de Paris' },
      { key: 'avocat_epouse', label: 'Nom et Barreau de l’avocate de l’Épouse', placeholder: 'Ex: Me Sophie MARTIN, Avocate au Barreau de Paris' },
      { key: 'notaire_nom', label: 'Nom et Office notarial du Notaire dépositaire', placeholder: 'Ex: Me Michel RENAUD, Notaire associé à Paris' },
      { key: 'prestation_accord', label: 'Accord sur la prestation compensatoire', placeholder: 'Ex: Renonciation expresse des deux époux ou Versement d\'un capital de 30 000 €' },
    ],
    content: `CONVENTION DE DIVORCE PAR CONSENTEMENT MUTUEL
PAR ACTE SOUS SIGNATURE PRIVÉE CONTRESIGNÉ PAR AVOCATS
(Articles 229-1 et suivants, Articles 1144 et suivants du Code de procédure civile)

ENTRE LES ÉPOUX :
1. {epoux_identite}
Assisté de son avocat : {avocat_epoux}

ET

2. {epouse_identite}
Assistée de son avocate : {avocat_epouse}

RAPPEL PRÉALABLE :
Les époux ont contracté mariage le {mariage_details}.
Aucun enfant mineur n'a demandé à être auditionné par un magistrat au sens de l'article 388-1 du Code civil, ce que les époux certifient expressément.
Chaque époux déclare avoir reçu par lettre recommandée avec demande d'avis de réception le projet de convention et avoir bénéficié d'un délai de réflexion incompressible de quinze (15) jours révolus conformément à l'article 229-4 du Code civil avant toute signature.

IL A ÉTÉ CONVENU CE QUI SUIT :

ARTICLE 1 - CONSENTEMENT MUTUEL AU DIVORCE
Les époux constatent qu'ils s'accordent sur le principe de la rupture du lien conjugal et sur l'ensemble de ses conséquences personnelles et patrimoniales. Ils consentent expressément à leur divorce.

ARTICLE 2 - NOM D'USAGE DES ÉPOUX
À la suite du divorce, chaque époux reprendra l'usage exclusif de son nom patronymique, sauf accord exprès écrit joint aux présentes.

ARTICLE 3 - PRESTATION COMPENSATOIRE (ARTICLES 270 ET 271 DU CODE CIVIL)
Les époux, après avoir pris connaissance des dispositions des articles 270 et 271 du Code civil et avoir échangé leurs déclarations sur l'honneur certifiant l'exactitude de leurs ressources et de leur patrimoine, conviennent ce qui suit :
{prestation_accord}

ARTICLE 4 - LIQUIDATION ET PARTAGE DU RÉGIME MATRIMONIAL
La liquidation du régime matrimonial a été préalablement établie :
- En présence de biens immobiliers communs, un état liquidatif notarié a été dressé par {notaire_nom} en date du [Date acte notarié] et demeure annexé à la présente convention.
- Les biens meubles ont été équitablement partagés à l'amiable à l'entière satisfaction des deux parties.

ARTICLE 5 - DÉPÔT AU RANG DES MINUTES D'UN NOTAIRE
La présente convention sera transmise dans un délai de sept (7) jours suivant sa signature à l'Office notarial de {notaire_nom} aux fins de dépôt au rang de ses minutes, conférant à la présente convention force exécutoire et date effective de dissolution du mariage.

Fait en quatre exemplaires originaux,
À [Ville], le [Date de signature après 15 jours de réflexion]

Signature de l'Époux :                          Signature de l'Épouse :
Contresignature de Me {avocat_epoux} :          Contresignature de Me {avocat_epouse} :`,
  },

  // 3. Déclaration et Convention de PACS (Art. 515-3)
  {
    id: 'convention-pacs-conjointe',
    title: 'Convention conjointe de Pacte Civil de Solidarité (PACS)',
    category: 'pacs',
    description: 'Convention type de PACS conforme au formulaire officiel Cerfa n° 15726*02, organisant la vie commune et fixant le régime patrimonial (séparation de biens ou indivision).',
    targetRecipient: 'Officier d’état civil de la Mairie de résidence commune ou Notaire',
    legalBasis: 'Articles 515-1 à 515-7-1 du Code civil / Décret n° 2017-889',
    fields: [
      { key: 'partenaire1_identite', label: 'Partenaire 1 (Nom, prénom, date et lieu de naissance, nationalité)', placeholder: 'Ex: M. Julien DUPUIS, né le 14/01/1990 à Bordeaux, de nationalité française' },
      { key: 'partenaire2_identite', label: 'Partenaire 2 (Nom, prénom, date et lieu de naissance, nationalité)', placeholder: 'Ex: Mlle Camille ROUSSEL, née le 28/08/1992 à Nantes, de nationalité française' },
      { key: 'residence_commune', label: 'Adresse complète de la résidence commune déclarée', placeholder: 'Ex: 15 allée des Acacias, 33000 Bordeaux' },
      { key: 'regime_patrimonial', label: 'Régime des biens choisi (Séparation de biens ou Indivision)', placeholder: 'Ex: Régime de la séparation de patrimoines (Article 515-5 du Code civil)' },
      { key: 'mairie_depot', label: 'Mairie ou Étude notariale d’enregistrement', placeholder: 'Ex: Mairie de Bordeaux' },
    ],
    content: `CONVENTION CONJOINTE DE PACTE CIVIL DE SOLIDARITÉ (PACS)
(Articles 515-1 à 515-7 du Code civil)

ENTRE LES SOUSSIGNÉS :

1. {partenaire1_identite}
D'une part,

ET

2. {partenaire2_identite}
D'autre part,

Déclarent conclure entre eux un Pacte Civil de Solidarité régi par les dispositions des articles 515-1 et suivants du Code civil, et conviennent des clauses suivantes :

ARTICLE 1 - VIE COMMUNE ET RÉSIDENCE
Les partenaires s'engagent à une vie commune, à une aide matérielle et à une assistance réciproque.
Ils fixent leur résidence commune à l'adresse suivante :
{residence_commune}

ARTICLE 2 - AIDE MATÉRIELLE ET SOLIDARITÉ
Les partenaires conviennent de participer aux charges de la vie commune proportionnellement à leurs facultés respectives, conformément aux dispositions de l'article 515-4 du Code civil.
Ils sont tenus solidairement à l'égard des tiers des dettes contractées par l'un d'eux pour les besoins de la vie courante.

ARTICLE 3 - RÉGIME PATRIMONIAL APPLICABLE AUX BIENS
Les partenaires choisissent expressément de soumettre leurs biens au :
{regime_patrimonial}

- Si séparation de biens : Chacun des partenaires conserve l'administration, la jouissance et la libre disposition de ses biens personnels acquis avant ou pendant le pacte. Chacun reste seul tenu des dettes personnelles nées avant ou pendant le pacte.
- Preuve de propriété : Tout bien sur lequel aucun des partenaires ne peut justifier d'une propriété exclusive est réputé leur appartenir indivisément pour moitié.

ARTICLE 4 - FORMALITÉS D'ENREGISTREMENT ET DE PUBLICITÉ
La présente convention sera enregistrée par l'officier de l'état civil de la {mairie_depot} (ou par notaire), auquel les pièces justificatives d'état civil requises sont simultanément remises.

Fait en double exemplaire original,
À {residence_commune}, le [Date du jour]

Signature Partenaire 1 :                            Signature Partenaire 2 :`,
  },

  // 4. Mise en demeure impayé pension (ARIPA / Art. 227-3 CP)
  {
    id: 'mise-en-demeure-pension',
    title: 'Mise en demeure de paiement de pension alimentaire',
    category: 'pension',
    description: 'Courrier recommandé préalable obligatoire avant saisine de l’ARIPA (recouvrement forcé) ou poursuites pour abandon de famille.',
    targetRecipient: 'Parent débiteur de la pension alimentaire',
    legalBasis: 'Articles 371-2 et 373-2-2 du Code civil / Article 227-3 du Code pénal',
    fields: [
      { key: 'nom_debiteur', label: 'Nom et prénom du parent débiteur', placeholder: 'Ex: M. Dupont Jean' },
      { key: 'adresse_debiteur', label: 'Adresse du parent débiteur', placeholder: 'Ex: 12 rue de la Paix, 75002 Paris' },
      { key: 'date_jugement', label: 'Date de la décision ou convention JAF', placeholder: 'Ex: 14 mars 2024' },
      { key: 'tribunal', label: 'Juridiction ayant statué', placeholder: 'Ex: Tribunal Judiciaire de Lyon' },
      { key: 'montant_mensuel', label: 'Montant mensuel fixé par enfant (€)', placeholder: 'Ex: 220' },
      { key: 'mois_impayes', label: 'Mois et années d’impayés', placeholder: 'Ex: Janvier, Février et Mars 2026' },
      { key: 'total_du', label: 'Montant total arriéré dû (€)', placeholder: 'Ex: 660' },
    ],
    content: `[Vos Nom & Prénom]
[Votre Adresse]
[Votre Téléphone / Email]

À l'attention de :
{nom_debiteur}
{adresse_debiteur}

Lettre recommandée avec avis de réception n° [Numéro LRAR]

Objet : Mise en demeure de paiement d'arriérés de pension alimentaire
Réf. : Décision du {tribunal} en date du {date_jugement}

Madame, Monsieur,

Par décision du {tribunal} rendue le {date_jugement}, vous avez été condamné(e) à me verser mensuellement la somme de {montant_mensuel} € au titre de votre contribution à l'entretien et à l'éducation de notre(nos) enfant(s).

À ce jour, je constate que les mensualités correspondant aux périodes suivantes n'ont pas été réglées :
- Échéances impayées : {mois_impayes}
Soit une créance alimentaire totale restant due de : {total_du} euros.

En conséquence, je vous mets formellement en demeure par la présente de procéder au règlement intégral de cette somme de {total_du} € sous un délai de huit (8) jours à compter de la première présentation de ce courrier.

À défaut de paiement dans le délai imparti, je transmettrai immédiatement ce dossier à l'ARIPA (Agence de recouvrement des impayés de pensions alimentaires / CAF) aux fins de recouvrement forcé et d'intermédiation financière, sans préjudice du dépôt d'une plainte pour délit d'abandon de famille conformément aux dispositions de l'article 227-3 du Code pénal (peine encourue : 2 ans d'emprisonnement et 15 000 € d'amende).

Comptant sur votre diligence pour régulariser sans délai votre situation,

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

Fait à [Votre ville], le [Date du jour]
[Votre Signature]`,
  },

  // 5. Demande de révision de pension au JAF
  {
    id: 'requete-revision-pension',
    title: 'Demande de révision de pension alimentaire au JAF',
    category: 'pension',
    description: 'Modèle de courrier accompagnant le formulaire Cerfa n° 11530*11 pour justifier d’un changement significatif de situation financière.',
    targetRecipient: 'Juge aux Affaires Familiales - Tribunal Judiciaire compétent',
    legalBasis: 'Article 209 du Code civil / Décret n° 2010-1395',
    fields: [
      { key: 'tribunal_jaf', label: 'Tribunal Judiciaire compétent', placeholder: 'Ex: Tribunal Judiciaire de Nanterre' },
      { key: 'date_precedente_decision', label: 'Date de la dernière décision', placeholder: 'Ex: 10 octobre 2023' },
      { key: 'motif_changement', label: 'Motif du changement de situation', placeholder: 'Ex: Perte d’emploi involontaire / Baisse de revenus / Hausse des frais de scolarité' },
      { key: 'nouveau_montant_souhaite', label: 'Nouveau montant mensuel proposé (€)', placeholder: 'Ex: 150' },
    ],
    content: `À l'attention de Monsieur / Madame le Juge aux Affaires Familiales
Tribunal Judiciaire de {tribunal_jaf}
Pôle Famille

Objet : Requête aux fins de révision de la contribution à l'entretien et à l'éducation des enfants
Réf. précédente décision : Jugement en date du {date_precedente_decision}

Madame, Monsieur le Juge,

Par décision du Tribunal Judiciaire en date du {date_precedente_decision}, le montant de la pension alimentaire mise à ma charge a été fixé à la somme mensuelle de [Montant initial] € pour mon/mes enfant(s).

Depuis le prononcé de cette décision, ma situation financière a subi une modification substantielle et imprévisible :
{motif_changement}

Ces circonstances nouvelles ne me permettent plus d'assumer la charge financière initialement fixée sans mettre en péril mes besoins fondamentaux.

Conformément à l'article 209 du Code civil selon lequel les aliments ne sont accordés qu'en proportion du besoin de celui qui les réclame et de la fortune de celui qui les doit, je sollicite respectueusement la révision à la baisse de cette contribution, pour la porter à la somme mensuelle de {nouveau_montant_souhaite} € par enfant.

Je joins à la présente le formulaire Cerfa 11530 complété ainsi que l'ensemble des justificatifs actualisés (déclaration d'impôts, bulletins de salaire, justificatifs d'allocations chômage, quittances de loyer).

Dans l'attente de votre convocation, je vous prie d'agréer, Madame, Monsieur le Juge, l'expression de ma très haute considération.

Fait à [Votre ville], le [Date]
[Votre Signature]`,
  },

  // 6. Notification légale de déménagement
  {
    id: 'notification-changement-domicile',
    title: 'Notification de changement de domicile (enfants mineurs)',
    category: 'enfants',
    description: 'Information formelle obligatoire à l’autre parent dans le mois suivant un déménagement pour respecter l’exercice de l’autorité parentale.',
    targetRecipient: 'Autre parent de l’enfant',
    legalBasis: 'Article 373-2 du Code civil / Article 227-6 du Code pénal',
    fields: [
      { key: 'nom_autre_parent', label: 'Nom et prénom de l’autre parent', placeholder: 'Ex: Mme Martin Sophie' },
      { key: 'nom_enfants', label: 'Prénom(s) et nom(s) des enfants', placeholder: 'Ex: Lucas et Léa Dupont' },
      { key: 'nouvelle_adresse', label: 'Nouvelle adresse complète', placeholder: 'Ex: 8 allée des Tilleuls, 33000 Bordeaux' },
      { key: 'date_demenagement', label: 'Date effective d’installation', placeholder: 'Ex: 1er juillet 2026' },
    ],
    content: `[Vos Nom & Prénom]
[Votre Téléphone / Email]

À l'attention de :
{nom_autre_parent}
[Adresse de l'autre parent]

Lettre recommandée avec accusé de réception n° [Numéro LRAR]

Objet : Notification légale de changement d'adresse relative à nos enfants
Article 373-2 du Code civil

Madame, Monsieur,

Conformément aux obligations prévues par l'article 373-2 alinéa 3 du Code civil, je t'informe formellement par la présente de mon changement de résidence principale pour nos enfants {nom_enfants}.

Notre nouvelle adresse postale sera la suivante à compter du {date_demenagement} :
{nouvelle_adresse}

Mes coordonnées téléphoniques et électroniques demeurent inchangées.

Cette nouvelle installation est organisée de manière à préserver au mieux la scolarité et les repères des enfants, tout en maintenant l'exercice harmonieux de ton droit de visite et d'hébergement.

Je reste à ta disposition pour organiser à l'amiable les éventuels ajustements de trajets nécessaires pour le bien-être de nos enfants.

Fait à [Ville], le [Date]
[Votre Signature]`,
  },
];

export const LEGAL_GUIDES: LegalGuideTopic[] = [
  {
    id: 'divorce-amiable',
    title: 'Le Divorce par Consentement Mutuel (sans juge)',
    subtitle: 'Procédure extrajudiciaire instituée par la loi du 18 novembre 2016',
    codeArticles: ['Article 229-1 du Code civil', 'Articles 1144 à 1148-2 du CPC', 'Article 229-3 du Code civil'],
    keyRules: [
      'Chaque époux doit obligatoirement avoir son propre avocat indépendant (aucun avocat commun n’est permis).',
      'Délai de réflexion incompressible et absolu de 15 jours à compter de la réception du projet de convention en LRAR.',
      'Signature conjointe de la convention par les deux époux et leurs deux avocats respectifs.',
      'Dépôt au rang des minutes d’un notaire dans un délai de 7 jours après signature (coût fixe d’enregistrement : 41,20 € HT soit ~50,40 € TTC).',
      'Interdiction si un enfant mineur demande expressément à être auditionné par un juge (renvoi obligatoire devant le JAF).',
    ],
    deadlinesAndCosts: 'Délais moyens : 1 à 3 mois. Coût : Honoraires d’avocat (souvent forfaitaires entre 800 € et 2 500 € par époux) + droits notariés et fiscalité sur les biens immobiliers partagés (droit de partage).',
    recommendedSteps: [
      'Faire le point exhaustif sur le patrimoine commun et les dettes',
      'Trouver un accord sur la résidence des enfants et la pension alimentaire',
      'Prendre contact chacun avec un avocat dédié au droit de la famille',
      'Valider le projet de convention après le délai légal de 15 jours',
    ],
  },
  {
    id: 'residence-enfants',
    title: 'Résidence des Enfants & Droit de Visite (JAF)',
    subtitle: 'Modalités d’exercice de l’autorité parentale après séparation',
    codeArticles: ['Article 371-1 du Code civil', 'Article 373-2 du Code civil', 'Article 373-2-9 du Code civil'],
    keyRules: [
      'L’autorité parentale conjointe est le principe : les deux parents doivent être consultés pour les décisions importantes (santé, scolarité, religion).',
      'La résidence alternée est privilégiée si les domiciles sont suffisamment proches et que l’âge de l’enfant le permet.',
      'En cas de résidence exclusive chez un parent, le parent non gardien bénéficie d’un droit de visite et d’hébergement (classiquement 1 week-end sur 2 et la moitié des vacances).',
      'Le non-respect du droit de visite ou le refus de remettre l’enfant constitue le délit pénal de non-représentation d’enfant (Art. 227-5 du Code pénal).',
    ],
    deadlinesAndCosts: 'Saisine du JAF gratuite par formulaire Cerfa 11530*11 sans avocat obligatoire, ou avec avocat selon complexité. Délai d’audience : 2 à 6 mois selon les tribunaux.',
    recommendedSteps: [
      'Tenter une médiation familiale préalable (subventionnée par la CAF)',
      'Rédiger une convention parentale à l’amiable et demander son homologation au JAF',
      'En cas de désaccord, saisir le JAF du lieu de résidence habituelle des enfants',
    ],
  },
  {
    id: 'pension-alimentaire',
    title: 'Pension Alimentaire & Intermédiation ARIPA',
    subtitle: 'Obligation légale d’entretien des enfants et sécurisation des paiements',
    codeArticles: ['Articles 371-2 et 373-2-2 du Code civil', 'Article L. 582-1 du Code de la sécurité sociale'],
    keyRules: [
      'La pension est due jusqu’à ce que l’enfant acquière une autonomie financière réelle (elle ne s’arrête PAS automatiquement à 18 ans).',
      'Calcul basé sur les facultés respectives des parents et les besoins de l’enfant (grille officielle du Ministère de la Justice).',
      'Indexation annuelle obligatoire sur l’indice INSEE des prix à la consommation.',
      'Intermédiation financière automatique généralisée (IFPA) via l’ARIPA/CAF pour toutes les pensions fixées par décision de justice ou titre exécutoire.',
    ],
    deadlinesAndCosts: 'Délai d’intervention de l’ARIPA : immédiat dès transmission de la décision de justice exécutoire. Service entièrement gratuit.',
    recommendedSteps: [
      'Calculer l’estimation via notre simulateur basé sur la grille ministérielle',
      'Faire acter le montant par un jugement ou un titre exécutoire CAF',
      'Activer l’intermédiation financière pour sécuriser le versement chaque mois',
    ],
  },
  {
    id: 'protection-violences',
    title: 'Ordonnance de Protection & Mesures d’Urgence',
    subtitle: 'Protection immédiate des victimes de violences conjugales et familiales',
    codeArticles: ['Article 515-9 du Code civil', 'Article 515-11 du Code civil', 'Article 1136-3 du CPC'],
    keyRules: [
      'Délivrée par le JAF dans un délai maximal de 6 jours à compter de la fixation de l’audience.',
      'Aucun dépôt de plainte pénal préalable n’est juridiquement exigé pour solliciter l’ordonnance.',
      'Mesures prononçables : attribution du logement à la victime et éviction du conjoint violent, interdiction d’entrer en relation, port éventuel d’un bracelet anti-rapprochement (BAR).',
      'Durée initiale de 6 mois, renouvelable si une requête en divorce ou séparation a été engagée entre-temps.',
    ],
    deadlinesAndCosts: 'Procédure d’extrême urgence sans frais de justice. Aide juridictionnelle provisoire accordée de plein droit sans examen préalable des ressources.',
    recommendedSteps: [
      'Composer le 3919 (Violences Femmes Info) ou le 17 en cas de danger immédiat',
      'Consulter un médecin pour faire constater les blessures physiques et le retentissement psychologique (ITT)',
      'Contacter un avocat ou une association d’aide aux victimes (France Victimes 116 006)',
      'Déposer la requête auprès du greffe du Juge aux Affaires Familiales',
    ],
  },
];

export const EMERGENCY_CONTACTS = [
  {
    number: '3919',
    name: 'Violences Femmes Info',
    description: 'Numéro d’écoute national, anonyme et gratuit 24h/24 et 7j/7 pour les femmes victimes de violences conjugales.',
    badge: 'Urgence Violences',
    color: 'crimson',
  },
  {
    number: '119',
    name: 'Allô Enfance en Danger',
    description: 'Numéro gratuit disponible 24h/24 pour tout mineur en danger ou toute personne signalant un enfant en risque de maltraitance.',
    badge: 'Protection Enfance',
    color: 'amber',
  },
  {
    number: '3039',
    name: 'Numéro Unique de l’Accès au Droit',
    description: 'Mise en relation directe et gratuite avec un Point-Justice pour obtenir une consultation juridique gratuite avec un avocat ou juriste.',
    badge: 'Conseil Juridique Gratuit',
    color: 'blue',
  },
  {
    number: '3230',
    name: 'ARIPA / CAF - Recouvrement des Pensions',
    description: 'Gestion du recouvrement forcé et du versement automatique de l’allocation de soutien familial (ASF) en cas d’impayé.',
    badge: 'Pensions Alimentaires',
    color: 'indigo',
  },
  {
    number: '17',
    name: 'Police & Gendarmerie de secours',
    description: 'Intervention d’urgence immédiate en cas de péril ou d’infraction en cours.',
    badge: 'Police / Secours',
    color: 'red',
  },
  {
    number: '114',
    name: 'SMS Urgence (Sourds et Malentendants)',
    description: 'Numéro d’urgence par SMS pour contacter la police, le Samu ou les pompiers en toute discrétion sans parler à voix haute.',
    badge: 'Discrétion SMS',
    color: 'slate',
  },
];

export const SAMPLE_DOCUMENTS = [
  {
    name: 'Exemple_Convocation_Audience_JAF.txt',
    type: 'document' as const,
    mimeType: 'text/plain',
    textContent: `RÉPUBLIQUE FRANÇAISE - TRIBUNAL JUDICIAIRE DE BOBIGNY
PÔLE FAMILLE - CABINET DU JUGE AUX AFFAIRES FAMILIALES

CONVOCATION À L'AUDIENCE DU 18 JUIN 2026 À 09H30
Salle d'audience n° 4 - Bâtiment B

Affaire : DUPONT Marc c/ DUPONT née MARTIN Valérie
Objet : Fixation des modalités de l'autorité parentale, de la résidence habituelle des enfants Lucas (né le 12/04/2018) et Emma (née le 05/09/2021), et contribution à l'entretien et à l'éducation.

Pièces exigées à communiquer à la partie adverse au moins 15 jours avant l'audience :
- Dernier avis d'imposition complet (2025 sur revenus 2024)
- 3 derniers bulletins de paie
- Quittance de loyer récente ou tableau d'amortissement de prêt immobilier
- Justificatifs des charges réelles mensuelles`,
  },
  {
    name: 'Exemple_Projet_Convention_Divorce_Art229.txt',
    type: 'document' as const,
    mimeType: 'text/plain',
    textContent: `PROJET DE CONVENTION DE DIVORCE PAR CONSENTEMENT MUTUEL
Sous signature privée contresignée par avocats (Articles 229-1 et suivants du Code civil)

ENTRE LES ÉPOUX :
- Monsieur Nicolas MOREAU, assisté de Me Lambert, Avocat au Barreau de Paris
- Madame Sarah BENALI, assistée de Me Dubois, Avocate au Barreau de Paris

CLAUSES PRINCIPALES SOUMISES AU DÉLAI DE RÉFLEXION DE 15 JOURS :
1. Rupture du lien matrimonial : Les époux déclarent consentir mutuellement à leur divorce.
2. Enfants communs : Résidence alternée fixée à raison d'une semaine sur deux, changement le vendredi à la sortie des classes.
3. Contribution financière : Aucune pension alimentaire n'est fixée au regard de la parité des revenus et de la résidence alternée.
4. Prestation compensatoire : Constatant une disparité minime de 120 €/mois, les époux renoncent expressément à toute prestation compensatoire.
5. Biens immobiliers : Vente de l'appartement commun réalisée le 10/01/2026 et partage amiable du solde consigné chez le notaire.`,
  },
];
