// src/services/boardGameGeekAPI.js

/**
 * Service pour accéder à l'API BoardGameGeek
 * Récupère les infos : joueurs min/max, durée, mécaniques
 */

const BGG_API = 'https://boardgamegeek.com/xmlapi2';

/**
 * Recherche un jeu sur BoardGameGeek par nom
 * @param {string} gameName - Nom du jeu
 * @returns {Promise<Array>} - Liste des jeux trouvés
 */
export async function searchBoardGame(gameName) {
  try {
    const response = await fetch(
      `${BGG_API}/search?query=${encodeURIComponent(gameName)}&type=boardgame`
    );
    const text = await response.text();
    
    // Parse XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    
    if (xmlDoc.getElementsByTagName('item').length === 0) {
      return [];
    }

    const results = [];
    const items = xmlDoc.getElementsByTagName('item');

    for (let i = 0; i < Math.min(items.length, 5); i++) {
      const item = items[i];
      const id = item.getAttribute('id');
      const nameEl = item.getElementsByTagName('name')[0];
      
      results.push({
        id,
        name: nameEl ? nameEl.textContent : 'Unknown',
        yearPublished: item.getElementsByTagName('yearpublished')[0]?.textContent || ''
      });
    }

    return results;
  } catch (error) {
    console.error('Erreur recherche BGG:', error);
    return [];
  }
}

/**
 * Récupère les infos détaillées d'un jeu
 * @param {string} gameId - ID BoardGameGeek du jeu
 * @returns {Promise<Object>} - Infos du jeu (joueurs, durée, mécaniques)
 */
export async function getBoardGameDetails(gameId) {
  try {
    const response = await fetch(
      `${BGG_API}/thing?id=${gameId}&stats=1`
    );
    const text = await response.text();
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    
    const item = xmlDoc.getElementsByTagName('item')[0];
    if (!item) {
      throw new Error('Game not found');
    }

    // Récupère les infos
    const name = item.getElementsByTagName('name')[0]?.textContent || '';
    const description = item.getElementsByTagName('description')[0]?.textContent || '';
    
    // Joueurs
    const minPlayers = parseInt(
      item.getElementsByTagName('minplayers')[0]?.textContent || '1'
    );
    const maxPlayers = parseInt(
      item.getElementsByTagName('maxplayers')[0]?.textContent || '4'
    );
    
    // Durée de jeu
    const playingTime = parseInt(
      item.getElementsByTagName('playingtime')[0]?.textContent || '30'
    );
    
    // Mécaniques (mechanics)
    const mechanics = [];
    const mechanicElements = item.getElementsByTagName('mechanic');
    for (let i = 0; i < mechanicElements.length; i++) {
      mechanics.push(mechanicElements[i].textContent);
    }

    // Catégories
    const categories = [];
    const categoryElements = item.getElementsByTagName('category');
    for (let i = 0; i < categoryElements.length; i++) {
      categories.push(categoryElements[i].textContent);
    }

    // Moyenne de notes
    const averageRating = parseFloat(
      item.getElementsByTagName('average')[0]?.textContent || '0'
    );

    // Année de publication
    const yearPublished = parseInt(
      item.getElementsByTagName('yearpublished')[0]?.textContent || new Date().getFullYear()
    );

    return {
      bggId: gameId,
      name,
      description: description.substring(0, 200), // Premier 200 caractères
      minPlayers,
      maxPlayers,
      playingTime,
      mechanics: mechanics.slice(0, 5), // Top 5 mécaniques
      categories: categories.slice(0, 3), // Top 3 catégories
      averageRating,
      yearPublished
    };
  } catch (error) {
    console.error('Erreur fetch détails BGG:', error);
    throw error;
  }
}

/**
 * Convertit les mécaniques BGG en types de jeux simplifiés
 * @param {Array} mechanics - Mécaniques du jeu
 * @returns {Array} - Types simplifiés
 */
export function convertMechanicsToTypes(mechanics) {
  const typeMap = {
    'Card Drafting': 'stratégie',
    'Worker Placement': 'stratégie',
    'Tile Placement': 'placement',
    'Set Collection': 'collection',
    'Dice Rolling': 'chance',
    'Party Game': 'party',
    'Cooperative': 'coopératif',
    'Negotiation': 'négociation',
    'Memory': 'mémoire',
    'Pattern Recognition': 'puzzle',
    'Real-time': 'rapide',
    'Racing': 'aventure'
  };

  const types = [];
  mechanics.forEach(mechanic => {
    Object.entries(typeMap).forEach(([bgMechanic, type]) => {
      if (mechanic.toLowerCase().includes(bgMechanic.toLowerCase())) {
        if (!types.includes(type)) {
          types.push(type);
        }
      }
    });
  });

  // Ajoute au moins un type par défaut
  if (types.length === 0) {
    types.push('familial');
  }

  return types.slice(0, 4);
}

/**
 * Formatage du temps de jeu en string lisible
 * @param {number} minutes - Durée en minutes
 * @returns {string} - Formaté (ex: "45-60 min")
 */
export function formatPlayingTime(minutes) {
  if (minutes < 15) return '10-15 min';
  if (minutes < 30) return '15-30 min';
  if (minutes < 45) return '30-45 min';
  if (minutes < 60) return '45-60 min';
  if (minutes < 120) return '60-120 min';
  return '120+ min';
}
