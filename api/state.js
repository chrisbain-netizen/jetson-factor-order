const { Redis } = require('@upstash/redis');
const { DEFAULT_CONFIG } = require('./_defaults');

const redis = Redis.fromEnv();

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const config = (await redis.get('config')) || DEFAULT_CONFIG;
    const submissions = (await redis.get('submissions')) || {};
    const webhook = process.env.SLACK_WEBHOOK_URL || '';
    res.status(200).json({
      config,
      submissions,
      slackConfigured: Boolean(webhook),
      slackDebug: {
        present: Boolean(webhook),
        length: webhook.length,
        looksLikeSlackUrl: webhook.startsWith('https://hooks.slack.com/')
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not load state', detail: String(err) });
  }
};
