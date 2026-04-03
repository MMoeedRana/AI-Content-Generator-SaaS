# AI Content Generator

A modern, full-stack AI-powered content generator for blogs and more.

## Features

- ✨ Generate blog titles and content using Google Gemini AI
- 🧩 Multiple content templates (e.g., blog title, blog content)
- 🔒 Authentication with Clerk
- 💳 Stripe integration for subscriptions and billing
- 📊 Usage tracking and user dashboard
- 🗂️ History and content management

## Tech Stack

- **Next.js** (App Router)
- **React** (with Context API)
- **Tailwind CSS** (UI styling)
- **Drizzle ORM** + NeonDB (database)
- **Google Gemini AI** (content generation)
- **Stripe** (payments)
- **Clerk** (authentication)

## Folder Structure

- `app/` — Main app, API routes, dashboard, templates, and pages
- `components/ui/` — Reusable UI components (Button, Input, Textarea, AlertDialog)
- `utils/` — AI integration, DB, and schema utilities

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Environment Variables

- `NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY`
- `NEXT_PUBLIC_DRIZZLE_DB_URL`
- Clerk keys as needed
