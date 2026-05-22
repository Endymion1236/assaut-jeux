// src/data/mechanics.js
// Source unique des mécaniques de jeu utilisées partout dans l'app
// (Catalog filters, Admin form, profil utilisateur, recommandations, mapping BGG)

export const MECHANICS = [
  { id: 'enquete',      label: 'Enquête / Déduction', emoji: '🔍' },
  { id: 'deckbuilding', label: 'Deckbuilding',         emoji: '🃏' },
  { id: 'draft',        label: 'Draft',                emoji: '✋' },
  { id: 'strategie',    label: 'Stratégie',            emoji: '♟️' },
  { id: 'placement',    label: 'Placement d\'ouvriers',emoji: '⚒️' },
  { id: 'gestion',      label: 'Gestion de ressources',emoji: '💰' },
  { id: 'bluff',        label: 'Bluff',                emoji: '🎭' },
  { id: 'roll-write',   label: 'Roll & Write',         emoji: '🎲' },
  { id: 'narratif',     label: 'Narratif / Aventure',  emoji: '📖' },
  { id: 'party',        label: 'Ambiance / Party',     emoji: '🎉' },
];

// Helpers
export const MECHANIC_IDS = MECHANICS.map(m => m.id);

export const getMechanicLabel = (id) =>
  MECHANICS.find(m => m.id === id)?.label || id;

export const getMechanicEmoji = (id) =>
  MECHANICS.find(m => m.id === id)?.emoji || '🎲';

// Mapping mécaniques/catégories BoardGameGeek vers nos IDs internes
// (les chaînes sont matchées en lowercase contains)
export const BGG_MECHANIC_MAP = {
  // Enquête / Déduction
  'deduction': 'enquete',
  'investigation': 'enquete',
  'mystery': 'enquete',
  'murder mystery': 'enquete',
  // Deckbuilding
  'deck, bag, and pool building': 'deckbuilding',
  'deck building': 'deckbuilding',
  'deck-building': 'deckbuilding',
  // Draft
  'drafting': 'draft',
  'card drafting': 'draft',
  // Stratégie
  'strategy': 'strategie',
  'strategy game': 'strategie',
  'abstract strategy': 'strategie',
  // Placement d'ouvriers
  'worker placement': 'placement',
  'action drafting': 'placement',
  // Gestion de ressources
  'resource management': 'gestion',
  'economic': 'gestion',
  'income': 'gestion',
  // Bluff
  'bluffing': 'bluff',
  'hidden roles': 'bluff',
  'traitor game': 'bluff',
  // Roll & Write
  'roll / spin and write': 'roll-write',
  'roll and write': 'roll-write',
  // Narratif / Aventure
  'storytelling': 'narratif',
  'narrative choice': 'narratif',
  'adventure': 'narratif',
  'campaign': 'narratif',
  'legacy game': 'narratif',
  // Ambiance / Party
  'party game': 'party',
  'humor': 'party',
  'real-time': 'party',
};
