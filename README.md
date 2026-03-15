# 📈 Rishi's Quant Tracker

**Personal study tracker for the 10-Month Quant Finance & Algo Trading plan**
20 hrs/week · ₹0 cost · 100% free resources

🌐 **Live site:** `https://YOUR_USERNAME.github.io/quant-tracker`

---

## Features

| Feature | Description |
|---|---|
| 📊 Dashboard | Overall progress, daily study chart, streak tracker, today's tasks |
| 📈 Progress | Mark every topic across all 8 phases (not started / in progress / done) |
| ✅ Tasks | Week-by-week task checklist + custom task support |
| 📅 Weekly Review | Log study hours, wins/struggles/plan, mood tracker, past review history |
| 🃏 Flashcards | 23 cards across all phases, flip animation, mark known/review |
| 🧠 Quiz | 14 questions with explanations, score history, per-phase mode |
| 📝 Notes | One notebook per phase, persistent |

All data is stored in your browser's **localStorage** — no server, no login, no cost.

---

## 🚀 Deploy to GitHub Pages (Free Domain) — Step by Step

### Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `quant-tracker`
3. Set to **Public** (required for free GitHub Pages)
4. Click **"Create repository"**

### Step 2: Upload the Files

**Option A — GitHub Web UI (easiest):**
1. Open your new repository on GitHub
2. Click **"uploading an existing file"** or drag & drop
3. Upload all files maintaining the folder structure:
   ```
   quant-tracker/
   ├── index.html
   ├── README.md
   ├── css/
   │   └── style.css
   └── js/
       ├── data.js
       └── app.js
   ```
4. Click **"Commit changes"**

**Option B — Git CLI:**
```bash
cd quant-tracker
git init
git add .
git commit -m "Initial commit — Quant Tracker"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/quant-tracker.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top tab)
3. In the left sidebar, click **"Pages"**
4. Under **"Source"**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

### Step 4: Access Your Site

After 1–2 minutes, your site will be live at:
```
https://YOUR_USERNAME.github.io/quant-tracker
```

GitHub will show you the URL in the Pages settings.

---

## 📱 Add to Home Screen (Mobile)

**Android (Chrome):**
1. Open the site in Chrome
2. Tap the 3-dot menu → "Add to Home screen"

**iPhone (Safari):**
1. Open the site in Safari
2. Tap Share → "Add to Home Screen"

This makes it work like an app on your phone!

---

## 💾 Data Backup

Since data is stored in localStorage, it's tied to your browser. To back up:

1. Open browser console (F12 → Console)
2. Run: `copy(JSON.stringify(localStorage))`
3. Paste into a text file and save

To restore: `Object.entries(JSON.parse(PASTE_HERE)).forEach(([k,v]) => localStorage.setItem(k,v))`

---

## 📊 Study Plan Summary

| Phase | Topic | Weeks | Hours |
|---|---|---|---|
| 0 | Revision Sprint | 1 | 20 |
| 1 | Quant Math (GBM, Portfolio Theory) | 3 | 60 |
| 2 | Time Series (ARIMA, GARCH, Pairs) | 6 | 120 |
| 3 | Financial Markets & Derivatives | 6 | 120 |
| 4 | Backtesting Systems | 4 | 80 |
| 5 | ML for Trading | 8 | 160 |
| 6 | Algo Systems & Live Trading | 6 | 120 |
| 7 | Deep Learning & RL | 6 | 120 |
| ★ | Capstone Projects | 3 | 60 |
| **Total** | | **43 weeks** | **~860 hrs** |

---

Made with 💙 for Rishi Gupta | B.Sc. Data Science, ICFAI University Dehradun
