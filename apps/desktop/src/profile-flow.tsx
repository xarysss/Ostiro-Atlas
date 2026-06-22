import {
  ArrowLeft, ArrowRight, BadgeCheck, Check, ChevronRight, CircleUserRound, CloudOff,
  Code2, Copy, Database, FileArchive, FileInput, FolderOpen, Gauge, HardDrive,
  KeyRound, Laptop, LockKeyhole, Map, Moon, Plus, RotateCcw, ShieldCheck, Sparkles,
  Sun, Trash2, UserRound, UsersRound, WalletCards,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { BrandLogo } from "./components";
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
  return <div className="entry-brand"><BrandLogo variant="atlas" /></div>;
}

function ProductPreview({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "product-preview product-preview--compact" : "product-preview"} aria-hidden="true">
      <div className="product-preview__glow" />
      <div className="product-preview__window product-preview__window--back">
        <span>Allocation</span><strong>48 %</strong>
        <div className="product-preview__bars"><i/><i/><i/><i/></div>
      </div>
      <div className="product-preview__window product-preview__window--main">
        <div className="product-preview__chrome"><i/><i/><i/><span>OSTIRO ATLAS</span></div>
        <div className="product-preview__content">
          <small>PATRIMOINE NET</small>
          <strong>284 650 EUR</strong>
          <em>+ 8,4 % cette année</em>
          <svg viewBox="0 0 420 150" role="presentation">
            <defs>
              <linearGradient id="entryChartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#E8C08C" stopOpacity=".28"/>
                <stop offset="1" stopColor="#E8C08C" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path className="product-preview__area" d="M8 132 C58 122 74 92 112 101 C151 110 170 52 214 70 C260 88 283 38 324 48 C361 57 383 22 414 16 L414 145 L8 145 Z"/>
            <path className="product-preview__line" d="M8 132 C58 122 74 92 112 101 C151 110 170 52 214 70 C260 88 283 38 324 48 C361 57 383 22 414 16"/>
          </svg>
        </div>
      </div>
      <div className="product-preview__badge product-preview__badge--local"><HardDrive size={15}/><span><strong>Stockage local</strong><small>Aucun cloud requis</small></span></div>
      <div className="product-preview__badge product-preview__badge--secure"><LockKeyhole size={15}/><span><strong>Lecture seule</strong><small>Vos secrets restent privés</small></span></div>
    </div>
  );
}

export function WelcomeScreen({ onCreate, onProfiles, onDemo, onDeveloper, showDemo = true, showDeveloper = true }: {
  onCreate: () => void; onProfiles: () => void; onDemo: () => void; onDeveloper: () => void; showDemo?: boolean; showDeveloper?: boolean;
}) {
  return (
    <div className="entry-shell welcome-screen premium-entry-split">
      <section className="premium-entry-copy">
        <header className="premium-entry-header">
          <Brand/>
          {showDeveloper && <button className="developer-entry-link" onClick={onDeveloper}><Code2 size={15}/> Mode développeur</button>}
        </header>
        <div className="premium-entry-content">
          <span className="welcome-kicker"><Sparkles size={13}/> Patrimoine privé, vision complète</span>
          <h1>Toute votre vie financière, <em>enfin cartographiée.</em></h1>
          <p>Suivez votre patrimoine, vos investissements et votre budget dans une application locale, rapide et sans abonnement.</p>
          <div className="premium-entry-actions">
            <button className="primary-button" onClick={onProfiles}><UsersRound size={17}/> Ouvrir mon espace <ArrowRight size={16}/></button>
            <button className="secondary-button" onClick={onCreate}><Plus size={17}/> Créer un profil local</button>
            {showDemo && <button className="entry-tertiary" onClick={onDemo}><Gauge size={15}/> Explorer avec le compte démo</button>}
          </div>
          <div className="trust-row">
            <span><ShieldCheck size={14}/> Données locales</span>
            <span><BadgeCheck size={14}/> Calculs traçables</span>
            <span><CloudOff size={14}/> Fonctionne hors ligne</span>
          </div>
        </div>
        <footer className="premium-entry-footer"><span>Ostiro Atlas 0.4</span><span>AGPL-3.0 · France · Local-first</span></footer>
      </section>
      <aside className="premium-entry-visual">
        <ProductPreview/>
        <div className="premium-entry-visual-copy"><strong>Votre patrimoine reste chez vous.</strong><span>Une vue claire, des sources visibles, aucun identifiant bancaire stocké.</span></div>
      </aside>
    </div>
  );
}

