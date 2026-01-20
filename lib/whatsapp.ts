import twilio from 'twilio';

// Initialize Twilio client (only if credentials are provided)
const getTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    console.warn('⚠️  Twilio credentials not configured - WhatsApp messages will not be sent');
    return null;
  }

  return twilio(accountSid, authToken);
};

// WhatsApp notification helper
export const sendWhatsAppNotification = async (orderDetails: {
  orderId: string;
  customerName: string;
  phone: string;
  total: number;
  items: Array<{ name: string; quantity: number; price: number }>;
  deliveryType: string;
  deliveryAddress?: {
    street: string;
    city: string;
    postalCode: string;
  };
  paymentMethod: string;
}) => {
  // Your WhatsApp number (restaurant owner) in international format
  const restaurantWhatsApp = process.env.RESTAURANT_WHATSAPP_NUMBER || '+33601289283';

  // Format order items
  const itemsList = orderDetails.items
    .map((item) => `• ${item.quantity}x ${item.name} (${(item.price * item.quantity).toFixed(2)}€)`)
    .join('\n');

  // Format delivery address
  const addressText = orderDetails.deliveryType === 'delivery' && orderDetails.deliveryAddress
    ? `📍 Adresse: ${orderDetails.deliveryAddress.street}, ${orderDetails.deliveryAddress.postalCode} ${orderDetails.deliveryAddress.city}`
    : orderDetails.deliveryType === 'pickup'
    ? '🏪 À emporter'
    : '🍽️ Sur place';

  // Create WhatsApp message
  const message = `🍕 *NOUVELLE COMMANDE* 🍕

📦 Commande #${orderDetails.orderId}

👤 Client: ${orderDetails.customerName}
📞 Tél: ${orderDetails.phone}

🛒 Articles:
${itemsList}

${addressText}

💳 Paiement: ${orderDetails.paymentMethod === 'cash' ? 'Espèces' : orderDetails.paymentMethod === 'card' ? 'Carte' : 'En ligne'}

💰 *Total: ${orderDetails.total.toFixed(2)}€*

---
Via Pizza Falchi App`;

  // Try to send via Twilio WhatsApp API
  const client = getTwilioClient();

  if (client && process.env.TWILIO_WHATSAPP_FROM) {
    try {
      const twilioMessage = await client.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM, // Format: 'whatsapp:+14155238886'
        to: `whatsapp:${restaurantWhatsApp}`,
        body: message,
      });

      console.log('✅ WhatsApp message sent via Twilio:', twilioMessage.sid);

      // Also return fallback URL
      const encodedMessage = encodeURIComponent(message);
      return `https://api.whatsapp.com/send?phone=${restaurantWhatsApp.replace('+', '')}&text=${encodedMessage}`;
    } catch (error) {
      console.error('❌ Twilio WhatsApp error:', error);
      // Fall through to return URL
    }
  }

  // Fallback: Return WhatsApp web URL (manual click required)
  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = restaurantWhatsApp.replace('+', '');
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

  console.log('ℹ️  WhatsApp URL generated (Twilio not configured):', whatsappUrl);
  return whatsappUrl;
};

// Send order ready notification to customer
export const sendOrderReadyNotification = async (orderDetails: {
  orderId: string;
  customerName: string;
  customerPhone: string;
  deliveryType: string;
}) => {
  const client = getTwilioClient();

  if (!client || !process.env.TWILIO_WHATSAPP_FROM) {
    console.warn('⚠️  Twilio not configured - Cannot send order ready notification');
    return { success: false, error: 'Twilio not configured' };
  }

  // Format customer phone number for WhatsApp
  const formattedPhone = formatPhoneForWhatsApp(orderDetails.customerPhone);

  // Create message based on delivery type
  const pickupMessage = `🍕 *COMMANDE PRÊTE* 🍕

Bonjour ${orderDetails.customerName},

Votre commande #${orderDetails.orderId} est prête !

🏪 *À emporter*
Vous pouvez venir la récupérer dès maintenant.

📍 Pizza Falchi
📞 04 42 92 03 08

Merci de votre commande ! 😊`;

  const deliveryMessage = `🍕 *COMMANDE PRÊTE* 🍕

Bonjour ${orderDetails.customerName},

Votre commande #${orderDetails.orderId} est prête !

🚗 *En livraison*
Votre commande est en route et arrivera dans quelques minutes.

Merci de votre commande ! 😊`;

  const message = orderDetails.deliveryType === 'pickup' ? pickupMessage : deliveryMessage;

  try {
    const twilioMessage = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:+${formattedPhone}`,
      body: message,
    });

    console.log('✅ Order ready notification sent via WhatsApp:', twilioMessage.sid);
    return { success: true, messageSid: twilioMessage.sid };
  } catch (error) {
    console.error('❌ Twilio WhatsApp error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown WhatsApp error' };
  }
};

// Helper to format phone number for WhatsApp
export const formatPhoneForWhatsApp = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // If starts with 0, replace with 33 (France)
  if (cleaned.startsWith('0')) {
    return '33' + cleaned.substring(1);
  }

  return cleaned;
};
