// src/pages/Members.jsx
// Annuaire des membres (uniquement ceux qui ont opt-in)
import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { motion } from 'framer-motion';
import { Search, Users } from 'lucide-react';
import { MECHANICS, getMechanicLabel, getMechanicEmoji } from '../data/mechanics';
import '../styles/pages/Members.css';

export default function Members({ user }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMechanic, setSelectedMechanic] = useState(null);

  // === Écoute temps réel des membres opt-in ===
  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      where('publicProfile', '==', true)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setMembers(list);
        setLoading(false);
      },
      (err) => {
        console.error('Erreur fetch membres:', err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // === Filtrage ===
  const filtered = useMemo(() => {
    let list = members;

    // Filtre par mécanique
    if (selectedMechanic) {
      list = list.filter(m =>
        (m.preferences || []).includes(selectedMechanic)
      );
    }

    // Filtre par recherche (pseudo + bio)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(m =>
        (m.displayName || '').toLowerCase().includes(q) ||
        (m.bio || '').toLowerCase().includes(q)
      );
    }

    // Tri alphabétique
    return [...list].sort((a, b) =>
      (a.displayName || '').localeCompare(b.displayName || '', 'fr')
    );
  }, [members, searchQuery, selectedMechanic]);

  return (
    <motion.div className="members-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="members-header">
        <h1><Users size={28} /> Membres de l'asso</h1>
        <p>
          Les membres qui ont choisi d'apparaître dans l'annuaire.
          Tu peux activer/désactiver ta visibilité depuis ton{' '}
          <a href="/profile" style={{ color: 'var(--teal)' }}>profil</a>.
        </p>
      </header>

      <div className="members-filters">
        <div className="search-wrapper">
          <Search size={18} />
          <input
            type="text"
            placeholder="Rechercher par pseudo…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="member-search"
          />
        </div>

        <div className="mechanic-filters">
          <button
            className={`mechanic-chip-filter ${!selectedMechanic ? 'active' : ''}`}
            onClick={() => setSelectedMechanic(null)}
          >
            Tous
          </button>
          {MECHANICS.map(m => (
            <button
              key={m.id}
              className={`mechanic-chip-filter ${selectedMechanic === m.id ? 'active' : ''}`}
              onClick={() => setSelectedMechanic(selectedMechanic === m.id ? null : m.id)}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="members-empty">Chargement des membres…</div>
      ) : filtered.length === 0 ? (
        <div className="members-empty">
          {members.length === 0 ? (
            <>
              <p><strong>Pas encore de membre dans l'annuaire.</strong></p>
              <p>Sois le/la premier·e à activer ton profil public dans tes paramètres !</p>
            </>
          ) : (
            <p>Aucun membre ne correspond à ce filtre.</p>
          )}
        </div>
      ) : (
        <>
          <p className="members-count">
            {filtered.length} membre{filtered.length > 1 ? 's' : ''}
            {selectedMechanic && (
              <> qui aime{filtered.length > 1 ? 'nt' : ''} {getMechanicLabel(selectedMechanic)}</>
            )}
          </p>
          <div className="members-grid">
            {filtered.map(m => (
              <MemberCard key={m.id} member={m} isCurrentUser={user?.uid === m.id} />
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}

// === MemberCard ===
function MemberCard({ member, isCurrentUser }) {
  const initial = (member.displayName || '?').charAt(0).toUpperCase();
  const prefs = member.preferences || [];

  return (
    <motion.div
      className={`member-card ${isCurrentUser ? 'is-me' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
    >
      <div className="member-avatar-block">
        {member.photoURL ? (
          <img src={member.photoURL} alt={member.displayName} className="member-avatar-img" />
        ) : (
          <div className="member-avatar-letter">{initial}</div>
        )}
        {isCurrentUser && <span className="me-badge">Toi</span>}
      </div>

      <div className="member-body">
        <h3 className="member-name">{member.displayName || 'Membre anonyme'}</h3>

        {member.bio && (
          <p className="member-bio">{member.bio}</p>
        )}

        {prefs.length > 0 && (
          <div className="member-prefs">
            <small>Aime jouer à :</small>
            <div className="prefs-tags">
              {prefs.slice(0, 4).map(p => (
                <span key={p} className="pref-tag-mini">
                  {getMechanicEmoji(p)} {getMechanicLabel(p)}
                </span>
              ))}
              {prefs.length > 4 && <span className="pref-tag-mini">+{prefs.length - 4}</span>}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