export function ProfilesScreen({ profiles, loading, onBack, onCreate, onOpen, onDemo, onDuplicate, onDelete, onImport, showDemo = true }: {
  profiles: LocalProfile[]; loading: boolean; onBack: () => void; onCreate: () => void;
  onOpen: (profile: LocalProfile) => void; onDemo: () => void; onDuplicate: (profile: LocalProfile) => void;
  onDelete: (profile: LocalProfile) => void; onImport: () => void; showDemo?: boolean;
}) {
  return (
    <div className="entry-shell profiles-screen" style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#000000" }}>
      <header className="entry-header" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <Brand/>
        <button className="entry-back" onClick={onBack} style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--muted)", cursor: "pointer", border: 0, background: "transparent", fontSize: "11px" }}>
          <ArrowLeft size={16}/> Accueil
        </button>
      </header>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "60px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span className="eyebrow" style={{ color: "var(--green)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Espaces locaux</span>
          <h1 style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-0.03em", margin: "8px 0 12px 0", color: "#FCFCFC" }}>Qui utilise Atlas ?</h1>
          <p style={{ color: "var(--muted)", fontSize: "13px" }}>Choisissez le profil local à ouvrir sur cet ordinateur.</p>
        </div>

        {loading ? (
          <div className="profile-loading" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px" }}>
            <span style={{ width: "32px", height: "32px", border: "2px solid rgba(255,255,255,0.1)", borderTopColor: "var(--green)", borderRadius: "50%", animation: "spin 1s linear infinite" }}/>
            <p style={{ marginTop: "16px", color: "var(--muted)", fontSize: "12px" }}>Lecture des profils sur cet ordinateur…</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "32px", maxWidth: "800px", marginBottom: "48px" }}>
            {profiles.map((profile) => (
              <div key={profile.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "120px", position: "relative" }} className="profile-switcher-tile">
                <button
                  onClick={() => onOpen(profile)}
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "50%",
                    background: profile.isDemo ? "linear-gradient(135deg, #2c241c, #1f1a14)" : "rgba(255,255,255,0.03)",
                    border: profile.isDemo ? "2px solid var(--green)" : "2px solid rgba(255,255,255,0.08)",
                    color: "var(--green)",
                    fontSize: "28px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    marginBottom: "12px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                    transition: "all 0.2s ease"
                  }}
                  className="profile-switcher-btn"
                >
                  {profile.initials}
                </button>
                <strong style={{ fontSize: "13px", color: "#FCFCFC", textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%" }}>
                  {profile.name}
                </strong>
                <span style={{ fontSize: "10px", color: "var(--muted-2)", marginTop: "4px" }}>
                  {profile.isDemo ? "Démo" : profile.isProtected ? "Sécurisé" : "Local"}
                </span>

                {!profile.isDemo && (
                  <div style={{ display: "flex", gap: "6px", marginTop: "10px" }} className="profile-switcher-actions">
                    <button
                      onClick={() => onDuplicate(profile)}
                      title="Dupliquer"
                      style={{ background: "transparent", border: 0, color: "var(--muted-2)", cursor: "pointer", padding: "4px" }}
                    >
                      <Copy size={13}/>
                    </button>
                    <button
                      onClick={() => { if(window.confirm(`Supprimer le profil ${profile.name} ?`)) onDelete(profile); }}
                      title="Supprimer"
                      style={{ background: "transparent", border: 0, color: "var(--muted-2)", cursor: "pointer", padding: "4px" }}
                    >
                      <Trash2 size={13}/>
                    </button>
                  </div>
                )}
              </div>
            ))}

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "120px" }}>
              <button
                onClick={onCreate}
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  background: "transparent",
                  border: "2px dashed rgba(255,255,255,0.15)",
                  color: "var(--muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  marginBottom: "12px",
                  transition: "all 0.2s ease"
                }}
                className="profile-switcher-new"
              >
                <Plus size={28}/>
              </button>
              <strong style={{ fontSize: "13px", color: "var(--muted)" }}>Nouveau</strong>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "16px" }}>
          <button className="secondary-button" onClick={onImport} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px" }}>
            <FileArchive size={15}/> Restaurer une sauvegarde
          </button>
          {showDemo && <button className="primary-button" onClick={onDemo} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px" }}>
            <Gauge size={15}/> Lancer la démo
          </button>}
        </div>
      </main>

      <footer className="entry-footer" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <span><Database size={13}/> Profils locaux SQLite</span>
        <span>Rien n'est envoyé à Ostiro</span>
      </footer>
    </div>
  );
}

