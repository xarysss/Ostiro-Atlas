import React, { useState } from "react";
import {
  ArrowLeft, Search, Plus, FileInput, Landmark, BadgePercent, Coins,
  TrendingUp, Home, CircleAlert, Sparkles, Check, LockKeyhole, ShieldCheck,
  BriefcaseBusiness, HelpCircle, HardDrive, Calculator, ChevronRight,
  Info, AlertTriangle
} from "lucide-react";
import type { LocalProfile } from "./profile-types";
import type { PortfolioData, Account, Position, Transaction } from "./data-store";
import { euro } from "./components";

// Popular institutions
const popularInstitutions = [
  { id: "bourso", name: "BoursoBank", logo: "BB", type: "Banque & Courtier" },
  { id: "ca", name: "Crédit Agricole", logo: "CA", type: "Banque" },
  { id: "cm", name: "Crédit Mutuel", logo: "CM", type: "Banque" },
  { id: "fortuneo", name: "Fortuneo", logo: "FT", type: "Banque & Courtier" },
  { id: "sg", name: "Société Générale", logo: "SG", type: "Banque" },
  { id: "bnp", name: "BNP Paribas", logo: "BN", type: "Banque" },
  { id: "ce", name: "Caisse d'Épargne", logo: "CE", type: "Banque" },
  { id: "bp", name: "Banque Populaire", logo: "BP", type: "Banque" },
  { id: "tr", name: "Trade Republic", logo: "TR", type: "Courtier" },
  { id: "ibkr", name: "Interactive Brokers", logo: "IB", type: "Courtier" },
  { id: "degiro", name: "Degiro", logo: "DG", type: "Courtier" },
  { id: "binance", name: "Binance", logo: "BI", type: "Crypto Exchange" },
  { id: "kraken", name: "Kraken", logo: "KR", type: "Crypto Exchange" },
  { id: "coinbase", name: "Coinbase", logo: "CB", type: "Crypto Exchange" }
];

// Asset Categories
const assetCategories = [
  { id: "bank_accounts", name: "Comptes bancaires", desc: "Comptes courants et dépôts à vue", icon: Landmark, color: "#8f85ff" },
  { id: "savings", name: "Livrets d'épargne", desc: "Livret A, LDDS, LEP, PEL...", icon: BadgePercent, color: "#c5a8ff" },
  { id: "pea", name: "PEA", desc: "Plan d'Épargne en Actions français", icon: TrendingUp, color: "#6aa9ff" },
  { id: "cto", name: "CTO", desc: "Compte Titres Ordinaire international", icon: Coins, color: "#5fcdeb" },
  { id: "life_insurance", name: "Assurance-vie", desc: "Contrats d'assurance-vie et fonds euros", icon: BriefcaseBusiness, color: "#74a9d8" },
  { id: "per", name: "PER", desc: "Plan d'Épargne Retraite", icon: Calculator, color: "#a696d4" },
  { id: "crypto", name: "Crypto", desc: "Bitcoin, Ethereum, exchanges et portefeuilles physiques", icon: Coins, color: "#ff8e72" },
  { id: "real_estate", name: "Immobilier", desc: "Résidence principale, investissement locatif, SCPI...", icon: Home, color: "#f4c66b" },
  { id: "loans", name: "Prêts & Dettes", desc: "Crédits immobiliers, prêts conso, dettes privées", icon: CircleAlert, color: "#ef6d7a" },
  { id: "metals", name: "Métaux précieux & Objets", desc: "Or, argent, montres, oeuvres d'art...", icon: Sparkles, color: "#d7b36a" },
  { id: "others", name: "Autres actifs", desc: "Entreprises, parts sociales, cash...", icon: HelpCircle, color: "#aab5af" }
];

interface CompleteWealthProps {
  profile: LocalProfile;
  data: PortfolioData;
  onSaveData: (data: PortfolioData) => void;
  navigate: (page: string) => void;
}

