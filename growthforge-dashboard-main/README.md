# GrowthForge Media — Lead Intelligence Dashboard

**Live Dashboard:** https://growthforge-dashboard.vercel.app

**Password:** `growthforge2025`

**Backend Repo:** https://github.com/FalconAI007/growthforge-backend

**Website Repo:** https://github.com/FalconAI007/growthforge-website

---

## Project Overview

The Lead Intelligence Dashboard gives the GrowthForge Media sales team complete visibility into every conversation Chanakya has with website visitors. Every lead is automatically scored 1-10 by AI, summarised in one line, and ranked — so the sales team knows exactly who to call first and what to say when they do.

It is a standalone frontend — no server, no build process, pure HTML/CSS/JS — that connects to the live backend API and fetches all lead data in real time.

---

## Screenshots

![Dashboard Table](https://github.com/user-attachments/assets/ca149990-4ae5-46fa-955b-b7bb457389bb)
*Main leads table showing all captured leads sorted by AI score with colour-coded score badges, intent tags, and stage badges*

![Lead Panel](https://github.com/user-attachments/assets/6f668d4f-2877-412e-b9bf-c6c5259bcbb6)
*Lead detail panel showing full contact details, AI-generated summary, and complete conversation transcript fetched live from Supabase*

![Dashboard Stats](https://github.com/user-attachments/assets/873d224f-fdd0-466f-858c-e917e280a037)
*Stats row showing Total Leads, Decision Ready, Considering, Hot Leads, and Captured Today — all calculated live from the API*

---

## Repository Structure

```
growthforge-dashboard/
├── index.html                  # Complete dashboard — all logic in one file
├── .env.example                # API endpoint template
└── .gitignore
```

---

## Features

- **Password Protected Access** — Team-only login screen. Session maintained in sessionStorage — no re-login on refresh.
- **Live Lead Table** — All leads sorted by AI score then date. Shows score badge, name, business, email, phone, intent, stage, summary, and capture time per row.
- **AI Score Badges** — Colour-coded: green (8-10 hot), yellow (5-7 warm), blue (3-4 cold), grey (1-2 not interested). Sales team prioritises green first.
- **Lead Detail Panel** — Click any lead row to open a slide-in panel with full contact details, AI summary, and complete conversation transcript fetched live from Supabase.
- **Full Conversation Transcript** — Every message between visitor and Chanakya displayed in clean chat format — visitor in blue, Chanakya in dark — showing exactly what was discussed.
- **Export Chat** — One-click export of any lead's full details and transcript as a formatted `.txt` file.
- **Mark Contacted** — Button to record that the sales team has followed up with a lead.
- **Real-Time Stats** — Five stat cards: Total Leads, Decision Ready, Considering, Hot Leads (8-10), Captured Today — all live from API.
- **Lead Journey Timeline** — Chronological view of all leads showing stage, intent, and summary — a quick visual overview of the entire sales funnel.
- **Auto-Refresh Every 30 Seconds** — Dashboard stays current without manual refresh.

---

## Setup and Installation

No build tools needed — single HTML file.

```bash
# Clone
git clone https://github.com/FalconAI007/growthforge-dashboard.git
cd growthforge-dashboard

# Open in browser
open index.html
# Or use Live Server in VS Code
```

For local development, update the API URLs in `index.html`:

```javascript
const API = "http://localhost:5000/leads";
const CONV_API = "http://localhost:5000/conversations";
```

**Change password** in `index.html` before any production use:

```javascript
const TEAM_PASSWORD = "growthforge2025";
```

**Deployment:** Deployed on Vercel — connect GitHub repo, no build command, no output directory. Auto-deploys on every push to `main`.

---

## Future Ideas

- **Delete Lead** — Remove test or junk leads directly from the dashboard
- **Filter and Search** — Filter by stage, score range, intent, or date; search by name or email
- **Bulk CSV Export** — Export all leads at once for CRM import
- **Conversion Tracking** — Mark leads as converted and track overall conversion rate
- **Email Shortcut** — Click a lead's email to open a pre-filled follow-up template

---

## Novelty

Most lead dashboards show raw form submissions — name and email. This dashboard surfaces the full intelligence layer on every lead: AI score, conversation stage, intent classification, one-line summary, and complete transcript. The sales team walks into every call knowing exactly what the prospect asked, what objections they raised, and how ready they are to buy.

---

## Tech Stack

`HTML5` `CSS3` `Vanilla JavaScript` `Vercel`
