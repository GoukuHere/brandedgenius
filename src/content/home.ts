// Every line of copy below comes from brandedgenius.de (homepage, Impressum and brand style guide), tightened where it repeated itself.

export const LINKS = {
  analysis: "https://api.brandedgenius.net/widget/survey/FXLzi1dZ9ecKm8EVD5sf",
  booking: "https://api.brandedgenius.net/widget/booking/CiuYtyMNCf8R7Dkft6Pe",
  imprint: "https://brandedgenius.de/impressum/",
  privacy: "https://brandedgenius.de/datenschutzerklarung/",
  terms: "https://brandedgenius.de/agb/",
  // The client's 6-second hero loop, re-encoded at 1920px (1.5 MB instead of 8.3 MB) and served from this site.
  heroVideo: "/video/hero-1920.mp4",
  heroPoster: "/video/hero-poster.jpg",
};

export const NAV = [
  { label: "Leistungen", href: "#leistungen" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "KI-Workshop", href: "#ki-workshop" },
  { label: "Über uns", href: "#ueber-uns" },
  { label: "Kontakt", href: "#kontakt" },
];

export const CLIENTS = [
  "K&M Electronics",
  "Elysium Agency",
  "Cryptotransfer",
  "LedBow Germany",
  "WrapWerk Academy",
  "Mega Screen",
  "Martin Wildt Real Estate",
];

export const STATEMENT =
  "Viele Unternehmen testen KI, setzen sie aber nicht produktiv um. Prozesse bleiben manuell, Tools arbeiten isoliert, und es fehlt eine klare Roadmap. Wir bringen KI dorthin, wo sie echten Mehrwert schafft: in Ihre Prozesse.";

export const PROBLEMS = [
  { title: "KI wird getestet, aber nicht umgesetzt", text: "Pilotbetrieb in der Testphase, ohne Überführung in den Alltag." },
  { title: "Zu viele manuelle Prozesse", text: "Wichtige Aufgaben sind zeitintensiv, fehleranfällig und nicht skalierbar." },
  { title: "Tools sind nicht verbunden", text: "Daten und Systeme arbeiten isoliert, ohne durchgängige Integration." },
  { title: "Keine klare KI-Roadmap", text: "Es fehlt eine Strategie, Priorisierung und ein Plan für nachhaltige Umsetzung." },
  { title: "Mitarbeiter sind unsicher", text: "Unsicherheit über Nutzen, Anwendung und Auswirkung von KI im Arbeitsalltag." },
  { title: "Keine messbaren Ergebnisse", text: "Erfolge sind nicht messbar, Wirkung bleibt unklar, Potenzial verpufft." },
];

export const SERVICES = {
  agents: {
    title: "KI-Agenten & Workflows",
    text: "Intelligente KI-Agenten und automatisierte Workflows, die wiederkehrende Prozesse übernehmen, Systeme verbinden und interne Abläufe effizienter machen.",
  },
  chatbots: {
    title: "KI-Chatbots",
    text: "Chatbots für Website, Support, Kundenservice und Lead-Qualifizierung, abgestimmt auf Ihr Unternehmen, Ihre Prozesse und Systeme.",
  },
  callbots: {
    title: "KI-Callbots",
    text: "Sprachassistenten für eingehende und ausgehende Telefonate, Lead-Qualifizierung, Terminvereinbarung, Support und Follow-ups.",
  },
  automation: {
    title: "KI-Marketing & Vertriebsautomatisierung",
    text: "Automatisierte Marketing- und Vertriebsprozesse für Leadgenerierung, Follow-ups, CRM, personalisierte Kommunikation und effizientere Conversion-Prozesse.",
  },
};

export type Metric = { sign: "+" | "-"; value: number; label: string };

export type UseCase = {
  name: string;
  tagline: string;
  text: string;
  metrics: Metric[];
  quote: string;
  role: string;
  done: string[];
  tools: string[];
};

