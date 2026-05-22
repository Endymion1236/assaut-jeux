// src/pages/Admin.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { searchBoardGame, getBoardGameDetails, convertMechanicsToTypes, formatPlayingTime } from '../services/boardGameGeekAPI';
import { MECHANICS, getMechanicLabel, getMechanicEmoji } from '../data/mechanics';
import { motion } from 'framer-motion';
import { Trash2, Edit2, Plus } from 'lucide-react';
import '../styles/pages/Admin.css';

export default function Admin({ user }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    emoji: '🎲',
    minPlayers: 2,
    maxPlayers: 4,
    duration: '30 min',
    description: '',
    types: [],
    bggId: '',
    image: '',
    thumbnail: ''
  });

  const toggleMechanic = (id) => {
    setFormData(prev => ({
      ...prev,
      types: prev.types.includes(id)
        ? prev.types.filter(t => t !== id)
        : [...prev.types, id]
    }));
  };

  // Charge les jeux
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'games'));
        const gamesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setGames(gamesList);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Recherche sur BGG
  const handleBGGSearch = async (gameName) => {
    if (!gameName.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await searchBoardGame(gameName);
      setSearchResults(results);
    } catch (error) {
      console.error('Erreur recherche:', error);
    } finally {
      setSearching(false);
    }
  };

  // Récupère les infos d'un jeu BGG
  const handleSelectBGGGame = async (bggGame) => {
    setSearching(true);
    try {
      const details = await getBoardGameDetails(bggGame.id);
      const types = convertMechanicsToTypes(details.mechanics, details.categories);
      
      setFormData(prev => ({
        ...prev,
        name: details.name,
        minPlayers: details.minPlayers,
        maxPlayers: details.maxPlayers,
        duration: formatPlayingTime(details.playingTime),
        description: details.description,
        types: types,
        bggId: bggGame.id,
        image: details.image || '',
        thumbnail: details.thumbnail || '',
      }));

      setSearchResults([]);
    } catch (error) {
      console.error('Erreur fetch détails:', error);
      alert('Erreur lors de la récupération des détails');
    } finally {
      setSearching(false);
    }
  };

  // Gère les changements de form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'minPlayers' || name === 'maxPlayers' ? parseInt(value) : value
    }));
  };

  // Sauvegarde le jeu
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        // Mise à jour
        await updateDoc(doc(db, 'games', editingId), formData);
        setGames(games.map(g => g.id === editingId ? { id: editingId, ...formData } : g));
        alert('Jeu mis à jour ! ✅');
      } else {
        // Création
        const docRef = await addDoc(collection(db, 'games'), {
          ...formData,
          createdAt: new Date()
        });
        setGames([...games, { id: docRef.id, ...formData }]);
        alert('Jeu ajouté ! ✅');
      }

      resetForm();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  // Édite un jeu
  const handleEdit = (game) => {
    setFormData({
      name: game.name,
      emoji: game.emoji,
      minPlayers: game.minPlayers,
      maxPlayers: game.maxPlayers,
      duration: game.duration,
      description: game.description,
      types: game.types || [],
      bggId: game.bggId || '',
      image: game.image || '',
      thumbnail: game.thumbnail || '',
    });
    setEditingId(game.id);
    setShowForm(true);
  };

  // Supprime un jeu
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce jeu ?')) {
      try {
        await deleteDoc(doc(db, 'games', id));
        setGames(games.filter(g => g.id !== id));
        alert('Jeu supprimé ! ✅');
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      emoji: '🎲',
      minPlayers: 2,
      maxPlayers: 4,
      duration: '30 min',
      description: '',
      types: [],
      bggId: '',
    image: '',
    thumbnail: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <motion.div className="admin-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="admin-header">
        <h1>⚙️ Gestion du Catalogue</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
        >
          {showForm ? '✕ Fermer' : <><Plus size={18} /> Ajouter un jeu</>}
        </button>
      </div>

      {showForm && (
        <motion.div
          className="admin-form-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2>{editingId ? 'Éditer le jeu' : 'Ajouter un nouveau jeu'}</h2>

          {/* SECTION RECHERCHE BGG */}
          <div className="bgg-section">
            <h3>🔍 Chercher sur BoardGameGeek</h3>
            <div className="bgg-search">
              <input
                type="text"
                placeholder="Tapez le nom du jeu..."
                onChange={(e) => handleBGGSearch(e.target.value)}
                className="bgg-input"
              />
              {searching && <div className="spinner-small"></div>}
            </div>

            {searchResults.length > 0 && (
              <div className="bgg-results">
                {searchResults.map(game => (
                  <motion.button
                    key={game.id}
                    className="bgg-result-item"
                    onClick={() => handleSelectBGGGame(game)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div>
                      <strong>{game.name}</strong>
                      {game.yearPublished && (
                        <p className="year">({game.yearPublished})</p>
                      )}
                    </div>
                    <span className="use-btn">Utiliser</span>
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          <hr />

          {/* FORMULAIRE MANUEL */}
          <form onSubmit={handleSubmit} className="admin-form">
            {(formData.image || formData.thumbnail) && (
              <div className="image-preview">
                <img
                  src={formData.thumbnail || formData.image}
                  alt={formData.name || 'Aperçu'}
                />
                <div>
                  <small>Image récupérée de BGG</small>
                  <button
                    type="button"
                    className="btn-small btn-link"
                    onClick={() => setFormData(prev => ({ ...prev, image: '', thumbnail: '' }))}
                  >
                    Retirer l'image
                  </button>
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>Nom du jeu *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Catan"
                  required
                />
              </div>

              <div className="form-group">
                <label>Emoji (fallback si pas d'image)</label>
                <input
                  type="text"
                  name="emoji"
                  value={formData.emoji}
                  onChange={handleChange}
                  maxLength={2}
                  placeholder="🎲"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Min joueurs</label>
                <input
                  type="number"
                  name="minPlayers"
                  value={formData.minPlayers}
                  onChange={handleChange}
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>Max joueurs</label>
                <input
                  type="number"
                  name="maxPlayers"
                  value={formData.maxPlayers}
                  onChange={handleChange}
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>Durée</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Ex: 45-60 min"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez le jeu..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Mécaniques de jeu</label>
              <p className="form-hint">Coche les mécaniques principales du jeu (idéalement 1 à 4) :</p>
              <div className="mechanics-grid">
                {MECHANICS.map(m => {
                  const checked = formData.types.includes(m.id);
                  return (
                    <label
                      key={m.id}
                      className={`mechanic-chip ${checked ? 'checked' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleMechanic(m.id)}
                      />
                      <span className="mechanic-emoji">{m.emoji}</span>
                      <span className="mechanic-label">{m.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Sauvegarde...' : editingId ? 'Mettre à jour' : 'Ajouter le jeu'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Annuler
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* LISTE DES JEUX */}
      <div className="admin-games-list">
        <h2>Jeux actuels ({games.length})</h2>

        {loading && !showForm ? (
          <div className="loading">Chargement...</div>
        ) : games.length === 0 ? (
          <div className="empty-state">
            <p>Aucun jeu pour le moment</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              Ajouter le premier jeu
            </button>
          </div>
        ) : (
          <motion.div
            className="games-table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {games.map(game => (
              <motion.div
                key={game.id}
                className="game-row"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="game-info">
                  <h3>
                    {game.emoji} {game.name}
                  </h3>
                  <p>{game.description}</p>
                  <div className="game-meta">
                    <span>👥 {game.minPlayers}-{game.maxPlayers}</span>
                    <span>⏱️ {game.duration}</span>
                    <div className="types-inline">
                      {game.types?.map(type => (
                        <span key={type} className="type-mini">
                          {getMechanicEmoji(type)} {getMechanicLabel(type)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="game-actions">
                  <motion.button
                    className="btn-icon edit"
                    onClick={() => handleEdit(game)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title="Éditer"
                  >
                    <Edit2 size={18} />
                  </motion.button>
                  <motion.button
                    className="btn-icon delete"
                    onClick={() => handleDelete(game.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
