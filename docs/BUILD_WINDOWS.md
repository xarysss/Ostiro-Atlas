# Construction Windows

## Poste de developpement

Installez Node.js 22+, pnpm 10+, Rust stable, Microsoft C++ Build Tools et
WebView2. Puis :

```powershell
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
pnpm installer
```

Tauri produit :

```text
artifacts/OstiroAtlas-Setup.exe
artifacts/OstiroAtlas-Portable.exe
apps/desktop/src-tauri/target/release/bundle/msi/Ostiro Atlas_0.4.0_x64_en-US.msi
```

NSIS installe pour l'utilisateur courant, ajoute le menu Demarrer et un
desinstalleur. Il embarque le bootstrapper WebView2. L'utilisateur final
n'installe ni Node.js, ni Rust, ni Docker, ni PostgreSQL.

`pnpm installer` active `VITE_PUBLIC_BUILD=true`. Le binaire conserve
l'onboarding local mais ne presente ni compte de demonstration, ni menu
developpeur. Pour compiler volontairement la variante de contribution :

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/build-windows.ps1 -Developer
```

## Releases signees

Le workflow `release-windows.yml` se declenche sur un tag `v*`. Il teste le
projet puis soumet les binaires a SignPath en deux temps :

1. les metadonnees NSIS sont appliquees, puis le binaire principal est signe ;
2. l'installateur final est signe apres sa creation.

Le workflow verifie les deux signatures Authenticode et refuse toute
publication si leur statut n'est pas `Valid`. Il joint ensuite les executables
signes et leurs sommes SHA-256 a la GitHub Release.

Le GitHub Environment `code-signing` doit contenir :

- le secret `SIGNPATH_API_TOKEN` ;
- les variables `SIGNPATH_ORGANIZATION_ID`, `SIGNPATH_PROJECT_SLUG` et
  `SIGNPATH_SIGNING_POLICY_SLUG` fournies apres acceptation du projet.

Voir [CODE_SIGNING_POLICY.md](CODE_SIGNING_POLICY.md) pour les roles, les
controles de release et la verification utilisateur.

## Mises a jour

La V1 accepte toujours une mise a jour manuelle par nouvel installateur, sans
deplacer les donnees `AppData`. Le verificateur GitHub Releases sera opt-in.
L'auto-update ne sera active qu'apres signature cryptographique et test de
retour arriere.
