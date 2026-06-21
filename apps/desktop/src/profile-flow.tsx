import {
  ArrowLeft, ArrowRight, BadgeCheck, Check, ChevronRight, CircleUserRound, CloudOff,
  Code2, Copy, Database, FileArchive, FileInput, FolderOpen, Gauge, HardDrive,
  KeyRound, Laptop, LockKeyhole, Map, Moon, Plus, RotateCcw, ShieldCheck, Sparkles,
  Sun, Trash2, UserRound, UsersRound, WalletCards,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { defaultAnswers, experienceLabels, goalLabels, type LocalProfile, type ProfileDraft } from "./profile-types";

const problemChoices = [
  ["excel", "Je perds trop de temps avec Excel"], ["money_flow", "Je ne sais pas où va mon argent"],
  ["clear_wealth", "Je n'ai pas une vision claire de mon patrimoine"], ["investments", "Je veux suivre mes investissements"],
  ["fees", "Je veux comprendre mes frais"], ["retirement", "Je veux préparer ma retraite"],
  ["banker", "Je veux arrêter de dépendre de mon banquier"], ["dividends", "Je veux mieux gérer mes dividendes"],
  ["centralize", "Je veux simplement centraliser mes comptes"], ["other", "Autre"],
] as const;

const assetChoices = [
  ["bank_accounts", "Comptes bancaires"], ["savings", "Livrets"], ["pea", "PEA"], ["cto", "CTO"],
  ["life_insurance", "Assurance-vie"], ["per", "PER"], ["pee", "PEE"], ["stocks", "Actions"],
  ["etf", "ETF"], ["bonds", "Obligations"], ["crypto", "Crypto"], ["metals", "Métaux précieux"],
  ["real_estate", "Immobilier"], ["scpi", "SCPI"], ["loans", "Prêts & dettes"], ["company", "Entreprise"],
  ["income", "Revenus"], ["budget", "Budget"], ["dividends", "Dividendes"], ["fees", "Frais"], ["goals", "Objectifs"],
] as const;

const initialDraft: ProfileDraft = { ...defaultAnswers, trackedAssets: [...defaultAnswers.trackedAssets], problems: [], name: "", secret: "" };

function Brand() {
  return <div className="entry-brand"><span className="brand__mark"><span/><span/><span/></span><div><strong>Ostiro</strong><small>ATLAS</small></div></div>;
}

export function WelcomeScreen({ onCreate, onProfiles, onDemo, onDeveloper }: {
  onCreate: () => void; onProfiles: () => void; onDemo: () => void; onDeveloper: () => void;
}) {
  return <div className="entry-shell welcome-screen">
    <header className="entry-header"><Brand/><div><span><CloudOff size={14}/> 100 % local</span><button onClick={onDeveloper}><Code2 size={15}/> Mode développeur</button></div></header>
    <main className="welcome-main">
      <section className="welcome-copy">
        <span className="welcome-kicker"><Sparkles size={14}/> Votre patrimoine, sans intermédiaire</span>
        <h1>Toute votre vie financière,<br/><em>enfin cartographiée.</em></h1>
        <p>Suivez votre patrimoine en local, sans abonnement, sans cloud obligatoire, avec clarté.</p>
        <div className="welcome-actions">
          <button className="entry-primary" onClick={onProfiles}><UsersRound size={18}/> Ouvrir un profil local <ArrowRight size={17}/></button>
          <button className="entry-secondary" onClick={onCreate}><Plus size={18}/> Créer un nouveau profil</button>
          <button className="entry-tertiary" onClick={onDemo}><Gauge size={18}/> Explorer le compte de démonstration</button>
          <button className="google-soon" disabled title="Prévu uniquement pour un futur cloud optionnel"><CircleUserRound size={17}/> Continuer avec Google <b>Bientôt</b></button>
        </div>
        <div className="trust-row"><span><ShieldCheck size={15}/> Données sur ce PC</span><span><BadgeCheck size={15}/> Open source</span><span><CloudOff size={15}/> Fonctionne hors ligne</span></div>
      </section>
      <section className="welcome-visual" aria-label="Aperçu Ostiro Atlas">
        <div className="map-orbit map-orbit--one"/><div className="map-orbit map-orbit--two"/><div className="map-orbit map-orbit--three"/>
        <div className="preview-window">
          <div className="preview-window__bar"><i/><i/><i/><span>VUE PATRIMONIALE</span></div>
          <div className="preview-window__content"><aside><Brand/><span/><span/><span/><span/></aside><article><div className="preview-caption">PATRIMOINE NET</div><strong>421 850 €</strong><small>+9,6 % sur 1 an</small><div className="preview-chart"><svg viewBox="0 0 420 135" preserveAspectRatio="none"><path d="M0 118 C45 108 60 96 95 101 S145 75 180 82 S230 52 270 60 S325 29 350 38 S395 8 420 14"/><path className="preview-chart__dash" d="M0 120 L420 42"/></svg></div><div className="preview-cards"><span/><span/><span/></div></article></div>
        </div>
        <div className="local-proof"><LockKeyhole size={18}/><span><strong>Aucune donnée envoyée</strong><small>Votre base reste chiffrable et locale</small></span></div>
      </section>
    </main>
    <footer className="entry-footer"><span>Ostiro Atlas 0.3</span><span>AGPL-3.0 · France · Local-first</span></footer>
  </div>;
}

export function ProfilesScreen({ profiles, loading, onBack, onCreate, onOpen, onDemo, onDuplicate, onDelete, onImport }: {
  profiles: LocalProfile[]; loading: boolean; onBack: () => void; onCreate: () => void;
  onOpen: (profile: LocalProfile) => void; onDemo: () => void; onDuplicate: (profile: LocalProfile) => void;
  onDelete: (profile: LocalProfile) => void; onImport: () => void;
}) {
  return <div className="entry-shell profiles-screen"><header className="entry-header"><Brand/><button className="entry-back" onClick={onBack}><ArrowLeft size={16}/> Accueil</button></header>
    <main className="profiles-main"><div className="entry-title"><span className="eyebrow">Profils locaux</span><h1>Quel espace souhaitez-vous ouvrir ?</h1><p>Chaque profil possède ses préférences, ses données et ses sauvegardes.</p></div>
      {loading ? <div className="profile-loading"><span/><p>Lecture des profils sur cet ordinateur…</p></div> : <div className="profiles-grid">
        {profiles.map((profile) => <article className={profile.isDemo ? "profile-tile profile-tile--demo" : "profile-tile"} key={profile.id}>
          <button className="profile-tile__open" onClick={() => onOpen(profile)}><span className="profile-avatar">{profile.initials}</span><span className="profile-tile__copy"><strong>{profile.name}</strong><small>{profile.isDemo ? "Scénario complet fictif" : `Dernière ouverture ${formatRelative(profile.lastOpenedAt)}`}</small></span><ChevronRight size={19}/></button>
          <div className="profile-tile__meta"><span className={`backup-dot backup-dot--${profile.backupStatus}`}/>{profile.backupStatus === "protected" ? "Sauvegarde protégée" : profile.backupStatus === "local" ? "Sauvegarde locale" : "Sauvegarde à configurer"}{profile.isProtected && <i><LockKeyhole size={12}/> Protégé</i>}</div>
          {!profile.isDemo && <div className="profile-tile__actions"><button title="Dupliquer" onClick={() => onDuplicate(profile)}><Copy size={15}/></button><button title="Supprimer" onClick={() => onDelete(profile)}><Trash2 size={15}/></button></div>}
        </article>)}
        <button className="new-profile-tile" onClick={onCreate}><span><Plus size={22}/></span><strong>Nouveau profil</strong><small>Créer un espace séparé</small></button>
      </div>}
      <div className="profiles-secondary"><button onClick={onImport}><FileArchive size={17}/> Restaurer une sauvegarde</button><button onClick={onDemo}><Gauge size={17}/> Lancer directement la démo</button></div>
    </main><footer className="entry-footer"><span><Database size={13}/> Profils lus depuis SQLite</span><span>Rien n'est envoyé à Ostiro</span></footer>
  </div>;
}

export function UnlockScreen({ profile, onBack, onUnlock }: { profile: LocalProfile; onBack: () => void; onUnlock: (secret: string) => Promise<boolean> }) {
  const [secret, setSecret] = useState(""); const [error, setError] = useState(false); const [busy, setBusy] = useState(false);
  const submit = async () => { setBusy(true); const valid = await onUnlock(secret); setBusy(false); setError(!valid); };
  return <div className="entry-shell unlock-screen"><header className="entry-header"><Brand/><button className="entry-back" onClick={onBack}><ArrowLeft size={16}/> Profils</button></header><main className="unlock-main"><span className="profile-avatar profile-avatar--large">{profile.initials}</span><span className="eyebrow">Profil protégé</span><h1>Ravi de vous revoir, {profile.name.split(" ")[0]}.</h1><p>Entrez votre mot de passe ou code PIN pour déverrouiller cet espace local.</p><label className={error ? "entry-field entry-field--error" : "entry-field"}><span>Mot de passe ou PIN</span><div><KeyRound size={17}/><input autoFocus type="password" value={secret} onChange={(event) => {setSecret(event.target.value);setError(false);}} onKeyDown={(event) => {if(event.key === "Enter") void submit();}} placeholder="Votre secret local"/></div>{error && <small>Ce secret ne correspond pas à ce profil.</small>}</label><button className="entry-primary" disabled={!secret || busy} onClick={() => void submit()}>{busy ? "Vérification…" : "Ouvrir mon espace"}<ArrowRight size={17}/></button><span className="unlock-note"><CloudOff size={14}/> Vérification effectuée uniquement sur cet ordinateur</span></main></div>;
}

export function OnboardingFlow({ onCancel, onComplete }: { onCancel: () => void; onComplete: (draft: ProfileDraft) => Promise<void> }) {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<ProfileDraft>(initialDraft);
  const [saving, setSaving] = useState(false);
  const update = <K extends keyof ProfileDraft>(key: K, value: ProfileDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const toggleAsset = (value: string) => update("trackedAssets", draft.trackedAssets.includes(value) ? draft.trackedAssets.filter((item) => item !== value) : [...draft.trackedAssets, value]);
  const quickExperience: Array<[ProfileDraft["experience"], string, string]> = [
    ["beginner", "Débutant", "Des explications claires et progressives"],
    ["casual", "Intermédiaire", "L'essentiel, avec les indicateurs utiles"],
    ["advanced", "Avancé", "PRU, TRI, TWR, frais et devises en priorité"],
  ];
  const quickGoals = Object.entries(goalLabels).filter(([key]) => ["balance_wealth","track_investments","retirement","dividends","real_estate","other"].includes(key));
  const quickAssets = assetChoices.filter(([key]) => ["bank_accounts","savings","pea","cto","life_insurance","per","crypto","real_estate","metals","loans","budget","dividends","fees"].includes(key));
  useEffect(() => {
    document.documentElement.dataset.theme = draft.theme === "system"
      ? window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
      : draft.theme;
  }, [draft.theme]);
  const invalid = step === 1 ? !draft.name.trim() || (draft.protectionEnabled && draft.secret.length < 4) : draft.trackedAssets.length === 0;
  const finish = async () => { setSaving(true); await onComplete(draft); setSaving(false); };

  return <div className="entry-shell onboarding-screen onboarding-screen--quick">
    <header className="entry-header"><Brand/><button className="entry-back" onClick={onCancel}><ArrowLeft size={16}/> Quitter</button></header>
    <div className="onboarding-progress"><div><span className="active"/><span className={step === 2 ? "active" : ""}/></div><small>Étape {step} sur 2</small></div>
    <main className="onboarding-main onboarding-main--quick">
      <div className="onboarding-heading"><span className="eyebrow">Création locale · moins d'une minute</span><h1>{step === 1 ? "Configurez votre profil" : "Personnalisez votre Atlas"}</h1><p>{step === 1 ? "Les réglages essentiels. Tout le reste pourra être modifié plus tard." : "Trois réponses pour organiser votre expérience, sans masquer les fonctions."}</p></div>
      {step === 1 ? <div className="quick-profile-grid">
        <section className="quick-profile-card"><span className="quick-icon"><UserRound/></span><Field label="Prénom ou pseudo"><input autoFocus value={draft.name} onChange={(e) => update("name",e.target.value)} placeholder="Ex. Jeanne"/></Field><Field label="Devise principale"><select value={draft.currency} onChange={(e) => update("currency",e.target.value)}><option>EUR</option><option>CHF</option><option>USD</option><option>GBP</option></select></Field></section>
        <section className="quick-profile-card"><span className="quick-icon"><Sparkles/></span><Field label="Apparence"><div className="theme-choices"><MiniChoice active={draft.theme === "dark"} onClick={() => update("theme","dark")} icon={<Moon/>} label="Sombre"/><MiniChoice active={draft.theme === "light"} onClick={() => update("theme","light")} icon={<Sun/>} label="Clair"/><MiniChoice active={draft.theme === "system"} onClick={() => update("theme","system")} icon={<Laptop/>} label="Système"/></div></Field><Switch checked={draft.protectionEnabled} onChange={(checked) => update("protectionEnabled",checked)} title="Protéger ce profil" detail="PIN ou mot de passe local facultatif"/>{draft.protectionEnabled && <Field label="PIN ou mot de passe"><input type="password" value={draft.secret} onChange={(e) => update("secret",e.target.value)} placeholder="4 caractères minimum"/></Field>}</section>
        <div className="automatic-backup-note"><HardDrive/><span><strong>Sauvegarde locale automatique</strong><small>Ostiro conserve ce profil dans son dossier applicatif. L'emplacement et le chiffrement se règlent ensuite dans Paramètres.</small></span></div>
      </div> : <div className="quick-personalization">
        <section><h3>Votre niveau</h3><div className="quick-experience">{quickExperience.map(([value,title,detail],index) => <Choice key={value} active={draft.experience === value} onClick={() => update("experience",value)} icon={<span>{index + 1}</span>} title={title} detail={detail}/>)}</div></section>
        <section><h3>Votre objectif principal</h3><div className="quick-goals">{quickGoals.map(([value,label]) => <button className={draft.primaryGoal === value ? "quick-goal quick-goal--active" : "quick-goal"} onClick={() => update("primaryGoal",value)} key={value}>{goalIcon(value)}<span>{label}</span>{draft.primaryGoal === value && <Check/>}</button>)}</div></section>
        <section><h3>Ce que vous souhaitez suivre</h3><div className="quick-assets">{quickAssets.map(([value,label]) => <button className={draft.trackedAssets.includes(value) ? "quick-asset quick-asset--active" : "quick-asset"} onClick={() => toggleAsset(value)} key={value}><span>{assetIcon(value)}</span>{label}{draft.trackedAssets.includes(value) && <Check/>}</button>)}</div></section>
      </div>}
    </main>
    <footer className="onboarding-footer"><button className="entry-secondary" onClick={() => step === 1 ? onCancel() : setStep(1)}><ArrowLeft size={16}/>{step === 1 ? "Annuler" : "Retour"}</button>{step === 1 ? <button className="entry-primary" disabled={invalid} onClick={() => setStep(2)}>Continuer <ArrowRight size={17}/></button> : <button className="entry-primary" disabled={invalid || saving} onClick={() => void finish()}>{saving ? "Création locale…" : "Créer mon espace"}<ArrowRight size={17}/></button>}</footer>
  </div>;
}

export function DeveloperScreen({ onBack, onDemo, onBeginner, onIntermediate, onAdvanced, onOnboarding, onReset, onToggleTheme }: { onBack:()=>void; onDemo:()=>void; onBeginner:()=>void; onIntermediate:()=>void; onAdvanced:()=>void; onOnboarding:()=>void; onReset:()=>void; onToggleTheme:()=>void }) {
  return <div className="entry-shell developer-screen"><header className="entry-header"><Brand/><button className="entry-back" onClick={onBack}><ArrowLeft/> Accueil</button></header><main className="developer-main"><div className="entry-title"><span className="eyebrow">Laboratoire local</span><h1>Mode développeur & démonstration</h1><p>Rejouez les parcours et états produit sans toucher à des données réelles.</p></div><div className="developer-grid"><DevCard icon={<Gauge/>} title="Démo complète" detail="Patrimoine, PEA, CTO, crypto, immobilier et anomalies." action="Ouvrir" onClick={onDemo}/><DevCard icon={<UserRound/>} title="Dashboard débutant" detail="Explications renforcées et modules essentiels." action="Tester" onClick={onBeginner}/><DevCard icon={<Sparkles/>} title="Dashboard intermédiaire" detail="Équilibre entre pédagogie et indicateurs." action="Tester" onClick={onIntermediate}/><DevCard icon={<Database/>} title="Dashboard avancé" detail="PRU, TRI, TWR, frais et devises prioritaires." action="Tester" onClick={onAdvanced}/><DevCard icon={<Map/>} title="Onboarding rapide" detail="Reprendre les deux écrans depuis le début." action="Rejouer" onClick={onOnboarding}/><DevCard icon={<RotateCcw/>} title="Réinitialiser la démo" detail="Recharge le jeu fictif intégré à sa version initiale." action="Réinitialiser" onClick={onReset}/><DevCard icon={<Sun/>} title="Basculer le thème" detail="Comparer immédiatement les modes sombre et clair." action="Basculer" onClick={onToggleTheme}/></div><div className="developer-warning"><Code2/><span><strong>Outil de développement local</strong><small>Ce panneau pourra être masqué dans les builds publics avec une variable de compilation.</small></span></div></main></div>;
}

function Field({ label, children }: { label:string; children:ReactNode }) { return <label className="onboarding-field"><span>{label}</span>{children}</label>; }
function ChoiceList({ children }: {children:ReactNode}) { return <div className="choice-list">{children}</div>; }
function Choice({ active,onClick,icon,title,detail }: {active:boolean;onClick:()=>void;icon:ReactNode;title:string;detail:string}) { return <button className={active ? "choice-row choice-row--active" : "choice-row"} onClick={onClick}><span>{icon}</span><span><strong>{title}</strong><small>{detail}</small></span><i>{active && <Check/>}</i></button>; }
function MiniChoice({ active,onClick,icon,label }: {active:boolean;onClick:()=>void;icon:ReactNode;label:string}) { return <button type="button" className={active ? "mini-choice mini-choice--active" : "mini-choice"} onClick={onClick}>{icon}{label}</button>; }
function Method({active,onClick,icon,title,detail,badge}:{active:boolean;onClick:()=>void;icon:ReactNode;title:string;detail:string;badge?:string}) { return <button className={active ? "method-choice method-choice--active" : "method-choice"} onClick={onClick}><span>{icon}</span>{badge && <b>{badge}</b>}<strong>{title}</strong><p>{detail}</p><i>{active && <Check/>}</i></button>; }
function Switch({checked,onChange,title,detail}:{checked:boolean;onChange:(value:boolean)=>void;title:string;detail:string}) { return <label className="entry-switch"><span><strong>{title}</strong><small>{detail}</small></span><input type="checkbox" checked={checked} onChange={(e)=>onChange(e.target.checked)}/><i/></label>; }
function Summary({label,value}:{label:string;value:string}) { return <div><span>{label}</span><strong>{value}</strong></div>; }
function DevCard({icon,title,detail,action,onClick,disabled=false}:{icon:ReactNode;title:string;detail:string;action:string;onClick?:()=>void;disabled?:boolean}) { return <article className="dev-card"><span>{icon}</span><h3>{title}</h3><p>{detail}</p><button disabled={disabled} onClick={onClick}>{action}<ChevronRight/></button></article>; }
function formatRelative(date:string) { const days=Math.max(0,Math.round((Date.now()-new Date(date).getTime())/86400000)); return days===0 ? "aujourd'hui" : days===1 ? "hier" : `il y a ${days} jours`; }
function goalIcon(value:string) { if(value.includes("retirement")) return "◷"; if(value.includes("real")) return "⌂"; if(value.includes("crypto")) return "₿"; if(value.includes("dividend")) return "↘"; if(value.includes("safety")) return "◇"; return "◎"; }
function assetIcon(value:string) { if(value.includes("bank")||value.includes("saving")) return "€"; if(value.includes("crypto")) return "₿"; if(value.includes("real")||value.includes("scpi")) return "⌂"; if(value.includes("loan")) return "−"; if(value.includes("dividend")) return "↘"; return "◆"; }
