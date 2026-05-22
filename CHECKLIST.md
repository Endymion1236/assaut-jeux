# ✅ CHECKLIST FINALE AVANT DE LANCER

## 📋 ÉTAPE 0 : LECTURE PRÉALABLE

- [ ] J'ai lu `QUICK_START.md` (5 min)
- [ ] J'ai lu `STRUCTURE_FICHIERS.md` (2 min)
- [ ] J'ai les 6 clés Firebase (voir `MEMO_FIREBASE.md`)

---

## 🎯 ÉTAPE 1 : FIREBASE

- [ ] Créé un projet Firebase sur https://console.firebase.google.com
- [ ] Copié les 6 clés Firebase
- [ ] Activé l'authentification Email/Password
- [ ] Créé une base de données Firestore en mode "test"

---

## 📂 ÉTAPE 2 : STRUCTURE DE DOSSIERS

Sur ton ordinateur, crée cette structure :

```
assaut-jeux/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   │   ├── components/
│   │   └── pages/
│   ├── config/
│   ├── data/
│   └── utils/
```

- [ ] Dossier `assaut-jeux/` créé
- [ ] Dossier `public/` créé
- [ ] Dossier `src/` créé
- [ ] Dossiers imbriqués créés selon la structure
- [ ] J'ai compté les dossiers → 13 dossiers

---

## 📄 ÉTAPE 3 : FICHIERS CONFIG (À la racine)

Copies ces fichiers à la **racine** du dossier `assaut-jeux/` :

- [ ] `package.json`
- [ ] `vercel.json`
- [ ] `.gitignore`
- [ ] `.env.example`
- [ ] `README.md`
- [ ] `QUICK_START.md`
- [ ] `GUIDE_INSTALLATION.md`
- [ ] `STRUCTURE_FICHIERS.md`
- [ ] `INDEX_FICHIERS.md`
- [ ] `MEMO_FIREBASE.md`

**Total = 10 fichiers**

---

## 🔐 ÉTAPE 4 : FICHIER `.env.local` (À la racine)

- [ ] Créé un fichier nommé `.env.local`
- [ ] Rempli avec tes 6 clés Firebase
- [ ] Le fichier est à la racine (niveau `assaut-jeux/`)
- [ ] Pas d'erreurs de copie-colle

Contenu :
```
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
```

---

## 📚 ÉTAPE 5 : FICHIERS PUBLIC

- [ ] Créé `public/index.html`

---

## 🧩 ÉTAPE 6 : FICHIERS SRC - RACINE

- [ ] Créé `src/index.js`
- [ ] Créé `src/App.jsx`

---

## ⚙️ ÉTAPE 7 : FICHIERS SRC - CONFIG, DATA, UTILS

Dossier `src/config/` :
- [ ] `firebase.js`

Dossier `src/data/` :
- [ ] `games.js`

Dossier `src/utils/` :
- [ ] `gameRecommendations.js`

---

## 🧩 ÉTAPE 8 : COMPOSANTS

Dossier `src/components/` :
- [ ] `Header.jsx`
- [ ] `GameCard.jsx`

---

## 📄 ÉTAPE 9 : PAGES

Dossier `src/pages/` :
- [ ] `Login.jsx`
- [ ] `Home.jsx`
- [ ] `Profile.jsx`
- [ ] `Catalog.jsx`
- [ ] `Events.jsx`
- [ ] `EventDetail.jsx`

---

## 🎨 ÉTAPE 10 : STYLES

Dossier `src/styles/` :
- [ ] `App.css`

Dossier `src/styles/components/` :
- [ ] `Header.css`
- [ ] `GameCard.css`

Dossier `src/styles/pages/` :
- [ ] `Login.css`
- [ ] `Home.css`
- [ ] `Catalog.css`
- [ ] `Profile.css` (prendre de Profile_Events.css)
- [ ] `Events.css` (prendre de Profile_Events.css)

---

## 🔢 COMPTE DES FICHIERS

Compte les fichiers créés :

```
Config à la racine : 10 fichiers
public/ : 1 fichier
src/ racine : 2 fichiers
src/config/ : 1 fichier
src/data/ : 1 fichier
src/utils/ : 1 fichier
src/components/ : 2 fichiers
src/pages/ : 6 fichiers
src/styles/ : 1 fichier
src/styles/components/ : 2 fichiers
src/styles/pages/ : 5 fichiers
________________
TOTAL : 32 fichiers
```

- [ ] J'ai compté 32 fichiers (ou 31 + .env.local créé manuellement)

---

## 💻 ÉTAPE 11 : INSTALLATION

