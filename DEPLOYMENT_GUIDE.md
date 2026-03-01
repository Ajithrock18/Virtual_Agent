# Deployment Guide: Frontend (Vercel) + Backend (Render)

## Prerequisites
- GitHub account with your code pushed (fork the repo if needed)
- Render account (render.com)
- Vercel account (vercel.com)

---

## **PART 1: BACKEND DEPLOYMENT ON RENDER**

### Step 1: Create Render Account & New Web Service
1. Go to [render.com](https://render.com) and sign up
2. Click **"New +"** → **"Web Service"**
3. Select **"Deploy an existing repository"** or **"Public Git repository"**
4. Connect your GitHub account and select the Virtual_Agent repository

### Step 2: Configure Render Web Service
Fill in the following:
- **Name**: `interview-bot-backend`
- **Environment**: Node
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd .. && node backend/server.js`
  - OR just `node server.js` (if deploying backend folder only)
- **Plan**: Free (or paid for better performance)

### Step 3: Add Environment Variables
In the Render dashboard, go to **Environment** and add:
```
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
ELEVENLABS_API_KEY=sk_YOUR_KEY_HERE
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
ANAM_API_KEY=YOUR_ANAM_KEY_HERE
ANAM_AVATAR_ID=30fa96d0-26c4-4e55-94a0-517025942e18
ANAM_VOICE_ID=6bfbe25a-979d-40f3-a92b-5394170af54b
ANAM_LLM_ID=0934d97d-0c3a-4f33-91b0-5e136a0ef466
PORT=8001
```

### Step 4: Deploy
- Click **"Create Web Service"**
- Render will automatically deploy
- Wait for the URL (e.g., `https://interview-bot-backend.onrender.com`)
- **Save this URL** - you'll need it for the frontend

---

## **PART 2: FRONTEND DEPLOYMENT ON VERCEL**

### Step 1: Create Vercel Account & New Project
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository (Virtual_Agent)

### Step 2: Configure Vercel Project
- **Project Name**: `interview-bot-frontend`
- **Root Directory**: `./frontend` (important!)
- **Framework**: Vite (auto-detected)
- **Build Command**: `npm run build` (default should work)
- **Output Directory**: `dist` (default)

### Step 3: Add Environment Variables
In Vercel dashboard, go to **Settings** → **Environment Variables** and add:
```
VITE_API_BASE_URL=https://interview-bot-backend.onrender.com
```
(Replace with your actual Render backend URL)

### Step 4: Deploy
- Click **"Deploy"**
- Vercel will build and deploy automatically
- You'll get a URL like `https://interview-bot-frontend.vercel.app`

---

## **PART 3: UPDATE FRONTEND CONFIG**

### Update config.js to use Environment Variable

Edit [frontend/src/config.js](frontend/src/config.js):
```javascript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001";
```

This will automatically use the Render backend URL in production.

---

## **PART 4: UPDATE VITE CONFIG** (Optional but Recommended)

Edit [frontend/vite.config.ts](frontend/vite.config.ts):
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

---

## **TESTING YOUR DEPLOYMENT**

1. **Visit your Vercel URL**: `https://interview-bot-frontend.vercel.app`
2. **Check browser console** (F12) for any API errors
3. **Test the chatbot** - it should connect to your Render backend
4. **Check Render logs** if there are issues

---

## **TROUBLESHOOTING**

### "Connection Error" on Frontend
- Check that `VITE_API_BASE_URL` is set correctly in Vercel
- Ensure the Render backend is running (check Render dashboard)
- Backend URL should be like `https://interview-bot-backend.onrender.com`

### Frontend Doesn't Load
- Check Vercel build logs (Settings → Deployments)
- Ensure "Root Directory" is set to `./frontend`

### Backend Returns 401 for OpenAI
- Verify `OPENAI_API_KEY` is set in Render environment
- The key may be invalid - generate a new one from OpenAI dashboard

### Render Service Spins Down
- Free tier services spin down after 15 minutes of inactivity
- Upgrade to "Starter" plan for persistent running services

---

## **QUICK REFERENCE: URLS YOU'LL NEED**

After deployment, you'll have:
- **Frontend**: `https://your-frontend-name.vercel.app`
- **Backend**: `https://your-backend-name.onrender.com`
- **Backend API**: `https://your-backend-name.onrender.com/api/openai-proxy`

---

## **NEXT STEPS**

1. Fork the repository to your GitHub account
2. Push your latest changes to your fork
3. Follow the Render deployment steps above
4. Follow the Vercel deployment steps above
5. Share your Vercel frontend URL!
