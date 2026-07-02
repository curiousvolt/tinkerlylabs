// Local dev API server — proxies /api/subscribe to Google Sheets
// Run with: node server.js (alongside npm run dev)

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';

const app = express();
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'] }));
app.use(express.json());

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_SUBMIT_TIME_MS = 1800;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const RECENT_EMAIL_WINDOW_MS = 10 * 60 * 1000;

const rateLimitStore = new Map();
const recentEmailStore = new Map();

function isRateLimited(key) {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

function wasRecentlySubmitted(email) {
  const now = Date.now();
  const lastSubmittedAt = recentEmailStore.get(email);

  return Boolean(lastSubmittedAt && now - lastSubmittedAt < RECENT_EMAIL_WINDOW_MS);
}

function markRecentlySubmitted(email) {
  recentEmailStore.set(email, Date.now());
}

app.post('/api/subscribe', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const source = req.body.source || 'unknown';
  const newsletter = req.body.newsletter !== false;
  const website = String(req.body.website || '');
  const startedAt = Number(req.body.startedAt || 0);

  if (website) {
    return res.status(200).json({ success: true });
  }

  if (!startedAt || Date.now() - startedAt < MIN_SUBMIT_TIME_MS) {
    return res.status(429).json({ success: false, error: 'Please wait a moment before submitting' });
  }

  // Basic validation
  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email address' });
  }

  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (isRateLimited(ip) || isRateLimited(email)) {
    return res.status(429).json({ success: false, error: 'Too many signups. Please try again later.' });
  }

  if (wasRecentlySubmitted(email)) {
    return res.status(409).json({ success: false, error: 'This email was already submitted recently.' });
  }

  if (!SHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
    return res.status(500).json({ success: false, error: 'Signup service is not configured' });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'short',
      timeStyle: 'short',
    });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1!A:D',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[email, timestamp, source, newsletter ? 'Yes' : 'No']],
      },
    });

    markRecentlySubmitted(email);

    console.log(`✅ Email saved: ${email} (${source})`);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Google Sheets error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to save email' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 API server running at http://localhost:${PORT}`);
  console.log(`   POST http://localhost:${PORT}/api/subscribe\n`);
});
