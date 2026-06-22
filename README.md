# Ostiro Atlas

> Toute ta vie financière, enfin cartographiée.

Ostiro Atlas est une application desktop open source, locale et gratuite pour suivre son patrimoine sans compte cloud. Elle privilégie la fiabilité des données : chaque chiffre calculé expose sa source, sa date, son niveau de confiance, sa formule et ses éventuelles limites.

## Ce qui fonctionne dans la V0.4

- application desktop Tauri 2, React et TypeScript ;
- écran d'accueil local-first avant le dashboard ;
- profils locaux multiples avec sélection, duplication et protection optionnelle ;
- onboarding rapide et personnalisé en deux écrans ;
- nouvelle identité indigo/lavande avec modes sombre et clair ;
- dashboard et navigation adaptés aux modules et au niveau de l'utilisateur ;
- mode développeur avec scénarios débutant, avancé et démonstration ;
- dashboard patrimoine et portefeuille avec compte de démonstration ;
- vues de santé des données et des synchronisations ;
- détails de provenance pour les montants affichés ;
- moteur financier indépendant et testé (PRU, plus-values, dividendes, frais, XIRR, TWR, allocation et devises) ;
- schéma et migrations SQLite local-first ;
- exemples CSV et jeu de données fictif ;
- builds Windows NSIS (`.exe`) et MSI préparés dans GitHub Actions.

La V1 reste volontairement limitée à l'ajout manuel, l'import CSV, les calculs fiables, les dividendes, les frais, les exports, les sauvegardes et la documentation. Les connexions bancaires, le cloud, le mobile, les transactions crypto et le conseil personnalisé sont hors périmètre.

Le build distribue par `pnpm installer` est un build public : il conserve le tutoriel de creation de profil, mais masque le compte de demonstration et tous les outils developpeur. La recherche sur les connexions bancaires locales est documentee dans [docs/OPEN_BANKING_RESEARCH.md](docs/OPEN_BANKING_RESEARCH.md).

## Site marketing

Le site public se trouve dans `apps/website`. Il contient quinze routes produit, securite, documentation, tarifs et telechargement.

```bash
pnpm website:dev
pnpm website:build
```

## Démarrage

Prérequis pour l'interface web de développement : Node.js 22+ et pnpm 10+.

```bash
pnpm install
pnpm dev
```

Pour la fenêtre desktop et l'installateur Windows, installez aussi les [prérequis Tauri pour Windows](https://v2.tauri.app/start/prerequisites/) (Rust, WebView2 et outils C++), puis :

```bash
pnpm desktop:dev
pnpm desktop:build
```

Les installateurs sont produits dans `apps/desktop/src-tauri/target/release/bundle/`.

Une prévisualisation web du compte démo peut aussi être lancée avec `docker compose up --build`, puis ouverte sur `http://127.0.0.1:1420`. Elle sert à la contribution et à la revue visuelle; le stockage financier SQLite reste une fonction de l'application desktop.

## Commandes

| Commande | Rôle |
| --- | --- |
| `pnpm dev` | Lance l'interface dans le navigateur |
| `pnpm desktop:dev` | Lance la fenêtre Tauri |
| `pnpm test` | Lance tous les tests unitaires |
| `pnpm typecheck` | Vérifie les types de tous les packages |
| `pnpm build` | Construit les packages et le frontend |
| `pnpm desktop:build` | Produit les installateurs Windows |
| `pnpm installer` | Produit `artifacts/OstiroAtlas-Setup.exe` prêt à distribuer |
| `pnpm website:dev` | Lance le site marketing sur `http://127.0.0.1:4173` |
| `pnpm website:build` | Construit les quinze pages statiques du site |

## Architecture

```text
apps/desktop                 Application Tauri + React
apps/website                 Site marketing React + Vite, quinze pages
packages/finance-engine     Calculs purs, documentés et testés
packages/database           Schéma SQLite, migrations et accès local
packages/shared             Contrats de données, fiabilité et audit
packages/importers          Pipeline d'import CSV local
examples/                   CSV et données fictives
docs/                       Architecture, formules, sécurité et produit
```

Les données brutes importées sont immuables. Les corrections sont stockées séparément dans un journal d'audit. Les valeurs dérivées sont recalculables à partir des sources. Voir [Fiabilité des données](docs/DATA_RELIABILITY.md) et [Formules financières](docs/FINANCIAL_FORMULAS.md).

## Vie privée et conformité

- fonctionnement hors ligne et sans inscription ;
- aucun identifiant bancaire stocké ;
- CSV traités sur l'ordinateur de l'utilisateur ;
- export et suppression totale des données ;
- fonctions fiscales présentées comme des estimations pédagogiques ;
- aucune recommandation personnalisée, initiation d'ordre ou conservation de crypto-actifs.

Consultez [SECURITY.md](SECURITY.md) et [docs/PRIVACY.md](docs/PRIVACY.md).

## Code signing policy

Les releases Windows signees sont construites sur GitHub Actions puis signees
par SignPath avant publication. Free code signing provided by
[SignPath.io](https://about.signpath.io), certificate by
[SignPath Foundation](https://signpath.org). Les roles, controles et commandes
de verification sont documentes dans la
[politique de signature](docs/CODE_SIGNING_POLICY.md).

## Contribuer

Les contributions sont les bienvenues. Lisez [CONTRIBUTING.md](CONTRIBUTING.md), le [code de conduite](CODE_OF_CONDUCT.md) et la [roadmap](ROADMAP.md). Les vulnérabilités doivent suivre la procédure privée décrite dans [SECURITY.md](SECURITY.md).

## Licence

Ostiro Atlas est distribué sous licence [AGPL-3.0](LICENSE). Cela garantit que les améliorations proposées comme service réseau restent accessibles à la communauté.