export function UnlockScreen({ profile, onBack, onUnlock }: { profile: LocalProfile; onBack: () => void; onUnlock: (secret: string) => Promise<boolean> }) {
  const [secret, setSecret] = useState(""); const [error, setError] = useState(false); const [busy, setBusy] = useState(false);
  const submit = async () => { setBusy(true); const valid = await onUnlock(secret); setBusy(false); setError(!valid); };
  return (
    <div className="entry-shell unlock-screen" style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#000000" }}>
      <header className="entry-header" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <Brand/>
        <button className="entry-back" onClick={onBack} style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--muted)", cursor: "pointer", border: 0, background: "transparent", fontSize: "11px" }}>
          <ArrowLeft size={16}/> Profils
        </button>
      </header>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 20px", textAlign: "center", maxWidth: "420px", margin: "0 auto" }}>
        <div style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "rgba(232, 192, 140, 0.08)",
          color: "var(--green)",
          fontSize: "24px",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px",
          border: "1px solid rgba(232,192,140,0.2)"
        }}>
          {profile.initials}
        </div>

        <span className="eyebrow" style={{ color: "var(--green)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Espace Sécurisé</span>
        <h1 style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.03em", margin: "8px 0 12px 0", color: "#FCFCFC" }}>Déverrouiller {profile.name.split(" ")[0]}</h1>
        <p style={{ color: "var(--muted)", fontSize: "13px", marginBottom: "32px", lineHeight: 1.5 }}>Entrez votre secret local (code PIN ou mot de passe) pour déverrouiller vos données.</p>

        <div style={{ width: "100%", textAlign: "left", marginBottom: "24px" }}>
          <label style={{ display: "block", fontSize: "11px", color: "var(--muted)", marginBottom: "8px", fontWeight: 500 }}>
            Secret de déverrouillage
          </label>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#101014",
            border: error ? "1px solid var(--red)" : "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            height: "48px",
            padding: "0 16px",
            transition: "all 0.2s ease"
          }} className="unlock-input-container">
            <KeyRound size={16} style={{ color: "var(--muted-2)" }}/>
            <input
              autoFocus
              type="password"
              value={secret}
              onChange={(event) => { setSecret(event.target.value); setError(false); }}
              onKeyDown={(event) => { if(event.key === "Enter") void submit(); }}
              placeholder="Votre code secret"
              style={{ flex: 1, border: 0, outline: 0, background: "transparent", color: "#FCFCFC", fontSize: "14px" }}
            />
          </div>
          {error && <small style={{ color: "var(--red)", fontSize: "11px", marginTop: "6px", display: "block" }}>Secret incorrect, veuillez réessayer.</small>}
        </div>

        <button
          className="primary-button"
          disabled={!secret || busy}
          onClick={() => void submit()}
          style={{ width: "100%", height: "46px", fontSize: "13px", fontWeight: 600 }}
        >
          {busy ? "Vérification..." : "Ouvrir l'espace"}
        </button>

        <span style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "24px", color: "var(--muted-2)", fontSize: "10px" }}>
          <CloudOff size={12}/> Chiffrement et validation hors ligne
        </span>
      </main>
    </div>
  );
}

