import {
  ArrowLeft, ArrowRight, BadgeCheck, Check, CloudOff, HardDrive,
  LockKeyhole, Moon, ShieldCheck, Sun,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PUBLIC_BUILD } from "./build-mode";
import { BrandLogo } from "./components";
import {
  defaultAnswers, experienceLabels, goalLabels,
  type ExperienceLevel, type ProfileDraft, type ThemePreference,
} from "./profile-types";

const assets = [
  ["bank_accounts", "Comptes"], ["savings", "Livrets"], ["pea", "PEA"],
  ["cto", "CTO"], ["life_insurance", "Assurance-vie"], ["crypto", "Crypto"],
  ["real_estate", "Immobilier"], ["loans", "Crédits"], ["budget", "Budget"],
  ["dividends", "Dividendes"], ["fees", "Frais"],
] as const;

const goals = ["track_investments", "balance_wealth", "retirement", "dividends", "real_estate", "financial_independence"];
const levels: ExperienceLevel[] = ["beginner", "casual", "advanced"];

function Brand() {
  return <div className="entry-brand"><BrandLogo variant="atlas" /></div>;
}

function Preview() {
  return (
    <div className="onboarding-product-preview" aria-hidden="true">
      <div className="onboarding-product-preview__halo"/>
      <div className="onboarding-product-preview__card onboarding-product-preview__card--side">
        <span>Allocation</span><strong>48 %</strong><i/><i/><i/>
      </div>
      <div className="onboarding-product-preview__card onboarding-product-preview__card--main">
        <small>PATRIMOINE NET</small><strong>284 650 EUR</strong><em>+8,4 %</em>
        <svg viewBox="0 0 380 130">
          <defs><linearGradient id="onboardingFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E8C08C" stopOpacity=".3"/><stop offset="1" stopColor="#E8C08C" stopOpacity="0"/></linearGradient></defs>
          <path className="preview-area" d="M5 118 C55 115 72 73 116 86 C158 99 174 48 214 59 C255 71 278 27 320 41 C344 49 360 20 375 12 L375 126 L5 126 Z"/>
          <path className="preview-line" d="M5 118 C55 115 72 73 116 86 C158 99 174 48 214 59 C255 71 278 27 320 41 C344 49 360 20 375 12"/>
        </svg>
      </div>
      <div className="onboarding-trust-badge"><ShieldCheck size={16}/><span><strong>100 % local</strong><small>Aucune donnée envoyée</small></span></div>
    </div>
  );
}

