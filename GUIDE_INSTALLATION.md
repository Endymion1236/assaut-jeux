# 📚 GUIDE COMPLET : INSTALLATION + DÉPLOIEMENT

## 🎯 RÉSUMÉ DES ÉTAPES

1. **Préparer Firebase** (5 min)
2. **Télécharger & organiser les fichiers** (5 min)
3. **Installation locale** (3 min)
4. **Tester localement** (2 min)
5. **Mettre sur GitHub** (5 min)
6. **Déployer sur Vercel** (3 min)

**Total : ~25 min pour être en ligne ! 🚀**

---

## ✅ ÉTAPE 1 : CONFIGURATION FIREBASE

### 1.1 Créer un projet Firebase

1. Va sur https://console.firebase.google.com
2. Clique sur **"Ajouter un projet"**
3. Donne-lui un nom : `assaut-jeux` (ou ce que tu veux)
4. **Désactive** "Google Analytics" (pas nécessaire)
5. Clique **"Créer un projet"** et attends ~1 min

### 1.2 Récupérer tes clés Firebase

1. Dans le dashboard Firebase, clique sur **l'icône d'engrenage** en haut à gauche → **Paramètres du projet**
2. Descends jusqu'à **"Vos applications"** et clique **"Ajouter une application"**
3. Sélectionne **</> (Web)**
4. Donne un nom : `assaut-jeux-web`
5. Coche "Configuration Firebase" et copie les valeurs

Tu vas obtenir quelque chose comme ça :
```javascript
{
  apiKey: "AIzaSyDxxx...",
  authDomain: "assaut-jeux.firebaseapp.com",
  projectId: "assaut-jeux",
  storageBucket: "assaut-jeux.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghij"
}
```

**SAUVEGARDE CES VALEURS ! Tu en auras besoin bientôt** 📋

### 1.3 Activer l'authentification

1. Dans Firebase → **Authentification** (menu de gauche)
2. Clique sur **"Commencer"**
3. Sélectionne **"Email/Mot de passe"**
4. Active-le et clique **"Enregistrer"**

### 1.4 Créer la base de données Firestore

1. **Firestore Database** (menu de gauche)
2. Clique **"Créer une base de données"**
3. Sélectionne **"Commencer en mode test"**
4. Sélectionne ta région (Europe par défaut = ok)
5. Clique **"Créer"**

✅ **Firebase est prêt !**

---

## 📂 ÉTAPE 2 : TÉLÉCHARGER & ORGANISER LES FICHIERS

### Structure finale du projet :

```
assaut-jeux/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── GameCard.jsx
│   │   └── EventCard.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Profile.jsx
│   │   ├── Events.jsx
│   │   ├── Catalog.jsx
│   │   ├── EventDetail.jsx
│   │   └── Login.jsx
│   ├── styles/
│   │   ├── App.css
│   │   ├── components/
│   │   │   ├── Header.css
│   │   │   └── GameCard.css
│   │   └── pages/
│   │       ├── Home.css
│   │       ├── Login.css
│   │       ├── Profile.css
│   │       ├── Events.css
│   │       └── Catalog.css
│   ├── config/
│   │   └── firebase.js
│   ├── data/
│   │   └── games.js
│   ├── utils/
│   │   └── gameRecommendations.js
│   ├── App.jsx
│   └── index.js
├── package.json
├── .gitignore
├── .env.example
├── .env.local
├── vercel.json
└── README.md
```

### Créer la structure localement :

```bash
# Crée le dossier du projet
mkdir assaut-jeux
cd assaut-jeux

# Initialise npm
npm init -y

# Crée les dossiers
mkdir -p public src/{components,pages,styles/{components,pages},config,data,utils}

# Crée les fichiers de base
touch public/index.html
touch src/index.js src/App.jsx
touch .gitignore .env.example .env.local
touch vercel.json
```

---

## 🔧 ÉTAPE 3 : INSTALLATION LOCALE

### 3.1 Installe les dépendances

