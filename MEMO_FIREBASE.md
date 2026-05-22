# 🔑 MÉMO FIREBASE - COPIE TES CLÉS ICI

## 📋 COMMENT OBTENIR TES CLÉS

1. Va sur https://console.firebase.google.com
2. Clique sur **Paramètres du projet** (engrenage ⚙️ en haut à gauche)
3. Descends jusqu'à **"Vos applications"**
4. Tu vois quelque chose comme : `</> assaut-jeux-web`
5. Clique dessus pour voir le code

Tu vas voir ceci (exemple) :
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxxx...",
  authDomain: "assaut-jeux-123456.firebaseapp.com",
  projectId: "assaut-jeux-123456",
  storageBucket: "assaut-jeux-123456.appspot.com",
  messagingSenderId: "987654321",
  appId: "1:987654321:web:abcdef123456"
};
```

## ✏️ REMPLIS AVEC TES CLÉS

Copie-les exactement ci-dessous :

```
API_KEY = 
__________________________

AUTH_DOMAIN = 
__________________________

PROJECT_ID = 
__________________________

STORAGE_BUCKET = 
__________________________

MESSAGING_SENDER_ID = 
__________________________

APP_ID = 
__________________________
```

## 📝 VOICI CE QUE TU VEUX DANS `.env.local`

Après avoir rempli les blancs ci-dessus, crée un fichier `.env.local` à la racine du projet `assaut-jeux/` avec :

```
REACT_APP_FIREBASE_API_KEY={API_KEY}
REACT_APP_FIREBASE_AUTH_DOMAIN={AUTH_DOMAIN}
REACT_APP_FIREBASE_PROJECT_ID={PROJECT_ID}
REACT_APP_FIREBASE_STORAGE_BUCKET={STORAGE_BUCKET}
REACT_APP_FIREBASE_MESSAGING_SENDER_ID={MESSAGING_SENDER_ID}
REACT_APP_FIREBASE_APP_ID={APP_ID}
```

### Exemple réel :

```
REACT_APP_FIREBASE_API_KEY=AIzaSyBxxx...
REACT_APP_FIREBASE_AUTH_DOMAIN=assaut-jeux-123456.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=assaut-jeux-123456
REACT_APP_FIREBASE_STORAGE_BUCKET=assaut-jeux-123456.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=987654321
REACT_APP_FIREBASE_APP_ID=1:987654321:web:abcdef123456
```

## ⚠️ IMPORTANT

- **NE PARTAGE PAS** ces clés sur GitHub/Internet
- Le `.env.local` est dans `.gitignore` (sécurisé)
- Les clés dans Vercel doivent être rentrées via le dashboard

---

## 🚀 APRÈS AVOIR REMPLI `.env.local`

```bash
# Teste localement
npm start

# Si ça marche (http://localhost:3000 s'ouvre) → tout bon !
# Si ça marche pas → vérifie que tes clés sont correctes
```

---

## 📤 POUR VERCEL

Une fois sur Vercel, tu devras ajouter les **mêmes 6 variables** :

1. Va sur ton projet Vercel
2. Clique sur **Settings**
3. Va à **Environment Variables**
4. Ajoute ces 6 variables une par une

(Même contenu que `.env.local`)

---

**C'est ton moment clé ! Prends le temps de bien les copier. 🔐**
