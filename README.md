# ProbasiBangali.in

> Helping Bengali people feel at home anywhere in Tamil Nadu 🇮🇳

A full-stack community platform for Bengali-speaking people living in, studying in, or visiting Tamil Nadu. Built with Next.js 16, Tailwind CSS v4, and Supabase.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env.local
# Edit .env.local with your API keys (see below)

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔑 Environment Setup

| Variable | Where to Get | Cost |
|----------|-------------|------|
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) | **FREE** (14,400 req/day) |
| `NEXT_PUBLIC_SUPABASE_URL` | [supabase.com](https://supabase.com) | **FREE** tier |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Settings → API | **FREE** tier |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | [Google Cloud Console](https://console.cloud.google.com) | **FREE** (28K loads/mo) |

## 📦 Modules

### 1. 🏠 Home Page (`/`)
Hero banner, quick access tiles, emergency strip, community section, CTA

### 2. 🔍 Explore
- **Stay** (`/explore/stay`) — Bengali-friendly PGs, hotels, rental houses
- **Food** (`/explore/food`) — Bengali restaurants, sweet shops, tiffin, delivery
- **Travel** (`/explore/travel`) — Bus, metro, train routes + Tamil word helper

### 3. 👥 Community
- **Groups** (`/community/groups`) — WhatsApp, Telegram, Facebook communities
- **Matrimonial** (`/community/matrimonial`) — Full registration → verification → matching flow
- **Events** (`/community/events`) — Durga Puja, festivals, cultural events

### 4. 🚨 Emergency
- **Hospitals** (`/emergency/hospitals`) — Bengali doctor filter, 24/7 status, call buttons
- **Ambulance/SOS** (`/emergency/ambulance`) — One-tap 112, 108, 100, 101 calling
- **Blood Help** (`/emergency/blood`) — Search by blood group + city

### 5. 🎓 Services
- **College Finder** (`/services/college`) — Engineering, medical, arts colleges
- **Government** (`/services/government`) — Aadhaar, ration card, passport portals

### 6. 📝 Blog (`/blog`)
Community-driven articles, recipes, and guides

## 🤖 AI Chatbot
- **Primary:** Groq API (LLaMA 3.3 70B) — FREE tier
- **Fallback:** Intelligent demo responses covering all modules
- **Languages:** Bengali (বাংলা), Tamil (தமிழ்), English

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2 (App Router + Turbopack) |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Animation | Framer Motion |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| AI | Groq API (LLaMA 3.3 70B) |
| Fonts | DM Sans, Playfair Display, Hind Siliguri |
| Language | TypeScript |

## 📁 Project Structure

```
src/
├── app/
│   ├── api/chat/          # AI chatbot API (Groq)
│   ├── auth/              # Login & Register
│   ├── blog/              # Blog listing & posts
│   ├── community/         # Groups, Matrimonial, Events
│   ├── emergency/         # Hospitals, Ambulance, Blood
│   ├── explore/           # Stay, Food, Travel
│   ├── profile/           # User profile
│   └── services/          # College, Government
├── components/
│   ├── chatbot/           # AI chat widget
│   ├── layout/            # Navbar, Footer
│   └── ui/                # Button, Card, Badge, Input
├── data/                  # Sample data
├── lib/                   # Utils, constants, Supabase client
└── types/                 # TypeScript interfaces
```

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#D85A30` (warm terracotta) |
| Accent | `#1D9E75` (emerald green) |
| Surface | `#F8F7F4` (warm off-white) |
| Display Font | Playfair Display |
| Body Font | DM Sans |
| Bengali Font | Hind Siliguri |

## 📄 License

Built with ❤️ for the Bengali community in Tamil Nadu.
