// src/components/Header.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Menu, X } from 'lucide-react';
import '../styles/components/Header.css';

export default function Header({ user }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          🎲 À l'assaut des jeux
        </Link>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            🏠 Accueil
          </Link>
          <Link to="/catalog" className={`nav-link ${isActive('/catalog')}`}>
            📚 Catalogue
          </Link>
          <Link to="/events" className={`nav-link ${isActive('/events')}`}>
            📅 Soirées
          </Link>
          <Link to="/profile" className={`nav-link ${isActive('/profile')}`}>
            👤 Profil
          </Link>
        </nav>

        <div className="header-right">
          <div className="user-info">
            <span className="user-avatar">{user?.displayName?.charAt(0).toUpperCase()}</span>
            <span className="user-name">{user?.displayName}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}
