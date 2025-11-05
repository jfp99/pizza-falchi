# Sentry Error Monitoring Setup Guide

## What is Sentry?

Sentry is an error tracking and performance monitoring platform that helps you:
- 📊 Track errors in real-time
- 🐛 Debug issues with stack traces and context
- 📈 Monitor application performance
- 🔔 Get alerts when errors occur
- 📱 Track errors across client and server

---

## Quick Setup (10 Minutes)

### Step 1: Create Sentry Account (3 minutes)

1. Go to https://sentry.io/
2. Sign up (free tier: 5,000 errors/month)
3. Create a new organization (or use existing)

### Step 2: Create Next.js Project (2 minutes)

1. Click **"Create Project"**
2. Select **"Next.js"** as the platform
3. Set Alert frequency (recommended: "Alert me on every new issue")
4. Name your project: **"pizza-falchi"**
5. Click **"Create Project"**

### Step 3: Get Your DSN (1 minute)

After creating the project, you'll see a DSN (Data Source Name).

It looks like:
```
https://abc123def456@o123456.ingest.sentry.io/789012
```

Copy this DSN!

### Step 4: Add to Environment Variables (1 minute)

Add to `.env.local`:
```bash
NEXT_PUBLIC_SENTRY_DSN=https://your_dsn_here
```

### Step 5: Restart Server (1 minute)

```bash
npm run dev
```

### Step 6: Test Error Tracking (2 minutes)

Create a test error:
1. Go to any page
2. Open browser console
3. Run: `throw new Error("Test error for Sentry")`
4. Check Sentry dashboard - you should see the error!

---

## What's Already Configured

### ✅ Client-Side Tracking
- Automatic error capture
- Session replay on errors
- Browser extension errors filtered out
- Common non-actionable errors ignored

### ✅ Server-Side Tracking
- API route errors captured
- Database errors tracked
- Rate limiting errors filtered out

### ✅ Edge Runtime Tracking
- Middleware errors captured
- Edge function errors tracked

### ✅ Smart Error Filtering
- Browser extension errors ignored
- ResizeObserver errors ignored
- Network errors from extensions filtered
- Expected errors (rate limits) excluded

---

## Testing Sentry

### Test 1: Client-Side Error

Add a test button to any page:

```tsx
<button onClick={() => {
  throw new Error('Test Sentry client error');
}}>
  Test Sentry
</button>
```

Click the button → Check Sentry dashboard

### Test 2: Server-Side Error

Create a test API route:

`app/api/sentry-test/route.ts`
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  throw new Error('Test Sentry server error');
  return NextResponse.json({ ok: true });
}
```

Visit `/api/sentry-test` → Check Sentry dashboard

### Test 3: Async Error

```typescript
async function testAsync() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  throw new Error('Test async error');
}

// Call it
testAsync().catch(console.error);
```

---

## Sentry Dashboard Features

### Issues Tab
- See all errors grouped by type
- View frequency and affected users
- See stack traces with source maps
- Access session replays

### Performance Tab
- Monitor page load times
- Track API response times
- Identify slow database queries
- See performance trends

### Releases Tab
- Track errors by deployment
- Compare error rates between releases
- See which version introduced a bug

### Alerts Tab
- Configure alert rules
- Get email/Slack notifications
- Set thresholds for alerts

---

## Production Configuration

### Step 1: Create Auth Token (For Source Maps)

Source maps allow Sentry to show you the original TypeScript/JSX code instead of minified JavaScript.

1. Go to **Sentry Settings > Auth Tokens**
2. Click **"Create New Token"**
3. Scopes: Select **"project:write"** and **"org:read"**
4. Name: "Pizza Falchi Source Maps"
5. Copy the token

### Step 2: Add to Production Environment

In **Vercel Dashboard > Environment Variables**:

```bash
# Required
NEXT_PUBLIC_SENTRY_DSN=https://your_dsn_here

# Optional (for source maps)
SENTRY_AUTH_TOKEN=your_auth_token_here
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=pizza-falchi
```

**Note:** Source maps are uploaded during build, so these are only needed in production builds.

### Step 3: Configure Alerts

1. Go to **Alerts > Create Alert Rule**
2. **Alert name:** "New Error in Production"
3. **When:** An event is seen
4. **If:** Environment = production
5. **Then:** Send notification to Slack/Email
6. **Frequency:** Alert me on every new issue

Recommended alerts:
- New errors in production
- High error rate (>10 errors/minute)
- Performance degradation
- Failed payment errors

---

## Monitoring Key Areas

### Payment Errors
```typescript
// In payment flow
try {
  await processPayment();
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      payment_method: 'stripe',
      order_id: orderId,
    },
    level: 'error',
  });
  throw error;
}
```

### Database Errors
```typescript
// In database operations
try {
  await Order.create(orderData);
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      operation: 'order_creation',
      collection: 'orders',
    },
  });
  throw error;
}
```

### Email Sending Errors
```typescript
// In email service
try {
  await sendEmail();
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      email_type: 'order_confirmation',
      service: 'resend',
    },
  });
}
```

---

## Custom Context & Tags

### Add User Context
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.name,
});
```

### Add Custom Tags
```typescript
Sentry.setTag('order_type', 'pickup');
Sentry.setTag('payment_method', 'online');
```

### Add Breadcrumbs
```typescript
Sentry.addBreadcrumb({
  category: 'order',
  message: 'Customer added item to cart',
  level: 'info',
  data: {
    product_id: productId,
    quantity: 1,
  },
});
```

---

## Performance Monitoring

### Enable Performance Tracking

Already configured! Sentry will automatically track:
- Page load times
- API response times
- Database query performance
- React component render times

### Custom Performance Tracking

