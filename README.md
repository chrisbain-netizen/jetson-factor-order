# Jetson Weekly Order Board

A small internal tool for the service team to pick their 5 Factor meals each week, post their order to Slack, and roll up totals for whoever places the Factor order.

Branded with Jetson Green, Forest, Fern, Lime, and MNKY Jane.

## Why this needs a real backend

The original version lived only inside a Claude.ai artifact, which has its own built-in storage. A real Vercel deployment doesn't have that, so this version uses:
- **Vercel KV** (a small Redis store) to hold the settings and this week's submissions, shared by everyone who opens the link.
- **A Slack Incoming Webhook** to post orders, called from a serverless function (so no keys are exposed in the browser).

## Deploy it (10 minutes, no coding required)

1. **Get the code into a Git repo.**
   - Create a new empty repo on GitHub (e.g. `jetson-order-board`).
   - Unzip this project locally, then from inside the folder:
     ```
     git init
     git add .
     git commit -m "Weekly order board"
     git branch -M main
     git remote add origin https://github.com/<your-org>/jetson-order-board.git
     git push -u origin main
     ```

2. **Import it into Vercel.**
   - Go to [vercel.com/new](https://vercel.com/new), pick your GitHub org, and import the repo.
   - Framework preset: leave as **Other**. Click **Deploy**. It'll deploy successfully even before KV/Slack are set up — the app just won't save anything yet.

3. **Add a KV store (for shared storage).**
   - In the Vercel project, go to **Storage → Create Database → KV**.
   - Create it and choose **Connect to Project** for this project. Vercel will automatically add the `KV_REST_API_URL` and `KV_REST_API_TOKEN` environment variables for you.

4. **Add your Slack webhook (optional but recommended).**
   - In Slack: [api.slack.com/apps](https://api.slack.com/apps) → **Create New App** → **From scratch** → name it (e.g. "Factor Orders") → pick your workspace.
   - Go to **Incoming Webhooks** → toggle **On** → **Add New Webhook to Workspace** → choose the channel (e.g. `#factor-orders`) → copy the webhook URL.
   - Back in Vercel: **Settings → Environment Variables** → add `SLACK_WEBHOOK_URL` with that value → save.
   - To post to a different channel later, just create a new webhook for that channel and update the env var — no code changes needed.

5. **Redeploy.**
   - Vercel → **Deployments** → **Redeploy** (this picks up the new env vars and KV connection).
   - Open the deployment URL — you should see the order board. Try Settings, add real meal names from this week's factor75.com menu, and share the link with your 4 team members.

## Editing the meal list each week

Open **Settings** in the app itself and edit the meal names/tags directly — no redeploy needed, since that's saved to KV. Just remember Factor's menu rotates every Monday, so swap in the current week's dish names before sharing the link.

## Starting a new week

**Settings → Start new week** clears everyone's submitted orders but keeps your meal list, team names, and Slack connection in place.

## Local structure

```
index.html          the whole front end (fetches /api/* routes)
jetson-logo-*.png    Jetson logo, off-white and green variants
fonts/               MNKY Jane woff2 files used by the page
api/state.js         GET: current settings + this week's submissions
api/config.js        POST: save settings (team names, meals, meals/person)
api/submit.js        POST: save one person's order + post to Slack
api/reset.js         POST: clear the week's submissions
```
