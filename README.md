# Stuck Overflow | Stack Overflow Clone

A modern, full-stack Stack Overflow clone built with Next.js 15, featuring AI-powered answer generation, real-time interactions, and a beautiful dark mode interface.

**Live** : [https://koalla.ucokman.web.id](https://koalla.ucokman.web.id)

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL
- Uploadthing
- OpenAI Api Keys
- Bun

### 1. Clone & Install

```bash
git clone <repo-url>
cd stuck-overflow
bun install
```

### 2. Get OpenAi Api Keys

1. Visit [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Get <OPENAI_API_KEY> by creating new one.

### 3. Setup Clerk Authentication

1. **Login to Clerk**  
   Visit [https://dashboard.clerk.com/sign-in](https://dashboard.clerk.com/sign-in)

2. **Create a new application**  
   Navigate to **Application → Dashboard** and create a new application

3. **Configure sign-in options**  
   Enable **Email** and **Google** as sign-in methods

4. **Get your API keys**  
   Go to **Configure → Developers → API Keys** and copy:
   - `CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

### 4. Setup Uploadthing Storage

1. **Login to Uploadthing**
   Visit [https://uploadthing.com/sign-in](https://uploadthing.com/sign-in)

2. **Create a new application**
   Navigate to **Dashboard** and create a new application

3. **Get your Uploadthing Token**  
   Go to **API Keys** and copy:
   - `UPLOADTHING_TOKEN`

### 5. Configure Environment Variables

```bash
cp .env.example .env
# fill in all the credentials you collected
```

### 6. Setup Database

```bash
bunx prisma migrate dev
```

### 7. Run Development Server

Start the application:

```bash
bun run dev
```

**Your app is now running!** 🎊  
Visit [http://localhost:3000](http://localhost:3000) to see it in action.
