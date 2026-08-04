const { kv } = require('@vercel/kv');
const { DEFAULT_CONFIG } = require('./_defaults');

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

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { name, meals } = req.body || {};
    if (!name || !meals || typeof meals !== 'object') {
      return res.status(400).json({ error: 'Missing name or meals' });
    }

    const config = (await kv.get('config')) || DEFAULT_CONFIG;
    const submissions = (await kv.get('submissions')) || {};
    submissions[name] = { meals, submittedAt: new Date().toISOString() };
    await kv.set('submissions', submissions);

    const webhook = process.env.SLACK_WEBHOOK_URL;
    let slackOk = null;

    if (webhook) {
      const lines = Object.entries(meals).map(([id, qty]) => {
        const meal = config.meals.find((m) => m.id === id);
        return `\u2022 ${qty}x ${meal ? meal.name : id}`;
      });
      const text = `:fork_and_knife: *Factor order submitted \u2014 ${name}*\n${lines.join('\n')}\n\n(${Object.keys(submissions).length}/${config.teamNames.length} submitted this week)`;
      slackOk = await postToSlack(webhook, text);

      const allIn = config.teamNames.every((n) => submissions[n]);
      if (allIn) {
        const totals = {};
        Object.values(submissions).forEach((sub) => {
          Object.entries(sub.meals).forEach(([id, qty]) => {
            totals[id] = (totals[id] || 0) + qty;
          });
        });
        const rollupLines = Object.entries(totals)
          .sort((a, b) => b[1] - a[1])
          .map(([id, qty]) => {
            const meal = config.meals.find((m) => m.id === id);
            return `\u2022 ${qty}x ${meal ? meal.name : id}`;
          });
        const rollupText = `:white_check_mark: *All ${config.teamNames.length} team members have submitted!* Combined Factor order:\n${rollupLines.join('\n')}`;
        await postToSlack(webhook, rollupText);
      }
    }

    res.status(200).json({ ok: true, slackOk, submissions });
  } catch (err) {
    res.status(500).json({ error: 'Could not save submission', detail: String(err) });
  }
};
