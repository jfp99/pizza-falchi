# Stripe Payment Testing Guide

## Overview

Stripe online payment is now enabled in the checkout flow! This guide will help you test the integration.

---

## Prerequisites

### 1. Get Stripe Test API Keys

1. Sign up or log in to Stripe: https://dashboard.stripe.com/
2. Switch to **Test Mode** (toggle in the top right)
3. Go to **Developers > API Keys**
4. Copy the following keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### 2. Configure Environment Variables

Add to your `.env.local`:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
```

### 3. Restart Development Server

```bash
npm run dev
```

---

## Testing the Payment Flow

### Step 1: Add Items to Cart

1. Go to http://localhost:3001/menu
2. Add one or more pizzas to your cart
3. Go to cart and proceed to checkout

### Step 2: Fill Checkout Form

1. **Select Pickup** (delivery is currently disabled)
2. **Select a time slot** (required for pickup)
3. **Enter customer information:**
   - Name (required)
   - Phone (required)
   - **Email (strongly recommended for payment receipts)**
4. **Select "En ligne" payment method**

### Step 3: Complete Payment

Once you select online payment, the Stripe payment form will appear with:
- Card number field
- Expiry date field
- CVC field
- Postal code field

### Step 4: Use Test Cards

Stripe provides test cards that simulate different scenarios:

#### ✅ **Successful Payment**
```
Card Number:    4242 4242 4242 4242
Expiry:         Any future date (e.g., 12/34)
CVC:            Any 3 digits (e.g., 123)
ZIP:            Any 5 digits (e.g., 12345)
```

#### ❌ **Card Declined**
```
Card Number:    4000 0000 0000 0002
Expiry:         Any future date
CVC:            Any 3 digits
ZIP:            Any 5 digits
```

#### ⚠️ **Requires Authentication (3D Secure)**
```
Card Number:    4000 0025 0000 3155
Expiry:         Any future date
CVC:            Any 3 digits
ZIP:            Any 5 digits
```
*This will show an authentication modal - click "Complete" to approve*

#### 💳 **More Test Cards**
- **Insufficient Funds:** `4000 0000 0000 9995`
- **Expired Card:** `4000 0000 0000 0069`
- **Incorrect CVC:** `4000 0000 0000 0127`

Full list: https://stripe.com/docs/testing#cards

### Step 5: Complete Order

1. Click **"Payer {amount}€"**
2. Wait for payment processing
3. On success, you'll be redirected to order confirmation page
4. Check that:
   - Order is created in database
   - Email confirmation sent (if email provided)
   - Payment status is "paid"
   - PaymentIntent ID is stored

---

## What's Enabled

### ✅ Frontend Features
- Online payment option is now visible and clickable
- Stripe payment form loads when selected
- Email reminder if not provided
- Loading states during payment intent creation
- Error handling for failed payments
- Graceful fallback if Stripe not configured

### ✅ Backend Features
- Payment intent creation (`/api/create-payment-intent`)
- Rate limiting on payment endpoint (10 requests/hour)
- Payment status tracking (paid vs pending)
- PaymentIntent ID stored with order
- Email notifications include payment info

---

## Testing Checklist

### Basic Flow
- [ ] Online payment option appears and is clickable
- [ ] Clicking "En ligne" shows Stripe payment form
- [ ] Form loads without errors
- [ ] Email warning appears if email not provided
- [ ] All test cards work as expected
- [ ] Successful payment creates order
- [ ] Order confirmation page loads
- [ ] Payment status is marked as "paid"

### Email Notifications
- [ ] Email confirmation sent to customer (if email provided)
- [ ] Admin email notification sent
- [ ] Email includes payment status

### Error Scenarios
- [ ] Invalid card number shows error
- [ ] Declined card shows error message
- [ ] Network error handles gracefully
- [ ] Stripe not configured shows warning
- [ ] Rate limit works (test with 11 payment intents in 1 hour)

### Security
- [ ] Payment intent creation is rate-limited
- [ ] Stripe secret key not exposed in frontend
- [ ] Payment form is secured by Stripe
- [ ] HTTPS is used in production

---

## Debugging

### Check Stripe Dashboard

1. Go to https://dashboard.stripe.com/ (Test Mode)
2. Navigate to **Payments**
3. You should see your test payments listed
4. Click on a payment to see full details

### Check Browser Console

Look for errors like:
- "Invalid API key"
- "Network error"
- "Payment intent creation failed"

### Check Server Logs

```bash
# In your terminal where dev server is running
# Look for errors from /api/create-payment-intent
```

### Common Issues

#### Issue: "Online payment not available"
**Solution:** Check that Stripe keys are correctly set in `.env.local` and server is restarted

#### Issue: Payment form doesn't appear
**Solution:**
1. Check browser console for errors
2. Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
3. Ensure key starts with `pk_test_`

#### Issue: "Payment intent creation failed"
**Solution:**
1. Verify `STRIPE_SECRET_KEY` is set in `.env.local`
2. Ensure key starts with `sk_test_`
3. Check server logs for detailed error

#### Issue: Rate limit error
**Solution:** This is normal if you're testing rapidly. Wait 1 hour or restart dev server to reset rate limiter

---

## Testing Webhook Integration (Coming Next)

**Note:** Webhooks are not yet implemented. When they are added, they will handle:
- Payment confirmation events
- Failed payment events
- Refund events
- Automatic order status updates

To test webhooks later:
1. Install Stripe CLI
2. Run: `stripe listen --forward-to localhost:3001/api/webhooks/stripe`
3. Test payment flow
4. Check webhook events in terminal

---

## Production Deployment

### Before Going Live

1. ✅ **Get Production Keys**
   - Go to Stripe Dashboard (Live Mode)
   - Get production keys: `pk_live_...` and `sk_live_...`

2. ✅ **Update Environment Variables**
   ```bash
   # In Vercel Dashboard > Environment Variables
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here
   STRIPE_SECRET_KEY=sk_live_your_key_here
   ```

3. ✅ **Set Up Webhooks**
   - Create webhook endpoint in Stripe Dashboard
   - Point to: `https://yourdomain.com/api/webhooks/stripe`
   - Add webhook secret to environment variables

