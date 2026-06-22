import {
  ArrowRight, BadgeCheck, BarChart3, BookOpen, Check, ChevronDown, CircleDollarSign,
  CloudOff, Coins, Download, FileCheck2, FileSpreadsheet, Fingerprint, Gauge,
  Github, HardDrive, HeartPulse, Landmark, Laptop, LockKeyhole, Menu, PieChart,
  ReceiptText, ShieldCheck, Sparkles, Target, TrendingDown, TrendingUp, WalletCards, X,
} from "lucide-react";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import atlasLogo from "./assets/ostiro-atlas-wordmark.png";
import markLogo from "./assets/ostiro-mark.png";

const downloadUrl = "https://github.com/xarysss/Ostiro-Atlas/releases/latest/download/OstiroAtlas-Setup.exe";
const githubUrl = "https://github.com/xarysss/Ostiro-Atlas";
const signingPolicyUrl = `${githubUrl}/blob/main/docs/CODE_SIGNING_POLICY.md`;
const siteBase = import.meta.env.BASE_URL.replace(/\/$/, "");

type VisualKind = "features" | "wealth" | "portfolio" | "budget" | "dividends" | "fees" |
  "reliability" | "security" | "local" | "csv" | "simulator" | "pricing" | "download" | "guide";

interface PageDefinition {
  path: string;
  nav: string;
  eyebrow: string;
  title: string;
  accent: string;
  summary: string;
  visual: VisualKind;
  stats: Array<[string, string]>;
  features: Array<{ icon: typeof ShieldCheck; title: string; text: string }>;
}

