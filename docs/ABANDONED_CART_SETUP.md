# Abandoned Cart Email System Setup

This document explains how to set up and configure the abandoned cart email system for Pizza Falchi.

## Overview

The abandoned cart system automatically detects when customers add items to their cart but don't complete the checkout process. After 24 hours, it sends them a reminder email with their cart contents and a call-to-action to complete their order.

## Features

- **Automatic cart tracking**: Saves cart data when customers have items but don't checkout
- **Smart reminders**: Sends reminder emails 24 hours after cart abandonment
- **Email templates**: Beautiful, responsive HTML emails with cart details
- **Conversion tracking**: Automatically marks carts as converted when orders are completed
- **Admin dashboard**: View abandoned cart statistics and manually trigger reminders
- **Auto-expiration**: Carts expire after 7 days

## Architecture

### Models

- **AbandonedCart** (`models/AbandonedCart.ts`): Database model for tracking abandoned carts
  - `email`: Customer email
  - `customerName`: Optional customer name
  - `items`: Array of cart items with product details
  - `totalValue`: Total cart value
  - `status`: pending | reminded | converted | expired
  - `expiresAt`: Expiration date (7 days from creation)

### API Endpoints

1. **POST /api/abandoned-cart**
   - Save abandoned cart data
   - Called when cart has items and customer provides email

2. **GET /api/abandoned-cart/send-reminders**
   - Cron job endpoint to send reminder emails
   - Requires Bearer token authentication (CRON_SECRET)
   - Should be called every hour or daily

3. **POST /api/abandoned-cart/send-reminders**
   - Manual trigger for admins to send reminders immediately

4. **POST /api/abandoned-cart/convert**
   - Mark carts as converted when order is completed
   - Call this from checkout success handler

5. **GET /api/abandoned-cart**
   - Get abandoned cart statistics for admin dashboard

### Email Templates

The abandoned cart email (`lib/email.ts:sendAbandonedCartEmail`) includes:
- Personalized greeting
- Full cart contents with images and quantities
- Total cart value
- Call-to-action button to complete checkout
- Benefits of ordering from Pizza Falchi
- Contact information

## Setup Instructions

### 1. Environment Variables

Add these variables to your `.env.local` file:

```env
# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@pizzafalchi.com
EMAIL_FROM_NAME=Pizza Falchi

# Cron Job Security
CRON_SECRET=your_secure_random_string

# Site URL (for cart links in emails)
NEXT_PUBLIC_SITE_URL=https://www.pizzafalchi.com
```

### 2. Database Setup

The AbandonedCart model will be automatically created when first accessed. Indexes are defined in the model for optimal performance.

### 3. Cron Job Setup

#### Option A: Vercel Cron Jobs (Recommended for Vercel deployments)

1. Create `vercel.json` in your project root:

```json
{
  "crons": [
    {
      "path": "/api/abandoned-cart/send-reminders",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

2. Add the CRON_SECRET to your Vercel environment variables:
   - Go to your Vercel project dashboard
   - Settings → Environment Variables
   - Add `CRON_SECRET` with a secure random value

3. Deploy your project to Vercel

The cron job will run every 6 hours automatically.

#### Option B: External Cron Service (e.g., cron-job.org, EasyCron)

1. Sign up for a cron service
2. Create a new cron job with:
   - URL: `https://your-domain.com/api/abandoned-cart/send-reminders`
   - Method: GET
   - Headers: `Authorization: Bearer YOUR_CRON_SECRET`
   - Schedule: Every 6 hours or daily

3. Test the endpoint:

```bash
curl -X GET https://your-domain.com/api/abandoned-cart/send-reminders \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### 4. Integration with Cart System

To save abandoned carts, you need to integrate with your cart system. There are two approaches:

#### Approach A: Checkout Page Integration (Simple)

Add this to your checkout page when the user enters their email:

```typescript
// app/checkout/page.tsx

const saveAbandonedCart = async (email: string, customerName?: string) => {
  if (items.length === 0) return;

  try {
    await fetch('/api/abandoned-cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        customerName,
        items: items.map(item => ({
          product: item.product._id,
          productName: item.product.name,
          productImage: item.product.image,
          quantity: item.quantity,
          price: item.product.price,
        })),
      }),
    });
  } catch (error) {
    console.error('Failed to save abandoned cart:', error);
  }
};

