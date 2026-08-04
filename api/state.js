const { kv } = require('@vercel/kv');
const { DEFAULT_CONFIG } = require('./_defaults');

module.exports = async (req, res) => {
  try {
    const config = (await kv.get('config')) || DEFAULT_CONFIG;
    const submissions = (await kv.get('submissions')) || {};
    res.status(200).json({
      config,
      submissions,
      slackConfigured: Boolean(process.env.SLACK_WEBHOOK_URL)
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not load state', detail: String(err) });
  }
};
// diagnostic check Tue Aug  4 13:55:23 EDT 2026
