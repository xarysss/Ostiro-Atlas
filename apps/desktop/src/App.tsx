import { Bell, Command, Moon, Search } from "lucide-react";
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
        const profile = JSON.parse(await file.text()) as LocalProfile;
        await createLocalProfile({ ...defaultAnswers, ...profile.answers, name: `${profile.name} restauré`, secret: "", protectionEnabled: false });
        await refreshProfiles();
      } catch { window.alert("Cette sauvegarde n'est pas un profil Ostiro lisible."); }
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
    "data-health": <DataHealthPage data={portfolioData} />,
    "sync-health": <SyncHealthPage />,
    tools: <ToolsPage />,
    exports: <ExportsPage />,
    "complete-wealth": <CompleteWealthPage profile={profile} data={portfolioData} onSaveData={handleSavePortfolioData} navigate={navigate} />,
    settings: <SettingsPage profile={profile} onSwitchProfile={() => { void refreshProfiles(); setScreen("profiles"); }} onDeveloper={() => setScreen("developer")} onUpdateProfile={(changes) => void updateLocalProfile(profile,changes).then(setActiveProfile)} />,
  }[page];

  return <div className="app-shell">
    <Sidebar page={page} profile={profile} onNavigate={setPage} onSwitchProfile={() => { void refreshProfiles(); setScreen("profiles"); }} onDeveloper={() => setScreen("developer")}/>
    <div className="workspace"><header className="topbar"><label className="topbar-search"><Search size={17}/><input placeholder="Rechercher un compte, actif ou transaction"/><kbd><Command size={11}/> K</kbd></label><div className="topbar-actions">{profile.isDemo && <span className="demo-pill">DÉMO</span>}<span className="active-profile-chip">{profile.initials}</span><button className="icon-button" aria-label="Thème sombre"><Moon size={18}/></button><button className="icon-button icon-button--notice" aria-label="Notifications"><Bell size={18}/>{notice && <i/>}</button></div></header>
      {notice && profile.isDemo && <div className="demo-banner"><span>Vous explorez un patrimoine fictif. Aucun compte réel n'est connecté.</span><button onClick={() => setNotice(false)}>Masquer</button></div>}
      <main className="content">{content}</main>
    </div><TraceDrawer trace={trace} onClose={() => setTrace(null)}/>
  </div>;
}
