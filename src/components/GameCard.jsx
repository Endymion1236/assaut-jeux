// src/components/GameCard.jsx
import React, { useState, useEffect } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import '../styles/components/GameCard.css';

export default function GameCard({ game, showMatch = false }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkFavorite();
  }, [game.id]);

  const checkFavorite = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const favorites = userDoc.data().favorites || [];
        setIsFavorite(favorites.includes(game.id));
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const toggleFavorite = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      const favorites = userDoc.data().favorites || [];

      if (isFavorite) {
        await updateDoc(userRef, {
          favorites: favorites.filter(id => id !== game.id)
        });
      } else {
        await updateDoc(userRef, {
          favorites: [...favorites, game.id]
        });
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="game-card"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="game-header">
        <span className="game-emoji">{game.emoji}</span>
        <motion.button
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={toggleFavorite}
          disabled={loading}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
        </motion.button>
      </div>

      <h3 className="game-title">{game.name}</h3>

      <p className="game-description">{game.description}</p>

      <div className="game-meta">
        <span className="meta-item">👥 {game.minPlayers}-{game.maxPlayers}</span>
        <span className="meta-item">⏱️ {game.duration}</span>
      </div>

      <div className="game-types">
        {game.types.map(type => (
          <span key={type} className="type-badge">
            {type}
          </span>
        ))}
      </div>

      {showMatch && game.matchScore !== undefined && (
        <div className="match-bar">
          <div className="match-fill" style={{ width: `${game.matchScore * 20}%` }}></div>
          <span className="match-text">{Math.min(100, game.matchScore * 20)}% compatible</span>
        </div>
      )}
    </motion.div>
  );
}
