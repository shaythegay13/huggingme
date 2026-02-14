# 🤗 HuggingMe

**Share your positive energy with the world.**

HuggingMe is a social connection platform where verified users can browse nearby profiles, match based on energy compatibility, and send interaction offers — all in a safe, moderated environment.

🌐 **Live at:** [huggingme.lovable.app](https://huggingme.lovable.app)

---

## ✨ Features

| Feature | Description |
|---|---|
| **🔐 Authentication** | Email-based signup with verification, secure login/logout |
| **👤 Profile Management** | Create and edit your profile with photos, bio, energy state, availability, and more |
| **🔍 Browse & Filter** | Search public profiles by name or location; filter by availability, energy level, and verification status; sort by energy or name |
| **⚡ Energy Matching** | Users set an energy state (0–100) and the platform highlights compatible matches |
| **💌 Send Offers** | Spend credits to send interaction offers with custom messages, preferred times, and locations |
| **🤖 AI Matchmaker Chat** | An AI-powered assistant helps you find compatible connections |
| **📅 Schedule Settings** | Configure your availability preferences per day |
| **🛡️ Safety First** | Verified profiles, public/private visibility toggle, and community guidelines |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 18](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| **Build Tool** | [Vite](https://vitejs.dev) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) with custom design tokens (HSL) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com) primitives |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **State** | [Zustand](https://zustand-demo.pmnd.rs) (global) · [TanStack React Query](https://tanstack.com/query) (server) |
| **Routing** | [React Router v6](https://reactrouter.com) |
| **Backend** | Lovable Cloud (PostgreSQL database, auth, file storage, serverless functions) |
| **Forms** | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) validation |

---

## 📁 Project Structure

```
src/
├── assets/          # Images & static media
├── components/      # Reusable UI components
│   └── ui/          # shadcn/ui primitives
├── data/            # Mock data for development
├── hooks/           # Custom React hooks (auth, mobile, toast)
├── integrations/    # Backend client & generated types
├── lib/             # Utility functions
├── pages/           # Route-level page components
│   ├── Index.tsx    # Landing page
│   ├── Browse.tsx   # Browse profiles
│   ├── Dashboard.tsx
│   ├── Profile.tsx
│   ├── EditProfile.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   └── NotFound.tsx
└── test/            # Test setup & specs
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) ≥ 18 (recommend installing via [nvm](https://github.com/nvm-sh/nvm))
- npm or bun

### Local Development

```sh
# 1. Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# 2. Install dependencies
npm install

# 3. Start the dev server (hot-reload enabled)
npm run dev
```

The app will be available at `http://localhost:5173`.

### Running Tests

```sh
npm run test
```

---

## 🗄 Database Schema

The backend uses three core tables:

- **profiles** — User profiles (name, bio, photos, energy state, location, verification, etc.)
- **offers** — Interaction offers between users (credits, message, preferred times, status)
- **schedule_settings** — Per-user availability/schedule preferences

All tables are protected with Row Level Security (RLS) policies to ensure users can only access their own data.

---

## 🌍 Deployment

This project is deployed via [Lovable](https://lovable.dev):

1. Open your Lovable project
2. Click **Share → Publish**

### Custom Domain

Navigate to **Project → Settings → Domains → Connect Domain**.  
📖 [Custom domain docs](https://docs.lovable.dev/features/custom-domain#custom-domain)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary. All rights reserved © 2026 HuggingMe.
