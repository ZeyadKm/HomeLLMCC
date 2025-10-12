// API Integration Module for HomeLLM
// Handles communication with Claude API for email generation and document analysis

// Use proxy in development to avoid CORS issues
const ANTHROPIC_API_URL = import.meta.env.DEV
  ? '/api/anthropic/v1/messages'  // Proxy in development
  : 'https://api.anthropic.com/v1/messages';  // Direct in production
const ANTHROPIC_VERSION = '2023-06-01';
const MODEL = 'claude-sonnet-4-5-20250929'; // Claude Sonnet 4.5 - Latest model

// Validate API key format
export function validateApiKey(apiKey) {
  if (!apiKey || apiKey.trim() === '') {
    return { valid: false, error: 'API key is required' };
  }

  if (!apiKey.startsWith('sk-ant-')) {
    return { valid: false, error: 'Invalid API key format. Must start with "sk-ant-"' };
  }

  return { valid: true, error: null };
}

// Generate email using Claude API
export async function generateEmail(apiKey, systemPrompt, userPrompt, images = []) {
  console.log('[API] generateEmail called');
  console.log('[API] Images/docs count:', images?.length || 0);

  const validation = validateApiKey(apiKey);
  if (!validation.valid) {
    console.error('[API] API key validation failed:', validation.error);
    throw new Error(validation.error);
  }

  // Build message content with text, images, and PDFs
  const content = [];

  // Add documents (images or PDFs) first if any
  if (images && images.length > 0) {
    images.forEach((doc, index) => {
      console.log(`[API] Processing document ${index + 1}:`, {
        type: doc.type,
        size: doc.size,
        hasData: !!doc.data,
        dataPrefix: doc.data?.substring(0, 50)
      });

      // Extract base64 data from data URL
      const base64Data = doc.data.split(',')[1];
      const mediaType = doc.type || 'image/jpeg';

      console.log(`[API] Base64 data length:`, base64Data?.length);
      console.log(`[API] Media type:`, mediaType);

      // Check if it's a PDF or image
      if (mediaType === 'application/pdf') {
        console.log('[API] Adding as PDF document');
        content.push({
          type: 'document',
          source: {
            type: 'base64',
            media_type: 'application/pdf',
            data: base64Data
          }
        });
      } else {
        console.log('[API] Adding as image');
        content.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: mediaType,
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

  console.log('[API] Content array length:', content.length);

  const requestBody = {
    model: MODEL,
    max_tokens: 4096,
    temperature: 1,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: content
      }
    ]
  };

  console.log('[API] Request body prepared, model:', MODEL);
  console.log('[API] System prompt length:', systemPrompt?.length);
  console.log('[API] User prompt length:', userPrompt?.length);

  try {
    console.log('[API] Sending request to:', ANTHROPIC_API_URL);

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('[API] Response status:', response.status);
    console.log('[API] Response ok:', response.ok);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      console.error('[API] Error response:', JSON.stringify(errorData, null, 2));

      if (response.status === 401) {
        throw new Error(`Invalid API key: ${errorData.error?.message || 'Please check your Anthropic API key'}`);
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      } else if (response.status === 400) {
        throw new Error(`Bad request: ${errorData.error?.message || 'Invalid request parameters'}`);
      } else {
        throw new Error(`API error (${response.status}): ${errorData.error?.message || 'Unknown error'}`);
      }
    }

    const data = await response.json();

    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error('Unexpected API response format');
    }

    return {
      success: true,
      email: data.content[0].text,
      usage: {
        inputTokens: data.usage?.input_tokens || 0,
        outputTokens: data.usage?.output_tokens || 0
      }
    };
  } catch (error) {
    console.error('API Error:', error);

    if (error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }

    throw error;
  }
}

// Analyze document using Claude API
export async function analyzeDocument(apiKey, systemPrompt, documentPrompt, documentImages = []) {
  // Use same function as generateEmail since the API call is identical
  return generateEmail(apiKey, systemPrompt, documentPrompt, documentImages);
}

// Extract text from PDF (client-side using pdf.js or similar)
export async function extractTextFromPDF(file) {
  // This would require pdf.js library
  // For now, return a placeholder that instructs user to use text extraction
  throw new Error('PDF text extraction requires pdf.js library. Please convert PDF to text or use image upload.');
}

