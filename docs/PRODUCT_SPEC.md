# Spécification produit V1

## Promesse

**Toute ta vie financière, enfin cartographiée.**

Ostiro Atlas aide un utilisateur français à suivre localement son patrimoine et à comprendre la qualité de chaque chiffre. La V1 est une application Windows gratuite, open source, hors ligne et sans inscription.

## Périmètre strict

### Inclus

- profil local, devise principale et compte démo ;
- comptes et actifs manuels ;
- assistant CSV avec mapping, validation, doublons et historique ;
- dashboard net, portefeuille PEA/CTO, crypto suivie et immobilier manuel ;
- PRU, plus-values, dividendes, frais, TWR, XIRR, allocation et devises ;
- statuts de fiabilité, historique incomplet et audit des corrections ;
- export JSON/CSV, sauvegarde locale et restauration ;
- installateur Windows, documentation et tests.

### Reporté

- banque ou courtier synchronisé, version cloud et mobile ;
- données de marché payantes ou centralisées ;
- achat/vente crypto, ordres, paiements et conservation ;
- conseil personnalisé et déclaration fiscale officielle.

## Écrans prioritaires

| Écran | But | Erreurs et états particuliers |
| --- | --- | --- |
| Premier lancement | Créer profil, devise, thème, chiffrement, vide/démo | Annulation et mot de passe perdu expliqués |
| Dashboard | Net, apports, performance, allocation, alertes | Chiffre manquant plutôt que zéro inventé |
| Patrimoine | Actifs, passifs, comptes, dates et qualité | Solde ancien ou passif sans échéancier |
| Portefeuille | Quantité, PRU, valeur et gains | Historique incomplet masque PRU/gains |
| Actif | Positions, transactions, preuve et audit | Actif non reconnu, devise incohérente |
| Import CSV | Aperçu, mapping, validation et résumé | Encodage, dates, doublons et lignes rejetées |
| Dividendes | Reçus, annoncés et estimés séparés | Retenue ou date inconnue |
| Frais | Explicites et implicites | TER estimé distinct d'un débit certain |
| Santé des données | Anomalies et actions recommandées | Contrôle interrompu ou source inaccessible |
| Synchronisations | Sources, dates, erreurs et révocation | En V1, explique clairement le mode local |
| Exports | Portabilité et sauvegarde | Espace disque, checksum, mot de passe |
| Sécurité | Verrouillage, chiffrement et réseau | Récupération impossible du mot de passe maître |

Tous les écrans ont chargement, état vide, erreur actionnable et contenu de démonstration. Une erreur ne doit jamais transformer une valeur inconnue en zéro.

## Ordre exact de développement

1. Contrats de provenance, fiabilité et audit.
2. Moteur financier pur avec jeux de référence.
3. Schéma SQLite, migrations et adaptateur Tauri.
4. Onboarding et profil local.
5. Compte démo et dashboard patrimonial.
6. CRUD manuel des comptes, actifs et transactions.
7. Assistant CSV générique et modèles sauvegardés.
8. Reconstruction des positions et résolution d'historique incomplet.
9. Dividendes, frais, TWR, XIRR et devises.
10. Santé des données et audit des corrections.
11. Exports, sauvegarde, restauration et suppression.
12. Chiffrement, verrouillage et tests de récupération.
13. Tests E2E, accessibilité et performance.
14. Signature de code, installeur et release publique.

## Critères de sortie V1

- aucune métrique patrimoniale sans provenance visible ;
- tests de calcul et d'import reproductibles ;
- fonctionnement hors ligne après installation ;
- mise à niveau conservant les données ;
- sauvegarde restaurée sur une installation neuve ;
- installateur signé, désinstalleur testé et checksum publié ;
- documentation utilisateur suffisante sans connaissance technique.
