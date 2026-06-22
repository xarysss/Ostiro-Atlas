import React, { useState } from "react";
import {
  ArrowLeft, Search, Plus, FileInput, Landmark, BadgePercent, Coins,
  TrendingUp, Home, CircleAlert, Sparkles, LockKeyhole, AlertTriangle,
  ChevronRight, BadgeInfo, Watch, Gem, DollarSign
} from "lucide-react";
import type { LocalProfile } from "./profile-types";
import type { PortfolioData, Account, Position, Transaction } from "./data-store";
import { BrandLogo, euro } from "./components";

// Popular institutions
const popularInstitutions = [
  { id: "bourso", name: "BoursoBank", logo: "BB", type: "Banque & Courtier", bg: "#E8F0FE" },
  { id: "ca", name: "Crédit Agricole", logo: "CA", type: "Banque", bg: "#E0F2F1" },
  { id: "cm", name: "Crédit Mutuel", logo: "CM", type: "Banque", bg: "#FFEBEE" },
  { id: "fortuneo", name: "Fortuneo", logo: "FT", type: "Banque & Courtier", bg: "#E8F5E9" },
  { id: "sg", name: "Société Générale", logo: "SG", type: "Banque", bg: "#FFEBEE" },
  { id: "binance", name: "Binance", logo: "BN", type: "Crypto Exchange", bg: "#FFF9C4" },
  { id: "tr", name: "Trade Republic", logo: "TR", type: "Courtier", bg: "#ECEFF1" },
  { id: "bitcoin", name: "Bitcoin", logo: "BTC", type: "Crypto & Blockchain", bg: "#FFE0B2" }
];

