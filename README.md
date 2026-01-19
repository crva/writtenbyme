# WrittenByMe

🎉 **Full-Stack Article Writing Platform**

Simple web app to create, edit, and share articles with a modern UI and reliable backend.

## ❓ Why ?

I made this project to see where I can go alone, I wanted to make a SaaS from scratch in less than 2 weeks.

I learned several things:

- How payment processing works
  - [polar.sh](https://polar.sh/)
- Auth -> Sessions (I was used to JWTs before)
- Mailing
  - [Resend](https://resend.com/)
  - Magic links
- DNS ([namecheap](https://www.namecheap.com/))
  - Buy & configure a domain name

---

## 🚀 Quick Start

### Prerequisites

- Node.js 24+
- Docker & Docker Compose
- npm or yarn

### 1️⃣ Start Database

```bash
cd backend
docker-compose up -d
```

### 2️⃣ Setup Backend

```bash
cd backend
npm install
npm run db:push
npm run dev
```

### 3️⃣ Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4️⃣ Setup Payments (Optional - for testing Polar.sh)

To test payments locally, you need to expose your local backend to the internet so Polar.sh webhooks can reach it:

**Install ngrok:**

```bash
# Download from https://ngrok.com/download
# Or use brew on macOS
brew install ngrok
```

**Expose your backend:**

```bash
ngrok http 3001
```

You'll see output like:

```
Forwarding    https://abc123def456.ngrok.io -> http://localhost:3001
```

**Update environment variables:**

In `backend/.env`, update `POLAR_WEBHOOK_URL` with your ngrok URL:

```env
POLAR_WEBHOOK_URL=https://abc123def456.ngrok.io/api/payments/webhook
```

**Update Polar Dashboard:**

1. Go to [Polar Dashboard](https://dashboard.polar.sh)
2. Navigate to Settings → Webhooks
3. Update the webhook endpoint URL to your ngrok URL
4. Test the webhook connection

Now your local backend can receive webhooks from Polar during payment testing!

---