export const USE_CASES: UseCase[] = [
  {
    name: "Marketing Automation",
    tagline: "Lead-Generierung neu gedacht.",
    text: "Automatisierte Kampagnensteuerung und intelligente Lead-Qualifizierung steigern die Conversion-Raten messbar und nachhaltig.",
    metrics: [
      { sign: "+", value: 43, label: "Mehr qualifizierte Leads in 90 Tagen" },
      { sign: "-", value: 62, label: "Weniger manueller Aufwand im Marketing" },
      { sign: "+", value: 28, label: "Höhere Conversion-Rate bei Kampagnen" },
    ],
    quote: "Endlich haben wir ein System, das Marketing nicht nur automatisiert, sondern messbar erfolgreicher macht.",
    role: "Head of Marketing",
    done: [
      "KI-gestützte Zielgruppenanalyse",
      "Automatisierte Kampagnensteuerung",
      "Intelligente Lead-Qualifizierung",
      "Multi-Channel Follow-up Automation",
      "Echtzeit-Reporting & Optimierung",
    ],
    tools: ["n8n", "Make", "Google Ads", "ActiveCampaign", "Zapier"],
  },
  {
    name: "Vertrieb Automation",
    tagline: "Mehr Abschlüsse. Weniger manuelle Vertriebsarbeit.",
    text: "KI-gestützte Pipeline-Steuerung und automatisierte Follow-ups verwandeln qualifizierte Termine schneller in erfolgreiche Abschlüsse.",
    metrics: [
      { sign: "+", value: 37, label: "Mehr qualifizierte Termine in 90 Tagen" },
      { sign: "-", value: 54, label: "Weniger manueller Aufwand im Vertrieb" },
      { sign: "+", value: 31, label: "Höhere Abschlussrate durch Follow-ups" },
    ],
    quote: "Unser Vertrieb arbeitet heute strukturierter, schneller und deutlich effizienter, mit spürbar mehr Abschlüssen.",
    role: "Vertriebsleiter",
    done: [
      "KI-gestützte Lead-Qualifizierung",
      "Automatisierte Follow-up-Sequenzen",
      "Pipeline-Priorisierung in Echtzeit",
      "Terminbuchung & Vertriebsrouting",
      "Reporting für Abschlussraten & Sales-Performance",
    ],
    tools: ["LinkedIn", "HubSpot", "Pipedrive", "Google Ads", "Custom CRM"],
  },
  {
    name: "Kundenservice Chatbot",
    tagline: "Schneller antworten. Kunden besser betreuen.",
    text: "Autonome Anfrage-Erkennung und nahtlose Übergaben entlasten das Serviceteam und sichern Reaktionszeiten rund um die Uhr.",
    metrics: [
      { sign: "+", value: 61, label: "Schnellere Erstreaktion im Kundenservice" },
      { sign: "-", value: 47, label: "Weniger manuelle Support-Anfragen" },
      { sign: "+", value: 34, label: "Höhere Lösungsquote durch den Chatbot" },
    ],
    quote: "Unser Kundenservice ist heute schneller, strukturierter und rund um die Uhr ansprechbar.",
    role: "Head of Customer Support",
    done: [
      "KI-gestützte Anfrage-Erkennung",
      "Automatisierte Antwort-Workflows",
      "Intelligente Übergabe an Mitarbeiter",
      "Chatbot-Betreuung rund um die Uhr",
      "Echtzeit-Reporting & Serviceoptimierung",
    ],
    tools: ["Intercom", "Zendesk", "HubSpot", "WhatsApp", "Slack"],
  },
  {
    name: "Backoffice Automation",
    tagline: "Prozesse automatisieren. Aufwand deutlich reduzieren.",
    text: "Automatische Dokumentenerfassung und fehlerfreie Freigabe-Workflows beschleunigen interne Verwaltungsabläufe deutlich.",
    metrics: [
      { sign: "+", value: 68, label: "Schnellere Vorgangsbearbeitung in 90 Tagen" },
      { sign: "-", value: 59, label: "Weniger manueller Aufwand im Backoffice" },
      { sign: "-", value: 41, label: "Weniger Prozessfehler durch Automatisierung" },
    ],
    quote: "Unsere Backoffice-Prozesse laufen heute strukturierter, schneller und nahezu fehlerfrei.",
    role: "Operations Manager",
    done: [
      "KI-gestützte Dokumentenerkennung",
      "Automatisierte Rechnungs- & Belegverarbeitung",
      "Intelligente Freigabe-Workflows",
      "Datenabgleich zwischen Systemen",
      "Echtzeit-Reporting & Prozessmonitoring",
    ],
    tools: ["Zapier", "Slack", "Airtable", "Google Drive", "n8n"],
  },
  {
    name: "Telefonie AI Assistant",
    tagline: "Anrufe automatisieren. Erreichbarkeit intelligent skalieren.",
    text: "Smarte Sprachassistenten qualifizieren Anrufer rund um die Uhr und buchen Termine eigenständig.",
    metrics: [
      { sign: "+", value: 74, label: "Schnellere Anrufannahme in 90 Tagen" },
      { sign: "-", value: 58, label: "Weniger verpasste Anrufe im Kundenservice" },
      { sign: "+", value: 36, label: "Mehr gebuchte Termine durch KI-Telefonie" },
    ],
    quote: "Unser Telefonprozess ist jetzt rund um die Uhr verfügbar, schneller und deutlich zuverlässiger.",
    role: "Operations Manager",
    done: [
      "KI-gestützte Anrufannahme",
      "Intelligente Anrufqualifizierung",
      "Automatisierte Terminbuchung",
      "Weiterleitung an passende Ansprechpartner",
      "Echtzeit-Reporting & Gesprächsauswertung",
    ],
    tools: ["Twilio", "Vapi", "ElevenLabs", "HubSpot", "n8n"],
  },
  {
    name: "CRM Follow-up",
    tagline: "Leads nachfassen. Kein Potenzial mehr verlieren.",
    text: "Automatisierte Reaktivierungssequenzen stellen sicher, dass kein wertvoller Lead im Nachfassprozess verloren geht.",
    metrics: [
      { sign: "+", value: 46, label: "Mehr reaktivierte Leads in 90 Tagen" },
      { sign: "-", value: 63, label: "Weniger manueller Aufwand im Follow-up" },
      { sign: "+", value: 29, label: "Höhere Rückmeldequote bei Follow-ups" },
    ],
    quote: "Unser CRM arbeitet heute strukturierter, schneller und ohne verlorene Leads im Nachfassprozess.",
    role: "Sales Operations Manager",
    done: [
      "Automatisierte Follow-up-Sequenzen",
      "Lead-Reaktivierung aus dem CRM",
      "Pipeline-Trigger & Erinnerungen",
      "Personalisierte WhatsApp- & E-Mail-Nachfassaktionen",
      "Echtzeit-Reporting & Deal-Tracking",
    ],
    tools: ["HubSpot", "Pipedrive", "WhatsApp", "n8n", "Make"],
  },
];

