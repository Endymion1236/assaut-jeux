// api/bgg.js — Proxy BGG avec authentification

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { path, debug, ...params } = req.query;

    const allowedPaths = ['search', 'thing'];
    if (!path || !allowedPaths.includes(path)) {
      return res.status(400).json({ error: 'Invalid path' });
    }

    const queryString = new URLSearchParams(params).toString();
    const bggUrl = `https://boardgamegeek.com/xmlapi2/${path}?${queryString}`;

    const rawToken = process.env.BGG_APPLICATION_TOKEN;
    if (!rawToken) {
      return res.status(500).json({
        error: 'BGG_APPLICATION_TOKEN absent',
        availableEnvVars: Object.keys(process.env).filter(k => k.startsWith('BGG')),
      });
    }

    const token = rawToken.trim().replace(/^Bearer\s+/i, '');

    if (debug === '1') {
      return res.status(200).json({
        tokenPresent: !!token,
        tokenLength: token.length,
        tokenHasWhitespace: /\s/.test(token),
        targetUrl: bggUrl,
        nodeVersion: process.version,
      });
    }

    const bggResponse = await fetch(bggUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'ALADJ/1.0',
        'Accept': '*/*',
      },
    });

    if (bggResponse.status === 401) {
      const body = await bggResponse.text();
      return res.status(401).json({
        error: 'BGG returned 401',
        bggResponseSnippet: body.substring(0, 500),
        tokenWasPresent: true,
        tokenLength: token.length,
      });
    }

    if (!bggResponse.ok) {
      return res.status(bggResponse.status).json({
        error: `BGG returned ${bggResponse.status}`,
      });
    }

    const xmlText = await bggResponse.text();
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res.status(200).send(xmlText);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
}
