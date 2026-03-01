# Frontend-Backend Integration Debugging Guide

## Step 1: Test Backend Health

### 1a. Check if Backend is Running
Open your backend URL in a browser:
```
https://your-backend-url.onrender.com/health
```

**Expected Response:**
```json
{
  "status": "Backend is running ✓",
  "timestamp": "2026-03-01T10:30:45.123Z"
}
```

**If you get:**
- ❌ 502/503 error → Backend is crashed or not running
  - **Fix**: Go to Render dashboard, check logs, and manually redeploy
- ❌ Connection timeout → Backend URL is wrong
  - **Fix**: Double-check your Render URL in Vercel environment variables
- ✅ JSON response → Backend is working!

---

## Step 2: Check Frontend Environment Variable

### 2a. Verify VITE_API_BASE_URL in Vercel

1. Go to **Vercel Dashboard** → Your project → **Settings** → **Environment Variables**
2. Look for `VITE_API_BASE_URL`
3. **Verify it contains:**
   - Your full Render backend URL (e.g., `https://interview-bot-backend-anin.onrender.com`)
   - NO trailing slash at the end
   - Starts with `https://`
4. Redeploy after making changes

### 2b. Check Frontend Console

1. Visit your Vercel frontend URL
2. Open **DevTools** (F12 on Windows)
3. Go to **Console** tab
4. Look for any error messages
5. Take a screenshot of errors

---

## Step 3: Test API Endpoints

### 3a. Test OpenAI Endpoint
In browser console, run:
```javascript
fetch('https://your-backend-url.onrender.com/api/openai-proxy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'hello' }],
    model: 'gpt-4o-mini',
    stream: false
  })
})
.then(r => r.json())
.then(d => console.log('Success:', d))
.catch(e => console.error('Error:', e))
```

**Expected:**
- ✅ Response with AI message (if API key is valid)
- ❌ 401 error → OpenAI API key is invalid/expired on Render
- ❌ Network error → Backend not reachable

### 3b. Check Network Tab
1. In DevTools, go to **Network** tab
2. Try clicking the chatbot button
3. Look for requests to your backend URL
4. Check the response status and data

---

## Step 4: Common Issues & Fixes

### Issue: "Cannot reach backend" or Network Error

**Causes:**
1. Frontend environment variable is not set
2. Backend URL is incorrect
3. CORS is blocked

**Fixes:**
```bash
# 1. Verify in Vercel
- Go to Settings → Environment Variables
- Ensure VITE_API_BASE_URL is set with full URL
- Redeploy frontend

# 2. Check backend URL
- Visit https://your-backend-url.onrender.com/health
- Should return JSON, not error

# 3. Check CORS headers
- Open DevTools → Network tab
- Look for response headers
- Should see: Access-Control-Allow-Origin: *
```

---

### Issue: Backend Returns 401 (Unauthorized)

**Cause:** OpenAI API key is invalid on Render

**Fix:**
1. Get new API key from OpenAI
2. Go to **Render Dashboard** → Your backend service → **Environment**
3. Update `OPENAI_API_KEY` with new key
4. Click **Save**
5. Go to **Deployments** → Click latest → **Redeploy**

---

### Issue: Frontend Page Loads but Shows "Connection Error"

**Cause:** API call is failing

**Fix:**
1. Open DevTools → Console
2. Check for error messages
3. Follow "Test API Endpoints" section above
4. Look at the actual error returned from backend

---

## Step 5: Full Integration Test

Once both services are communicating, test the flow:

1. ✓ Visit frontend URL
2. ✓ Page loads without console errors
3. ✓ Backend health check returns 200
4. ✓ API endpoint tests return data (or expected errors)
5. ✓ Click chatbot and see response

---

## Step 6: Redeploy if Needed

### Redeploy Frontend (Vercel)
1. Go to **Vercel Dashboard**
2. Select your project
3. Click **Deployments**
4. Find the latest deployment
5. Click **...** (three dots) → **Redeploy**

### Redeploy Backend (Render)
1. Go to **Render Dashboard**
2. Select your backend service
3. Click **Deployments**
4. Click **Deploy Latest Commit**

---

## Useful URLs to Check

| Endpoint | Purpose |
|----------|---------|
| `https://your-backend.onrender.com/health` | Test if backend is running |
| `https://your-backend.onrender.com/api/openai-proxy` | Test OpenAI endpoint |
| `https://your-frontend.vercel.app` | Frontend URL |

---

## Need More Help?

Check these logs:
1. **Render Backend Logs**: Dashboard → Your service → **Logs** tab
2. **Vercel Build Logs**: Dashboard → Deployments → Click deployment → **View Deployment Details**
3. **Browser Console**: DevTools (F12) → Console tab
4. **Network Requests**: DevTools → Network tab (record and make requests)
