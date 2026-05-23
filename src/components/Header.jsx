// src/components/Header.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Menu, X, Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import '../styles/components/Header.css';

export default function Header({ user, isAdmin = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { canInstall, promptInstall } = usePWAInstall();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          <img src="/logo-mark-80.png" alt="ALADJ" className="logo-img" />
          <span className="logo-text">À l'assaut des jeux</span>
        </Link>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/')}`} onClick={closeMobileMenu}>
            🏠 Accueil
          </Link>
          <Link to="/catalog" className={`nav-link ${isActive('/catalog')}`} onClick={closeMobileMenu}>
            📚 Catalogue
          </Link>
          <Link to="/quel-jeu" className={`nav-link ${isActive('/quel-jeu')}`} onClick={closeMobileMenu}>
            ✨ Quel jeu ?
          </Link>
          <Link to="/events" className={`nav-link ${isActive('/events')}`} onClick={closeMobileMenu}>
            📅 Soirées
          </Link>
          <Link to="/membres" className={`nav-link ${isActive('/membres')}`} onClick={closeMobileMenu}>
            👥 Membres
          </Link>
          <Link to="/profile" className={`nav-link ${isActive('/profile')}`} onClick={closeMobileMenu}>
            👤 Profil
          </Link>

          {isAdmin && (
            <Link to="/admin" className={`nav-link admin-link ${isActive('/admin')}`} onClick={closeMobileMenu}>
              ⚙️ Admin
            </Link>
          )}
        </nav>

        <div className="header-right">
          {canInstall && (
            <button
              onClick={promptInstall}
              className="install-btn"
              title="Installer l'app sur ton appareil"
            >
              <Download size={14} /> Installer
            </button>
          )}
          <div className="user-info">
            <span className="user-avatar">{user?.displayName?.charAt(0).toUpperCase()}</span>
            <span className="user-name">{user?.displayName}</span>
            {isAdmin && <span className="admin-badge">Admin</span>}
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}
