# 🎄 Christmas HQ

An interactive 3D Christmas application where team members can leave holiday messages for each other! Each user has their own Christmas tree decorated with messages from colleagues.

## Features

- **User Authentication**: Sign up/login with Supabase Auth
- **Personal Christmas Trees**: Each user has their own tree
- **Interactive Decorations**: Leave cards or wrapped gifts with messages
- **Lobby View**: Central tree with ornaments representing all users
- **Billboard Cards**: Decorations always face the camera
- **User Search**: Find colleagues and visit their trees
- **Beautiful Animations**: Floating decorations, falling snow, twinkling lights
- **Handwritten Typography**: Authentic letter-style messages

## Tech Stack

- **React 18** + TypeScript
- **Vite** for fast development
- **React Three Fiber** + Drei for 3D graphics
- **Supabase** for authentication and database
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Router** for navigation

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `supabase-schema.sql`
3. Create a `.env` file based on `env.example.txt`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these values in your Supabase project: Settings → API

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173

## Database Schema

The app uses two main tables:

### `profiles`
- Extends Supabase auth.users
- Stores user display info (name, avatar)

### `messages`
- Links sender → recipient
- Stores message content and decoration style
- Enforces one message per sender per recipient

See `supabase-schema.sql` for the complete schema with RLS policies.

### Enable Real-time (Optional)

For live updates when someone leaves you a message:

1. Go to **Database → Replication** in your Supabase dashboard
2. Click on **supabase_realtime** publication
3. Enable replication for the `messages` table

This allows the app to show new messages instantly without refresh!

## Project Structure

```
src/
├── components/
│   ├── auth/          # Login/Register
│   ├── layout/        # Navigation, Layout
│   ├── modals/        # Message & Compose modals
│   ├── scenes/        # Lobby & UserTree scenes
│   ├── three/         # 3D components (Tree, Cards, Gifts)
│   └── ui/            # Shared UI components
├── lib/
│   └── supabase.ts    # Supabase client
├── store/
│   └── useStore.ts    # Zustand state
├── types/
│   └── database.ts    # TypeScript types
├── App.tsx
├── main.tsx
└── index.css
```

## Controls

- **Drag**: Rotate the scene
- **Scroll**: Zoom in/out
- **Click ornament**: Visit user's tree (in Lobby)
- **Click decoration**: Read the message
- **Click envelope**: Open to reveal letter

## Demo Mode

If Supabase is not configured, the app runs in demo mode with mock data.

---

Made with ❤️ for the holiday season 🎅

