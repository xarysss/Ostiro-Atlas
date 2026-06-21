# Politique de sécurité

## Signaler une vulnérabilité

N'ouvrez pas d'issue publique. Utilisez **GitHub Security Advisories > Report a vulnerability** sur ce dépôt. Incluez version, impact, scénario reproductible et correctif éventuel. Ne joignez aucune donnée financière réelle.

Le projet vise un premier accusé de réception sous 72 heures. Aucun programme de récompense n'est garanti.

## Périmètre sensible

- lecture ou export non autorisé de la base locale ;
- contournement du verrouillage ou du chiffrement ;
- exécution via CSV, sauvegarde ou protocole d'URL ;
- fuite de clé API, jeton, chemin ou contenu dans les logs ;
- mise à jour non signée ou substitution d'installateur ;
- injection SQL, XSS ou élévation de permissions Tauri.

## Principes

- permissions Tauri minimales et CSP restrictive ;
- requêtes SQLite paramétrées ;
- aucune donnée sensible dans les logs ;
- dépendances vérifiées en CI ;
- secrets uniquement dans les coffres locaux ou GitHub Secrets ;
- builds de release signés avant activation des mises à jour automatiques.

La version 0.1 est un prototype : le chiffrement de base, le verrouillage et les mises à jour automatiques ne sont pas encore disponibles et ne doivent pas être présentés comme tels.
