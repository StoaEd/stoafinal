```md
# 🚀 Stoa – Inclusive AI-Powered Learning Platform

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

---

## 🧑‍💻 Getting Started

To get started with the development environment, follow the steps below:

### 1. **Clone the repository**  
```bash
git clone https://github.com/StoaEd/stoafinal.git
cd <project-directory>
```

### 2. **Install dependencies**
Use one of the following based on your package manager:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Once the server is up, open [http://localhost:3000](http://localhost:3000) in your browser to see the app running.

---

## 📦 Environment Setup

Before running the app, create a `.env.local` file in the root directory (same level as this README) and paste the following environment variables:

```env
GOOGLE_GENERATIVE_AI_API_KEY=""

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=stoa-
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
DATABASE_URL=""
```

⚠️ **Note:** Ensure your `.env.local` file is not pushed to GitHub (it should already be listed in `.gitignore` for security).

---

## 📋 Change Log

### v0.1 – Initial Setup
- ✅ Project bootstrapped with `create-next-app` (Next.js + TypeScript)
- ✅ Tailwind CSS and ShadCN UI for responsive design system
- ✅ Basic routing with layout components
- ✅ Firebase setup with environment variables for Auth & Firestore

---

### v0.2 – Authentication & User Management
- ✅ Firebase Authentication (Email/Password, Google OAuth)
- ✅ User context and protected route handling
- ✅ Role-based access for student/mentor/recruiter accounts

---

### v0.3 – Notes System + Voice-to-Text
- ✅ Added **Notes Shelf** with full CRUD support
- ✅ Integrated **Voice-to-Text** via Gemini API
- ✅ Synced all notes with Firestore in real time

---

### v0.4 – Dashboard, Agenda & Tracker
- ✅ Built personalized **Dashboard** with learning overview
- ✅ Implemented **Agenda System** for upcoming tasks and goals
- ✅ Developed **Milestone Tracker** to visualize progress
- ✅ Dashboard widgets for notes, progress, and active courses

---

### v0.5 – Learning Modules & Domain System
- ✅ Created **Domain Management** system (My Courses + Manage Subjects)
- ✅ Added "Learn from Scratch" tool for dyslexic learners
- ✅ Integrated **Sign Language Module** with step-by-step video lessons
- ✅ Dynamic course states (active, archived, personalized)

---

### v0.6 – AI Personalization & Smart Quiz Engine
- ✅ Integrated **Personalization Engine** for adaptive learning paths
- ✅ Developed **RAG-based AI Quiz Engine** with smart feedback
- ✅ Implemented mistake tracking and reference-based answers
- ✅ Added **Global Leaderboard** synced with quiz results

---

### v0.7 – Synergy & Comfort Hubs
- ✅ Launched **Synergy Hub** for real-time collaboration
- ✅ Built **Comfort Hub** for specially-abled learners
- ✅ Deployed **AI Chatbot** with Gemini API (text, voice, sign input)

---

### v0.8 – Portfolio & Career Tools
- ✅ Enabled **Digital Portfolio** builder with skill verification
- ✅ Replaced resumes with **Credential Management System**
- ✅ Created **Recruiter View Mode** to access learner profiles

---

### v0.9 – Accessibility & Multimodal Learning
- ✅ Added **Multimodal Input**: Text, Voice, Camera, Sign Language
- ✅ Built-in accessibility support: colorblind mode, dyslexia overlay
- ✅ Mobile-first UI with responsive layout and a11y support


## 📱 Download the Mobile App

Want to use **Stoa** on the go? Get the Android app version now!

👉 **[Download APK](https://github.com/StoaEd/stoa-mobile-apk/blob/main/stoa-mobile-app.apk)**

> 💡 Compatible with Android 8.0+ | Size: ~18.3 MB | Updated: April 2025

---