```bash
npm install react react-dom react-router-dom firebase framer-motion lucide-react react-scripts
npm install --save-dev
```

### 3.2 Crée le fichier `.env.local`

Crée un fichier nommé `.env.local` dans le dossier racine et remplis-le :

```
REACT_APP_FIREBASE_API_KEY=AIzaSyDxxx...
REACT_APP_FIREBASE_AUTH_DOMAIN=assaut-jeux.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=assaut-jeux
REACT_APP_FIREBASE_STORAGE_BUCKET=assaut-jeux.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdefghij
```

(Remplace avec TES valeurs Firebase copié plus haut !)

### 3.3 Ajoute au `package.json`

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

---

## 🚀 ÉTAPE 4 : TESTER LOCALEMENT

```bash
npm start
```

L'app s'ouvre sur http://localhost:3000

**Si ça marche pas ?** Cherche l'erreur dans la console et envoie-moi !

---

## 📤 ÉTAPE 5 : METTRE SUR GITHUB

### 5.1 Initialiser Git

```bash
git init
git add .
git commit -m "Initial commit - plateforme jeux"
```

### 5.2 Créer un repo GitHub

1. Va sur https://github.com/new
2. Donne le nom : `assaut-jeux`
3. **Public** (pour Vercel)
4. Clique **"Create repository"**

### 5.3 Pusher le code

```bash
git branch -M main
git remote add origin https://github.com/TON_USERNAME/assaut-jeux.git
git push -u origin main
```

(Remplace `TON_USERNAME` par ton nom GitHub)

✅ **Ton code est sur GitHub !**

---

## 🌍 ÉTAPE 6 : DÉPLOYER SUR VERCEL

### 6.1 Se connecter à Vercel

1. Va sur https://vercel.com
2. Clique **"Sign Up"** et crée un compte avec GitHub (recommandé)

### 6.2 Importer le projet

1. Clique **"New Project"**
2. Sélectionne **ton repo GitHub** (`assaut-jeux`)
3. Clique **"Import"**

### 6.3 Ajouter les variables d'environnement

1. Dans le formulaire, va à **"Environment Variables"**
2. Ajoute ces variables une par une (copies les valeurs de `.env.local`) :

```
REACT_APP_FIREBASE_API_KEY = AIzaSyDxxx...
REACT_APP_FIREBASE_AUTH_DOMAIN = assaut-jeux.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID = assaut-jeux
REACT_APP_FIREBASE_STORAGE_BUCKET = assaut-jeux.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID = 123456789
REACT_APP_FIREBASE_APP_ID = 1:123456789:web:abcdefghij
```

### 6.4 Déployer

1. Clique **"Deploy"**
2. Attends ~2-3 min ⏳

**🎉 C'est en ligne !**

Ton URL Vercel ressemblera à : `https://assaut-jeux.vercel.app`

---

## 🔄 METTRE À JOUR LE SITE (APRÈS)

Chaque fois que tu fais des modifications :

```bash
git add .
git commit -m "Description de la modification"
git push
```

Vercel redéploie **automatiquement** ! 🚀

---

## ❌ DÉPANNAGE COURANT

### "Firebase config is not defined"
→ Vérifie que `.env.local` existe et que tu as relancé `npm start`

### "Cannot find module 'react'"
→ Fais `npm install`

### "CORS error"
→ Modifie les règles Firestore (voir section Configuration)

### "Erreur lors du déploiement Vercel"
→ Vérifie que tes variables d'environnement sont bien rentrées

---

## 💡 ASTUCES

1. **Ajouter des jeux** → Édite `src/data/games.js`
2. **Changer les couleurs** → Modifie `:root` dans `src/styles/App.css`
3. **Personnaliser le logo** → Change le texte du composant Header
4. **Ajouter un domain custom** → Vercel peut le faire automatiquement

---

**Besoin d'aide ? 🆘**

Si tu bloques quelque part, dis-moi l'étape et l'erreur exacte !

Bonne chance ! 🎲🚀
