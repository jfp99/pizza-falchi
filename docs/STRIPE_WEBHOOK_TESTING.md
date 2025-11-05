# Stripe Webhook Testing Guide

## What Are Webhooks?

Webhooks allow Stripe to notify your application about asynchronous events like:
- ✅ Payment succeeded
- ❌ Payment failed
- 🔄 Payment refunded
- ⏸️ Payment canceled

This is **critical for production** because payments can succeed/fail after the user leaves your site.

---

## Local Testing Setup

### Step 1: Install Stripe CLI

#### On Windows (Git Bash):
```bash
# Download Stripe CLI
curl -L https://github.com/stripe/stripe-cli/releases/download/v1.19.4/stripe_1.19.4_windows_x86_64.zip -o stripe.zip

# Extract
unzip stripe.zip

# Move to a directory in your PATH or run from current directory
```

#### On macOS:
```bash
brew install stripe/stripe-cli/stripe
```

#### On Linux:
```bash
# Download and install
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.4/stripe_1.19.4_linux_x86_64.tar.gz
tar -xvf stripe_1.19.4_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/
```

### Step 2: Login to Stripe

```bash
stripe login
```

This will open your browser to authorize the CLI.

### Step 3: Forward Webhooks to Local Server

```bash
# Start webhook forwarding
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```

**Important:** Keep this terminal window open! It will show:
- Webhook signing secret (starts with `whsec_`)
- Incoming webhook events
- Response from your endpoint

### Step 4: Copy Webhook Secret

The CLI will output something like:
```
> Ready! Your webhook signing secret is whsec_1234567890abcdef
```

Copy this secret and add to `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef
```

### Step 5: Restart Dev Server

```bash
# In another terminal
npm run dev
```

---

## Testing Webhook Events

### Test 1: Successful Payment

1. **Start webhook listener** (in one terminal):
   ```bash
   stripe listen --forward-to localhost:3001/api/webhooks/stripe
   ```

2. **Place an order** (in your browser):
   - Go to checkout
   - Select online payment
   - Use test card: `4242 4242 4242 4242`
   - Complete payment

3. **Check webhook terminal** - You should see:
   ```
   [200] POST /api/webhooks/stripe [evt_123...]
   payment_intent.succeeded
   ```

4. **Verify order updated**:
   - Order payment status → "paid"
   - Order status → "confirmed"
   - Customer received confirmation email

### Test 2: Failed Payment

1. **Place order with declined card**: `4000 0000 0000 0002`

2. **Check webhook terminal**:
   ```
   payment_intent.payment_failed
   ```

3. **Verify order updated**:
   - Payment status → "failed"
   - Order remains in pending state

### Test 3: Trigger Events Manually

You can manually trigger webhook events:

```bash
# Trigger payment success
stripe trigger payment_intent.succeeded

# Trigger payment failure
stripe trigger payment_intent.payment_failed

# Trigger refund
stripe trigger charge.refunded
```

---

## Webhook Event Flow

### Payment Success Flow

```
User completes payment
    ↓
Stripe processes payment (async)
    ↓
Stripe sends webhook: payment_intent.succeeded
    ↓
Your webhook endpoint receives event
    ↓
Verifies signature ✓
    ↓
Finds order by paymentIntentId
    ↓
Updates: paymentStatus = 'paid', status = 'confirmed'
    ↓
Sends confirmation email to customer
```

### What the Webhook Handles

| Event | Action |
|-------|--------|
| `payment_intent.succeeded` | Mark payment as paid, confirm order, send email |
| `payment_intent.payment_failed` | Mark payment as failed, keep order pending |
| `payment_intent.canceled` | Mark payment as failed, cancel order, send email |
| `charge.refunded` | Mark payment as refunded, send email |

---

## Production Setup

### Step 1: Create Webhook Endpoint in Stripe

1. Go to **Stripe Dashboard > Developers > Webhooks**
2. Click **"Add endpoint"**
3. Enter your production URL:
   ```
   https://yourdomain.com/api/webhooks/stripe
   ```
4. Select events to listen for:
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
   - ✅ `payment_intent.canceled`
   - ✅ `charge.refunded`
5. Click **"Add endpoint"**

### Step 2: Get Webhook Signing Secret

1. Click on your newly created webhook
2. Click **"Reveal"** under "Signing secret"
3. Copy the secret (starts with `whsec_`)

### Step 3: Add to Production Environment

In **Vercel Dashboard > Environment Variables**:
```
STRIPE_WEBHOOK_SECRET=whsec_your_production_secret_here
```

### Step 4: Test Production Webhook

1. In Stripe Dashboard, click your webhook
2. Click **"Send test webhook"**
3. Select event: `payment_intent.succeeded`
4. Click **"Send test webhook"**
5. Check response status (should be 200)

