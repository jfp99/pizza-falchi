/**
 * Quick Webhook Test for n8n Integration
 */

const testWebhooks = async () => {
  console.log('🧪 Quick n8n Webhook Test\n');

  // Test webhook endpoints
  const endpoints = [
    {
      name: 'Secure Webhook',
      url: 'http://localhost:5678/webhook/pizza-order-secure',
      data: {
        eventType: 'order.created',
        timestamp: new Date().toISOString(),
        data: {
          orderId: 'test-123',
          orderNumber: 'TEST-001',
          customer: {
            name: 'Test User',
            phone: '+33612345678'
          },
          totalAmount: 10.00
        }
      }
    },
    {
      name: 'WhatsApp Handler',
      url: 'http://localhost:5678/webhook/whatsapp-notify',
      data: {
        body: {
          eventType: 'order.created',
          data: {
            orderId: 'test-456',
            orderNumber: 'WA-TEST-001',
            customer: { name: 'Test', phone: '+33612345678' },
            items: [{ productName: 'Pizza Test', quantity: 1, price: 10 }],
            totalAmount: 10,
            deliveryType: 'pickup',
            createdAt: new Date().toISOString()
          }
        }
      }
    }
  ];

  for (const endpoint of endpoints) {
    console.log(`Testing ${endpoint.name}...`);
    console.log(`URL: ${endpoint.url}`);

    try {
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(endpoint.data)
      });

      if (response.status === 404) {
        console.log(`❌ Not found - Workflow not imported or not active\n`);
      } else if (response.ok) {
        const data = await response.json();
        console.log(`✅ Success! Response:`, JSON.stringify(data, null, 2), '\n');
      } else {
        console.log(`⚠️  Status: ${response.status}`);
        const text = await response.text();
        console.log(`Response:`, text, '\n');
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}\n`);
    }
  }

  console.log('Test complete!');
  console.log('\nIf webhooks show "Not found", please:');
  console.log('1. Import the workflows in n8n');
  console.log('2. SAVE each workflow (Ctrl+S)');
  console.log('3. Toggle to Active status');
  console.log('4. Run this test again');
};

testWebhooks().catch(console.error);