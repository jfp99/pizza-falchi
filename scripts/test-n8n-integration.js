/**
 * Comprehensive n8n Integration Test Script
 * Tests the complete webhook flow between Pizza Falchi and n8n
 */

const crypto = require('crypto');
const readline = require('readline');

// Configuration
const CONFIG = {
  pizzaFalchi: {
    baseUrl: 'http://localhost:3000',
    webhookEndpoint: '/api/webhooks/n8n'
  },
  n8n: {
    baseUrl: 'http://localhost:5678',
    webhooks: {
      secure: '/webhook/pizza-order-secure',
      whatsapp: '/webhook/whatsapp-notify'
    }
  },
  webhookSecret: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4'
};

// Utility functions
function generateSignature(payload, secret, timestamp) {
  const signedContent = `${timestamp}.${payload}`;
  return crypto.createHmac('sha256', secret)
    .update(signedContent)
    .digest('hex');
}

function formatJSON(obj) {
  return JSON.stringify(obj, null, 2);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  console.log(`📋 ${title}`);
  console.log('='.repeat(60));
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

function logError(message) {
  console.log(`❌ ${message}`);
}

function logInfo(message) {
  console.log(`ℹ️  ${message}`);
}

function logWarning(message) {
  console.log(`⚠️  ${message}`);
}

// Test functions
async function testN8nWebhookEndpoint() {
  logSection('Testing n8n Webhook Endpoints');

  const endpoints = [
    { name: 'Secure Webhook', url: `${CONFIG.n8n.baseUrl}${CONFIG.n8n.webhooks.secure}` },
    { name: 'WhatsApp Handler', url: `${CONFIG.n8n.baseUrl}${CONFIG.n8n.webhooks.whatsapp}` }
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url, { method: 'GET' });
      if (response.status === 404) {
        logWarning(`${endpoint.name}: Workflow not imported or not active`);
      } else if (response.status === 405) {
        logSuccess(`${endpoint.name}: Webhook endpoint exists (GET not allowed)`);
      } else {
        logInfo(`${endpoint.name}: Status ${response.status}`);
      }
    } catch (error) {
      logError(`${endpoint.name}: Cannot reach n8n at ${endpoint.url}`);
      logInfo('Make sure n8n is running at http://localhost:5678');
    }
  }
}

async function testPizzaFalchiWebhookReceiver() {
  logSection('Testing Pizza Falchi Webhook Receiver');

  const url = `${CONFIG.pizzaFalchi.baseUrl}${CONFIG.pizzaFalchi.webhookEndpoint}`;

  try {
    const response = await fetch(url, { method: 'GET' });
    const data = await response.json();

    if (data.success && data.message.includes('n8n webhook endpoint is active')) {
      logSuccess('Pizza Falchi webhook receiver is active');
      logInfo(`Version: ${data.version}`);
    } else {
      logWarning('Unexpected response from webhook receiver');
    }
  } catch (error) {
    logError(`Cannot reach Pizza Falchi at ${url}`);
    logInfo('Make sure Pizza Falchi is running at http://localhost:3000');
  }
}

async function simulateOrderCreatedEvent() {
  logSection('Simulating Order Created Event to n8n');

  const orderId = '507f1f77bcf86cd799439011';
  const orderNumber = `ORD-${Date.now()}`;
  const timestamp = new Date().toISOString();

  const payload = {
    eventType: 'order.created',
    timestamp: timestamp,
    data: {
      orderId: orderId,
      orderNumber: orderNumber,
      customer: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '+33612345678'
      },
      items: [
        {
          productId: '1',
          productName: 'Pizza Margherita',
          quantity: 1,
          price: 12.50,
          totalPrice: 12.50
        }
      ],
      totalAmount: 15.00,
      subtotal: 12.50,
      tax: 0,
      deliveryFee: 2.50,
      deliveryType: 'delivery',
      deliveryAddress: {
        street: '123 Rue de la République',
        city: 'Ajaccio',
        postalCode: '20000',
        country: 'France'
      },
      paymentMethod: 'card',
      notes: 'Test order from integration script'
    }
  };

  const url = `${CONFIG.n8n.baseUrl}${CONFIG.n8n.webhooks.secure}`;

  logInfo('Sending order.created event to n8n...');
  logInfo(`Order Number: ${orderNumber}`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json();

    if (response.ok) {
      logSuccess('n8n workflow triggered successfully');
      console.log('Response:', formatJSON(responseData));
      return { orderId, orderNumber };
    } else {
      logError(`n8n workflow error: ${response.status}`);
      console.log('Response:', formatJSON(responseData));
      return null;
    }
  } catch (error) {
    logError(`Failed to trigger n8n workflow: ${error.message}`);
    return null;
  }
}