---

## Debugging Webhooks

### Check Webhook Logs in Stripe Dashboard

1. Go to **Developers > Webhooks**
2. Click on your webhook endpoint
3. See recent webhook attempts
4. Check response codes and body

### Common Issues

#### Issue: "Invalid signature"
**Cause:** Webhook secret doesn't match or body was modified

**Solution:**
1. Verify `STRIPE_WEBHOOK_SECRET` is correct
2. Ensure you're using raw request body
3. Check for middleware that modifies request

#### Issue: "Webhook not configured"
**Cause:** `STRIPE_WEBHOOK_SECRET` not set

**Solution:** Add webhook secret to `.env.local`

#### Issue: Order not found
**Cause:** Webhook received before order was created

**Solution:** This is normal for local testing. Webhook handler logs but doesn't fail.

#### Issue: Webhooks not being received
**Cause:** Stripe CLI not running or wrong URL

**Solution:**
1. Check Stripe CLI is running: `stripe listen --forward-to localhost:3001/api/webhooks/stripe`
2. Verify dev server is on port 3001
3. Check firewall settings

---

## Security Best Practices

### ✅ Implemented

1. **Signature Verification** - Every webhook is verified using Stripe signature
2. **Raw Body Required** - Webhook uses raw request body for verification
3. **Error Handling** - Graceful error handling with logging
4. **Idempotency** - Safe to process same event multiple times

### 🔒 Additional Recommendations

1. **IP Whitelist** (Optional)
   - Stripe webhook IPs: https://stripe.com/docs/ips
   - Add to firewall rules in production

2. **Retry Logic**
   - Stripe automatically retries failed webhooks
   - Your endpoint should be idempotent

3. **Monitor Failures**
   - Set up alerts for failed webhooks
   - Check Stripe Dashboard regularly

---

## Webhook Event Examples

### payment_intent.succeeded

```json
{
  "id": "evt_123",
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_123",
      "amount": 1500,
      "currency": "eur",
      "status": "succeeded"
    }
  }
}
```

### payment_intent.payment_failed

```json
{
  "id": "evt_456",
  "type": "payment_intent.payment_failed",
  "data": {
    "object": {
      "id": "pi_456",
      "status": "requires_payment_method",
      "last_payment_error": {
        "message": "Your card was declined."
      }
    }
  }
}
```

### charge.refunded

```json
{
  "id": "evt_789",
  "type": "charge.refunded",
  "data": {
    "object": {
      "id": "ch_789",
      "amount_refunded": 1500,
      "payment_intent": "pi_123"
    }
  }
}
```

---

## Testing Checklist

### Local Testing
- [ ] Stripe CLI installed and logged in
- [ ] Webhook listener running
- [ ] Webhook secret added to .env.local
- [ ] Dev server restarted
- [ ] Successful payment triggers webhook
- [ ] Order status updates correctly
- [ ] Confirmation email sent
- [ ] Failed payment triggers webhook
- [ ] Manual event triggers work

### Production Testing
- [ ] Webhook endpoint created in Stripe Dashboard
- [ ] Production webhook secret added to Vercel
- [ ] Test webhook sent from Dashboard
- [ ] Real payment processed successfully
- [ ] Webhook logs show success (200 response)
- [ ] Order confirms automatically
- [ ] Emails sent correctly

---

## Monitoring Webhooks

### Stripe Dashboard

- **Recent webhooks:** Developers > Webhooks > [Your Endpoint]
- **Failed webhooks:** Check for non-200 responses
- **Retry attempts:** Stripe retries failed webhooks up to 3 days

### Your Application

Add monitoring for:
- Webhook processing time
- Failed webhook handlers
- Database update failures
- Email sending failures

### Recommended Tools

- **Sentry** - Error tracking (coming next)
- **Datadog/New Relic** - Performance monitoring
- **LogRocket** - Session replay for debugging

---

## Next Steps After Webhooks

1. **Add Refund System** - Admin can issue refunds via Stripe
2. **Implement Retry Logic** - Handle transient failures
3. **Add Webhook Monitoring** - Alert on failures
4. **Set Up Sentry** - Error tracking for webhooks
5. **Test Edge Cases** - Network timeouts, partial refunds

---

## Support Resources

- **Stripe Webhooks Docs:** https://stripe.com/docs/webhooks
- **Stripe CLI Docs:** https://stripe.com/docs/stripe-cli
- **Testing Webhooks:** https://stripe.com/docs/webhooks/test
- **Webhook Best Practices:** https://stripe.com/docs/webhooks/best-practices

---

**Last Updated:** October 31, 2025
**Version:** 1.0
**Status:** ✅ Ready for Testing
