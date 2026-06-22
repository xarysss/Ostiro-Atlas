# Code signing policy

Ostiro Atlas publie ses versions Windows depuis le depot public
[`xarysss/Ostiro-Atlas`](https://github.com/xarysss/Ostiro-Atlas). Les binaires
signes doivent etre produits exclusivement par le workflow GitHub Actions du
depot a partir d'un tag de version public.

Free code signing provided by [SignPath.io](https://about.signpath.io),
certificate by [SignPath Foundation](https://signpath.org).

Cette mention s'applique aux versions dont la signature Authenticode est
valide. Les anciennes versions explicitement indiquees comme non signees ne
sont pas couvertes par cette politique.

## Roles

- Authors and committers: [xarysss](https://github.com/xarysss)
- Reviewers: [xarysss](https://github.com/xarysss)
- Signing approvers: [xarysss](https://github.com/xarysss)

Le responsable de signature maintient le code source, les scripts de build et
le workflow de release. Chaque demande de signature doit etre approuvee
manuellement dans SignPath avant publication.

## Release process

1. GitHub Actions construit l'application sur un runner Windows heberge par
   GitHub a partir du tag public et applique les metadonnees NSIS.
2. Le binaire principal ainsi prepare est envoye a SignPath, signe et verifie
   avant la creation de l'installateur final.
3. L'installateur qui contient ce binaire signe est ensuite envoye a SignPath,
   signe et verifie.
4. Le workflow refuse la publication si une signature Authenticode n'est pas
   valide.
5. Les fichiers signes et leurs sommes SHA-256 sont attaches a la GitHub
   Release correspondante.

Aucune cle privee de signature n'est stockee dans ce depot ou dans les secrets
GitHub. Les cles de la SignPath Foundation restent protegees par son service de
signature.

## Privacy

Ostiro Atlas ne transfere aucune information vers un autre systeme connecte au
reseau, sauf lorsqu'une action reseau est explicitement demandee par
l'utilisateur. Il n'inclut aucune telemetrie par defaut. Les details sont
publies dans la [politique de vie privee](PRIVACY.md).

## Verification

Sous Windows, une version signee peut etre verifiee avec :

```powershell
Get-AuthenticodeSignature .\OstiroAtlas-Setup.exe |
  Format-List Status, StatusMessage, SignerCertificate
```

Le statut attendu est `Valid`. La somme SHA-256 peut etre verifiee avec :

```powershell
Get-FileHash -Algorithm SHA256 .\OstiroAtlas-Setup.exe
```