async function testSecureWebhookCallback() {
  logSection('Testing Secure Webhook Callback from n8n');

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const payload = {
    action: 'update_order_status',
    orderId: '507f1f77bcf86cd799439011',
    data: {
      status: 'confirmed',
      statusReason: 'Test confirmation from integration script'
    },
    metadata: {
      timestamp: new Date().toISOString(),
      source: 'n8n-test',
      workflowId: 'test-workflow'
    }
  };

  const payloadString = JSON.stringify(payload);
  const signature = generateSignature(payloadString, CONFIG.webhookSecret, timestamp);

  const url = `${CONFIG.pizzaFalchi.baseUrl}${CONFIG.pizzaFalchi.webhookEndpoint}`;

  logInfo('Sending secure webhook to Pizza Falchi...');
  logInfo(`Signature: ${signature.substring(0, 20)}...`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Timestamp': timestamp
      },
      body: payloadString
    });

    const responseData = await response.json();

    if (response.status === 404) {
      logWarning('Order not found (expected for test order ID)');
      logSuccess('Webhook signature verification passed!');
    } else if (response.ok) {
      logSuccess('Webhook processed successfully');
      console.log('Response:', formatJSON(responseData));
    } else {
      logError(`Webhook error: ${response.status}`);
      console.log('Response:', formatJSON(responseData));
    }
  } catch (error) {
    logError(`Failed to send webhook: ${error.message}`);
  }
}

async function testWhatsAppNotification() {
  logSection('Testing WhatsApp Notification Workflow');

  const payload = {
    eventType: 'order.created',
    timestamp: new Date().toISOString(),
    data: {
      orderId: '507f1f77bcf86cd799439012',
      orderNumber: `WA-${Date.now()}`,
      customer: {
        name: 'WhatsApp Test',
        phone: '+33612345678'
      },
      items: [
        {
          productName: 'Pizza 4 Fromages',
          quantity: 1,
          price: 14.50,
          customizations: 'Extra cheese'
        }
      ],
      totalAmount: 17.00,
      deliveryType: 'delivery',
      deliveryAddress: {
        street: '456 Avenue Napoléon',
        city: 'Ajaccio',
        postalCode: '20000'
      },
      paymentMethod: 'cash',
      createdAt: new Date().toISOString()
    }
  };

  const url = `${CONFIG.n8n.baseUrl}${CONFIG.n8n.webhooks.whatsapp}`;

  logInfo('Triggering WhatsApp notification workflow...');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ body: payload })
    });

    const responseData = await response.json();

    if (response.ok) {
      logSuccess('WhatsApp workflow triggered');
      logInfo('Note: Actual WhatsApp delivery depends on Twilio configuration');
      console.log('Response:', formatJSON(responseData));
    } else {
      logError(`WhatsApp workflow error: ${response.status}`);
      console.log('Response:', formatJSON(responseData));
    }
  } catch (error) {
    logError(`Failed to trigger WhatsApp workflow: ${error.message}`);
  }
}

