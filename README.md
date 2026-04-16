# Invoice Management API

API backend sécurisée pour la gestion des factures fournisseurs, développée avec Node.js, Express et MongoDB.

## Fonctionnalités

- **Authentification JWT** : inscription, connexion, gestion de profil
- **Gestion des fournisseurs** : CRUD complet par client
- **Gestion des factures** : création, suivi de statut automatique
- **Paiements** : enregistrement partiel ou complet avec contrôle des montants
- **Dashboard** : statistiques et analyses par fournisseur
- **Isolation des données** : chaque client accède uniquement à ses propres données

## Stack technique

- Node.js + Express
- MongoDB + Mongoose
- JWT pour l'authentification
- Architecture REST

## Modèle de données

![Diagramme de classes](class_diagram_vertical.png)

**Relations :**
- Un **User** possède plusieurs **Suppliers**
- Un **User** crée plusieurs **Invoices**
- Un **Supplier** reçoit plusieurs **Invoices**
- Une **Invoice** contient plusieurs **Payments**

## Endpoints principaux

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion |
| GET | `/api/suppliers` | Liste des fournisseurs |
| POST | `/api/invoices` | Créer une facture |
| POST | `/api/invoices/:id/payments` | Enregistrer un paiement |
| GET | `/api/dashboard` | Statistiques globales |

## Statuts des factures

| Statut | Description |
|--------|-------------|
| `unpaid` | Aucun paiement enregistré |
| `partially_paid` | Paiement partiel reçu |
| `paid` | Facture entièrement payée |

## Installation

```bash
npm install
cp .env.example .env
npm run dev
```

## Variables d'environnement

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/invoice-api
JWT_SECRET=your_secret_key
```

## Licence

MIT