const pages: PageDefinition[] = [
  {
    path: "/fonctionnalites", nav: "Fonctionnalites", eyebrow: "Une seule application",
    title: "Tout votre patrimoine. Une lecture enfin claire.", accent: "Une lecture enfin claire.",
    summary: "Comptes, investissements, immobilier, budget, frais et objectifs se rejoignent dans une interface locale pensee pour comprendre avant d'agir.",
    visual: "features", stats: [["15+", "vues utiles"], ["100 %", "local-first"], ["0", "cloud obligatoire"]],
    features: [
      { icon: WalletCards, title: "Patrimoine consolide", text: "Actifs, passifs et liquidites reunis dans une vue nette." },
      { icon: BarChart3, title: "Analyses lisibles", text: "Allocation, performance, devises, dividendes et frais." },
      { icon: HeartPulse, title: "Sante des donnees", text: "Les anomalies et historiques incomplets restent visibles." },
      { icon: FileSpreadsheet, title: "Imports ouverts", text: "Ajoutez vos donnees manuellement ou avec des CSV documentes." },
    ],
  },
  {
    path: "/patrimoine", nav: "Patrimoine", eyebrow: "Vision a 360 degres",
    title: "Votre patrimoine net, sans angle mort.", accent: "sans angle mort.",
    summary: "Visualisez ce que vous possedez, ce que vous devez et la qualite des informations qui composent chaque total.",
    visual: "wealth", stats: [["1 vue", "pour tout comprendre"], ["Multi-actifs", "financier et reel"], ["Datee", "chaque valeur"]],
    features: [
      { icon: Landmark, title: "Comptes et livrets", text: "Soldes, devises et date de derniere observation." },
      { icon: TrendingUp, title: "Investissements", text: "PEA, CTO, ETF, actions, crypto et enveloppes." },
      { icon: WalletCards, title: "Immobilier et objets", text: "Valeurs estimees clairement distinguees des prix certains." },
      { icon: ReceiptText, title: "Dettes", text: "Credits et passifs integres au calcul du patrimoine net." },
    ],
  },
  {
    path: "/investissements", nav: "Investissements", eyebrow: "Portefeuille fiable",
    title: "La performance expliquee, pas seulement affichee.", accent: "pas seulement affichee.",
    summary: "PRU, plus-values, TWR, TRI, allocation et impact devise reposent sur des formules documentees et un historique qualifie.",
    visual: "portfolio", stats: [["PRU", "trace transactionnelle"], ["TWR + TRI", "deux lectures"], ["Brut / net", "frais separes"]],
    features: [
      { icon: TrendingUp, title: "Performance", text: "Distinguez vos versements de la creation de valeur reelle." },
      { icon: PieChart, title: "Allocation", text: "Analysez la repartition par actif, secteur, zone et devise." },
      { icon: Coins, title: "Multi-devises", text: "Devise du compte, de l'actif et taux historiques conserves." },
      { icon: Target, title: "Objectifs", text: "Comparez la situation actuelle a une allocation cible." },
    ],
  },
  {
    path: "/budget", nav: "Budget", eyebrow: "Cashflow",
    title: "Voyez ou va votre argent, vraiment.", accent: "vraiment.",
    summary: "Revenus, depenses et epargne se lisent comme un flux. Les categories restent modifiables et chaque mouvement garde sa source.",
    visual: "budget", stats: [["Sankey", "flux instantanes"], ["Donut", "depenses detaillees"], ["Mensuel", "taux d'epargne"]],
    features: [
      { icon: ReceiptText, title: "Transactions", text: "Classement local, correction manuelle et historique d'audit." },
      { icon: PieChart, title: "Categories", text: "Logement, alimentation, transport, loisirs et sur-mesure." },
      { icon: TrendingUp, title: "Epargne", text: "Suivez le montant et le taux d'epargne mois apres mois." },
      { icon: Target, title: "Cadre de budget", text: "Comparez votre realite a une cible sans jugement automatique." },
    ],
  },
  {
    path: "/dividendes", nav: "Dividendes", eyebrow: "Revenus du portefeuille",
    title: "Vos dividendes, du versement a la projection.", accent: "a la projection.",
    summary: "Historique, calendrier, retenues et rendement sur cout sont presentes sans transformer une projection en certitude.",
    visual: "dividends", stats: [["Brut / net", "retenues visibles"], ["Calendrier", "paiements dates"], ["Projete", "jamais confondu"]],
    features: [
      { icon: CircleDollarSign, title: "Historique", text: "Chaque paiement est rattache a son actif et son compte." },
      { icon: ReceiptText, title: "Fiscalite estimee", text: "Retenues et hypotheses affichees comme estimations." },
      { icon: BarChart3, title: "Repartition", text: "Identifiez les actifs qui concentrent vos revenus." },
      { icon: Gauge, title: "Rendement", text: "Rendement courant et rendement sur cout calcules separement." },
    ],
  },
  {
    path: "/frais", nav: "Frais", eyebrow: "Ce que la performance ne montre pas",
    title: "Chaque euro de frais remis en perspective.", accent: "remis en perspective.",
    summary: "Courtage, gestion, change et enveloppes sont regroupes pour mesurer leur impact immediat et compose dans le temps.",
    visual: "fees", stats: [["4 familles", "de frais"], ["20 ans", "impact simule"], ["Net", "apres couts"]],
    features: [
      { icon: TrendingDown, title: "Impact compose", text: "Mesurez ce que des frais recurrents coutent a long terme." },
      { icon: ReceiptText, title: "Courtage", text: "Rapprochez chaque frais de la transaction correspondante." },
      { icon: Coins, title: "Change", text: "Isolez les frais FX et l'effet devise de la performance." },
      { icon: BarChart3, title: "Comparaison", text: "Comparez les comptes sur une base homogene." },
    ],
  },
  {
    path: "/fiabilite", nav: "Fiabilite", eyebrow: "Data trust by design",
    title: "Un chiffre sans source n'est pas un chiffre fiable.", accent: "n'est pas un chiffre fiable.",
    summary: "Ostiro Atlas associe a chaque resultat une source, une date, un statut de confiance, une formule et les donnees manquantes.",
    visual: "reliability", stats: [["4 statuts", "de confiance"], ["100 %", "formules tracees"], ["Audit", "corrections datees"]],
    features: [
      { icon: BadgeCheck, title: "Statut explicite", text: "Verifiee, fiable, estimee ou historique incomplet." },
      { icon: FileCheck2, title: "Formule accessible", text: "Comprenez comment le resultat a ete obtenu." },
      { icon: HeartPulse, title: "Sante des donnees", text: "Doublons, actifs inconnus et devises incoherentes signales." },
      { icon: ReceiptText, title: "Audit trail", text: "Ancienne valeur, nouvelle valeur, auteur, raison et impact." },
    ],
  },
  {
    path: "/securite", nav: "Securite", eyebrow: "Privacy by design",
    title: "Vos finances restent sous votre controle.", accent: "sous votre controle.",
    summary: "Pas de compte cloud impose, aucun identifiant bancaire stocke par Ostiro et des exports lisibles a tout moment.",
    visual: "security", stats: [["Local", "par defaut"], ["Lecture seule", "pour les connecteurs"], ["Export", "sans verrou"]],
    features: [
      { icon: HardDrive, title: "Stockage local", text: "La base principale vit sur votre ordinateur." },
      { icon: LockKeyhole, title: "Profil protege", text: "Protection facultative par code ou mot de passe." },
      { icon: CloudOff, title: "Hors ligne", text: "Les fonctions essentielles ne dependent pas d'un serveur." },
      { icon: Github, title: "Code ouvert", text: "Architecture et pratiques de securite auditables." },
    ],
  },
  {
    path: "/local-first", nav: "Local-first", eyebrow: "Une autre architecture",
    title: "L'application fonctionne chez vous, pas autour de vous.", accent: "chez vous, pas autour de vous.",
    summary: "Ostiro Atlas est une application Windows installee. Elle continue a fonctionner sans abonnement cloud ni connexion permanente.",
    visual: "local", stats: [["1 PC", "votre coffre"], ["Offline", "au quotidien"], ["Self-hosted", "sans cloud impose"]],
    features: [
      { icon: Laptop, title: "Application native", text: "Une fenetre rapide, installee comme un logiciel classique." },
      { icon: HardDrive, title: "Base locale", text: "Profils et donnees restent dans votre espace utilisateur." },
      { icon: Download, title: "Mises a jour simples", text: "Le nouvel installateur remplace proprement la version precedente." },
      { icon: ShieldCheck, title: "Surface reduite", text: "Aucun serveur financier central obligatoire." },
    ],
  },
  {
    path: "/imports-csv", nav: "Imports CSV", eyebrow: "Ouvert par conception",
    title: "Importez vos donnees sans attendre une banque.", accent: "sans attendre une banque.",
    summary: "Des exemples documentes, un apercu avant validation et un rapport d'erreurs rendent l'import CSV utilisable des la premiere minute.",
    visual: "csv", stats: [["CSV", "format lisible"], ["Apercu", "avant import"], ["Doublons", "detectes"]],
    features: [
      { icon: FileSpreadsheet, title: "Banque", text: "Date, libelle, montant, devise et compte." },
      { icon: TrendingUp, title: "Courtier", text: "Achats, ventes, quantites, prix et frais." },
      { icon: FileCheck2, title: "Validation", text: "Les lignes invalides sont expliquees avant ecriture." },
      { icon: HeartPulse, title: "Historique incomplet", text: "Ajoutez un solde initial ou marquez une estimation." },
    ],
  },
  {
    path: "/simulateurs", nav: "Simulateurs", eyebrow: "Projeter sans promettre",
    title: "Explorez plusieurs futurs, gardez vos hypotheses visibles.", accent: "gardez vos hypotheses visibles.",
    summary: "Interets composes, effort d'epargne, independance financiere, dividendes, frais et credit dans un espace pedagogique.",
    visual: "simulator", stats: [["3 scenarios", "pessimiste a optimiste"], ["10-30 ans", "horizon flexible"], ["Temps reel", "courbes reactives"]],
    features: [
      { icon: TrendingUp, title: "Interets composes", text: "Capital, effort mensuel, rendement et duree." },
      { icon: Target, title: "Objectif patrimonial", text: "Estimez l'effort necessaire pour atteindre une cible." },
      { icon: TrendingDown, title: "Impact des frais", text: "Comparez plusieurs niveaux de cout sur la duree." },
      { icon: Landmark, title: "Credit", text: "Mensualites, interets et cout total pedagogique." },
    ],
  },
  {
    path: "/tarifs", nav: "Tarifs", eyebrow: "Simple et transparent",
    title: "Commencez localement. Payez seulement pour les services externes.", accent: "Payez seulement pour les services externes.",
    summary: "Le coeur local, les imports et les calculs restent ouverts. Une future offre connectee couvrira les couts reels des fournisseurs bancaires.",
    visual: "pricing", stats: [["0 EUR", "coeur local"], ["Open source", "AGPL-3.0"], ["Sans carte", "pour commencer"]],
    features: [
      { icon: Check, title: "Ostiro Local", text: "Profils, patrimoine, portefeuille, CSV, budget et exports." },
      { icon: Github, title: "Self-hosted", text: "Code source et documentation disponibles publiquement." },
      { icon: CloudOff, title: "Sans abonnement force", text: "L'application locale continue de fonctionner." },
      { icon: Sparkles, title: "Connecte plus tard", text: "Une offre distincte seulement si l'agregation bancaire est activee." },
    ],
  },
  {
    path: "/telecharger", nav: "Telecharger", eyebrow: "Ostiro Atlas pour Windows",
    title: "Installez. Creez votre espace. Cartographiez.", accent: "Cartographiez.",
    summary: "Un installateur Windows public, sans compte de demonstration ni outils developpeur. Le tutoriel vous accompagne au premier lancement.",
    visual: "download", stats: [["Windows 10/11", "64 bits"], ["Local", "aucun compte cloud"], ["SHA-256", "integrite verifiable"]],
    features: [
      { icon: Download, title: "Installateur classique", text: "Double-cliquez, installez et lancez Ostiro Atlas." },
      { icon: ShieldCheck, title: "Build public", text: "Aucun menu developpeur ni scenario fictif expose." },
      { icon: BookOpen, title: "Tutoriel integre", text: "Deux etapes pour creer et personnaliser votre espace." },
      { icon: Github, title: "Version ouverte", text: "Chaque livraison reste rattachee au code source." },
    ],
  },
  {
    path: "/guide-demarrage", nav: "Guide", eyebrow: "Premiers pas",
    title: "Votre premiere carte financiere en moins de dix minutes.", accent: "en moins de dix minutes.",
    summary: "Installez l'application, creez un profil local, importez un exemple ou ajoutez vos premiers comptes manuellement.",
    visual: "guide", stats: [["2 etapes", "onboarding"], ["3 methodes", "manuel, CSV, sauvegarde"], ["10 min", "pour demarrer"]],
    features: [
      { icon: Download, title: "1. Installer", text: "Telechargez l'EXE et suivez l'assistant Windows." },
      { icon: Fingerprint, title: "2. Creer un profil", text: "Choisissez un nom, une devise et une protection facultative." },
      { icon: FileSpreadsheet, title: "3. Ajouter des donnees", text: "Saisie manuelle ou import CSV avec apercu." },
      { icon: HeartPulse, title: "4. Verifier", text: "Consultez la sante des donnees avant d'analyser." },
    ],
  },
];

