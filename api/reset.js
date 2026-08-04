const { Redis } = require('@upstash/redis');

const redis = Redis.fromEnv();

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    await redis.set('submissions', {});
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Could not reset week', detail: String(err) });
  }
};
