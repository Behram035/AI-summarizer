# NoteDistill — AI Summarizer

A production-ready full-stack AI summarizer built with **Next.js 15**, **Gemini 1.5 Flash**, **MongoDB**, **Redux Toolkit**, **Tailwind CSS**, and **Framer Motion**.

## Features

- **Text summarization** — paste any text, article, or notes
- **Live audio recording** — record directly in the browser with pause/resume
- **Voice note upload** — upload MP3, WAV, WebM, OGG, M4A files (up to 25MB)
- **Speech-to-text** — Gemini AI transcribes audio before summarizing
- **AI outputs** — Summary, Bullet Points, Key Notes, Sentiment analysis, Tags
- **Authentication** — JWT-based register/login with secure password hashing
- **History management** — search, filter by favorites, paginate, delete
- **Copy & Download** — copy any tab's content or download as Markdown
- **Redux Toolkit** — full state management with async thunks
- **Framer Motion** — smooth tab transitions, staggered animations, skeleton loaders
- **Scalable architecture** — App Router, server components, API routes, Mongoose models

---

## Prerequisites

- **Node.js** 18+
- **MongoDB** — Atlas cluster (free tier works)
- **Google Gemini API Key** — get from [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/ai-summarizer?retryWrites=true&w=majority

# JWT secret (generate a random 32+ char string)
JWT_SECRET=your-random-secret-here

# NextAuth (used for session URL)
NEXTAUTH_SECRET=another-random-secret
NEXTAUTH_URL=http://localhost:3000

# Gemini API key from Google AI Studio
GEMINI_API_KEY=AIza...
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.js   # POST /api/auth/register
│   │   │   ├── login/route.js      # POST /api/auth/login
│   │   │   └── me/route.js         # GET  /api/auth/me
│   │   ├── summarize/route.js      # POST /api/summarize
│   │   └── history/
│   │       ├── route.js            # GET  /api/history
│   │       └── [id]/route.js       # GET/PATCH/DELETE /api/history/:id
│   ├── history/page.js
│   ├── layout.js
│   ├── page.js
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── AppShell.jsx            # Auth init + layout wrapper
│   │   ├── Navbar.jsx
│   │   └── ReduxProvider.jsx
│   ├── summarizer/
│   │   ├── HeroSection.jsx
│   │   ├── SummarizerInput.jsx     # Main input controller
│   │   ├── TextInputPanel.jsx      # Text mode
│   │   ├── AudioRecorderPanel.jsx  # Live recording mode
│   │   ├── VoiceNotePanel.jsx      # File upload mode
│   │   ├── SummaryOutput.jsx       # Output tabs + actions
│   │   └── HistoryClient.jsx       # History page
│   └── ui/
│       ├── AuthModal.jsx           # Login/Register modal
│       └── SummarySkeleton.jsx     # Loading skeleton
├── lib/
│   ├── db/
│   │   ├── connect.js              # Mongoose connection (cached)
│   │   └── models/
│   │       ├── User.js             # User schema + bcrypt
│   │       └── Summary.js          # Summary schema
│   ├── hooks/
│   │   └── useAudioRecorder.js    # MediaRecorder hook
│   └── utils/
│       ├── auth.js                 # JWT helpers
│       └── gemini.js               # Gemini AI client
└── store/
    ├── index.js                    # Redux store
    └── slices/
        ├── authSlice.js
        ├── summarySlice.js
        └── uiSlice.js
```

---

## API Reference

### Auth

| Method | Endpoint             | Body                      | Auth         |
| ------ | -------------------- | ------------------------- | ------------ |
| POST   | `/api/auth/register` | `{name, email, password}` | No           |
| POST   | `/api/auth/login`    | `{email, password}`       | No           |
| GET    | `/api/auth/me`       | —                         | Bearer token |

### Summarize

| Method | Endpoint         | Body                                         | Auth         |
| ------ | ---------------- | -------------------------------------------- | ------------ |
| POST   | `/api/summarize` | `{text, inputType, audioBase64?, mimeType?}` | Bearer token |

**inputType**: `"text"` | `"audio"` | `"voice_note"`

**Response** includes: `title`, `summary`, `bulletPoints[]`, `keyNotes[]`, `sentiment`, `tags[]`, `wordCount`, `readingTime`

### History

| Method | Endpoint           | Params/Body                              | Auth         |
| ------ | ------------------ | ---------------------------------------- | ------------ |
| GET    | `/api/history`     | `?page=1&limit=10&search=&favorite=true` | Bearer token |
| GET    | `/api/history/:id` | —                                        | Bearer token |
| PATCH  | `/api/history/:id` | `{isFavorite}`                           | Bearer token |
| DELETE | `/api/history/:id` | —                                        | Bearer token |

---

## Key Technical Decisions

### Audio Processing Flow

```
Browser MediaRecorder → Blob → Base64 → API Route → Gemini multimodal transcription → summarizeText()
```

### Auth Flow

```
Register/Login → JWT → localStorage + HttpOnly cookie → Bearer token on every API call
```

### State Architecture

```
Redux slices: auth (user/token/loading) | summary (input/output/history) | ui (modals/sidebar)
```

### MongoDB Caching

```js
// Singleton pattern prevents connection exhaustion in serverless
let cached = global.mongoose;
```

---

## Production Deployment (Vercel)

1. Push to GitHub
2. Import to Vercel
3. Add all `.env.local` vars to Vercel Environment Variables
4. Deploy — Next.js API routes run as serverless functions automatically

**MongoDB Atlas**: Whitelist `0.0.0.0/0` for Vercel's dynamic IPs, or use Atlas's Vercel integration.
