// src/utils/gameRecommendations.js
import { games } from '../data/games';

/**
 * Algorithme de recommandation basé sur :
 * - Nombre de joueurs
 * - Préférences de l'utilisateur
 * - Types de jeux favoris
 */
export function getGameRecommendations(playerCount, userPreferences = [], maxResults = 5) {
  if (!playerCount || playerCount < 2) return [];

  const scoredGames = games
    .filter(game => playerCount >= game.minPlayers && playerCount <= game.maxPlayers)
    .map(game => {
      let score = 0;

      // Points bonus pour chaque type de préférence correspondant
      game.types.forEach(type => {
        if (userPreferences.includes(type)) {
          score += 3;
        }
      });

      // Points bonus pour le nombre idéal de joueurs
      if (playerCount >= 3 && playerCount <= 4) score += 2;
      if (playerCount === 2) score += 1;

      // Réduire les jeux trop complexes si peu de préférences
      if (game.complexity === 'difficile' && userPreferences.length < 2) {
        score -= 1;
      }

      // Boost les jeux rapides pour les petits groupes
      if (playerCount <= 2 && game.types.includes('rapide')) {
        score += 1;
      }

      return {
        ...game,
        matchScore: Math.max(0, score)
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, maxResults);

  return scoredGames;
}

/**
 * Obtient les jeux recommandés avec des explications
 */
export function getRecommendationsWithReasons(playerCount, userPreferences = []) {
  const recommendations = getGameRecommendations(playerCount, userPreferences);

  return recommendations.map((game, index) => ({
    ...game,
    matchPercentage: game.matchScore > 0 ? Math.min(100, game.matchScore * 20) : 0,
    reason: index === 0 ? '⭐ Coup de cœur' : `📌 Recommandé pour vous`
  }));
}

/**
 * Obtient les jeux filtrés par type
 */
export function getGamesByType(type) {
  return games.filter(game => game.types.includes(type));
}

/**
 * Recherche les jeux par nom ou description
 */
export function searchGames(query) {
  const lowerQuery = query.toLowerCase();
  return games.filter(game =>
    game.name.toLowerCase().includes(lowerQuery) ||
    game.description.toLowerCase().includes(lowerQuery) ||
    game.types.some(type => type.toLowerCase().includes(lowerQuery))
  );
}