function usePathname() {
  const currentPath = () => {
    const rawPath = window.location.pathname.replace(/\/$/, "") || "/";
    return siteBase && rawPath.startsWith(siteBase) ? rawPath.slice(siteBase.length) || "/" : rawPath;
  };
  const [pathname, setPathname] = useState(currentPath);
  useEffect(() => {
    const onPopState = () => setPathname(currentPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
  return pathname;
}

function SiteLink({ href, children, className = "", onClick }: { href: string; children: ReactNode; className?: string; onClick?: () => void }) {
  const external = href.startsWith("http") || href.startsWith("mailto:");
  const resolvedHref = external ? href : `${siteBase}${href}`;
  return <a className={className} href={resolvedHref} onClick={(event) => {
    onClick?.();
    if (!external && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      window.history.pushState({}, "", resolvedHref);
      window.dispatchEvent(new PopStateEvent("popstate"));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }}>{children}</a>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  return <header className="site-header">
    <div className="nav-shell">
      <SiteLink href="/" className="site-brand"><img src={atlasLogo} alt="Ostiro Atlas" /></SiteLink>
      <nav className={open ? "main-nav main-nav--open" : "main-nav"} aria-label="Navigation principale">
        <div className="nav-dropdown">
          <button onClick={() => setProductsOpen(!productsOpen)}>Produit <ChevronDown size={14}/></button>
          <div className={productsOpen ? "nav-mega nav-mega--open" : "nav-mega"}>
            {pages.slice(0, 7).map((page) => <SiteLink href={page.path} key={page.path} onClick={() => setOpen(false)}><span>{page.eyebrow}</span><strong>{page.nav}</strong></SiteLink>)}
          </div>
        </div>
        <SiteLink href="/fiabilite" onClick={() => setOpen(false)}>Fiabilite</SiteLink>
        <SiteLink href="/securite" onClick={() => setOpen(false)}>Securite</SiteLink>
        <SiteLink href="/tarifs" onClick={() => setOpen(false)}>Tarifs</SiteLink>
        <SiteLink href="/guide-demarrage" onClick={() => setOpen(false)}>Guide</SiteLink>
      </nav>
      <div className="nav-actions">
        <a className="github-link" href={githubUrl} target="_blank" rel="noreferrer"><Github size={17}/><span>GitHub</span></a>
        <SiteLink href="/telecharger" className="button button--gold">Telecharger <Download size={15}/></SiteLink>
        <button className="menu-button" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
      </div>
    </div>
  </header>;
}

function Footer() {
  return <footer className="site-footer">
    <div className="footer-lead">
      <img src={atlasLogo} alt="Ostiro Atlas" />
      <h2>Toute votre vie financiere, enfin cartographiee.</h2>
      <p>Une application patrimoniale locale, ouverte et construite autour de la fiabilite des donnees.</p>
      <SiteLink href="/telecharger" className="button button--gold">Telecharger pour Windows <ArrowRight size={16}/></SiteLink>
    </div>
    <div className="footer-links">
      <div><strong>Produit</strong>{pages.slice(0, 6).map((page) => <SiteLink href={page.path} key={page.path}>{page.nav}</SiteLink>)}</div>
      <div><strong>Confiance</strong>{pages.slice(6, 10).map((page) => <SiteLink href={page.path} key={page.path}>{page.nav}</SiteLink>)}</div>
      <div><strong>Ressources</strong>{pages.slice(10).map((page) => <SiteLink href={page.path} key={page.path}>{page.nav}</SiteLink>)}</div>
      <div><strong>Projet</strong><a href={githubUrl}>GitHub</a><a href={`${githubUrl}/blob/main/SECURITY.md`}>Securite</a><a href={`${githubUrl}/blob/main/LICENSE`}>Licence AGPL</a><a href="mailto:contact@ostiro.fr">Contact</a></div>
    </div>
    <div className="footer-bottom"><span>Ostiro Atlas 2026</span><span>Analyses pedagogiques. Aucun conseil financier ou fiscal personnalise.</span></div>
  </footer>;
}

function DashboardMockup({ kind = "wealth" }: { kind?: VisualKind }) {
  if (kind === "security" || kind === "local" || kind === "download" || kind === "guide") return <ConceptVisual kind={kind}/>;
  if (kind === "pricing") return <PricingVisual/>;
  if (kind === "csv") return <CsvVisual/>;
  if (kind === "reliability") return <ReliabilityVisual/>;
  if (kind === "budget") return <BudgetVisual/>;
  if (kind === "simulator") return <SimulatorVisual/>;

  const title = kind === "portfolio" ? "Portefeuille" : kind === "dividends" ? "Dividendes" : kind === "fees" ? "Frais" : "Patrimoine net";
  const value = kind === "dividends" ? "3 842 EUR" : kind === "fees" ? "- 1 286 EUR" : kind === "portfolio" ? "163 717 EUR" : "421 850 EUR";
  return <div className="app-mockup">
    <aside><img src={markLogo} alt=""/><i className="active"/><i/><i/><i/><i/></aside>
    <section>
      <div className="mock-top"><span>{title}</span><b>FIABLE</b></div>
      <small>VALEUR CONSOLIDEE</small><strong>{value}</strong><em>{kind === "fees" ? "- 0,31 % du patrimoine" : "+ 8,4 % cette annee"}</em>
      <svg viewBox="0 0 680 220" role="img" aria-label="Evolution du patrimoine">
        <defs><linearGradient id={`chart-${kind}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ecc58f" stopOpacity=".3"/><stop offset="1" stopColor="#ecc58f" stopOpacity="0"/></linearGradient></defs>
        <path className="chart-area" style={{fill:`url(#chart-${kind})`}} d="M5 195 C80 176 100 120 170 150 C240 181 264 92 345 109 C430 127 462 53 540 76 C600 92 635 31 675 22 L675 218 L5 218 Z"/>
        <path className="chart-line" d="M5 195 C80 176 100 120 170 150 C240 181 264 92 345 109 C430 127 462 53 540 76 C600 92 635 31 675 22"/>
      </svg>
      <div className="mock-cards"><span><small>INVESTISSEMENTS</small><b>163 717 EUR</b></span><span><small>PERFORMANCE NETTE</small><b>+ 26 947 EUR</b></span><span><small>DONNEES A VERIFIER</small><b>4 elements</b></span></div>
    </section>
  </div>;
}

function ReliabilityVisual() {
  return <div className="reliability-visual visual-card">
    <div className="visual-title"><HeartPulse/><span><small>SANTE DES DONNEES</small><strong>92 / 100</strong></span><b>Bon</b></div>
    {[["PRU du PEA", "Verifiee", "18 juin 2026"], ["Valeur immobiliere", "Estimee", "12 juin 2026"], ["Historique crypto", "Incomplet", "Action requise"], ["Taux USD/EUR", "Fiable", "21 juin 2026"]].map(([name,status,date], index) => <div className="health-row" key={name}><i className={`health-dot health-dot--${index}`}/><span><strong>{name}</strong><small>{date}</small></span><b>{status}</b></div>)}
  </div>;
}

function BudgetVisual() {
  return <div className="budget-visual visual-card"><div className="visual-title"><ReceiptText/><span><small>CASHFLOW MENSUEL</small><strong>+ 1 245 EUR</strong></span><b>31 % epargne</b></div><svg viewBox="0 0 700 300"><path d="M40 70 C190 70 175 145 340 145"/><path d="M40 210 C190 210 175 145 340 145"/><path d="M340 145 C510 145 505 55 665 55"/><path d="M340 145 C510 145 505 150 665 150"/><path d="M340 145 C510 145 505 245 665 245"/></svg><div className="flow-labels"><span>Revenus<br/><b>4 020 EUR</b></span><span>Disponible<br/><b>4 020 EUR</b></span><span>Depenses<br/><b>2 775 EUR</b></span></div></div>;
}

function SimulatorVisual() {
  return <div className="simulator-visual visual-card"><div className="visual-title"><TrendingUp/><span><small>PROJECTION A 20 ANS</small><strong>684 200 EUR</strong></span><b>Scenario realiste</b></div><svg viewBox="0 0 700 300"><path className="sim-line sim-line--one" d="M20 270 C180 250 260 220 360 180 C480 130 570 92 680 72"/><path className="sim-line sim-line--two" d="M20 270 C170 245 250 190 360 135 C470 80 560 38 680 18"/><path className="sim-line sim-line--three" d="M20 270 C180 260 270 240 360 215 C480 185 565 155 680 128"/></svg><div className="legend"><span><i/>Optimiste</span><span><i/>Realiste</span><span><i/>Pessimiste</span></div></div>;
}

function CsvVisual() {
  return <div className="csv-visual visual-card"><div className="drop-zone"><FileSpreadsheet/><strong>portefeuille-2026.csv</strong><small>148 lignes detectees</small><b>PRET A IMPORTER</b></div><div className="csv-table"><span>Date</span><span>Libelle</span><span>Montant</span><span>Statut</span>{[["18/06", "Achat CW8", "- 1 240 EUR"], ["20/06", "Dividende Air Liquide", "+ 34 EUR"], ["21/06", "Frais courtage", "- 2,50 EUR"]].flatMap((row) => row.map((cell) => <span key={`${row[0]}-${cell}`}>{cell}</span>))}</div></div>;
}

function PricingVisual() {
  return <div className="pricing-visual"><article><span>OSTIRO LOCAL</span><strong>Gratuit</strong><small>Pour toujours sur votre ordinateur</small><hr/>{["Patrimoine et portefeuille", "Imports CSV", "Budget et simulateurs", "Exports et sauvegardes"].map((text) => <p key={text}><Check/>{text}</p>)}<a href={downloadUrl}>Telecharger <ArrowRight/></a></article><article className="pricing-future"><span>OSTIRO CONNECTE</span><strong>Plus tard</strong><small>Quand un fournisseur fiable sera integre</small><hr/>{["Synchronisation bancaire", "Mises a jour automatiques", "Support prioritaire", "Couts fournisseur inclus"].map((text) => <p key={text}><Check/>{text}</p>)}<button disabled>Liste d'attente</button></article></div>;
}

function ConceptVisual({ kind }: { kind: "security" | "local" | "download" | "guide" }) {
  const content = {
    security: { icon: ShieldCheck, title: "Architecture locale", detail: "Vos donnees principales restent sur votre ordinateur.", items: ["Base locale", "Profils proteges", "Exports ouverts"] },
    local: { icon: HardDrive, title: "Votre ordinateur", detail: "Ostiro fonctionne sans serveur financier central.", items: ["SQLite local", "Mode hors ligne", "Self-hosted"] },
    download: { icon: Download, title: "Ostiro Atlas 0.4", detail: "Installateur Windows public 64 bits.", items: ["Sans compte demo", "Tutoriel integre", "Mise a jour propre"] },
    guide: { icon: BookOpen, title: "Demarrage guide", detail: "Deux ecrans pour creer votre espace local.", items: ["Votre profil", "Vos objectifs", "Vos premieres donnees"] },
  }[kind];
  const Icon = content.icon;
  return <div className="concept-visual visual-card"><div className="concept-orbit concept-orbit--one"/><div className="concept-orbit concept-orbit--two"/><div className="concept-core"><Icon/><span><small>OSTIRO ATLAS</small><strong>{content.title}</strong><p>{content.detail}</p></span></div><div className="concept-items">{content.items.map((item, index) => <span key={item} style={{"--index":index} as CSSProperties}><Check/>{item}</span>)}</div></div>;
}

function TrustBar() {
  return <div className="trust-bar"><span><HardDrive/>Stockage local</span><span><BadgeCheck/>Calculs tracables</span><span><CloudOff/>Fonctionne hors ligne</span><span><Github/>Open source</span></div>;
}

function HomePage() {
  return <>
    <main>
      <section className="hero home-hero">
        <div className="hero-copy"><span className="kicker"><Sparkles/> Patrimoine prive, vision complete</span><h1>Toute votre vie financiere, <em>enfin cartographiee.</em></h1><p>Suivez votre patrimoine, analysez vos investissements et comprenez chaque chiffre dans une application locale, ouverte et sans cloud obligatoire.</p><div className="hero-actions"><a className="button button--gold button--large" href={downloadUrl}>Telecharger pour Windows <Download/></a><SiteLink className="button button--ghost button--large" href="/fonctionnalites">Decouvrir Ostiro <ArrowRight/></SiteLink></div><small className="hero-note"><ShieldCheck/> Windows 10/11 · Donnees locales · Version open source</small></div>
        <div className="hero-visual"><DashboardMockup/><div className="floating-proof floating-proof--one"><HardDrive/><span><strong>100 % local</strong><small>Aucun cloud requis</small></span></div><div className="floating-proof floating-proof--two"><BadgeCheck/><span><strong>Donnee fiable</strong><small>Source et formule visibles</small></span></div></div>
      </section>
      <TrustBar/>
      <section className="section intro-section"><span className="section-kicker">UNE BASE SOLIDE</span><h2>Votre patrimoine ne devrait pas etre une boite noire.</h2><p className="section-lead">Ostiro Atlas ne se contente pas d'afficher des nombres. Il indique d'ou ils viennent, quand ils ont ete mis a jour et ce qu'il manque pour leur faire confiance.</p><div className="pillar-grid"><article><span>01</span><HeartPulse/><h3>Fiabilite visible</h3><p>Chaque resultat porte son niveau de confiance et ses limites.</p><SiteLink href="/fiabilite">Comprendre la methode <ArrowRight/></SiteLink></article><article><span>02</span><HardDrive/><h3>Local par defaut</h3><p>Votre base financiere principale reste sur votre machine.</p><SiteLink href="/local-first">Explorer le local-first <ArrowRight/></SiteLink></article><article><span>03</span><BarChart3/><h3>Analyses utiles</h3><p>Performance, frais, devises et dividendes sans surcharge.</p><SiteLink href="/investissements">Voir les analyses <ArrowRight/></SiteLink></article></div></section>
      <section className="section showcase-section"><div className="showcase-copy"><span className="section-kicker">VUE CONSOLIDEE</span><h2>Tout ce que vous possedez. Tout ce que vous devez.</h2><p>Comptes, livrets, PEA, CTO, crypto, immobilier, montres et credits reunis dans une seule carte patrimoniale.</p><ul><li><Check/> Actifs financiers et reels</li><li><Check/> Passifs integres au total net</li><li><Check/> Estimations clairement identifiees</li></ul><SiteLink href="/patrimoine" className="text-link">Decouvrir le patrimoine <ArrowRight/></SiteLink></div><DashboardMockup kind="wealth"/></section>
      <section className="section dark-section"><span className="section-kicker">LA CONFIANCE AVANT TOUT</span><h2>Un chiffre qui change doit pouvoir s'expliquer.</h2><ReliabilityVisual/><div className="dark-copy-grid"><p><strong>Source.</strong> L'origine de la valeur reste attachee au calcul.</p><p><strong>Date.</strong> Vous savez quand l'information a ete observee.</p><p><strong>Statut.</strong> Une estimation ne se presente jamais comme certaine.</p><p><strong>Audit.</strong> Toute correction manuelle laisse une trace lisible.</p></div></section>
      <section className="section steps-section"><span className="section-kicker">DEMARRER SIMPLEMENT</span><h2>Votre premiere carte en trois etapes.</h2><div className="steps"><article><b>1</b><Download/><h3>Installez Ostiro</h3><p>Un installateur Windows classique, sans compte cloud.</p></article><article><b>2</b><Fingerprint/><h3>Creez votre espace</h3><p>Choisissez votre devise, votre niveau et vos objectifs.</p></article><article><b>3</b><FileSpreadsheet/><h3>Ajoutez vos donnees</h3><p>Saisie manuelle, CSV ou restauration d'une sauvegarde.</p></article></div><SiteLink href="/guide-demarrage" className="button button--ghost">Lire le guide complet <ArrowRight/></SiteLink></section>
      <FinalCta/>
    </main>
  </>;
}

function GenericPage({ page }: { page: PageDefinition }) {
  return <main>
    <section className="hero product-hero"><div className="hero-copy"><span className="kicker">{page.eyebrow}</span><h1>{page.title}</h1><p>{page.summary}</p><div className="hero-actions"><a href={downloadUrl} className="button button--gold button--large">Telecharger <Download/></a><SiteLink href="/guide-demarrage" className="button button--ghost button--large">Voir le guide <ArrowRight/></SiteLink></div></div><div className="hero-visual"><DashboardMockup kind={page.visual}/></div></section>
    <div className="stats-strip">{page.stats.map(([value,label]) => <span key={value}><strong>{value}</strong><small>{label}</small></span>)}</div>
    <section className="section feature-section"><span className="section-kicker">{page.nav.toUpperCase()}</span><h2>Concu pour rester clair quand vos finances deviennent complexes.</h2><div className="feature-grid">{page.features.map(({icon:Icon,title,text}) => <article key={title}><Icon/><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    {page.path === "/telecharger" && <section className="section signing-section"><div><span className="section-kicker">CODE SIGNING POLICY</span><h2>Une signature verifiable, jamais supposee.</h2><p>Free code signing provided by <a href="https://about.signpath.io">SignPath.io</a>, certificate by <a href="https://signpath.org">SignPath Foundation</a>. Cette mention couvrira les releases dont la signature Authenticode est valide; la version 0.4.0 actuelle reste non signee pendant l'examen de la candidature.</p><a className="text-link" href={signingPolicyUrl}>Lire la politique de signature <ArrowRight/></a></div><ShieldCheck aria-hidden="true"/></section>}
    <section className="section method-section"><div><span className="section-kicker">METHODE OSTIRO</span><h2>Source. Date. Statut. Formule.</h2><p>Ces quatre informations accompagnent les indicateurs sensibles afin de ne jamais confondre une donnee certaine, une estimation et un historique incomplet.</p><SiteLink href="/fiabilite" className="text-link">Voir notre approche des donnees <ArrowRight/></SiteLink></div><div className="method-stack"><span><b>01</b>Source identifiee<Check/></span><span><b>02</b>Date de mise a jour<Check/></span><span><b>03</b>Niveau de confiance<Check/></span><span><b>04</b>Calcul explique<Check/></span></div></section>
    <FinalCta/>
  </main>;
}

function FinalCta() {
  return <section className="final-cta"><img src={markLogo} alt=""/><span className="section-kicker">PRET A COMMENCER ?</span><h2>Votre patrimoine merite une carte fiable.</h2><p>Telechargez Ostiro Atlas et creez votre premier espace local.</p><div><a href={downloadUrl} className="button button--gold button--large">Telecharger l'installateur <Download/></a><a href={githubUrl} className="button button--ghost button--large">Voir sur GitHub <Github/></a></div></section>;
}

function NotFound() {
  return <main className="not-found"><span>404</span><h1>Cette page n'est pas encore sur la carte.</h1><SiteLink href="/" className="button button--gold">Retour a l'accueil</SiteLink></main>;
}

export default function App() {
  const pathname = usePathname();
  const page = pages.find((candidate) => candidate.path === pathname);
  useEffect(() => { document.title = page ? `${page.nav} - Ostiro Atlas` : pathname === "/" ? "Ostiro Atlas - Toute votre vie financiere, enfin cartographiee." : "Page introuvable - Ostiro Atlas"; }, [page, pathname]);
  return <div className="site-shell"><Header/>{pathname === "/" ? <HomePage/> : page ? <GenericPage page={page}/> : <NotFound/>}<Footer/></div>;
}
