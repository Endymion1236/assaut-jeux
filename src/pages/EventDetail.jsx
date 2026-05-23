// src/pages/EventDetail.jsx
// Page de détail d'une soirée + suggesteur de jeux basé sur les inscrits
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  doc, onSnapshot, updateDoc, arrayUnion, arrayRemove, deleteDoc, collection, getDocs
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Calendar, Clock, MapPin, Users, Sparkles,
  Trash2, UserPlus, UserMinus, Check, X, ChevronDown, ChevronUp
} from 'lucide-react';
import { getMechanicLabel, getMechanicEmoji } from '../data/mechanics';
import '../styles/pages/EventDetail.css';

export default function EventDetail({ user, isAdmin = false }) {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Suggestions
  const [allGames, setAllGames] = useState([]);
  const [allUsers, setAllUsers] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // === Charge l'événement en temps réel ===
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'events', eventId),
      (snap) => {
        if (snap.exists()) {
          setEvent({ id: snap.id, ...snap.data() });
        } else {
          setEvent(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Erreur fetch event:', err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [eventId]);

  // === Charge les jeux + les profils des participants pour le suggesteur ===
  const loadSuggestionData = async () => {
    if (loadingSuggestions || allGames.length > 0) return;
    setLoadingSuggestions(true);
    try {
      // Charge tous les jeux
      const gamesSnap = await getDocs(collection(db, 'games'));
      const games = gamesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAllGames(games);

      // Charge les profils des participants pour récupérer leurs préférences
      const participantIds = event?.participants || [];
      const profilesMap = {};
      for (const uid of participantIds) {
        try {
          // Note : la lecture du profil échoue si l'user n'est pas public
          // On utilise alors le pseudo stocké dans participantNames
          const userSnap = await getDocs(collection(db, 'users'));
          userSnap.docs.forEach(d => {
            if (d.id === uid) {
              profilesMap[uid] = { id: d.id, ...d.data() };
            }
          });
        } catch (err) {
          // ignore
        }
      }
      setAllUsers(profilesMap);
    } catch (err) {
      console.error('Erreur chargement suggestions:', err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // === Calcule les suggestions ===
  const suggestions = useMemo(() => {
    if (!showSuggestions || allGames.length === 0 || !event) return [];

    const participantIds = event.participants || [];
    const nbPlayers = participantIds.length;
    if (nbPlayers < 1) return [];

    // Agrège les préférences de tous les participants
    const groupPrefs = {}; // { mechanic_id: count }
    participantIds.forEach(uid => {
      const profile = allUsers[uid];
      const prefs = profile?.preferences || [];
      prefs.forEach(p => {
        groupPrefs[p] = (groupPrefs[p] || 0) + 1;
      });
    });

    // Calcule un score pour chaque jeu
    const scored = allGames
      .filter(g => {
        const minP = g.minPlayers || 1;
        const maxP = g.maxPlayers || 99;
        return nbPlayers >= minP && nbPlayers <= maxP;
      })
      .map(g => {
        const types = g.types || [];
        let score = 0;
        const matchedPrefs = [];
        const fans = []; // qui aime quoi

        types.forEach(t => {
          const fansCount = groupPrefs[t] || 0;
          if (fansCount > 0) {
            // Plus de fans = plus de score
            score += fansCount * 3;
            matchedPrefs.push({ mechanic: t, fansCount });

            // Liste les pseudos qui aiment cette mécanique
            participantIds.forEach(uid => {
              const profile = allUsers[uid];
              if (profile?.preferences?.includes(t)) {
                const name = profile.displayName ||
                  (event.participantNames && event.participantNames[participantIds.indexOf(uid)]) ||
                  '?';
                if (!fans.includes(name)) fans.push(name);
              }
            });
          }
        });

        // Bonus sweet-spot
        const sweetSpot = ((g.minPlayers || 1) + (g.maxPlayers || 4)) / 2;
        if (Math.abs(nbPlayers - sweetSpot) <= 1) score += 2;

        return { ...g, score, matchedPrefs, fans };
      })
      .filter(g => g.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    return scored;
  }, [showSuggestions, allGames, allUsers, event]);

  // === Actions sur la soirée ===
  const isJoined = user && event && (event.participants || []).includes(user.uid);
  const isOrganizer = user && event && event.organizerId === user.uid;
  const canManage = isOrganizer || isAdmin;
  const isFull = event && (event.participants || []).length >= (event.maxPlayers || 99);

  const handleJoin = async () => {
    if (!user || actionLoading) return;
    setActionLoading(true);
    try {
      await updateDoc(doc(db, 'events', event.id), {
        participants: arrayUnion(user.uid),
        participantNames: arrayUnion(user.displayName || user.email),
      });
    } catch (err) {
      alert("Impossible de s'inscrire");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!user || actionLoading) return;
    setActionLoading(true);
    try {
      await updateDoc(doc(db, 'events', event.id), {
        participants: arrayRemove(user.uid),
        participantNames: arrayRemove(user.displayName || user.email),
      });
    } catch (err) {
      alert("Impossible de se désinscrire");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Supprimer la soirée "${event.name}" ?`)) return;
    try {
      await deleteDoc(doc(db, 'events', event.id));
      navigate('/events');
    } catch (err) {
      alert('Suppression impossible');
    }
  };

  const handleFixGame = async (game) => {
    if (!canManage) return;
    try {
      await updateDoc(doc(db, 'events', event.id), {
        gameId: game.id,
        gameName: game.name,
        gameImage: game.thumbnail || game.image || '',
      });
    } catch (err) {
      alert('Impossible d\'attacher ce jeu');
    }
  };

  const handleUnfixGame = async () => {
    if (!canManage) return;
    try {
      await updateDoc(doc(db, 'events', event.id), {
        gameId: null,
        gameName: null,
        gameImage: null,
      });
    } catch (err) {
      alert('Impossible de détacher ce jeu');
    }
  };

  if (loading) {
    return <div className="ev-loading">Chargement de la soirée…</div>;
  }

  if (!event) {
    return (
      <div className="ev-empty">
        <h1>Soirée introuvable</h1>
        <p>Cette soirée n'existe pas ou a été supprimée.</p>
        <Link to="/events" className="btn btn-primary">← Toutes les soirées</Link>
      </div>
    );
  }

  const prettyDate = event.date
    ? new Date(event.date).toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      })
    : '';

  const isPast = event.date && new Date(event.date) < new Date(new Date().setHours(0, 0, 0, 0));
  const participants = event.participants || [];
  const participantNames = event.participantNames || [];

  return (
    <motion.div className="ev-detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <button onClick={() => navigate(-1)} className="back-link">
        <ArrowLeft size={18} /> Retour
      </button>

      {/* === HEADER === */}
      <div className={`ev-header ${isPast ? 'past' : ''}`}>
        <div className="ev-header-content">
          <h1>{event.name}</h1>
          {isPast && <span className="ev-past-badge">Soirée passée</span>}

          <div className="ev-meta-row">
            <span className="ev-meta-item">
              <Calendar size={16} /> {prettyDate}
            </span>
            <span className="ev-meta-item">
              <Clock size={16} /> {event.time}
            </span>
            <span className="ev-meta-item">
              <MapPin size={16} /> {event.location}
            </span>
            <span className="ev-meta-item">
              <Users size={16} /> {participants.length} / {event.maxPlayers}
            </span>
          </div>

          <p className="ev-organizer">
            Organisé par <strong>{event.organizerName}</strong>
          </p>
        </div>

        {canManage && (
          <button
            className="ev-delete-btn"
            onClick={handleDelete}
            title="Supprimer la soirée"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* === DESCRIPTION === */}
      {event.description && (
        <div className="ev-section">
          <h2>📝 Description</h2>
          <p className="ev-description">{event.description}</p>
        </div>
      )}

      {/* === JEU FIXÉ === */}
      {event.gameId && (
        <div className="ev-section ev-fixed-game">
          <h2>🎲 Le jeu de la soirée</h2>
          <div className="ev-fixed-game-card">
            {event.gameImage && (
              <img src={event.gameImage} alt={event.gameName} />
            )}
            <div>
              <strong>{event.gameName}</strong>
              <Link to={`/games/${event.gameId}`} className="link">
                Voir la fiche du jeu →
              </Link>
            </div>
            {canManage && (
              <button
                className="ev-unfix-btn"
                onClick={handleUnfixGame}
                title="Retirer ce jeu"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* === SUGGESTEUR === */}
      {!isPast && participants.length >= 1 && (
        <div className="ev-section ev-suggester">
          <button
            className="ev-suggester-toggle"
            onClick={() => {
              setShowSuggestions(!showSuggestions);
              if (!showSuggestions) loadSuggestionData();
            }}
          >
            <Sparkles size={18} />
            <span>Quel jeu pour les inscrits ?</span>
            {showSuggestions ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="ev-suggestions-wrapper"
              >
                {loadingSuggestions ? (
                  <p className="muted">Analyse des préférences des participants…</p>
                ) : suggestions.length === 0 ? (
                  <p className="muted">
                    Pas de suggestion trouvée. Soit le catalogue est trop petit pour {participants.length} joueur·euse·s,
                    soit les participants n'ont pas renseigné leurs préférences dans leur profil.
                  </p>
                ) : (
                  <>
                    <p className="suggester-intro">
                      Voici les jeux qui correspondent le mieux aux <strong>{participants.length} inscrit·e·s</strong>,
                      d'après leurs préférences :
                    </p>
                    <div className="ev-suggestions-list">
                      {suggestions.map((g, i) => (
                        <motion.div
                          key={g.id}
                          className={`ev-suggestion ${i === 0 ? 'top' : ''}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          {i === 0 && <span className="ev-suggestion-badge">🏆 Top match</span>}

                          {g.thumbnail || g.image ? (
                            <img
                              src={g.thumbnail || g.image}
                              alt={g.name}
                              className="ev-suggestion-img"
                            />
                          ) : (
                            <div className="ev-suggestion-emoji">{g.emoji || '🎲'}</div>
                          )}

                          <div className="ev-suggestion-info">
                            <h4>{g.name}</h4>
                            <div className="ev-suggestion-meta">
                              <span>👥 {g.minPlayers}–{g.maxPlayers}</span>
                              <span>⏱️ {g.duration}</span>
                            </div>

                            {g.matchedPrefs.length > 0 && (
                              <div className="ev-suggestion-mechs">
                                {g.matchedPrefs.map(mp => (
                                  <span key={mp.mechanic} className="suggestion-mech-tag">
                                    {getMechanicEmoji(mp.mechanic)} {getMechanicLabel(mp.mechanic)}
                                    {' '}<small>×{mp.fansCount}</small>
                                  </span>
                                ))}
                              </div>
                            )}

                            {g.fans.length > 0 && (
                              <p className="ev-suggestion-fans">
                                💚 <strong>{g.fans.join(', ')}</strong>
                                {' '}{g.fans.length === 1 ? 'aime' : 'aiment'} ce type de jeu
                              </p>
                            )}

                            <div className="ev-suggestion-actions">
                              <Link to={`/games/${g.id}`} className="suggestion-link">
                                Voir la fiche →
                              </Link>
                              {canManage && (
                                <button
                                  className="suggestion-fix-btn"
                                  onClick={() => handleFixGame(g)}
                                >
                                  <Check size={14} /> Choisir ce jeu
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <p className="suggester-hint">
                      💡 Les suggestions s'appuient sur les <strong>mécaniques préférées</strong> renseignées
                      dans le profil des participants. Plus les membres remplissent leur profil,
                      plus les suggestions sont pertinentes.
                    </p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* === PARTICIPANTS === */}
      <div className="ev-section">
        <h2>👥 Participant·e·s ({participants.length})</h2>
        {participants.length === 0 ? (
          <p className="muted">Pas encore d'inscrit·e.</p>
        ) : (
          <ul className="ev-participants-list">
            {participantNames.map((name, i) => (
              <li key={i}>
                <span className="ev-participant-avatar">
                  {(name || '?').charAt(0).toUpperCase()}
                </span>
                {name}
                {participants[i] === event.organizerId && (
                  <span className="organizer-tag">organisateur</span>
                )}
                {participants[i] === user?.uid && (
                  <span className="me-tag">toi</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* === ACTIONS === */}
      {!isPast && user && (
        <div className="ev-actions">
          {isJoined ? (
            <button
              className="btn btn-secondary"
              onClick={handleLeave}
              disabled={actionLoading}
            >
              <UserMinus size={18} /> Me désinscrire
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleJoin}
              disabled={actionLoading || isFull}
            >
              <UserPlus size={18} /> {isFull ? 'Complet' : 'Je participe'}
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
