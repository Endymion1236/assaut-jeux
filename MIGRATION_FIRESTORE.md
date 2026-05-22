# 📚 MIGRATION : DU STOCKAGE LOCAL À FIRESTORE

## 🎯 RÉSUMÉ

Actuellement, les jeux sont stockés dans `src/data/games.js`.
Avec la page Admin, ils sont maintenant stockés dans **Firestore**.

**Avantages du changement :**
- ✅ Modification en temps réel (sans redémarrer l'app)
- ✅ Synchronisation instantanée (tous les joueurs voient les changements)
- ✅ Sauvegarde automatique et sécurisée
- ✅ Accès depuis n'importe quel appareil
- ✅ Plus besoin de changer le code pour ajouter des jeux

---

## 📝 ÉTAPES DE MIGRATION

### Option 1 : Migrer les 10 jeux de démo 🚀 (RECOMMANDÉ)

Cette option c'est le plus rapide. Tu pars des 10 jeux déjà définis et tu les importes dans Firestore.

**Créer un script de migration :**

1. Crée un fichier `src/scripts/migrateGames.js` :

```javascript
// src/scripts/migrateGames.js
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { games } from '../data/games';

export async function migrateGamesToFirestore() {
  try {
    console.log(`Migration de ${games.length} jeux...`);
    
    for (const game of games) {
      // Supprime l'ID local si existant
      const { id, ...gameData } = game;
      
      await addDoc(collection(db, 'games'), {
        ...gameData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log(`✓ ${game.name} importé`);
    }
    
    console.log('✅ Migration complète !');
  } catch (error) {
    console.error('❌ Erreur migration:', error);
  }
}
```

2. Appelle cette fonction UNE SEULE FOIS (depuis la console ou depuis Home.jsx en développement)

```javascript
// Dans src/pages/Home.jsx (temporairement)
import { migrateGamesToFirestore } from '../scripts/migrateGames';

useEffect(() => {
  // À appeler UNE SEULE FOIS
  // migrateGamesToFirestore(); // Décommente pour lancer
}, []);
```

3. **Lance l'app** : `npm start`
4. **Ouvre la console** : F12 → Console
5. Tape : `migrateGamesToFirestore()` et appuie sur Entrée
6. Attends "Migration complète !" ✅
7. **COMMENTE la ligne** `migrateGamesToFirestore()` 
8. Redémarre l'app

---

### Option 2 : Ajouter les jeux manuellement via Admin 🎮

1. Va sur http://localhost:3000
2. Connecte-toi avec un **email admin**
3. Va dans **⚙️ Admin**
4. Pour chaque jeu :
   - Clique "+ Ajouter un jeu"
   - Cherche sur BoardGameGeek
   - Utilise les infos auto-remplies
5. Répète pour tous les jeux

**Temps :** ~15 min pour 10 jeux

---

## 🔄 APRÈS LA MIGRATION

### Utiliser les jeux depuis Firestore

**Ancien code** (avant) :
```javascript
import { games } from '../data/games.js';

export default function Catalog() {
  return (
    <div>
      {games.map(game => ...)}
    </div>
  );
}
```

**Nouveau code** (après) :
```javascript
import { useGames } from '../hooks/useGames.js';

export default function Catalog() {
  const { games, loading, error } = useGames();
  
  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur</div>;
  
  return (
    <div>
      {games.map(game => ...)}
    </div>
  );
}
```

### Pages à mettre à jour

Fichiers qui doivent utiliser `useGames()` :

1. **`src/pages/Home.jsx`**
   ```javascript
   const { games: allGames } = useGames();
   const recommendations = getRecommendations(playerCount, preferences);
   ```

2. **`src/pages/Catalog.jsx`**
   ```javascript
   const { games, loading } = useGames();
   ```

3. **`src/components/GameCard.jsx`**
   - Pas de changement (utilise les props)

4. **`src/pages/Profile.jsx`**
   ```javascript
   const { games } = useGames();
   const favorites = games.filter(g => user.favorites.includes(g.id));
   ```

---

## ⚙️ FIRESTORE RULES (IMPORTANT)

**Configure les règles Firestore pour sécuriser :**

1. Va sur https://console.firebase.google.com
2. **Firestore Database** → **Rules**
3. Remplace par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Authentification requise
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    match /games/{gameId} {
      // Tout le monde peut LIRE les jeux
      allow read: if request.auth != null;
      
      // Seulement les admins peuvent modifier
      allow create, update, delete: if request.auth.token.email in ['admin@assaut-des-jeux.fr', 'nicolas@centre-equestre.fr'];
    }

    match /events/{eventId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.organizerId;
    }
  }
}
```

**Important :** Remplace les emails `admin@assaut-des-jeux.fr` par TES emails d'admins !

---

## 🗂️ STRUCTURE FIRESTORE

Après migration, tu auras cette structure :

```
Firestore Database
├── games/
│   ├── doc1 {Catan}
│   ├── doc2 {Ticket to Ride}
│   ├── doc3 {Dixit}
│   └── ...
├── users/
│   ├── uid1 {Profile user 1}
│   ├── uid2 {Profile user 2}
│   └── ...
└── events/
    ├── event1 {Soirée 1}
    ├── event2 {Soirée 2}
    └── ...
```

---

## ⚠️ PROBLÈMES COURANTS

### "Les jeux disparaissent au redémarrage"
**Cause** : Jeux stockés localement (browser storage), pas Firestore  
**Solution** : Utilise `useGames()` hook au lieu de données locales

### "Je vois que 2 jeux au lieu de 10"
**Cause** : Peut-être que la migration a partiellement échoué  
**Solution** : Va dans Firestore Console et vérifie le nombre de documents

### "Les modifications d'admin ne s'affichent pas"
**Cause** : Peut-être que le composant ne récoute pas  
**Solution** : Utilise `useGames()` avec `onSnapshot` (écoute temps réel)

### "Erreur de permissions"
**Cause** : Les règles Firestore ne sont pas configurées  
**Solution** : Va sur Firestore Rules et copie le code ci-dessus

---

## 📱 PASSER DÉFINITIVEMENT À FIRESTORE

### Supprimer src/data/games.js

Une fois que tout fonctionne avec Firestore :

1. ✅ Vérifie que tous tes jeux sont dans Firestore
2. ✅ Vérifie que toutes les pages utilisent `useGames()`
3. ✅ Supprime `src/data/games.js`
4. ✅ Supprime l'import dans App.jsx

---

## 🎯 CHECKLIST DE MIGRATION

- [ ] Crée le script `migrateGames.js`
- [ ] Lance la migration (ou ajoute manuellement)
- [ ] Vérifie dans Firestore Console que les jeux y sont
- [ ] Configure les règles Firestore
- [ ] Met à jour Home.jsx avec `useGames()`
- [ ] Met à jour Catalog.jsx avec `useGames()`
- [ ] Met à jour Profile.jsx avec `useGames()`
- [ ] Teste que tout fonctionne en local
- [ ] Teste sur mobile
- [ ] Supprime src/data/games.js
- [ ] Commit et push sur GitHub
- [ ] Vercel redéploie automatiquement ✅

---

## 🚀 APRÈS LA MIGRATION

**Toi ou n'importe quel admin peut :**
- ✅ Ajouter un jeu sans toucher au code
- ✅ Modifier les infos d'un jeu
- ✅ Supprimer un jeu
- ✅ Les changements sont instantanés pour tous

**Et tes joueurs voient tout les changements IMMÉDIATEMENT ! ⚡**

---

**Prêt ? Lance la migration ! 🚀**
