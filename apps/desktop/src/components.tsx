import type { LucideIcon } from "lucide-react";
import { CheckCircle2, ChevronRight, CircleAlert, Database, X } from "lucide-react";
import type { ReactNode } from "react";
import { reliabilityLabels, type ReliabilityStatus } from "@ostiro/shared";

const euroFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const euroPreciseFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

export const euro = (value: number) => euroFormatter.format(value);
export const euroPrecise = (value: number) => euroPreciseFormatter.format(value);

export function ReliabilityBadge({ status, compact = false }: { status: ReliabilityStatus; compact?: boolean }) {
  return (
    <span className={`reliability reliability--${status}`} title={`Statut de fiabilité : ${reliabilityLabels[status]}`}>
      <span className="reliability__dot" />
      {!compact && reliabilityLabels[status]}
    </span>
  );
}

export interface TraceInfo {
  title: string;
  value: string;
  status: ReliabilityStatus;
  asOf: string;
  source: string;
  formula: string;
  explanation: string;
  missing?: string[];
}

export function MetricCard({
  label,
  value,
  change,
  icon: Icon,
  status,
  onInspect,
}: {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  status: ReliabilityStatus;
  onInspect: () => void;
}) {
  return (
    <button className="metric-card" onClick={onInspect}>
      <div className="metric-card__top">
        <span className="metric-card__icon"><Icon size={17} /></span>
        <ReliabilityBadge status={status} compact />
      </div>
      <span className="metric-card__label">{label}</span>
      <strong>{value}</strong>
      <span className={change.startsWith("-") ? "negative" : "positive"}>{change}</span>
      <ChevronRight className="metric-card__arrow" size={16} />
    </button>
  );
}

export function Section({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel ${className}`}>
      <header className="panel__header">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

export function EmptyState({ icon: Icon = Database, title, detail, action }: {
  icon?: LucideIcon;
  title: string;
  detail: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon"><Icon size={24} /></span>
      <h3>{title}</h3>
      <p>{detail}</p>
      {action}
    </div>
  );
}

export function TraceDrawer({ trace, onClose }: { trace: TraceInfo | null; onClose: () => void }) {
  if (!trace) return null;
  return (
    <div className="drawer-layer" role="presentation" onMouseDown={onClose}>
      <aside className="trace-drawer" role="dialog" aria-modal="true" aria-label={`Détails de ${trace.title}`} onMouseDown={(event) => event.stopPropagation()}>
        <div className="trace-drawer__header">
          <div>
            <span className="eyebrow">Preuve du chiffre</span>
            <h2>{trace.title}</h2>
          </div>
          <button className="icon-button" aria-label="Fermer" onClick={onClose}><X size={19} /></button>
        </div>
        <div className="trace-value">
          <strong>{trace.value}</strong>
          <ReliabilityBadge status={trace.status} />
        </div>
        <p className="trace-explanation">{trace.explanation}</p>
        <dl className="trace-list">
          <div><dt>Source</dt><dd>{trace.source}</dd></div>
          <div><dt>Mise à jour</dt><dd>{trace.asOf}</dd></div>
          <div><dt>Formule</dt><dd>{trace.formula}</dd></div>
          <div><dt>Moteur</dt><dd>finance-engine@0.1.0</dd></div>
        </dl>
        {trace.missing?.length ? (
          <div className="trace-warning">
            <CircleAlert size={18} />
            <div><strong>Données manquantes</strong>{trace.missing.map((item) => <span key={item}>{item}</span>)}</div>
          </div>
        ) : (
          <div className="trace-success"><CheckCircle2 size={18} /> Historique suffisant pour ce calcul</div>
        )}
        <p className="trace-footnote">Les données sources ne sont jamais écrasées. Toute correction manuelle crée une entrée dans le journal d'audit.</p>
      </aside>
    </div>
  );
}
