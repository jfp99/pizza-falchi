#!/usr/bin/env node
/**
 * Test Script for n8n Webhook Integration
 * Usage: node scripts/test-webhook.js
 */

const crypto = require('crypto');
const https = require('https');

// Configuration
const CONFIG = {
  pizzaFalchiUrl: process.env.PIZZA_URL || 'http://localhost:3000',
  n8nUrl: process.env.N8N_URL || 'http://localhost:5678',
  webhookSecret: process.env.N8N_WEBHOOK_SECRET || 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4',
};

// Test data
const TEST_ORDER = {
  customerName: 'Test Customer',
  phone: '+33612345678',
  email: 'test@example.com',
  deliveryType: 'delivery',
  deliveryAddress: {
    street: '123 Test Street',
    city: 'Ajaccio',
    postalCode: '20000',
    instructions: 'Ring the bell twice'
  },
  items: [
    {
      product: '507f1f77bcf86cd799439011', // Replace with actual product ID
      quantity: 2,
      price: 12.50,
      customizations: {
        size: 'large',
        notes: 'Extra cheese'
      },
      total: 25.00
    }
  ],
  subtotal: 25.00,
  tax: 2.50,
  deliveryFee: 3.00,
  total: 30.50,
  paymentMethod: 'card',
  notes: 'Test order - please ignore'
};

// Helper functions
function generateSignature(payload, secret, timestamp) {
  const signedContent = `${timestamp}.${typeof payload === 'string' ? payload : JSON.stringify(payload)}`;
  return crypto
    .createHmac('sha256', secret)
    .update(signedContent)
    .digest('hex');
}

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const http = isHttps ? https : require('http');

    const req = http.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = {
            status: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : null
          };
          resolve(result);
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data
          });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }

    req.end();
  });
}

// Test functions
async function testWebhookEndpointHealth() {
  console.log('🔍 Testing webhook endpoint health...');

  try {
    const response = await makeRequest(`${CONFIG.pizzaFalchiUrl}/api/webhooks/n8n`);

    if (response.status === 200 && response.body?.success) {
      console.log('✅ Webhook endpoint is healthy');
      console.log('   Version:', response.body.version);
      console.log('   Timestamp:', response.body.timestamp);
      return true;
    } else {
      console.log('❌ Webhook endpoint health check failed');
      console.log('   Status:', response.status);
      console.log('   Response:', response.body);
      return false;
    }
  } catch (error) {
    console.log('❌ Failed to reach webhook endpoint:', error.message);
    return false;
  }
}

async function testWebhookSignatureVerification() {
  console.log('\n🔐 Testing webhook signature verification...');

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const payload = {
    action: 'update_order_status',
    orderId: 'test-order-id',
    data: {
      status: 'confirmed',
      statusReason: 'Test confirmation'
    }
  };

  const signature = generateSignature(payload, CONFIG.webhookSecret, timestamp);

  try {
    const response = await makeRequest(`${CONFIG.pizzaFalchiUrl}/api/webhooks/n8n`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Timestamp': timestamp,
      },
      body: payload
    });

    if (response.status === 404) {
      console.log('⚠️  Order not found (expected for test order ID)');
      return true;
    } else if (response.status === 401) {
      console.log('❌ Signature verification failed');
      console.log('   Response:', response.body);
      return false;
    } else if (response.status === 200) {
      console.log('✅ Signature verification passed');
      return true;
    } else {
      console.log('❌ Unexpected response:', response.status);
      console.log('   Body:', response.body);
      return false;
    }
  } catch (error) {
    console.log('❌ Failed to test signature:', error.message);
    return false;
  }
}

async function testOrderCreationWebhook() {
  console.log('\n📦 Testing order creation webhook...');
  console.log('   Note: This will create a real order in the database');

  try {
    const response = await makeRequest(`${CONFIG.pizzaFalchiUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: TEST_ORDER
    });

    if (response.status === 201) {
      console.log('✅ Order created successfully');
      console.log('   Order ID:', response.body._id);
      console.log('   Order Number:', response.body.orderId);
      console.log('   Webhook events should have been triggered');
      return response.body._id;
    } else {
      console.log('❌ Failed to create order');
      console.log('   Status:', response.status);
      console.log('   Response:', response.body);
      return null;
    }
  } catch (error) {
    console.log('❌ Failed to create order:', error.message);
    return null;
  }
}

async function testOrderStatusUpdateWebhook(orderId) {
  console.log('\n🔄 Testing order status update webhook...');

  if (!orderId) {
    console.log('⚠️  No order ID provided, skipping status update test');
    return false;
  }

  try {
    const response = await makeRequest(`${CONFIG.pizzaFalchiUrl}/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        status: 'confirmed'
      }
    });

    if (response.status === 200) {
      console.log('✅ Order status updated successfully');
      console.log('   New status:', response.body.status);
      console.log('   Status change webhook should have been triggered');
      return true;
    } else {
      console.log('❌ Failed to update order status');
      console.log('   Status:', response.status);
      console.log('   Response:', response.body);
      return false;
    }
  } catch (error) {
    console.log('❌ Failed to update order:', error.message);
    return false;
  }
}

