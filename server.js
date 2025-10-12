// Simple Express server to simulate Vercel serverless functions locally
import express from 'express';
import cors from 'cors';
import analyzeDocument from './api/analyze-document.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for PDFs

// Simulate Vercel serverless function routing
app.all('/api/analyze-document', async (req, res) => {
  console.log('\n[Server] Request received:', req.method, req.path);

  // Create mock Vercel request/response objects
  const mockReq = {
    method: req.method,
    body: req.body,
    headers: req.headers,
    query: req.query
  };

  const mockRes = {
    _status: 200,
    _headers: {},
    _body: null,

    status: function(code) {
      this._status = code;
      return this;
    },

    setHeader: function(key, value) {
      this._headers[key] = value;
      return this;
    },

    json: function(data) {
      this._body = data;
      res.status(this._status);
      Object.keys(this._headers).forEach(key => {
        res.setHeader(key, this._headers[key]);
      });
      res.json(data);
    },

    end: function() {
      res.end();
    }
  };

  try {
    await analyzeDocument(mockReq, mockRes);
  } catch (error) {
    console.error('[Server] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📡 Serverless function available at: http://localhost:${PORT}/api/analyze-document\n`);
});
