const { kv } = require('@vercel/kv');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    await kv.set('submissions', {});
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Could not reset week', detail: String(err) });
  }
};
