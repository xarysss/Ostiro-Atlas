# Formules financières

Toutes les sommes sont calculées avec `decimal.js` dans la devise de base. Les entrées en devise étrangère utilisent le taux historique de la transaction; la valorisation utilise le taux courant daté. Les arrondis servent uniquement à l'affichage.

## PRU et coût restant

Méthode actuelle : coût moyen pondéré mobile.

```text
coût après achat = coût précédent + quantité achetée × prix × FX historique + frais d'achat
PRU = coût restant / quantité restante
coût sorti lors d'une vente = quantité vendue × PRU avant vente
```

Une vente n'altère pas le PRU des titres restants. Si la quantité vendue dépasse la quantité reconstruite, l'historique devient incomplet et le moteur masque PRU et plus-values.

## Plus-values

```text
plus-value latente = quantité × prix actuel × FX actuel - coût restant
plus-value réalisée = Σ (produit net de vente - coût sorti)
produit net de vente = quantité vendue × prix × FX historique - frais de vente
```

## Dividendes et frais

```text
dividendes historiques = Σ montant encaissé × FX historique
frais explicites = Σ frais de transaction et frais isolés × FX historique
```

Les dividendes annoncés et estimés ne sont jamais mélangés au total encaissé. Le TER est une estimation de coût implicite et reste distinct des frais débités.

## Performance brute et nette

```text
gain de marché net = valeur finale + retraits - apports - valeur initiale
gain brut = gain net + frais + impôts
rendement = gain / valeur initiale
```

Les apports, retraits, revenus, frais et impôts sont conservés séparément. Une hausse du patrimoine causée par un versement n'est pas une performance.

## TWR

La période est découpée à chaque flux externe. Avec la convention actuelle, le flux est supposé en fin de sous-période :

```text
r_i = (valeur_fin_i - flux_externe_i) / valeur_début_i - 1
TWR = Π(1 + r_i) - 1
```

Si le moment exact d'un flux est inconnu, le statut doit passer à `estimated`.

## XIRR / TRI annualisé

Pour des flux datés `C_i`, avec `t_i` en années réelles depuis le premier flux :

```text
0 = Σ C_i / (1 + r)^t_i
```

Le moteur utilise Newton-Raphson puis une bissection bornée. Il renvoie `null` sans flux positif et négatif, ou sans solution détectable. La base annuelle est 365,2425 jours.

## Allocation et devises

```text
poids_i = valeur_i en devise de base / Σ valeurs incluses
exposition devise_j = Σ valeurs économiques exposées à j / valeur totale
impact devise = performance convertie - performance à FX constant
```

La devise du compte, celle de l'actif, celle de transaction et les deux taux de change sont conservés séparément.

## Fiscalité

Le prototype PFU calcule uniquement une estimation pédagogique paramétrable :

```text
base = max(0, plus-values réalisées + dividendes taxables - moins-values déductibles)
estimation = max(0, base × taux - retenues étrangères prises en compte)
```

Ce résultat est toujours `estimated`, daté et accompagné d'un avertissement. Il ne remplace ni IFU, ni déclaration, ni conseil professionnel. Les règles fiscales doivent être versionnées par juridiction et année avant une V1 fiscale.
