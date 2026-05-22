# ⚡ QUICK START - 5 ÉTAPES (25 MIN CHRONO ⏱️)

## 🎯 OBJECTIF
Lancer l'app en ligne sur Vercel avec Firebase

---

## ÉTAPE 1️⃣ : FIREBASE (5 min)

1. Va sur https://console.firebase.google.com
2. **Nouveau projet** → Donne le nom `assaut-jeux`
3. Attends ~1 min que le projet se crée
4. Va à **Paramètres du projet** (engrenage en haut)
5. **Ajouter une app web** → Copie les 6 valeurs

Tes valeurs ressemblent à ça :
```
apiKey: "AIzaSyDxxx..."
authDomain: "assaut-jeux.firebaseapp.com"
projectId: "assaut-jeux"
storageBucket: "assaut-jeux.appspot.com"
messagingSenderId: "123456789"
appId: "1:123456789:web:abc..."
```

**SAUVEGARDE-LES ! Tu les besoin bientôt.** 📋

5. Va dans **Authentification** → Clique **Commencer** → Sélectionne **Email/Mot de passe** → Clique **Enregistrer**

6. Va dans **Firestore Database** → Clique **Créer une base** → Sélectionne **Mode test** → **Créer**

✅ **Firebase est prêt !**

---

## ÉTAPE 2️⃣ : TÉLÉCHARGE LES FICHIERS (5 min)

1. Télécharge TOUS les fichiers créés
2. Sur ton ordinateur, crée un dossier : `assaut-jeux`
3. Organise les fichiers selon la structure dans `STRUCTURE_FICHIERS.md`

**Besoin d'aide ?** Suis `STRUCTURE_FICHIERS.md` ligne par ligne

---

## ÉTAPE 3️⃣ : CONFIGURATION LOCALE (3 min)

Dans le dossier `assaut-jeux`, crée un fichier `.env.local` avec TES valeurs :

```
REACT_APP_FIREBASE_API_KEY=AIzaSyDxxx...
REACT_APP_FIREBASE_AUTH_DOMAIN=assaut-jeux.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=assaut-jeux
REACT_APP_FIREBASE_STORAGE_BUCKET=assaut-jeux.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc...
```

(Remplace par les valeurs de l'ÉTAPE 1)

---

## ÉTAPE 4️⃣ : INSTALLATION LOCALE (5 min)

Ouvre un terminal à la racine du dossier `assaut-jeux` et tape :

```bash
npm install
npm start
```

**Ça devrait ouvrir http://localhost:3000 dans ton navigateur ! ✅**

Créé un compte pour tester 🎲

---

## ÉTAPE 5️⃣ : EN LIGNE SUR VERCEL (7 min)

### A. Mettre sur GitHub

```bash
git init
git add .
git commit -m "Initial commit"
```

1. Va sur https://github.com/new
2. Crée un repo nommé `assaut-jeux` (PUBLIC)
3. Suis les instructions pour push le code

```bash
git branch -M main
git remote add origin https://github.com/TON_USERNAME/assaut-jeux.git
git push -u origin main
```

### B. Déployer sur Vercel

1. Va sur https://vercel.com
2. Clique **New Project**
3. Importe ton repo GitHub `assaut-jeux`
4. À la fin, clique sur **Environment Variables**
5. Ajoute tes 6 variables Firebase
6. Clique **Deploy** 🚀

**C'est en ligne !** 🎉

Ton URL : `https://assaut-jeux.vercel.app` (ou un truc similaire)

---

## 🎮 C'EST FAIT !

Tu as une plateforme :
- ✅ Authentification Firebase
- ✅ Catalogue de 10 jeux
- ✅ Recommandation intelligente
- ✅ Organisez des soirées
- ✅ Sauvegardé dans Firestore
- ✅ En ligne sur Vercel
- ✅ Accessible à tes copains ! 

---

## 🆘 PROBLÈMES COURANTS

**"npm: command not found"**
→ Installe Node.js : https://nodejs.org

**"Firebase is undefined"**
→ Vérifie que `.env.local` est bien dans le dossier racine

**"Cannot find module"**
→ Fais `npm install` à nouveau

**"Erreur à http://localhost:3000"**
→ Regarde la console (F12) et copie l'erreur exacte

**"Vercel dit erreur"**
→ Vérifie que tes variables d'environnement sont bien rentrées

---

## 📝 PROCHAINES ÉTAPES

Une fois en ligne :
1. Ajoute des jeux (dans `src/data/games.js`)
2. Personnalise les couleurs (`:root` dans `App.css`)
3. Peaufine le design
4. Partage l'URL avec ton association ! 🎲

---

**Besoin d'aide ? Poste l'erreur complète et je t'aide ! 🚀**
