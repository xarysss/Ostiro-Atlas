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
  return (
    <div className="entry-shell welcome-screen" style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#000000" }}>
      <header className="entry-header" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <Brand/>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--green)", display: "flex", alignItems: "center", gap: "5px" }}>
            <CloudOff size={14}/> 100 % local
          </span>
          <button onClick={onDeveloper} style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--muted)", cursor: "pointer", border: 0, background: "transparent", fontSize: "11px" }}>
            <Code2 size={15}/> Mode développeur
          </button>
        </div>
      </header>
      
      <main style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "60px 20px", textAlign: "center", maxWidth: "680px", margin: "0 auto" }}>
        <span className="welcome-kicker" style={{ background: "rgba(232, 192, 140, 0.08)", color: "var(--green)", padding: "6px 14px", borderRadius: "999px", fontSize: "11px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "28px" }}>
          <Sparkles size={13}/> Votre patrimoine, sans intermédiaire
        </span>
        
        <h1 style={{ fontSize: "48px", fontWeight: 700, letterSpacing: "-0.04em", margin: "0 0 18px 0", color: "#FCFCFC", lineHeight: 1.15 }}>
          Toute votre vie financière,<br/>
          <span style={{ color: "var(--green)" }}>enfin cartographiée.</span>
        </h1>
        
        <p style={{ fontSize: "14px", color: "var(--muted)", maxWidth: "480px", margin: "0 0 44px 0", lineHeight: 1.5 }}>
          Suivez votre patrimoine net, vos investissements et vos liquidités localement avec une confidentialité totale.
        </p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: "340px", marginBottom: "48px" }}>
          <button className="primary-button" onClick={onProfiles} style={{ height: "46px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "13px" }}>
            <UsersRound size={17}/> Ouvrir un profil local <ArrowRight size={16}/>
          </button>
          
          <button className="secondary-button" onClick={onCreate} style={{ height: "46px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "13px" }}>
            <Plus size={17}/> Créer un nouveau profil
          </button>
          
          <button className="entry-tertiary" onClick={onDemo} style={{ background: "transparent", border: 0, color: "var(--muted)", fontSize: "12px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px" }}>
            <Gauge size={15}/> Explorer le profil démo
          </button>
        </div>
        
        <div className="trust-row" style={{ display: "flex", gap: "24px", color: "var(--muted-2)", fontSize: "11px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><ShieldCheck size={14}/> Données locales</span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><BadgeCheck size={14}/> Open source</span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><CloudOff size={14}/> Hors ligne</span>
        </div>
      </main>
      
      <footer className="entry-footer" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <span>Ostiro Atlas 0.3</span>
        <span>AGPL-3.0 · France · Local-first</span>
      </footer>
    </div>
  );
}

export function ProfilesScreen({ profiles, loading, onBack, onCreate, onOpen, onDemo, onDuplicate, onDelete, onImport }: {
  profiles: LocalProfile[]; loading: boolean; onBack: () => void; onCreate: () => void;
  onOpen: (profile: LocalProfile) => void; onDemo: () => void; onDuplicate: (profile: LocalProfile) => void;
  onDelete: (profile: LocalProfile) => void; onImport: () => void;
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
          <button className="primary-button" onClick={onDemo} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px" }}>
            <Gauge size={15}/> Lancer la démo
          </button>
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
  
  const quickExperience: Array<[ProfileDraft["experience"], string, string]> = [
    ["beginner", "Débutant", "Explications claires et progressives"],
    ["casual", "Intermédiaire", "Indicateurs essentiels et diversifiés"],
    ["advanced", "Avancé", "Calculs de PRU, TRI et frais complexes"],
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

  return (
    <div className="entry-shell onboarding-screen" style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#000000" }}>
      <header className="entry-header" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <Brand/>
        <button className="entry-back" onClick={onCancel} style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--muted)", cursor: "pointer", border: 0, background: "transparent", fontSize: "11px" }}>
          <ArrowLeft size={16}/> Quitter
        </button>
      </header>
      
      <div style={{ width: "100%", maxWidth: "800px", margin: "24px auto 0 auto", padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--muted-2)", fontSize: "11px", marginBottom: "8px" }}>
          <span>Étape {step} sur 2</span>
          <div style={{ flex: 1, height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ width: step === 1 ? "50%" : "100%", height: "100%", background: "var(--green)", borderRadius: "2px", transition: "width 0.3s ease" }}/>
          </div>
        </div>
      </div>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", width: "100%", maxWidth: "800px", margin: "0 auto", padding: "20px 20px 80px 20px" }}>
        <div style={{ marginBottom: "32px" }}>
          <span className="eyebrow" style={{ color: "var(--green)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em" }}>Création locale · 1 min</span>
          <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "6px 0 8px 0", color: "#FCFCFC" }}>
            {step === 1 ? "Créez votre profil local" : "Personnalisez votre espace"}
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "13px" }}>
            {step === 1 ? "Ces réglages sont locaux. Vous pourrez tout modifier plus tard." : "Organisez votre expérience de suivi patrimonial local."}
          </p>
        </div>

        {step === 1 ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <section style={{ background: "#101014", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 600, margin: "0 0 10px 0", color: "var(--green)" }}>Identité & Devise</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "11px", color: "var(--muted)" }}>Prénom ou pseudo</span>
                <input 
                  autoFocus 
                  value={draft.name} 
                  onChange={(e) => update("name", e.target.value)} 
                  placeholder="Ex: Jeanne"
                  style={{ height: "42px", padding: "0 12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", background: "#131314", color: "#FCFCFC", outline: "none", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "11px", color: "var(--muted)" }}>Devise principale</span>
                <select 
                  value={draft.currency} 
                  onChange={(e) => update("currency", e.target.value)}
                  style={{ height: "42px", padding: "0 12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", background: "#131314", color: "#FCFCFC", outline: "none", fontSize: "13px" }}
                >
                  <option>EUR</option>
                  <option>CHF</option>
                  <option>USD</option>
                  <option>GBP</option>
                </select>
              </div>
            </section>

            <section style={{ background: "#101014", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 600, margin: "0 0 10px 0", color: "var(--green)" }}>Apparence & Sécurité</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "4px" }}>Thème de l'application</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <MiniChoice active={draft.theme === "dark"} onClick={() => update("theme", "dark")} icon={<Moon size={14}/>} label="Sombre" />
                  <MiniChoice active={draft.theme === "light"} onClick={() => update("theme", "light")} icon={<Sun size={14}/>} label="Clair" />
                  <MiniChoice active={draft.theme === "system"} onClick={() => update("theme", "system")} icon={<Laptop size={14}/>} label="Système" />
                </div>
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "16px", marginTop: "8px" }}>
                <Switch checked={draft.protectionEnabled} onChange={(checked) => update("protectionEnabled", checked)} title="Protéger le profil" detail="Exiger un code PIN/mot de passe au lancement" />
                
                {draft.protectionEnabled && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "16px" }}>
                    <span style={{ fontSize: "11px", color: "var(--muted)" }}>Mot de passe ou code PIN</span>
                    <input 
                      type="password" 
                      value={draft.secret} 
                      onChange={(e) => update("secret", e.target.value)} 
                      placeholder="Minimum 4 caractères"
                      style={{ height: "42px", padding: "0 12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", background: "#131314", color: "#FCFCFC", outline: "none", fontSize: "13px" }}
                    />
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <section style={{ background: "#101014", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "24px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: 600, color: "var(--green)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 16px 0" }}>Votre profil d'investisseur</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                {quickExperience.map(([value, title, detail], index) => (
                  <Choice 
                    key={value} 
                    active={draft.experience === value} 
                    onClick={() => update("experience", value)} 
                    icon={<span style={{ width: "20px", height: "20px", background: "rgba(232,192,140,0.1)", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "var(--green)", fontWeight: 700 }}>{index + 1}</span>} 
                    title={title} 
                    detail={detail}
                  />
                ))}
              </div>
            </section>

            <section style={{ background: "#101014", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "24px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: 600, color: "var(--green)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 16px 0" }}>Votre objectif prioritaire</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                {quickGoals.map(([value, label]) => (
                  <button 
                    key={value} 
                    className={draft.primaryGoal === value ? "quick-goal quick-goal--active" : "quick-goal"} 
                    onClick={() => update("primaryGoal", value)}
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "10px", 
                      padding: "12px 16px", 
                      borderRadius: "12px", 
                      border: draft.primaryGoal === value ? "1px solid var(--green)" : "1px solid rgba(255,255,255,0.06)",
                      background: draft.primaryGoal === value ? "rgba(232,192,140,0.05)" : "#131314",
                      color: draft.primaryGoal === value ? "#FCFCFC" : "var(--muted)",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: "12px",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>{goalIcon(value)}</span>
                    <span style={{ flex: 1, fontWeight: 500 }}>{label}</span>
                    {draft.primaryGoal === value && <Check size={14} style={{ color: "var(--green)" }}/>}
                  </button>
                ))}
              </div>
            </section>

            <section style={{ background: "#101014", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "24px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: 600, color: "var(--green)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 16px 0" }}>Actifs à suivre</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                {quickAssets.map(([value, label]) => (
                  <button 
                    key={value} 
                    className={draft.trackedAssets.includes(value) ? "quick-asset quick-asset--active" : "quick-asset"} 
                    onClick={() => toggleAsset(value)}
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "10px", 
                      padding: "10px 12px", 
                      borderRadius: "10px", 
                      border: draft.trackedAssets.includes(value) ? "1px solid var(--green)" : "1px solid rgba(255,255,255,0.06)",
                      background: draft.trackedAssets.includes(value) ? "rgba(232,192,140,0.05)" : "#131314",
                      color: draft.trackedAssets.includes(value) ? "#FCFCFC" : "var(--muted)",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: "11px",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <span style={{ display: "inline-flex", width: "20px", height: "20px", background: "rgba(255,255,255,0.04)", borderRadius: "6px", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "var(--green)" }}>
                      {assetIcon(value)}
                    </span>
                    <span style={{ flex: 1, fontWeight: 500 }}>{label}</span>
                    {draft.trackedAssets.includes(value) && <Check size={12} style={{ color: "var(--green)" }}/>}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="onboarding-footer" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "16px 40px", background: "#101014", display: "flex", gap: "16px", justifyContent: "space-between", alignItems: "center" }}>
        <button className="secondary-button" onClick={() => step === 1 ? onCancel() : setStep(1)} style={{ minWidth: "120px" }}>
          <ArrowLeft size={16}/> {step === 1 ? "Annuler" : "Retour"}
        </button>
        
        {step === 1 ? (
          <button className="primary-button" disabled={invalid} onClick={() => setStep(2)} style={{ minWidth: "120px" }}>
            Continuer <ArrowRight size={16}/>
          </button>
        ) : (
          <button className="primary-button" disabled={invalid || saving} onClick={() => void finish()} style={{ minWidth: "150px" }}>
            {saving ? "Création locale..." : "Créer mon espace"} <ArrowRight size={16}/>
          </button>
        )}
      </footer>
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
