// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getRecommendationsWithReasons } from '../utils/gameRecommendations';
import { motion } from 'framer-motion';
import GameCard from '../components/GameCard';
import '../styles/pages/Home.css';

export default function Home({ user }) {
  const [userPreferences, setUserPreferences] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const prefs = userDoc.data().preferences || [];
          setUserPreferences(prefs);
          const recs = getRecommendationsWithReasons(3, prefs);
          setRecommendations(recs);
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div className="home-page" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.section className="hero" variants={itemVariants}>
        <h1>Bienvenue, {user.displayName} ! 👋</h1>
        <p>Découvrez des jeux adaptés à vos préférences et organisez vos soirées jeux</p>

        <div className="cta-buttons">
          <Link to="/events" className="btn btn-primary">
            📅 Créer une soirée
          </Link>
          <Link to="/catalog" className="btn btn-secondary">
            📚 Voir le catalogue
          </Link>
        </div>
      </motion.section>

      <motion.section className="recommendations-section" variants={itemVariants}>
        <h2>🎯 Recommandations pour vous</h2>
        {loading ? (
          <div className="loading">Chargement...</div>
        ) : recommendations.length > 0 ? (
          <motion.div className="games-grid" variants={containerVariants}>
            {recommendations.map((game, index) => (
              <motion.div key={game.id} variants={itemVariants}>
                <GameCard game={game} showMatch={true} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="empty-state">
            <p>Consultez vos préférences pour obtenir des recommandations personnalisées</p>
            <Link to="/profile" className="btn btn-primary">
              Configurer mes préférences
            </Link>
          </div>
        )}
      </motion.section>

      <motion.section className="info-section" variants={itemVariants}>
        <h2>Comment ça marche ? 🎮</h2>
        <div className="info-grid">
          <div className="info-card">
            <div className="info-number">1</div>
            <h3>Configurer vos préférences</h3>
            <p>Dites-nous quels types de jeux vous aimez</p>
          </div>
          <div className="info-card">
            <div className="info-number">2</div>
            <h3>Créer une soirée</h3>
            <p>Organisez une soirée avec vos amis</p>
          </div>
          <div className="info-card">
            <div className="info-number">3</div>
            <h3>Découvrir des jeux</h3>
            <p>Recevez des recommandations intelligentes</p>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
