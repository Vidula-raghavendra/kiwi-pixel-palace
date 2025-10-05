# KIWI Team

A delightful, pixel-art inspired team collaboration platform that combines AI-powered assistance with real-time teamwork. Built for developers who want powerful features wrapped in a joyful, retro gaming aesthetic.

## What is KIWI Team?

KIWI Team transforms team collaboration into an engaging experience. It's a modern workspace where you can:

- **Collaborate with Dual AI Assistants**: Chat with two AI models simultaneously and compare responses in real-time
- **Work Together Seamlessly**: Create instant workspaces with shareable invite codes
- **Stay Organized**: Track tasks with built-in to-do lists for each workspace
- **Chat in Real-Time**: Team messaging with presence indicators
- **Enjoy the Journey**: Pixel-art UI inspired by classic games makes work feel like play

## Key Features

### 🤖 Dual AI Chat System
Two AI assistants (Gemini & GPT) in every workspace. Compare responses side-by-side, drag conversations between panels, and get the best answers faster.

### 👥 Instant Team Workspaces
- Create teams in seconds with auto-generated invite codes
- Share codes with teammates for instant access
- GitHub OAuth for secure, one-click authentication
- Real-time presence indicators show who's online

### ✅ Collaborative Task Management
Built-in to-do lists for each workspace help teams stay organized and aligned on priorities.

### 💬 Real-Time Team Chat
Dedicated chat room for each workspace with message history and typing indicators.

### 🎨 Pixel-Perfect Design
- Retro pixel-art aesthetic with modern UI/UX
- Smooth animations and transitions
- Responsive design works on all devices
- Custom mascot characters for guidance and delight

### 🔒 Secure by Default
- GitHub OAuth authentication
- Row Level Security (RLS) in Supabase
- Encrypted data storage
- No passwords to manage

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS with custom pixel-art theme
- **UI Components**: shadcn/ui, Radix UI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with GitHub OAuth
- **AI Integration**: Google Gemini API (via Supabase Edge Functions)
- **Real-Time**: Supabase Realtime subscriptions
- **State Management**: React Context + Custom Hooks
- **Routing**: React Router v6
- **Animations**: Framer Motion, CSS animations

## Project Structure

```
src/
├── api/                    # API integration modules
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── pixel/            # Pixel-art UI components
│   └── ui/               # Reusable UI components (shadcn/ui)
├── contexts/             # React contexts (Auth, etc.)
├── hooks/                # Custom React hooks
├── integrations/         # Third-party integrations
│   └── supabase/        # Supabase client & types
├── lib/                  # Utility functions
└── pages/                # Page components (routing)

supabase/
├── functions/            # Edge Functions for AI chat
└── migrations/           # Database migrations
```

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Supabase account
- GitHub OAuth app credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd kiwi-team
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**

   The `.env` file should already contain your Supabase credentials. Verify these values:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Configure GitHub OAuth**

   In your Supabase dashboard:
   - Go to Authentication → Providers
   - Enable GitHub provider
   - Add your GitHub OAuth credentials
   - Set redirect URLs:
     - `http://localhost:5173` (development)
     - Your production domain

5. **Database is Ready**

   Your Supabase database is already provisioned with all necessary tables and security policies.

6. **Start the development server**
   ```bash
   npm run dev
   ```

   Visit `http://localhost:5173`

## Database Schema

### Core Tables

- **teams**: Workspace/team information
  - `id`, `name`, `description`, `invite_code`, `created_by`, `created_at`

- **team_members**: Team membership tracking
  - `id`, `team_id`, `user_id`, `role`, `joined_at`

- **messages**: Team chat messages
  - `id`, `team_id`, `user_id`, `content`, `created_at`

- **todos**: Task management
  - `id`, `team_id`, `content`, `completed`, `created_by`, `created_at`

- **ai_chats**: AI conversation history
  - `id`, `user_id`, `team_id`, `model`, `messages`, `created_at`

All tables have Row Level Security (RLS) enabled with appropriate policies for team-based access control.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Key User Flows

### First-Time User
1. Land on homepage → See features and benefits
2. Click "Get Started" → GitHub OAuth authentication
3. Redirect to dashboard → See welcome message
4. Choose to create a team or join with invite code
5. Enter workspace → Start collaborating!

### Creating a Team
1. Click "Create a Room" or "New Team"
2. Enter team name and optional description
3. Team is created with unique invite code
4. Share code with teammates
5. Start using workspace immediately

### Joining a Team
1. Get invite code from a teammate
2. Click "Join a Room"
3. Enter the invite code
4. Instantly added to team workspace
5. Access all team features

### Using the Workspace
1. **AI Chat**: Ask questions, get code help, compare AI responses
2. **Team Chat**: Communicate with teammates in real-time
3. **To-Do List**: Create and manage tasks collaboratively
4. **Sidebar**: Access team settings, members, and quick actions

## Design Philosophy

KIWI Team follows these design principles:

1. **Joyful by Default**: Work should be enjoyable. Pixel art and playful interactions create delight.

2. **Clarity Over Complexity**: Clear visual hierarchy, obvious actions, minimal cognitive load.

3. **Fast & Responsive**: Instant feedback, smooth animations, optimistic UI updates.

4. **Team-First**: Every feature designed for collaboration, not solo work.

5. **No Barriers**: One-click auth, instant workspaces, no setup friction.

## Security & Privacy

- All user data encrypted at rest in Supabase
- GitHub OAuth for secure authentication
- Row Level Security prevents unauthorized access
- Team data isolated with Supabase RLS policies
- No third-party tracking or analytics
- AI conversations can be deleted anytime

## Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit with clear messages (`git commit -m 'Add amazing feature'`)
5. Push to your branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please ensure:
- Code follows the existing style
- All components use TypeScript
- UI matches the pixel-art theme
- New features have appropriate RLS policies

## Roadmap

Upcoming features:
- [ ] Voice chat rooms
- [ ] Screen sharing for pair programming
- [ ] Code snippet sharing with syntax highlighting
- [ ] Workspace themes and customization
- [ ] Mobile app (React Native)
- [ ] Integration with GitHub repositories
- [ ] Calendar and scheduling
- [ ] File sharing and storage

## License

MIT License - see LICENSE file for details

## Credits

- Pixel art inspiration from classic 8-bit and 16-bit games
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Powered by [Supabase](https://supabase.com/)
- AI by [Google Gemini](https://deepmind.google/technologies/gemini/)

## Support

Need help? Found a bug?

- Open an issue on GitHub
- Check existing issues for solutions
- Review documentation in `/docs`

---

Built with ❤️ by the KIWI Team
