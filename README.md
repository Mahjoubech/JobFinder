# JobFinder

Application de recherche d'emploi développée en Angular 17+, utilisant l'API "The Muse" pour les offres d'emploi et JSON Server pour la persistance des données locales (favoris, candidatures).

## 📋 Fonctionnalités

Cette application respecte les consignes du brief technique :

### Fonctionnalités Principales
- **Recherche d'emploi** :
  - Consommation de l'API publique **The Muse**.
  - Recherche par mots-clés, localisation et filtres (niveau, entreprise).
  - Pagination et tri des résultats.
- **Gestion des Favoris (NgRx)** :
  - Ajout/Suppression des offres en favoris.
  - Persistance via JSON Server.
  - Gestion d'état centralisée avec **NgRx** (Actions, Reducers, Selectors, Effects).
- **Candidatures** :
  - Postuler à une offre (formulaire réactif).
  - Suivi des candidatures (En attente, Accepté, Refusé).
  - Ajout de notes personnelles pour chaque candidature.
- **Authentification Simulé** :
  - Connexion/Déconnexion (email/nom).
  - Stockage du profil utilisateur dans **localStorage** (session persistante).
  - Protection des routes via **AuthGuard** (accès aux favoris/candidatures).

### Aspects Techniques
- **Architecture Modulaire** :
  - Structure claire : `Core` (services, modèles), `Features` (pages), `Shared` (composants réutilisables), `Store`.
  - **Lazy Loading** : Chargement différé des modules de fonctionnalités (ex: `MyJobs`).
- **Design & UI** :
  - **Tailwind CSS** pour un design moderne, responsive et "premium".
  - Utilisation de composants réutilisables (`JobCard`, `Navbar`, `Toast`).
  - Animations et transitions fluides.
- **Code Quality** :
  - Utilisation de **RxJS** et Observables.
  - Injection de dépendances (nouveau style `inject()`).
  - Typage strict avec TypeScript.
  - Gestion des erreurs HTTP centralisée.

## 🛠️ Stack Technique

- **Framework** : Angular 17+ (Standalone Components)
- **State Management** : NgRx (Store, Effects, DevTools)
- **Styling** : Tailwind CSS
- **Backend (Mock)** : JSON Server (`db.json`)
- **API Externe** : The Muse API
- **Outils** : RxJS, TypeScript, Vite

## 🚀 Installation et Lancement

### Prérequis
- Node.js (v18+ recommandé)
- npm

### 1. Installation des dépendances
```bash
npm install
```

### 2. Démarrer le Serveur Backend (JSON Server)
Ce serveur gère les utilisateurs, les favoris et les candidatures.
```bash
npm run server
```
*Le serveur sera accessible sur `http://localhost:3000`.*

### 3. Démarrer l'Application Frontend
Dans un nouveau terminal :
```bash
npm start
```
*L'application sera accessible sur `http://localhost:4200`.*

## 📂 Architecture du Projet

```
src/app/
├── core/               # Services singletons, modèles, guards, intercepteurs
│   ├── gards/
│   ├── interceptors/
│   ├── models/
│   └── service/
├── features/           # Modules métier (pages)
│   ├── auth/           # Login, Profil
│   ├── jobs/           # Recherche, Détails, Liste
│   └── my-jobs/        # Favoris, Candidatures (Lazy Loaded)
├── shared/             # Composants, pipes, directives réutilisables
│   ├── components/
│   └── pipes/
└── store/              # Gestion d'état NgRx
    └── favorites/      # State des favoris
```

## 🔐 Authentification

L'application utilise une authentification simulée.
- **Stockage** : `localStorage` est utilisé pour maintenir la session active même après la fermeture du navigateur (contrairement à `sessionStorage`), offrant une meilleure UX pour un chercheur d'emploi qui revient régulièrement.
- **Sécurité** : Les routes `/profile` et `/my-jobs` sont protégées par un `AuthGuard`.

## 📡 API Utilisée

- **Nom** : The Muse API
- **Documentation** : [https://www.themuse.com/developers/api/v2](https://www.themuse.com/developers/api/v2)
- **Proxy** : Un fichier `proxy.conf.json` est configuré pour éviter les problèmes de CORS lors du développement.

---
**Développé pour le Brief "JobFinder" - Février 2026**