// Call when email is entered
<input
  type="email"
  value={email}
  onChange={(e) => {
    setEmail(e.target.value);
    if (e.target.value.includes('@')) {
      saveAbandonedCart(e.target.value, customerName);
    }
  }}
/>
```

#### Approach B: Cart Context Integration (Advanced)

Add automatic cart saving to `contexts/CartContext.tsx`:

```typescript
// Save cart to database periodically
useEffect(() => {
  const saveCartToDatabase = async () => {
    // Get email from session or localStorage
    const email = session?.user?.email || localStorage.getItem('guestEmail');

    if (email && items.length > 0) {
      try {
        await fetch('/api/abandoned-cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            items: items.map(item => ({
              product: item.product._id,
              productName: item.product.name,
              productImage: item.product.image,
              quantity: item.quantity,
              price: item.product.price,
            })),
          }),
        });
      } catch (error) {
        console.error('Failed to save cart:', error);
      }
    }
  };

  // Save cart 2 minutes after last change
  const timeoutId = setTimeout(saveCartToDatabase, 2 * 60 * 1000);

  return () => clearTimeout(timeoutId);
}, [items, session]);
```

### 5. Mark Carts as Converted

Add this to your order completion handler:

```typescript
// app/api/orders/route.ts or checkout success page

// After successful order creation
await fetch('/api/abandoned-cart/convert', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: orderData.customerEmail,
  }),
});
```

## Admin Dashboard

View abandoned cart statistics in the admin panel:

```
/admin/abandoned-carts
```

Features:
- Total abandoned carts
- Conversion rate
- Total abandoned cart value
- Status breakdown (pending, reminded, converted, expired)
- Manual reminder trigger

## Testing

### Test Abandoned Cart Email

```bash
# 1. Save a test abandoned cart
curl -X POST http://localhost:3000/api/abandoned-cart \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "customerName": "Test User",
    "items": [
      {
        "product": "64a1b2c3d4e5f6789",
        "productName": "Margherita",
        "productImage": "/images/pizzas/margherita.jpg",
        "quantity": 2,
        "price": 12.50
      }
    ]
  }'

# 2. Manually trigger reminder (after 24 hours or adjust timing in code)
curl -X POST http://localhost:3000/api/abandoned-cart/send-reminders \
  -H "Content-Type: application/json"
```

## Monitoring

### Key Metrics to Track

1. **Abandonment Rate**: (Carts created / Orders completed)
2. **Email Open Rate**: Track with Resend dashboard
3. **Conversion Rate**: (Converted carts / Total carts)
4. **Recovery Revenue**: Total value of converted carts

### Resend Dashboard

View email delivery statistics at: https://resend.com/emails

- Delivery rate
- Open rate
- Click-through rate
- Bounce rate

## Best Practices

1. **Timing**: Send reminders 24 hours after abandonment (peak effectiveness)
2. **Frequency**: Only send one reminder per cart to avoid spam
3. **Personalization**: Include customer name when available
4. **Urgency**: Consider adding limited-time discounts for abandoned carts
5. **Testing**: A/B test email subject lines and content
6. **Privacy**: Respect unsubscribe requests

## Troubleshooting

### Emails Not Sending

1. Check Resend API key is correct
2. Verify sender email is authorized in Resend
3. Check cron job is running (view logs in Vercel)
4. Ensure CRON_SECRET matches

### Carts Not Being Saved

1. Verify API endpoint is working: `POST /api/abandoned-cart`
2. Check MongoDB connection
3. Ensure email is being captured in checkout flow
4. Check browser console for errors

### Conversion Tracking Not Working

1. Ensure convert endpoint is called after successful order
2. Verify email matches exactly (case-insensitive)
3. Check order completion flow

## Future Enhancements

- [ ] A/B testing for email content
- [ ] Dynamic discount codes for abandoned carts
- [ ] Multi-step reminder sequence (24h, 48h, 72h)
- [ ] SMS reminders via Twilio
- [ ] Browser push notifications
- [ ] Personalized product recommendations
- [ ] Abandoned cart reports and analytics

## Support

For issues or questions:
- Email: support@pizzafalchi.com
- Documentation: /docs
