// Vercel Serverless Function for Document Analysis
// This runs on the server, avoiding CORS and size limits

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { apiKey, systemPrompt, userPrompt, documents } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: 'API key required' });
    }

    console.log('[Server] Analyzing document...');
    console.log('[Server] Documents count:', documents?.length || 0);
    console.log('[Server] System prompt length:', systemPrompt?.length);
    console.log('[Server] User prompt length:', userPrompt?.length);

    // Build content array
    const content = [];

    // Add documents (images or PDFs)
    if (documents && documents.length > 0) {
      documents.forEach((doc, index) => {
        console.log(`[Server] Processing document ${index + 1}:`, {
          type: doc.type,
          dataLength: doc.data?.length
        });

        // Extract base64 from data URL
        const base64Data = doc.data.split(',')[1];

        if (doc.type === 'application/pdf') {
          content.push({
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: base64Data
            }
          });
        } else {
          content.push({
            type: 'image',
            source: {
              type: 'base64',
              media_type: doc.type,
              data: base64Data
            }
          });
        }
      });
    }

    // Add text prompt
    content.push({
      type: 'text',
      text: userPrompt
    });

    // Call Anthropic API from server
    const requestBody = {
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      temperature: 1,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: content
      }]
    };

    console.log('[Server] Calling Anthropic API...');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('[Server] Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[Server] API error:', errorData);

      return res.status(response.status).json({
        error: errorData.error?.message || 'API request failed',
        details: errorData
      });
    }

    const data = await response.json();
    console.log('[Server] Success! Response received');

    return res.status(200).json({
      success: true,
      email: data.content[0].text,
      usage: {
        inputTokens: data.usage?.input_tokens || 0,
        outputTokens: data.usage?.output_tokens || 0
      }
    });

  } catch (error) {
    console.error('[Server] Exception:', error);
    return res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
}
