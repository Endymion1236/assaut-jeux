// src/pages/Events.jsx
import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { motion } from 'framer-motion';
import '../styles/pages/Events.css';

export default function Events({ user }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    maxPlayers: 4,
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'events'), {
        ...formData,
        organizerId: user.uid,
        organizerName: user.displayName,
        participants: [user.uid],
        createdAt: serverTimestamp(),
        maxPlayers: parseInt(formData.maxPlayers)
      });

      alert('Soirée créée ! 🎉');
      setFormData({ name: '', date: '', time: '', location: '', maxPlayers: 4, description: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="events-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1>📅 Soirées Jeux</h1>

      <button
        className="btn btn-primary"
        onClick={() => setShowForm(!showForm)}
        style={{ marginBottom: '30px' }}
      >
        {showForm ? '✕ Annuler' : '+ Créer une soirée'}
      </button>

      {showForm && (
        <motion.div className="event-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Heure</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Lieu</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ex: Salle du club"
                required
              />
            </div>

            <div className="form-group">
              <label>Nombre de joueurs attendus</label>
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
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez votre soirée..."
                rows={4}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Création...' : 'Créer la soirée'}
            </button>
          </form>
        </motion.div>
      )}

      <div style={{ marginTop: '40px', textAlign: 'center', color: '#888', padding: '40px' }}>
        <p>Les soirées s'afficheront ici...</p>
      </div>
    </motion.div>
  );
}

// src/pages/EventDetail.jsx
export function EventDetail() {
  return <div>Détail de l'événement</div>;
}
