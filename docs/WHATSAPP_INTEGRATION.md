# WhatsApp Integration Guide - Pizza Falchi

**Last Updated:** 19/11/2025

## Overview

Pizza Falchi uses **direct Twilio WhatsApp integration** for customer and restaurant notifications. This is a simple, reliable approach that sends WhatsApp messages directly through Twilio's API without any intermediate services.

## Architecture

```
Order Created/Updated → sendWhatsAppNotification() → Twilio API → WhatsApp
```

**Benefits:**
- ✅ Simple, straightforward architecture
- ✅ Fewer dependencies and points of failure
- ✅ Direct API access to Twilio
- ✅ Faster delivery (no intermediate hops)
- ✅ Easier to debug and maintain

## Configuration

### Environment Variables (.env.local)

```env
# Twilio WhatsApp Configuration
TWILIO_ACCOUNT_SID=AC3fb156d7b131bfac8fbab88f78ad5b14
TWILIO_AUTH_TOKEN=a67f0624b5ba2ebb69d3f25577e4e81a
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
RESTAURANT_WHATSAPP_NUMBER=+33601289283
WHATSAPP_TARGET_PHONE=+33601289283
```

### Twilio Sandbox Setup

For development/testing:

1. **Activate Twilio Sandbox:**
   - Send message to: `+1 415 523 8886` on WhatsApp
   - Message: `join <your-sandbox-keyword>`
   - You'll receive a confirmation

2. **Verify Setup:**
   - Your restaurant number (+33601289283) is now registered
   - Can receive WhatsApp messages from Twilio

## Implementation

### Location: `lib/whatsapp.ts`

#### Main Functions

**1. sendWhatsAppNotification()**
Sends order confirmation to restaurant owner.

```typescript
await sendWhatsAppNotification({
  orderId: 'ORD123',
  customerName: 'Jean Dupont',
  phone: '+33612345678',
  total: 34.50,
  items: [
    { name: 'Pizza Margherita', quantity: 2, price: 12.50 },
    { name: 'Coca-Cola', quantity: 2, price: 3.50 }
  ],
  deliveryType: 'delivery',
  deliveryAddress: {
    street: '123 Rue Example',
    city: 'Puyricard',
    postalCode: '13540'
  },
  paymentMethod: 'card'
});
```

**Message Format (French):**
```
🍕 *NOUVELLE COMMANDE* 🍕

📦 Commande #ORD123

👤 Client: Jean Dupont
📞 Tél: +33612345678

🛒 Articles:
• 2x Pizza Margherita (25.00€)
• 2x Coca-Cola (7.00€)

📍 Adresse: 123 Rue Example, 13540 Puyricard

💳 Paiement: Carte

💰 *Total: 34.50€*

---
Via Pizza Falchi App
```

**2. sendOrderReadyNotification()**
Sends order ready notification to customer.

```typescript
await sendOrderReadyNotification({
  orderId: 'ORD123',
  customerName: 'Jean Dupont',
  customerPhone: '+33612345678',
  deliveryType: 'pickup'
});
```

**Message Format (Pickup):**
```
🍕 *COMMANDE PRÊTE* 🍕

Bonjour Jean Dupont,

Votre commande #ORD123 est prête !

🏪 *À emporter*
Vous pouvez venir la récupérer dès maintenant.

📍 Pizza Falchi
📞 04 42 92 03 08

Merci de votre commande ! 😊
```

**Message Format (Delivery):**
```
🍕 *COMMANDE PRÊTE* 🍕

Bonjour Jean Dupont,

Votre commande #ORD123 est prête !

🚗 *En livraison*
Votre commande est en route et arrivera dans quelques minutes.

Merci de votre commande ! 😊
```

## Integration Points

### 1. Order Creation (app/api/orders/route.ts)

WhatsApp notification sent automatically when order is created:

```typescript
// Lines 198-224
const whatsappUrl = await sendWhatsAppNotification({
  orderId: populatedOrder._id.toString().slice(-6).toUpperCase(),
  customerName: populatedOrder.customerName,
  phone: populatedOrder.phone,
  total: populatedOrder.total,
  items: populatedOrder.items.map((item: any) => ({
    name: item.product?.name || 'Produit',
    quantity: item.quantity,
    price: item.price
  })),
  deliveryType: populatedOrder.deliveryType,
  deliveryAddress: populatedOrder.deliveryAddress,
  paymentMethod: populatedOrder.paymentMethod
});

// Returns whatsappNotificationUrl in response
return NextResponse.json({
  ...populatedOrder.toObject(),
  whatsappNotificationUrl: whatsappUrl
}, { status: 201 });
```

### 2. Order Ready Notification (app/api/orders/[id]/notify/route.ts)

Manual trigger for sending "order ready" notification to customer:

```typescript
// POST /api/orders/{id}/notify
const result = await sendOrderReadyNotification({
  orderId: order.orderId,
  customerName: order.customerName,
  customerPhone: order.phone,
  deliveryType: order.deliveryType,
});
```

## Behavior

