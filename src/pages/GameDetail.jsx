// src/pages/GameDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  doc, getDoc, updateDoc, collection, query, onSnapshot
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Users, Clock, Calendar, ExternalLink } from 'lucide-react';
import { getMechanicLabel, getMechanicEmoji } from '../data/mechanics';
import '../styles/pages/GameDetail.css';

export default function GameDetail({ user }) {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [linkedEvents, setLinkedEvents] = useState([]);

  // Charge le jeu
  useEffect(() => {
    const fetchGame = async () => {
      try {
        const snap = await getDoc(doc(db, 'games', gameId));
        if (snap.exists()) {
          setGame({ id: snap.id, ...snap.data() });
        } else {
          setGame(null);
        }
      } catch (err) {
        console.error('Erreur fetch jeu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [gameId]);

  // Statut favori
  useEffect(() => {
    if (!auth.currentUser) return;
    getDoc(doc(db, 'users', auth.currentUser.uid)).then(snap => {
      if (snap.exists()) {
        const favs = snap.data().favorites || [];
        setIsFavorite(favs.includes(gameId));
      }
    });
  }, [gameId]);

  // Soirées à venir qui mentionnent ce jeu (par nom dans la description ou champ gameId si présent)
  useEffect(() => {
    if (!game) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const q = query(collection(db, 'events'));
    const unsub = onSnapshot(q, (snap) => {
      const matchingEvents = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(ev => {
          if (!ev.date) return false;
          const evDate = new Date(ev.date);
          if (evDate < today) return false;
          // Match par champ gameId direct ou par mention du nom dans description/name
          if (ev.gameId === game.id) return true;
          if (ev.gameIds && Array.isArray(ev.gameIds) && ev.gameIds.includes(game.id)) return true;
          const nameLower = game.name?.toLowerCase() || '';
          return (
            (ev.name || '').toLowerCase().includes(nameLower) ||
            (ev.description || '').toLowerCase().includes(nameLower)
          );
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      setLinkedEvents(matchingEvents);
    });
    return () => unsub();
  }, [game]);

  const toggleFavorite = async () => {
    if (!auth.currentUser) return;
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const userDoc = await getDoc(userRef);
    const favorites = userDoc.data().favorites || [];

    if (isFavorite) {
      await updateDoc(userRef, { favorites: favorites.filter(id => id !== gameId) });
    } else {
      await updateDoc(userRef, { favorites: [...favorites, gameId] });
    }
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return <div className="game-detail-loading">Chargement…</div>;
  }

  if (!game) {
    return (
      <div className="game-detail-empty">
        <h1>Jeu introuvable</h1>
        <p>Ce jeu n'existe pas ou a été supprimé.</p>
        <Link to="/catalog" className="btn btn-primary">← Retour au catalogue</Link>
      </div>
    );
  }

  return (
    <motion.div
      className="game-detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button onClick={() => navigate(-1)} className="back-link">
        <ArrowLeft size={18} /> Retour
      </button>

      <div className="game-detail-grid">
        {/* === COLONNE GAUCHE : IMAGE === */}
        <div className="game-detail-visual">
          {game.image || game.thumbnail ? (
            <img
              src={game.image || game.thumbnail}
              alt={game.name}
              className="detail-img"
            />
          ) : (
            <div className="detail-placeholder">
              <span>{game.emoji || '🎲'}</span>
            </div>
          )}
        </div>

        {/* === COLONNE DROITE : INFOS === */}
        <div className="game-detail-info">
          <h1 className="detail-title">{game.name}</h1>

          <div className="detail-meta">
            <span className="detail-meta-item">
              <Users size={16} /> {game.minPlayers}–{game.maxPlayers} joueur·euse·s
            </span>
            <span className="detail-meta-item">
              <Clock size={16} /> {game.duration}
            </span>
          </div>

          {game.types && game.types.length > 0 && (
            <div className="detail-mechanics">
              {game.types.map(t => (
                <span key={t} className="mechanic-tag">
                  {getMechanicEmoji(t)} {getMechanicLabel(t)}
                </span>
              ))}
            </div>
          )}

          {game.description && (
            <div className="detail-description">
              <h2>Description</h2>
              <p>{game.description}</p>
            </div>
          )}

          <div className="detail-actions">
            {user && (
              <button
                className={`btn btn-fav ${isFavorite ? 'active' : ''}`}
                onClick={toggleFavorite}
              >
                <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                {isFavorite ? 'Dans mes favoris' : 'Ajouter aux favoris'}
              </button>
            )}

            {game.bggId && (
              <a
                href={`https://boardgamegeek.com/boardgame/${game.bggId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-bgg"
              >
                <ExternalLink size={16} /> Voir sur BoardGameGeek
              </a>
            )}
          </div>
        </div>
      </div>

      {/* === SOIRÉES LIÉES === */}
      <section className="linked-events">
        <h2>📅 Soirées à venir avec ce jeu ({linkedEvents.length})</h2>
        {linkedEvents.length === 0 ? (
          <p className="muted">
            Aucune soirée prévue avec ce jeu pour l'instant.
            <Link to="/events" style={{ marginLeft: 8, color: 'var(--teal)' }}>
              Organise-en une ?
            </Link>
          </p>
        ) : (
          <div className="linked-events-list">
            {linkedEvents.map(ev => (
              <Link key={ev.id} to="/events" className="linked-event-card">
                <Calendar size={16} />
                <div>
                  <strong>{ev.name}</strong>
                  <p>
                    {new Date(ev.date).toLocaleDateString('fr-FR', {
                      weekday: 'long', day: 'numeric', month: 'long'
                    })} à {ev.time} — {ev.location}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </motion.div>
  );
}
