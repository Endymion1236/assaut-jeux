# 🎲 À l'assaut des jeux - Plateforme Web

Plateforme complète pour organiser des soirées jeux de société avec recommandation intelligente de jeux.

## 🚀 Installation rapide

### Prérequis
- Node.js 14+ installé
- Un compte GitHub (gratuit)
- Un compte Firebase (gratuit)
- Un compte Vercel (gratuit)

### 1️⃣ Configuration Firebase

1. Va sur https://console.firebase.google.com
2. Crée un nouveau projet (nom : "assaut-jeux" par exemple)
3. Active l'authentification (Email/Password)
4. Crée une base de données Firestore en mode "test"
5. Copie tes clés Firebase

### 2️⃣ Configuration locale

```bash
# Clone ou télécharge le repo
git clone https://github.com/TON_USERNAME/assaut-jeux.git
cd assaut-jeux

# Installe les dépendances
npm install

# Crée un fichier .env.local
cp .env.example .env.local

# Remplis les valeurs Firebase dans .env.local
# REACT_APP_FIREBASE_API_KEY=ta_clé_ici
# etc...

# Lance le serveur local
npm start
```

L'app s'ouvre sur http://localhost:3000

### 3️⃣ Déploiement sur Vercel

#### Option A : Via GitHub (recommended - déploiement automatique)

```bash
# Initialise Git
git init
git add .
git commit -m "Initial commit"

# Crée un repo sur GitHub
# Va sur https://github.com/new et crée "assaut-jeux"

# Push le code
git branch -M main
git remote add origin https://github.com/TON_USERNAME/assaut-jeux.git
git push -u origin main
```

Puis sur Vercel :
1. Va sur https://vercel.com
2. Clique "New Project"
3. Importe ton repo GitHub
4. Ajoute les variables d'environnement (onglet Environment Variables) :
   - `REACT_APP_FIREBASE_API_KEY`
   - `REACT_APP_FIREBASE_AUTH_DOMAIN`
   - `REACT_APP_FIREBASE_PROJECT_ID`
   - `REACT_APP_FIREBASE_STORAGE_BUCKET`
   - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
   - `REACT_APP_FIREBASE_APP_ID`
5. Clique "Deploy" 🎉

#### Option B : Deploy CLI direct (sans GitHub)

```bash
# Installe Vercel CLI
npm i -g vercel

# Déploie
vercel
```

## 📁 Structure du projet

```
assaut-jeux/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── GameCard.jsx
│   │   ├── EventCard.jsx
│   │   └── ...
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Profile.jsx
│   │   ├── Events.jsx
│   │   ├── Catalog.jsx
│   │   └── Login.jsx
│   ├── config/
│   │   └── firebase.js
│   ├── styles/
│   │   └── *.css
│   ├── utils/
│   │   └── gameRecommendations.js
│   ├── App.jsx
│   └── index.js
├── public/
│   └── index.html
├── package.json
├── .env.example
├── .env.local (à créer)
├── .gitignore
└── README.md
```

## 🎮 Fonctionnalités

✅ **Authentification** - Inscription/Connexion avec Firebase  
✅ **Profils** - Gérer son profil et ses préférences  
✅ **Catalogue** - 10+ jeux avec descriptions complètes  
✅ **Recommandations** - Algorithme basé sur préférences + nombre de joueurs  
✅ **Soirées** - Créer et rejoindre des événements  
✅ **Base de données** - Tout sauvegardé dans Firestore  

## 🎨 Design

- Interface ludique et moderne
- Responsive (mobile-friendly)
- Animations fluides avec Framer Motion
- Icônes avec Lucide React

## 🔧 Maintenance

### Ajouter des jeux

Édite `src/data/games.js` :

```javascript
{
  id: 11,
  name: "Nom du jeu",
  emoji: "🎯",
  minPlayers: 2,
  maxPlayers: 5,
  duration: "45 min",
  description: "Description courte",
  types: ["stratégie", "rapide"]
}
```

### Modifier le design

Les couleurs et styles sont dans `src/styles/` - facile à personnaliser !

## 📊 Règles Firestore à configurer

Dans Firebase Console > Firestore > Rules, utilise :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.organizerId;
    }
    match /games/{gameId} {
      allow read: if request.auth != null;
    }
  }
}
```

## 🆘 Dépannage

**"Variable d'environnement non trouvée"**
→ Vérifie que tu as bien créé `.env.local` et que tu as relancé `npm start`

**"Firebase est indéfini"**
→ Vérifie tes clés Firebase dans `.env.local`

**"Erreur Firestore"**
→ Vérifie que tu as bien créé une base de données en mode "test"

## 📝 License

Libre d'utilisation pour À l'assaut des jeux

## 👨‍💻 Support

Des questions ? N'hésite pas ! 🚀

---

**Prêt à lancer ? Commence par l'étape 1️⃣ !**
