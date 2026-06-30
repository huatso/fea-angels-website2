# FEA Angels Web Infrastructure - Project Report

## Project Overview

**Project Name:** tanstack_start_ts (FEA Angels Web Infrastructure)
**Organization:** FEA Angels - Brazilian angel investment network
**Website:** feaangels.com.br
**Description:** Web application for FEA Angels, connecting angel investors, executives, and entrepreneurs to foster the Brazilian startup ecosystem through capital, knowledge, and connections.

### Mission
FEA Angels is formed by alumni from FEA-USP (Faculty of Economics, Administration, and Accounting at the University of São Paulo) with the goal of strengthening the Brazilian startup ecosystem.

---

## Technology Stack

### Core Framework
- **TanStack Start** (v1.167.50) - Full-stack React framework
- **TanStack Router** (v1.168.25) - File-based routing
- **TanStack React Query** (v5.83.0) - Data fetching and caching
- **React** (v19.2.0) - UI library

### Build Tools
- **Vite** (v7.3.1) - Build tool and dev server
- **TypeScript** (v5.8.3) - Type-safe JavaScript
- **Bun** - Package manager

### UI/Styling
- **Tailwind CSS** (v4.2.1) - Utility-first CSS framework
- **shadcn/ui** - Component library (New York style)
- **Radix UI** - Headless UI primitives (40+ components)
- **tw-animate-css** - Animation utilities
- **class-variance-authority** (CVA) - Component variants
- **Tailwind Merge** - Merge Tailwind classes

### AI Integration
- **OpenRouter AI** - AI model gateway
- **Supported Models:** DeepSeek, Google Gemini, GPT-5, Gemma

### Form Handling & Validation
- **React Hook Form** (v7.71.2) - Form state management
- **Zod** (v3.24.2) - Schema validation
- **@hookform/resolvers** - Form validation resolvers

### Additional Libraries
- **date-fns** (v4.1.0) - Date formatting
- **react-day-picker** (v9.14.0) - Date picker
- **recharts** (v2.15.4) - Charting library
- **sonner** (v2.0.7) - Toast notifications
- **lucide-react** (v0.575.0) - Icon library
- **embla-carousel-react** - Carousel component
- **cmdk** (v1.1.1) - Command palette

---

## Project Structure

```
fea-angels-web-infraestructure/
├── .env                          # Environment variables (gitignored)
├── .env.example                  # Example environment variables
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite build configuration
├── components.json               # shadcn/ui configuration
├── eslint.config.js              # ESLint configuration
├── bunfig.toml                   # Bun configuration
├── public/
│   └── images/                   # Logo assets
└── src/
    ├── components/
    │   ├── site/                 # Site-specific components
    │   │   ├── ChatWidget.tsx    # AI chat widget
    │   │   ├── Footer.tsx        # Site footer
    │   │   └── Header.tsx        # Site header
    │   └── ui/                   # shadcn/ui components (50+)
    ├── data/                     # Static data files
    │   ├── events.ts             # Event data
    │   ├── members.ts            # Member data
    │   └── posts.ts              # Blog posts
    ├── hooks/                    # Custom React hooks
    │   └── use-mobile.tsx        # Mobile detection
    ├── lib/                      # Utility libraries
    │   ├── api/                  # Server functions
    │   ├── config.server.ts      # Server configuration
    │   ├── env.ts                # Environment variables
    │   └── utils.ts              # Utilities
    ├── routes/                   # File-based routing
    │   ├── __root.tsx            # Root layout
    │   ├── index.tsx             # Home page
    │   ├── sobre.tsx             # About page
    │   ├── startups.tsx          # Startup submission
    │   ├── membros.tsx           # Members page
    │   ├── eventos.tsx           # Events page
    │   ├── blog.tsx              # Blog listing
    │   ├── blog.$slug.tsx        # Blog post detail
    │   ├── contato.tsx           # Contact page
    │   ├── cadastro.tsx          # Registration
    │   ├── login.tsx             # Login page
    │   └── api/chat.ts           # AI chat API
    ├── router.tsx                # Router configuration
    ├── server.ts                 # Server entry point
    ├── start.ts                  # TanStack Start init
    └── styles.css                # Global styles
```

