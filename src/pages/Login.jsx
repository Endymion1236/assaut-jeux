// src/pages/Login.jsx
import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import '../styles/pages/Login.css';

export default function Login({ onBack }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Connexion
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Inscription
        if (!displayName.trim()) {
          throw new Error('Veuillez entrer un pseudo');
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Mettre à jour le profil
        await updateProfile(userCredential.user, {
          displayName: displayName
        });

        // Créer le document utilisateur dans Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          displayName: displayName,
          email: email,
          bio: '',
          preferences: [],
          favorites: [],
          createdAt: new Date(),
          avatar: displayName.charAt(0).toUpperCase()
        });
      }
    } catch (err) {
      setError(translateAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // Traduit les codes d'erreur Firebase en messages lisibles
  const translateAuthError = (err) => {
    const code = err?.code || '';
    const map = {
      'auth/invalid-email': 'Adresse email invalide.',
      'auth/user-disabled': 'Ce compte a été désactivé.',
      'auth/user-not-found': 'Aucun compte ne correspond à cet email.',
      'auth/wrong-password': 'Mot de passe incorrect.',
      'auth/invalid-credential': 'Email ou mot de passe incorrect.',
      'auth/email-already-in-use': 'Un compte existe déjà avec cet email.',
      'auth/weak-password': 'Mot de passe trop faible (6 caractères minimum).',
      'auth/network-request-failed': 'Problème de connexion réseau.',
      'auth/too-many-requests': 'Trop de tentatives, réessayez plus tard.',
    };
    return map[code] || err?.message || 'Une erreur est survenue.';
  };

  return (
    <motion.div className="login-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="login-card" initial={{ y: 20 }} animate={{ y: 0 }}>
        {onBack && (
          <button type="button" className="link-btn back-btn" onClick={onBack}>
            ← Retour
          </button>
        )}
        <img src="/logo-mark-128.png" alt="ALADJ" className="login-logo" />
        <h1 className="login-title">À l'assaut des jeux</h1>
        <p className="login-subtitle">L'asso des joueurs du Coutançais</p>

        {error && (
          <motion.div className="error-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            ⚠️ {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Pseudo</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ton pseudo de joueur"
                disabled={loading}
                required
                minLength={2}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              disabled={loading}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              required
              minLength={6}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="submit-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Chargement...' : isLogin ? 'Se connecter' : 'S\'inscrire'}
          </motion.button>
        </form>

        <div className="toggle-auth">
          {isLogin ? (
            <>
              Pas encore de compte ?{' '}
              <button onClick={() => { setIsLogin(false); setError(''); }} className="link-btn">
                S'inscrire
              </button>
            </>
          ) : (
            <>
              Déjà inscrit ?{' '}
              <button onClick={() => { setIsLogin(true); setError(''); }} className="link-btn">
                Se connecter
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
