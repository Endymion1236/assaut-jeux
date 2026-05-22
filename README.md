# 🎲 À l'assaut des jeux

Plateforme de gestion de soirées jeux de société pour l'association *À l'assaut des jeux*.

## Stack

- **React 18** + React Router 6
- **Firebase** (Auth + Firestore + Storage)
- **Framer Motion** (animations)
- **Lucide React** (icônes)
- **BoardGameGeek API** (enrichissement du catalogue)
- Déploiement **Vercel**

## Installation locale

```bash
npm install
cp .env.example .env.local
# Renseigne tes clés Firebase dans .env.local
npm start
```

L'app tourne sur http://localhost:3000

## Variables d'environnement

À configurer dans `.env.local` (jamais commité) ET dans Vercel → Settings → Environment Variables :

```
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
```

## Structure

```
src/
├── App.jsx               # Routing + auth state
├── index.js              # Entry point
├── components/           # Header, GameCard
├── pages/                # Home, Login, Catalog, Events, EventDetail, Profile, Admin
├── config/firebase.js    # Init Firebase
├── hooks/useGames.js     # Hook temps réel sur la collection games
├── services/             # API BoardGameGeek
├── data/games.js         # Données seed
├── utils/                # Recommandations de jeux
└── styles/               # CSS par composant/page
```

## Administration

L'accès à `/admin` est réservé aux emails listés dans `ADMIN_EMAILS` (voir `src/App.jsx`).
Pour ajouter un admin, édite cette liste et redéploie.

## Déploiement

Push sur `main` → Vercel déploie automatiquement.

```bash
git add .
git commit -m "ton message"
git push origin main
```

## Scripts

| Commande | Action |
|---|---|
| `npm start` | Serveur de dev |
| `npm run build` | Build prod dans `/build` |
| `npm test` | Tests |
