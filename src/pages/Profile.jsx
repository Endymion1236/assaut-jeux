// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { MECHANICS } from '../data/mechanics';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import '../styles/pages/Profile.css';

export default function Profile({ user }) {
  const [preferences, setPreferences] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [publicProfile, setPublicProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setPreferences(data.preferences || []);
          setBio(data.bio || '');
          setPublicProfile(!!data.publicProfile);
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  const togglePreference = (id) => {
    setPreferences(prev =>
      prev.includes(id)
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const togglePublicProfile = async () => {
    const newValue = !publicProfile;
    setPublicProfile(newValue);
    // Sauvegarde immédiate (pas besoin de cliquer Enregistrer)
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        publicProfile: newValue,
      });
    } catch (err) {
      console.error('Erreur toggle public:', err);
      setPublicProfile(!newValue); // revert
      alert('Impossible de modifier la visibilité');
    }
  };

  const saveChanges = async () => {
    setSaving(true);
    setSaveStatus('');
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        preferences,
        bio,
        publicProfile,
      });
      setSaveStatus('✓ Préférences enregistrées');
      setTimeout(() => setSaveStatus(''), 3000);
      setIsEditing(false);
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      setSaveStatus('✗ Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="profile-loading">Chargement…</div>;
  }

  return (
    <motion.div className="profile-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1>👤 Mon profil</h1>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.displayName?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <h2 style={{ margin: 0 }}>{user.displayName || 'Sans pseudo'}</h2>
            <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: 14 }}>
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* === Bio === */}
      <div className="profile-card">
        <h2>Ma présentation</h2>
        {isEditing ? (
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Présente-toi en quelques mots aux autres membres : tes jeux préférés, ton style, ta dispo…"
            rows={4}
            maxLength={300}
            className="bio-textarea"
          />
        ) : (
          <p className="bio-display">
            {bio || <em>Aucune présentation pour le moment.</em>}
          </p>
        )}
        {isEditing && (
          <small style={{ color: 'var(--text-muted)' }}>{bio.length} / 300 caractères</small>
        )}
      </div>

      {/* === Visibilité === */}
      <div className="profile-card">
        <h2>🔒 Visibilité dans l'annuaire</h2>
        <div className="public-toggle-row">
          <div>
            <p style={{ margin: 0, fontWeight: 600, color: 'var(--navy)' }}>
              Apparaître dans la liste des membres
            </p>
            <p style={{ margin: '6px 0 0', color: 'var(--text-muted)', fontSize: 13 }}>
              Quand c'est activé, les autres membres peuvent te voir dans <code>/membres</code>
              {' '}avec ton pseudo, ta présentation et tes mécaniques préférées.
              Ton email reste toujours privé.
            </p>
          </div>
          <button
            className={`toggle-btn ${publicProfile ? 'on' : 'off'}`}
            onClick={togglePublicProfile}
            aria-label={publicProfile ? 'Désactiver le profil public' : 'Activer le profil public'}
          >
            {publicProfile ? <Eye size={16} /> : <EyeOff size={16} />}
            <span>{publicProfile ? 'Visible' : 'Privé'}</span>
          </button>
        </div>
      </div>

      {/* === Préférences === */}
      <div className="profile-card">
        <h2>🎲 Mes mécaniques préférées</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>
          Coche les types de jeux que tu aimes pour recevoir de meilleures recommandations
          et apparaître dans les filtres de l'annuaire.
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
      </div>

      {/* === Actions === */}
      <div className="profile-actions">
        {!isEditing ? (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
            Modifier ma présentation et mes mécaniques
          </button>
        ) : (
          <>
            <button className="btn btn-primary" onClick={saveChanges} disabled={saving}>
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setIsEditing(false)}
              disabled={saving}
            >
              Annuler
            </button>
          </>
        )}

        {saveStatus && (
          <span className={`save-status ${saveStatus.startsWith('✓') ? 'ok' : 'ko'}`}>
            {saveStatus}
          </span>
        )}
      </div>
    </motion.div>
  );
}
