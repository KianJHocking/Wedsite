# 💖 Bespoke Wedding Website Framework (Supabase + Vercel Edition)

A premium, fully featured, and visually stunning wedding website framework. It features an elegant custom romantic aesthetic styled with bespoke **Vanilla CSS**, utilizing **React (TypeScript + Vite)** on the frontend, and a **Node.js Express Serverless API** integrated with **Supabase PostgreSQL** on the backend.

---

## ✨ Features Included

1. **Elegant Landing/Hero Page:**
   - Soft, classic, romantic layout with a custom serif typography scheme (*Playfair Display* via Google Fonts).
   - Real-time countdown timer ticking down to the special day.
   - **Interactive Site Guide:** A clear visual table of contents navigating guests directly to different sections.
2. **Password & Username Login (No Emails Needed):**
   - Dedicated guest login page without requiring an email address (couple can send username/password credentials directly).
   - Managed with React Auth Context, keeping session tokens in `localStorage` and protecting private sections with a router guard.
3. **Interactive RSVP Form:**
   - Intelligently detects the user's party size and lists custom preferences for *each individual family member*.
   - Captures culinary choices for multiple courses (Starter, Main, Dessert).
   - Allows guests to supply custom dietary requirements, allergies, song requests, and warm notes.
   - Automatically checks for existing submissions, pre-fills previous responses, and lets guests update their selection in real-time.
4. **"Our Story" & Placeholder Gallery:**
   - Chronological relationship timeline with responsive cards tracking major milestones ("Where we met", "Our first date", etc.).
   - Interactive, hover-responsive image frame grids utilizing CSS gradients to represent media prior to actual photo uploads.
5. **Interactive FAQs Page:**
   - Accordion component with smooth sliding transition toggles.
   - Filled with useful sample guidelines (dress code, children policy, travel, and local hotel accommodations/discounts).

---

## 🛠️ Architecture & Hosting Model

- **Frontend:** React 18, TypeScript, Vite, React Router DOM, Lucide Icons, Vanilla CSS
- **Backend:** Node.js, Express, Cors, JWT (JSON Web Tokens), Dotenv (Running as a **Vercel Serverless Function** in `/api`)
- **Database:** **Supabase (PostgreSQL)**

---

## 📦 How to Set Up Supabase (Database)

1. Create a free account at [Supabase](https://supabase.com/).
2. Create a new project.
3. Go to the **SQL Editor** tab in your Supabase Dashboard and click **New Query**.
4. Paste and execute the following SQL script to create the necessary tables and populate default test guests:

```sql
-- 1. Create Guests Table
CREATE TABLE guests (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    members JSONB NOT NULL -- String array of guest names in party
);

-- 2. Create RSVPs Table
CREATE TABLE rsvps (
    username TEXT PRIMARY KEY REFERENCES guests(username) ON DELETE CASCADE,
    name TEXT NOT NULL,
    attending BOOLEAN NOT NULL,
    members_rsvp JSONB NOT NULL, -- Array of { memberName, attending, mealChoice, dietary }
    message TEXT,
    song_request TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Insert Sample Guests (for testing)
INSERT INTO guests (username, password, name, members) VALUES
('johnsmith', 'love', 'John Smith', '["John Smith"]'::jsonb),
('millers', 'love', 'The Miller Family', '["David Miller", "Sarah Miller", "Leo Miller"]'::jsonb),
('aliceandbob', 'love', 'Alice & Bob', '["Alice Johnson", "Bob Peterson"]'::jsonb)
ON CONFLICT (username) DO NOTHING;
```

---

## 🚀 How to Deploy to Vercel

Since the project is structured as a **unified Vercel Monorepo**, you can deploy both your frontend and serverless backend with a single click:

1. Push your codebase to a **GitHub**, **GitLab**, or **Bitbucket** repository.
2. Log in to [Vercel](https://vercel.com/) and click **Add New** -> **Project**.
3. Import your wedding website repository.
4. In the **Environment Variables** section of your Vercel Project Settings, add the following variables:

| Variable Key | Value Source | Description |
| :--- | :--- | :--- |
| `SUPABASE_URL` | Supabase Dashboard -> Project Settings -> API | Your Supabase Project API URL |
| `SUPABASE_ANON_KEY` | Supabase Dashboard -> Project Settings -> API | Your Supabase Project Anon Public Key |
| `JWT_SECRET` | Generate any random secure string | Used to sign your guests' secure logins |

5. Click **Deploy**. Vercel will automatically build the frontend static files and compile the Express backend into an optimized `/api` Serverless function.

---

## 💻 Running the Project Locally

For local development, you can run the backend API and frontend Vite server concurrently:

1. Create an `.env` file in the **root** folder containing:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   JWT_SECRET=your_jwt_signing_secret
   ```

2. Run the Express server locally:
   ```bash
   cd api
   node index.js
   ```
   *The API will start locally on `http://localhost:5001`.*

3. In another terminal tab, run the Vite React app:
   ```bash
   cd frontend
   npm run dev
   ```
   *The client will run on `http://localhost:3000` and automatically forward all `/api` requests to local port 5001.*
