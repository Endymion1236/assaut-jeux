// api/translate.js
// Proxy DeepL pour traduire les descriptions BGG en français

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, use POST' });
  }

  try {
    const { text, sourceLang, targetLang } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid text' });
    }

    if (text.length > 5000) {
      return res.status(400).json({ error: 'Text too long (max 5000 chars per call)' });
    }

    const apiKey = process.env.DEEPL_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'DEEPL_API_KEY not configured' });
    }

    // DeepL : l'endpoint dépend du type de compte
    // - Free :    https://api-free.deepl.com/v2/translate
    // - Pro :     https://api.deepl.com/v2/translate
    // Les clés Free se terminent par ":fx", on détecte ça automatiquement
    const isFreeAccount = apiKey.endsWith(':fx');
    const endpoint = isFreeAccount
      ? 'https://api-free.deepl.com/v2/translate'
      : 'https://api.deepl.com/v2/translate';

    const params = new URLSearchParams();
    params.append('text', text);
    params.append('target_lang', (targetLang || 'FR').toUpperCase());
    if (sourceLang) {
      params.append('source_lang', sourceLang.toUpperCase());
    }
    // Préserve la mise en forme (sauts de ligne, etc.)
    params.append('preserve_formatting', '1');
    // Ton naturel "moins formel" pour des descriptions de jeux
    params.append('formality', 'prefer_less');

    const deeplResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'ALADJ/1.0',
      },
      body: params.toString(),
    });

    if (!deeplResponse.ok) {
      const errBody = await deeplResponse.text();
      return res.status(deeplResponse.status).json({
        error: `DeepL returned ${deeplResponse.status}`,
        detail: errBody.substring(0, 300),
      });
    }

    const data = await deeplResponse.json();
    const translation = data?.translations?.[0]?.text || '';

    return res.status(200).json({
      text: translation,
      detectedSourceLanguage: data?.translations?.[0]?.detected_source_language,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
}
