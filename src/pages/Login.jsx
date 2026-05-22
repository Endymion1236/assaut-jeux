// src/pages/Login.jsx
import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import '../styles/pages/Login.css';

export default function Login({ onBack }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // === Email/password ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (!displayName.trim()) {
          throw new Error('Veuillez entrer un pseudo');
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });

        await setDoc(doc(db, 'users', userCredential.user.uid), {
          displayName,
          email,
          bio: '',
          preferences: [],
          favorites: [],
          createdAt: new Date(),
          avatar: displayName.charAt(0).toUpperCase(),
          provider: 'email',
        });
      }
    } catch (err) {
      setError(translateAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // === Google sign-in ===
  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      // Force la sélection du compte (utile si plusieurs comptes Google connectés)
      provider.setCustomParameters({ prompt: 'select_account' });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Premier login Google ? Créer le document Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          displayName: user.displayName || user.email.split('@')[0],
          email: user.email,
          bio: '',
          preferences: [],
          favorites: [],
          createdAt: new Date(),
          avatar: (user.displayName || user.email).charAt(0).toUpperCase(),
          photoURL: user.photoURL || null,
          provider: 'google',
        });
      }
    } catch (err) {
      // Gestion des erreurs courantes Google
      if (err.code === 'auth/popup-closed-by-user') {
        // L'utilisateur a fermé la popup, pas d'erreur à afficher
      } else if (err.code === 'auth/popup-blocked') {
        setError('La fenêtre de connexion a été bloquée. Autorise les popups pour ce site.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        // Ignore, c'est juste un second clic
      } else {
        setError(translateAuthError(err));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

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
      'auth/account-exists-with-different-credential':
        'Un compte existe déjà avec cet email mais via un autre mode de connexion.',
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

        {/* === BOUTON GOOGLE === */}
        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {googleLoading ? 'Connexion…' : 'Continuer avec Google'}
        </button>

        <div className="divider"><span>ou</span></div>

        {/* === FORM EMAIL/PASSWORD === */}
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
            disabled={loading || googleLoading}
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
