// src/App.jsx
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

import './styles/App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
          <Header user={currentUser} />
          <Routes>
            <Route path="/" element={<Home user={currentUser} />} />
            <Route path="/profile" element={<Profile user={currentUser} />} />
            <Route path="/events" element={<Events user={currentUser} />} />
            <Route path="/events/:eventId" element={<EventDetail user={currentUser} />} />
            <Route path="/catalog" element={<Catalog user={currentUser} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </>
      ) : (
        <Login />
      )}
    </Router>
  );
}

export default App;
