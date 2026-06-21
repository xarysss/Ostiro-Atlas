import { Bell, Command, Moon, Search, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { TraceDrawer, type TraceInfo } from "./components";
import { initializeLocalDatabase } from "./database";
import {
  DeveloperScreen, OnboardingFlow, ProfilesScreen, UnlockScreen, WelcomeScreen,
} from "./profile-flow";
import {
  createLocalProfile, deleteProfile, duplicateProfile, listLocalProfiles, markProfileOpened, updateLocalProfile, verifyProfileSecret,
} from "./profile-store";
import { defaultAnswers, demoProfile, type LocalProfile, type ProfileDraft } from "./profile-types";
import {
  AccountsPage, DashboardPage, DataHealthPage, DividendsPage, ExportsPage, FeesPage,
  ImportPage, PortfolioPage, SettingsPage, SyncHealthPage, TransactionsPage,
} from "./pages";
import { Sidebar, type PageId } from "./sidebar";
import { getPortfolioData, savePortfolioData, emptyPortfolio, type PortfolioData } from "./data-store";
import { CompleteWealthPage } from "./complete-wealth";
import { AnalysisPage, BudgetPage, ToolsPage } from "./new-pages";

type AppScreen = "welcome" | "profiles" | "unlock" | "onboarding" | "developer" | "app";

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("welcome");
  const [page, setPage] = useState<PageId>("overview");
  const [trace, setTrace] = useState<TraceInfo | null>(null);
  const [notice, setNotice] = useState(true);
  const [profiles, setProfiles] = useState<LocalProfile[]>([demoProfile]);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [activeProfile, setActiveProfile] = useState<LocalProfile | null>(null);
  const [lockedProfile, setLockedProfile] = useState<LocalProfile | null>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(emptyPortfolio);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [toolsTab, setToolsTab] = useState("patrimoine");

  const toggleTheme = async () => {
    if (activeProfile) {
      const currentTheme = activeProfile.answers.theme;
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      const updated = await updateLocalProfile(activeProfile, { theme: nextTheme });
      setActiveProfile(updated);
    }
  };

  const hasNotice = activeProfile?.isDemo ? notice : portfolioData.dataIssues.length > 0;

  const handleBellClick = () => {
    if (activeProfile && !activeProfile.isDemo && portfolioData.dataIssues.length > 0) {
      setPage("data-health");
    } else if (activeProfile?.isDemo) {
      setNotice(!notice);
    }
  };

  useEffect(() => {
    if (activeProfile) {
      void getPortfolioData(activeProfile).then(setPortfolioData);
    }
  }, [activeProfile]);

  const handleSavePortfolioData = async (newData: PortfolioData) => {
    if (activeProfile) {
      await savePortfolioData(activeProfile, newData);
      setPortfolioData(newData);
    }
  };

  const refreshProfiles = async () => {
    setProfilesLoading(true);
    try { setProfiles(await listLocalProfiles()); }
    finally { setProfilesLoading(false); }
  };

  useEffect(() => {
    void initializeLocalDatabase()
      .then(refreshProfiles)
      .catch((error: unknown) => console.error("Local database initialization failed", error));
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.querySelector<HTMLInputElement>(".topbar-search input")?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const preference = screen === "app" ? activeProfile?.answers.theme ?? "dark" : "dark";
    const resolved = preference === "system"
      ? window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
      : preference;
    document.documentElement.dataset.theme = resolved;
  }, [activeProfile?.answers.theme, screen]);

  const enterProfile = async (profile: LocalProfile) => {
    await markProfileOpened(profile);
    setActiveProfile(profile);
    setNotice(profile.isDemo);
    setPage(profile.answers.startMethod === "csv" && !profile.isDemo ? "imports" : "overview");
    setScreen("app");
  };

  const requestOpen = (profile: LocalProfile) => {
    if (profile.isProtected) { setLockedProfile(profile); setScreen("unlock"); }
    else void enterProfile(profile);
  };

  const completeOnboarding = async (draft: ProfileDraft) => {
    const profile = await createLocalProfile(draft);
    await refreshProfiles();
    await enterProfile(profile);
  };

  const developerScenario = (experience: "beginner" | "casual" | "advanced") => {
    const profile: LocalProfile = {
      ...demoProfile,
      id: `developer-${experience}`,
      name: experience === "beginner" ? "Camille Débutant" : experience === "casual" ? "Morgan Intermédiaire" : "Alex Investisseur",
      initials: experience === "beginner" ? "CD" : experience === "casual" ? "MI" : "AI",
      answers: {
        ...demoProfile.answers,
        experience,
        trackedAssets: experience === "beginner" ? ["bank_accounts", "savings", "budget", "goals"] : demoProfile.answers.trackedAssets,
      },
    };
    setActiveProfile(profile); setNotice(true); setPage("overview"); setScreen("app");
  };

  const importBackup = () => {
    const input = document.createElement("input"); input.type = "file"; input.accept = ".json,.ostiro-backup";
    input.onchange = async () => {
      const file = input.files?.[0]; if (!file) return;
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        
        // Support both old profile backup format and new complete backup format
        const profileObj = parsed.profile ? parsed.profile : parsed;
        const portfolioObj = parsed.portfolioData ? parsed.portfolioData : null;
        
        if (!profileObj || typeof profileObj !== "object" || !profileObj.name) {
          throw new Error("Format de sauvegarde invalide");
        }
        
        const created = await createLocalProfile({ 
          ...defaultAnswers, 
          ...profileObj.answers, 
          name: `${profileObj.name} restauré`, 
          secret: "", 
          protectionEnabled: false 
        });
        
        if (portfolioObj) {
          await savePortfolioData(created, portfolioObj);
        }
        
        await refreshProfiles();
      } catch (err) { 
        console.error(err);
        window.alert("Cette sauvegarde n'est pas un profil Ostiro lisible."); 
      }
    };
    input.click();
  };

  if (screen === "welcome") return <WelcomeScreen onCreate={() => setScreen("onboarding")} onProfiles={() => {void refreshProfiles();setScreen("profiles");}} onDemo={() => void enterProfile(demoProfile)} onDeveloper={() => setScreen("developer")}/>;
  if (screen === "profiles") return <ProfilesScreen profiles={profiles} loading={profilesLoading} onBack={() => setScreen("welcome")} onCreate={() => setScreen("onboarding")} onOpen={requestOpen} onDemo={() => void enterProfile(demoProfile)} onImport={importBackup} onDuplicate={(profile) => void duplicateProfile(profile).then(refreshProfiles)} onDelete={(profile) => { if (window.confirm(`Supprimer le profil ${profile.name} ?`)) void deleteProfile(profile).then(refreshProfiles); }}/>;
  if (screen === "onboarding") return <OnboardingFlow onCancel={() => setScreen("welcome")} onComplete={completeOnboarding}/>;
  if (screen === "unlock" && lockedProfile) return <UnlockScreen profile={lockedProfile} onBack={() => setScreen("profiles")} onUnlock={async (secret) => { const valid=await verifyProfileSecret(lockedProfile,secret); if(valid) await enterProfile(lockedProfile); return valid; }}/>;
  if (screen === "developer") return <DeveloperScreen onBack={() => setScreen("welcome")} onDemo={() => void enterProfile(demoProfile)} onBeginner={() => developerScenario("beginner")} onIntermediate={() => developerScenario("casual")} onAdvanced={() => developerScenario("advanced")} onOnboarding={() => setScreen("onboarding")} onReset={() => { localStorage.removeItem("ostiro.local-profiles.v1"); void refreshProfiles(); }} onToggleTheme={() => { document.documentElement.dataset.theme = document.documentElement.dataset.theme === "light" ? "dark" : "light"; }}/>

  const profile = activeProfile ?? demoProfile;
  const navigate = (target: string) => setPage(target as PageId);

  // Search query result computation
  const getSearchResults = () => {
    if (!searchQuery.trim()) return { accounts: [], positions: [], transactions: [], tools: [] };
    const query = searchQuery.toLowerCase().trim();

    const matchedAccounts = portfolioData.accounts.filter(a =>
      a.name.toLowerCase().includes(query) ||
      a.kind.toLowerCase().includes(query) ||
      a.institution.toLowerCase().includes(query)
    );

    const matchedPositions = portfolioData.positions.filter(p =>
      p.symbol.toLowerCase().includes(query) ||
      p.name.toLowerCase().includes(query) ||
      p.account.toLowerCase().includes(query)
    );

    const matchedTransactions = portfolioData.transactions.filter(t =>
      t.label.toLowerCase().includes(query) ||
      t.account.toLowerCase().includes(query)
    );

    const matchedTools = [
      { id: "patrimoine", name: "Simulateur d'intérêts composés", keyword: "interet epargne capital placement" },
      { id: "rendement", name: "Rendement annuelisé (TRI/CAGR)", keyword: "tri cagr rendement performance gain" },
      { id: "effort", name: "Effort d'épargne mensuel", keyword: "effort epargne objectif budget" },
      { id: "independance", name: "Indépendance financière (FIRE)", keyword: "fire rentier independance retraite" },
      { id: "dividendes", name: "Simulateur de dividendes", keyword: "dividende coupon rente action" },
      { id: "frais", name: "Impact des frais sur 20 ans", keyword: "frais courtage assurance gestion" },
      { id: "credit", name: "Calculateur de crédit immobilier", keyword: "credit pret emprunt banque mensualite" },
      { id: "allocation", name: "Allocation cible", keyword: "allocation cible diversification risque" }
    ].filter(tool =>
      tool.name.toLowerCase().includes(query) ||
      tool.keyword.toLowerCase().includes(query)
    );

    return {
      accounts: matchedAccounts,
      positions: matchedPositions,
      transactions: matchedTransactions,
      tools: matchedTools
    };
  };

  const results = getSearchResults();
  const hasResults = results.accounts.length > 0 || results.positions.length > 0 || results.transactions.length > 0 || results.tools.length > 0;

  const content = {
    overview: <DashboardPage inspect={setTrace} navigate={navigate} profile={profile} onOpenDemo={() => void enterProfile(demoProfile)} data={portfolioData} />,
    accounts: <AccountsPage inspect={setTrace} data={portfolioData} navigate={navigate} />,
    analysis: <AnalysisPage data={portfolioData} />,
    budget: <BudgetPage data={portfolioData} />,
    portfolio: <PortfolioPage inspect={setTrace} data={portfolioData} navigate={navigate} />,
    transactions: <TransactionsPage data={portfolioData} />,
    dividends: <DividendsPage data={portfolioData} />,
    fees: <FeesPage data={portfolioData} />,
    imports: <ImportPage data={portfolioData} onSaveData={handleSavePortfolioData} navigate={navigate} />,
    "data-health": <DataHealthPage data={portfolioData} navigate={navigate} />,
    "sync-health": <SyncHealthPage />,
    tools: <ToolsPage defaultTab={toolsTab} />,
    exports: <ExportsPage profile={profile} data={portfolioData} />,
    "complete-wealth": <CompleteWealthPage profile={profile} data={portfolioData} onSaveData={handleSavePortfolioData} navigate={navigate} />,
    settings: (
      <SettingsPage 
        profile={profile} 
        onSwitchProfile={() => { void refreshProfiles(); setScreen("profiles"); }} 
        onDeveloper={() => setScreen("developer")} 
        onUpdateProfile={(changes) => void updateLocalProfile(profile, changes).then(setActiveProfile)} 
        onExportBackup={() => {
          const backupObj = { profile, portfolioData };
          const json = JSON.stringify(backupObj, null, 2);
          const blob = new Blob([json], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${profile.name.toLowerCase().replace(/\s+/g, "_")}_backup.json`;
          link.click();
          URL.revokeObjectURL(url);
        }}
        onImportBackup={importBackup}
      />
    ),
  }[page];

  return <div className="app-shell">
    <style>{`
      .search-row { transition: background 0.1s ease; color: var(--text); }
      .search-row:hover { background: rgba(143, 133, 255, 0.1) !important; color: #fff !important; }
    `}</style>
    {isSearchFocused && (
      <div style={{ position: "fixed", inset: 0, zIndex: 998, background: "transparent" }} onClick={() => setIsSearchFocused(false)} />
    )}
    <Sidebar page={page} profile={profile} onNavigate={setPage} onSwitchProfile={() => { void refreshProfiles(); setScreen("profiles"); }} onDeveloper={() => setScreen("developer")}/>
    <div className="workspace"><header className="topbar">
      <div style={{ position: "relative", zIndex: 999 }}>
        <label className="topbar-search">
          <Search size={17}/>
          <input
            placeholder="Rechercher un compte, actif ou transaction"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setIsSearchFocused(true); }}
            onFocus={() => setIsSearchFocused(true)}
            onKeyDown={e => { if (e.key === "Escape") setIsSearchFocused(false); }}
          />
          <kbd><Command size={11}/> K</kbd>
        </label>
        {isSearchFocused && searchQuery.trim() && (
          <div className="search-dropdown panel" style={{
            position: "absolute",
            top: "42px",
            left: 0,
            width: "420px",
            maxHeight: "350px",
            overflowY: "auto",
            zIndex: 999,
            background: "rgba(20, 20, 33, 0.96)",
            border: "1px solid var(--line)",
            borderRadius: "8px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
            backdropFilter: "blur(12px)",
            padding: "8px"
          }}>
            {!hasResults ? (
              <div style={{ padding: "16px", color: "var(--muted)", fontSize: "11px", textAlign: "center" }}>
                Aucun résultat pour « {searchQuery} »
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {results.accounts.length > 0 && (
                  <div>
                    <span className="eyebrow" style={{ fontSize: "8px", margin: "4px 8px" }}>Comptes & Actifs</span>
                    {results.accounts.map(a => (
                      <button key={a.id} className="search-row" style={{
                        width: "100%", border: 0, background: "transparent", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px", borderRadius: "4px", textAlign: "left", cursor: "pointer", fontSize: "10px"
                      }} onClick={() => { setPage("accounts"); setSearchQuery(""); setIsSearchFocused(false); }}>
                        <span><strong>{a.name}</strong> <small style={{ color: "var(--muted-2)" }}>{a.institution}</small></span>
                        <strong>{a.value.toLocaleString("fr-FR", { style: "currency", currency: a.currency })}</strong>
                      </button>
                    ))}
                  </div>
                )}
                
                {results.positions.length > 0 && (
                  <div>
                    <span className="eyebrow" style={{ fontSize: "8px", margin: "4px 8px" }}>Positions</span>
                    {results.positions.map((p, idx) => (
                      <button key={`${p.symbol}-${idx}`} className="search-row" style={{
                        width: "100%", border: 0, background: "transparent", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px", borderRadius: "4px", textAlign: "left", cursor: "pointer", fontSize: "10px"
                      }} onClick={() => { setPage("portfolio"); setSearchQuery(""); setIsSearchFocused(false); }}>
                        <span><strong>{p.name}</strong> <small style={{ color: "var(--muted-2)" }}>{p.symbol} · {p.account}</small></span>
                        <strong>{p.value.toLocaleString("fr-FR", { style: "currency", currency: p.currency })}</strong>
                      </button>
                    ))}
                  </div>
                )}

                {results.transactions.length > 0 && (
                  <div>
                    <span className="eyebrow" style={{ fontSize: "8px", margin: "4px 8px" }}>Transactions</span>
                    {results.transactions.map(t => (
                      <button key={t.id} className="search-row" style={{
                        width: "100%", border: 0, background: "transparent", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px", borderRadius: "4px", textAlign: "left", cursor: "pointer", fontSize: "10px"
                      }} onClick={() => { setPage("transactions"); setSearchQuery(""); setIsSearchFocused(false); }}>
                        <span><strong>{t.label}</strong> <small style={{ color: "var(--muted-2)" }}>{t.date} · {t.account}</small></span>
                        <strong className={t.amount >= 0 ? "positive" : "negative"}>
                          {t.amount >= 0 ? "+" : ""}{t.amount.toLocaleString("fr-FR", { style: "currency", currency: t.currency })}
                        </strong>
                      </button>
                    ))}
                  </div>
                )}

                {results.tools.length > 0 && (
                  <div>
                    <span className="eyebrow" style={{ fontSize: "8px", margin: "4px 8px" }}>Outils & Simulateurs</span>
                    {results.tools.map(tool => (
                      <button key={tool.id} className="search-row" style={{
                        width: "100%", border: 0, background: "transparent", display: "flex", gap: "8px", alignItems: "center", padding: "6px 8px", borderRadius: "4px", textAlign: "left", cursor: "pointer", fontSize: "10px"
                      }} onClick={() => { setToolsTab(tool.id); setPage("tools"); setSearchQuery(""); setIsSearchFocused(false); }}>
                        <strong>🔧 {tool.name}</strong>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="topbar-actions">{profile.isDemo && <span className="demo-pill">DÉMO</span>}<span className="active-profile-chip">{profile.initials}</span><button className="icon-button" aria-label="Thème" onClick={toggleTheme}>{profile.answers.theme === "light" ? <Moon size={18}/> : <Sun size={18}/>}</button><button className="icon-button icon-button--notice" aria-label="Notifications" onClick={handleBellClick}><Bell size={18}/>{hasNotice && <i/>}</button></div></header>
      {notice && profile.isDemo && <div className="demo-banner"><span>Vous explorez un patrimoine fictif. Aucun compte réel n'est connecté.</span><button onClick={() => setNotice(false)}>Masquer</button></div>}
      <main className="content">{content}</main>
    </div><TraceDrawer trace={trace} onClose={() => setTrace(null)}/>
  </div>;
}
