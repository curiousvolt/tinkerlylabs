import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_SUBMIT_TIME_MS = 1800;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const RECENT_EMAIL_WINDOW_MS = 10 * 60 * 1000;

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const recentEmailStore = new Map<string, number>();

function getHeaderValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getClientIp(req: VercelRequest) {
  const forwardedFor = getHeaderValue(req.headers["x-forwarded-for"]);
  return forwardedFor?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

function wasRecentlySubmitted(email: string) {
  const now = Date.now();
  const lastSubmittedAt = recentEmailStore.get(email);

  return Boolean(lastSubmittedAt && now - lastSubmittedAt < RECENT_EMAIL_WINDOW_MS);
}

function markRecentlySubmitted(email: string) {
  recentEmailStore.set(email, Date.now());
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  let email: string, source: string, newsletter: boolean, website: string, startedAt: number;
  try {
    const body = req.body || {};
    email = String(body.email || "").trim().toLowerCase();
    source = body.source || "unknown";
    newsletter = body.newsletter !== false; // default true
    website = String(body.website || "");
    startedAt = Number(body.startedAt || 0);
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  if (website) {
    return res.status(200).json({ success: true });
  }

  if (!startedAt || Date.now() - startedAt < MIN_SUBMIT_TIME_MS) {
    return res.status(429).json({ error: "Please wait a moment before submitting" });
  }

  // Validate email
  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip) || isRateLimited(email)) {
    return res.status(429).json({ error: "Too many signups. Please try again later." });
  }

  if (wasRecentlySubmitted(email)) {
    return res.status(409).json({ error: "This email was already submitted recently." });
  }

  if (!SHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
    return res.status(500).json({ error: "Signup service is not configured" });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: CLIENT_EMAIL, private_key: PRIVATE_KEY },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "short",
      timeStyle: "short",
    });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:D",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[email, timestamp, source, newsletter ? "Yes" : "No"]] },
    });

    markRecentlySubmitted(email);

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Google Sheets error:", err.message);
    return res.status(500).json({ error: "Failed to save email" });
  }
}
