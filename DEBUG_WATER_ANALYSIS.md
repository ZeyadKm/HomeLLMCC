# Water Analysis Debug Guide

## Quick Diagnosis

Follow these steps IN ORDER to identify the issue:

### Step 1: Check the Browser Console

1. Open your browser
2. Press F12 to open Developer Tools
3. Click the "Console" tab
4. Go to Water Analysis tab
5. Upload a file
6. Click "Analyze Water Quality"

**Look for these log messages and share the EXACT output:**

```
[Water Analysis] Starting analysis...
[Water Analysis] Document type: ???
[Water Analysis] Document size: ???
[Water Analysis] Data URL length: ???
[API] generateEmail called
[API] Images/docs count: ???
[API] Processing document 1: ...
[API] Sending request to: /api/analyze-document
[API] Request body size: ??? bytes
[API] Response status: ???
[API] Response ok: ???
```

### Step 2: Check Network Tab

1. In Developer Tools, click "Network" tab
2. Clear it (trash icon)
3. Try the analysis again
4. Look for a request to "analyze-document"

**Click on it and check:**
- **Status**: Should be 200 (if working)
- **Request Headers**: Should show Content-Type: application/json
- **Request Payload**: Should show apiKey, systemPrompt, userPrompt, documents
- **Response**: Check what the server returned

### Step 3: Are You Running Locally or on Vercel?

#### If LOCALLY (localhost:5173):

**You MUST have TWO terminals running:**

Terminal 1:
```bash
node server.js
```
Should show:
```
🚀 API Server running on http://localhost:3000
📡 Serverless function available at: http://localhost:3000/api/analyze-document
```

Terminal 2:
```bash
npm run dev
```

**If you only have ONE terminal, that's your problem!**

Quick test - open a new terminal and run:
```bash
curl http://localhost:3000/api/analyze-document
```

Expected response:
```json
{"error":"Method not allowed"}
```

If you get "Connection refused", the server isn't running.

#### If on VERCEL:

The serverless function should work automatically. Check:
1. Vercel deployment logs
2. Function logs in Vercel dashboard
3. Check if the API route exists at your-domain.vercel.app/api/analyze-document

### Step 4: Test the API Endpoint Directly

Create a file called `test-api.html` and open it:

```html
<!DOCTYPE html>
<html>
<body>
    <h1>API Test</h1>
    <button onclick="test()">Test Endpoint</button>
    <pre id="result"></pre>

    <script>
        async function test() {
            const result = document.getElementById('result');
            result.textContent = 'Testing...';

            try {
                const response = await fetch('/api/analyze-document', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        apiKey: 'sk-ant-test',
                        systemPrompt: 'Test',
                        userPrompt: 'Test',
                        documents: []
                    })
                });

                const data = await response.json();
                result.textContent = JSON.stringify(data, null, 2);
            } catch (error) {
                result.textContent = 'ERROR: ' + error.message;
            }
        }
    </script>
</body>
</html>
```

## Common Issues and Exact Fixes

### Issue 1: "Network error. Please check your internet connection"

**Cause**: Cannot reach the API endpoint

**Fixes**:
1. **Local dev**: Make sure `node server.js` is running
2. **Vercel**: Check if deployment succeeded
3. Check browser console for the exact error
4. Try accessing /api/analyze-document directly

### Issue 2: "Analysis failed: No response received from API"

**Cause**: API returned but without expected data

**Check**: Browser console logs will show:
```
[API] Response data keys: [...]
[API] Success: undefined (or false)
[API] Has email: false
```

**Possible causes**:
- API key is invalid (returns error instead of success)
- Server returned HTML error page instead of JSON
- Serverless function crashed

**Fix**: Look at `[API] Response preview:` log to see what the server actually returned

### Issue 3: Browser shows "Failed to fetch" or CORS error

**Cause**: CORS or network issue

**For local dev**:
1. Server must be on port 3000
2. Frontend must be on port 5173
3. Check server.js has `app.use(cors())`

**For Vercel**:
- Check if domain is correct
- Verify deployment succeeded

### Issue 4: "Invalid JSON response from server"

**Cause**: Server returned HTML or plain text instead of JSON

**Check the log**:
```
[API] Raw response: <!DOCTYPE html>...
```

This usually means:
- Vercel returned an error page
- Server crashed and Express returned HTML error
- Wrong endpoint

**Fix**: Check what's at the endpoint:
```bash
curl https://your-domain.vercel.app/api/analyze-document
```

### Issue 5: API returns error from Anthropic

**Log will show**:
```
[API] Error response: {"error": "invalid_api_key"}
```

**Fixes**:
- Verify API key in header
- Check key starts with `sk-ant-`
- Try key directly at console.anthropic.com

### Issue 6: Request times out

**Symptoms**: Button stuck on "Analyzing..." forever

**Causes**:
- File too large (images >5MB, PDF >32MB)
- Network timeout
- Anthropic API is slow
- Server crashed

**Checks**:
1. Look at Network tab - is request still pending?
2. Check browser console for timeout errors
3. For local: Check server.js terminal for errors
4. For Vercel: Check function logs

## Exact Debugging Steps

Run through this checklist and note where it fails:

- [ ] File uploads successfully (green box appears)
- [ ] Click analyze button (button shows spinner)
- [ ] Browser console shows: `[Water Analysis] Starting analysis...`
- [ ] Browser console shows: `[API] Sending request to: /api/analyze-document`
- [ ] Network tab shows request to analyze-document
- [ ] Request shows status code (200, 400, 401, 500, etc.)
- [ ] Console shows: `[API] Response status: 200`
- [ ] Console shows: `[API] Response ok: true`
- [ ] Console shows: `[API] Success: true`
- [ ] Console shows: `[API] Has email: true`
- [ ] Results appear on screen

**Where did it fail? That's your issue!**

## Getting Help

If you're still stuck, provide:

1. **Full browser console logs** (copy everything)
2. **Network tab screenshot** showing the analyze-document request
3. **Environment**: Local dev or Vercel?
4. **If local**: Output from both terminal windows
5. **If Vercel**: Deployment URL and function logs
6. **Exact error message** shown in UI
7. **File type and size** you're trying to analyze

## Emergency Reset

If nothing works, try this:

```bash
# Stop everything
# Kill all node processes
# Clear browser cache (Ctrl+Shift+Delete)

# Reinstall
rm -rf node_modules package-lock.json
npm install

# Start fresh
# Terminal 1:
node server.js

# Terminal 2:
npm run dev

# Try again with a small test image (screenshot)
```

## Production Checklist (Vercel)

Before deploying:

- [ ] Run `npm run build` successfully
- [ ] No errors in build output
- [ ] api/analyze-document.js file exists
- [ ] vercel.json includes functions config
- [ ] Environment variables NOT set (user provides API key)
- [ ] Test locally first with `node server.js` + `npm run dev`

## The Nuclear Option

If NOTHING else works, add this to the start of handleAnalyzeWaterReport in HomeLLM.jsx:

```javascript
console.log('===== DEBUG INFO =====');
console.log('API Key exists:', !!apiKey);
console.log('API Key valid:', API.validateApiKey(apiKey));
console.log('Water report:', waterReport);
console.log('Endpoint:', '/api/analyze-document');
console.log('=====================');
```

Then share the output!
