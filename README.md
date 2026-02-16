# 🚀 JobFinder - Application de Recherche d'Emploi

![Angular](https://img.shields.io/badge/Angular-17+-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![NgRx](https://img.shields.io/badge/NgRx-State_Management-BA2BD2?style=for-the-badge&logo=ngrx&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-Observables-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

Une application web moderne et réactive développée avec **Angular 17+** permettant aux candidats de rechercher des offres d'emploi, de gérer leurs favoris et de suivre leurs candidatures. Ce projet a été réalisé dans le cadre d'un brief technique intensif de 5 jours.

---

## � Démonstration

![Demo Preview](./public/docs/JobFonderDemo.mp4)

---

## 📋 Table des Matières
- [About](#-a-propos)
- [Fonctionnalités Clés](#-fonctionnalités-clés)
- [Technologies & Outils](#-technologies--outils)
- [Architecture & NgRx](#-architecture--state-management)
- [Installation & Démarrage](#-installation--démarrage)
- [Choix Techniques](#-choix-techniques-et-justifications)
- [Compétences Validées](#-compétences-validées)

---

## ℹ️ A Propos

Ce projet exploite l'API publique **The Muse** pour fournir des données réelles d'offres d'emploi. Il intègre également un backend simulé via **JSON Server** pour gérer la persistance des données utilisateur (favoris, candidatures, notes).

**Objectif :** Créer une expérience utilisateur fluide (SPA) respectant les bonnes pratiques Angular modernes (Standalone Components, Signals, inject()).

---

## ✨ Fonctionnalités Clés

### 🔍 Recherche Avancée (The Muse API)
*   Recherche par mots-clés (ex: "Developer").
*   Filtres par localisation et niveau d'expérience.
*   Pagination et tri des résultats.

### ❤️ Gestion des Favoris (NgRx Store)
*   Architecture **Redux** complète (Actions, Reducers, Selectors, Effects).
*   Ajout et suppression instantanés.
*   Persistance des favoris dans `db.json`.

### 📝 Suivi des Candidatures
*   Formulaire réactif pour postuler.
*   Tableau de bord "Mes Jobs" avec statuts : *En attente*, *Accepté*, *Refusé*.
*   Ajout de notes personnelles pour chaque candidature.

### 🔐 Authentification & Sécurité
*   Système de login simulé (localStorage).
*   **AuthGuard** protégeant les routes `/my-jobs` et `/profile`.
*   Gestion des rôles (simulée pour l'UX).

---

## 🛠 Technologies & Outils

| Catégorie | Technologie | Utilisation |
| :--- | :--- | :--- |
| **Framework** | **Angular 17+** | Structure principale, Standalone Components. |
| **State** | **NgRx Store / Effects** | Gestion centralisée des favoris. |
| **Styling** | **Tailwind CSS** | Design system utilitaire, responsive, dark mode. |
| **Async** | **RxJS** | Gestion des flux de données et événements. |
| **Backend** | **JSON Server** | Mock API pour persistence locale (`db.json`). |
| **API** | **The Muse API** | Source de données d'offres d'emploi (`proxy.conf.json`). |
| **Build** | **Vite / Node.js** | Outils de build et serveur de développement. |

---

## 🏗 Architecture & State Management

L'application suit une architecture modulaire et scalable :

```
src/app/
├── core/               # Services, Modèles, Interceptors (Singletons)
├── features/           # Modules métier (Auth, Jobs, MyJobs, Profile)
├── shared/             # Composants UI réutilisables (Navbar, Cards, Loaders)
└── store/              # NgRx State Management
    └── favorites/      # Actions, Reducers, Effects, Selectors
```

### Flux NgRx (Favoris)
1.  **Component** dispatch une `Action` (ex: `addFavorite`).
2.  **Effect** intercepte l'action, appelle le `Service` API, et dispatch `Success` ou `Failure`.
3.  **Reducer** met à jour le `State` immuable.
4.  **Selector** notifie le composant via un Observable.

---

## 🚀 Installation & Démarrage

### Prérequis
*   Node.js (v18+)
*   npm

### 1. Cloner et Installer
```bash
git clone https://github.com/votre-user/job-finder.git
cd job-finder
npm install
```

### 2. Démarrer le Backend (JSON Server)
Dans un terminal dédié :
```bash
npm run server
```
*Le serveur mock sera lancé sur `http://localhost:3000`.*

### 3. Démarrer l'Application Angular
Dans un autre terminal :
```bash
npm start
```
*L'application sera accessible sur `http://localhost:4200`.*

---

## � Choix Techniques et Justifications

### LocalStorage vs SessionStorage
Pour ce projet, nous avons choisi **localStorage** pour la gestion de l'authentification.
*   **Justification** : Un candidat à la recherche d'emploi ne souhaite pas se reconnecter à chaque fermeture de navigateur. La persistance de la session améliore l'expérience utilisateur et permet un accès rapide aux favoris lors de visites récurrentes.

### Standalone Components
L'application utilise l'approche moderne **Standalone Components** d'Angular pour réduire le boilerplate (plus de NgModules inutiles) et améliorer le lazy loading des routes.

### Tailwind CSS
Choisi pour sa rapidité de développement et sa facilité de maintenance par rapport à du CSS pur ou Bootstrap.

---

## ✅ Compétences Validées

*   [x] **C1N2** : Configuration de l'environnement de développement.
*   [x] **C2N2** : Développement d'interfaces utilisateurs réactives.
*   [x] **C3N2** : Création de composants métier complexes.
*   [x] **C5N2** : Maquettage et intégration responsive.
*   [x] **C6N2** : Architecture logicielle et State Management.
*   [x] **C8N2** : Code propre, documenté et maintenable.

---

*Développé par [Mahjoub Cherkaoui] - Février 2026*