---

## Application Routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/routes/index.tsx` | Homepage with hero, mission, portfolio, CTA |
| `/sobre` | `src/routes/sobre.tsx` | About page - organization history and values |
| `/startups` | `src/routes/startups.tsx` | Startup submission form with multi-step process |
| `/membros` | `src/routes/membros.tsx` | Members listing with investor profiles |
| `/eventos` | `src/routes/eventos.tsx` | Events page with upcoming and past events |
| `/blog` | `src/routes/blog.tsx` | Blog post listing |
| `/blog/$slug` | `src/routes/blog.$slug.tsx` | Individual blog post (dynamic) |
| `/contato` | `src/routes/contato.tsx` | Contact page with form and map |
| `/cadastro` | `src/routes/cadastro.tsx` | User registration (UI only) |
| `/login` | `src/routes/login.tsx` | Login page (UI only) |
| `/api/chat` | `src/routes/api/chat.ts` | AI chat API endpoint |

---

## Key Components

### Header (`src/components/site/Header.tsx`)
- Sticky navigation bar with responsive mobile menu
- Logo display and navigation links
- Login/Cadastre-se buttons
- Routes: Início, Sobre, Startups, Membros, Eventos, Blog, Contato

### Footer (`src/components/site/Footer.tsx`)
- 4-column layout: Logo/description, Navigation, Contact, Social links
- Dynamic social media links from environment variables
- Copyright notice

### ChatWidget (`src/components/site/ChatWidget.tsx`)
- Floating chat button with AI assistant
- OpenRouter integration with streaming responses
- Suggested questions for users
- Markdown rendering for responses
- Error handling with toast notifications

---

## Data Modules

### Members (`src/data/members.ts`)
- 8 sample members with name, role, bio, initials
- TypeScript type definitions included

### Events (`src/data/events.ts`)
- 4 events (2 upcoming, 2 past)
- Fields: title, date, location, description, status
- Includes Pitch Nights and workshops

### Posts (`src/data/posts.ts`)
- 3 blog posts about angel investment
- Fields: slug, title, excerpt, date, author, content
- Topics: angel investment basics, pitch mistakes, FEA Angels thesis

---

## API Specification

### POST /api/chat

**Location:** `src/routes/api/chat.ts`

**Purpose:** AI-powered chat assistant for website visitors

**Request Format:**
```json
{
  "messages": [{ "role": "user" | "assistant", "content": "string" }],
  "model": "string" // optional, must be in allowlist
}
```

**Response:** Server-Sent Events (SSE) stream with AI response

**Features:**
- System prompt configures AI as FEA Angels assistant
- Model allowlist: DeepSeek, Gemini, GPT-5, Gemma
- Message sanitization (max 4000 chars, max 20 messages)
- Streaming response support
- Error handling for rate limits (429) and insufficient credits (402)
- OpenRouter API integration

**Required Environment Variables:**
- `AI_API_KEY` - OpenRouter API key (server-only)
- `AI_API_URL` - API endpoint (defaults to OpenRouter)

---

## Configuration Files

### package.json
- **Scripts:**
  - `dev` - Start development server
  - `build` - Production build
  - `build:dev` - Development mode build
  - `preview` - Preview production build
  - `lint` - Run ESLint
  - `format` - Format with Prettier

### tsconfig.json
- **Target:** ES2022
- **Module:** ESNext with Bundler resolution
- **Path aliases:** `@/*` → `./src/*`
- **Strict mode:** Enabled

### vite.config.ts
- Uses `@lovable.dev/vite-tanstack-config` preset
- Configures TanStack Start with custom server entry
- Nitro integration for SSR

