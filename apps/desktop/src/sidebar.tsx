import {
  ArrowDownToLine,
  BadgeEuro,
  BarChart3,
  BriefcaseBusiness,
  Calculator,
  ChartNoAxesCombined,
  ChevronDown,
  ChevronsUpDown,
  CircleDollarSign,
  Code2,
  DatabaseZap,
  FileInput,
  HeartPulse,
  LayoutDashboard,
  ReceiptText,
  Settings,
  ShieldCheck,
  Wallet,
  WalletCards,
} from "lucide-react";
import { useState } from "react";
import { BrandLogo } from "./components";
import type { LocalProfile } from "./profile-types";

export type PageId = "overview" | "accounts" | "analysis" | "budget" | "portfolio" | "transactions" | "dividends" | "fees" | "imports" | "data-health" | "sync-health" | "tools" | "exports" | "settings" | "complete-wealth" | "declaration-patrimoine";

const groups = [
  {
    label: "Vue d'ensemble",
    items: [
      { id: "overview" as const, label: "Tableau de bord", icon: LayoutDashboard },
      { id: "accounts" as const, label: "Patrimoine", icon: WalletCards },
      { id: "analysis" as const, label: "Analyse", icon: BarChart3 },
      { id: "budget" as const, label: "Budget", icon: Wallet },
    ],
  },
  {
    label: "Investissements",
    items: [
      { id: "portfolio" as const, label: "Portefeuille", icon: ChartNoAxesCombined },
      { id: "transactions" as const, label: "Transactions", icon: ReceiptText },
      { id: "dividends" as const, label: "Dividendes", icon: CircleDollarSign },
      { id: "fees" as const, label: "Frais", icon: BadgeEuro },
    ],
  },
  {
    label: "Données",
    items: [
      { id: "imports" as const, label: "Imports CSV", icon: FileInput },
      { id: "data-health" as const, label: "Santé des données", icon: HeartPulse, badge: "4" },
      { id: "sync-health" as const, label: "Synchronisations", icon: DatabaseZap },
      { id: "tools" as const, label: "Outils", icon: Calculator },
      { id: "exports" as const, label: "Exports & sauvegardes", icon: ArrowDownToLine },
    ],
  },
];

export function Sidebar({ page, profile, onNavigate, onSwitchProfile, onDeveloper, showDeveloper = true }: {
  page: PageId;
  profile: LocalProfile;
  onNavigate: (page: PageId) => void;
  onSwitchProfile: () => void;
  onDeveloper: () => void;
  showDeveloper?: boolean;
}) {
  const [isToolsExpanded, setIsToolsExpanded] = useState(
    page === "declaration-patrimoine" || page === "tools"
  );

  const tracked = new Set(profile.answers.trackedAssets);
  const hasInvestments = ["pea","cto","life_insurance","per","pee","stocks","etf","bonds","crypto","metals","scpi"].some((item) => tracked.has(item));
  const visible = (id: PageId) => {
    if (profile.isDemo) return true;
    if (id === "portfolio") return hasInvestments;
    if (id === "transactions") return tracked.has("bank_accounts") || tracked.has("budget") || tracked.has("income");
    if (id === "dividends") return tracked.has("dividends");
    if (id === "fees") return tracked.has("fees");
    return true;
  };
  return (
    <aside className="sidebar">
      <div className="brand">
        <BrandLogo variant="wordmark" />
      </div>
      <div className="local-chip"><ShieldCheck size={14} /> Données locales</div>
      <nav>
        {groups.map((group) => (
          <div className="nav-group" key={group.label}>
            <span className="nav-group__label">{group.label}</span>
            {group.items.filter((item) => visible(item.id)).map((item) => {
              const Icon = item.icon;
              const isTools = item.id === "tools";

              if (isTools) {
                const isActive = page === "tools" || page === "declaration-patrimoine";
                return (
                  <div key={item.id} style={{ display: "flex", flexDirection: "column" }}>
                    <button
                      className={isActive ? "nav-item nav-item--active" : "nav-item"}
                      onClick={() => setIsToolsExpanded(!isToolsExpanded)}
                    >
                      <Icon size={18} />
                      <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>
                      <ChevronDown
                        size={14}
                        style={{
                          transform: isToolsExpanded ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s ease"
                        }}
                      />
                    </button>
                    {isToolsExpanded && (
                      <div className="sidebar-sub-menu">
                        <button
                          className="sidebar-sub-item"
                          onClick={() => {
                            alert("Rapport fiscal Crypto : Bientôt disponible !");
                          }}
                        >
                          Rapport fiscal Crypto
                        </button>
                        <button
                          className={page === "declaration-patrimoine" ? "sidebar-sub-item sidebar-sub-item--active" : "sidebar-sub-item"}
                          onClick={() => onNavigate("declaration-patrimoine")}
                        >
                          Déclaration patrimoine
                        </button>
                        <button
                          className="sidebar-sub-item"
                          onClick={() => onNavigate("budget")}
                        >
                          Calculateur de budget
                        </button>
                        <button
                          className="sidebar-sub-item"
                          onClick={() => {
                            alert("Guides d'investissement Ostiro Atlas bientôt disponibles !");
                          }}
                        >
                          Guides finance
                        </button>
                        <button
                          className={page === "tools" ? "sidebar-sub-item sidebar-sub-item--active" : "sidebar-sub-item"}
                          onClick={() => onNavigate("tools")}
                        >
                          Intérêts composés
                        </button>
                        <button
                          className="sidebar-sub-item"
                          onClick={() => {
                            alert("Prix des crypto-actifs en temps réel.");
                          }}
                        >
                          Prix des cryptos
                        </button>
                        <button
                          className="sidebar-sub-item"
                          onClick={() => onNavigate("tools")}
                        >
                          Simulateur de...
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button className={page === item.id ? "nav-item nav-item--active" : "nav-item"} onClick={() => onNavigate(item.id)} key={item.id}>
                  <Icon size={18} /> <span>{item.label}</span>
                  {"badge" in item && item.badge && <b>{item.badge}</b>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="sidebar__bottom">
        {showDeveloper && <button className="nav-item developer-nav" onClick={onDeveloper}><Code2 size={18}/><span>Mode développeur</span></button>}
        <button className={page === "settings" ? "nav-item nav-item--active" : "nav-item"} onClick={() => onNavigate("settings")}>
          <Settings size={18} /> <span>Paramètres</span>
        </button>
        <button className="profile-card" onClick={onSwitchProfile}>
          <span className="profile-card__avatar">{profile.initials}</span>
          <div><strong>{profile.name}</strong><small>{profile.isDemo ? "Compte de démonstration" : "Profil local"}</small></div>
          {profile.isDemo ? <BriefcaseBusiness size={16}/> : <ChevronsUpDown size={16}/>}
        </button>
      </div>
    </aside>
  );
}
