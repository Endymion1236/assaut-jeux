// src/hooks/useGames.js

import { useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Hook pour charger les jeux depuis Firestore
 * Écoute les changements en temps réel
 */
export function useGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Écoute les changements en temps réel
    const unsubscribe = onSnapshot(
      collection(db, 'games'),
      (snapshot) => {
        try {
          const gamesList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setGames(gamesList);
          setLoading(false);
        } catch (err) {
          setError(err);
          setLoading(false);
        }
      },
      (err) => {
        console.error('Erreur listener Firestore:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { games, loading, error };
}

/**
 * Charge les jeux une seule fois (sans écoute temps réel)
 */
export async function loadGamesOnce() {
  try {
    const querySnapshot = await getDocs(collection(db, 'games'));
    const gamesList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return gamesList;
  } catch (error) {
    console.error('Erreur chargement jeux:', error);
    return [];
  }
}