4. ✅ **Test with Real Cards**
   - Use small amount (€0.50)
   - Test on staging environment first
   - Verify order creation
   - Check email notifications
   - Test refund process

5. ✅ **Enable HTTPS**
   - Vercel automatically provides HTTPS
   - Verify SSL certificate is valid
   - Test payment on production URL

---

## Current Limitations

### Not Yet Implemented
- ⏳ Webhook handling (next task)
- ⏳ Automatic refund system
- ⏳ Saved payment methods
- ⏳ Subscription/recurring payments
- ⏳ Multi-currency support

### Temporary Restrictions
- 🚫 Delivery option disabled (pickup only)
- 🚫 Rate limited to 10 payment intents per hour per IP

---

## Support Resources

### Stripe Documentation
- Testing Cards: https://stripe.com/docs/testing
- Payment Intents: https://stripe.com/docs/payments/payment-intents
- Webhooks: https://stripe.com/docs/webhooks
- Error Handling: https://stripe.com/docs/error-handling

### Common Test Scenarios
- **3D Secure (SCA):** Card `4000 0025 0000 3155`
- **International Card:** Card `4000 0566 5566 5556` (Brazil)
- **Amex:** `3782 822463 10005`
- **Discover:** `6011 1111 1111 1117`
- **Diners:** `3056 9309 0259 04`

---

## Next Steps

After successful testing:

1. **Implement Webhooks** - Handle async payment events
2. **Add Refund System** - Admin can issue refunds
3. **Improve Error Messages** - Better user feedback
4. **Add Payment Analytics** - Track conversion rates
5. **Implement Saved Cards** - For returning customers

---

## Questions?

If you encounter issues:
1. Check Stripe Dashboard for payment status
2. Review server logs for errors
3. Check browser console for frontend errors
4. Verify environment variables are set correctly
5. Ensure dev server was restarted after adding keys

---

**Last Updated:** October 31, 2025
**Version:** 1.0
**Status:** ✅ Ready for Testing
