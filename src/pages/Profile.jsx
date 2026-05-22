// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { MECHANICS } from '../data/mechanics';
import { motion } from 'framer-motion';
import '../styles/pages/Profile.css';

export default function Profile({ user }) {
  const [preferences, setPreferences] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setPreferences(userDoc.data().preferences || []);
          setBio(userDoc.data().bio || '');
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const togglePreference = (type) => {
    setPreferences(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const saveChanges = async () => {
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        bio,
        preferences
      });
      setIsEditing(false);
      alert('Profil mis à jour ! ✅');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <motion.div className="profile-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="profile-header">
        <div className="avatar">{user.displayName?.charAt(0).toUpperCase()}</div>
        <div className="user-info">
          <h1>{user.displayName}</h1>
          <p>{user.email}</p>
        </div>
      </div>

      <div className="profile-card">
        <h2>À propos</h2>
        {isEditing ? (
          <>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Parlez-nous un peu de vous..."
              rows={4}
            />
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
              <button className="btn btn-primary" onClick={saveChanges}>
                Enregistrer
              </button>
              <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                Annuler
              </button>
            </div>
          </>
        ) : (
          <>
            <p>{bio || 'Pas de bio pour le moment'}</p>
            <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
              Modifier
            </button>
          </>
        )}
      </div>

      <div className="profile-card">
        <h2>Mes mécaniques préférées</h2>
        <p style={{ color: '#777', fontSize: '14px', marginBottom: '15px' }}>
          Coche les types de jeux que tu aimes pour recevoir de meilleures recommandations.
        </p>
        <div className="preferences-grid">
          {MECHANICS.map(m => (
            <button
              key={m.id}
              className={`pref-tag ${preferences.includes(m.id) ? 'active' : ''}`}
              onClick={() => togglePreference(m.id)}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
        <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={saveChanges}>
          Enregistrer mes préférences
        </button>
      </div>
    </motion.div>
  );
}
