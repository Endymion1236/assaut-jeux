// src/data/games.js

export const games = [
  {
    id: 1,
    name: "Catan",
    emoji: "🏗️",
    minPlayers: 2,
    maxPlayers: 4,
    duration: "60-90 min",
    description: "Bâtissez et négociez pour dominer l'île de Catane. Un classique stratégique incontournable !",
    types: ["stratégie", "négociation", "familial"],
    complexity: "moyen"
  },
  {
    id: 2,
    name: "Ticket to Ride",
    emoji: "🚂",
    minPlayers: 2,
    maxPlayers: 5,
    duration: "45-60 min",
    description: "Construisez un réseau ferroviaire à travers le monde et complétez vos trajets.",
    types: ["stratégie", "familial", "collection"],
    complexity: "facile"
  },
  {
    id: 3,
    name: "Carcassonne",
    emoji: "🏰",
    minPlayers: 2,
    maxPlayers: 6,
    duration: "45 min",
    description: "Construisez un royaume médiéval en plaçant des tuiles. Tactique et placement stratégique.",
    types: ["stratégie", "familial", "placement"],
    complexity: "facile"
  },
  {
    id: 4,
    name: "Dixit",
    emoji: "🎨",
    minPlayers: 3,
    maxPlayers: 8,
    duration: "30 min",
    description: "Devinez les associations d'idées des autres joueurs basées sur des illustrations magnifiques.",
    types: ["party", "créatif", "ludique"],
    complexity: "facile"
  },
  {
    id: 5,
    name: "7 Wonders",
    emoji: "🏛️",
    minPlayers: 3,
    maxPlayers: 7,
    duration: "60 min",
    description: "Développez une civilisation à travers différentes ères. Draft de cartes sophistiqué.",
    types: ["stratégie", "complexe", "civilisation"],
    complexity: "difficile"
  },
  {
    id: 6,
    name: "Codenames",
    emoji: "🕵️",
    minPlayers: 4,
    maxPlayers: 8,
    duration: "15 min",
    description: "En tant que maître espion, faites deviner les mots secrets à votre équipe.",
    types: ["party", "équipe", "rapide"],
    complexity: "facile"
  },
  {
    id: 7,
    name: "Pandemic",
    emoji: "🌍",
    minPlayers: 2,
    maxPlayers: 4,
    duration: "45 min",
    description: "Travaillez ensemble pour arrêter des épidémies mondiales. Jeu coopératif intense.",
    types: ["coopératif", "stratégie", "aventure"],
    complexity: "moyen"
  },
  {
    id: 8,
    name: "Exploding Kittens",
    emoji: "💣",
    minPlayers: 2,
    maxPlayers: 5,
    duration: "15 min",
    description: "Un jeu de cartes chaotique et hilarant où les chatons explosifs règnent en maître.",
    types: ["party", "rapide", "cartes"],
    complexity: "facile"
  },
  {
    id: 9,
    name: "Azul",
    emoji: "🔷",
    minPlayers: 2,
    maxPlayers: 4,
    duration: "30 min",
    description: "Composez des motifs de carrelage magnifiques. Esthétique et stratégie combinées.",
    types: ["stratégie", "familial", "placement"],
    complexity: "facile"
  },
  {
    id: 10,
    name: "Splendor",
    emoji: "💎",
    minPlayers: 2,
    maxPlayers: 4,
    duration: "30 min",
    description: "Devenez un marchand de gemmes prospère à la Renaissance. Gestion de ressources élégante.",
    types: ["stratégie", "économie", "familial"],
    complexity: "moyen"
  }
];

export const gameTypes = [
  "stratégie",
  "party",
  "familial",
  "coopératif",
  "rapide",
  "complexe",
  "créatif",
  "équipe",
  "placement",
  "cartes",
  "négociation",
  "civilisation",
  "aventure",
  "collection",
  "économie",
  "ludique"
];