export const PROCESS = [
  { title: "KI-Potenzialanalyse", text: "Wir analysieren Ihre Prozesse und identifizieren die größten Hebel für Automatisierung und KI." },
  { title: "Anwendungsfälle filtern", text: "Wir bewerten mögliche Anwendungsfälle nach Impact, Aufwand und realistischem Nutzen." },
  { title: "KI-Roadmap", text: "Sie erhalten einen klaren Fahrplan mit priorisierten Schritten für die Umsetzung." },
  { title: "Pilotprojekt", text: "Wir starten mit einem klar definierten, realistisch umsetzbaren Use Case." },
  { title: "Implementierung", text: "Automatisierungen, Workflows und KI-Agenten werden sicher in Ihre bestehenden Prozesse integriert." },
  { title: "Praxistraining", text: "Ihr Team lernt, die neuen Systeme sicher, effizient und produktiv im Alltag zu nutzen." },
  { title: "Optimierung & Skalierung", text: "Wir messen Ergebnisse, optimieren laufend und skalieren erfolgreiche Prozesse Schritt für Schritt." },
];

export const WORKSHOP = {
  title: "Buchen Sie Roman Tränkle als KI-Trainer für Ihr Unternehmen.",
  tagline: "Praxisnah. Verständlich. Umsetzbar.",
  text: "Wir befähigen Ihre Teams, KI sicher zu nutzen und damit echten Mehrwert im Unternehmen zu schaffen.",
  quote: "Mein Ziel ist es, Ihr Team so zu befähigen, dass KI nicht nur verstanden, sondern wirklich im Unternehmen genutzt wird.",
  formats: [
    { title: "Vor-Ort Workshops", text: "Interaktive Hands-on-Workshops direkt in Ihrem Unternehmen." },
    { title: "Online Seminare", text: "Kompakte Live-Trainings mit praxisnahen Übungen und individuellem Austausch." },
    { title: "Leadership Workshops", text: "Entscheidungskompetenz und Zukunftssicherheit für Führungskräfte und Vorstände." },
    { title: "Individuelle Trainings", text: "Schulungsinhalte für spezifische Fachabteilungen und konkrete Anwendungsfälle." },
  ],
  topics: [
    "Generative KI im Unternehmensalltag",
    "KI-gestützte Prozesse & Automatisierung",
    "ChatGPT & Co. effektiv nutzen",
    "KI in Marketing & Vertrieb",
    "Daten, Sicherheit & rechtliche Grundlagen",
    "KI-Strategie & Use Case Entwicklung",
    "KI-Tools, Workflows & Best Practices",
  ],
};

// Each testimonial is one of the client's own YouTube Shorts (channel @brandedgenius), in the order they appear on brandedgenius.de.
export const TESTIMONIALS = [
  {
    quote: "Die Automatisierungen haben unsere Prozesse revolutioniert.",
    name: "Andrea M.",
    designation: "Geschäftsführerin",
    src: "/images/testimonials/t1-portrait.webp",
    youtube: "c4E5xufPoAI",
  },
  {
    quote: "Branded Genius versteht unsere Sprache und liefert Ergebnisse.",
    name: "Daniel K.",
    designation: "Geschäftsführer, Novaro Digital GmbH",
    src: "/images/testimonials/t2-portrait.webp",
    youtube: "D5qQ3EHY800",
  },
  {
    quote: "Hervorragende Begleitung von der ersten Idee bis zur vollendeten Integration.",
    name: "Sebastian S.",
    designation: "Head of Operations, Velo Media Group",
    src: "/images/testimonials/t3-portrait.webp",
    youtube: "Wg4umIAImEw",
  },
  {
    quote: "Die Zusammenarbeit war von Anfang an professionell, schnell und unkompliziert.",
    name: "Michael R.",
    designation: "Geschäftsführer, Nova Consulting GmbH",
    src: "/images/testimonials/t4-portrait.webp",
    youtube: "emZJGuqHMBY",
  },
];

export const CONTACT = {
  email: "info@brandedgenius.de",
  phone: "+49 176 24624981",
  city: "Pforzheim",
};
