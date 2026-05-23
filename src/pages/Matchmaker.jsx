// src/pages/Matchmaker.jsx
// Outil "Quel jeu ce soir ?" — propose des jeux en fonction du contexte
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Users, Clock, Heart, RotateCcw } from 'lucide-react';
import { getMechanicLabel, getMechanicEmoji } from '../data/mechanics';
import '../styles/pages/Matchmaker.css';

const MOODS = [
  {
    id: 'chill',
    emoji: '😌',
    label: 'Chill',
    desc: 'Tranquille, peu de réflexion',
    boostMechanics: ['party', 'roll-write'],
    maxDuration: 60,
  },
  {
    id: 'strategy',
    emoji: '🧠',
    label: 'Stratégie',
    desc: 'On veut réfléchir',
    boostMechanics: ['strategie', 'placement', 'gestion', 'deckbuilding'],
    minDuration: 45,
  },
  {
    id: 'fun',
    emoji: '🎉',
    label: 'Fun & ambiance',
    desc: 'Pour rigoler ensemble',
    boostMechanics: ['party', 'bluff'],
    maxDuration: 45,
  },
  {
    id: 'discover',
    emoji: '🗺️',
    label: 'Aventure',
    desc: 'Immersion, narration',
    boostMechanics: ['narratif', 'enquete'],
  },
  {
    id: 'coop',
    emoji: '🤝',
    label: 'On joue ensemble',
    desc: 'Coopératif, pas de gagnant solo',
    boostMechanics: ['narratif', 'strategie'],
  },
  {
    id: 'short',
    emoji: '⚡',
    label: 'Une partie rapide',
    desc: 'Moins de 30 min',
    boostMechanics: ['party', 'roll-write', 'bluff'],
    maxDuration: 30,
  },
];

// Parse "30-45 min" → 45 (durée moyenne en min)
function parseDuration(durStr) {
  if (!durStr) return 60;
  const match = durStr.match(/(\d+)(?:[-–](\d+))?/);
  if (!match) return 60;
  const min = parseInt(match[1]);
  const max = match[2] ? parseInt(match[2]) : min;
  return (min + max) / 2;
}

