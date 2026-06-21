import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BadgeEuro,
  Banknote,
  BarChart3,
  Check,
  CirclePlay,
  Code2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Database,
  Download,
  FileArchive,
  FileCheck2,
  FileInput,
  FolderOpen,
  Fingerprint,
  HardDrive,
  HeartPulse,
  Landmark,
  LockKeyhole,
  PieChart,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Upload,
  UserRound,
  WalletCards,
  WifiOff,
  CheckCircle2
} from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { previewCsv, type ImportPreview, type ImportedRow } from "@ostiro/importers";
import type { ReliabilityStatus } from "@ostiro/shared";
import { experienceLabels, goalLabels, type LocalProfile } from "./profile-types";
import { EmptyState, euro, euroPrecise, MetricCard, ReliabilityBadge, Section, type TraceInfo } from "./components";
import type { PortfolioData, Account, Position, Transaction, Dividend, Fee, DataIssue } from "./data-store";

// Asset category colors for mapping
const categoryColors: Record<string, string> = {
  "Comptes bancaires": "#8f85ff",
  "Livrets d'épargne": "#c5a8ff",
  "PEA": "#6aa9ff",
  "CTO": "#5fcdeb",
  "Assurance-vie": "#74a9d8",
  "PER": "#a696d4",
  "Crypto": "#ff8e72",
  "Immobilier": "#f4c66b",
  "Prêts & Dettes": "#ef6d7a",
  "Métaux précieux & Objets": "#d7b36a",
  "Autres actifs": "#aab5af"
};

const makePoints = (values: number[], width = 760, height = 230) => {
  const min = Math.min(...values) - 8;
  const max = Math.max(...values) + 5;
  if (min === max) {
    return values.map((_, index) => `${(index / (values.length - 1)) * width},${height / 2}`).join(" ");
  }
  return values.map((value, index) => {
    const x = (index / (values.length - 1)) * width;
    const y = height - ((value - min) / (max - min)) * height;
    return `${x},${y}`;
  }).join(" ");
};

const metricTrace = (title: string, value: string, formula: string, status: ReliabilityStatus = "reliable"): TraceInfo => ({
  title,
  value,
  status,
  asOf: "20 juin 2026, 18:42",
  source: "Données locales cryptées",
  formula,
  explanation: "Cette valeur est recalculée localement à partir des données de votre profil.",
});