### components.json
- **Style:** New York
- **Icon library:** Lucide
- **Base color:** Slate
- **CSS variables:** Enabled

### Environment Variables (.env.example)
```
# Site Identity
VITE_SITE_NAME=
VITE_SITE_DESCRIPTION=

# Address/Map
VITE_ADDRESS=
VITE_MAPS_EMBED_URL=

# Contact
VITE_CONTACT_EMAIL=
VITE_CONTACT_PHONE=

# Social Media
VITE_SOCIAL_INSTAGRAM=
VITE_SOCIAL_LINKEDIN=
VITE_SOCIAL_YOUTUBE=

# AI Chat
VITE_CHAT_MODEL=

# Server-only (no VITE_ prefix)
AI_API_KEY=
AI_API_URL=
```

---

## Design System

### Color Palette
- **Primary Navy:** `oklch(0.36 0.08 235)` - `#004a69`
- **Accent Cyan-Deep:** `oklch(0.68 0.13 220)` - `#00a5cf`
- **Light Cyan:** `oklch(0.78 0.14 230)` - `#40b5ff`
- **Ink (Typography):** `oklch(0.18 0.02 250)` - Near-black
- **Navy-Soft:** `oklch(0.32 0.06 270)` - Alternative navy

### Typography
- **Serif (Headings):** "Instrument Serif", Georgia, serif
- **Sans-serif (Body):** "Inter", system-ui, sans-serif

### Design Principles
- Editorial style
- Sober and professional
- Lots of white space
- Cyan + navy + white palette

---

## Features

### Implemented
- ✅ Full UI implementation with all main pages
- ✅ Responsive design (mobile-first)
- ✅ AI chat integration (fully functional)
- ✅ Component library (shadcn/ui - 50+ components)
- ✅ File-based routing with TypeScript support
- ✅ SEO meta tags per page
- ✅ Error handling and error boundaries
- ✅ Google Maps integration on contact page

### Pending/Placeholder
- ⏳ User authentication (login/register UI only)
- ⏳ Form submission backend ("Backend em breve" toasts)
- ⏳ Database integration (currently static data)
- ⏳ Real blog content management

---

## Build & Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run build:dev    # Development mode build
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format with Prettier
```

### Build Output
- **Output directory:** `dist/`
- **Additional artifacts:** `.output/`, `.vinxi/`, `.tanstack/`

### Testing
- No test framework currently configured
- No test files (*.test.ts, *.spec.ts) present
- No testing dependencies in package.json

---

## Security Notes

- AI API key is server-side only (no VITE_ prefix)
- Environment variables properly separated between client and server
- Server-only modules use `.server.ts` naming convention
- Error messages don't leak sensitive information
- ESLint rule prevents accidental Next.js `server-only` imports

---

## Architecture Notes

### Server Entry (`src/server.ts`)
- Custom SSR error handling
- Catches h3 framework errors
- Renders error page on catastrophic failures

### Start Configuration (`src/start.ts`)
- Creates TanStack Start instance
- Adds error middleware for server-side handling
- Renders error page on unhandled exceptions

### Router (`src/router.tsx`)
- Creates TanStack Router instance
- Integrates React Query as context
- Enables scroll restoration
- Default preload stale time: 0

### Environment Configuration
- **Client-side:** `src/lib/env.ts` - Only VITE_-prefixed variables
- **Server-side:** `src/lib/config.server.ts` - Server-only config, read per-request

---

## Summary

This is a well-structured, modern web application built with TanStack Start framework. It serves as the web presence for FEA Angels, a Brazilian angel investment network. The codebase demonstrates best practices in:

- TypeScript throughout
- Component-based architecture with shadcn/ui
- File-based routing with TanStack Router
- Server-side API routes for AI integration
- Environment-based configuration
- Responsive design with Tailwind CSS
- Proper error handling and error boundaries

The application is frontend-complete but awaiting backend implementation for form submissions and user authentication. The AI chat feature is fully functional with multiple model support through OpenRouter.
