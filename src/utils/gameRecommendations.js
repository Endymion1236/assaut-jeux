// src/utils/gameRecommendations.js
import { games as seedGames } from '../data/games';

/**
 * Algorithme de recommandation basé sur :
 * - Mécaniques préférées (poids fort)
 * - Disponibilité selon le nombre de joueurs (filtre dur)
 *
 * Signature flexible :
 *   getGameRecommendations(playerCountOrMaxResults, userPreferences, maxResults, gamesPool)
 *
 * Pour rester compatible avec l'appel actuel `getRecommendationsWithReasons(3, prefs)`
 * (où 3 = nombre de recommandations souhaitées, pas de joueurs),
 * on accepte aussi d'utiliser le premier argument comme limite.
 */
export function getGameRecommendations({
  playerCount = null,
  userPreferences = [],
  maxResults = 5,
  pool = seedGames,
} = {}) {
  let candidates = pool;

  // Filtre dur sur le nombre de joueurs si fourni
  if (playerCount && playerCount >= 1) {
    candidates = candidates.filter(g =>
      playerCount >= (g.minPlayers || 1) &&
      playerCount <= (g.maxPlayers || 99)
    );
  }

  // Scoring par recouvrement avec les préférences
  const scored = candidates.map(game => {
    let score = 0;
    const types = game.types || [];

    // +3 par mécanique commune avec les préférences
    types.forEach(t => {
      if (userPreferences.includes(t)) score += 3;
    });

    // Petit bonus si toutes les préférences sont couvertes
    if (userPreferences.length > 0 &&
        userPreferences.every(p => types.includes(p))) {
      score += 2;
    }

    return { ...game, matchScore: score };
  });

  // Tri : score décroissant, puis nom alphabétique pour stabiliser
  scored.sort((a, b) => b.matchScore - a.matchScore || a.name.localeCompare(b.name));

  return scored.slice(0, maxResults);
}

/**
 * Variante avec un % de matching pour l'affichage des cartes.
 * Signature historique : getRecommendationsWithReasons(maxResults, userPreferences)
 */
export function getRecommendationsWithReasons(maxResults = 3, userPreferences = [], pool) {
  const recs = getGameRecommendations({
    userPreferences,
    maxResults,
    pool: pool || seedGames,
  });

  return recs.map((game, index) => ({
    ...game,
    matchPercentage: game.matchScore > 0 ? Math.min(100, game.matchScore * 20) : 0,
    reason: index === 0 ? '⭐ Coup de cœur' : '📌 Recommandé pour toi',
  }));
}

/**
 * Filtre simple par mécanique
 */
export function getGamesByType(type, pool = seedGames) {
  return pool.filter(g => (g.types || []).includes(type));
}

/**
 * Recherche par nom + description + mécanique
 */
export function searchGames(query, pool = seedGames) {
  if (!query) return pool;
  const q = query.toLowerCase();
  return pool.filter(g =>
    (g.name || '').toLowerCase().includes(q) ||
    (g.description || '').toLowerCase().includes(q) ||
    (g.types || []).some(t => t.toLowerCase().includes(q))
  );
}
