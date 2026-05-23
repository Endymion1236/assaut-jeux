// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';

import Header from './components/Header';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Events from './pages/Events';
import Catalog from './pages/Catalog';
import EventDetail from './pages/EventDetail';
import GameDetail from './pages/GameDetail';
import About from './pages/About';
import Members from './pages/Members';
import Matchmaker from './pages/Matchmaker';
import Admin from './pages/Admin';

import './styles/App.css';

// Emails autorisés à accéder à l'admin (comparaison insensible à la casse)
const ADMIN_EMAILS = [
  'nicolasrichard16@hotmail.com',
  'memo12a@yahoo.fr',
  'matthieu.quennet@gmail.com',
  'admin@assaut-des-jeux.fr',
];

const isAdminEmail = (email) =>
  !!email && ADMIN_EMAILS.map(e => e.toLowerCase()).includes(email.toLowerCase());

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  const isAdmin = currentUser && isAdminEmail(currentUser.email);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) setShowLogin(false);
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

  if (!currentUser) {
    if (showLogin) {
      return <Login onBack={() => setShowLogin(false)} />;
    }
    return <Landing onLoginClick={() => setShowLogin(true)} />;
  }

  return (
    <Router>
      <Header user={currentUser} isAdmin={isAdmin} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home user={currentUser} />} />
          <Route path="/profile" element={<Profile user={currentUser} />} />
          <Route path="/events" element={<Events user={currentUser} isAdmin={isAdmin} />} />
          <Route path="/events/:eventId" element={<EventDetail user={currentUser} />} />
          <Route path="/catalog" element={<Catalog user={currentUser} />} />
          <Route path="/games/:gameId" element={<GameDetail user={currentUser} />} />
          <Route path="/membres" element={<Members user={currentUser} />} />
          <Route path="/quel-jeu" element={<Matchmaker user={currentUser} />} />
          <Route path="/a-propos" element={<About />} />
          <Route
            path="/admin"
            element={isAdmin ? <Admin user={currentUser} /> : <Navigate to="/" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
