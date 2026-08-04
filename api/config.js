const { Redis } = require('@upstash/redis');

const redis = Redis.fromEnv();

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const config = req.body;
    if (!config || !Array.isArray(config.teamNames) || !Array.isArray(config.meals)) {
      return res.status(400).json({ error: 'Invalid config payload' });
    }
    await redis.set('config', config);
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Could not save config', detail: String(err) });
  }
};
