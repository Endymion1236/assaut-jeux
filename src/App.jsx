// src/App.jsx - MIS À JOUR avec Admin
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';

import Header from './components/Header';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Events from './pages/Events';
import Catalog from './pages/Catalog';
import EventDetail from './pages/EventDetail';
import Admin from './pages/Admin';

import './styles/App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Liste des admins (à adapter selon ton besoin)
  const ADMIN_EMAILS = [
    'admin@assaut-des-jeux.fr',
    'nicolas@centre-equestre.fr' // Remplace avec ton email
  ];

  const isAdmin = currentUser && ADMIN_EMAILS.includes(currentUser.email);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <Router>
      {currentUser ? (
        <>
          <Header user={currentUser} isAdmin={isAdmin} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home user={currentUser} />} />
              <Route path="/profile" element={<Profile user={currentUser} />} />
              <Route path="/events" element={<Events user={currentUser} />} />
              <Route path="/events/:eventId" element={<EventDetail user={currentUser} />} />
              <Route path="/catalog" element={<Catalog user={currentUser} />} />
              
              {/* Route Admin protégée */}
              <Route
                path="/admin"
                element={isAdmin ? <Admin user={currentUser} /> : <Navigate to="/" replace />}
              />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </>
      ) : (
        <Login />
      )}
    </Router>
  );
}

export default App;