export default function Matchmaker({ user }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playerCount, setPlayerCount] = useState(4);
  const [selectedMood, setSelectedMood] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Charge les jeux Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'games'),
      (snap) => {
        setGames(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error('Erreur fetch games:', err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  // Calcule les meilleurs jeux pour le contexte donné
  const recommendations = useMemo(() => {
    if (!selectedMood) return [];

    const scored = games.map(g => {
      let score = 0;
      const types = g.types || [];
      const duration = parseDuration(g.duration);
      const minP = g.minPlayers || 1;
      const maxP = g.maxPlayers || 99;

      // 1. Filtre dur : nombre de joueurs compatible
      if (playerCount < minP || playerCount > maxP) {
        return { ...g, score: -1, reasons: [] };
      }

      const reasons = [];

      // 2. Boost mécaniques de l'humeur
      const matches = types.filter(t => selectedMood.boostMechanics.includes(t));
      score += matches.length * 5;
      if (matches.length > 0) {
        reasons.push(`Mécaniques préférées : ${matches.map(m => getMechanicLabel(m)).join(', ')}`);
      }

      // 3. Boost durée si l'humeur a une contrainte
      if (selectedMood.maxDuration && duration <= selectedMood.maxDuration) {
        score += 3;
        reasons.push(`Partie rapide (${g.duration})`);
      }
      if (selectedMood.minDuration && duration >= selectedMood.minDuration) {
        score += 2;
        reasons.push(`Partie consistante (${g.duration})`);
      }

      // 4. Bonus si nombre de joueurs "sweet spot" (au milieu de la fourchette)
      const sweetSpot = (minP + maxP) / 2;
      if (Math.abs(playerCount - sweetSpot) <= 1) {
        score += 2;
      }

      return { ...g, score, reasons };
    });

    // Filtre les jeux incompatibles + tri
    return scored
      .filter(g => g.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [games, playerCount, selectedMood]);

  const handleSearch = () => {
    if (!selectedMood) {
      alert('Choisis une ambiance !');
      return;
    }
    setShowResults(true);
  };

  const reset = () => {
    setShowResults(false);
    setSelectedMood(null);
  };

  if (loading) {
    return <div className="mm-loading">Chargement…</div>;
  }

  return (
    <motion.div className="matchmaker-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="mm-header">
        <Sparkles size={36} />
        <h1>Quel jeu ce soir ?</h1>
        <p>
          Tu hésites ? Dis-moi comment vous êtes ce soir, je te propose
          {' '}<strong>3 jeux du club</strong> qui devraient bien marcher.
        </p>
      </header>

      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mm-form"
          >
            <section className="mm-section">
              <h2><Users size={20} /> Vous êtes combien ?</h2>
              <div className="mm-player-row">
                {[2, 3, 4, 5, 6, 7, 8].map(n => (
                  <button
                    key={n}
                    className={`mm-player-btn ${playerCount === n ? 'active' : ''}`}
                    onClick={() => setPlayerCount(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </section>

            <section className="mm-section">
              <h2><Heart size={20} /> Quelle ambiance ?</h2>
              <div className="mm-moods-grid">
                {MOODS.map(mood => (
                  <button
                    key={mood.id}
                    className={`mm-mood-card ${selectedMood?.id === mood.id ? 'active' : ''}`}
                    onClick={() => setSelectedMood(mood)}
                  >
                    <span className="mm-mood-emoji">{mood.emoji}</span>
                    <strong>{mood.label}</strong>
                    <small>{mood.desc}</small>
                  </button>
                ))}
              </div>
            </section>

            <button
              className="mm-submit"
              onClick={handleSearch}
              disabled={!selectedMood}
            >
              <Sparkles size={18} /> Trouver le jeu parfait
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mm-results"
          >
            <div className="mm-results-header">
              <p>
                Pour <strong>{playerCount} joueur·euse·s</strong>{' '}
                d'humeur <strong>{selectedMood.label.toLowerCase()}</strong> :
              </p>
              <button className="mm-reset" onClick={reset}>
                <RotateCcw size={16} /> Recommencer
              </button>
            </div>

            {recommendations.length === 0 ? (
              <div className="mm-empty">
                <p>
                  Hmm, aucun jeu du catalogue ne correspond à ces critères.
                </p>
                <p style={{ marginTop: 12 }}>
                  Essaie un autre nombre de joueurs ou une autre ambiance,
                  ou ajoute des jeux dans le{' '}
                  <Link to="/catalog">catalogue</Link>.
                </p>
              </div>
            ) : (
              <div className="mm-suggestions">
                {recommendations.map((game, idx) => (
                  <motion.div
                    key={game.id}
                    className={`mm-suggestion ${idx === 0 ? 'top' : ''}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.15 }}
                  >
                    {idx === 0 && <span className="mm-badge-top">🏆 Notre top</span>}

                    <div className="mm-suggestion-content">
                      {game.thumbnail || game.image ? (
                        <img
                          src={game.thumbnail || game.image}
                          alt={game.name}
                          className="mm-suggestion-img"
                        />
                      ) : (
                        <div className="mm-suggestion-emoji">
                          {game.emoji || '🎲'}
                        </div>
                      )}

                      <div className="mm-suggestion-info">
                        <h3>{game.name}</h3>
                        <div className="mm-meta">
                          <span><Users size={14} /> {game.minPlayers}–{game.maxPlayers}</span>
                          <span><Clock size={14} /> {game.duration}</span>
                        </div>

                        {game.types && game.types.length > 0 && (
                          <div className="mm-mechanics">
                            {game.types.slice(0, 3).map(t => (
                              <span key={t} className="mm-mech-tag">
                                {getMechanicEmoji(t)} {getMechanicLabel(t)}
                              </span>
                            ))}
                          </div>
                        )}

                        {game.reasons && game.reasons.length > 0 && (
                          <ul className="mm-reasons">
                            {game.reasons.map((r, i) => (
                              <li key={i}>✓ {r}</li>
                            ))}
                          </ul>
                        )}

                        <Link to={`/games/${game.id}`} className="mm-link">
                          Voir la fiche complète →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