export function OnboardingFlow({ onCancel, onComplete }: { onCancel: () => void; onComplete: (draft: ProfileDraft) => Promise<void> }) {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<ProfileDraft>(initialDraft);
  const [saving, setSaving] = useState(false);
  const update = <K extends keyof ProfileDraft>(key: K, value: ProfileDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const toggleAsset = (value: string) => update("trackedAssets", draft.trackedAssets.includes(value) ? draft.trackedAssets.filter((item) => item !== value) : [...draft.trackedAssets, value]);

  const quickGoals = Object.entries(goalLabels).filter(([key]) => ["balance_wealth","track_investments","retirement","dividends","real_estate","other"].includes(key));
  const quickAssets = assetChoices.filter(([key]) => ["bank_accounts","savings","pea","cto","life_insurance","per","crypto","real_estate","metals","loans","budget","dividends","fees"].includes(key));

  useEffect(() => {
    document.documentElement.dataset.theme = draft.theme === "system"
      ? window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
      : draft.theme;
  }, [draft.theme]);

  const finish = async () => { setSaving(true); await onComplete(draft); setSaving(false); };

  const isStep1Valid = draft.name.trim().length > 0;
  const isStep2Valid = !draft.protectionEnabled || draft.secret.length >= 4;
  const isStep3Valid = draft.primaryGoal.length > 0;
  const isStep4Valid = draft.trackedAssets.length > 0;

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else onCancel();
  };

  const handleNext = () => {
    if (step === 1 && isStep1Valid) setStep(2);
    else if (step === 2 && isStep2Valid) setStep(3);
    else if (step === 3 && isStep3Valid) setStep(4);
    else if (step === 4 && isStep4Valid) void finish();
  };

  const renderLeftPanel = () => {
    switch (step) {
      case 1:
        return (
          <>
            <span className="onboarding-meta">1 SUR 4 · PROFIL</span>
            <h1 style={{ fontSize: "36px", fontWeight: 700, color: "#FCFCFC", margin: "0 0 16px 0", lineHeight: "1.25", letterSpacing: "-0.03em" }}>
              Commençons simplement, quel est votre prénom ?
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "13px", margin: "0 0 40px 0", lineHeight: "1.5" }}>
              Ce nom sera stocké localement et chiffré sur votre machine.
            </p>

            <input
              autoFocus
              value={draft.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Votre prénom ou pseudo"
              className="input-line"
              onKeyDown={(e) => { if (e.key === "Enter" && isStep1Valid) handleNext(); }}
            />

            <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
              <button className="secondary-button" onClick={handleBack} style={{ height: "46px", padding: "0 28px", fontSize: "13px" }}>
                Retour
              </button>
              <button
                className="primary-button"
                disabled={!isStep1Valid}
                onClick={handleNext}
                style={{ flex: 1, height: "46px", fontSize: "13px" }}
              >
                Suivant <ArrowRight size={16} />
              </button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <span className="onboarding-meta">2 SUR 4 · SÉCURITÉ</span>
            <h1 style={{ fontSize: "36px", fontWeight: 700, color: "#FCFCFC", margin: "0 0 16px 0", lineHeight: "1.25", letterSpacing: "-0.03em" }}>
              Souhaitez-vous protéger l'accès ?
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "13px", margin: "0 0 32px 0", lineHeight: "1.5" }}>
              Ostiro Atlas chiffre vos données localement. Vous pouvez définir un mot de passe ou code PIN pour déverrouiller l'accès.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "32px" }}>
              <Switch
                checked={draft.protectionEnabled}
                onChange={(checked) => update("protectionEnabled", checked)}
                title="Protéger le profil"
                detail="Exiger un mot de passe au lancement"
              />

              {draft.protectionEnabled && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", animation: "fadeIn 0.2s ease" }}>
                  <span style={{ fontSize: "12px", color: "var(--muted)" }}>Votre mot de passe ou code PIN secret</span>
                  <input
                    type="password"
                    autoFocus
                    value={draft.secret}
                    onChange={(e) => update("secret", e.target.value)}
                    placeholder="Min. 4 caractères"
                    className="input-line"
                    style={{ fontSize: "20px", marginBottom: 0 }}
                    onKeyDown={(e) => { if (e.key === "Enter" && isStep2Valid) handleNext(); }}
                  />
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <button className="secondary-button" onClick={handleBack} style={{ height: "46px", padding: "0 28px", fontSize: "13px" }}>
                Retour
              </button>
              <button
                className="primary-button"
                disabled={!isStep2Valid}
                onClick={handleNext}
                style={{ flex: 1, height: "46px", fontSize: "13px" }}
              >
                Suivant <ArrowRight size={16} />
              </button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <span className="onboarding-meta">3 SUR 4 · OBJECTIF</span>
            <h1 style={{ fontSize: "36px", fontWeight: 700, color: "#FCFCFC", margin: "0 0 16px 0", lineHeight: "1.25", letterSpacing: "-0.03em" }}>
              Quel est votre objectif prioritaire ?
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "13px", margin: "0 0 32px 0", lineHeight: "1.5" }}>
              Cela nous permettra d'adapter l'analyse de votre portefeuille.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px", maxHeight: "280px", overflowY: "auto", paddingRight: "4px" }}>
              {quickGoals.map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => { update("primaryGoal", value); setStep(4); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 20px",
                    borderRadius: "999px",
                    border: draft.primaryGoal === value ? "1px solid var(--green)" : "1px solid rgba(255,255,255,0.08)",
                    background: draft.primaryGoal === value ? "rgba(232,192,140,0.08)" : "transparent",
                    color: draft.primaryGoal === value ? "#FCFCFC" : "var(--muted)",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "14px",
                    fontWeight: 600,
                    transition: "all 0.15s ease",
                    width: "100%"
                  }}
                >
                  <span style={{ fontSize: "18px" }}>{goalIcon(value)}</span>
                  <span style={{ flex: 1 }}>{label}</span>
                  {draft.primaryGoal === value && <Check size={16} style={{ color: "var(--green)" }}/>}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <button className="secondary-button" onClick={handleBack} style={{ height: "46px", padding: "0 28px", fontSize: "13px" }}>
                Retour
              </button>
              <button
                className="primary-button"
                disabled={!isStep3Valid}
                onClick={handleNext}
                style={{ flex: 1, height: "46px", fontSize: "13px" }}
              >
                Suivant <ArrowRight size={16} />
              </button>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <span className="onboarding-meta">4 SUR 4 · CONFIGURATION</span>
            <h1 style={{ fontSize: "36px", fontWeight: 700, color: "#FCFCFC", margin: "0 0 16px 0", lineHeight: "1.25", letterSpacing: "-0.03em" }}>
              Quels actifs souhaitez-vous suivre ?
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "13px", margin: "0 0 28px 0", lineHeight: "1.5" }}>
              Sélectionnez les catégories d'investissements que vous possédez.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "32px", maxHeight: "280px", overflowY: "auto", paddingRight: "4px" }}>
              {quickAssets.map(([value, label]) => {
                const isSelected = draft.trackedAssets.includes(value);
                return (
                  <button
                    key={value}
                    onClick={() => toggleAsset(value)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 16px",
                      borderRadius: "999px",
                      border: isSelected ? "1px solid var(--green)" : "1px solid rgba(255,255,255,0.08)",
                      background: isSelected ? "rgba(232,192,140,0.08)" : "transparent",
                      color: isSelected ? "#FCFCFC" : "var(--muted)",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: "13px",
                      fontWeight: 500,
                      transition: "all 0.15s ease"
                    }}
                  >
                    <span style={{ display: "flex", width: "22px", height: "22px", background: "rgba(255,255,255,0.05)", borderRadius: "50%", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "var(--green)" }}>
                      {assetIcon(value)}
                    </span>
                    <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
                    {isSelected && <Check size={14} style={{ color: "var(--green)" }}/>}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <button className="secondary-button" onClick={handleBack} style={{ height: "46px", padding: "0 28px", fontSize: "13px" }}>
                Retour
              </button>
              <button
                className="primary-button"
                disabled={!isStep4Valid || saving}
                onClick={handleNext}
                style={{ flex: 1, height: "46px", fontSize: "13px" }}
              >
                {saving ? "Création locale..." : "Créer mon espace"} <ArrowRight size={16} />
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="onboarding-split">
      <div className="onboarding-left">
        <div style={{ marginBottom: "60px" }}>
          <Brand />
        </div>
        {renderLeftPanel()}
      </div>
      <div className="onboarding-right">
        <div className="promo-mockup">
          <svg viewBox="0 0 450 320" style={{ width: "100%", height: "auto" }}>
            <rect x="20" y="20" width="410" height="280" rx="20" fill="#131314" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />

            {/* Sidebar Mockup */}
            <rect x="20" y="20" width="90" height="280" rx="0" fill="#101014" />
            <circle cx="45" cy="45" r="10" fill="var(--green)" opacity="0.3" />
            <rect x="35" y="70" width="60" height="10" rx="5" fill="rgba(255,255,255,0.05)" />
            <rect x="35" y="95" width="60" height="10" rx="5" fill="rgba(255,255,255,0.05)" />
            <rect x="35" y="120" width="60" height="10" rx="5" fill="rgba(255,255,255,0.05)" />

            {/* Central Area Chart Mockup */}
            <rect x="130" y="40" width="100" height="8" rx="4" fill="rgba(255,255,255,0.2)" />
            <rect x="130" y="55" width="160" height="18" rx="6" fill="var(--text)" opacity="0.9" />
            <rect x="130" y="80" width="80" height="8" rx="4" fill="var(--positive)" />

            <path d="M 130 220 Q 200 120 270 180 T 410 140 L 410 240 L 130 240 Z" fill="url(#mock-chart-gradient)" />
            <path d="M 130 220 Q 200 120 270 180 T 410 140" fill="none" stroke="var(--green)" strokeWidth="3" />
            <circle cx="270" cy="180" r="5" fill="var(--green)" />

            <defs>
              <linearGradient id="mock-chart-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--green)" stopOpacity="0.15" />
                <stop offset="1" stopColor="var(--green)" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="promo-text">
          <h2 style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.03em", margin: "0 0 12px 0", color: "#FCFCFC" }}>Centralisez tous vos investissements.</h2>
          <p style={{ color: "var(--muted)", fontSize: "13px", maxWidth: "380px", margin: "0 auto 32px", lineHeight: "1.6" }}>
            Gagnez du temps, suivez vos performances et optimisez votre patrimoine grâce à notre plateforme sécurisée et locale-first.
          </p>
          <div className="badges-trust" style={{ display: "flex", gap: "20px", color: "var(--muted-2)", fontSize: "11px", justifyContent: "center" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><ShieldCheck size={16} style={{ color: "var(--green)" }} /> Données chiffrées</span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><BadgeCheck size={16} style={{ color: "var(--green)" }} /> 100% Privé</span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><CloudOff size={16} style={{ color: "var(--green)" }} /> Hors ligne</span>
          </div>
        </div>
      </div>
    </div>
  );
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
