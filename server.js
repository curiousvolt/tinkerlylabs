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

app.post('/api/subscribe', async (req, res) => {
  const { email, source = 'unknown' } = req.body;

  // Basic validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email address' });
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
      range: 'Sheet1!A:C',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[email, timestamp, source]],
      },
    });

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
