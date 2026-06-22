# Connexions bancaires ouvertes et locales

Derniere verification : 22 juin 2026.

## Conclusion

Il n'existe pas de remplacement open source qui fournisse gratuitement, en production et sans contrat, la meme couverture bancaire et le meme cadre reglementaire que Powens, Plaid ou Bridge.

La piste gratuite la plus credible pour un mode local experimental est [Woob](https://gitlab.com/woob/woob). Woob est une bibliotheque LGPL qui normalise l'acces a des sites web et fournit une capacite bancaire commune. Le projet contient notamment des modules pour BNP Paribas, Boursorama, Credit Agricole, Credit Mutuel, Banque Populaire, Caisse d'Epargne, Societe Generale, BforBank et plusieurs courtiers.

Woob automatise toutefois les interfaces web des etablissements. Il ne transforme pas Ostiro Atlas en prestataire AISP et n'offre pas les garanties contractuelles d'un agregateur PSD2. Les changements de pages, CAPTCHA, MFA et conditions d'utilisation des banques peuvent interrompre un module.

## Architecture recommandee pour un pilote

```text
Application Ostiro Atlas
        |
        | API locale authentifiee, 127.0.0.1 uniquement
        v
Ostiro Local Banking Bridge
        |
        | adaptateur Woob, processus isole
        v
Modules bancaires Woob -> sites des banques
```

Regles minimales :

- aucune ecoute sur le reseau local, uniquement `127.0.0.1` ;
- jeton aleatoire ephemere entre Tauri et le bridge ;
- aucun identifiant dans SQLite, les logs ou les exports ;
- secrets conserves par le coffre du systeme d'exploitation lorsque le module l'autorise ;
- MFA realisee dans une fenetre dediee et jamais contournee ;
- lecture des comptes et transactions uniquement ;
- connecteurs desactives par defaut et clairement marques experimentaux ;
- statut de synchronisation, date, erreur et source visibles dans Ostiro ;
- tests contractuels par banque et interrupteur distant pour desactiver un module casse.

## Comparaison des options open source

| Option | Ce qu'elle apporte | Limite principale | Decision |
| --- | --- | --- | --- |
| [Woob](https://gitlab.com/woob/woob) | Modules locaux et modele bancaire commun, bonne presence francaise | Automatisation web fragile, MFA et maintenance continue | Meilleur candidat pour un pilote local |
| [Open Bank Project](https://github.com/OpenBankProject/OBP-API) | Plateforme Open Banking et API normalisee pour les banques | Ne fournit pas magiquement les connexions aux banques grand public | Utile cote banque, pas comme agregateur Ostiro |
| [nordigen-node](https://github.com/nordigen/nordigen-node) | Client open source pour l'API Nordigen | Depend toujours du service et des droits GoCardless | Pas une alternative autonome |
| [Actual Budget](https://github.com/actualbudget/actual) | Application locale open source avec synchronisation optionnelle | La synchronisation repose sur des fournisseurs externes | Reference d'architecture, pas fournisseur gratuit |

## Pourquoi le local ne suffit pas pour PSD2

Executer le code chez l'utilisateur protege mieux les secrets, mais ne donne pas a ce code les certificats, contrats ou autorisations necessaires aux API PSD2 de production. Une banque peut exiger un prestataire AISP identifie meme lorsque l'utilisateur final consent a l'acces.

Deux voies peuvent donc coexister :

1. **Ostiro Local** : saisie, CSV et connecteur Woob experimental pour les utilisateurs avances qui acceptent ses limites.
2. **Ostiro Connecte** : fournisseur PSD2 contractuel pour les clients qui attendent couverture, support et fiabilite commerciale.

Le pilote Woob doit rester separe du build public tant que les tests, l'analyse juridique et le modele de stockage des secrets ne sont pas termines.
