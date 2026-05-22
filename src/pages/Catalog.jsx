// src/pages/Catalog.jsx
import React, { useState, useMemo } from 'react';
import { games, gameTypes } from '../data/games';
import { searchGames } from '../utils/gameRecommendations';
import GameCard from '../components/GameCard';
import { motion } from 'framer-motion';
import '../styles/pages/Catalog.css';

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [playerFilter, setPlayerFilter] = useState(0);

  const filteredGames = useMemo(() => {
    let results = games;

    // Recherche par texte
    if (searchQuery) {
      results = searchGames(searchQuery);
    }

    // Filtre par types
    if (selectedTypes.length > 0) {
      results = results.filter(game =>
        selectedTypes.some(type => game.types.includes(type))
      );
    }

    // Filtre par nombre de joueurs
    if (playerFilter > 0) {
      results = results.filter(game =>
        playerFilter >= game.minPlayers && playerFilter <= game.maxPlayers
      );
    }

    return results;
  }, [searchQuery, selectedTypes, playerFilter]);

  const toggleTypeFilter = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
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
            <h3>Types de jeux</h3>
            <div className="type-filters">
              {gameTypes.map(type => (
                <button
                  key={type}
                  className={`type-filter ${selectedTypes.includes(type) ? 'active' : ''}`}
                  onClick={() => toggleTypeFilter(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="results-info">
        {filteredGames.length} jeu{filteredGames.length !== 1 ? 'x' : ''} trouvé{filteredGames.length !== 1 ? 's' : ''}
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
        ) : (
          <div className="no-results">
            <p>Aucun jeu trouvé avec ces critères</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTypes([]);
                setPlayerFilter(0);
              }}
              className="btn btn-primary"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
