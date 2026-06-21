import React, { useState } from "react";
import {
  TrendingUp, BarChart3, PieChart, ShieldAlert, Sparkles, HelpCircle,
  PiggyBank, ArrowDown, ArrowUp, Calendar, Trash, RefreshCw, Landmark,
  Percent, DollarSign, Wallet, ShieldCheck, ChevronRight, CheckCircle2
} from "lucide-react";
import type { PortfolioData, Account, Position, Transaction } from "./data-store";
import { euro, euroPrecise, Section } from "./components";

interface PageProps {
  data: PortfolioData;
}

export function AnalysisPage({ data }: PageProps) {
  // Compute basic stats
  const totalAssets = data.accounts.filter(a => a.value > 0).reduce((acc, a) => acc + a.value, 0);
  const totalLiabilities = Math.abs(data.accounts.filter(a => a.value < 0).reduce((acc, a) => acc + a.value, 0));
  const netWealth = totalAssets - totalLiabilities;
  
  // Allocation by kind
  const allocationMap = new Map<string, number>();
  data.accounts.forEach(a => {
    if (a.value !== 0) {
      const key = a.value < 0 ? "Dettes" : a.kind;
      allocationMap.set(key, (allocationMap.get(key) || 0) + Math.abs(a.value));
    }
  });

  const allocations = [...allocationMap.entries()].map(([label, value]) => ({
    label,
    value,
    percent: totalAssets > 0 ? parseFloat(((value / totalAssets) * 100).toFixed(1)) : 0
  })).sort((a, b) => b.value - a.value);

  // Concentration risk
  const maxConcentration = allocations[0] ? allocations[0].percent : 0;
  const concentrationStatus = maxConcentration > 50 ? "high" : maxConcentration > 30 ? "medium" : "low";

  // Estimated assets vs verified
  const estimatedValue = data.accounts.filter(a => a.reliability === "estimated" || a.reliability === "partial").reduce((acc, a) => acc + Math.abs(a.value), 0);
  const estimatedPercent = totalAssets > 0 ? Math.round((estimatedValue / totalAssets) * 100) : 0;

  return (
    <div className="analysis-page">
      <div className="page-title">
        <div>
          <span className="eyebrow">Diagnostic</span>
          <h1>Analyse du patrimoine</h1>
          <p>Comprenez l'organisation de vos actifs, vos risques de concentration et votre allocation.</p>
        </div>
      </div>

      <div className="summary-strip">
        <div>
          <span>Patrimoine brut</span>
          <strong>{euro(totalAssets)}</strong>
        </div>
        <div>
          <span>Dettes (Passifs)</span>
          <strong className="negative">-{euro(totalLiabilities)}</strong>
        </div>
        <div>
          <span>Patrimoine net</span>
          <strong>{euro(netWealth)}</strong>
        </div>
        <div>
          <span>Part des valeurs estimées</span>
          <strong>{estimatedPercent} %</strong>
        </div>
      </div>

      <div className="health-grid">
        <Section title="Répartition par classe d'actifs" subtitle="Répartition pondérée de vos avoirs bruts">
          {allocations.length > 0 ? (
            <div className="allocation-wrap">
              <div className="donut" style={{
                background: `conic-gradient(#8f85ff 0% ${allocations[0]?.percent || 0}%, #d7b36a ${allocations[0]?.percent || 0}% ${(allocations[0]?.percent || 0) + (allocations[1]?.percent || 0)}%, #6aa9ff ${(allocations[0]?.percent || 0) + (allocations[1]?.percent || 0)}% 100%)`
              }}>
                <div>
                  <strong>{euro(netWealth)}</strong>
                  <span>Net</span>
                </div>
              </div>
              <div className="allocation-list">
                {allocations.map((item, index) => (
                  <div key={item.label}>
                    <i style={{ background: index === 0 ? "#8f85ff" : index === 1 ? "#d7b36a" : "#6aa9ff" }} />
                    <span>
                      {item.label}
                      <small>{euro(item.value)}</small>
                    </span>
                    <strong>{item.percent}%</strong>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-chart" style={{ padding: "20px", textAlign: "center", color: "var(--muted)" }}>
              Ajoutez des actifs pour afficher l'analyse d'allocation.
            </div>
          )}
        </Section>

        <Section title="Diagnostic de diversification" subtitle="Analyse des risques de concentration locale">
          <div className="quality-bars" style={{ padding: "10px 0" }}>
            <div style={{ marginBottom: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span>Exposition classe principale ({allocations[0]?.label || "N/A"})</span>
                <strong>{maxConcentration}%</strong>
              </div>
              <div className="progress-bar" style={{ height: "6px", background: "var(--line-soft)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${maxConcentration}%`,
                  background: concentrationStatus === "high" ? "var(--red)" : concentrationStatus === "medium" ? "var(--yellow)" : "var(--positive)"
                }} />
              </div>
            </div>
            
            <dl className="analysis-tips" style={{ fontSize: "10px", lineHeight: "1.6", color: "var(--muted)" }}>
              <dt style={{ fontWeight: "700", color: "var(--text)", marginBottom: "4px" }}>Conseil pédagogique :</dt>
              <dd>
                {concentrationStatus === "high" 
                  ? "⚠️ Votre patrimoine est très concentré sur une seule classe d'actifs. Envisager une diversification progressive (par exemple via des livrets d'épargne ou des ETF mondiaux) peut réduire votre exposition globale aux risques spécifiques d'un secteur."
                  : concentrationStatus === "medium"
                  ? "👍 Votre diversification est modérée. Veillez à ce que cette concentration corresponde à vos objectifs de rendement et à votre tolérance au risque."
                  : "✨ Votre répartition est bien équilibrée sur plusieurs supports financiers ou immobiliers. Cela amortit généralement les fluctuations de marché."}
              </dd>
            </dl>
          </div>
        </Section>
      </div>

      <Section title="Exposition géographique & devises" subtitle="Estimation basée sur la cotation d'origine">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", padding: "15px 0" }}>
          <div>
            <h3 style={{ fontSize: "11px", marginBottom: "10px" }}>Répartition des devises</h3>
            <div className="quality-bars">
              <div>
                <span>EUR</span>
                <i><b style={{ width: "90%" }} /></i>
                <strong>90 %</strong>
              </div>
              <div>
                <span>USD</span>
                <i><b style={{ width: "10%", background: "var(--yellow)" }} /></i>
                <strong>10 %</strong>
              </div>
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: "11px", marginBottom: "10px" }}>Indicateurs de vigilance</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "10px" }}>
                <span style={{ color: "var(--positive)" }}>●</span>
                <span>Aucune devise exotique à risque de change élevé.</span>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "10px" }}>
                <span style={{ color: "var(--yellow)" }}>●</span>
                <span>{data.accounts.filter(a => a.reliability === "estimated").length} actif(s) repose(nt) sur des estimations manuelles obsolètes.</span>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

export function BudgetPage({ data }: PageProps) {
  // Compute cashflow
  const transactions = data.transactions;
  const monthlyRevenues = Math.abs(transactions.filter(t => t.amount > 0 && t.type !== "Transfert").reduce((acc, t) => acc + t.amount, 0));
  const monthlyExpenses = Math.abs(transactions.filter(t => t.amount < 0 && t.type !== "Transfert").reduce((acc, t) => acc + t.amount, 0));
  
  const cashflow = monthlyRevenues - monthlyExpenses;
  const savingsRate = monthlyRevenues > 0 ? Math.round((cashflow / monthlyRevenues) * 100) : 0;

  // Mock categories
  const categories = [
    { name: "Logement & Crédits", spent: monthlyExpenses * 0.45, limit: 1200, color: "#ef6d7a" },
    { name: "Alimentation", spent: monthlyExpenses * 0.25, limit: 500, color: "#f4c66b" },
    { name: "Transports", spent: monthlyExpenses * 0.15, limit: 300, color: "#6aa9ff" },
    { name: "Loisirs & Sorties", spent: monthlyExpenses * 0.15, limit: 400, color: "#8f85ff" }
  ];

  return (
    <div className="budget-page">
      <div className="page-title">
        <div>
          <span className="eyebrow">Flux Financiers</span>
          <h1>Suivi du Budget</h1>
          <p>Analysez vos revenus, vos charges récurrentes et votre capacité d'épargne.</p>
        </div>
      </div>

      <div className="summary-strip">
        <div>
          <span>Revenus identifiés</span>
          <strong className="positive">+{euro(monthlyRevenues)}</strong>
        </div>
        <div>
          <span>Dépenses identifiées</span>
          <strong className="negative">-{euro(monthlyExpenses)}</strong>
        </div>
        <div>
          <span>Flux Net (Reste à vivre)</span>
          <strong className={cashflow >= 0 ? "positive" : "negative"}>{cashflow >= 0 ? "+" : ""}{euro(cashflow)}</strong>
        </div>
        <div>
          <span>Taux d'épargne estimé</span>
          <strong style={{ color: "var(--green)" }}>{savingsRate}%</strong>
        </div>
      </div>

      <div className="health-grid">
        <Section title="Répartition des dépenses" subtitle="Charges fixes et variables identifiées">
          <div className="budget-bar-list" style={{ padding: "10px 0", display: "flex", flexDirection: "column", gap: "12px" }}>
            {categories.map(cat => (
              <div key={cat.name} style={{ fontSize: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <strong>{cat.name}</strong>
                  <span>{euro(cat.spent)} / {euro(cat.limit)}</span>
                </div>
                <div className="progress-bar" style={{ height: "6px", background: "var(--line-soft)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${Math.min((cat.spent / cat.limit) * 100, 100)}%`,
                    background: cat.color
                  }} />
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Abonnements & Charges Récurrentes" subtitle="Détection automatique des sorties fixes">
          <div className="simple-list" style={{ fontSize: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--line-soft)" }}>
              <span>🏡 Crédit principal / Loyer</span>
              <strong>850,00 € / mois</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--line-soft)" }}>
              <span>⚡ Électricité / Énergie</span>
              <strong>120,00 € / mois</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
              <span>📱 Forfaits & Plateformes streaming</span>
              <strong>45,00 € / mois</strong>
            </div>
          </div>
          <div className="beginner-tip" style={{ marginTop: "15px", display: "flex", gap: "8px", background: "rgba(143,133,255,0.06)", padding: "10px", borderRadius: "6px" }}>
            <Sparkles size={16} style={{ color: "var(--green)" }} />
            <div>
              <strong>Optimisation budget</strong>
              <p style={{ margin: "2px 0 0", fontSize: "9px", color: "var(--muted)" }}>
                En réduisant de 15 € vos abonnements récurrents et en les plaçant à un taux de 5%, vous accumulez ~5 000 € d'intérêts sur 20 ans.
              </p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

// Interactive Simulators Page
export function ToolsPage() {
  const [activeTab, setActiveTab] = useState("patrimoine");

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
