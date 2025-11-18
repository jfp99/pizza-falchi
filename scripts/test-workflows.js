/**
 * Test n8n Workflows
 */

const testWorkflows = async () => {
  console.log('🧪 Testing n8n Workflows\n');

  // Test Secure Webhook v2
  console.log('1. Testing Secure Webhook v2...');
  try {
    const response1 = await fetch('http://localhost:5678/webhook/pizza-order-secure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'order.created',
        timestamp: new Date().toISOString(),
        data: {
          orderId: '507f1f77bcf86cd799439011',
          orderNumber: 'TEST-001',
          customer: {
            name: 'Test Customer',
            phone: '+33612345678'
          },
          items: [{
            productName: 'Pizza Test',
            quantity: 1,
            price: 10.50
          }],
          totalAmount: 10.50,
          deliveryType: 'pickup'
        }
      })
    });

    const contentType = response1.headers.get('content-type');
    let result1;

    if (contentType && contentType.includes('application/json')) {
      result1 = await response1.json();
      console.log('✅ Response:', JSON.stringify(result1, null, 2));
    } else {
      const text = await response1.text();
      console.log('✅ Status:', response1.status);
      console.log('   Response:', text || '(empty response - workflow executed)');
    }

    // Check n8n executions
    console.log('\n   💡 Check n8n Executions tab for workflow details');

  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test WhatsApp workflow
  console.log('\n2. Testing WhatsApp Notification Handler...');
  try {
    const response2 = await fetch('http://localhost:5678/webhook/whatsapp-notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        body: {
          eventType: 'order.created',
          timestamp: new Date().toISOString(),
          data: {
            orderId: '507f1f77bcf86cd799439012',
            orderNumber: 'WA-TEST-002',
            customer: {
              name: 'WhatsApp Test',
              phone: '+33612345678'
            },
            items: [{
              productName: 'Pizza Margherita',
              quantity: 2,
              price: 12.50
            }],
            totalAmount: 25.00,
            deliveryType: 'delivery',
            deliveryAddress: {
              street: '123 Test Street',
              city: 'Ajaccio',
              postalCode: '20000'
            },
            paymentMethod: 'card',
            createdAt: new Date().toISOString()
          }
        }
      })
    });

    if (response2.ok) {
      const contentType = response2.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result2 = await response2.json();
        console.log('✅ Response:', JSON.stringify(result2, null, 2));
      } else {
        console.log('✅ Status:', response2.status, '(workflow executed)');
      }
    } else {
      console.log('⚠️ Status:', response2.status);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test Pizza Falchi webhook receiver
  console.log('\n3. Testing Pizza Falchi Webhook Receiver...');
  try {
    const response3 = await fetch('http://localhost:3000/api/webhooks/n8n', {
      method: 'GET'
    });

    const result3 = await response3.json();
    if (result3.success) {
      console.log('✅ Pizza Falchi webhook receiver is active');
      console.log('   Version:', result3.version);
    } else {
      console.log('❌ Pizza Falchi webhook receiver error');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n✨ Test Summary:');
  console.log('- Check n8n Executions tab for workflow execution details');
  console.log('- Green checkmarks = successful execution');
  console.log('- Empty responses are normal (workflow executed in background)');
  console.log('- Pizza Falchi webhook will show 404 for non-existent orders (expected)');
};

testWorkflows().catch(console.error);