### With Twilio Configured (Production)

1. **Twilio API Call:** Message sent directly via Twilio
2. **Immediate Delivery:** Customer/restaurant receives WhatsApp notification
3. **Fallback URL:** Also returns WhatsApp Web URL for manual sending if needed
4. **Console Log:** `✅ WhatsApp message sent via Twilio: {messageSid}`

### Without Twilio (Development Fallback)

1. **No API Call:** Twilio credentials not configured
2. **WhatsApp URL Generated:** Returns `https://api.whatsapp.com/send?phone=...&text=...`
3. **Manual Click:** User can click URL to send via WhatsApp Web
4. **Console Log:** `ℹ️ WhatsApp URL generated (Twilio not configured)`

## Testing

### Manual Test (Through UI)

1. Open app: http://localhost:3000
2. Add items to cart
3. Go through checkout
4. Place order
5. Check terminal logs for WhatsApp notification
6. Check WhatsApp on +33601289283 for message

### Programmatic Test

```bash
node scripts/test-direct-whatsapp.js
```

**Note:** This requires CSRF token, so it's recommended to test through the UI.

### Test API Endpoint Directly

Use the admin panel or Postman to trigger notifications:

```bash
# Get CSRF token first
curl http://localhost:3000/api/csrf

# Send order ready notification
curl -X POST http://localhost:3000/api/orders/{order-id}/notify \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: {token}"
```

## Monitoring

### Check Logs

Watch dev server logs for WhatsApp notifications:

```
✅ WhatsApp message sent via Twilio: SM1234567890abcdef
```

Or if Twilio not configured:

```
⚠️ Twilio credentials not configured - WhatsApp messages will not be sent
ℹ️ WhatsApp URL generated (Twilio not configured): https://api.whatsapp.com/send?...
```

### Verify in Twilio Dashboard

1. Go to https://console.twilio.com
2. Navigate to Monitor > Logs > Messaging
3. Check for recent WhatsApp messages
4. View delivery status and errors

## Error Handling

The system gracefully handles WhatsApp failures:

```typescript
try {
  const whatsappUrl = await sendWhatsAppNotification(...);
  return NextResponse.json({ ...order, whatsappNotificationUrl: whatsappUrl });
} catch (whatsappError) {
  console.error('WhatsApp notification error:', whatsappError);
  // Don't fail the order creation if WhatsApp fails
  return NextResponse.json(order, { status: 201 });
}
```

**Order creation never fails due to WhatsApp errors** - notifications are fire-and-forget.

## Production Considerations

### 1. Upgrade from Sandbox (Required for Production)

Twilio Sandbox is only for testing. For production:

1. **Buy WhatsApp Business Number:**
   - Go to Twilio Console > Phone Numbers
   - Purchase a WhatsApp-enabled number

2. **WhatsApp Business Approval:**
   - Submit your business for approval
   - Verify your Facebook Business Manager
   - Wait for approval (1-2 weeks)

3. **Update Environment Variables:**
   ```env
   TWILIO_WHATSAPP_FROM=whatsapp:+your-production-number
   ```

### 2. Message Templates

For production, use approved message templates:

- WhatsApp requires pre-approved templates for business messages
- Submit templates in Twilio Console
- Use template variables for dynamic content

### 3. Rate Limiting

Twilio has rate limits for WhatsApp:

- **Sandbox:** Limited messages per day
- **Production:** Based on your tier
- Monitor usage in Twilio dashboard

### 4. Cost Monitoring

WhatsApp messages have per-message costs:

- **Check Pricing:** https://www.twilio.com/whatsapp/pricing
- **Typical Cost:** ~$0.005-$0.01 per message
- **Monitor Usage:** Set up billing alerts in Twilio

## Troubleshooting

### Issue: Messages Not Delivered

**Check:**
1. Twilio credentials correct in .env.local
2. Sandbox activated (sent "join" message)
3. Phone numbers in international format (+33...)
4. Twilio account has credits
5. Check Twilio logs for delivery errors

### Issue: Invalid Phone Number

**Solution:**
- Ensure phone starts with + and country code
- Use `formatPhoneForWhatsApp()` helper
- French numbers: +33612345678 (not 0612345678)

### Issue: "CSRF Token Missing" Error

**Solution:**
- Use the UI to create orders
- Or fetch CSRF token first: GET /api/csrf
- Include token in headers: `x-csrf-token: {token}`

## Future Enhancements

Potential improvements:

1. **Customer Notifications:**
   - Order confirmed
   - Order preparing
   - Out for delivery
   - Delivered

2. **Rich Media:**
   - Send images of pizzas
   - Location maps for delivery

3. **Two-Way Communication:**
   - Handle incoming WhatsApp messages
   - Customer replies
   - Order modifications

4. **Analytics:**
   - Track message delivery rates
   - Monitor response times
   - Customer engagement metrics

## Support

For issues:
1. Check Twilio logs: https://console.twilio.com
2. Review server logs for errors
3. Test with WhatsApp Web fallback URLs
4. Contact Twilio support for API issues
