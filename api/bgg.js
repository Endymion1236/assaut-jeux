// api/bgg.js
// Proxy serverless Vercel vers l'API BoardGameGeek
// Contourne le blocage CORS de BGG en faisant l'appel côté serveur
//
// Usage côté client :
//   /api/bgg?path=search&query=catan
//   /api/bgg?path=thing&id=13&stats=1

export default async function handler(req, res) {
  // CORS : on autorise notre propre app
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { path, ...params } = req.query;

    // Whitelist des endpoints BGG autorisés
    const allowedPaths = ['search', 'thing'];
    if (!path || !allowedPaths.includes(path)) {
      return res.status(400).json({ error: 'Invalid path. Use "search" or "thing".' });
    }

    // Construit l'URL BGG
    const queryString = new URLSearchParams(params).toString();
    const bggUrl = `https://boardgamegeek.com/xmlapi2/${path}?${queryString}`;

    // Récupère le XML depuis BGG
    const bggResponse = await fetch(bggUrl, {
      headers: {
        'User-Agent': 'ALADJ-AssautDesJeux/1.0 (assaut-jeux.vercel.app)',
        'Accept': 'application/xml',
      },
    });

    if (!bggResponse.ok) {
      return res.status(bggResponse.status).json({
        error: `BGG returned ${bggResponse.status}`,
      });
    }

    const xmlText = await bggResponse.text();

    // Renvoie le XML brut tel que le client l'attend
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res.status(200).send(xmlText);
  } catch (err) {
    console.error('BGG proxy error:', err);
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
}
