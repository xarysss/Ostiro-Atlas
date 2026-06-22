import React, { useState } from "react";
import {
  TrendingUp, BarChart3, PieChart, ShieldAlert, Sparkles, HelpCircle,
  PiggyBank, ArrowDown, ArrowUp, Calendar, Trash, RefreshCw, Landmark,
  Percent, DollarSign, Wallet, ShieldCheck, ChevronRight, CheckCircle2,
  LockKeyhole, AlertTriangle, Watch, Gem, ArrowRight
} from "lucide-react";
import type { PortfolioData, Account, Position, Transaction } from "./data-store";
import type { LocalProfile } from "./profile-types";
import { euro, euroPrecise, Section } from "./components";

interface PageProps {
  data: PortfolioData;
}

interface AnalysisPageProps {
  data: PortfolioData;
  navigate: (page: string) => void;
  isPrivate: boolean;
  profile: LocalProfile;
}

export function AnalysisPage({ data, navigate, isPrivate, profile }: AnalysisPageProps) {
  // Compute basic stats
  const totalAssets = data.accounts.filter(a => a.value > 0).reduce((acc, a) => acc + a.value, 0);
  const totalLiabilities = Math.abs(data.accounts.filter(a => a.value < 0).reduce((acc, a) => acc + a.value, 0));
  const netWealth = totalAssets - totalLiabilities;

  // Masking helper
  const mask = (value: number) => {
    if (isPrivate) return "•••••• €";
    return euro(value);
  };

  // 1. Frais card calculations
  const totalPositionsVal = data.positions.reduce((acc, p) => acc + p.value, 0);
  const estimatedAnnualFees = totalPositionsVal * 0.0018; // 0.18% avg

  // 2. Dividendes card calculations
  const projectedDividends = totalAssets * 0.038; // 3.8% avg yield

  // 3. Diversification sectorielle
  const categoriesPresent = new Set(data.accounts.filter(a => a.value > 0).map(a => a.kind));
  const catCount = categoriesPresent.size;
  const sectorScore = catCount >= 4 ? 9 : catCount >= 2 ? 6 : 2;
  const sectorLabel = sectorScore >= 8 ? "Excellente" : sectorScore >= 5 ? "Moyenne" : "Insuffisante";
  const sectorColor = sectorScore >= 8 ? "#13C79B" : sectorScore >= 5 ? "#E8C08C" : "#E08894";

  // 4. Diversification géographique
  const geoScore = data.positions.some(p => p.symbol.endsWith("US") || p.symbol === "CW8" || p.symbol === "QDVE") ? 4 : 1;
  const geoLabel = geoScore >= 5 ? "Optimale" : "Insuffisante";
  const geoColor = geoScore >= 5 ? "#13C79B" : "#E08894";

  // 5. Simulateur de patrimoine state & calculations
  const [monthlySavings, setMonthlySavings] = useState<string>("250");
  const [periodYears, setPeriodYears] = useState<number>(30);

  const savingsNum = parseFloat(monthlySavings) || 0;
  const startCapital = Math.max(netWealth, 0);

  // Projection values: Pessimistic (3%), Realistic (6.5%), Optimistic (10%)
  const calculateProjection = (rate: number) => {
    let current = startCapital;
    const monthlyRate = rate / 12;
    const months = periodYears * 12;
    const points: { x: number; y: number }[] = [];

    // Store starting point
    points.push({ x: 0, y: current });

    for (let m = 1; m <= months; m++) {
      current = current * (1 + monthlyRate) + savingsNum;

      if (m % 12 === 0) {
        points.push({ x: m / 12, y: current });
      }
    }
    return { finalValue: current, points };
  };

  const projPess = calculateProjection(0.03);
  const projReal = calculateProjection(0.065); // 6.5% realistic
  const projOpt = calculateProjection(0.10); // 10% optimistic

  // Total contribution vs plus-values
  const totalContribution = startCapital + (savingsNum * 12 * periodYears);
  const plusValues = Math.max(projReal.finalValue - totalContribution, 0);
  const plusValuePercent = projReal.finalValue > 0 ? Math.round((plusValues / projReal.finalValue) * 100) : 0;

  // Build SVG path strings
  const maxY = projOpt.finalValue * 1.05 || 1000;
  const minY = Math.min(startCapital * 0.9, 0);
  const svgWidth = 560;
  const svgHeight = 180;

  const getSvgCoordinates = (points: { x: number; y: number }[]) => {
    return points.map(p => {
      const xCoord = (p.x / periodYears) * (svgWidth - 60) + 40;
      const yCoord = svgHeight - 20 - ((p.y - minY) / (maxY - minY)) * (svgHeight - 40);
      return `${xCoord.toFixed(1)},${yCoord.toFixed(1)}`;
    });
  };

  const pathPess = `M ${getSvgCoordinates(projPess.points).join(" L ")}`;
  const pathReal = `M ${getSvgCoordinates(projReal.points).join(" L ")}`;
  const pathOpt = `M ${getSvgCoordinates(projOpt.points).join(" L ")}`;

  // Grid lines
  const gridLines = [];
  const stepYears = periodYears === 30 ? 5 : periodYears === 20 ? 4 : 2;
  const currentYear = new Date().getFullYear();
  for (let y = 0; y <= periodYears; y += stepYears) {
    const xPos = (y / periodYears) * (svgWidth - 60) + 40;
    gridLines.push({
      x: xPos,
      label: String(currentYear + y)
    });
  }

  return (
    <div className="analysis-page" style={{ paddingBottom: "60px" }}>
      <div className="page-title">
        <div>
          <span className="eyebrow">Analyses privées</span>
          <h1>Découvrez vos analyses, {profile.name}</h1>
          <p>Visualisez la répartition de votre portefeuille, optimisez vos frais et simulez vos projections de richesse.</p>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="analysis-grid">
        {/* FRAIS CARD */}
        <div className="analysis-card" onClick={() => navigate("fees")}>
          <div className="analysis-card__left">
            <div>
              <div className="analysis-card__header">Frais</div>
              <div className="analysis-card__value-row">
                <span className="analysis-card__value">0,18 %</span>
                <span className="analysis-card__badge positive">Optimisé</span>
              </div>
            </div>
            <div className="analysis-card__desc">
              Vos frais de gestion sont extrêmement bas. Économies potentielles estimées : <strong style={{ color: "#FCFCFC" }}>{mask(estimatedAnnualFees)}/an</strong>.
            </div>
          </div>
          <div className="analysis-card__right">
            <svg className="analysis-sparkline-svg" viewBox="0 0 90 45">
              <path d="M 5,40 Q 25,38 45,30 T 85,10" />
            </svg>
          </div>
        </div>

        {/* DIVIDENDES CARD */}
        <div className="analysis-card" onClick={() => navigate("dividends")}>
          <div className="analysis-card__left">
            <div>
              <div className="analysis-card__header">Dividendes</div>
              <div className="analysis-card__value-row">
                <span className="analysis-card__value">
                  {isPrivate ? "••••••" : "3,8 %"}
                </span>
                <span className="analysis-card__badge neutral">Rendement</span>
              </div>
            </div>
            <div className="analysis-card__desc">
              Dividendes projetés sur les 12 prochains mois : <strong style={{ color: "#FCFCFC" }}>{mask(projectedDividends)}</strong>.
            </div>
          </div>
          <div className="analysis-card__right">
            <svg className="analysis-bar-svg" viewBox="0 0 90 45">
              <rect x="5" y="30" width="8" height="15" fill="rgba(232, 192, 140, 0.4)"/>
              <rect x="18" y="25" width="8" height="20" fill="rgba(232, 192, 140, 0.4)"/>
              <rect x="31" y="28" width="8" height="17" fill="rgba(232, 192, 140, 0.4)"/>
              <rect x="44" y="20" width="8" height="25" fill="rgba(232, 192, 140, 0.4)"/>
              <rect x="57" y="15" width="8" height="30" fill="rgba(232, 192, 140, 0.4)"/>
              <rect x="70" y="8" width="8" height="37" fill="rgba(232, 192, 140, 0.4)"/>
            </svg>
          </div>
        </div>

        {/* DIVERSIFICATION SECTORIELLE CARD */}
        <div className="analysis-card" style={{ cursor: "default" }}>
          <div className="analysis-card__left">
            <div>
              <div className="analysis-card__header">Diversification sectorielle</div>
              <div className="analysis-card__value-row">
                <span className="analysis-card__value">{sectorLabel}</span>
                <span className="analysis-card__badge" style={{ background: `${sectorColor}20`, color: sectorColor }}>
                  {sectorScore}/10
                </span>
              </div>
            </div>
            <div className="analysis-card__desc">
              Votre patrimoine est réparti sur {catCount} classe(s) d'actifs. Une répartition équilibrée réduit votre exposition sectorielle.
            </div>
          </div>
          <div className="analysis-card__right">
            <div className="progress-ring-wrapper">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle className="progress-ring-bg" cx="30" cy="30" r="25" />
                <circle
                  className="progress-ring-bar"
                  cx="30"
                  cy="30"
                  r="25"
                  stroke={sectorColor}
                  strokeDasharray={`${2 * Math.PI * 25}`}
                  strokeDashoffset={`${2 * Math.PI * 25 * (1 - sectorScore / 10)}`}
                />
              </svg>
              <span className="progress-ring-text">{sectorScore * 10}%</span>
            </div>
          </div>
        </div>

        {/* DIVERSIFICATION GEOGRAPHIQUE CARD */}
        <div className="analysis-card" style={{ cursor: "default" }}>
          <div className="analysis-card__left">
            <div>
              <div className="analysis-card__header">Diversification géographique</div>
              <div className="analysis-card__value-row">
                <span className="analysis-card__value">{geoLabel}</span>
                <span className="analysis-card__badge" style={{ background: `${geoColor}20`, color: geoColor }}>
                  {geoScore}/10
                </span>
              </div>
            </div>
            <div className="analysis-card__desc">
              Votre patrimoine est presque entièrement investi dans la zone Euro. Cela vous expose aux risques spécifiques régionaux.
            </div>
          </div>
          <div className="analysis-card__right">
            <div className="progress-ring-wrapper">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle className="progress-ring-bg" cx="30" cy="30" r="25" />
                <circle
                  className="progress-ring-bar"
                  cx="30"
                  cy="30"
                  r="25"
                  stroke={geoColor}
                  strokeDasharray={`${2 * Math.PI * 25}`}
                  strokeDashoffset={`${2 * Math.PI * 25 * (1 - geoScore / 10)}`}
                />
              </svg>
              <span className="progress-ring-text">{geoScore * 10}%</span>
            </div>
          </div>
        </div>

        {/* RAPPORT MENSUEL CARD */}
        <div className="analysis-card" style={{ gridColumn: "span 2", padding: "28px" }} onClick={() => navigate("exports")}>
          <div className="analysis-card__left" style={{ minHeight: "80px" }}>
            <div>
              <div className="analysis-card__header" style={{ color: "var(--gold, #E8C08C)" }}>Rapport Mensuel</div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#FCFCFC", marginTop: "4px" }}>Votre rapport de synthèse local est prêt !</h3>
            </div>
            <p style={{ fontSize: "12px", color: "var(--muted-2)", marginTop: "8px" }}>
              Découvrez l'évolution de vos performances, vos gains nets réels et téléchargez un PDF chiffré de votre patrimoine local.
            </p>
          </div>
          <div className="analysis-card__right" style={{ width: "120px" }}>
            <div className="glass-perspective-mockup">
              <span style={{ fontSize: "9px", fontWeight: "700", color: "rgba(255,255,255,0.4)" }}>PDF REPORT</span>
              <div style={{ width: "100%", height: "2px", background: "rgba(255,255,255,0.2)", margin: "4px 0" }} />
              <svg viewBox="0 0 60 20" style={{ width: "100%", height: "20px", overflow: "visible" }}>
                <path d="M 0,15 Q 15,10 30,12 T 60,2" fill="none" stroke="var(--gold, #E8C08C)" strokeWidth="2" />
              </svg>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                <span style={{ fontSize: "8px", color: "var(--green)" }}>+5.4%</span>
                <ArrowRight size={10} style={{ color: "var(--gold, #E8C08C)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compound Interest Simulator */}
      <div className="simulator-card">
        <header className="simulator-card__header">
          <h2>Simulateur de patrimoine futur</h2>
          <p>Projetez la croissance de vos investissements en cumulant vos versements réguliers et vos intérêts composés.</p>
        </header>

        <div className="simulator-layout">
          {/* Simulator Chart & Stats */}
          <div className="simulator-left">
            <div className="simulator-projection-value">
              <span>Mon patrimoine futur ({periodYears} ans)</span>
              <h3>{mask(projReal.finalValue)}</h3>
            </div>

            <div className="simulator-chart-container">
              <svg className="simulator-chart-svg" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                {/* Horizontal grid helper lines */}
                <line x1="40" y1="20" x2={svgWidth - 20} y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="40" y1="80" x2={svgWidth - 20} y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="40" y1="140" x2={svgWidth - 20} y2="140" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3,3" />

                {/* Vertical year grid lines */}
                {gridLines.map(g => (
                  <g key={g.label}>
                    <line x1={g.x} y1="10" x2={g.x} y2={svgHeight - 20} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <text x={g.x} y={svgHeight - 4} textAnchor="middle" fill="var(--muted-2)" fontSize="10">{g.label}</text>
                  </g>
                ))}

                {/* Projection curves */}
                <path className="pessimistic" d={pathPess} strokeDasharray="4,4" />
                <path className="optimistic" d={pathOpt} strokeDasharray="4,4" />
                <path className="realistic" d={pathReal} />
              </svg>
            </div>

            <div className="simulator-stats-grid">
              <div className="sim-stat-box">
                <span>Contribution totale</span>
                <strong>{mask(totalContribution)}</strong>
              </div>
              <div className="sim-stat-box">
                <span>Plus-values générées</span>
                <strong style={{ color: "var(--gold, #E8C08C)" }}>{mask(plusValues)}</strong>
              </div>
              <div className="sim-stat-box">
                <span>Part des gains (%)</span>
                <strong>{isPrivate ? "••••••" : `${plusValuePercent} %`}</strong>
              </div>
              <div className="sim-stat-box">
                <span>Rendement simulé</span>
                <strong style={{ color: "#13C79B" }}>6,5 % / an</strong>
              </div>
            </div>
          </div>

          {/* Simulator Inputs Sidebar */}
          <div className="simulator-right">
            <div className="simulator-control-group">
              <label>Épargne mensuelle</label>
              <div className="simulator-control-input-wrapper">
                <input
                  type="number"
                  value={monthlySavings}
                  onChange={e => setMonthlySavings(e.target.value)}
                  min="0"
                  step="50"
                  style={{ background: "transparent", border: "none", outline: "none", fontSize: "24px", fontWeight: "700", color: "#FCFCFC", width: "100%" }}
                />
                <span>EUR</span>
              </div>
            </div>

            <div className="simulator-control-group">
              <label>Horizon de placement</label>
              <div className="pills-container">
                <button
                  type="button"
                  className={`pill-btn ${periodYears === 10 ? "pill-btn--active" : ""}`}
                  onClick={() => setPeriodYears(10)}
                >
                  10 ans
                </button>
                <button
                  type="button"
                  className={`pill-btn ${periodYears === 20 ? "pill-btn--active" : ""}`}
                  onClick={() => setPeriodYears(20)}
                >
                  20 ans
                </button>
                <button
                  type="button"
                  className={`pill-btn ${periodYears === 30 ? "pill-btn--active" : ""}`}
                  onClick={() => setPeriodYears(30)}
                >
                  30 ans
                </button>
              </div>
            </div>

            <button type="button" className="sim-link-button" onClick={() => navigate("budget")}>
              <span>Comprendre ma capacité d'épargne</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BudgetPage({ data, isPrivate, navigate }: { data: PortfolioData; isPrivate?: boolean; navigate?: (page: string) => void }) {
  const [activeTab, setActiveTab] = useState<"revenus" | "depenses" | "rest">("rest");

  const transactions = data.transactions || [];
  const monthlyRevenues = Math.abs(transactions.filter(t => t.amount > 0 && t.type !== "Transfert").reduce((acc, t) => acc + t.amount, 0)) || 4200;
  const monthlyExpenses = Math.abs(transactions.filter(t => t.amount < 0 && t.type !== "Transfert").reduce((acc, t) => acc + t.amount, 0)) || 2850;

  const cashflow = monthlyRevenues - monthlyExpenses;
  const savingsRate = monthlyRevenues > 0 ? Math.round((cashflow / monthlyRevenues) * 100) : 0;

  const mask = (value: number) => {
    if (isPrivate) return "•••••• €";
    return euro(value);
  };

  // Categories distribution
  const categories = [
    { name: "Logement & Crédits", spent: monthlyExpenses * 0.45, limit: 1200, color: "#ef6d7a", pct: 45 },
    { name: "Alimentation", spent: monthlyExpenses * 0.25, limit: 500, color: "#f4c66b", pct: 25 },
    { name: "Transports", spent: monthlyExpenses * 0.15, limit: 300, color: "#6aa9ff", pct: 15 },
    { name: "Loisirs & Sorties", spent: monthlyExpenses * 0.15, limit: 400, color: "#8f85ff", pct: 15 }
  ];

  // For the SVG Donut
  const r = 70;
  const circumference = 2 * Math.PI * r; // ~439.82
  let accumulatedPercent = 0;

  // Filtered transactions for the list
  const filteredTransactions = transactions.filter(t => {
    if (activeTab === "revenus") return t.amount > 0 && t.type !== "Transfert";
    if (activeTab === "depenses") return t.amount < 0 && t.type !== "Transfert";
    return true;
  });

  return (
    <div className="budget-page">
      <div className="page-title">
        <div>
          <span className="eyebrow">Flux Financiers</span>
          <h1>Suivi du Budget</h1>
          <p>Analysez vos revenus, vos charges récurrentes et votre capacité d'épargne.</p>
        </div>
      </div>

      {/* Tabs strip */}
      <div className="budget-tabs-strip">
        <button
          className={`budget-tab-item ${activeTab === "revenus" ? "budget-tab-item--active" : ""}`}
          onClick={() => setActiveTab("revenus")}
        >
          <span>Revenus</span>
          <strong className="positive">+{mask(monthlyRevenues)}</strong>
        </button>
        <button
          className={`budget-tab-item ${activeTab === "depenses" ? "budget-tab-item--active" : ""}`}
          onClick={() => setActiveTab("depenses")}
        >
          <span>Dépenses</span>
          <strong className="negative">-{mask(monthlyExpenses)}</strong>
        </button>
        <button
          className={`budget-tab-item ${activeTab === "rest" ? "budget-tab-item--active" : ""}`}
          onClick={() => setActiveTab("rest")}
        >
          <span>Reste à vivre</span>
          <strong className={cashflow >= 0 ? "positive" : "negative"}>
            {cashflow >= 0 ? "+" : ""}{mask(cashflow)}
          </strong>
        </button>
      </div>

      <div className="budget-dashboard">
        <div className="cashflow-card">
          <div className="cashflow-header">
            <h3>Diagramme des Flux</h3>
            <span style={{ fontSize: "10px", color: "var(--muted)" }}>Taux d'épargne : <strong>{savingsRate}%</strong></span>
          </div>

          <div className="cashflow-sankey-container">
            <svg viewBox="0 0 800 320" className="cashflow-sankey-svg">
              <defs>
                <linearGradient id="grad-rev" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#13C79B" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#E8C08C" stopOpacity="0.25" />
                </linearGradient>
                <linearGradient id="grad-exp" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#E8C08C" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ef6d7a" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="grad-sav" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#E8C08C" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#13C79B" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {/* Inflow paths */}
              <path d="M 170 80 C 270 80, 270 160, 370 160" className="sankey-path" stroke="url(#grad-rev)" strokeWidth={Math.max(3, (monthlyRevenues * 0.85 / monthlyRevenues) * 35)} />
              <path d="M 170 160 C 270 160, 270 160, 370 160" className="sankey-path" stroke="url(#grad-rev)" strokeWidth={Math.max(3, (monthlyRevenues * 0.10 / monthlyRevenues) * 35)} />
              <path d="M 170 240 C 270 240, 270 160, 370 160" className="sankey-path" stroke="url(#grad-rev)" strokeWidth={Math.max(3, (monthlyRevenues * 0.05 / monthlyRevenues) * 35)} />

              {/* Outflow paths */}
              <path d="M 430 160 C 530 160, 530 80, 630 80" className="sankey-path" stroke="url(#grad-exp)" strokeWidth={Math.max(3, (monthlyExpenses * 0.55 / monthlyRevenues) * 35)} />
              <path d="M 430 160 C 530 160, 530 160, 630 160" className="sankey-path" stroke="url(#grad-exp)" strokeWidth={Math.max(3, (monthlyExpenses * 0.45 / monthlyRevenues) * 35)} />
              {cashflow > 0 && (
                <path d="M 430 160 C 530 160, 530 240, 630 240" className="sankey-path" stroke="url(#grad-sav)" strokeWidth={Math.max(3, (cashflow / monthlyRevenues) * 35)} />
              )}

              {/* Bridges (golden highlights) */}
              <line x1="370" y1="160" x2="430" y2="160" className="sankey-bridge" />

              {/* Left Nodes */}
              <g transform="translate(10, 50)">
                <rect width="160" height="60" className="sankey-node" />
                <text x="15" y="25" className="sankey-node-text">Salaire & Activités</text>
                <text x="15" y="45" className="sankey-node-value">{mask(monthlyRevenues * 0.85)}</text>
              </g>
              <g transform="translate(10, 130)">
                <rect width="160" height="60" className="sankey-node" />
                <text x="15" y="25" className="sankey-node-text">Dividendes & Intérêts</text>
                <text x="15" y="45" className="sankey-node-value">{mask(monthlyRevenues * 0.10)}</text>
              </g>
              <g transform="translate(10, 210)">
                <rect width="160" height="60" className="sankey-node" />
                <text x="15" y="25" className="sankey-node-text">Autres rentrées</text>
                <text x="15" y="45" className="sankey-node-value">{mask(monthlyRevenues * 0.05)}</text>
              </g>

              {/* Middle Hub */}
              <g transform="translate(350, 130)">
                <rect width="100" height="60" className="sankey-node" style={{ fill: "rgba(232, 192, 140, 0.15)", stroke: "var(--gold)" }} />
                <text x="15" y="25" className="sankey-node-text" style={{ fill: "var(--gold)" }}>Flux Total</text>
                <text x="15" y="45" className="sankey-node-value" style={{ fontWeight: "700", fill: "#fff" }}>{mask(monthlyRevenues)}</text>
              </g>

              {/* Right Nodes */}
              <g transform="translate(630, 50)">
                <rect width="160" height="60" className="sankey-node" />
                <text x="15" y="25" className="sankey-node-text" style={{ fill: "#ef6d7a" }}>Charges Fixes</text>
                <text x="15" y="45" className="sankey-node-value">{mask(monthlyExpenses * 0.55)}</text>
              </g>
              <g transform="translate(630, 130)">
                <rect width="160" height="60" className="sankey-node" />
                <text x="15" y="25" className="sankey-node-text" style={{ fill: "#f4c66b" }}>Dépenses Variables</text>
                <text x="15" y="45" className="sankey-node-value">{mask(monthlyExpenses * 0.45)}</text>
              </g>
              <g transform="translate(630, 210)">
                <rect width="160" height="60" className="sankey-node" style={{ fill: cashflow > 0 ? "rgba(19, 199, 155, 0.1)" : "rgba(255,255,255,0.03)" }} />
                <text x="15" y="25" className="sankey-node-text" style={{ fill: "var(--green)" }}>Épargne & Placements</text>
                <text x="15" y="45" className="sankey-node-value">{mask(Math.max(cashflow, 0))}</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Distribution / Donut panel on the right */}
        <div className="distribution-panel">
          <h3>Dépenses par catégorie</h3>

          <div className="distribution-donut-wrapper">
            <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: "rotate(-90deg)", overflow: "visible" }}>
              {/* Background circle */}
              <circle cx="90" cy="90" r="70" fill="transparent" stroke="rgba(255,255,255,0.04)" strokeWidth="12" />

              {/* Segments */}
              {categories.map((cat, index) => {
                const dashArray = `${(cat.pct / 100) * circumference} ${circumference}`;
                const dashOffset = -((accumulatedPercent / 100) * circumference);
                accumulatedPercent += cat.pct;
                return (
                  <circle
                    key={cat.name}
                    cx="90"
                    cy="90"
                    r="70"
                    fill="transparent"
                    stroke={cat.color}
                    strokeWidth="12"
                    strokeDasharray={dashArray}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.5s ease" }}
                  />
                );
              })}
            </svg>
            <div className="dist-donut-center">
              <span>Total Dépenses</span>
              <strong>{mask(monthlyExpenses)}</strong>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {categories.map(cat => (
              <div key={cat.name} style={{ fontSize: "11px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span>
                    <span style={{ color: cat.color, marginRight: "6px" }}>●</span>
                    {cat.name} ({cat.pct}%)
                  </span>
                  <strong>{mask(cat.spent)}</strong>
                </div>
                <div className="progress-bar" style={{ height: "4px", background: "rgba(255,255,255,0.04)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${cat.pct}%`,
                    background: cat.color
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions list */}
      <div className="panel" style={{ marginTop: "24px", padding: "24px", textAlign: "left" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>
          Transactions de la période
        </h3>
        {filteredTransactions.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: "11px" }}>Aucune transaction trouvée pour ce filtre.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {filteredTransactions.slice(0, 15).map(t => (
              <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "8px", fontSize: "11px" }}>
                <div>
                  <strong style={{ display: "block" }}>{t.label}</strong>
                  <span style={{ color: "var(--muted)", fontSize: "9px" }}>{t.date} · {t.account}</span>
                </div>
                <strong className={t.amount >= 0 ? "positive" : "negative"}>
                  {t.amount >= 0 ? "+" : ""}{mask(t.amount)}
                </strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ToolsPage({ defaultTab }: { defaultTab?: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab || "patrimoine");

  React.useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  // State values for various calculators
  const [initialCapital, setInitialCapital] = useState("10000");
  const [monthlyContribution, setMonthlyContribution] = useState("300");
  const [interestRate, setInterestRate] = useState("5");
  const [years, setYears] = useState("15");

  // Output calculations
  const calculateCompoundInterest = () => {
    const P = parseFloat(initialCapital) || 0;
    const PMT = parseFloat(monthlyContribution) || 0;
    const r = (parseFloat(interestRate) || 0) / 100 / 12;
    const n = 12;
    const t = parseFloat(years) || 0;
    const months = t * 12;

    let total = P;
    let totalInvested = P;

    for (let i = 0; i < months; i++) {
      total = total * (1 + r) + PMT;
      totalInvested += PMT;
    }

    const interest = total - totalInvested;
    return {
      final: Math.round(total),
      invested: Math.round(totalInvested),
      interest: Math.round(interest)
    };
  };

  const compoundResult = calculateCompoundInterest();

  // Rendement annuel calculator state
  const [initialCapitalYield, setInitialCapitalYield] = useState("10000");
  const [finalCapitalYield, setFinalCapitalYield] = useState("15000");
  const [yearsYield, setYearsYield] = useState("5");

  const calculateAnnualYield = () => {
    const start = parseFloat(initialCapitalYield) || 0;
    const end = parseFloat(finalCapitalYield) || 0;
    const t = parseFloat(yearsYield) || 1;
    if (start <= 0 || end <= 0) return 0;
    const yieldRate = (Math.pow(end / start, 1 / t) - 1) * 100;
    return yieldRate.toFixed(2);
  };

  // Effort d'épargne calculator state
  const [targetGoal, setTargetGoal] = useState("50000");
  const [yearsGoal, setYearsGoal] = useState("10");
  const [rateGoal, setRateGoal] = useState("4");

  const calculateMonthlySavingEffort = () => {
    const target = parseFloat(targetGoal) || 0;
    const t = parseFloat(yearsGoal) || 1;
    const r = (parseFloat(rateGoal) || 0) / 100 / 12;
    const months = t * 12;

    if (r === 0) return Math.round(target / months);

    // Formula: PMT = FV / (((1 + r)^n - 1) / r)
    const effort = target / ((Math.pow(1 + r, months) - 1) / r);
    return Math.round(effort);
  };

  // Rule of 4% (Indépendance financière)
  const [annualExpenses, setAnnualExpenses] = useState("24000");
  const calculateFireCapital = () => {
    const expenses = parseFloat(annualExpenses) || 0;
    return expenses * 25; // 25 times annual expenses (4% safe withdrawal rate)
  };

  // Dividendes annuels
  const [divCapital, setDivCapital] = useState("50000");
  const [divYield, setDivYield] = useState("4");
  const calculateDividends = () => {
    const cap = parseFloat(divCapital) || 0;
    const y = parseFloat(divYield) || 0;
    return Math.round((cap * y) / 100);
  };

  // Impact des frais
  const [feeCapital, setFeeCapital] = useState("10000");
  const [feeYears, setFeeYears] = useState("20");
  const [feeRate, setFeeRate] = useState("0.5"); // explicit fee
  const [marketReturn, setMarketReturn] = useState("6");

  const calculateFeeImpact = () => {
    const cap = parseFloat(feeCapital) || 0;
    const yrs = parseFloat(feeYears) || 0;
    const returnRate = (parseFloat(marketReturn) || 0) / 100;
    const explicitFeeRate = (parseFloat(feeRate) || 0) / 100;

    const finalWithoutFees = cap * Math.pow(1 + returnRate, yrs);
    const finalWithFees = cap * Math.pow(1 + (returnRate - explicitFeeRate), yrs);
    const loss = finalWithoutFees - finalWithFees;

    return {
      without: Math.round(finalWithoutFees),
      with: Math.round(finalWithFees),
      loss: Math.round(loss)
    };
  };

  const feeResult = calculateFeeImpact();

  // Crédit Immobilier
  const [loanAmount, setLoanAmount] = useState("200000");
  const [loanInterestRate, setLoanInterestRate] = useState("3.5");
  const [loanDurationYears, setLoanDurationYears] = useState("20");

  const calculateLoanDetails = () => {
    const P = parseFloat(loanAmount) || 0;
    const r = (parseFloat(loanInterestRate) || 0) / 100 / 12;
    const n = (parseFloat(loanDurationYears) || 0) * 12;

    if (r === 0) return { payment: P / n, cost: 0, totalPayed: P };

    // Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const payment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalCost = (payment * n) - P;

    return {
      payment: Math.round(payment),
      cost: Math.round(totalCost),
      totalPayed: Math.round(payment * n)
    };
  };

  const loanResult = calculateLoanDetails();

  // Target Allocation Suggestion
  const [targetAllocStyle, setTargetAllocStyle] = useState("equilibre");
  const getTargetAllocation = () => {
    if (targetAllocStyle === "prudent") {
      return [
        { label: "Obligations & Fonds Euros", pct: 60, color: "#6aa9ff" },
        { label: "Actions & ETF", pct: 20, color: "#8f85ff" },
        { label: "Immobilier", pct: 10, color: "#f4c66b" },
        { label: "Monétaire / Cash", pct: 10, color: "#c5a8ff" }
      ];
    } else if (targetAllocStyle === "dynamique") {
      return [
        { label: "Actions & ETF", pct: 65, color: "#8f85ff" },
        { label: "Obligations & PER", pct: 15, color: "#6aa9ff" },
        { label: "Immobilier", pct: 10, color: "#f4c66b" },
        { label: "Crypto / Métaux", pct: 10, color: "#ff8e72" }
      ];
    } else {
      // Equilibre
      return [
        { label: "Actions & ETF", pct: 45, color: "#8f85ff" },
        { label: "Obligations & Fonds Euros", pct: 30, color: "#6aa9ff" },
        { label: "Immobilier", pct: 15, color: "#f4c66b" },
        { label: "Crypto / Métaux / Cash", pct: 10, color: "#ff8e72" }
      ];
    }
  };

  const targetAlloc = getTargetAllocation();

  return (
    <div className="tools-page">
      <div className="page-title">
        <div>
          <span className="eyebrow">Simulateurs locaux</span>
          <h1>Outils Financiers</h1>
          <p>Projetez vos placements et analysez l'impact de vos choix financiers en local.</p>
        </div>
      </div>

      <div className="tools-tabs-row" style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "12px", borderBottom: "1px solid var(--line-soft)", marginBottom: "20px" }}>
        {[
          { id: "patrimoine", label: "Intérêts composés" },
          { id: "rendement", label: "Rendement annuel / TRI" },
          { id: "effort", label: "Effort d'épargne" },
          { id: "independance", label: "Indépendance financière" },
          { id: "dividendes", label: "Dividendes annuels" },
          { id: "frais", label: "Impact des frais" },
          { id: "credit", label: "Crédit immobilier" },
          { id: "allocation", label: "Allocation cible" }
        ].map(tab => (
          <button
            key={tab.id}
            className={`secondary-button ${activeTab === tab.id ? "active-tool-btn" : ""}`}
            style={{
              borderRadius: "20px",
              padding: "6px 14px",
              whiteSpace: "nowrap",
              fontSize: "10px",
              background: activeTab === tab.id ? "var(--green)" : "rgba(255,255,255,0.03)",
              color: activeTab === tab.id ? "#000" : "var(--text)"
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tool-content panel" style={{ padding: "24px" }}>
        {activeTab === "patrimoine" && (
          <div className="tool-form-layout">
            <div>
              <h3>Simulateur d'intérêts composés</h3>
              <p style={{ color: "var(--muted)", fontSize: "11px", marginBottom: "20px" }}>
                Calculez la croissance future de vos versements mensuels cumulée avec les rendements d'intérêts.
              </p>

              <div className="form-grid">
                <label className="field">
                  <span>Capital initial (€)</span>
                  <input type="number" value={initialCapital} onChange={e => setInitialCapital(e.target.value)} />
                </label>
                <label className="field">
                  <span>Versement mensuel (€)</span>
                  <input type="number" value={monthlyContribution} onChange={e => setMonthlyContribution(e.target.value)} />
                </label>
                <label className="field">
                  <span>Rendement annuel estimé (%)</span>
                  <input type="number" step="0.1" value={interestRate} onChange={e => setInterestRate(e.target.value)} />
                </label>
                <label className="field">
                  <span>Durée de placement (années)</span>
                  <input type="number" value={years} onChange={e => setYears(e.target.value)} />
                </label>
              </div>
            </div>

            <div className="tool-result-panel" style={{ background: "rgba(143,133,255,0.05)", border: "1px dashed rgba(143,133,255,0.3)", borderRadius: "8px", padding: "20px", marginTop: "20px" }}>
              <h4>Projection finale</h4>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--green)", margin: "10px 0" }}>
                {euro(compoundResult.final)}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "11px", color: "var(--muted)" }}>
                <div>Total des versements : <strong>{euro(compoundResult.invested)}</strong></div>
                <div>Intérêts accumulés : <strong>{euro(compoundResult.interest)}</strong></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "rendement" && (
          <div className="tool-form-layout">
            <div>
              <h3>Rendement annuelisé (TRI)</h3>
              <p style={{ color: "var(--muted)", fontSize: "11px", marginBottom: "20px" }}>
                Calculez le taux de rendement annuel moyen d'un investissement sur une durée donnée.
              </p>

              <div className="form-grid">
                <label className="field">
                  <span>Capital de départ (€)</span>
                  <input type="number" value={initialCapitalYield} onChange={e => setInitialCapitalYield(e.target.value)} />
                </label>
                <label className="field">
                  <span>Capital final (€)</span>
                  <input type="number" value={finalCapitalYield} onChange={e => setFinalCapitalYield(e.target.value)} />
                </label>
                <label className="field">
                  <span>Durée (années)</span>
                  <input type="number" value={yearsYield} onChange={e => setYearsYield(e.target.value)} />
                </label>
              </div>
            </div>

            <div className="tool-result-panel" style={{ background: "rgba(143,133,255,0.05)", border: "1px dashed rgba(143,133,255,0.3)", borderRadius: "8px", padding: "20px", marginTop: "20px" }}>
              <h4>Rendement annuelisé moyen (CAGR)</h4>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--green)", margin: "10px 0" }}>
                + {calculateAnnualYield()} % / an
              </div>
            </div>
          </div>
        )}

        {activeTab === "effort" && (
          <div className="tool-form-layout">
            <div>
              <h3>Effort d'épargne mensuel</h3>
              <p style={{ color: "var(--muted)", fontSize: "11px", marginBottom: "20px" }}>
                Déterminez le montant à épargner chaque mois pour atteindre votre objectif financier.
              </p>

              <div className="form-grid">
                <label className="field">
                  <span>Objectif à atteindre (€)</span>
                  <input type="number" value={targetGoal} onChange={e => setTargetGoal(e.target.value)} />
                </label>
                <label className="field">
                  <span>Horizon (années)</span>
                  <input type="number" value={yearsGoal} onChange={e => setYearsGoal(e.target.value)} />
                </label>
                <label className="field">
                  <span>Taux de placement espéré (%)</span>
                  <input type="number" value={rateGoal} onChange={e => setRateGoal(e.target.value)} />
                </label>
              </div>
            </div>

            <div className="tool-result-panel" style={{ background: "rgba(143,133,255,0.05)", border: "1px dashed rgba(143,133,255,0.3)", borderRadius: "8px", padding: "20px", marginTop: "20px" }}>
              <h4>Versement mensuel nécessaire</h4>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--green)", margin: "10px 0" }}>
                {euro(calculateMonthlySavingEffort())} / mois
              </div>
            </div>
          </div>
        )}

        {activeTab === "independance" && (
          <div className="tool-form-layout">
            <div>
              <h3>Calculateur d'Indépendance Financière (FIRE)</h3>
              <p style={{ color: "var(--muted)", fontSize: "11px", marginBottom: "20px" }}>
                Calculez le capital requis pour vivre de vos rentes selon la règle de retrait de 4% par an (25 fois vos dépenses annuelles).
              </p>

              <div className="form-grid">
                <label className="field">
                  <span>Dépenses annuelles prévues (€)</span>
                  <input type="number" value={annualExpenses} onChange={e => setAnnualExpenses(e.target.value)} />
                </label>
              </div>
            </div>

            <div className="tool-result-panel" style={{ background: "rgba(143,133,255,0.05)", border: "1px dashed rgba(143,133,255,0.3)", borderRadius: "8px", padding: "20px", marginTop: "20px" }}>
              <h4>Capital cible pour être rentier (FIRE)</h4>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--green)", margin: "10px 0" }}>
                {euro(calculateFireCapital())}
              </div>
              <p style={{ fontSize: "9px", color: "var(--muted)", margin: "0" }}>
                Basé sur la règle de 4% de retrait annuel sans consommer le capital de départ à long terme.
              </p>
            </div>
          </div>
        )}

        {activeTab === "dividendes" && (
          <div className="tool-form-layout">
            <div>
              <h3>Simulateur de Dividendes</h3>
              <p style={{ color: "var(--muted)", fontSize: "11px", marginBottom: "20px" }}>
                Simulez les revenus de dividendes générés par votre portefeuille d'actions de rendement.
              </p>

              <div className="form-grid">
                <label className="field">
                  <span>Capital investi (€)</span>
                  <input type="number" value={divCapital} onChange={e => setDivCapital(e.target.value)} />
                </label>
                <label className="field">
                  <span>Rendement moyen du dividende (%)</span>
                  <input type="number" step="0.1" value={divYield} onChange={e => setDivYield(e.target.value)} />
                </label>
              </div>
            </div>

            <div className="tool-result-panel" style={{ background: "rgba(143,133,255,0.05)", border: "1px dashed rgba(143,133,255,0.3)", borderRadius: "8px", padding: "20px", marginTop: "20px" }}>
              <h4>Rente annuelle brute estimée</h4>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--green)", margin: "10px 0" }}>
                {euro(calculateDividends())} / an
              </div>
              <div style={{ fontSize: "11px", color: "var(--muted)" }}>
                Soit environ <strong>{euro(Math.round(calculateDividends() / 12))}</strong> par mois.
              </div>
            </div>
          </div>
        )}

        {activeTab === "frais" && (
          <div className="tool-form-layout">
            <div>
              <h3>Impact des frais sur 20 ans</h3>
              <p style={{ color: "var(--muted)", fontSize: "11px", marginBottom: "20px" }}>
                Découvrez comment les frais de gestion ou d'assurance (ex: enveloppes de type assurance-vie ou courtiers) grignotent vos rendements à long terme.
              </p>

              <div className="form-grid">
                <label className="field">
                  <span>Capital initial (€)</span>
                  <input type="number" value={feeCapital} onChange={e => setFeeCapital(e.target.value)} />
                </label>
                <label className="field">
                  <span>Durée d'investissement (années)</span>
                  <input type="number" value={feeYears} onChange={e => setFeeYears(e.target.value)} />
                </label>
                <label className="field">
                  <span>Performance annuelle brute (%)</span>
                  <input type="number" value={marketReturn} onChange={e => setMarketReturn(e.target.value)} />
                </label>
                <label className="field">
                  <span>Frais annuels de l'enveloppe/support (%)</span>
                  <input type="number" step="0.1" value={feeRate} onChange={e => setFeeRate(e.target.value)} />
                </label>
              </div>
            </div>

            <div className="tool-result-panel" style={{ background: "rgba(239,124,135,0.05)", border: "1px dashed rgba(239,124,135,0.3)", borderRadius: "8px", padding: "20px", marginTop: "20px" }}>
              <h4 style={{ color: "var(--red)" }}>Manque à gagner dû aux frais</h4>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--red)", margin: "10px 0" }}>
                - {euro(feeResult.loss)}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "11px", color: "var(--muted)" }}>
                <div>Sans frais : <strong>{euro(feeResult.without)}</strong></div>
                <div>Avec frais : <strong>{euro(feeResult.with)}</strong></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "credit" && (
          <div className="tool-form-layout">
            <div>
              <h3>Calculateur de Crédit Immobilier</h3>
              <p style={{ color: "var(--muted)", fontSize: "11px", marginBottom: "20px" }}>
                Simulez la mensualité d'un emprunt immobilier et calculez le coût global des intérêts.
              </p>

              <div className="form-grid">
                <label className="field">
                  <span>Montant emprunté (€)</span>
                  <input type="number" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} />
                </label>
                <label className="field">
                  <span>Taux d'intérêt annuel (%)</span>
                  <input type="number" step="0.05" value={loanInterestRate} onChange={e => setLoanInterestRate(e.target.value)} />
                </label>
                <label className="field">
                  <span>Durée de remboursement (années)</span>
                  <input type="number" value={loanDurationYears} onChange={e => setLoanDurationYears(e.target.value)} />
                </label>
              </div>
            </div>

            <div className="tool-result-panel" style={{ background: "rgba(143,133,255,0.05)", border: "1px dashed rgba(143,133,255,0.3)", borderRadius: "8px", padding: "20px", marginTop: "20px" }}>
              <h4>Mensualité hors assurance</h4>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--green)", margin: "10px 0" }}>
                {euro(loanResult.payment)} / mois
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "11px", color: "var(--muted)" }}>
                <div>Coût des intérêts : <strong>{euro(loanResult.cost)}</strong></div>
                <div>Remboursement total : <strong>{euro(loanResult.totalPayed)}</strong></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "allocation" && (
          <div className="tool-form-layout">
            <div>
              <h3>Allocation cible suggérée</h3>
              <p style={{ color: "var(--muted)", fontSize: "11px", marginBottom: "20px" }}>
                Identifiez l'allocation cible standard selon votre profil de risque.
              </p>

              <div className="field">
                <span>Sélectionner votre profil de risque</span>
                <select value={targetAllocStyle} onChange={e => setTargetAllocStyle(e.target.value)}>
                  <option value="prudent">Prudent (Faible volatilité, rendements stables)</option>
                  <option value="equilibre">Équilibré (Profil modéré, moyen terme)</option>
                  <option value="dynamique">Dynamique (Recherche de performance à long terme)</option>
                </select>
              </div>
            </div>

            <div className="tool-result-panel" style={{ background: "rgba(143,133,255,0.05)", border: "1px dashed rgba(143,133,255,0.3)", borderRadius: "8px", padding: "20px", marginTop: "20px" }}>
              <h4>Répartition recommandée :</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                {targetAlloc.map(item => (
                  <div key={item.label} style={{ fontSize: "11px", display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--line-soft)" }}>
                    <span>
                      <span style={{ color: item.color, marginRight: "8px" }}>●</span>
                      {item.label}
                    </span>
                    <strong>{item.pct} %</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface DeclarationPageProps {
  data: PortfolioData;
  isPrivate: boolean;
  profile: LocalProfile;
  navigate?: (page: string) => void;
}

export function DeclarationPatrimoinePage({ data, isPrivate, profile }: DeclarationPageProps) {
  const [fullName, setFullName] = useState(profile.name || "Jean Dupont");
  const [birthDate, setBirthDate] = useState("15/08/1988");
  const [address, setAddress] = useState("12 Avenue des Champs-Élysées, 75008 Paris");
  const [declarationDate, setDeclarationDate] = useState(new Date().toLocaleDateString("fr-FR"));
  const [hideValuesInPrint, setHideValuesInPrint] = useState(false);

  // Group assets from data
  // Financial Assets: bank accounts, CTO, PEA, crypto, etc.
  const financialAccounts = data.accounts.filter(a =>
    a.value > 0 &&
    (a.kind === "bank_accounts" || a.kind === "pea" || a.kind === "cto" || a.kind === "life_insurance" || a.kind === "crypto" || a.kind === "pee" || a.kind === "per")
  );
  const financialTotal = financialAccounts.reduce((acc, a) => acc + a.value, 0);

  // Real Estate:
  const realEstateAccounts = data.accounts.filter(a => a.value > 0 && (a.kind === "real_estate" || a.kind === "scpi"));
  const realEstateTotal = realEstateAccounts.reduce((acc, a) => acc + a.value, 0);

  // Luxury items & others (watches, metals, gold, etc.)
  const luxuryAccounts = data.accounts.filter(a => a.value > 0 && (a.kind === "metals" || a.kind === "precious_items" || a.kind === "watches" || a.kind === "others"));
  const luxuryTotal = luxuryAccounts.reduce((acc, a) => acc + a.value, 0);

  // Liabilities (loans, debts)
  const liabilityAccounts = data.accounts.filter(a => a.value < 0);
  const liabilityTotal = Math.abs(liabilityAccounts.reduce((acc, a) => acc + a.value, 0));

  const totalAssets = financialTotal + realEstateTotal + luxuryTotal;
  const netWealth = totalAssets - liabilityTotal;

  const handlePrint = () => {
    window.print();
  };

  const maskVal = (val: number, forceShow = false) => {
    if (!forceShow && (isPrivate || (hideValuesInPrint && window.matchMedia("print").matches))) {
      return "•••••• €";
    }
    return val.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
  };

  return (
    <div className="declaration-page" style={{ paddingBottom: "40px" }}>
      <div className="page-title">
        <div>
          <span className="eyebrow">Édition & Impression</span>
          <h1>Déclaration de Patrimoine</h1>
          <p>Générez un relevé officiel imprimable de votre patrimoine à destination de vos tiers de confiance.</p>
        </div>
      </div>

      <div className="declaration-container">
        {/* Settings Column */}
        <div className="declaration-form-side">
          <h3 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "4px" }}>Informations du Déclarant</h3>
          <p style={{ color: "var(--muted)", fontSize: "10px", margin: "0 0 12px 0" }}>
            Ces données sont uniquement traitées en local pour la génération du document.
          </p>

          <label className="field">
            <span>Nom complet</span>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="input-line"
              style={{ background: "transparent", color: "#fff", border: 0, borderBottom: "1px solid var(--line-soft)", width: "100%", padding: "4px 0", fontSize: "11px" }}
            />
          </label>

          <label className="field">
            <span>Date de naissance</span>
            <input
              type="text"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              className="input-line"
              style={{ background: "transparent", color: "#fff", border: 0, borderBottom: "1px solid var(--line-soft)", width: "100%", padding: "4px 0", fontSize: "11px" }}
            />
          </label>

          <label className="field">
            <span>Adresse de résidence</span>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="input-line"
              style={{ background: "transparent", color: "#fff", border: 0, borderBottom: "1px solid var(--line-soft)", width: "100%", padding: "4px 0", fontSize: "11px" }}
            />
          </label>

          <label className="field">
            <span>Date du relevé</span>
            <input
              type="text"
              value={declarationDate}
              onChange={e => setDeclarationDate(e.target.value)}
              className="input-line"
              style={{ background: "transparent", color: "#fff", border: 0, borderBottom: "1px solid var(--line-soft)", width: "100%", padding: "4px 0", fontSize: "11px" }}
            />
          </label>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" }}>
            <input
              type="checkbox"
              id="hideValues"
              checked={hideValuesInPrint}
              onChange={e => setHideValuesInPrint(e.target.checked)}
              style={{ cursor: "pointer" }}
            />
            <label htmlFor="hideValues" style={{ fontSize: "11px", color: "var(--text)", cursor: "pointer" }}>
              Masquer les valeurs chiffrées sur le PDF
            </label>
          </div>

          <button
            className="action-button"
            onClick={handlePrint}
            style={{ width: "100%", marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
          >
            🖨️ Imprimer la déclaration
          </button>
        </div>

        {/* Live sheet preview */}
        <div className="declaration-preview-side">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 10px" }}>
            <span style={{ fontSize: "10px", color: "var(--muted)", textTransform: "uppercase", fontWeight: "600" }}>
              Aperçu du relevé officiel
            </span>
          </div>

          <div className="declaration-sheet">
            <div className="declaration-sheet__header">
              <div className="declaration-sheet__metadata">
                <div><strong>DECLARANT :</strong> {fullName}</div>
                <div><strong>NÉ(E) LE :</strong> {birthDate}</div>
                <div><strong>RESIDENCE :</strong> {address}</div>
              </div>
              <div className="declaration-sheet__title-badge">
                RELEVÉ OFFICIEL
              </div>
            </div>

            <h1>Déclaration de Situation Patrimoniale</h1>

            <div style={{ fontSize: "13px", marginBottom: "20px", color: "#000" }}>
              Je soussigné(e) <strong>{fullName}</strong>, certifie sur l'honneur l'exactitude de la situation patrimoniale consolidée ci-dessous en date du <strong>{declarationDate}</strong>.
            </div>

            {/* Actifs financiers */}
            <div className="declaration-sheet__section-title">1. Actifs financiers & bancaires</div>
            <table>
              <thead>
                <tr>
                  <th>Établissement / Compte</th>
                  <th>Type d'actif</th>
                  <th style={{ textAlign: "right" }}>Solde / Valeur</th>
                </tr>
              </thead>
              <tbody>
                {financialAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ color: "#666", fontStyle: "italic" }}>Aucun compte enregistré</td>
                  </tr>
                ) : (
                  financialAccounts.map(a => (
                    <tr key={a.id}>
                      <td><strong>{a.institution}</strong> · {a.name}</td>
                      <td>{a.kind.toUpperCase()}</td>
                      <td className="amount-cell">{maskVal(a.value)}</td>
                    </tr>
                  ))
                )}
                <tr style={{ fontWeight: "bold", backgroundColor: "#f9f9f9" }}>
                  <td colSpan={2}>Sous-total Actifs Financiers</td>
                  <td className="amount-cell">{maskVal(financialTotal)}</td>
                </tr>
              </tbody>
            </table>

            {/* Actifs immobiliers */}
            <div className="declaration-sheet__section-title">2. Actifs immobiliers & SCPI</div>
            <table>
              <thead>
                <tr>
                  <th>Désignation du bien</th>
                  <th>Type</th>
                  <th style={{ textAlign: "right" }}>Valeur estimée</th>
                </tr>
              </thead>
              <tbody>
                {realEstateAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ color: "#666", fontStyle: "italic" }}>Aucun bien immobilier enregistré</td>
                  </tr>
                ) : (
                  realEstateAccounts.map(a => (
                    <tr key={a.id}>
                      <td><strong>{a.institution}</strong> · {a.name}</td>
                      <td>{a.kind.toUpperCase()}</td>
                      <td className="amount-cell">{maskVal(a.value)}</td>
                    </tr>
                  ))
                )}
                <tr style={{ fontWeight: "bold", backgroundColor: "#f9f9f9" }}>
                  <td colSpan={2}>Sous-total Immobilier</td>
                  <td className="amount-cell">{maskVal(realEstateTotal)}</td>
                </tr>
              </tbody>
            </table>

            {/* Biens d'équipements & montres de luxe */}
            <div className="declaration-sheet__section-title">3. Montres, Métaux & Objets de valeur</div>
            <table>
              <thead>
                <tr>
                  <th>Description de l'objet</th>
                  <th>Catégorie</th>
                  <th style={{ textAlign: "right" }}>Valeur estimée</th>
                </tr>
              </thead>
              <tbody>
                {luxuryAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ color: "#666", fontStyle: "italic" }}>Aucun objet de valeur enregistré</td>
                  </tr>
                ) : (
                  luxuryAccounts.map(a => (
                    <tr key={a.id}>
                      <td><strong>{a.institution}</strong> · {a.name}</td>
                      <td>{a.kind.toUpperCase()}</td>
                      <td className="amount-cell">{maskVal(a.value)}</td>
                    </tr>
                  ))
                )}
                <tr style={{ fontWeight: "bold", backgroundColor: "#f9f9f9" }}>
                  <td colSpan={2}>Sous-total Objets de valeur</td>
                  <td className="amount-cell">{maskVal(luxuryTotal)}</td>
                </tr>
              </tbody>
            </table>

            {/* Dettes / Liabilities */}
            <div className="declaration-sheet__section-title">4. Passif & Emprunts en cours</div>
            <table>
              <thead>
                <tr>
                  <th>Créancier / Libellé du crédit</th>
                  <th>Nature</th>
                  <th style={{ textAlign: "right" }}>Capital restant dû</th>
                </tr>
              </thead>
              <tbody>
                {liabilityAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ color: "#666", fontStyle: "italic" }}>Aucun crédit ou passif enregistré</td>
                  </tr>
                ) : (
                  liabilityAccounts.map(a => (
                    <tr key={a.id}>
                      <td><strong>{a.institution}</strong> · {a.name}</td>
                      <td>CRÉDIT</td>
                      <td className="amount-cell" style={{ color: "#b91c1c" }}>{maskVal(Math.abs(a.value))}</td>
                    </tr>
                  ))
                )}
                <tr style={{ fontWeight: "bold", backgroundColor: "#f9f9f9" }}>
                  <td colSpan={2}>Sous-total Passifs</td>
                  <td className="amount-cell" style={{ color: "#b91c1c" }}>{maskVal(liabilityTotal)}</td>
                </tr>
              </tbody>
            </table>

            {/* Synthèse finale */}
            <div className="declaration-sheet__section-title">Synthèse patrimoniale</div>
            <table>
              <tbody>
                <tr>
                  <td style={{ fontWeight: "bold" }}>Total Actifs Brut (1 + 2 + 3)</td>
                  <td className="amount-cell" style={{ fontWeight: "bold" }}>{maskVal(totalAssets)}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold" }}>Total Passifs (4)</td>
                  <td className="amount-cell" style={{ fontWeight: "bold", color: "#b91c1c" }}>{maskVal(liabilityTotal)}</td>
                </tr>
                <tr style={{ fontSize: "16px", fontWeight: "bold", backgroundColor: "#F0Fdf4", borderTop: "2px solid #000" }}>
                  <td>ACTIF NET GLOBAL</td>
                  <td className="amount-cell" style={{ color: netWealth >= 0 ? "#15803d" : "#b91c1c" }}>
                    {maskVal(netWealth)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Footer with Signatures */}
            <div className="declaration-sheet__footer">
              <div>
                Fait à Paris, le {declarationDate}
              </div>
              <div>
                Signature du déclarant :
                <div className="declaration-sheet__signature-box">
                  Cadre réservé à la signature
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