async function checkIntegrationStatus() {
  logSection('Integration Status Summary');

  const checks = [];

  // Check Pizza Falchi
  try {
    const response = await fetch(`${CONFIG.pizzaFalchi.baseUrl}/api/webhooks/n8n`, { method: 'GET' });
    const data = await response.json();
    checks.push({
      name: 'Pizza Falchi API',
      status: data.success ? 'Active' : 'Error',
      ok: data.success
    });
  } catch {
    checks.push({ name: 'Pizza Falchi API', status: 'Offline', ok: false });
  }

  // Check n8n
  try {
    await fetch(CONFIG.n8n.baseUrl);
    checks.push({ name: 'n8n Platform', status: 'Active', ok: true });
  } catch {
    checks.push({ name: 'n8n Platform', status: 'Offline', ok: false });
  }

  // Display results
  console.log('\n' + '─'.repeat(40));
  checks.forEach(check => {
    const icon = check.ok ? '✅' : '❌';
    console.log(`${icon} ${check.name}: ${check.status}`);
  });
  console.log('─'.repeat(40));

  const allOk = checks.every(c => c.ok);
  if (allOk) {
    logSuccess('All systems operational!');
  } else {
    logWarning('Some systems need attention');
  }

  return allOk;
}

// Interactive menu
async function showMenu() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

  while (true) {
    console.log('\n' + '═'.repeat(60));
    console.log('🍕 Pizza Falchi n8n Integration Test Suite');
    console.log('═'.repeat(60));
    console.log('\n📋 Available Tests:\n');
    console.log('  1. Check Integration Status');
    console.log('  2. Test n8n Webhook Endpoints');
    console.log('  3. Test Pizza Falchi Webhook Receiver');
    console.log('  4. Simulate Order Created Event');
    console.log('  5. Test Secure Webhook Callback');
    console.log('  6. Test WhatsApp Notification');
    console.log('  7. Run All Tests');
    console.log('  0. Exit\n');

    const choice = await question('Select test (0-7): ');

    switch (choice) {
      case '1':
        await checkIntegrationStatus();
        break;
      case '2':
        await testN8nWebhookEndpoint();
        break;
      case '3':
        await testPizzaFalchiWebhookReceiver();
        break;
      case '4':
        await simulateOrderCreatedEvent();
        break;
      case '5':
        await testSecureWebhookCallback();
        break;
      case '6':
        await testWhatsAppNotification();
        break;
      case '7':
        await runAllTests();
        break;
      case '0':
        console.log('\n👋 Goodbye!\n');
        rl.close();
        process.exit(0);
      default:
        logError('Invalid choice. Please select 0-7.');
    }

    await question('\nPress Enter to continue...');
  }
}

async function runAllTests() {
  logSection('Running Complete Integration Test Suite');

  // Check status first
  const systemsOk = await checkIntegrationStatus();

  if (!systemsOk) {
    logWarning('Some systems are offline. Tests may fail.');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    const answer = await new Promise(resolve =>
      rl.question('Continue anyway? (y/n): ', resolve)
    );
    rl.close();

    if (answer.toLowerCase() !== 'y') {
      return;
    }
  }

  // Run all tests
  await testN8nWebhookEndpoint();
  await testPizzaFalchiWebhookReceiver();
  await simulateOrderCreatedEvent();
  await testSecureWebhookCallback();
  await testWhatsAppNotification();

  logSection('Test Suite Complete');
  logInfo('Check the logs above for detailed results');
}

// Main execution
async function main() {
  console.clear();
  console.log('🚀 Pizza Falchi n8n Integration Test Suite');
  console.log('─'.repeat(60));
  console.log('This script tests the complete webhook integration between');
  console.log('Pizza Falchi and n8n workflows.\n');
  console.log('Prerequisites:');
  console.log('  1. Pizza Falchi running on http://localhost:3000');
  console.log('  2. n8n running on http://localhost:5678');
  console.log('  3. Workflows imported and activated in n8n');
  console.log('─'.repeat(60));

  await showMenu();
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('\n❌ Unexpected error:', error);
  process.exit(1);
});

// Start
main().catch(console.error);