```typescript
import * as Sentry from '@sentry/nextjs';

const transaction = Sentry.startTransaction({
  name: 'process_order',
  op: 'order.create',
});

try {
  await processOrder();
  transaction.setStatus('ok');
} catch (error) {
  transaction.setStatus('error');
  throw error;
} finally {
  transaction.finish();
}
```

---

## Session Replay

### What is Session Replay?

Session Replay records user sessions and replays them when an error occurs, showing exactly what the user did before the error.

### Already Enabled!

- Replays errors: 100% of sessions with errors
- Replays normal sessions: 10% sample rate
- Privacy: All text masked, all media blocked

### View Replays

1. Go to Sentry Issue
2. Click on **"Replays"** tab
3. Watch what the user did before the error

---

## Best Practices

### ✅ DO

1. **Add context to errors**
   ```typescript
   Sentry.captureException(error, {
     tags: { feature: 'checkout', step: 'payment' },
     extra: { orderId, total },
   });
   ```

2. **Set user context**
   ```typescript
   Sentry.setUser({ id, email });
   ```

3. **Use breadcrumbs for tracking**
   ```typescript
   Sentry.addBreadcrumb({
     message: 'User clicked pay button',
     category: 'user_action',
   });
   ```

4. **Configure alerts**
   - Set up Slack integration
   - Alert on new errors
   - Alert on performance issues

5. **Monitor performance**
   - Track slow API routes
   - Monitor database queries
   - Identify bottlenecks

### ❌ DON'T

1. **Don't log sensitive data**
   ```typescript
   // BAD
   Sentry.captureException(error, {
     extra: { creditCard: '4242...' }
   });

   // GOOD
   Sentry.captureException(error, {
     extra: { paymentMethod: 'stripe' }
   });
   ```

2. **Don't track expected errors**
   ```typescript
   // Already filtered:
   - Rate limiting errors
   - Validation errors
   - 404 errors
   ```

3. **Don't over-sample**
   ```typescript
   // Current: 100% error replays, 10% normal sessions
   // Don't: 100% all sessions (expensive!)
   ```

---

## Troubleshooting

### Issue: No errors showing in Sentry

**Check:**
1. Is `NEXT_PUBLIC_SENTRY_DSN` set correctly?
2. Did you restart the dev server?
3. Are errors actually occurring?
4. Check browser network tab for Sentry requests

### Issue: Source maps not working

**Check:**
1. Is `SENTRY_AUTH_TOKEN` set?
2. Are `SENTRY_ORG` and `SENTRY_PROJECT` correct?
3. Is production build successful?
4. Check Sentry dashboard > Settings > Source Maps

### Issue: Too many errors

**Solution:**
1. Increase sample rate filters
2. Add more `ignoreErrors` patterns
3. Use `beforeSend` to filter programmatically

### Issue: Session replays not showing

**Check:**
1. Is error occurring in browser (not server)?
2. Wait 5-10 seconds after error
3. Check browser console for replay errors

---

## Cost Management

### Free Tier Limits
- 5,000 errors per month
- 5,000 replays per month
- 7-day data retention
- 1 project

### Optimization Tips

1. **Filter non-actionable errors**
   ```typescript
   ignoreErrors: [
     'ResizeObserver',
     'NetworkError',
     // Add more patterns
   ]
   ```

2. **Reduce replay sampling**
   ```typescript
   replaysSessionSampleRate: 0.05, // 5% instead of 10%
   ```

3. **Use environments**
   ```typescript
   environment: process.env.NODE_ENV,
   // Only track production
   enabled: process.env.NODE_ENV === 'production',
   ```

4. **Set up release tracking**
   - Only track errors in latest release
   - Archive old issues automatically

---

## Integration with Other Tools

### Slack Notifications

1. Go to **Settings > Integrations**
2. Click **"Slack"**
3. Connect workspace
4. Configure notification rules

### Vercel Integration

1. Go to **Settings > Integrations**
2. Click **"Vercel"**
3. Connect Vercel account
4. Link deployments to releases

### GitHub Integration

1. Go to **Settings > Integrations**
2. Click **"GitHub"**
3. Connect repository
4. Enable issue tracking

---

## Monitoring Dashboard

### Key Metrics to Watch

1. **Error Rate**
   - Target: <1 error per 1000 requests
   - Alert: >10 errors per minute

2. **Response Time**
   - Target: API routes <200ms
   - Alert: >1s response time

3. **User Impact**
   - How many users affected?
   - Which features causing errors?

4. **Trends**
   - Are errors increasing?
   - Which deployments introduced bugs?

---

## Testing Checklist

### Local Testing
- [ ] Sentry DSN added to .env.local
- [ ] Dev server restarted
- [ ] Test error thrown in browser
- [ ] Error appears in Sentry dashboard
- [ ] Stack trace is readable
- [ ] Source maps working

### Production Testing
- [ ] Production DSN configured in Vercel
- [ ] Auth token added for source maps
- [ ] Test deployment with intentional error
- [ ] Error tracked in production environment
- [ ] Alerts configured
- [ ] Team invited to Sentry

---

## Next Steps

1. **Sign up for Sentry** (5 minutes)
2. **Get DSN and add to .env.local** (2 minutes)
3. **Test error tracking** (3 minutes)
4. **Configure alerts** (5 minutes)
5. **Set up Slack integration** (5 minutes)
6. **Deploy to production** (when ready)

---

## Support Resources

- **Sentry Docs:** https://docs.sentry.io/platforms/javascript/guides/nextjs/
- **Next.js Integration:** https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
- **Performance Monitoring:** https://docs.sentry.io/product/performance/
- **Session Replay:** https://docs.sentry.io/product/session-replay/

---

**Last Updated:** October 31, 2025
**Version:** 1.0
**Status:** ✅ Ready to Configure
