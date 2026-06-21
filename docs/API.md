# API et extensions

## V1

La V1 desktop n'expose aucun port réseau et n'a pas de backend HTTP. C'est une décision de sécurité et de simplicité, pas un oubli. React appelle un adaptateur local Tauri; celui-ci ouvre SQLite dans le répertoire applicatif de l'utilisateur.

Les contrats stables sont les packages TypeScript :

- `@ostiro/shared` pour provenance, fiabilité et audit ;
- `@ostiro/finance-engine` pour les calculs purs ;
- `@ostiro/importers` pour l'aperçu CSV ;
- `@ostiro/database` pour version et manifeste de sauvegarde.

## API future

Une future édition self-hosted serveur pourra exposer `/api/v1`, mais elle restera optionnelle et reprendra les mêmes frontières. Les premières ressources prévues sont comptes, transactions, actifs, prix, dividendes, frais, imports, exports, objectifs, audit et santé des données.

Chaque réponse financière devra transporter `value`, `asOf`, `reliability`, `sources` et `trace`. Les corrections utiliseront un contrôle de version optimiste et exigeront une raison. Aucun endpoint d'ordre, paiement, conseil ou conservation crypto n'est prévu sans cadre réglementaire adapté.
