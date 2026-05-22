// src/pages/Catalog.jsx
import React, { useState, useMemo } from 'react';
import { games as seedGames } from '../data/games';
import { MECHANICS } from '../data/mechanics';
import { useGames } from '../hooks/useGames';
import GameCard from '../components/GameCard';
import { motion } from 'framer-motion';
import '../styles/pages/Catalog.css';

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [playerFilter, setPlayerFilter] = useState(0);

  // Charge les jeux depuis Firestore (temps réel) avec fallback sur le seed
  const { games: liveGames, loading } = useGames();
  const games = (liveGames && liveGames.length > 0) ? liveGames : seedGames;

  const filteredGames = useMemo(() => {
    let results = games;

    // Recherche par texte (nom + description)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(g =>
        (g.name || '').toLowerCase().includes(q) ||
        (g.description || '').toLowerCase().includes(q)
      );
    }

    // Filtre par mécaniques (au moins une commune)
    if (selectedTypes.length > 0) {
      results = results.filter(game =>
        selectedTypes.some(type => (game.types || []).includes(type))
      );
    }

    // Filtre par nombre de joueurs
    if (playerFilter > 0) {
      results = results.filter(game =>
        playerFilter >= (game.minPlayers || 1) && playerFilter <= (game.maxPlayers || 99)
      );
    }

    return results;
  }, [games, searchQuery, selectedTypes, playerFilter]);

  const toggleTypeFilter = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTypes([]);
    setPlayerFilter(0);
  };

  return (
    <motion.div
      className="catalog-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1>📚 Catalogue complet</h1>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Rechercher un jeu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filters-group">
          <div className="filter-group">
            <h3>Nombre de joueurs</h3>
            <div className="player-buttons">
              {[0, 2, 3, 4, 5, 6].map(num => (
                <button
                  key={num}
                  className={`player-btn ${playerFilter === num ? 'active' : ''}`}
                  onClick={() => setPlayerFilter(playerFilter === num ? 0 : num)}
                >
                  {num === 0 ? 'Tous' : num}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h3>Mécaniques</h3>
            <div className="type-filters">
              {MECHANICS.map(m => (
                <button
                  key={m.id}
                  className={`type-filter ${selectedTypes.includes(m.id) ? 'active' : ''}`}
                  onClick={() => toggleTypeFilter(m.id)}
                >
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="results-info">
        {loading ? 'Chargement…' : (
          <>
            {filteredGames.length} jeu{filteredGames.length !== 1 ? 'x' : ''} trouvé{filteredGames.length !== 1 ? 's' : ''}
            {liveGames && liveGames.length === 0 && (
              <span style={{ marginLeft: 10, color: '#999', fontSize: 13 }}>
                (catalogue par défaut — l'admin peut ajouter des jeux)
              </span>
            )}
          </>
        )}
      </div>

      <motion.div
        className="games-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {filteredGames.length > 0 ? (
          filteredGames.map(game => (
            <motion.div key={game.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <GameCard game={game} />
            </motion.div>
          ))
        ) : !loading && (
          <div className="no-results">
            <p>Aucun jeu trouvé avec ces critères</p>
            <button onClick={resetFilters} className="btn btn-primary">
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