async function testN8nConnectivity() {
  console.log('\n🔗 Testing n8n connectivity...');

  try {
    const response = await makeRequest(`${CONFIG.n8nUrl}/healthz`);

    if (response.status === 200) {
      console.log('✅ n8n is reachable');
      return true;
    } else {
      console.log('⚠️  n8n returned status:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Cannot reach n8n:', error.message);
    console.log('   Make sure n8n is running on', CONFIG.n8nUrl);
    return false;
  }
}

async function simulateN8nWebhookToApp() {
  console.log('\n🔄 Simulating n8n webhook to Pizza Falchi...');

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const payload = {
    action: 'send_notification',
    orderId: '507f1f77bcf86cd799439011',
    data: {
      notificationType: 'order_confirmation',
      channel: 'whatsapp',
      message: 'Your order has been confirmed!'
    }
  };

  const signature = generateSignature(payload, CONFIG.webhookSecret, timestamp);

  try {
    const response = await makeRequest(`${CONFIG.pizzaFalchiUrl}/api/webhooks/n8n`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Timestamp': timestamp,
        'X-Webhook-Event': 'notification.sent'
      },
      body: payload
    });

    console.log('   Response status:', response.status);
    console.log('   Response body:', response.body);

    return response.status === 200 || response.status === 404; // 404 is ok for non-existent order
  } catch (error) {
    console.log('❌ Failed to simulate webhook:', error.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('========================================');
  console.log('🧪 Pizza Falchi n8n Integration Test');
  console.log('========================================');
  console.log('Configuration:');
  console.log('  Pizza Falchi URL:', CONFIG.pizzaFalchiUrl);
  console.log('  n8n URL:', CONFIG.n8nUrl);
  console.log('========================================\n');

  const results = {
    webhookHealth: false,
    signatureVerification: false,
    n8nConnectivity: false,
    orderCreation: false,
    statusUpdate: false,
    n8nSimulation: false,
  };

  // Run tests
  results.webhookHealth = await testWebhookEndpointHealth();
  results.signatureVerification = await testWebhookSignatureVerification();
  results.n8nConnectivity = await testN8nConnectivity();

  // Optional: Create real order (comment out if not needed)
  // const orderId = await testOrderCreationWebhook();
  // if (orderId) {
  //   results.orderCreation = true;
  //   results.statusUpdate = await testOrderStatusUpdateWebhook(orderId);
  // }

  results.n8nSimulation = await simulateN8nWebhookToApp();

  // Summary
  console.log('\n========================================');
  console.log('📊 Test Results Summary');
  console.log('========================================');
  console.log('✓ Webhook Health:', results.webhookHealth ? '✅ Passed' : '❌ Failed');
  console.log('✓ Signature Verification:', results.signatureVerification ? '✅ Passed' : '❌ Failed');
  console.log('✓ n8n Connectivity:', results.n8nConnectivity ? '✅ Passed' : '❌ Failed');
  console.log('✓ Order Creation:', results.orderCreation ? '✅ Passed' : '⏭️  Skipped');
  console.log('✓ Status Update:', results.statusUpdate ? '✅ Passed' : '⏭️  Skipped');
  console.log('✓ n8n Webhook Simulation:', results.n8nSimulation ? '✅ Passed' : '❌ Failed');
  console.log('========================================');

  const passedTests = Object.values(results).filter(r => r).length;
  const totalTests = Object.keys(results).length;

  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed!');
  } else {
    console.log(`\n⚠️  ${passedTests}/${totalTests} tests passed`);
    console.log('Check the errors above for details.');
  }

  // Exit with appropriate code
  process.exit(passedTests === totalTests ? 0 : 1);
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});