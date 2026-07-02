# Tinkerly Labs

Welcome to Tinkerly Labs! This repository contains the AI waitlist landing page and backend integration for early access signups.

## Features
- **Frontend:** React 19, Vite, Tailwind CSS v4, Motion (Framer Motion), Three.js
- **Backend:** Vercel Serverless Function (`/api/subscribe`) connecting to Google Sheets
- **Design:** Modern, premium, clean aesthetic with 3D and scroll animations

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
2. Copy `.env.example` to `.env` and fill in Google service account credentials.
3. Run the frontend:
   ```bash
   npm run dev
   ```

## Deploying to Vercel

1. Connect this repository to Vercel.
2. In Vercel Project Settings, configure these Environment Variables:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY` (ensure newlines are properly formatted)
   - `GOOGLE_SHEET_ID`
