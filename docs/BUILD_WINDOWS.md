# Construction Windows

## Poste de développement

Installez Node.js 22+, pnpm 10+, Rust stable, Microsoft C++ Build Tools et WebView2. Puis :

```powershell
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
pnpm desktop:build
```

Tauri produit :

```text
apps/desktop/src-tauri/target/release/bundle/nsis/Ostiro Atlas_0.1.0_x64-setup.exe
apps/desktop/src-tauri/target/release/bundle/msi/Ostiro Atlas_0.1.0_x64_en-US.msi
```

NSIS installe pour l'utilisateur courant, ajoute le menu Démarrer et un désinstalleur. Il embarque le bootstrapper WebView2. L'utilisateur final n'installe ni Node.js, ni Rust, ni Docker, ni PostgreSQL.

## Releases

Le workflow `release-windows.yml` se déclenche sur un tag `v*`. Il teste TypeScript, compile sous Windows et joint les bundles à une GitHub Release en brouillon.

Avant une release publique stable :

1. obtenir un certificat de signature de code ;
2. signer l'exécutable, l'installeur et le manifeste de mise à jour ;
3. protéger les clés dans GitHub Environments ;
4. tester installation, mise à niveau, conservation de la base et désinstallation ;
5. publier les sommes SHA-256 et le changelog.

## Mises à jour

La V1 accepte toujours une mise à jour manuelle par nouvel installateur, sans déplacer les données `AppData`. Le vérificateur GitHub Releases sera opt-in. L'auto-update ne sera activé qu'après signature cryptographique et test de retour arrière.