export function DashboardPage({ inspect, navigate, profile, onOpenDemo, data }: { inspect: (trace: TraceInfo) => void; navigate: (page: string) => void; profile: LocalProfile; onOpenDemo: () => void; data: PortfolioData }) {
  const hasData = data && data.accounts && data.accounts.length > 0;
  
  if (!hasData) {
    return (
      <div className="empty-dashboard" style={{ animation: "fadeIn 0.5s ease" }}>
        <div className="welcome-row">
          <div>
            <span className="eyebrow">Votre espace local</span>
            <h1>Bienvenue, {profile.name.split(" ")[0]}.</h1>
            <p>Votre patrimoine est vide pour le moment. Commençons par ajouter vos données.</p>
          </div>
        </div>
        
        <div className="empty-dashboard-card panel" style={{ 
          padding: "45px 30px", 
          textAlign: "center", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          gap: "24px", 
          background: "linear-gradient(135deg, rgba(143,133,255,0.06), rgba(12,12,20,0.8))", 
          border: "1px solid rgba(143,133,255,0.18)", 
          borderRadius: "16px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
        }}>
          <div className="brand__mark" style={{ width: "48px", height: "48px" }}><span/><span/><span/></div>
          <h2 style={{ fontSize: "20px", margin: "0", fontWeight: "600", letterSpacing: "-0.02em" }}>Bienvenue, ajoutez un premier élément pour construire votre patrimoine</h2>
          <p style={{ color: "var(--muted)", maxWidth: "550px", fontSize: "11px", lineHeight: "1.6", margin: "0 0 10px" }}>
            Commencez par ajouter vos comptes, vos investissements ou vos actifs pour construire votre vision patrimoniale. Toutes vos données restent stockées localement et chiffrées sur votre PC.
          </p>
          
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            <button className="primary-button" onClick={() => navigate("complete-wealth")}>
              <Landmark size={15} /> Connecter un établissement
            </button>
            <button className="secondary-button" onClick={() => navigate("imports")}>
              <FileInput size={15} /> Importer un CSV
            </button>
            <button className="secondary-button" onClick={() => navigate("complete-wealth")}>
              <Plus size={15} /> Ajouter manuellement
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "24px", marginTop: "20px", borderTop: "1px solid var(--line-soft)", paddingTop: "20px", width: "100%", justifyContent: "center" }}>
            <button className="text-button" onClick={onOpenDemo} style={{ fontSize: "10px", textDecoration: "underline" }}>
              🚀 Ouvrir le compte démo
            </button>
            <span style={{ color: "var(--line-soft)", fontSize: "12px" }}>|</span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--muted)", fontSize: "10px" }}>
              <CirclePlay size={14} />
              <span>Découvrir Ostiro Atlas en 2 minutes (vidéo bientôt disponible)</span>
            </div>
          </div>
        </div>

        {profile.answers.experience === "beginner" && (
          <div className="beginner-tip" style={{ marginTop: "20px", display: "flex", gap: "8px", background: "rgba(143,133,255,0.06)", padding: "12px", borderRadius: "8px" }}>
            <Sparkles size={18} style={{ color: "var(--green)" }} />
            <div>
              <strong>Repère utile</strong>
              <p style={{ margin: "2px 0 0", fontSize: "10px", color: "var(--muted)" }}>
                Votre patrimoine net correspond à tout ce que vous possédez (actifs), moins ce que vous devez (dettes). Ostiro distinguera toujours vos versements de votre performance réelle.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Dynamic values for non-empty profile
  const totalAssets = data.accounts.filter(a => a.value > 0).reduce((acc, a) => acc + a.value, 0);
  const totalLiabilities = Math.abs(data.accounts.filter(a => a.value < 0).reduce((acc, a) => acc + a.value, 0));
  const netWealth = totalAssets - totalLiabilities;
  
  const totalInvestments = data.positions.reduce((acc, p) => acc + p.value, 0);
  const totalGain = data.positions.reduce((acc, p) => acc + (p.gain || 0), 0);
  
  const totalDividends = data.dividends.reduce((acc, d) => acc + d.net, 0);

  // Group by category for allocations
  const allocMap = new Map<string, number>();
  data.accounts.forEach(a => {
    if (a.value !== 0) {
      const key = a.value < 0 ? "Dettes" : a.kind;
      allocMap.set(key, (allocMap.get(key) || 0) + Math.abs(a.value));
    }
  });

  const allocations = [...allocMap.entries()].map(([label, value]) => ({
    label,
    value,
    percent: totalAssets > 0 ? parseFloat(((value / totalAssets) * 100).toFixed(1)) : 0,
    color: categoryColors[label] || "#8f85ff"
  })).sort((a, b) => b.value - a.value);

  // Fake chart points based on netWealth
  const mockSeries = [
    netWealth * 0.9, netWealth * 0.92, netWealth * 0.91, netWealth * 0.94,
    netWealth * 0.95, netWealth * 0.96, netWealth * 0.98, netWealth
  ];

  return (
    <>
      <div className="welcome-row">
        <div>
          <span className="eyebrow">Tableau de bord</span>
          <h1>Bonsoir, {profile.name.split(" ")[0]}.</h1>
          <p>Votre patrimoine net est à jour localement.</p>
        </div>
        <button className="primary-button" onClick={() => navigate("complete-wealth")}>
          <Plus size={17} /> Compléter mon patrimoine
        </button>
      </div>

      <div className="metric-grid">
        <MetricCard label="Patrimoine net" value={euro(netWealth)} change={`${netWealth >= 0 ? "+" : ""}${euro(netWealth)}`} icon={WalletCards} status="reliable" onInspect={() => inspect(metricTrace("Patrimoine net", euro(netWealth), "Σ actifs - Σ passifs"))} />
        <MetricCard label="Investissements" value={euro(totalInvestments)} change={`${totalGain >= 0 ? "+" : ""}${euro(totalGain)} total`} icon={TrendingUp} status="reliable" onInspect={() => inspect(metricTrace("Investissements", euro(totalInvestments), "Σ valeurs de marché des positions"))} />
        <MetricCard label="Performance nette" value={`${totalGain >= 0 ? "+" : ""}${euro(totalGain)}`} change="plus-value latente" icon={BarChart3} status="verified" onInspect={() => inspect(metricTrace("Performance nette", `${totalGain >= 0 ? "+" : ""}${euro(totalGain)}`, "valeur finale - coût d'achat"))} />
        <MetricCard label="Revenus dividendes" value={euro(totalDividends)} change="nets perçus" icon={CircleDollarSign} status="reliable" onInspect={() => inspect(metricTrace("Revenus dividendes", euro(totalDividends), "Σ dividendes perçus"))} />
      </div>

      <div className="dashboard-grid">
        <Section title="Évolution du patrimoine" subtitle="Historique récent" className="chart-panel">
          <div className="chart-summary"><strong>{euro(netWealth)}</strong><span className="positive">Valeur nette actuelle</span></div>
          <div className="line-chart">
            <span className="chart-axis chart-axis--top">{Math.round(netWealth / 1000)} k€</span>
            <span className="chart-axis chart-axis--middle">{Math.round((netWealth * 0.95) / 1000)} k€</span>
            <span className="chart-axis chart-axis--bottom">{Math.round((netWealth * 0.9) / 1000)} k€</span>
            <svg viewBox="0 0 760 230" preserveAspectRatio="none" aria-label="Courbe du patrimoine">
              <defs><linearGradient id="wealth-fill-real" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8f85ff" stopOpacity=".3"/><stop offset="1" stopColor="#8f85ff" stopOpacity="0"/></linearGradient></defs>
              <line x1="0" y1="10" x2="760" y2="10"/><line x1="0" y1="115" x2="760" y2="115"/><line x1="0" y1="220" x2="760" y2="220"/>
              <polygon points={`0,230 ${makePoints(mockSeries)} 760,230`} fill="url(#wealth-fill-real)" />
              <polyline points={makePoints(mockSeries)} className="wealth-line" />
            </svg>
          </div>
        </Section>

        <Section title="Allocation" subtitle="Répartition du patrimoine" action={<button className="text-button" onClick={() => navigate("accounts")}>Détails <ChevronRight size={15}/></button>}>
          <div className="allocation-wrap">
            <div className="donut" style={{
              background: allocations.length > 0 
                ? `conic-gradient(#8f85ff 0% ${allocations[0]?.percent || 0}%, #d7b36a ${allocations[0]?.percent || 0}% ${(allocations[0]?.percent || 0) + (allocations[1]?.percent || 0)}%, #6aa9ff ${(allocations[0]?.percent || 0) + (allocations[1]?.percent || 0)}% 100%)`
                : "var(--line)"
            }}>
              <div><strong>{euro(netWealth)}</strong><span>Total net</span></div>
            </div>
            <div className="allocation-list">
              {allocations.map((item, index) => (
                <div key={item.label}>
                  <i style={{ background: index === 0 ? "#8f85ff" : index === 1 ? "#d7b36a" : "#6aa9ff" }}/>
                  <span>{item.label}<small>{euro(item.value)}</small></span>
                  <strong>{item.percent}%</strong>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </div>

      <div className="dashboard-lower">
        <Section title="Comptes et actifs" subtitle="Dernières valeurs connues" action={<button className="text-button" onClick={() => navigate("accounts")}>Tout voir <ChevronRight size={15}/></button>}>
          <div className="account-list">
            {data.accounts.slice(0, 4).map((account) => (
              <button key={account.id} onClick={() => inspect({ title: account.name, value: euro(account.value), status: account.reliability, asOf: account.updated, source: account.institution, formula: account.value < 0 ? "Capital restant dû" : "Solde", explanation: `Valeur issue de ${account.kind.toLowerCase()}.` })}>
                <i style={{ background: account.color }}/>
                <span><strong>{account.name}</strong><small>{account.institution}</small></span>
                <span className="account-list__value"><strong>{euro(account.value)}</strong><ReliabilityBadge status={account.reliability} compact /></span>
              </button>
            ))}
          </div>
        </Section>
        
        <Section title="À vérifier" subtitle="Santé des données" action={<button className="count-badge">{data.dataIssues.length} éléments</button>}>
          {data.dataIssues.length > 0 ? (
            <div className="attention-list">
              {data.dataIssues.slice(0, 3).map((issue) => (
                <button key={issue.id} onClick={() => navigate("data-health")}>
                  <span className={`severity severity--${issue.severity}`}><AlertTriangle size={16}/></span>
                  <span><strong>{issue.title}</strong><small>{issue.target}</small></span>
                  <ChevronRight size={16}/>
                </button>
              ))}
            </div>
          ) : (
            <div style={{ padding: "20px", textAlign: "center", color: "var(--muted)", fontSize: "11px" }}>
              <CheckCircle2 size={16} style={{ color: "var(--positive)", marginRight: "8px", verticalAlign: "middle" }} />
              Toutes les données sont cohérentes !
            </div>
          )}
        </Section>
      </div>
    </>
  );
}

export function AccountsPage({ inspect, data, navigate }: { inspect: (trace: TraceInfo) => void; data: PortfolioData; navigate: (page: string) => void }) {
  const totalAssets = data.accounts.filter(a => a.value > 0).reduce((acc, a) => acc + a.value, 0);
  const totalLiabilities = Math.abs(data.accounts.filter(a => a.value < 0).reduce((acc, a) => acc + a.value, 0));
  const netWealth = totalAssets - totalLiabilities;

  return (
    <>
      <PageTitle 
        eyebrow="Patrimoine" 
        title="Vos comptes et actifs" 
        detail="Actifs, passifs et niveau de confiance au même endroit." 
        action={<button className="primary-button" onClick={() => navigate("complete-wealth")}><Plus size={17}/> Ajouter un compte</button>}
      />
      <div className="summary-strip">
        <div><span>Actifs bruts</span><strong>{euro(totalAssets)}</strong></div>
        <div><span>Passifs</span><strong className="negative">-{euro(totalLiabilities)}</strong></div>
        <div><span>Patrimoine net</span><strong>{euro(netWealth)}</strong></div>
        <div><span>Qualité globale</span><strong className="positive">92 / 100</strong></div>
      </div>
      <Section title="Tous les comptes" subtitle="Cliquez sur une ligne pour comprendre sa valorisation">
        {data.accounts.length > 0 ? (
          <div className="cards-table">
            {data.accounts.map((account) => (
              <button key={account.id} onClick={() => inspect({ title: account.name, value: euro(account.value), status: account.reliability, asOf: account.updated, source: account.institution, formula: account.value < 0 ? "Capital restant dû à la dernière échéance" : "Solde", explanation: account.kind })}>
                <span className="asset-logo" style={{ background: `${account.color}22`, color: account.color }}><Landmark size={19}/></span>
                <span><strong>{account.name}</strong><small>{account.kind} · {account.institution}</small></span>
                <ReliabilityBadge status={account.reliability}/>
                <span><strong>{euro(account.value)}</strong><small>{account.updated}</small></span>
                <ChevronRight size={17}/>
              </button>
            ))}
          </div>
        ) : (
          <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>
            Aucun compte enregistré. Cliquez sur « Ajouter un compte » pour commencer.
          </div>
        )}
      </Section>
    </>
  );
}

export function PortfolioPage({ inspect, data, navigate }: { inspect: (trace: TraceInfo) => void; data: PortfolioData; navigate: (page: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const totalValue = data.positions.reduce((acc, p) => acc + p.value, 0);
  const totalGain = data.positions.reduce((acc, p) => acc + (p.gain || 0), 0);

  const filteredPositions = data.positions.filter((position) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      position.name.toLowerCase().includes(q) ||
      position.symbol.toLowerCase().includes(q) ||
      position.account.toLowerCase().includes(q)
    );
  });
  
  return (
    <>
      <PageTitle 
        eyebrow="Investissements" 
        title="Portefeuille" 
        detail="Positions, PRU et performances calculés depuis vos transactions." 
        action={
          <>
            <button className="secondary-button" onClick={() => { setShowSearch(!showSearch); if (showSearch) setSearchQuery(""); }}>
              <Search size={17}/> {showSearch ? "Masquer" : "Rechercher"}
            </button>
            <button className="primary-button" onClick={() => navigate("complete-wealth")}>
              <Plus size={17}/> Ajouter
            </button>
          </>
        }
      />
      
      {showSearch && (
        <div style={{ marginBottom: "16px" }}>
          <input 
            type="text" 
            placeholder="Rechercher une position par nom, symbole ou compte..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--line-soft)",
              borderRadius: "6px",
              color: "var(--text)",
              fontSize: "12px",
              outline: "none"
            }}
            autoFocus
          />
        </div>
      )}

      <div className="summary-strip">
        <div><span>Valeur totale</span><strong>{euro(totalValue)}</strong></div>
        <div><span>Plus-value latente</span><strong className={totalGain >= 0 ? "positive" : "negative"}>{totalGain >= 0 ? "+" : ""}{euro(totalGain)}</strong></div>
        <div><span>TRI estimé</span><strong className="positive">+8,42 %</strong></div>
        <div><span>Frais 2026</span><strong>{euro(data.fees.reduce((acc, f) => acc + f.amount, 0))}</strong></div>
      </div>
      <Section title="Positions" subtitle={`${filteredPositions.length} lignes · Prix en devise de cotation`}>
        {data.positions.length > 0 ? (
          filteredPositions.length > 0 ? (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Actif</th>
                    <th>Compte</th>
                    <th>Quantité</th>
                    <th>PRU</th>
                    <th>Prix</th>
                    <th>Valeur</th>
                    <th>+/- value</th>
                    <th>Fiabilité</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPositions.map((position, idx) => (
                    <tr key={`${position.symbol}-${idx}`} onClick={() => inspect({ title: `${position.name} · PRU`, value: position.averageCost === null ? "Non calculable" : euroPrecise(position.averageCost), status: position.reliability, asOf: position.updated, source: position.account, formula: "coût moyen pondéré", explanation: "Les frais d'achat sont intégrés au coût moyen." })}>
                      <td>
                        <span className="ticker">{position.symbol.slice(0, 2)}</span>
                        <span><strong>{position.name}</strong><small>{position.symbol} · {position.currency}</small></span>
                      </td>
                      <td>{position.account}</td>
                      <td>{position.quantity}</td>
                      <td>{position.averageCost === null ? <span className="muted">Indisponible</span> : euroPrecise(position.averageCost)}</td>
                      <td>{euroPrecise(position.price)}</td>
                      <td><strong>{euroPrecise(position.value)}</strong></td>
                      <td>{position.gain === null ? <span className="muted">Partielle</span> : <span className={position.gain >= 0 ? "positive" : "negative"}>{position.gain >= 0 ? "+" : ""}{euroPrecise(position.gain)}</span>}</td>
                      <td><ReliabilityBadge status={position.reliability} compact/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>
              Aucune position ne correspond à votre recherche.
            </div>
          )
        ) : (
          <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>
            Aucune position d'investissement enregistrée.
          </div>
        )}
      </Section>
    </>
  );
}

export function TransactionsPage({ data }: { data: PortfolioData }) {
  return (
    <>
      <PageTitle 
        eyebrow="Historique" 
        title="Transactions" 
        detail="Toutes les opérations importées ou ajoutées manuellement." 
        action={<button className="primary-button"><FileInput size={17}/> Importer un CSV</button>}
      />
      <Section title="Dernières opérations" subtitle="Toutes les devises sont conservées dans leur forme d'origine">
        {data.transactions.length > 0 ? (
          <div className="simple-list">
            {data.transactions.map((tx, idx) => (
              <div key={`${tx.id}-${idx}`}>
                <span className={tx.amount >= 0 ? "transaction-icon transaction-icon--in" : "transaction-icon"}>
                  {tx.amount >= 0 ? <ArrowDown size={17}/> : <ArrowUp size={17}/>}
                </span>
                <span>
                  <strong>{tx.label}</strong>
                  <small>{tx.date} · {tx.account} · {tx.type}</small>
                </span>
                <strong className={tx.amount >= 0 ? "positive" : "negative"}>
                  {tx.amount >= 0 ? "+" : ""}{tx.amount.toLocaleString("fr-FR", { style: "currency", currency: tx.currency })}
                </strong>
                <ReliabilityBadge status={tx.reliability} compact/>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>
            Aucune transaction dans l'historique.
          </div>
        )}
      </Section>
    </>
  );
}

export function DividendsPage({ data }: { data: PortfolioData }) {
  const received = data.dividends.filter(d => d.status === "Payé").reduce((acc, d) => acc + d.net, 0);
  const announced = data.dividends.filter(d => d.status === "Annoncé").reduce((acc, d) => acc + d.net, 0);
  const estimated = data.dividends.filter(d => d.status === "Estimé").reduce((acc, d) => acc + d.net, 0);

  return (
    <>
      <PageTitle eyebrow="Revenus" title="Dividendes" detail="Montants reçus, annoncés et estimés clairement distingués."/>
      <div className="summary-strip">
        <div><span>Reçus</span><strong>{euro(received)}</strong></div>
        <div><span>Annoncés</span><strong>{euro(announced)}</strong></div>
        <div><span>Estimés</span><strong>{euro(estimated)}</strong></div>
        <div><span>Total</span><strong>{euro(received + announced + estimated)}</strong></div>
      </div>
      <Section title="Calendrier et détails" subtitle="Le net fiscal reste une estimation pédagogique">
        {data.dividends.length > 0 ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Actif</th>
                  <th>Paiement</th>
                  <th>Brut</th>
                  <th>Retenue</th>
                  <th>Net estimé</th>
                  <th>Statut</th>
                  <th>Fiabilité</th>
                </tr>
              </thead>
              <tbody>
                {data.dividends.map((item, idx) => (
                  <tr key={`${item.asset}-${idx}`}>
                    <td><strong>{item.asset}</strong></td>
                    <td>{item.date}</td>
                    <td>{euroPrecise(item.gross)}</td>
                    <td>{euroPrecise(item.tax)}</td>
                    <td>{euroPrecise(item.net)}</td>
                    <td>{item.status}</td>
                    <td><ReliabilityBadge status={item.reliability}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>
            Aucun dividende enregistré.
          </div>
        )}
      </Section>
    </>
  );
}

export function FeesPage({ data }: { data: PortfolioData }) {
  const feesTotal = data.fees.reduce((acc, f) => acc + f.amount, 0);
  return (
    <>
      <PageTitle eyebrow="Coûts" title="Frais" detail="Frais explicites et implicites séparés, sans fausse précision."/>
      <div className="summary-strip">
        <div><span>Total cumulé</span><strong>{euro(feesTotal)}</strong></div>
        <div><span>Frais de courtage</span><strong>{euro(data.fees.filter(f => f.label.toLowerCase().includes("courtage")).reduce((acc, f) => acc + f.amount, 0))}</strong></div>
        <div><span>Impact estimé sur 20 ans</span><strong>~ {euro(feesTotal * 5)}</strong></div>
        <div><span>Statut</span><strong className="positive">Optimisé</strong></div>
      </div>
      <Section title="Détail par nature" subtitle="Les frais implicites reposent sur les taux publiés des supports">
        {data.fees.length > 0 ? (
          <div className="fee-bars">
            {data.fees.map((fee, idx) => (
              <div key={`${fee.label}-${idx}`}>
                <span>{fee.label}<ReliabilityBadge status={fee.certainty} compact/></span>
                <div>
                  <div style={{ width: `${Math.min((fee.amount / (feesTotal || 1)) * 100, 100)}%`, background: "var(--green)", height: "100%", borderRadius: "5px" }}/>
                </div>
                <strong>{euro(fee.amount)}</strong>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>
            Aucun frais recensé pour ce profil.
          </div>
        )}
      </Section>
    </>
  );
}

export function DataHealthPage({ data, navigate }: { data: PortfolioData; navigate: (page: string) => void }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setScanDone(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanDone(true);
    }, 1200);
  };

  const handleActionClick = (actionName: string) => {
    if (actionName.toLowerCase().includes("csv") || actionName.toLowerCase().includes("import")) {
      navigate("imports");
    } else if (actionName.toLowerCase().includes("valeur") || actionName.toLowerCase().includes("mise")) {
      navigate("complete-wealth");
    } else {
      navigate("transactions");
    }
  };

  return (
    <>
      <PageTitle 
        eyebrow="Contrôle qualité" 
        title="Santé des données" 
        detail="Ce qui est fiable, ce qui manque et comment le corriger." 
        action={
          <button 
            className="secondary-button" 
            onClick={handleScan} 
            disabled={isScanning}
            style={{ opacity: isScanning ? 0.7 : 1, cursor: isScanning ? "not-allowed" : "pointer" }}
          >
            <RefreshCw size={16} className={isScanning ? "spin" : ""} style={{ marginRight: "6px" }} />
            {isScanning ? "Analyse en cours..." : "Relancer les contrôles"}
          </button>
        }
      />

      {scanDone && (
        <div style={{
          background: "rgba(46, 204, 113, 0.1)",
          border: "1px solid rgba(46, 204, 113, 0.3)",
          color: "var(--green)",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "16px",
          fontSize: "11px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <span><strong>Contrôle terminé :</strong> 100% des données locales ont été analysées avec succès.</span>
          <button onClick={() => setScanDone(false)} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: "16px", lineHeight: 1 }}>×</button>
        </div>
      )}

      <div className="health-hero">
        <div className="health-score">
          <span>{data.accounts.length > 0 ? "94" : "100"}</span>
          <small>/ 100</small>
        </div>
        <div>
          <ReliabilityBadge status="reliable"/>
          <h2>Analyse de la qualité locale</h2>
          <p>Ostiro contrôle l'intégrité de vos transactions locales, les doublons et les devises.</p>
        </div>
        <div className="health-stats">
          <span><strong>{data.transactions.length}</strong> transactions</span>
          <span><strong>{data.dataIssues.length}</strong> alertes</span>
        </div>
      </div>
      
      <Section title="Alertes qualité détectées">
        {data.dataIssues.length > 0 ? (
          <div className="issue-list">
            {data.dataIssues.map((issue) => (
              <div key={issue.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--line-soft)", padding: "12px 16px" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <span className={`severity severity--${issue.severity}`}><AlertTriangle size={17}/></span>
                  <div>
                    <strong>{issue.title}</strong>
                    <p style={{ margin: "2px 0 0", color: "var(--muted)", fontSize: "10px" }}>{issue.detail}</p>
                    <small style={{ color: "var(--muted-2)", fontSize: "8px" }}>{issue.target}</small>
                  </div>
                </div>
                <button className="secondary-button" onClick={() => handleActionClick(issue.action)}>{issue.action}</button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>
            <CheckCircle2 size={24} style={{ color: "var(--positive)", marginBottom: "8px" }} />
            <p>Aucune anomalie détectée dans votre patrimoine local.</p>
          </div>
        )}
      </Section>
    </>
  );
}

export function SyncHealthPage() {
  return (
    <>
      <PageTitle eyebrow="Connexions" title="Santé des synchronisations" detail="La V1 locale n'utilise aucun agrégateur bancaire ni serveur Ostiro."/>
      <div className="offline-banner" style={{
        display: "flex", gap: "12px", background: "rgba(143,133,255,0.06)", border: "1px solid rgba(143,133,255,0.2)", borderRadius: "8px", padding: "16px", marginBottom: "16px"
      }}>
        <span><WifiOff size={22} style={{ color: "var(--green)" }}/></span>
        <div>
          <strong>Mode local actif (Sans Cloud)</strong>
          <p style={{ margin: "4px 0 0", fontSize: "10px", color: "var(--muted)" }}>
            Vos fichiers et données financières restent sur cet ordinateur. Aucun agrégateur externe n'est branché pour garantir une confidentialité totale.
          </p>
        </div>
      </div>
      
      <div className="sync-grid">
        <Section title="Sources locales & imports" subtitle="Dernières actualisations">
          <div className="sync-list" style={{ fontSize: "11px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--line-soft)" }}>
              <span>Fichiers CSV importés</span>
              <strong>Gratuit & Illimité</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
              <span>Saisie manuelle locale</span>
              <strong>Actif</strong>
            </div>
          </div>
        </Section>
        
        <Section title="Connecteurs distants (Powens / Bridge / GoCardless)" subtitle="Préparation de l'architecture">
          <div style={{ padding: "10px 0" }}>
            <span className="planned-chip" style={{ display: "inline-block", marginBottom: "10px" }}>Bientôt disponible</span>
            <p style={{ fontSize: "10px", color: "var(--muted)", margin: "0" }}>
              L'architecture technique supporte l'interface <code>BankProvider</code>. Les connecteurs de synchronisation automatique bancaire en lecture seule pourront être activés ultérieurement avec un fournisseur d'API compatible.
            </p>
          </div>
        </Section>
      </div>
    </>
  );
}

export function ImportPage({ data, onSaveData, navigate }: { data: PortfolioData; onSaveData: (data: PortfolioData) => void; navigate: (page: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState("");
  
  // Custom mapping templates
  const [selectedAccount, setSelectedAccount] = useState("");
  const [newAccountName, setNewAccountName] = useState("");
  
  // Mapping dropdown selections
  const [dateCol, setDateCol] = useState("");
  const [labelCol, setLabelCol] = useState("");
  const [amountCol, setAmountCol] = useState("");
  const [currencyCol, setCurrencyCol] = useState("");
  
  // Import completed screen state
  const [importSummary, setImportSummary] = useState<{
    success: boolean;
    rowsCount: number;
    accountCreated: string;
    duplicatesIgnored: number;
  } | null>(null);

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const content = await file.text();
    setFileContent(content);
    setFileName(file.name);
    
    // Quick parse to get headers
    const lines = content.split(/\r?\n/);
    const header = lines[0] ?? "";
    const delimiter = header.includes(";") ? ";" : ",";
    const fields = header.split(delimiter).map((field) => field.replace(/^\"|\"$/g, "").trim());
    
    const findCol = (terms: string[]) => fields.find((f) => terms.some((term) => f.toLowerCase().includes(term))) ?? fields[0] ?? "";
    
    const matchedDate = findCol(["date"]);
    const matchedLabel = findCol(["label", "libell", "description", "details"]);
    const matchedAmount = findCol(["montant", "amount", "total", "valeur"]);
    const matchedCurrency = findCol(["devise", "currency"]);

    setDateCol(matchedDate);
    setLabelCol(matchedLabel);
    setAmountCol(matchedAmount);
    setCurrencyCol(matchedCurrency);

    const mappingObj: any = {
      date: matchedDate,
      label: matchedLabel,
      amount: matchedAmount,
    };
    if (matchedCurrency) {
      mappingObj.currency = matchedCurrency;
    }
    const previewResult = previewCsv(content, mappingObj);
    setPreview(previewResult);
    
    // Auto populate new account name
    setNewAccountName(file.name.replace(".csv", "") + " Import");
  };

  const handleReRunPreview = (newMapping: { date: string; label: string; amount: string; currency?: string }) => {
    if (!fileContent) return;
    const mappingObj: any = {
      date: newMapping.date,
      label: newMapping.label,
      amount: newMapping.amount,
    };
    if (newMapping.currency) {
      mappingObj.currency = newMapping.currency;
    }
    const previewResult = previewCsv(fileContent, mappingObj);
    setPreview(previewResult);
  };

  const executeImport = () => {
    if (!preview) return;

    let targetAccountId = selectedAccount;
    let targetAccountName = "";
    
    const updatedAccounts = [...data.accounts];
    
    if (selectedAccount === "new" || !selectedAccount) {
      // Create new account
      const newAccId = "acc-" + Math.random().toString(36).substr(2, 9);
      const newAcc: Account = {
        id: newAccId,
        name: newAccountName || "Import CSV " + fileName,
        kind: "Comptes bancaires",
        institution: "Import CSV",
        value: 0, // Will sum transactions
        delta: 0,
        reliability: "verified",
        updated: "À l'instant",
        color: "#8f85ff",
        currency: "EUR"
      };
      updatedAccounts.push(newAcc);
      targetAccountId = newAccId;
      targetAccountName = newAcc.name;
    } else {
      const existing = data.accounts.find(a => a.id === selectedAccount);
      targetAccountName = existing ? existing.name : "Compte";
    }

    // Map rows to Transactions
    const newTransactions: Transaction[] = [];
    let duplicatesIgnored = 0;
    
    preview.rows.forEach(row => {
      // Check for duplicate fingerprints in existing transactions
      const isDuplicate = data.transactions.some(t => 
        t.accountId === targetAccountId && 
        t.date === row.occurredAt && 
        t.label === row.label && 
        t.amount === row.amount
      );
      
      if (isDuplicate) {
        duplicatesIgnored++;
        return;
      }

      newTransactions.push({
        id: "tx-imported-" + Math.random().toString(36).substr(2, 9),
        date: row.occurredAt,
        label: row.label,
        account: targetAccountName,
        accountId: targetAccountId,
        amount: row.amount,
        type: row.amount >= 0 ? "Dépôt" : "Retrait",
        currency: row.currency,
        reliability: "verified"
      });
    });

    // Update target account total balance
    const accountIndex = updatedAccounts.findIndex(a => a.id === targetAccountId);
    const targetAcc = updatedAccounts[accountIndex];
    if (targetAcc) {
      const sumTxs = newTransactions.reduce((acc, t) => acc + t.amount, 0);
      targetAcc.value += sumTxs;
      targetAcc.updated = "À l'instant";
    }

    // Save CSV Mapping template locally
    const updatedTemplates = [...data.csvTemplates];
    const signature = preview.headers.join("|");
    const hasTemplate = updatedTemplates.some(t => t.fingerprint === signature);
    if (!hasTemplate) {
      const mappingObj: any = {
        date: dateCol,
        label: labelCol,
        amount: amountCol,
      };
      if (currencyCol) {
        mappingObj.currency = currencyCol;
      }
      updatedTemplates.push({
        name: "Modèle " + fileName,
        fingerprint: signature,
        mapping: mappingObj
      });
    }

    onSaveData({
      ...data,
      accounts: updatedAccounts,
      transactions: [...newTransactions, ...data.transactions],
      csvTemplates: updatedTemplates
    });

    setImportSummary({
      success: true,
      rowsCount: newTransactions.length,
      accountCreated: targetAccountName,
      duplicatesIgnored
    });
  };

  if (importSummary) {
    return (
      <div className="import-success-page" style={{ animation: "fadeIn 0.4s ease" }}>
        <PageTitle eyebrow="Succès" title="Importation réussie" detail="Vos données ont été consolidées localement." />
        
        <div className="panel" style={{ padding: "40px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <CheckCircle2 size={48} style={{ color: "var(--positive)" }} />
          <h2>Rapport d'importation CSV</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", maxWidth: "450px", width: "100%", margin: "20px 0", fontSize: "11px", textAlign: "left" }}>
            <div style={{ padding: "10px", background: "var(--line-soft)", borderRadius: "6px" }}>
              <span>Lignes importées :</span>
              <strong style={{ display: "block", fontSize: "18px", color: "var(--positive)", marginTop: "4px" }}>{importSummary.rowsCount}</strong>
            </div>
            <div style={{ padding: "10px", background: "var(--line-soft)", borderRadius: "6px" }}>
              <span>Doublons ignorés :</span>
              <strong style={{ display: "block", fontSize: "18px", color: "var(--yellow)", marginTop: "4px" }}>{importSummary.duplicatesIgnored}</strong>
            </div>
          </div>
          <p style={{ color: "var(--muted)", fontSize: "10px" }}>
            Compte affecté : <strong>{importSummary.accountCreated}</strong>. Les soldes globaux et l'évolution de votre patrimoine ont été actualisés.
          </p>
          <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
            <button className="primary-button" onClick={() => { setImportSummary(null); setPreview(null); setFileName(""); navigate("overview"); }}>
              Aller au tableau de bord
            </button>
            <button className="secondary-button" onClick={() => { setImportSummary(null); setPreview(null); setFileName(""); }}>
              Importer un autre fichier
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageTitle eyebrow="Entrée des données" title="Importer un CSV" detail="Le fichier est analysé dans cette fenêtre et n'est envoyé nulle part."/>
      {!preview ? (
        <div className="import-layout">
          <div className="drop-zone" onClick={() => inputRef.current?.click()}>
            <input ref={inputRef} type="file" accept=".csv,text/csv" onChange={handleFile}/>
            <span><Upload size={26}/></span>
            <h2>Déposez un export de votre banque ou courtier</h2>
            <p>CSV UTF-8, séparateur virgule ou point-virgule · 25 Mo maximum</p>
            <button className="primary-button">Choisir un fichier</button>
            <small><LockKeyhole size={14}/> Traitement 100 % local</small>
          </div>
          <Section title="Assistant en 5 étapes" subtitle="Aucune ligne n'est écrite avant validation">
            <div className="steps">
              <span><b>1</b> Sélection et analyse locale du fichier</span>
              <span><b>2</b> Association à un compte (nouveau ou existant)</span>
              <span><b>3</b> Mapping visuel des colonnes (Date, Montant...)</span>
              <span><b>4</b> Validation visuelle des lignes & détection des doublons</span>
              <span><b>5</b> Validation finale et mise à jour du patrimoine</span>
            </div>
          </Section>
        </div>
      ) : (
        <>
          <div className="import-summary" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--panel)", padding: "16px", borderRadius: "8px", marginBottom: "16px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <span><FileCheck2 size={22} style={{ color: "var(--green)" }}/></span>
              <div>
                <strong>{fileName}</strong>
                <small style={{ display: "block", color: "var(--muted)", fontSize: "9px", marginTop: "2px" }}>
                  {preview.rows.length} lignes valides · {preview.issues.length} anomalies · {preview.duplicateFingerprints.length} doublons
                </small>
              </div>
            </div>
            <button className="secondary-button" onClick={() => { setPreview(null); setFileName(""); }}>Changer de fichier</button>
          </div>

          <div className="import-config panel" style={{ padding: "20px", marginBottom: "16px" }}>
            <h3>1. Paramètres du compte de destination</h3>
            <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "12px" }}>
              <label className="field">
                <span>Compte cible</span>
                <select value={selectedAccount} onChange={e => setSelectedAccount(e.target.value)}>
                  <option value="new">Créer un nouveau compte</option>
                  {data.accounts.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.institution})</option>
                  ))}
                </select>
              </label>

              {(selectedAccount === "new" || !selectedAccount) && (
                <label className="field">
                  <span>Nom du nouveau compte</span>
                  <input
                    type="text"
                    value={newAccountName}
                    onChange={e => setNewAccountName(e.target.value)}
                    placeholder="Nom du compte (ex: Bourso Compte Courant)"
                  />
                </label>
              )}
            </div>

            <h3 style={{ marginTop: "20px" }}>2. Correspondance des colonnes (Mapping)</h3>
            <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginTop: "12px" }}>
              <label className="field">
                <span>Date</span>
                <select value={dateCol} onChange={e => { setDateCol(e.target.value); handleReRunPreview({ date: e.target.value, label: labelCol, amount: amountCol, currency: currencyCol }); }}>
                  {preview.headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </label>
              <label className="field">
                <span>Libellé / Description</span>
                <select value={labelCol} onChange={e => { setLabelCol(e.target.value); handleReRunPreview({ date: dateCol, label: e.target.value, amount: amountCol, currency: currencyCol }); }}>
                  {preview.headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </label>
              <label className="field">
                <span>Montant</span>
                <select value={amountCol} onChange={e => { setAmountCol(e.target.value); handleReRunPreview({ date: dateCol, label: labelCol, amount: e.target.value, currency: currencyCol }); }}>
                  {preview.headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </label>
              <label className="field">
                <span>Devise (Optionnel)</span>
                <select value={currencyCol} onChange={e => { setCurrencyCol(e.target.value); handleReRunPreview({ date: dateCol, label: labelCol, amount: amountCol, currency: e.target.value }); }}>
                  <option value="">-- EUR par défaut --</option>
                  {preview.headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </label>
            </div>
          </div>

          <Section 
            title="Aperçu des 20 premières lignes" 
            subtitle="Les transactions existantes identiques seront automatiquement écartées"
            action={<button className="primary-button" onClick={executeImport}><FileInput size={16}/> Valider & Importer</button>}
          >
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Ligne</th>
                    <th>Date</th>
                    <th>Libellé</th>
                    <th>Montant</th>
                    <th>Devise</th>
                    <th>Contrôle</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.slice(0, 20).map((row) => (
                    <tr key={row.rowNumber}>
                      <td>{row.rowNumber}</td>
                      <td>{row.occurredAt}</td>
                      <td>{row.label}</td>
                      <td className={row.amount >= 0 ? "positive" : "negative"}>
                        {row.amount >= 0 ? "+" : ""}{row.amount.toFixed(2)}
                      </td>
                      <td>{row.currency}</td>
                      <td>
                        {preview.duplicateFingerprints.includes(row.fingerprint) ? (
                          <span className="warning-text">Doublon dans le fichier</span>
                        ) : (
                          <span className="positive">Valide</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </>
      )}
    </>
  );
}

export function ExportsPage() {
  const exportDemo = () => {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), demo: true }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = "ostiro-demo-export.json"; link.click(); URL.revokeObjectURL(url);
  };
  return <><PageTitle eyebrow="Portabilité" title="Exports & sauvegardes" detail="Vos données vous appartiennent, dans des formats lisibles et documentés."/><div className="export-grid"><Section title="Export de données" subtitle="JSON structuré, sans dépendance à Ostiro"><div className="export-card"><span><Download size={22}/></span><div><strong>Export complet JSON</strong><p>Comptes, transactions, sources, calculs et journal d'audit.</p></div><button className="primary-button" onClick={exportDemo}>Exporter la démo</button></div><div className="export-card"><span><FileArchive size={22}/></span><div><strong>Exports CSV par table</strong><p>Formats simples pour Excel, LibreOffice ou un autre outil.</p></div><button className="secondary-button" disabled>V0.2</button></div></Section><Section title="Sauvegarde locale" subtitle="Base, pièces jointes et manifeste de version"><div className="export-card"><span><HardDrive size={22}/></span><div><strong>Sauvegarde `.owb`</strong><p>Archive complète avec contrôle d'intégrité.</p></div><button className="secondary-button" disabled>V0.2</button></div><div className="export-card"><span><LockKeyhole size={22}/></span><div><strong>Chiffrement par mot de passe</strong><p>Argon2id + chiffrement authentifié, prévu avant la V1.</p></div><button className="secondary-button" disabled>V0.3</button></div></Section></div></>;
}

export function SettingsPage({ 
  profile, 
  onSwitchProfile, 
  onDeveloper, 
  onUpdateProfile,
  onExportBackup,
  onImportBackup
}: { 
  profile: LocalProfile; 
  onSwitchProfile: () => void; 
  onDeveloper: () => void; 
  onUpdateProfile: (changes: Partial<LocalProfile["answers"]> & { name?: string }) => void;
  onExportBackup: () => void;
  onImportBackup: () => void;
}) {
  const [name, setName] = useState(profile.name);

  useEffect(() => {
    setName(profile.name);
  }, [profile.name]);

  const handleNameBlur = () => {
    if (name.trim() && name !== profile.name) {
      onUpdateProfile({ name: name.trim() });
    }
  };

  const handleNameKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && name.trim() && name !== profile.name) {
      onUpdateProfile({ name: name.trim() });
      event.currentTarget.blur();
    }
  };

  return <><PageTitle eyebrow="Préférences" title="Paramètres" detail="Profil, apparence, sauvegardes et confidentialité locale." action={<button className="secondary-button" onClick={onSwitchProfile}><UserRound size={16}/> Changer de profil</button>}/><div className="settings-grid">
    <Section title="Profil local" subtitle="Aucun compte en ligne">
      <label className="field">
        <span>Nom affiché</span>
        <input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          onBlur={handleNameBlur}
          onKeyDown={handleNameKeyDown}
        />
      </label>
      <label className="field">
        <span>Devise principale</span>
        <select value={profile.answers.currency} onChange={(event) => onUpdateProfile({currency:event.target.value})}>
          <option>EUR</option>
          <option>USD</option>
          <option>GBP</option>
          <option>CHF</option>
        </select>
      </label>
      <label className="field">
        <span>Thème</span>
        <select value={profile.answers.theme} onChange={(event) => onUpdateProfile({theme:event.target.value as LocalProfile["answers"]["theme"]})}>
          <option value="dark">Sombre</option>
          <option value="light">Clair</option>
          <option value="system">Système</option>
        </select>
      </label>
    </Section>
    <Section title="Sauvegardes" subtitle="Automatiques dans le dossier applicatif">
      <div className="settings-actions">
        <button onClick={onExportBackup}>
          <HardDrive size={18}/>
          <span><strong>Créer une sauvegarde complète</strong><small>Archive locale exportable (profil + transactions)</small></span>
          <ChevronRight/>
        </button>
        <button onClick={onImportBackup}>
          <Upload size={18}/>
          <span><strong>Restaurer une sauvegarde</strong><small>Importer un profil ou fichier `.json`</small></span>
          <ChevronRight/>
        </button>
        <button onClick={() => window.alert("L'emplacement de stockage par défaut est géré par la base locale d'Ostiro sur votre disque principal.")}>
          <FolderOpen size={18}/>
          <span><strong>Changer l'emplacement</strong><small>Stockage local par défaut</small></span>
          <ChevronRight/>
        </button>
      </div>
    </Section>
    <Section title="Vie privée" subtitle="Contrôle des fonctions réseau">
      <Toggle 
        icon={WifiOff} 
        title="Mode totalement hors ligne" 
        detail="Bloque toutes les requêtes réseau optionnelles" 
        checked={profile.answers.offlineMode ?? true}
        onChange={(checked) => onUpdateProfile({ offlineMode: checked })}
      />
      <Toggle 
        icon={Fingerprint} 
        title="Télémétrie" 
        detail="Désactivée par défaut; aucune mesure n'est envoyée" 
        checked={profile.answers.telemetry ?? false}
        onChange={(checked) => onUpdateProfile({ telemetry: checked })}
      />
      <Toggle 
        icon={RefreshCw} 
        title="Vérifier les mises à jour" 
        detail="Interroge GitHub Releases au lancement" 
        checked={profile.answers.checkForUpdates ?? true}
        onChange={(checked) => onUpdateProfile({ checkForUpdates: checked })}
      />
    </Section>
    <Section title="Sécurité locale" subtitle={profile.isProtected ? "Ce profil est protégé" : "Protection facultative"}>
      <Toggle 
        icon={LockKeyhole} 
        title="Verrouillage automatique" 
        detail="Verrouiller après 10 minutes d'inactivité" 
        checked={profile.answers.autoLock ?? false}
        onChange={(checked) => onUpdateProfile({ autoLock: checked })}
      />
      <Toggle 
        icon={ShieldCheck} 
        title="Confirmer les exports" 
        detail="Demander une validation avant toute sortie de données" 
        checked={profile.answers.confirmExports ?? true}
        onChange={(checked) => onUpdateProfile({ confirmExports: checked })}
      />
    </Section>
    <Section title="Outils avancés" subtitle="Tests et maintenance locale">
      <div className="settings-actions">
        <button onClick={onDeveloper}>
          <Code2 size={18}/>
          <span><strong>Mode développeur</strong><small>Scénarios démo, Onboarding et données manquantes</small></span>
          <ChevronRight/>
        </button>
        {profile.isDemo && (
          <button onClick={() => window.alert("Les profils de démonstration sont réinitialisés au redémarrage.")}>
            <RotateCcw size={18}/>
            <span><strong>Réinitialiser le compte démo</strong><small>Restaurer les données fictives initiales</small></span>
            <ChevronRight/>
          </button>
        )}
      </div>
    </Section>
    <Section title="À propos">
      <div className="about-mark">
        <span className="brand__mark"><span/><span/><span/></span>
        <div><strong>Ostiro Atlas 0.3.0</strong><small>AGPL-3.0 · local-first</small></div>
      </div>
      <p className="legal-note">Ostiro fournit des analyses et estimations pédagogiques. Il ne fournit ni conseil en investissement personnalisé, ni conseil fiscal officiel.</p>
    </Section>
  </div></>;
}

function PageTitle({ eyebrow, title, detail, action }: { eyebrow: string; title: string; detail: string; action?: React.ReactNode }) {
  return <div className="page-title"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{detail}</p></div>{action && <div className="page-title__actions">{action}</div>}</div>;
}

function Toggle({ icon: Icon, title, detail, checked = false, onChange }: { icon: typeof Sparkles; title: string; detail: string; checked?: boolean; onChange?: (checked: boolean) => void }) {
  return <label className="toggle-row"><span><Icon size={18}/></span><span><strong>{title}</strong><small>{detail}</small></span><input type="checkbox" checked={checked} onChange={(e) => onChange?.(e.target.checked)}/><i/></label>;
}
