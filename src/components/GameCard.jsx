// src/components/GameCard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { getMechanicLabel, getMechanicEmoji } from '../data/mechanics';
import '../styles/components/GameCard.css';

export default function GameCard({ game, showMatch = false, linked = true }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const checkFavorite = useCallback(async () => {
    try {
      if (!auth.currentUser) return;
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const favorites = userDoc.data().favorites || [];
        setIsFavorite(favorites.includes(String(game.id)));
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  }, [game.id]);

  useEffect(() => {
    checkFavorite();
  }, [checkFavorite]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!auth.currentUser) return;
    setLoading(true);

    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      const favorites = userDoc.data().favorites || [];

      if (isFavorite) {
        await updateDoc(userRef, {
          favorites: favorites.filter(id => id !== String(game.id))
        });
      } else {
        await updateDoc(userRef, {
          favorites: [...favorites, String(game.id)]
        });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasImage = (game.thumbnail || game.image) && !imgError;

  const cardContent = (
    <motion.div
      className="game-card"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="game-visual">
        {hasImage ? (
          <img
            src={game.thumbnail || game.image}
            alt={game.name}
            className="game-img"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <span className="game-emoji-large">{game.emoji || '🎲'}</span>
        )}

        <motion.button
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={toggleFavorite}
          disabled={loading}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
        </motion.button>
      </div>

      <div className="game-body">
        <h3 className="game-title">{game.name}</h3>

        {game.description && (
          <p className="game-description">{game.description}</p>
        )}

        <div className="game-meta">
          <span className="meta-item">👥 {game.minPlayers}-{game.maxPlayers}</span>
          <span className="meta-item">⏱️ {game.duration}</span>
        </div>

        <div className="game-types">
          {(game.types || []).slice(0, 3).map(type => (
            <span key={type} className="type-badge">
              {getMechanicEmoji(type)} {getMechanicLabel(type)}
            </span>
          ))}
        </div>

        {showMatch && game.matchScore !== undefined && (
          <div className="match-bar">
            <div className="match-fill" style={{ width: `${Math.min(100, game.matchScore * 20)}%` }}></div>
            <span className="match-text">{Math.min(100, game.matchScore * 20)}% compatible</span>
          </div>
        )}
      </div>
    </motion.div>
  );

  // Si le jeu vient de Firestore (id string) et linked=true, wrap dans un Link
  if (linked && game.id && typeof game.id === 'string') {
    return <Link to={`/games/${game.id}`} className="game-card-link">{cardContent}</Link>;
  }
  return cardContent;
}
