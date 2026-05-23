// src/services/translate.js
// Service de traduction via notre proxy Vercel /api/translate (DeepL)

const isLocalhost = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
   window.location.hostname === '127.0.0.1');

/**
 * Traduit un texte en français.
 * @param {string} text - Texte à traduire (anglais ou autre)
 * @param {string} [sourceLang] - Langue source (ex: 'EN'). Si omis, DeepL détecte.
 * @returns {Promise<string>} - Texte traduit, ou texte original en cas d'erreur
 */
export async function translateToFrench(text, sourceLang) {
  if (!text || !text.trim()) return text;

  // En localhost : on n'a pas le proxy serverless, on retourne le texte tel quel
  // (DeepL n'autorise pas les appels directs depuis le navigateur sans CORS)
  if (isLocalhost) {
    console.warn('Traduction désactivée en local — utilisez la prod pour tester DeepL');
    return text;
  }

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        sourceLang,
        targetLang: 'FR',
      }),
    });

    if (!response.ok) {
      console.warn(`Traduction échouée : ${response.status}`);
      return text;
    }

    const data = await response.json();
    return data.text || text;
  } catch (err) {
    console.error('Erreur traduction:', err);
    return text;
  }
}
