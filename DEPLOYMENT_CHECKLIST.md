# Deployment Checklist

## Before You Deploy - Complete These Steps

### 1. GitHub Setup
- [ ] Create a GitHub account (if you don't have one)
- [ ] Fork the Virtual_Agent repository OR push to your own repo
- [ ] Make sure all changes are committed and pushed

### 2. Account Creation
- [ ] Create Render account: https://render.com
- [ ] Create Vercel account: https://vercel.com
- [ ] Connect both to your GitHub account

### 3. Get Your API Keys Ready
- [ ] OpenAI API Key (from https://platform.openai.com/account/api-keys)
- [ ] ElevenLabs API Key (if using TTS)
- [ ] Anam API Key (if using Anam Avatar)
- [ ] All keys should be stored securely

---

## Deployment Steps

### Phase 1: Deploy Backend to Render

1. **Create Render Web Service**
   - [ ] Go to render.com → New Web Service
   - [ ] Select your GitHub repository
   - [ ] Name: `interview-bot-backend`

2. **Configure Build & Start Commands**
   - [ ] Build Command: `cd backend && npm install` OR `npm install` (if deploying backend folder)
   - [ ] Start Command: `node server.js`

3. **Add Environment Variables in Render Dashboard**
   - [ ] OPENAI_API_KEY
   - [ ] ELEVENLABS_API_KEY
   - [ ] ELEVENLABS_VOICE_ID
   - [ ] ANAM_API_KEY
   - [ ] ANAM_AVATAR_ID
   - [ ] ANAM_VOICE_ID
   - [ ] ANAM_LLM_ID

4. **Deploy & Note the URL**
   - [ ] Click "Create Web Service"
   - [ ] Wait for deployment (5-10 minutes)
   - [ ] Copy the URL (e.g., https://interview-bot-backend.onrender.com)
   - [ ] ⭐ **SAVE THIS URL** - You need it for Vercel!

---

### Phase 2: Deploy Frontend to Vercel

1. **Create Vercel Project**
   - [ ] Go to vercel.com → Import Project
   - [ ] Select your GitHub repository
   - [ ] Project Name: `interview-bot-frontend`

2. **Configure Build Settings**
   - [ ] Root Directory: `./frontend` ⚠️ **IMPORTANT**
   - [ ] Framework: Vite (auto-detected)
   - [ ] Build Command: `npm run build` (default)
   - [ ] Output Directory: `dist` (default)

3. **Add Environment Variables**
   - [ ] VITE_API_BASE_URL = `https://your-backend-url.onrender.com`
   - [ ] (Use the Render URL you saved from Phase 1)

4. **Deploy**
   - [ ] Click "Deploy"
   - [ ] Wait for deployment (3-5 minutes)
   - [ ] Get your Vercel URL (e.g., https://interview-bot-frontend.vercel.app)

---

### Phase 3: Test Your Deployment

1. **Test Frontend**
   - [ ] Visit your Vercel URL
   - [ ] Check that page loads correctly
   - [ ] Open DevTools (F12) → Console for errors

2. **Test Backend Connection**
   - [ ] Try using the chatbot feature
   - [ ] Check browser console for API errors
   - [ ] If you see OpenAI 401 error, verify API key in Render

3. **Verify API Calls**
   - [ ] Open DevTools → Network tab
   - [ ] Make a request
   - [ ] Check that requests go to `onrender.com` URL (not localhost)

---

## Troubleshooting

### Issue: "Connection Refused" or "Can't reach backend"
- Verify `VITE_API_BASE_URL` is set in Vercel environment variables
- Check that Render backend is deployed and running
- Clear browser cache (Ctrl+Shift+Delete)

### Issue: Frontend loads but shows errors
- Check browser console (F12) for specific error messages
- Check Vercel deployment logs
- Ensure Root Directory is set to `./frontend` in Vercel

### Issue: OpenAI 401 Error
- Verify API key is correct in Render environment variables
- Try generating a new API key from OpenAI dashboard
- Check that key isn't expired or usage limit exceeded

### Issue: Render keeps spinning down
- Free tier services sleep after 15 minutes of inactivity
- Upgrade to Starter plan ($7/mo) to keep running 24/7
- OR keep frontend active to prevent backend hibernation

---

## After Deployment

- [ ] Share your Vercel URL with others
- [ ] Monitor Render/Vercel logs for errors
- [ ] Set up error tracking (optional: Sentry, LogRocket)
- [ ] Monitor OpenAI API usage on your account

---

## Support & Documentation

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Vite Docs**: https://vitejs.dev/
- **Express Docs**: https://expressjs.com/
