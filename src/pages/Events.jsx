// src/pages/Events.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Trash2, UserPlus, UserMinus } from 'lucide-react';
import '../styles/pages/Events.css';

export default function Events({ user, isAdmin = false }) {
  const [events, setEvents] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    maxPlayers: 6,
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // === Écoute temps réel des soirées ===
  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('date', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setEvents(list);
        setLoadingList(false);
      },
      (err) => {
        console.error('Erreur lecture events:', err);
        setLoadingList(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Sépare à venir / passées
  const { upcoming, past } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = [];
    const past = [];
    events.forEach(ev => {
      const evDate = ev.date ? new Date(ev.date) : null;
      if (evDate && evDate >= today) upcoming.push(ev);
      else past.push(ev);
    });
    past.reverse(); // plus récentes en premier
    return { upcoming, past };
  }, [events]);

  // === Form handling ===
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ name: '', date: '', time: '', location: '', maxPlayers: 6, description: '' });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'events'), {
        name: formData.name.trim(),
        date: formData.date,
        time: formData.time,
        location: formData.location.trim(),
        description: formData.description.trim(),
        maxPlayers: parseInt(formData.maxPlayers, 10) || 6,
        organizerId: user.uid,
        organizerName: user.displayName || user.email,
        participants: [user.uid],
        participantNames: [user.displayName || user.email],
        createdAt: serverTimestamp(),
      });
      resetForm();
    } catch (error) {
      console.error('Erreur création:', error);
      alert("Erreur lors de la création de la soirée.");
    } finally {
      setSubmitting(false);
    }
  };

  // === Actions ===
  const joinEvent = async (ev) => {
    if (!user) return;
    setActionLoading(ev.id);
    try {
      await updateDoc(doc(db, 'events', ev.id), {
        participants: arrayUnion(user.uid),
        participantNames: arrayUnion(user.displayName || user.email),
      });
    } catch (err) {
      console.error(err);
      alert("Impossible de s'inscrire.");
    } finally {
      setActionLoading(null);
    }
  };

  const leaveEvent = async (ev) => {
    if (!user) return;
    setActionLoading(ev.id);
    try {
      await updateDoc(doc(db, 'events', ev.id), {
        participants: arrayRemove(user.uid),
        participantNames: arrayRemove(user.displayName || user.email),
      });
    } catch (err) {
      console.error(err);
      alert("Impossible de se désinscrire.");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteEvent = async (ev) => {
    if (!window.confirm(`Supprimer la soirée "${ev.name}" ?`)) return;
    setActionLoading(ev.id);
    try {
      await deleteDoc(doc(db, 'events', ev.id));
    } catch (err) {
      console.error(err);
      alert("Suppression impossible.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <motion.div className="events-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="events-header">
        <h1>📅 Soirées Jeux</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Annuler' : '+ Créer une soirée'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            className="event-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nom de la soirée</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Soirée stratégie"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Heure</label>
                  <input type="time" name="time" value={formData.time} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Lieu</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Ex: Chez Nicolas à Agon-Coutainville"
                  required
                />
              </div>

              <div className="form-group">
                <label>Nombre de joueurs max</label>
                <input
                  type="number"
                  name="maxPlayers"
                  value={formData.maxPlayers}
                  onChange={handleChange}
                  min="2"
                  max="20"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description (optionnel)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Décrivez votre soirée, les jeux prévus, ce qu'il faut apporter..."
                  rows={4}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Création…' : 'Créer la soirée'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === LISTE === */}
      {loadingList ? (
        <div className="events-empty">Chargement des soirées…</div>
      ) : events.length === 0 ? (
        <div className="events-empty">
          <p>Aucune soirée pour le moment.</p>
          <p style={{ fontSize: 14, marginTop: 8 }}>
            Sois le/la premier·e à en proposer une !
          </p>
        </div>
      ) : (
        <>
          <section className="events-section">
            <h2>🎲 À venir ({upcoming.length})</h2>
            {upcoming.length === 0 ? (
              <p className="muted">Pas de soirée prévue. Et si tu en organisais une ?</p>
            ) : (
              <div className="events-grid">
                {upcoming.map(ev => (
                  <EventCard
                    key={ev.id}
                    event={ev}
                    user={user}
                    isAdmin={isAdmin}
                    loading={actionLoading === ev.id}
                    onJoin={() => joinEvent(ev)}
                    onLeave={() => leaveEvent(ev)}
                    onDelete={() => deleteEvent(ev)}
                  />
                ))}
              </div>
            )}
          </section>

          {past.length > 0 && (
            <section className="events-section events-past">
              <h2>📜 Soirées passées ({past.length})</h2>
              <div className="events-grid">
                {past.slice(0, 6).map(ev => (
                  <EventCard
                    key={ev.id}
                    event={ev}
                    user={user}
                    isAdmin={isAdmin}
                    loading={actionLoading === ev.id}
                    onJoin={() => joinEvent(ev)}
                    onLeave={() => leaveEvent(ev)}
                    onDelete={() => deleteEvent(ev)}
                    isPast
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </motion.div>
  );
}

// === EventCard ===
function EventCard({ event, user, isAdmin, loading, onJoin, onLeave, onDelete, isPast }) {
  const participants = event.participants || [];
  const participantNames = event.participantNames || [];
  const isJoined = user && participants.includes(user.uid);
  const isOrganizer = user && event.organizerId === user.uid;
  const canDelete = isOrganizer || isAdmin;
  const full = participants.length >= (event.maxPlayers || 99);

  const prettyDate = event.date
    ? new Date(event.date).toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      })
    : '';

  return (
    <motion.div
      className={`event-card ${isPast ? 'past' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="event-card-header">
        <Link to={`/events/${event.id}`} className="event-title-link">
          <h3>{event.name}</h3>
        </Link>
        {canDelete && (
          <button
            className="event-delete"
            onClick={onDelete}
            disabled={loading}
            title="Supprimer"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="event-meta">
        <div className="event-meta-row">
          <Calendar size={16} />
          <span>{prettyDate}</span>
        </div>
        <div className="event-meta-row">
          <Clock size={16} />
          <span>{event.time}</span>
        </div>
        <div className="event-meta-row">
          <MapPin size={16} />
          <span>{event.location}</span>
        </div>
        <div className="event-meta-row">
          <Users size={16} />
          <span>{participants.length} / {event.maxPlayers} joueur·euse·s</span>
        </div>
      </div>

      {event.description && (
        <p className="event-description">{event.description}</p>
      )}

      <div className="event-organizer">
        Organisé par <strong>{event.organizerName}</strong>
      </div>

      {participantNames.length > 0 && (
        <div className="event-participants">
          <strong>Participants :</strong> {participantNames.join(', ')}
        </div>
      )}

      {event.gameName && (
        <div className="event-fixed-game-mini">
          🎲 Jeu prévu : <strong>{event.gameName}</strong>
        </div>
      )}

      <Link to={`/events/${event.id}`} className="event-detail-link">
        Voir les détails →
      </Link>

      {!isPast && user && (
        <div className="event-actions">
          {isJoined ? (
            <button
              className="btn btn-secondary"
              onClick={onLeave}
              disabled={loading}
            >
              <UserMinus size={16} /> Me désinscrire
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={onJoin}
              disabled={loading || full}
            >
              <UserPlus size={16} /> {full ? 'Complet' : 'Je participe'}
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