// Asset Categories
const assetCategories = [
  { id: "bank_accounts", name: "Comptes & Livrets", desc: "Comptes courants, livrets d'épargne (A, LDD...)", icon: Landmark, color: "#506CE8" },
  { id: "stocks", name: "Actions & Fonds", desc: "PEA, CTO, Assurance-Vie, PER, ETF...", icon: TrendingUp, color: "#E8C08C" },
  { id: "crypto", name: "Crypto", desc: "Bitcoin, Ethereum, exchanges et cold wallets", icon: Coins, color: "#E08894" },
  { id: "real_estate", name: "Immobilier", desc: "Résidence principale, investissement locatif, SCPI...", icon: Home, color: "#13C79B" },
  { id: "watches", name: "Montres & Objets de valeur", desc: "Rolex, Patek, bijoux, métaux précieux, art...", icon: Sparkles, color: "#BC9C74" },
  { id: "loans", name: "Prêts & Dettes", desc: "Crédits immobiliers, prêts à la consommation...", icon: CircleAlert, color: "#E08894" }
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

  // Luxury Watch specific fields
  const [watchBrand, setWatchBrand] = useState("");
  const [watchModel, setWatchModel] = useState("");
  const [watchBuyPrice, setWatchBuyPrice] = useState("");
  const [watchEstValue, setWatchEstValue] = useState("");
  const [watchYear, setWatchYear] = useState("");
  const [watchStyle, setWatchStyle] = useState("Sport");
  const [watchSerialNumber, setWatchSerialNumber] = useState("");

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

  // Check if user is searching for luxury watches / objects
  const queryLower = searchQuery.toLowerCase();
  const isSearchingWatch = ["rolex", "montre", "watch", "patek", "ap", "audemars", "omega", "cartier", "richard", "hublot", "precieux", "or", "bijou", "art"].some(kw => queryLower.includes(kw));

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

    // Clear watch inputs
    setWatchBrand("");
    setWatchModel("");
    setWatchBuyPrice("");
    setWatchEstValue("");
    setWatchYear("");
    setWatchStyle("Sport");
    setWatchSerialNumber("");

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
    setWatchBrand("");
    setWatchModel("");
    setWatchBuyPrice("");
    setWatchEstValue("");
    setWatchYear("");
    setWatchStyle("Sport");
    setWatchSerialNumber("");
  };

  const handleAddManualAsset = (e: React.FormEvent) => {
    e.preventDefault();

    const id = "asset-" + Math.random().toString(36).substr(2, 9);
    let finalValue = parseFloat(manualValue.replace(/\s/g, "")) || 0;
    let finalName = manualName;

    const details: any = {};
    if (interestRate) details.interestRate = parseFloat(interestRate);
    if (cashBalance) details.cashBalance = parseFloat(cashBalance);
    if (propertyType) details.propertyType = propertyType;
    if (city) details.city = city;
    if (monthlyPayment) details.monthlyPayment = parseFloat(monthlyPayment);
    if (loanRate) details.loanRate = parseFloat(loanRate);
    if (loanEndDate) details.loanEndDate = loanEndDate;

    // Watch details
    if (selectedCat?.id === "watches") {
      finalName = watchBrand ? `${watchBrand} ${watchModel}` : manualName || "Montre de collection";
      const buyPriceNum = parseFloat(watchBuyPrice) || 0;
      const estValueNum = parseFloat(watchEstValue) || buyPriceNum;
      finalValue = estValueNum;

      details.brand = watchBrand;
      details.model = watchModel;
      details.buyPrice = buyPriceNum;
      details.estimatedValue = estValueNum;
      details.acquisitionYear = watchYear;
      details.style = watchStyle;
      details.serialNumber = watchSerialNumber;
    }

    // Create new Account entry
    const newAccount: Account = {
      id,
      name: finalName,
      kind: manualKind,
      institution: manualInstitution || (selectedCat?.id === "watches" ? "Collection privée" : "Saisie manuelle"),
      value: manualKind === "Prêts & Dettes" ? -Math.abs(finalValue) : finalValue,
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

    // If PEA or CTO
    if (manualKind === "PEA" || manualKind === "CTO") {
      newAccount.details = {
        cashBalance: parseFloat(cashBalance) || 0
      };

      if (positionSymbol && positionQty) {
        const qty = parseFloat(positionQty) || 0;
        const buyPrice = parseFloat(positionBuyPrice) || 0;
        const currentPrice = parseFloat(positionCurrentPrice) || buyPrice;
        const value = qty * currentPrice;

        const newPos: Position = {
          symbol: positionSymbol.toUpperCase(),
          name: positionSymbol.toUpperCase() + " (Position)",
          account: finalName,
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

        newAccount.value = value + (parseFloat(cashBalance) || 0);

        const txId = "tx-" + Math.random().toString(36).substr(2, 9);
        updatedTransactions.push({
          id: txId,
          date: new Date().toISOString().slice(0, 10),
          label: `Achat initial ${positionSymbol.toUpperCase()}`,
          account: finalName,
          accountId: id,
          amount: -qty * buyPrice,
          type: "Achat",
          currency: manualCurrency,
          reliability: "verified"
        });
      }
    }

    // If pure Crypto
    if (manualKind === "Crypto" && positionSymbol && positionQty) {
      const qty = parseFloat(positionQty) || 0;
      const buyPrice = parseFloat(positionBuyPrice) || 0;
      const currentPrice = parseFloat(positionCurrentPrice) || buyPrice;
      const value = qty * currentPrice;

      newAccount.value = value;

      const newPos: Position = {
        symbol: positionSymbol.toUpperCase(),
        name: positionSymbol.toUpperCase() + " (Crypto)",
        account: finalName,
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
          <p>Enregistrez vos comptes financiers, cryptos, biens immobiliers ou objets de valeur.</p>
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
            <Search size={22} />
            <input
              type="text"
              placeholder="BoursoBank, Immobilier, Bitcoin, Rolex..."
              value={searchQuery}
              onChange={handleSearchChange}
              autoFocus
            />
          </div>

          {/* Smart suggestion banner for watch search */}
          {isSearchingWatch && (
            <div className="watch-banner panel" style={{
              background: "linear-gradient(90deg, rgba(232, 192, 140, 0.1) 0%, rgba(0,0,0,0) 100%)",
              border: "1px dashed var(--gold, #E8C08C)",
              borderRadius: "16px",
              padding: "16px 20px",
              marginBottom: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <Watch size={24} style={{ color: "var(--gold, #E8C08C)" }} />
                <div>
                  <strong style={{ color: "#FCFCFC", fontSize: "14px" }}>Ajouter une montre de luxe ou un objet précieux</strong>
                  <p style={{ color: "var(--muted-2)", fontSize: "11px", margin: "2px 0 0 0" }}>
                    Enregistrez une montre (Rolex, AP, Cartier...) avec sa marque, son PRU et sa valeur estimée.
                  </p>
                </div>
              </div>
              <button className="primary-button" style={{ padding: "8px 16px", fontSize: "12px", background: "var(--gold, #E8C08C)", color: "#000", border: "none", borderRadius: "20px", fontWeight: "600", cursor: "pointer" }} onClick={() => {
                const watchCat = (assetCategories.find(c => c.id === "watches") || assetCategories[4]) as typeof assetCategories[0];
                handleSelectCategory(watchCat);
              }}>
                Ajouter maintenant
              </button>
            </div>
          )}

          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--muted-2)", letterSpacing: "0.05em", marginBottom: "16px" }}>
              Établissements & Plateformes populaires
            </h2>
            {filteredInstitutions.length > 0 ? (
              <div className="institutions-grid">
                {filteredInstitutions.map(inst => (
                  <button
                    key={inst.id}
                    className="inst-card"
                    onClick={() => handleSelectInstitution(inst)}
                  >
                    <div className="inst-card__logo-wrapper">
                      <span className="inst-card__logo" style={{ background: inst.bg }}>
                        {inst.logo}
                      </span>
                      <span className="inst-card__badge">
                        <LockKeyhole size={8} />
                      </span>
                    </div>
                    <div className="inst-card__info">
                      <strong>{inst.name}</strong>
                      <small>{inst.type}</small>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--muted-2)", fontSize: "13px" }}>Aucun établissement populaire trouvé pour « {searchQuery} »</p>
            )}
          </div>

          <div>
            <h2 style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--muted-2)", letterSpacing: "0.05em", marginBottom: "16px" }}>
              Toutes les catégories (Ajout manuel)
            </h2>
            {filteredCategories.length > 0 ? (
              <div className="categories-grid">
                {filteredCategories.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      className="category-card"
                      onClick={() => handleSelectCategory(cat)}
                    >
                      <svg className="category-card__bg-illustration" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />
                        <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                        <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                      </svg>
                      <span className="category-card__icon" style={{ background: `${cat.color}12`, color: cat.color }}>
                        <Icon size={20} />
                      </span>
                      <div className="category-card__info">
                        <strong>{cat.name}</strong>
                        <small>{cat.desc}</small>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: "var(--muted-2)", fontSize: "13px" }}>Aucune catégorie trouvée pour « {searchQuery} »</p>
            )}
          </div>
        </div>
      )}

      {step === "connect" && selectedInst && (
        <div className="cw-connect-container panel" style={{ maxWidth: "600px", margin: "40px auto", padding: "32px", borderRadius: "24px" }}>
          <header className="panel__header" style={{ border: "none", marginBottom: "24px", padding: 0 }}>
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: "700" }}>Connexion sécurisée</h2>
              <p style={{ color: "var(--muted-2)", fontSize: "13px" }}>Synchronisation automatique avec {selectedInst.name}</p>
            </div>
          </header>

          <div className="connect-flow-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "24px" }}>
            <div className="connect-logos-row" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <BrandLogo variant="mark" />
              <div className="connect-connector-line" style={{ width: "80px", height: "1px", background: "rgba(255,255,255,0.1)", position: "relative" }}>
                <span className="lock-dot" style={{ position: "absolute", top: "-8px", left: "32px", background: "#E8C08C", color: "#000", borderRadius: "50%", padding: "2px" }}><LockKeyhole size={10}/></span>
              </div>
              <span className="inst-avatar inst-avatar--large" style={{ width: "54px", height: "54px", borderRadius: "50%", background: selectedInst.bg, display: "flex", alignItems: "center", fontWeight: "bold", fontSize: "18px", color: "#000", justifyContent: "center" }}>{selectedInst.logo}</span>
            </div>

            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#FCFCFC" }}>Connexion en cours de préparation</h3>
            <p className="connect-subtitle" style={{ fontSize: "13px", color: "var(--muted-2)", maxWidth: "460px", lineHeight: "1.6" }}>
              Ostiro Atlas se connecte via une interface technique cryptée en lecture seule. Vos identifiants ne sont jamais stockés par l'application.
            </p>

            <div className="compatible-accounts" style={{ textAlign: "left", width: "100%", background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "16px", padding: "16px", fontSize: "12px", color: "var(--muted-2)" }}>
              <strong style={{ color: "#FCFCFC", display: "block", marginBottom: "8px" }}>Comptes potentiellement compatibles :</strong>
              <ul style={{ paddingLeft: "16px", margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                <li>Compte courant & compte de dépôt</li>
                <li>Livrets d'épargne réglementés (Livret A, LDDS)</li>
                <li>PEA, Compte-Titres (CTO) et assurance-vie (si gérés par {selectedInst.name})</li>
              </ul>
            </div>

            <div className="alert-box alert-box--warning" style={{ display: "flex", gap: "12px", textAlign: "left", background: "rgba(232, 192, 140, 0.05)", border: "1px solid rgba(232, 192, 140, 0.15)", borderRadius: "16px", padding: "16px" }}>
              <AlertTriangle size={24} style={{ color: "var(--gold, #E8C08C)", flexShrink: 0 }} />
              <div>
                <strong style={{ color: "#FCFCFC", fontSize: "13px" }}>Connexion automatique bientôt disponible</strong>
                <p style={{ color: "var(--muted-2)", fontSize: "11px", margin: "4px 0 0 0", lineHeight: "1.5" }}>
                  Dans cette version locale et gratuite d'Ostiro Atlas, l'agrégation directe nécessite un fournisseur compatible (Powens, Bridge ou GoCardless). Vous pouvez utiliser l'import de fichier CSV ou la saisie manuelle à la place.
                </p>
              </div>
            </div>

            <div className="connect-actions" style={{ display: "flex", flexDirection: "column", width: "100%", gap: "10px", marginTop: "16px" }}>
              <button className="primary-button" style={{ background: "rgba(255,255,255,0.05)", color: "var(--muted-2)", cursor: "not-allowed", border: "none", padding: "12px", borderRadius: "12px", fontWeight: "600" }} disabled>
                Connexion automatique indisponible
              </button>
              <button className="secondary-button" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px", borderRadius: "12px" }} onClick={() => {
                navigate("imports");
              }}>
                <FileInput size={16} /> Importer un CSV à la place
              </button>
              <button className="secondary-button" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px", borderRadius: "12px" }} onClick={() => {
                const genericCat = (assetCategories.find(c => c.name.toLowerCase().includes(selectedInst.type.toLowerCase())) ?? assetCategories[0]) as typeof assetCategories[0];
                handleSelectCategory(genericCat);
              }}>
                <Plus size={16} /> Ajouter manuellement
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "manual" && selectedCat && (
        <div className="cw-manual-container panel" style={{ maxWidth: "700px", margin: "40px auto", padding: "32px", borderRadius: "24px" }}>
          <header className="panel__header" style={{ border: "none", marginBottom: "24px", padding: 0 }}>
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: "700" }}>Ajout manuel — {manualKind}</h2>
              <p style={{ color: "var(--muted-2)", fontSize: "13px" }}>Renseignez les informations de votre actif</p>
            </div>
          </header>

          <form className="manual-form" onSubmit={handleAddManualAsset}>
            {/* If WATCH / LUXURY ASSET selected */}
            {selectedCat.id === "watches" ? (
              <div className="form-sub-section" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "center", background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)", padding: "16px", borderRadius: "16px", marginBottom: "8px" }}>
                  <Watch size={32} style={{ color: "var(--gold, #E8C08C)" }} />
                  <div>
                    <strong style={{ color: "#FCFCFC", fontSize: "14px" }}>Montre de Collection & Objet Précieux</strong>
                    <p style={{ color: "var(--muted-2)", fontSize: "11px", margin: "2px 0 0 0" }}>Enregistrez une montre (Rolex, Patek Philippe, Audemars Piguet...) pour valoriser votre patrimoine.</p>
                  </div>
                </div>

                <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <label className="field">
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted-2)", display: "block", marginBottom: "8px" }}>Marque (Manufacture)</span>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Rolex, Audemars Piguet..."
                      value={watchBrand}
                      onChange={e => setWatchBrand(e.target.value)}
                      className="input-line"
                      style={{ fontSize: "16px", padding: "8px 0", marginBottom: 0 }}
                    />
                  </label>

                  <label className="field">
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted-2)", display: "block", marginBottom: "8px" }}>Modèle / Collection</span>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Submariner Date, Royal Oak..."
                      value={watchModel}
                      onChange={e => setWatchModel(e.target.value)}
                      className="input-line"
                      style={{ fontSize: "16px", padding: "8px 0", marginBottom: 0 }}
                    />
                  </label>
                </div>

                <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <label className="field">
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted-2)", display: "block", marginBottom: "8px" }}>Prix d'acquisition (PRU)</span>
                    <div className="input-currency-wrapper" style={{ display: "flex", alignItems: "baseline", borderBottom: "2px solid rgba(255,255,255,0.15)" }}>
                      <input
                        type="text"
                        required
                        placeholder="Ex: 8 500"
                        value={watchBuyPrice}
                        onChange={e => { setWatchBuyPrice(e.target.value); if(!watchEstValue) setWatchEstValue(e.target.value); }}
                        className="input-line"
                        style={{ borderBottom: "none", fontSize: "16px", padding: "8px 0", marginBottom: 0, width: "100%" }}
                      />
                      <span style={{ color: "var(--muted-2)", fontWeight: "600", fontSize: "13px" }}>{manualCurrency}</span>
                    </div>
                  </label>

                  <label className="field">
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted-2)", display: "block", marginBottom: "8px" }}>Valeur estimée actuelle</span>
                    <div className="input-currency-wrapper" style={{ display: "flex", alignItems: "baseline", borderBottom: "2px solid rgba(255,255,255,0.15)" }}>
                      <input
                        type="text"
                        required
                        placeholder="Ex: 12 500"
                        value={watchEstValue}
                        onChange={e => { setWatchEstValue(e.target.value); setManualValue(e.target.value); }}
                        className="input-line"
                        style={{ borderBottom: "none", fontSize: "16px", padding: "8px 0", marginBottom: 0, width: "100%" }}
                      />
                      <span style={{ color: "var(--muted-2)", fontWeight: "600", fontSize: "13px" }}>{manualCurrency}</span>
                    </div>
                  </label>
                </div>

                <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                  <label className="field">
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted-2)", display: "block", marginBottom: "8px" }}>Année d'acquisition</span>
                    <input
                      type="number"
                      placeholder="Ex: 2024"
                      value={watchYear}
                      onChange={e => setWatchYear(e.target.value)}
                      className="input-line"
                      style={{ fontSize: "16px", padding: "8px 0", marginBottom: 0 }}
                    />
                  </label>

                  <label className="field">
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted-2)", display: "block", marginBottom: "8px" }}>Style de montre</span>
                    <select
                      value={watchStyle}
                      onChange={e => setWatchStyle(e.target.value)}
                      style={{ background: "transparent", border: "none", borderBottom: "2px solid rgba(255,255,255,0.15)", color: "#FCFCFC", padding: "8px 0", fontSize: "14px", outline: "none", width: "100%", marginTop: "4px" }}
                    >
                      <option value="Sport">Sport / Acier</option>
                      <option value="Dress">Habillée / Cuir</option>
                      <option value="Gold">Or / Métal précieux</option>
                      <option value="Vintage">Vintage / Collection</option>
                      <option value="Pocket">Gousset / Autre</option>
                    </select>
                  </label>

                  <label className="field">
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted-2)", display: "block", marginBottom: "8px" }}>Numéro de série (Optionnel)</span>
                    <input
                      type="text"
                      placeholder="Ex: M12345..."
                      value={watchSerialNumber}
                      onChange={e => setWatchSerialNumber(e.target.value)}
                      className="input-line"
                      style={{ fontSize: "16px", padding: "8px 0", marginBottom: 0 }}
                    />
                  </label>
                </div>
              </div>
            ) : (
              /* STANDARD FORM FOR OTHER CATEGORIES */
              <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <label className="field">
                  <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted-2)", display: "block", marginBottom: "8px" }}>Nom de l'actif / du compte</span>
                  <input
                    type="text"
                    required
                    placeholder={`Ex: Mon ${manualKind}`}
                    value={manualName}
                    onChange={e => setManualName(e.target.value)}
                    className="input-line"
                    style={{ fontSize: "16px", padding: "8px 0", marginBottom: 0 }}
                  />
                </label>

                <label className="field">
                  <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted-2)", display: "block", marginBottom: "8px" }}>Établissement / Banque / Courtier</span>
                  <input
                    type="text"
                    placeholder="Ex: BoursoBank, Crédit Agricole..."
                    value={manualInstitution}
                    onChange={e => setManualInstitution(e.target.value)}
                    className="input-line"
                    style={{ fontSize: "16px", padding: "8px 0", marginBottom: 0 }}
                  />
                </label>

                <label className="field">
                  <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted-2)", display: "block", marginBottom: "8px" }}>
                    {manualKind === "Prêts & Dettes" ? "Capital restant dû" : "Solde / Valeur actuelle"}
                  </span>
                  <div className="input-currency-wrapper" style={{ display: "flex", alignItems: "baseline", borderBottom: "2px solid rgba(255,255,255,0.15)" }}>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 5 000"
                      value={manualValue}
                      onChange={e => setManualValue(e.target.value)}
                      className="input-line"
                      style={{ borderBottom: "none", fontSize: "16px", padding: "8px 0", marginBottom: 0, width: "100%" }}
                    />
                    <span style={{ color: "var(--muted-2)", fontWeight: "600", fontSize: "13px" }}>{manualCurrency}</span>
                  </div>
                </label>

                <label className="field">
                  <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted-2)", display: "block", marginBottom: "8px" }}>Devise</span>
                  <select
                    value={manualCurrency}
                    onChange={e => setManualCurrency(e.target.value)}
                    style={{ background: "transparent", border: "none", borderBottom: "2px solid rgba(255,255,255,0.15)", color: "#FCFCFC", padding: "8px 0", fontSize: "14px", outline: "none", width: "100%", marginTop: "4px" }}
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="CHF">CHF (CHF)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </label>
              </div>
            )}

            {/* Specific Fields depending on Asset Kind */}
            {manualKind === "Livrets d'épargne" && (
              <div className="form-sub-section" style={{ marginTop: "24px" }}>
                <h3 style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--muted-2)", letterSpacing: "0.05em", marginBottom: "16px" }}>Options du livret</h3>
                <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                  <label className="field">
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted-2)", display: "block", marginBottom: "8px" }}>Taux d'intérêt annuel (%)</span>
                    <input
                      type="number"
                      step="0.05"
                      placeholder="Ex: 3"
                      value={interestRate}
                      onChange={e => setInterestRate(e.target.value)}
                      className="input-line"
                      style={{ fontSize: "16px", padding: "8px 0", marginBottom: 0 }}
                    />
                  </label>
                </div>
              </div>
            )}

            {(manualKind === "PEA" || manualKind === "CTO") && (
              <div className="form-sub-section" style={{ marginTop: "24px" }}>
                <h3 style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--muted-2)", letterSpacing: "0.05em", marginBottom: "16px" }}>Portefeuille & Espèces</h3>
                <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "20px" }}>
                  <label className="field">
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted-2)", display: "block", marginBottom: "8px" }}>Solde espèces du compte (liquidités)</span>
                    <input
                      type="number"
                      placeholder="Ex: 1500"
                      value={cashBalance}
                      onChange={e => setCashBalance(e.target.value)}
                      className="input-line"
                      style={{ fontSize: "16px", padding: "8px 0", marginBottom: 0 }}
                    />
                  </label>
                </div>

                <h4 style={{ marginTop: "20px", marginBottom: "12px", fontSize: "10px", textTransform: "uppercase", color: "var(--gold, #E8C08C)", letterSpacing: "0.05em", fontWeight: "700" }}>
                  Ajouter une première ligne (action ou ETF)
                </h4>
                <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                  <label className="field">
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted-2)", display: "block", marginBottom: "8px" }}>Symbole / Ticker ou ISIN</span>
                    <input
                      type="text"
                      placeholder="Ex: CW8, MC, MSFT..."
                      value={positionSymbol}
                      onChange={e => setPositionSymbol(e.target.value)}
                      className="input-line"
                      style={{ fontSize: "16px", padding: "8px 0", marginBottom: 0 }}
                    />
                  </label>
                  <label className="field">
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted-2)", display: "block", marginBottom: "8px" }}>Quantité détenue</span>
                    <input
                      type="number"
                      step="any"
                      placeholder="Ex: 10"
                      value={positionQty}
                      onChange={e => setPositionQty(e.target.value)}
                      className="input-line"
                      style={{ fontSize: "16px", padding: "8px 0", marginBottom: 0 }}
                    />
                  </label>
                  <label className="field">
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted-2)", display: "block", marginBottom: "8px" }}>Prix d'achat unitaire (PRU)</span>
                    <input
                      type="number"
                      step="any"
                      placeholder="Ex: 400"
                      value={positionBuyPrice}
                      onChange={e => setPositionBuyPrice(e.target.value)}
                      className="input-line"
                      style={{ fontSize: "16px", padding: "8px 0", marginBottom: 0 }}
                    />
                  </label>
                  <label className="field">
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted-2)", display: "block", marginBottom: "8px" }}>Valeur actuelle unitaire (cours)</span>
                    <input
                      type="number"
                      step="any"
                      placeholder="Ex: 480"
                      value={positionCurrentPrice}
                      onChange={e => setPositionCurrentPrice(e.target.value)}
                      className="input-line"
                      style={{ fontSize: "16px", padding: "8px 0", marginBottom: 0 }}
                    />
                  </label>
                </div>
              </div>
            )}

            {manualKind === "Crypto" && (
              <div className="form-sub-section" style={{ marginTop: "24px" }}>
                <h3 style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--muted-2)", letterSpacing: "0.05em", marginBottom: "16px" }}>Actif Cryptographique</h3>
                <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                  <label className="field">
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted-2)", display: "block", marginBottom: "8px" }}>Symbole (ex: BTC, ETH)</span>
                    <input
                      type="text"
                      placeholder="Ex: BTC"
                      value={positionSymbol}
                      onChange={e => setPositionSymbol(e.target.value)}
                      className="input-line"
                      style={{ fontSize: "16px", padding: "8px 0", marginBottom: 0 }}
                    />
                  </label>
                  <label className="field">
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted-2)", display: "block", marginBottom: "8px" }}>Quantité de tokens</span>
                    <input
                      type="number"
                      step="any"
                      placeholder="Ex: 0.25"
                      value={positionQty}
                      onChange={e => setPositionQty(e.target.value)}
                      className="input-line"
                      style={{ fontSize: "16px", padding: "8px 0", marginBottom: 0 }}
                    />
                  </label>
                  <label className="field">
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted-2)", display: "block", marginBottom: "8px" }}>Prix d'achat unitaire</span>
                    <input
                      type="number"
                      step="any"
                      placeholder="Ex: 60000"
                      value={positionBuyPrice}
                      onChange={e => setPositionBuyPrice(e.target.value)}
                      className="input-line"
                      style={{ fontSize: "16px", padding: "8px 0", marginBottom: 0 }}
                    />
                  </label>
                  <label className="field">
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted-2)", display: "block", marginBottom: "8px" }}>Valeur actuelle unitaire (cours)</span>
                    <input
                      type="number"
                      step="any"
                      placeholder="Ex: 65000"
                      value={positionCurrentPrice}
                      onChange={e => setPositionCurrentPrice(e.target.value)}
                      className="input-line"
                      style={{ fontSize: "16px", padding: "8px 0", marginBottom: 0 }}
                    />
                  </label>
                </div>
              </div>
            )}

            {manualKind === "Immobilier" && (
              <div className="form-sub-section" style={{ marginTop: "24px" }}>
                <h3 style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--muted-2)", letterSpacing: "0.05em", marginBottom: "16px" }}>Détails du bien immobilier</h3>
                <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                  <label className="field">
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted-2)", display: "block", marginBottom: "8px" }}>Type de bien</span>
                    <select
                      value={propertyType}
                      onChange={e => setPropertyType(e.target.value)}
                      style={{ background: "transparent", border: "none", borderBottom: "2px solid rgba(255,255,255,0.15)", color: "#FCFCFC", padding: "8px 0", fontSize: "14px", outline: "none", width: "100%", marginTop: "4px" }}
                    >
                      <option value="Résidence principale">Résidence principale</option>
                      <option value="Résidence secondaire">Résidence secondaire</option>
                      <option value="Appartement locatif">Appartement locatif</option>
                      <option value="Maison">Maison</option>
                      <option value="SCPI">SCPI</option>
                      <option value="Terrain">Terrain</option>
                    </select>
                  </label>
                  <label className="field">
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted-2)", display: "block", marginBottom: "8px" }}>Ville / Région</span>
                    <input
                      type="text"
                      placeholder="Ex: Lyon, Paris..."
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="input-line"
                      style={{ fontSize: "16px", padding: "8px 0", marginBottom: 0 }}
                    />
                  </label>
                  <label className="field">
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted-2)", display: "block", marginBottom: "8px" }}>Crédit associé (Capital restant dû)</span>
                    <input
                      type="number"
                      placeholder="Ex: 120000"
                      value={associatedLoan}
                      onChange={e => setAssociatedLoan(e.target.value)}
                      className="input-line"
                      style={{ fontSize: "16px", padding: "8px 0", marginBottom: 0 }}
                    />
                  </label>
                </div>
              </div>
            )}

            {manualKind === "Prêts & Dettes" && (
              <div className="form-sub-section" style={{ marginTop: "24px" }}>
                <h3 style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--muted-2)", letterSpacing: "0.05em", marginBottom: "16px" }}>Caractéristiques du crédit / de la dette</h3>
                <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                  <label className="field">
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted-2)", display: "block", marginBottom: "8px" }}>Taux d'intérêt annuel (%)</span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Ex: 3.5"
                      value={loanRate}
                      onChange={e => setLoanRate(e.target.value)}
                      className="input-line"
                      style={{ fontSize: "16px", padding: "8px 0", marginBottom: 0 }}
                    />
                  </label>
                  <label className="field">
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted-2)", display: "block", marginBottom: "8px" }}>Mensualité</span>
                    <input
                      type="number"
                      placeholder="Ex: 850"
                      value={monthlyPayment}
                      onChange={e => setMonthlyPayment(e.target.value)}
                      className="input-line"
                      style={{ fontSize: "16px", padding: "8px 0", marginBottom: 0 }}
                    />
                  </label>
                  <label className="field">
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted-2)", display: "block", marginBottom: "8px" }}>Date de fin de remboursement</span>
                    <input
                      type="date"
                      value={loanEndDate}
                      onChange={e => setLoanEndDate(e.target.value)}
                      className="input-line"
                      style={{ fontSize: "16px", padding: "8px 0", marginBottom: 0 }}
                    />
                  </label>
                </div>
              </div>
            )}

            <div className="form-actions" style={{ marginTop: "32px", display: "flex", gap: "12px" }}>
              <button type="submit" className="primary-button" style={{ background: "var(--gold, #E8C08C)", color: "#000", border: "none", padding: "12px 24px", borderRadius: "12px", fontWeight: "700", cursor: "pointer" }}>
                Enregistrer l'actif
              </button>
              <button type="button" className="secondary-button" style={{ padding: "12px 24px", borderRadius: "12px" }} onClick={resetState}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
