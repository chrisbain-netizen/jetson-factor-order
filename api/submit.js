const { Redis } = require('@upstash/redis');
const { DEFAULT_CONFIG } = require('./_defaults');

const redis = Redis.fromEnv();

async function postToSlack(webhook, text) {
  try {
    const r = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    return r.ok;
  } catch (e) {
    return false;
  }
}

function groupedLines(meals, config) {
  const mealLines = [];
  const drinkLines = [];
  Object.entries(meals).forEach(([id, qty]) => {
    const m = config.meals.find((x) => x.id === id);
    const line = `\u2022 ${qty}x ${m ? m.name : id}`;
    if (m && m.type === 'drink') drinkLines.push(line);
    else mealLines.push(line);
  });
  let out = mealLines.join('\n');
  if (drinkLines.length) out += `\n\n*Smoothies/drinks:*\n` + drinkLines.join('\n');
  return out;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { name, meals } = req.body || {};
    if (!name || !meals || typeof meals !== 'object') {
      return res.status(400).json({ error: 'Missing name or meals' });
    }

    const config = (await redis.get('config')) || DEFAULT_CONFIG;
    const submissions = (await redis.get('submissions')) || {};
    submissions[name] = { meals, submittedAt: new Date().toISOString() };
    await redis.set('submissions', submissions);

    const webhook = process.env.SLACK_WEBHOOK_URL;
    let slackOk = null;

    if (webhook) {
      const text = `:fork_and_knife: *Factor order submitted \u2014 ${name}*\n${groupedLines(meals, config)}\n\n(${Object.keys(submissions).length}/${config.teamNames.length} submitted this week)`;
      slackOk = await postToSlack(webhook, text);

      const allIn = config.teamNames.every((n) => submissions[n]);
      if (allIn) {
        const combined = {};
        Object.values(submissions).forEach((sub) => {
          Object.entries(sub.meals).forEach(([id, qty]) => {
            combined[id] = (combined[id] || 0) + qty;
          });
        });
        const rollupText = `:white_check_mark: *All ${config.teamNames.length} team members have submitted!* Combined Factor order:\n${groupedLines(combined, config)}`;
        await postToSlack(webhook, rollupText);
      }
    }

    res.status(200).json({ ok: true, slackOk, submissions });
  } catch (err) {
    res.status(500).json({ error: 'Could not save submission', detail: String(err) });
  }
};
