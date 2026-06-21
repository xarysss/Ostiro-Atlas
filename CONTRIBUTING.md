# Contribuer à Ostiro Atlas

Merci de contribuer à un outil financier où une erreur silencieuse peut coûter cher. La priorité est la justesse explicable, pas le nombre de fonctionnalités.

## Installation

```bash
git clone https://github.com/xarysss/Ostiro-Atlas.git
cd Ostiro-Atlas
pnpm install
pnpm test
pnpm typecheck
pnpm dev
```

Rust et les prérequis Tauri ne sont nécessaires que pour `pnpm desktop:dev` et `pnpm desktop:build`.

## Règles de contribution

- ouvrez une issue avant une modification large ;
- ne commitez jamais de données financières réelles, secret ou clé API ;
- ajoutez un test de non-régression pour tout bug de calcul ou d'import ;
- documentez formule, convention, cas incomplet et règle d'arrondi ;
- toute nouvelle valeur affichée doit respecter `TracedValue<T>` ;
- conservez les entrées brutes immuables et passez par une correction auditée ;
- gardez les fonctions réseau optionnelles et explicites.

## Ajouter un importeur

1. Ajoutez le parseur ou profil dans `packages/importers`.
2. Fournissez un CSV fictif minimal dans `examples/csv`.
3. Testez encodage, séparateur, guillemets, nombres français, dates, doublons et lignes invalides.
4. Ne transmettez jamais le contenu à un service externe.
5. Documentez les colonnes prises en charge et limites connues.

## Ajouter une formule

Une formule appartient à `packages/finance-engine`, reste pure et reçoit explicitement date, devise et hypothèses. Les tests doivent couvrir cas nominal, zéro, valeur négative, historique incomplet, devise et arrondis. Mettez aussi à jour `docs/FINANCIAL_FORMULAS.md`.

## Pull request

Une PR doit être ciblée, décrire les risques de données, inclure les commandes de vérification et ne pas mélanger un refactoring sans rapport. Le format du template est obligatoire.
