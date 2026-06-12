# Project context
Dans le quotidien des entreprises et freelances, la gestion des factures fournisseurs nécessite des outils fiables permettant de suivre les paiements, analyser les dépenses et gérer les relations avec les fournisseurs.

Dans ce projet, vous allez développer une application React (SPA) connectée à une API backend existante.

L’objectif est de :

consommer une API sécurisée (JWT)
gérer l’état global de l’application (authentification, données)
naviguer entre plusieurs pages
afficher dynamiquement les données
centraliser la logique métier côté frontend
Fonctionnalités
## 1 - Authentification

Routes :

/login
/register
Fonctionnalités :

inscription utilisateur
connexion avec récupération du token JWT
stockage du token (localStorage)
récupération du profil (/api/auth/me)
## 2 - Landing / Dashboard (/)

Afficher une vue globale :

total des factures
total des dépenses
factures en retard
avec percentage calcule

## 3 - Gestion des fournisseurs

Routes :

/suppliers
/suppliers/:id

Fonctionnalités :

Liste (/suppliers)

afficher tous les fournisseurs
navigation vers détail (leur facteur et paiments)
Détail (/suppliers/:id)

Créer un nouveau fournisseur.

## 4 - Gestion des factures

Routes :

/invoices
/invoices/:id
Fonctionnalités :

Liste (/invoices)
afficher toutes les factures
filtres : statut (unpaid, partially_paid, paid)
afficher : montant, date d’échéance, statut
Détail (/invoices/:id)
informations complètes : fournisseur, montant, statut, date
afficher les paiements associés
Créer une nouvelle facture.
## 5 - Gestion des paiements

Intégré dans :

/invoices/:id
Fonctionnalités :

ajouter un paiement
afficher la liste des paiements
mise à jour dynamique du statut
## 6 - Navigation (Routing)

Pages principales :

/ → Dashboard
/login → Authentification
/register → Inscription
/suppliers → Liste fournisseurs
/suppliers/:id → Détail fournisseur
/invoices → Liste factures
/invoices/:id → Détail facture
Cas d’usage :
accès au token dans toutes les requêtes
protection des routes (PrivateRoute)
mise à jour globale après actions (paiement, login…)
