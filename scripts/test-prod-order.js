// Test both local and production
const PROD_URL = process.argv[2] === 'local' ? 'http://localhost:3000' : 'https://pizza-falchi.vercel.app';
console.log('Testing URL:', PROD_URL);

async function testOrderCreation() {
  console.log('Testing order creation on production...\n');

  // Step 1: Get CSRF token
  console.log('1. Getting CSRF token...');
  const csrfResponse = await fetch(`${PROD_URL}/api/csrf`);
  const csrfData = await csrfResponse.json();
  const csrfToken = csrfData.token;
  console.log('   CSRF Token obtained:', csrfToken.substring(0, 20) + '...');

  // Step 2: Get a product
  console.log('\n2. Fetching products...');
  const productsResponse = await fetch(`${PROD_URL}/api/products`);
  const products = await productsResponse.json();
  const pizza = products.find(p => p.category === 'pizza' && p.available);
  console.log('   Found pizza:', pizza.name, '- €' + pizza.price);

  // Step 3: Create order
  console.log('\n3. Creating order...');
  const orderData = {
    customerName: 'Test Production',
    email: 'test@production.fr',
    phone: '0612345678',
    deliveryType: 'pickup',
    paymentMethod: 'cash',
    items: [
      {
        product: pizza._id,
        quantity: 1,
        price: pizza.price,
        name: pizza.name
      }
    ],
    total: pizza.price,
    subtotal: pizza.price,
    tax: 0,
    acceptedTerms: true
  };

  const orderResponse = await fetch(`${PROD_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-csrf-token': csrfToken
    },
    body: JSON.stringify(orderData)
  });

  console.log('   Response status:', orderResponse.status);
  console.log('   Response headers:', Object.fromEntries(orderResponse.headers));

  const responseText = await orderResponse.text();
  console.log('   Response body (raw):', responseText.substring(0, 500));

  let orderResult;
  try {
    orderResult = JSON.parse(responseText);
  } catch (e) {
    console.log('   Failed to parse JSON:', e.message);
    return;
  }

  if (orderResponse.ok) {
    console.log('\n✅ ORDER CREATED SUCCESSFULLY!');
    console.log('   Order ID:', orderResult._id);
    console.log('   Order Number:', orderResult.orderId);
    console.log('   Customer:', orderResult.customerName);
    console.log('   Total: €' + orderResult.total);
    console.log('   Status:', orderResult.status);
    console.log('\n   WhatsApp URL:', orderResult.whatsappNotificationUrl ? 'Generated' : 'Not generated');
  } else {
    console.log('\n❌ ORDER FAILED!');
    console.log('   Status:', orderResponse.status);
    console.log('   Error:', JSON.stringify(orderResult, null, 2));
  }
}

testOrderCreation().catch(console.error);
