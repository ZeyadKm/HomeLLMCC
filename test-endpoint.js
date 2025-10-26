// Simple diagnostic script to test the analyze-document endpoint
import fetch from 'node-fetch';
import fs from 'fs';

async function testEndpoint() {
  console.log('🧪 Testing /api/analyze-document endpoint...\n');

  // Test 1: Check if endpoint responds
  console.log('Test 1: Checking endpoint availability...');
  try {
    const response = await fetch('http://localhost:3000/api/analyze-document', {
      method: 'GET'
    });
    console.log('✓ Endpoint is accessible');
    console.log('  Status:', response.status);
    const text = await response.text();
    console.log('  Response:', text.substring(0, 100));
  } catch (error) {
    console.log('✗ Cannot reach endpoint:', error.message);
    console.log('\n💡 Make sure server is running: node server.js\n');
    process.exit(1);
  }

  // Test 2: Check with minimal payload
  console.log('\nTest 2: Testing with minimal payload...');
  try {
    const response = await fetch('http://localhost:3000/api/analyze-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        apiKey: 'test-key',
        systemPrompt: 'Test system prompt',
        userPrompt: 'Test user prompt',
        documents: []
      })
    });

    console.log('  Status:', response.status);
    const result = await response.json();
    console.log('  Response:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.log('✗ Error:', error.message);
  }

  // Test 3: Check with mock image
  console.log('\nTest 3: Testing with mock base64 image...');
  try {
    // Tiny 1x1 red pixel PNG
    const mockImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

    const response = await fetch('http://localhost:3000/api/analyze-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        apiKey: 'sk-ant-test123', // Fake key for testing
        systemPrompt: 'You are a test analyst.',
        userPrompt: 'Analyze this test image.',
        documents: [{
          type: 'image/png',
          data: mockImage
        }]
      })
    });

    console.log('  Status:', response.status);
    const result = await response.json();
    console.log('  Response type:', typeof result);
    console.log('  Has error:', !!result.error);
    if (result.error) {
      console.log('  Error message:', result.error);
    }
    if (result.success) {
      console.log('  Success!');
    }
  } catch (error) {
    console.log('✗ Error:', error.message);
  }

  console.log('\n✅ Diagnostic tests complete\n');
}

testEndpoint();