Ouvre un terminal (Cmd, PowerShell, Terminal, etc.)

```bash
# Navigue vers le dossier
cd assaut-jeux

# Installe les dépendances (ça peut prendre 1-2 min)
npm install

# Lance l'app
npm start
```

- [ ] Terminal ouvre sans erreur
- [ ] `npm install` complété (peut voir "added XXX packages")
- [ ] `npm start` exécuté
- [ ] http://localhost:3000 s'ouvre dans le navigateur

---

## 🧪 ÉTAPE 12 : TEST LOCAL

Sur http://localhost:3000 :

- [ ] La page se charge
- [ ] Je vois le formulaire de connexion
- [ ] Je peux créer un compte (pseudo + email + password)
- [ ] Je peux me connecter
- [ ] Je vois la page d'accueil
- [ ] Je peux naviguer vers les autres pages (profil, catalogue, soirées)
- [ ] Le catalogue affiche 10 jeux
- [ ] Je peux ajouter des jeux en favoris ❤️

**Si tout fonctionne → C'est bon ! 🎉**

---

## 🚨 PROBLÈMES POSSIBLES

Si quelque chose ne fonctionne pas :

### "npm: command not found"
- [ ] Installe Node.js depuis https://nodejs.org
- [ ] Redémarre ton terminal

### "Firebase is undefined" ou erreur Firebase
- [ ] Vérifie que `.env.local` est bien créé
- [ ] Vérifie que tes 6 clés Firebase sont correctes
- [ ] Redémarre `npm start`

### "Cannot find module..."
- [ ] Fais `npm install` à nouveau
- [ ] Vérifie que tous les fichiers sont aux bons endroits

### "Port 3000 est déjà utilisé"
```bash
# Utilise un autre port
npm start -- --port 3001
```

---

## 📤 ÉTAPE 13 : METTRE SUR GITHUB

Une fois que tout fonctionne en local :

```bash
# Initialise Git
git init
git add .
git commit -m "Initial commit - app à l'assaut des jeux"
```

- [ ] Git initialisé
- [ ] Fichiers staged
- [ ] Commit créé

Va sur https://github.com/new

- [ ] Créé un repo `assaut-jeux` (PUBLIC)
- [ ] Copié l'URL du repo

```bash
git branch -M main
git remote add origin https://github.com/TON_USERNAME/assaut-jeux.git
git push -u origin main
```

- [ ] Code poussé vers GitHub

---

## 🌍 ÉTAPE 14 : DÉPLOIEMENT VERCEL

Va sur https://vercel.com

- [ ] Créé un compte Vercel (avec GitHub)
- [ ] Cliqué "New Project"
- [ ] Sélectionné le repo `assaut-jeux`
- [ ] Cliqué "Import"

**Environment Variables :**

Ajoute tes 6 variables Firebase :

```
REACT_APP_FIREBASE_API_KEY = ...
REACT_APP_FIREBASE_AUTH_DOMAIN = ...
REACT_APP_FIREBASE_PROJECT_ID = ...
REACT_APP_FIREBASE_STORAGE_BUCKET = ...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID = ...
REACT_APP_FIREBASE_APP_ID = ...
```

- [ ] Toutes les 6 variables ajoutées
- [ ] Cliqué "Deploy"

Attends 2-3 minutes...

- [ ] Vercel affiche "Deployment successful" ✅
- [ ] Tu as une URL : `https://assaut-jeux.vercel.app`

---

## 🎯 ÉTAPE 15 : TEST EN LIGNE

Va sur l'URL Vercel :

- [ ] La page se charge
- [ ] Je vois le formulaire de connexion
- [ ] Je peux créer un compte
- [ ] Tout fonctionne comme en local

---

## 🎉 VOUS Y ÊTES !

Si tous les checkmarks sont cochés :

```
✅ App en développement local
✅ Firebase configuré
✅ Code sur GitHub
✅ Déployé sur Vercel
✅ Accessible publiquement
```

**Tu as une plateforme complète pour ton association ! 🎲🚀**

---

## 📣 PROCHAINES ÉTAPES

Après le lancement :

- [ ] Personnalise les couleurs (`.root` dans `App.css`)
- [ ] Ajoute les jeux de ton association (dans `games.js`)
- [ ] Invites tes copains avec l'URL
- [ ] Reçois leurs retours
- [ ] Améliore progressivement l'app

---

## 🆘 BESOIN D'AIDE ?

- Erreur ? → Poste la complètement et je t'aide
- Question ? → Demande !
- Veut améliorer ? → Je peux aider

---

**T'es prêt ? GO ! 🚀**
