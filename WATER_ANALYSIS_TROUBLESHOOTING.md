# Water Analysis Troubleshooting Guide

## Common Issues and Solutions

### Issue: "Water analysis is not working"

This can have several causes. Follow these steps to diagnose:

### 1. Check API Key

**Symptom**: Error message about API key or authentication

**Solution**:
- Ensure you've entered a valid Anthropic API key
- API key should start with `sk-ant-`
- Check the header for a green "Connected" badge
- If you see a red error, click "Change API Key" and re-enter

### 2. Development Environment Setup

**If testing locally with `npm run dev`:**

You need TWO terminals running:

**Terminal 1 - API Server:**
```bash
node server.js
```
This should show:
```
🚀 API Server running on http://localhost:3000
📡 Serverless function available at: http://localhost:3000/api/analyze-document
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```
This should show:
```
  ➜  Local:   http://localhost:5173/
```

**Important**: If you only run `npm run dev` without the server, water analysis will fail with a network error.

### 3. Check Browser Console

Open browser DevTools (F12) → Console tab

**Look for these log messages when you click "Analyze Water Quality":**

✅ **Success pattern:**
```
[Water Analysis] Starting analysis...
[Water Analysis] Document type: image/png (or application/pdf)
[Water Analysis] Document size: 123456
[Water Analysis] Calling API endpoint...
[Water Analysis] API response received
[Water Analysis] Success: true
[Water Analysis] Analysis successful
```

❌ **Error patterns and solutions:**

**Pattern 1: Network error**
```
[Water Analysis] Error: Network error
```
**Solution**: Make sure `node server.js` is running (for local dev)

**Pattern 2: API key error**
```
[Water Analysis] Error: Invalid API key
```
**Solution**: Check your API key in the header

**Pattern 3: File size error**
```
File too large. Maximum size: 32MB
```
**Solution**: Reduce file size or use a smaller image

### 4. Production (Vercel) Deployment

**If deployed to Vercel:**

- The Express server (`server.js`) is NOT used
- Vercel automatically routes `/api/analyze-document` to the serverless function
- Check Vercel logs for errors
- Ensure environment variables are NOT set (API key comes from user input)

### 5. File Upload Issues

**Supported formats:**
- Images: JPG, PNG, GIF, etc. (max 5MB)
- PDFs: (max 32MB)

**If upload fails:**
- Check file size
- Try a different format
- Try a screenshot instead of the original PDF

### 6. Testing with a Sample File

Create a test image with text:
1. Take a screenshot of any water quality report online
2. Save as PNG
3. Upload and analyze

### 7. Step-by-Step Test

1. **Open the app**: Navigate to Water Analysis tab
2. **Check for API key warning**: You should see a yellow warning if no API key is set
3. **Upload a file**: Click "Choose File" and select an image or PDF
4. **Check success message**: Should see green "File Ready for Analysis" box
5. **Click analyze**: Button should show loading spinner
6. **Wait for results**: Should see analysis within 10-30 seconds

### 8. Common Error Messages

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "API Key Required" | No API key entered | Enter API key in header |
| "Invalid API key" | Wrong API key format | Check key starts with `sk-ant-` |
| "Network error: Could not connect" | Local server not running | Run `node server.js` |
| "Authentication failed" | Invalid API key | Get new key from console.anthropic.com |
| "Rate limit exceeded" | Too many requests | Wait a minute and try again |
| "File too large" | File exceeds size limit | Compress image or split PDF |

### 9. Developer Debugging

**Add this to browser console for detailed logs:**
```javascript
localStorage.setItem('debug', 'true');
```

**Check request/response:**
```javascript
// Open Network tab in DevTools
// Filter by: analyze-document
// Check request payload and response
```

### 10. Still Not Working?

**Collect this information:**
1. Browser console logs (full output)
2. Network tab screenshot showing the failed request
3. Error message shown in the UI
4. File type and size being uploaded
5. Environment (local dev or Vercel)

**Quick health check:**
```bash
# Test if server is running (local dev only)
curl http://localhost:3000/api/analyze-document

# Should return:
# {"error":"Method not allowed"}  <- This is good! Server is running.
```

## Expected Behavior

### Successful Flow:
1. Upload file → Green success box appears
2. Click "Analyze" → Button shows spinner and "Analyzing Report..."
3. Wait 10-30 seconds
4. Results appear in beautiful colored cards
5. Can export, print, or use in email

### If it hangs:
- Check console for errors
- Ensure API key is valid
- For PDFs over 10MB, expect 30-60 second analysis time
- Don't click analyze multiple times (wait for first request to complete)

## Quick Fix Checklist

- [ ] API key entered and shows green "Connected" badge
- [ ] `node server.js` running (local dev only)
- [ ] File uploaded successfully (green box appears)
- [ ] File size under limit (5MB for images, 32MB for PDFs)
- [ ] Browser console shows no red errors
- [ ] Internet connection working
- [ ] Tried different browser or cleared cache

---

**Still having issues?** The console logs are your best friend! Share them when asking for help.
