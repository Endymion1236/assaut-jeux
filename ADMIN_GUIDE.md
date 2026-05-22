# 🔧 GUIDE ADMIN - GESTION DU CATALOGUE

## 📋 WHAT IS THIS?

La page **Admin** te permet de :
- ✅ **Ajouter des jeux** rapidement
- ✅ **Chercher sur BoardGameGeek** (auto-remplissage des infos)
- ✅ **Éditer des jeux** existants
- ✅ **Supprimer des jeux**
- ✅ **Gérer le catalogue complet** de l'association

---

## 🔐 ACCÈS ADMIN

### Qui peut accéder à Admin ?

Seuls les **emails autorisés** peuvent voir le bouton "⚙️ Admin" :

**Pour activer l'accès admin :**

1. Ouvre `src/App.jsx`
2. Trouve la ligne :
```javascript
const ADMIN_EMAILS = [
  'admin@assaut-des-jeux.fr',
  'nicolas@centre-equestre.fr' // ← Change ici !
];
```

3. Remplace par **TES emails** (admins de l'association)

Exemple :
```javascript
const ADMIN_EMAILS = [
  'nicolas@centre-equestre.fr',
  'responsable@association.fr',
  'gerant@club.fr'
];
```

---

## 🎮 UTILISER LA PAGE ADMIN

### Étape 1️⃣ : Aller sur Admin

1. Connexion avec un email **admin**
2. Tu vois un badge **"Admin"** à côté de ton nom
3. Clique sur **"⚙️ Admin"** dans le menu

---

### Étape 2️⃣ : AJOUTER UN JEU

**Méthode A : Recherche automatique (recommandée) 🌟**

1. Clique **"+ Ajouter un jeu"**
2. Dans la section "🔍 Chercher sur BoardGameGeek"
3. Tape le nom du jeu : `Catan`, `Ticket to Ride`, etc.
4. Les résultats apparaissent → Clique **"Utiliser"**
5. ✅ Les infos sont **auto-remplies** :
   - Nombre de joueurs ✓
   - Durée ✓
   - Description ✓
   - Mécaniques → Types de jeu ✓

---

**Méthode B : Remplissage manuel**

Si la recherche BoardGameGeek échoue :

1. Clique **"+ Ajouter un jeu"**
2. Remplis manuellement :
   - **Nom** : Le nom du jeu
   - **Emoji** : Un emoji représentant le jeu
   - **Min/Max joueurs** : 2-4, 3-5, etc.
   - **Durée** : "30-45 min", "60 min", etc.
   - **Description** : Courte description
   - **Types** : Ajoute les catégories (stratégie, party, etc.)

3. Clique **"Ajouter le jeu"**

---

### Étape 3️⃣ : ÉDITER UN JEU

1. Dans la liste "Jeux actuels"
2. Clique le bouton **✏️ Éditer** (crayon)
3. Modifie les infos
4. Clique **"Mettre à jour"**

---

### Étape 4️⃣ : SUPPRIMER UN JEU

1. Dans la liste "Jeux actuels"
2. Clique le bouton **🗑️ Supprimer** (poubelle)
3. Confirme la suppression

---

## 📊 COMPRENDRE LES CHAMPS

### Emoji 🎲
- Représente visuellement le jeu
- Exemples : 🏗️ (construction), 🚂 (train), 🎨 (créatif)
- **Important** : 1 caractère emoji seulement

### Min/Max joueurs
- **Min** : Nombre minimum pour jouer
- **Max** : Nombre maximum recommandé
- Exemple : 2-4 joueurs

### Durée
- Format : "45-60 min", "30 min", "120+ min"
- Important pour les joueurs pressés

### Types de jeu
- **stratégie** : Jeux tactiques/stratégiques
- **party** : Jeux de groupe amusants
- **familial** : Accessibles à tous
- **coopératif** : Joueurs ensemble vs le jeu
- **rapide** : < 30 minutes
- **placement** : Placement de tuiles/pièces
- **collection** : Collecter des ressources
- **negotiation** : Négocier avec les autres
- Etc.

---

## 🤖 COMMENT FONCTIONNE BOARDGAMEGEEK ?

### Qu'est-ce que BGG ?
- **Base de données massive** des jeux de société
- Plus de **100,000 jeux** enregistrés
- Infos complètes : joueurs, durée, mécaniques, notes, etc.

### Quand la recherche BGG réussit :
```
Tu tapes → "Catan"
         ↓
BGG cherche dans sa base → Trouve Catan (ID #2962)
         ↓
On récupère les infos :
  - Joueurs : 3-4
  - Durée : 60-90 min
  - Mécaniques : Card Drafting, Worker Placement, etc.
         ↓
On convertit les mécaniques en types simples
  - Worker Placement → stratégie ✓
  - Tile Placement → placement ✓
         ↓
Tout est rempli automatiquement ! ✨
```

### Quand la recherche échoue :
```
Possible si :
  - Jeu très récent (< 1 mois)
  - Jeu très peu connu
  - Jeu auto-édité
  - Typo dans le nom

Solution : Remplir manuellement le formulaire
```

---

## 💡 CONSEILS PRATIQUES

### Bien formatter la durée
❌ Mauvais : "1 heure", "environ 45 mins", "1h"
✅ Bon : "45-60 min", "30 min", "60-90 min"

### Bien choisir les types
```
Catan →
  ✓ stratégie (Car il faut négocier et construire)
  ✓ négociation (Car on échange)
  ✓ familial (Accessible à 10+ ans)

Codenames →
  ✓ party (C'est un jeu d'équipe fun)
  ✓ rapide (15 min)
  ✓ équipe (On joue en équipes)
```

### Emoji sympas par catégorie
- **Stratégie** : 🏗️ 🎯 ♟️
- **Party** : 🎉 🎊 🎪
- **Coopératif** : 🤝 🌍 ⚔️
- **Aventure** : 🗺️ 🧳 ⛰️
- **Créatif** : 🎨 ✏️ 🎭
- **Racing** : 🚗 🚂 🏃
- **Casual** : 🎲 🃏 🧩

---

## 🔄 WORKFLOW RECOMMANDÉ

**Pour ajouter 10 jeux rapidement :**

```
1. Clique "+ Ajouter un jeu"

2. Cherche : "Ticket to Ride"
   → Utiliser (auto-remplissage)
   → Clique "Ajouter"

3. Cherche : "Dixit"
   → Utiliser
   → Clique "Ajouter"

4. Cherche : "Catan"
   → Utiliser
   → Clique "Ajouter"

... répète pour tous tes jeux

Total : 10-15 min pour 10 jeux ! ⚡
```

---

## ⚠️ PROBLÈMES COURANTS

### "La recherche ne trouve rien"
**Cause** : Nom peut-être mal orthographié  
**Solution** : Essaie une variante du nom
```
❌ "Settlers of Catan" → Essaie "Catan"
❌ "TTR" → Essaie "Ticket to Ride"
❌ "7W" → Essaie "7 Wonders"
```

### "Les infos sont incomplètes"
**Cause** : Le jeu est peut-être mal renseigné sur BGG  
**Solution** : Complète manuellement après la recherche

### "Je peux pas supprimer un jeu"
**Cause** : Peut-être utilisé dans un événement  
**Solution** : Supprime d'abord l'événement qui l'utilise

---

## 📱 DEPUIS LE TÉLÉPHONE

La page Admin fonctionne sur mobile aussi !
- Design responsive
- Tactile-friendly
- Tous les boutons accessibles

---

## 🎯 CAS D'USAGE

### Cas 1 : Ajouter votre catalogue
```
1. Ouvre Admin
2. Ajoute chaque jeu de ton association
3. Utilise BGG pour les infos
4. En 20 min, ton catalogue est prêt !
```

### Cas 2 : Mettre à jour un jeu
```
1. Tu reçois un nouveau jeu : "Wingspan"
2. Va sur Admin
3. Clique "+ Ajouter"
4. Cherche "Wingspan" sur BGG
5. Ajoute instantanément
6. Tes joueurs le voient tout de suite !
```

### Cas 3 : Retirer un jeu cassé
```
1. Jeu "Fluxx" est trop endommagé
2. Va sur Admin
3. Clique 🗑️ sur "Fluxx"
4. Il disparaît pour tous les joueurs
```

---

## 🔒 SÉCURITÉ

- ✅ Seuls les **admins** peuvent modifier le catalogue
- ✅ Les **changements sont instantanés** pour tous
- ✅ **Firestore** sauvegarde tout automatiquement
- ✅ Pas de risque de perte de données

---

## 🆘 BESOIN D'AIDE ?

**Erreur lors de l'ajout ?**
→ Vérifie la console (F12) et copie le message d'erreur

**BGG ne répond pas ?**
→ Peut-être surcharge serveur, réessaie dans 5 min

**Veux ajouter un champ personnalisé ?**
→ C'est possible ! Dis-moi quoi ajouter

---

## 📚 RESSOURCES

- **BoardGameGeek** : https://boardgamegeek.com
- **Les jeux les mieux notés** : https://boardgamegeek.com/browse/boardgame
- **API BGG docs** : https://boardgamegeek.com/xmlapi2/

---

**Prêt à gérer ton catalogue ? 🚀 Clique sur ⚙️ Admin !**