export function CompleteWealthPage({ profile, data, onSaveData, navigate }: CompleteWealthProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInst, setSelectedInst] = useState<typeof popularInstitutions[0] | null>(null);
  const [selectedCat, setSelectedCat] = useState<typeof assetCategories[0] | null>(null);
  const [step, setStep] = useState<"search" | "connect" | "manual">("search");
  
  // Manual form states
  const [manualKind, setManualKind] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualInstitution, setManualInstitution] = useState("");
  const [manualValue, setManualValue] = useState("");
  const [manualCurrency, setManualCurrency] = useState("EUR");
  
  // Specific details fields
  const [interestRate, setInterestRate] = useState("");
  const [cashBalance, setCashBalance] = useState("");
  const [propertyType, setPropertyType] = useState("Appartement");
  const [city, setCity] = useState("");
  const [associatedLoan, setAssociatedLoan] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [loanRate, setLoanRate] = useState("");
  const [loanEndDate, setLoanEndDate] = useState("");
  
  // Stock/Crypto specific position fields
  const [positionSymbol, setPositionSymbol] = useState("");
  const [positionQty, setPositionQty] = useState("");
  const [positionBuyPrice, setPositionBuyPrice] = useState("");
  const [positionCurrentPrice, setPositionCurrentPrice] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filters
  const filteredInstitutions = popularInstitutions.filter(inst => 
    inst.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    inst.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategories = assetCategories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectInstitution = (inst: typeof popularInstitutions[0]) => {
    setSelectedInst(inst);
    setSelectedCat(null);
    setStep("connect");
  };

  const handleSelectCategory = (cat: typeof assetCategories[0]) => {
    setSelectedCat(cat);
    setSelectedInst(null);
    setManualKind(cat.name);
    setManualName(cat.name);
    setManualInstitution("");
    setManualValue("");
    setStep("manual");
  };

  const resetState = () => {
    setSelectedInst(null);
    setSelectedCat(null);
    setStep("search");
    setManualKind("");
    setManualName("");
    setManualInstitution("");
    setManualValue("");
    setInterestRate("");
    setCashBalance("");
    setCity("");
    setAssociatedLoan("");
    setMonthlyPayment("");
    setLoanRate("");
    setLoanEndDate("");
    setPositionSymbol("");
    setPositionQty("");
    setPositionBuyPrice("");
    setPositionCurrentPrice("");
  };

  const handleAddManualAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName) return;

    const id = "asset-" + Math.random().toString(36).substr(2, 9);
    const parsedValue = parseFloat(manualValue.replace(/\s/g, "")) || 0;
    
    const details: any = {};
    if (interestRate) details.interestRate = parseFloat(interestRate);
    if (cashBalance) details.cashBalance = parseFloat(cashBalance);
    if (propertyType) details.propertyType = propertyType;
    if (city) details.city = city;
    if (monthlyPayment) details.monthlyPayment = parseFloat(monthlyPayment);
    if (loanRate) details.loanRate = parseFloat(loanRate);
    if (loanEndDate) details.loanEndDate = loanEndDate;

    // Create new Account entry
    const newAccount: Account = {
      id,
      name: manualName,
      kind: manualKind,
      institution: manualInstitution || "Saisie manuelle",
      value: manualKind === "Prêts & Dettes" ? -Math.abs(parsedValue) : parsedValue,
      delta: 0,
      reliability: "verified",
      updated: "À l'instant",
      color: selectedCat?.color || "#8f85ff",
      currency: manualCurrency,
      details: Object.keys(details).length > 0 ? details : undefined
    };

    const updatedAccounts = [...data.accounts, newAccount];
    const updatedPositions = [...data.positions];
    const updatedTransactions = [...data.transactions];
    const updatedFees = [...data.fees];
    const updatedDividends = [...data.dividends];

    // If it's a PEA/CTO, also add cash as a position or cash details
    if (manualKind === "PEA" || manualKind === "CTO") {
      newAccount.details = {
        cashBalance: parseFloat(cashBalance) || 0
      };
      
      // If position fields are entered, create a position inside this account
      if (positionSymbol && positionQty) {
        const qty = parseFloat(positionQty) || 0;
        const buyPrice = parseFloat(positionBuyPrice) || 0;
        const currentPrice = parseFloat(positionCurrentPrice) || buyPrice;
        const value = qty * currentPrice;
        
        const newPos: Position = {
          symbol: positionSymbol.toUpperCase(),
          name: positionSymbol.toUpperCase() + " (Position)",
          account: manualName,
          accountId: id,
          quantity: qty,
          averageCost: buyPrice,
          price: currentPrice,
          value,
          gain: (currentPrice - buyPrice) * qty,
          currency: manualCurrency,
          reliability: "verified",
          updated: "À l'instant"
        };
        updatedPositions.push(newPos);
        
        // Update account total value to reflect position value + cash balance
        newAccount.value = value + (parseFloat(cashBalance) || 0);

        // Also add an audit transaction
        const txId = "tx-" + Math.random().toString(36).substr(2, 9);
        updatedTransactions.push({
          id: txId,
          date: new Date().toISOString().slice(0, 10),
          label: `Achat initial ${positionSymbol.toUpperCase()}`,
          account: manualName,
          accountId: id,
          amount: -qty * buyPrice,
          type: "Achat",
          currency: manualCurrency,
          reliability: "verified"
        });
      }
    }

    // If it's pure Crypto
    if (manualKind === "Crypto" && positionSymbol && positionQty) {
      const qty = parseFloat(positionQty) || 0;
      const buyPrice = parseFloat(positionBuyPrice) || 0;
      const currentPrice = parseFloat(positionCurrentPrice) || buyPrice;
      const value = qty * currentPrice;

      newAccount.value = value;

      const newPos: Position = {
        symbol: positionSymbol.toUpperCase(),
        name: positionSymbol.toUpperCase() + " (Crypto)",
        account: manualName,
        accountId: id,
        quantity: qty,
        averageCost: buyPrice,
        price: currentPrice,
        value,
        gain: (currentPrice - buyPrice) * qty,
        currency: manualCurrency,
        reliability: "verified",
        updated: "À l'instant"
      };
      updatedPositions.push(newPos);
    }

    // Save everything back to store
    onSaveData({
      ...data,
      accounts: updatedAccounts,
      positions: updatedPositions,
      transactions: updatedTransactions,
      fees: updatedFees,
      dividends: updatedDividends
    });

    resetState();
    navigate("overview"); // Return to dashboard
  };

  return (
    <div className="complete-wealth-page">
      <div className="page-title">
        <div>
          <span className="eyebrow">Ajouter des actifs</span>
          <h1>Compléter mon patrimoine</h1>
          <p>Connectez vos comptes ou ajoutez vos biens pour construire votre vision à 360°.</p>
        </div>
        {step !== "search" && (
          <button className="secondary-button" onClick={resetState}>
            <ArrowLeft size={16} /> Retour
          </button>
        )}
      </div>

      {step === "search" && (
        <div className="cw-search-container">
          <div className="cw-search-bar">
            <Search size={18} />
            <input
              type="text"
              placeholder="Rechercher une banque, un courtier, un type d'actif (ex: BoursoBank, Crédit Agricole, Trade Republic, Kraken, immobilier, Bitcoin, PEA, CTO...)"
              value={searchQuery}
              onChange={handleSearchChange}
              autoFocus
            />
          </div>

          <div className="cw-grid">
            <section className="cw-section panel">
              <header className="panel__header">
                <div>
                  <h2>Établissements & Plateformes populaires</h2>
                  <p>Connexion sécurisée en lecture seule ou import rapide</p>
                </div>
              </header>
              <div className="institutions-list">
                {filteredInstitutions.length > 0 ? (
                  filteredInstitutions.map(inst => (
                    <button
                      key={inst.id}
                      className="inst-row-btn"
                      onClick={() => handleSelectInstitution(inst)}
                    >
                      <span className="inst-avatar">{inst.logo}</span>
                      <div>
                        <strong>{inst.name}</strong>
                        <small>{inst.type}</small>
                      </div>
                      <ChevronRight size={16} />
                    </button>
                  ))
                ) : (
                  <p className="no-results">Aucun établissement trouvé pour « {searchQuery} »</p>
                )}
              </div>
            </section>

            <section className="cw-section panel">
              <header className="panel__header">
                <div>
                  <h2>Catégories d'actifs (Ajout manuel)</h2>
                  <p>Déclarez n'importe quel investissement localement</p>
                </div>
              </header>
              <div className="categories-list">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map(cat => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        className="cat-row-btn"
                        onClick={() => handleSelectCategory(cat)}
                      >
                        <span className="cat-icon-span" style={{ background: `${cat.color}15`, color: cat.color }}>
                          <Icon size={18} />
                        </span>
                        <div>
                          <strong>{cat.name}</strong>
                          <small>{cat.desc}</small>
                        </div>
                        <Plus size={16} />
                      </button>
                    );
                  })
                ) : (
                  <p className="no-results">Aucune catégorie trouvée pour « {searchQuery} »</p>
                )}
              </div>
            </section>
          </div>
        </div>
      )}

      {step === "connect" && selectedInst && (
        <div className="cw-connect-container panel">
          <header className="panel__header">
            <div>
              <h2>Connexion sécurisée</h2>
              <p>Synchronisation automatique de votre établissement</p>
            </div>
          </header>
          
          <div className="connect-flow-body">
            <div className="connect-logos-row">
              <span className="brand__mark"><span/><span/><span/></span>
              <div className="connect-connector-line">
                <span className="lock-dot"><LockKeyhole size={12}/></span>
              </div>
              <span className="inst-avatar inst-avatar--large">{selectedInst.logo}</span>
            </div>
            
            <h3>Connexion sécurisée à {selectedInst.name}</h3>
            <p className="connect-subtitle">
              Ostiro Atlas se connecte via une interface technique cryptée en lecture seule. Vos identifiants ne sont jamais stockés par l'application.
            </p>
            
            <div className="compatible-accounts">
              <strong>Comptes potentiellement compatibles :</strong>
              <ul>
                <li>Compte courant & compte de dépôt</li>
                <li>Livrets d'épargne réglementés (Livret A, LDDS)</li>
                <li>PEA, Compte-Titres (CTO) et assurance-vie (si gérés par {selectedInst.name})</li>
              </ul>
            </div>

            <div className="alert-box alert-box--warning">
              <AlertTriangle size={18} />
              <div>
                <strong>Connexion automatique bientôt disponible</strong>
                <p>
                  Dans cette version locale et gratuite d'Ostiro Atlas, l'agrégation directe nécessite un fournisseur compatible (Powens, Bridge ou GoCardless). Vous pouvez utiliser l'import de fichier CSV ou la saisie manuelle à la place.
                </p>
              </div>
            </div>

            <div className="connect-actions">
              <button className="primary-button" disabled>
                Connexion automatique bientôt disponible
              </button>
              <button className="secondary-button" onClick={() => {
                // Switch to CSV page and prepopulate
                navigate("imports");
              }}>
                <FileInput size={16} /> Importer un CSV à la place
              </button>
              <button className="secondary-button" onClick={() => {
                const genericCat = (assetCategories.find(c => c.name.toLowerCase().includes(selectedInst.type.toLowerCase())) ?? assetCategories[0]) as typeof assetCategories[0];
                handleSelectCategory(genericCat);
              }}>
                <Plus size={16} /> Ajouter manuellement
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "manual" && (
        <div className="cw-manual-container panel">
          <header className="panel__header">
            <div>
              <h2>Ajout manuel — {manualKind}</h2>
              <p>Saisissez les informations de votre actif</p>
            </div>
          </header>
          
          <form className="manual-form" onSubmit={handleAddManualAsset}>
            <div className="form-grid">
              <label className="field">
                <span>Nom de l'actif / du compte</span>
                <input
                  type="text"
                  required
                  placeholder={`Ex: Mon ${manualKind}`}
                  value={manualName}
                  onChange={e => setManualName(e.target.value)}
                />
              </label>

              <label className="field">
                <span>Établissement / Banque / Courtier</span>
                <input
                  type="text"
                  placeholder="Ex: BoursoBank, Crédit Agricole..."
                  value={manualInstitution}
                  onChange={e => setManualInstitution(e.target.value)}
                />
              </label>

              <label className="field">
                <span>{manualKind === "Prêts & Dettes" ? "Capital restant dû" : "Solde / Valeur actuelle"}</span>
                <div className="input-currency-wrapper">
                  <input
                    type="text"
                    required
                    placeholder="Ex: 5 000"
                    value={manualValue}
                    onChange={e => setManualValue(e.target.value)}
                  />
                  <span>{manualCurrency}</span>
                </div>
              </label>

              <label className="field">
                <span>Devise</span>
                <select value={manualCurrency} onChange={e => setManualCurrency(e.target.value)}>
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="CHF">CHF (CHF)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </label>
            </div>

            {/* Specific Fields depending on Asset Kind */}
            {manualKind === "Livrets d'épargne" && (
              <div className="form-sub-section">
                <h3>Options du livret</h3>
                <div className="form-grid">
                  <label className="field">
                    <span>Taux d'intérêt annuel (%)</span>
                    <input
                      type="number"
                      step="0.05"
                      placeholder="Ex: 3"
                      value={interestRate}
                      onChange={e => setInterestRate(e.target.value)}
                    />
                  </label>
                </div>
              </div>
            )}

            {(manualKind === "PEA" || manualKind === "CTO") && (
              <div className="form-sub-section">
                <h3>Portefeuille & Espèces</h3>
                <div className="form-grid">
                  <label className="field">
                    <span>Solde espèces du compte (liquidités)</span>
                    <input
                      type="number"
                      placeholder="Ex: 1500"
                      value={cashBalance}
                      onChange={e => setCashBalance(e.target.value)}
                    />
                  </label>
                </div>
                
                <h4 style={{ marginTop: "14px", marginBottom: "8px", fontSize: "10px", textTransform: "uppercase", color: "var(--muted)" }}>
                  Ajouter une première ligne (action ou ETF)
                </h4>
                <div className="form-grid">
                  <label className="field">
                    <span>Symbole / Ticker ou ISIN</span>
                    <input
                      type="text"
                      placeholder="Ex: CW8, MC, MSFT..."
                      value={positionSymbol}
                      onChange={e => setPositionSymbol(e.target.value)}
                    />
                  </label>
                  <label className="field">
                    <span>Quantité détenue</span>
                    <input
                      type="number"
                      step="any"
                      placeholder="Ex: 10"
                      value={positionQty}
                      onChange={e => setPositionQty(e.target.value)}
                    />
                  </label>
                  <label className="field">
                    <span>Prix d'achat unitaire (PRU)</span>
                    <input
                      type="number"
                      step="any"
                      placeholder="Ex: 400"
                      value={positionBuyPrice}
                      onChange={e => setPositionBuyPrice(e.target.value)}
                    />
                  </label>
                  <label className="field">
                    <span>Valeur actuelle unitaire (cours)</span>
                    <input
                      type="number"
                      step="any"
                      placeholder="Ex: 480"
                      value={positionCurrentPrice}
                      onChange={e => setPositionCurrentPrice(e.target.value)}
                    />
                  </label>
                </div>
              </div>
            )}

            {manualKind === "Crypto" && (
              <div className="form-sub-section">
                <h3>Actif Cryptographique</h3>
                <div className="form-grid">
                  <label className="field">
                    <span>Symbole (ex: BTC, ETH)</span>
                    <input
                      type="text"
                      placeholder="Ex: BTC"
                      value={positionSymbol}
                      onChange={e => setPositionSymbol(e.target.value)}
                    />
                  </label>
                  <label className="field">
                    <span>Quantité de tokens</span>
                    <input
                      type="number"
                      step="any"
                      placeholder="Ex: 0.25"
                      value={positionQty}
                      onChange={e => setPositionQty(e.target.value)}
                    />
                  </label>
                  <label className="field">
                    <span>Prix d'achat unitaire</span>
                    <input
                      type="number"
                      step="any"
                      placeholder="Ex: 60000"
                      value={positionBuyPrice}
                      onChange={e => setPositionBuyPrice(e.target.value)}
                    />
                  </label>
                  <label className="field">
                    <span>Valeur actuelle unitaire (cours)</span>
                    <input
                      type="number"
                      step="any"
                      placeholder="Ex: 65000"
                      value={positionCurrentPrice}
                      onChange={e => setPositionCurrentPrice(e.target.value)}
                    />
                  </label>
                </div>
              </div>
            )}

            {manualKind === "Immobilier" && (
              <div className="form-sub-section">
                <h3>Détails du bien immobilier</h3>
                <div className="form-grid">
                  <label className="field">
                    <span>Type de bien</span>
                    <select value={propertyType} onChange={e => setPropertyType(e.target.value)}>
                      <option value="Résidence principale">Résidence principale</option>
                      <option value="Résidence secondaire">Résidence secondaire</option>
                      <option value="Appartement locatif">Appartement locatif</option>
                      <option value="Maison">Maison</option>
                      <option value="SCPI">SCPI</option>
                      <option value="Terrain">Terrain</option>
                    </select>
                  </label>
                  <label className="field">
                    <span>Ville / Région</span>
                    <input
                      type="text"
                      placeholder="Ex: Lyon, Paris..."
                      value={city}
                      onChange={e => setCity(e.target.value)}
                    />
                  </label>
                  <label className="field">
                    <span>Crédit associé (Capital restant dû)</span>
                    <input
                      type="number"
                      placeholder="Ex: 120000"
                      value={associatedLoan}
                      onChange={e => setAssociatedLoan(e.target.value)}
                    />
                  </label>
                </div>
              </div>
            )}

            {manualKind === "Prêts & Dettes" && (
              <div className="form-sub-section">
                <h3>Caractéristiques du crédit / de la dette</h3>
                <div className="form-grid">
                  <label className="field">
                    <span>Taux d'intérêt annuel (%)</span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Ex: 3.5"
                      value={loanRate}
                      onChange={e => setLoanRate(e.target.value)}
                    />
                  </label>
                  <label className="field">
                    <span>Mensualité</span>
                    <input
                      type="number"
                      placeholder="Ex: 850"
                      value={monthlyPayment}
                      onChange={e => setMonthlyPayment(e.target.value)}
                    />
                  </label>
                  <label className="field">
                    <span>Date de fin de remboursement</span>
                    <input
                      type="date"
                      value={loanEndDate}
                      onChange={e => setLoanEndDate(e.target.value)}
                    />
                  </label>
                </div>
              </div>
            )}

            <div className="form-actions" style={{ marginTop: "24px" }}>
              <button type="submit" className="primary-button">
                Enregistrer l'actif
              </button>
              <button type="button" className="secondary-button" onClick={resetState}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