// Process image for OCR if needed (using Claude's vision capabilities)
export async function analyzeImageDocument(apiKey, image, documentType) {
  const systemPrompt = `You are an expert document analyzer. Extract all text and data from this image of a ${documentType} document. Format the output as structured text that preserves all important information including numbers, dates, measurements, and regulatory references.`;

  const userPrompt = `Please extract all text and data from this ${documentType} image. Include:
- All measurements and test results
- All dates and reference numbers
- All regulatory standards mentioned
- All company/agency information
- Any notes, warnings, or disclaimers

Format the output clearly with headings and preserve the document structure.`;

  try {
    const result = await generateEmail(apiKey, systemPrompt, userPrompt, [image]);
    return {
      success: true,
      extractedText: result.email
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Lookup building codes and regulations (using Claude's knowledge)
export async function lookupBuildingCodes(apiKey, city, state, issueType) {
  const systemPrompt = `You are an expert in building codes, housing regulations, and environmental health standards. You have comprehensive knowledge of federal, state, and local regulations.`;

  const userPrompt = `What are the specific building codes, health codes, and regulations that apply to ${issueType} issues in ${city}, ${state}?

Provide:
1. Relevant sections of the International Building Code (IBC) or International Residential Code (IRC)
2. State-specific regulations for ${state}
3. Known local ordinances for ${city} (if any)
4. Applicable EPA, HUD, or OSHA standards
5. Enforcement agencies and contact information

Format with specific code sections and citations where possible.`;

  try {
    const result = await generateEmail(apiKey, systemPrompt, userPrompt, []);
    return {
      success: true,
      codes: result.email
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Check if issue requires immediate emergency response
export function assessUrgency(issueType, measurements, healthImpact) {
  const emergencyKeywords = [
    'carbon monoxide', 'gas leak', 'structural collapse', 'immediate danger',
    'severe poisoning', 'unconscious', 'hospital', 'emergency room',
    'acute exposure', 'life-threatening'
  ];

  const highUrgencyThresholds = {
    'carbon-monoxide': { level: 70, unit: 'ppm', message: 'CO levels above 70 ppm are immediately dangerous' },
    'radon': { level: 10, unit: 'pCi/L', message: 'Radon levels above 10 pCi/L require immediate action' },
    'lead': { level: 5000, unit: 'μg/dL', message: 'Lead levels in blood above 5 μg/dL in children require immediate intervention' }
  };

  const combinedText = `${issueType} ${measurements} ${healthImpact}`.toLowerCase();

  // Check for emergency keywords
  for (const keyword of emergencyKeywords) {
    if (combinedText.includes(keyword)) {
      return {
        emergency: true,
        message: 'This appears to be an emergency situation. Consider calling 911 or local emergency services immediately.',
        recommendedLevel: 'emergency'
      };
    }
  }

  // Check for high urgency thresholds
  if (highUrgencyThresholds[issueType]) {
    const threshold = highUrgencyThresholds[issueType];
    // Simple numeric extraction - in production, use more sophisticated parsing
    const numbers = measurements.match(/\d+\.?\d*/g);
    if (numbers && parseFloat(numbers[0]) > threshold.level) {
      return {
        emergency: false,
        highUrgency: true,
        message: threshold.message,
        recommendedLevel: 'high'
      };
    }
  }

  return {
    emergency: false,
    highUrgency: false,
    message: null,
    recommendedLevel: null
  };
}

// Format email for different output formats
export function formatEmailOutput(email, format = 'text') {
  switch (format) {
    case 'html':
      return email
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>');

    case 'text':
    default:
      return email;
  }
}

// Save email draft to local storage
export function saveEmailDraft(draftId, email, formData) {
  const draft = {
    id: draftId,
    email: email,
    formData: formData,
    savedAt: new Date().toISOString()
  };

  try {
    const drafts = JSON.parse(localStorage.getItem('homellm_drafts') || '[]');
    const existingIndex = drafts.findIndex(d => d.id === draftId);

    if (existingIndex >= 0) {
      drafts[existingIndex] = draft;
    } else {
      drafts.push(draft);
    }

    localStorage.setItem('homellm_drafts', JSON.stringify(drafts));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Load email drafts from local storage
export function loadEmailDrafts() {
  try {
    const drafts = JSON.parse(localStorage.getItem('homellm_drafts') || '[]');
    return drafts.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
  } catch (error) {
    console.error('Error loading drafts:', error);
    return [];
  }
}

// Delete email draft
export function deleteEmailDraft(draftId) {
  try {
    const drafts = JSON.parse(localStorage.getItem('homellm_drafts') || '[]');
    const filtered = drafts.filter(d => d.id !== draftId);
    localStorage.setItem('homellm_drafts', JSON.stringify(filtered));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Export email to different formats
export function exportEmail(email, format, filename) {
  let content, mimeType;

  switch (format) {
    case 'txt':
      content = email;
      mimeType = 'text/plain';
      break;
    case 'html':
      content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Email Draft</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    p { margin-bottom: 1em; }
  </style>
</head>
<body>
${formatEmailOutput(email, 'html')}
</body>
</html>`;
      mimeType = 'text/html';
      break;
    case 'pdf':
      // PDF generation would require a library like jsPDF
      throw new Error('PDF export requires additional library. Please copy to clipboard and use external tool.');
    default:
      throw new Error('Unsupported export format');
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Copy to clipboard with fallback
export async function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true };
    } catch (error) {
      console.error('Clipboard API failed:', error);
    }
  }

  // Fallback for older browsers
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.select();

  try {
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return { success: true };
  } catch (error) {
    document.body.removeChild(textArea);
    return { success: false, error: 'Failed to copy to clipboard' };
  }
}

// Generate mailto link
export function generateMailtoLink(email, subject, body) {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  const to = encodeURIComponent(email);

  return `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
}

export default {
  validateApiKey,
  generateEmail,
  analyzeDocument,
  analyzeImageDocument,
  lookupBuildingCodes,
  assessUrgency,
  formatEmailOutput,
  saveEmailDraft,
  loadEmailDrafts,
  deleteEmailDraft,
  exportEmail,
  copyToClipboard,
  generateMailtoLink
};
