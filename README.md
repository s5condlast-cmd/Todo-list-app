# 📝 TaskPulse SaaS — Modern Archival Task Focus Application

![License](https://img.shields.io/badge/License-MIT-indigo.svg)
![React](https://img.shields.io/badge/Frontend-React_18_--_Vite-blue.svg)
![Node](https://img.shields.io/badge/Backend-Node.js_--_Express-emerald.svg)
![Database](https://img.shields.io/badge/Database-SQLite_3-amber.svg)
![Authentication](https://img.shields.io/badge/2FA-Google_Authenticator_TOTP-indigo.svg)

> A full-stack Todo List & Task Management Application built with React 18, Vite, Node.js, Express, and SQLite.

---

## ⚡ Quick Start Guide (Local Development)

### 1. Install All Dependencies
```bash
npm install
```
*(Automatically triggers postinstall scripts for both server & client packages)*

### 2. Run Application Concurrently
```bash
npm run dev
```
*(Launches Express API backend & Vite React frontend concurrently)*

👉 Open **`http://localhost:5000`** in your browser!

---

## 🐙 How to Publish to GitHub

Follow these simple steps to push this repository to your GitHub account:

```bash
# 1. Initialize Git repository (if not already initialized)
git init

# 2. Add all files to staging
git add .

# 3. Create your first commit
git commit -m "feat: initial release of TaskPulse SaaS with Google 2FA & SQLite backend"

# 4. Rename main branch
git branch -M main

# 5. Connect to your GitHub repository (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/taskpulse-saas.git

# 6. Push code to GitHub
git push -u origin main
```

---

## ☁️ 1-Click Production Deployment

### Render.com / Railway.app / Heroku Setup
1. Create a new Web Service pointing to your GitHub repository.
2. Set **Build Command**: `npm install`
3. Set **Start Command**: `npm start`
4. Environment Variables:
   - `PORT`: `5000`
   - `JWT_SECRET`: `your_random_production_jwt_secret`
   - `NODE_ENV`: `production`

---

## 🛠️ Project Structure

```
.
├── server/               # Node.js + Express API + SQLite Database
│   ├── src/
│   │   ├── index.js      # Express API Server & Auth Endpoints
│   │   ├── db.js         # SQLite Database Schema & Indexes
│   │   └── tasks.db      # SQLite Relational Database
│   ├── .env.example
│   └── package.json
│
├── client/               # React + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/   # React SaaS Components & Modals
│   │   ├── context/      # AuthContext & Dark/Light Mode Theme
│   │   ├── api.js        # API Client Helper
│   │   └── App.jsx       # Main Workspace Application
│   ├── .env.example
│   └── package.json
│
├── .gitignore            # Git exclusion rules
├── LICENSE               # MIT License
├── package.json          # Root orchestration package.json
└── README.md             # Documentation & Setup Guide
```

---

## 🔐 Key Features

- 🔐 **Google Authenticator (2FA TOTP)**: Dynamic per-account Base32 secret keys, 1-time emergency backup keys, and enrollment QR codes.
- 🌓 **Warm Cream Light & Dark Mocha Themes**: High-contrast, executive SaaS styling.
- ⚡ **Archival Kanban & List Views**: Unified To Do, Urgent Focus, and Completed columns.
- 🏷️ **Custom Tags & Priorities**: Tag management with custom colors & priorities.
- 💾 **SQLite Relational Engine**: Relational schema with foreign keys & indexed lookups.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
