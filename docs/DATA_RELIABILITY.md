# Fiabilité des données

## Règle non négociable

Chaque chiffre financier affiché doit fournir :

1. sa ou ses sources ;
2. la date d'observation ou de mise à jour ;
3. un statut et un score de fiabilité ;
4. la formule et la version du moteur ;
5. les données manquantes et hypothèses.

Le contrat TypeScript est `TracedValue<T>` dans `packages/shared`. Une valeur peut être `null`. Ce cas est préférable à une certitude inventée.

## Statuts

| Statut | Usage |
| --- | --- |
| `verified` | Historique complet et source contrôlée par l'utilisateur |
| `reliable` | Calcul reproductible, sans anomalie connue |
| `estimated` | Une hypothèse ou donnée de marché indirecte intervient |
| `partial` | Historique insuffisant; certaines métriques sont masquées |
| `stale` | Source trop ancienne pour l'usage affiché |
| `unknown` | Provenance ou qualité non déterminée |

Le score (0 à 100) aide au tri, mais le statut et ses raisons restent l'information principale. Un score agrégé est pondéré par la valeur et ne doit jamais faire disparaître une anomalie bloquante.

## Historique incomplet

Un compte est incomplet quand le premier événement connu n'explique pas son solde ou ses positions, quand une vente dépasse la quantité reconstruite, ou quand une période déclarée complète contient des ruptures.

Dans ce mode :

- quantité et valeur de marché peuvent rester visibles si leurs sources existent ;
- PRU, plus-values et performance dépendant du passé deviennent `null` ;
- dividendes connus restent affichés comme minimum historique, pas comme total certain ;
- l'interface propose un ancien CSV, un solde initial ou une marque explicite d'estimation.

## Contrôles

- doublons par empreinte date, montant, libellé normalisé, devise et compte ;
- cohérence devise compte / actif / transaction ;
- taux de change historique présent ou signalé comme substitué ;
- ventes sans quantité disponible ;
- actifs non reconnus ;
- prix obsolètes ;
- champs requis absents ;
- rupture de séquence et solde inexpliqué.

## Audit

Une correction manuelle n'efface jamais la source. `corrections` contient la modification métier; `audit_log` garde l'événement lisible. Les métriques concernées sont invalidées et recalculées. L'utilisateur peut ainsi expliquer toute variation provoquée par une correction.
