Kiwi – Team Collaboration Web App
Kiwi is a playful, pixel-art inspired, AI-powered team collaboration platform. It combines robust team management, real-time chat, dual LLM assistants, and a unique blend of soft 3D and pixel UI, all built on a modern stack with Supabase and React.

Features
Authentication: OAuth via GitHub and Google, session management, and auto-profile fetch (Supabase Auth)

Team Collaboration:

Create teams, join via code, or invite members by email/GitHub

Unique team codes for easy onboarding

Member roles (admin, viewer, etc.)

Real-time updates via Supabase listeners

Dual LLM Chat System:

Each workspace offers two AI assistants (Gemini, GPT, or both)

Real-time, side-by-side chat panels for each user

Drag-to-clone conversation threads between panels

Pixel Art + Soft 3D Design:

Responsive layout, mascot animation, animated modals (Framer Motion)

Sidebar with team info and actions

To-do panel for workspace notes (basic CRUD)

Extra Features:

Export chat as PDF

Dark mode toggle

Custom workspace themes

404 and loading screens with mascot and pixel effects

Tech Stack
Frontend: React, TailwindCSS, Framer Motion, ShadCN, Zustand (or Redux)

Backend: Node.js + Express or Supabase Edge Functions

Database: Supabase (PostgreSQL)

Auth: Supabase Auth (OAuth)

LLM Integration: Google Gemini & OpenAI GPT APIs

UI: Pixel art & soft 3D, custom mascot (Lottie/Storyblocks)

Pages & Routing
/ – Animated landing page with mascot and call-to-action

/login – OAuth login (GitHub, Google)

/signup – Optional email/password signup

/home – User dashboard: create/join/invite teams

/workspace/:teamId – Main team workspace: chat, to-dos, sidebar

* – Custom 404 pixel-art error page

Database Schema (Supabase)
users: id, email, github_id, name, avatar

teams: id, name, team_code, created_by

team_members: id, team_id, user_id, role

invites: id, team_id, email/github, status

messages: id, user_id, llm_type, team_id, message, timestamp

Setup & Installation
Prerequisites
Node.js (v18+ recommended)

Supabase account & project

API keys for Gemini and OpenAI (optional, for AI chat)

1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/yourusername/kiwi-collab.git
cd kiwi-collab
2. Install Dependencies
bash
Copy
Edit
npm install
3. Environment Variables
Create a .env file based on .env.example:

ini
Copy
Edit
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_OPENAI_API_KEY=your_openai_key
VITE_GEMINI_API_KEY=your_gemini_key
4. Configure Supabase
Set up the database schema (see above).

Enable Auth providers (GitHub, Google) in Supabase Dashboard.

Add your site and local URLs as Auth redirect URIs.

5. Run the App
bash
Copy
Edit
npm run dev
Visit http://localhost:5173 in your browser.

6. Deploy
Deploy to Vercel or Netlify for production.

Customization
Update mascot animations and backgrounds in public/assets or via Lottie/Storyblocks links.

To add more LLMs, configure API endpoints in the backend and adjust the workspace UI as needed.

Edit Tailwind config and pixel/3D styles in /src/styles for branding.

Assets
Mascot and loading animations: Use Lottie or Storyblocks, or customize in /public/assets.

Pixel textures: Place under /public/assets/pixels and reference in Tailwind/JSX.

Contributing
Fork this repo

Create your feature branch (git checkout -b feature/your-feature)

Commit your changes (git commit -am 'Add new feature')

Push to the branch (git push origin feature/your-feature)

Open a pull request

License
MIT

Credits
Pixel and mascot art via Storyblocks or custom Lottie

Powered by Supabase, , Google Gemini