export function OnboardingFlow({ onCancel, onComplete }: {
  onCancel: () => void;
  onComplete: (draft: ProfileDraft) => Promise<void>;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<ProfileDraft>({
    ...defaultAnswers,
    trackedAssets: [...defaultAnswers.trackedAssets],
    problems: [],
    name: "",
    secret: "",
  });

  const update = <K extends keyof ProfileDraft>(key: K, value: ProfileDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  useEffect(() => {
    const theme = draft.theme === "system"
      ? window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
      : draft.theme;
    document.documentElement.dataset.theme = theme;
  }, [draft.theme]);

  const toggleAsset = (asset: string) => update(
    "trackedAssets",
    draft.trackedAssets.includes(asset)
      ? draft.trackedAssets.filter((item) => item !== asset)
      : [...draft.trackedAssets, asset],
  );

  const canContinue = draft.name.trim().length > 0 && (!draft.protectionEnabled || draft.secret.length >= 4);
  const canFinish = draft.trackedAssets.length > 0 && Boolean(draft.primaryGoal);

  const finish = async () => {
    setSaving(true);
    try { await onComplete(draft); }
    finally { setSaving(false); }
  };

  return (
    <div className="onboarding-split onboarding-quick">
      <section className="onboarding-left onboarding-quick__form">
        <div className="onboarding-quick__brand"><Brand/><button onClick={step === 1 ? onCancel : () => setStep(1)}><ArrowLeft size={15}/>{step === 1 ? "Annuler" : "Retour"}</button></div>
        <div className="onboarding-step-dots"><i className="active"/><i className={step === 2 ? "active" : ""}/><span>Étape {step} sur 2</span></div>

        {step === 1 ? (
          <div className="onboarding-quick__content">
            <span className="onboarding-meta">VOTRE ESPACE LOCAL</span>
            <h1>Un profil. Deux minutes. C'est parti.</h1>
            <p>Les informations essentielles uniquement. Tout reste modifiable ensuite dans les paramètres.</p>

            <label className="line-field line-field--hero"><span>Votre prénom ou pseudo</span><input autoFocus value={draft.name} onChange={(event) => update("name", event.target.value)} placeholder="Camille" onKeyDown={(event) => { if (event.key === "Enter" && canContinue) setStep(2); }}/></label>

            <div className="onboarding-inline-fields">
              <label className="compact-field"><span>Devise</span><select value={draft.currency} onChange={(event) => update("currency", event.target.value)}><option value="EUR">EUR</option><option value="USD">USD</option><option value="CHF">CHF</option><option value="GBP">GBP</option></select></label>
              <div className="compact-field"><span>Apparence</span><div className="theme-segmented">{(["dark", "light", "system"] as ThemePreference[]).map((theme) => <button key={theme} aria-label={theme === "dark" ? "Thème sombre" : theme === "light" ? "Thème clair" : "Thème système"} title={theme === "dark" ? "Sombre" : theme === "light" ? "Clair" : "Système"} className={draft.theme === theme ? "active" : ""} onClick={() => update("theme", theme)}>{theme === "dark" ? <Moon/> : theme === "light" ? <Sun/> : <span>Auto</span>}</button>)}</div></div>
            </div>

            <label className="protection-row"><span><LockKeyhole size={17}/><span><strong>Protéger ce profil</strong><small>Code PIN ou mot de passe facultatif</small></span></span><input type="checkbox" checked={draft.protectionEnabled} onChange={(event) => update("protectionEnabled", event.target.checked)}/><i/></label>
            {draft.protectionEnabled && <label className="line-field"><span>Code secret, 4 caractères minimum</span><input type="password" value={draft.secret} onChange={(event) => update("secret", event.target.value)} placeholder="••••"/></label>}

            <button className="primary-button onboarding-continue" disabled={!canContinue} onClick={() => setStep(2)}>Continuer <ArrowRight size={16}/></button>
            <small className="onboarding-local-note"><HardDrive size={13}/> Sauvegarde locale automatique activée par défaut.</small>
          </div>
        ) : (
          <div className="onboarding-quick__content onboarding-quick__content--dense">
            <span className="onboarding-meta">PERSONNALISATION RAPIDE</span>
            <h1>Que voulez-vous suivre ?</h1>
            <p>Trois choix simples pour préparer un tableau de bord utile dès l'ouverture.</p>

            <fieldset className="quick-fieldset"><legend>Votre niveau</legend><div className="experience-segmented">{levels.map((level) => <button key={level} className={draft.experience === level ? "active" : ""} onClick={() => update("experience", level)}><strong>{level === "beginner" ? "Débutant" : level === "casual" ? "Intermédiaire" : "Avancé"}</strong><small>{experienceLabels[level]}</small></button>)}</div></fieldset>

            <fieldset className="quick-fieldset"><legend>Objectif principal</legend><div className="goal-chip-grid">{goals.map((goal) => <button key={goal} className={draft.primaryGoal === goal ? "active" : ""} onClick={() => update("primaryGoal", goal)}>{goalLabels[goal]}{draft.primaryGoal === goal && <Check size={13}/>}</button>)}</div></fieldset>

            <fieldset className="quick-fieldset"><legend>Éléments à suivre</legend><div className="asset-chip-grid">{assets.map(([asset, label]) => <button key={asset} className={draft.trackedAssets.includes(asset) ? "active" : ""} onClick={() => toggleAsset(asset)}>{label}{draft.trackedAssets.includes(asset) && <Check size={12}/>}</button>)}</div></fieldset>

            <button className="primary-button onboarding-continue" disabled={!canFinish || saving} onClick={() => void finish()}>{saving ? "Création locale..." : "Créer mon espace"}<ArrowRight size={16}/></button>
          </div>
        )}
      </section>
      <aside className="onboarding-right onboarding-quick__visual"><Preview/><div className="onboarding-visual-copy"><h2>Une vision claire, sans exposer vos données.</h2><p>{PUBLIC_BUILD ? "Ajoutez ensuite un compte manuellement, importez un CSV ou restaurez une sauvegarde locale." : "Ajoutez ensuite un compte manuellement, importez un CSV ou explorez le profil de démonstration."}</p><div><span><BadgeCheck/>Calculs expliqués</span><span><CloudOff/>Hors ligne</span><span><ShieldCheck/>Confidentiel</span></div></div></aside>
    </div>
  );
}
