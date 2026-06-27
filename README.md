# Tinkerlylabs

Welcome to Tinkerlylabs! This repository contains the AI waitlist page.

View your app in AI Studio: https://ai.studio/apps/866f45fa-a115-4dfe-8230-7c60433e4e97

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
2. Copy `.env.example` to `.env` and fill in Google service account credentials.
3. Run the backend API server:
   ```bash
   npm run api
   ```
4. Run the frontend:
   ```bash
   npm run dev
   ```

## Deploying to Netlify

1. Connect this repository to Netlify.
2. In Netlify Site Settings, configure these Environment Variables:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY` (ensure newlines are preserved)
   - `GOOGLE_SHEET_ID`

---

Made with ❤️ by the Tinkerlylabs team

