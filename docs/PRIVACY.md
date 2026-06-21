# Vie privée et RGPD

## Privacy by design

- profil local sans email obligatoire ;
- aucune télémétrie par défaut ;
- aucune dépendance cloud pour les fonctions principales ;
- fichiers CSV traités localement ;
- collecte minimale et finalité explicite ;
- fonctions réseau optionnelles, identifiables et désactivables.

## Droits et contrôles

L'utilisateur doit pouvoir exporter toutes les tables et leurs preuves, supprimer le profil et ses fichiers, révoquer chaque connecteur, gérer les consentements réseau et restaurer une sauvegarde sans service Ostiro.

Pour la V1, une suppression totale efface la base, ses fichiers WAL/SHM, les sauvegardes choisies et les secrets du coffre Windows après une confirmation forte. Un export doit rappeler qu'il contient des données sensibles.

## Chiffrement

Le dépôt prépare deux niveaux :

1. stockage des secrets optionnels dans Windows Credential Manager ;
2. base SQLCipher opt-in et sauvegarde `.owb` chiffrée par une clé dérivée avec Argon2id.

Le chiffrement n'est pas annoncé comme disponible avant ses tests de restauration et de perte de mot de passe. Aucun mot de passe maître, PIN, jeton bancaire ou clé API ne doit être journalisé.

## Connecteurs futurs

Les identifiants bancaires restent chez un prestataire DSP2. Ostiro ne reçoit que des jetons révocables en lecture seule. La politique de confidentialité devra nommer chaque prestataire, finalité, durée, territoire et sous-traitant avant activation.
