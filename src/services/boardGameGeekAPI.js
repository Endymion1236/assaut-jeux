// src/services/boardGameGeekAPI.js
//
// En dev (localhost) on appelle directement BGG.
// En prod on passe par notre proxy Vercel /api/bgg pour contourner CORS.

import { BGG_MECHANIC_MAP } from '../data/mechanics';

const isLocalhost = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
   window.location.hostname === '127.0.0.1');

const buildUrl = (path, params) => {
  const queryString = new URLSearchParams(params).toString();
  if (isLocalhost) {
    return `https://boardgamegeek.com/xmlapi2/${path}?${queryString}`;
  }
  return `/api/bgg?path=${path}&${queryString}`;
};

/**
 * Recherche un jeu sur BoardGameGeek par nom
 */
export async function searchBoardGame(gameName) {
  try {
    const response = await fetch(
      buildUrl('search', { query: gameName, type: 'boardgame' })
    );
    const text = await response.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');

    if (xmlDoc.getElementsByTagName('item').length === 0) {
      return [];
    }

    const results = [];
    const items = xmlDoc.getElementsByTagName('item');

    for (let i = 0; i < Math.min(items.length, 8); i++) {
      const item = items[i];
      const id = item.getAttribute('id');
      const nameEl = item.getElementsByTagName('name')[0];
      const yearEl = item.getElementsByTagName('yearpublished')[0];

      results.push({
        id,
        name: nameEl ? (nameEl.getAttribute('value') || nameEl.textContent || 'Unknown') : 'Unknown',
        yearPublished: yearEl ? (yearEl.getAttribute('value') || yearEl.textContent || '') : '',
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
 */
export async function getBoardGameDetails(gameId) {
  try {
    const response = await fetch(
      buildUrl('thing', { id: gameId, stats: '1' })
    );
    const text = await response.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');

    const item = xmlDoc.getElementsByTagName('item')[0];
    if (!item) {
      throw new Error('Game not found');
    }

    // Nom primaire
    let name = '';
    const nameElements = item.getElementsByTagName('name');
    for (let i = 0; i < nameElements.length; i++) {
      if (nameElements[i].getAttribute('type') === 'primary') {
        name = nameElements[i].getAttribute('value') || nameElements[i].textContent || '';
        break;
      }
    }
    if (!name && nameElements[0]) {
      name = nameElements[0].getAttribute('value') || nameElements[0].textContent || '';
    }

    // Description
    const rawDescription = item.getElementsByTagName('description')[0]?.textContent || '';
    const description = decodeHtmlEntities(rawDescription);

    // Helpers
    const readInt = (tag, fallback) => {
      const el = item.getElementsByTagName(tag)[0];
      if (!el) return fallback;
      const val = el.getAttribute('value') || el.textContent;
      const n = parseInt(val);
      return Number.isFinite(n) ? n : fallback;
    };

    const minPlayers = readInt('minplayers', 1);
    const maxPlayers = readInt('maxplayers', 4);
    const playingTime = readInt('playingtime', 30);

    // Mécaniques + catégories
    const mechanics = [];
    const categories = [];
    const linkElements = item.getElementsByTagName('link');
    for (let i = 0; i < linkElements.length; i++) {
      const type = linkElements[i].getAttribute('type');
      const value = linkElements[i].getAttribute('value');
      if (type === 'boardgamemechanic') mechanics.push(value);
      if (type === 'boardgamecategory') categories.push(value);
    }

    const averageEl = item.getElementsByTagName('average')[0];
    const averageRating = parseFloat(
      averageEl?.getAttribute('value') || averageEl?.textContent || '0'
    );

    const yearPublished = readInt('yearpublished', new Date().getFullYear());

    return {
      bggId: gameId,
      name,
      description: truncate(description, 400),
      minPlayers,
      maxPlayers,
      playingTime,
      mechanics,
      categories,
      averageRating,
      yearPublished
    };
  } catch (error) {
    console.error('Erreur fetch détails BGG:', error);
    throw error;
  }
}

function decodeHtmlEntities(str) {
  if (!str) return '';
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value.replace(/&#10;/g, '\n').trim();
}

function truncate(str, maxLen) {
  if (!str || str.length <= maxLen) return str;
  const cut = str.substring(0, maxLen);
  const lastDot = cut.lastIndexOf('.');
  return (lastDot > maxLen * 0.6 ? cut.substring(0, lastDot + 1) : cut + '…');
}

/**
 * Convertit les mécaniques + catégories BGG en types internes (IDs).
 */
export function convertMechanicsToTypes(mechanics = [], categories = []) {
  const types = new Set();
  const allTags = [...(mechanics || []), ...(categories || [])];

  allTags.forEach(tag => {
    const tagLower = (tag || '').toLowerCase();
    Object.entries(BGG_MECHANIC_MAP).forEach(([bggKey, internalId]) => {
      if (tagLower.includes(bggKey)) {
        types.add(internalId);
      }
    });
  });

  return Array.from(types).slice(0, 4);
}

/**
 * Formatage du temps de jeu en string lisible
 */
export function formatPlayingTime(minutes) {
  if (minutes < 15) return '10-15 min';
  if (minutes < 30) return '15-30 min';
  if (minutes < 45) return '30-45 min';
  if (minutes < 60) return '45-60 min';
  if (minutes < 120) return '60-120 min';
  return '120+ min';
}
