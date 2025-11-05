# Security Setup Guide

## 🔴 CRITICAL: Credential Rotation Required

Your current `.env.local` file contains exposed credentials that need to be rotated immediately before production deployment.

---

## Step 1: Generate Strong NextAuth Secret

Run this command to generate a cryptographically secure secret:

```bash
openssl rand -base64 32
```

**Example output:** `eQ3Ad4HsaZ6I3j5gPprWLA0wewAEumg7o0FRVvfbeWc=`

Update your `.env.local`:
```bash
NEXTAUTH_SECRET=<paste-generated-secret-here>
```

---

## Step 2: Rotate MongoDB Credentials

### Option A: Create New Database User (Recommended)

1. Log into MongoDB Atlas: https://cloud.mongodb.com/
2. Go to Database Access
3. Create a new user with a strong password:
   - Username: `pizza-falchi-prod` (or similar)
   - Password: Use a password generator (min 20 chars)
   - Role: `readWrite` on your database
4. Update connection string in `.env.local`:

```bash
MONGODB_URI=mongodb+srv://new-username:new-password@cluster0.baqc9ho.mongodb.net/pizza-falchi?retryWrites=true&w=majority&appName=Cluster0
```

### Option B: Rotate Existing User Password

1. Go to Database Access in MongoDB Atlas
2. Edit user `admin_test`
3. Generate new password
4. Update `.env.local` with new password

---

## Step 3: Rotate Twilio Credentials

### Option A: Create New API Key (Recommended for Production)

1. Log into Twilio Console: https://console.twilio.com/
2. Go to Account > API Keys & Tokens
3. Create new API Key
4. Update `.env.local`:

```bash
TWILIO_ACCOUNT_SID=<new-account-sid>
TWILIO_AUTH_TOKEN=<new-auth-token>
```

### Option B: Rotate Auth Token

1. Go to Twilio Console
2. Navigate to Account > API Keys & Tokens
3. Roll your Auth Token
4. Update `.env.local`

**Note:** After rotating, the old token will be invalidated within 24 hours.

---

## Step 4: Set Up Stripe Keys

1. Log into Stripe Dashboard: https://dashboard.stripe.com/
2. **For Testing:**
   - Go to Developers > API Keys (Test mode)
   - Copy Publishable key (starts with `pk_test_`)
   - Copy Secret key (starts with `sk_test_`)

3. **For Production:**
   - Switch to Live mode
   - Copy Publishable key (starts with `pk_live_`)
   - Copy Secret key (starts with `sk_live_`)

Update `.env.local`:
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
```

⚠️ **IMPORTANT:** Never commit live keys to git. Only use test keys in development.

---

## Step 5: Verify .gitignore Protection

Your `.env.local` should **NEVER** be committed to git. Verify it's ignored:

```bash
# Check if .env.local is ignored
git status

# .env.local should NOT appear in the output
# If it does, ensure .gitignore contains:
# .env*
```

### If .env.local Was Accidentally Committed:

```bash
# Remove from git tracking (keeps local file)
git rm --cached .env.local

# Commit the removal
git add .gitignore
git commit -m "Remove .env.local from tracking"

# Push changes
git push
```

### Remove from Git History (If Needed):

⚠️ **WARNING:** This rewrites git history. Coordinate with team first.

```bash
# Install git-filter-repo (recommended over filter-branch)
# On Windows with Git Bash:
pip install git-filter-repo

# Remove .env.local from entire history
git filter-repo --path .env.local --invert-paths

# Force push to remote (if needed)
git push --force --all
```

---

## Step 6: Production Environment Variables (Vercel)

When deploying to Vercel, set environment variables in the dashboard:

1. Go to your project in Vercel Dashboard
2. Navigate to Settings > Environment Variables
3. Add each variable:

### Required Variables:

| Variable | Environment | Value |
|----------|-------------|-------|
| `MONGODB_URI` | Production, Preview, Development | Your MongoDB connection string |
| `NEXTAUTH_SECRET` | Production, Preview, Development | Generated secret (32+ chars) |
| `NEXTAUTH_URL` | Production | `https://yourdomain.com` |
| `NEXTAUTH_URL` | Preview, Development | `https://your-preview.vercel.app` |
| `STRIPE_SECRET_KEY` | Production | `sk_live_...` (Live key) |
| `STRIPE_SECRET_KEY` | Preview, Development | `sk_test_...` (Test key) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Production | `pk_live_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Preview, Development | `pk_test_...` |
| `TWILIO_ACCOUNT_SID` | Production, Preview, Development | Your Twilio SID |
| `TWILIO_AUTH_TOKEN` | Production, Preview, Development | Your Twilio token |
| `TWILIO_WHATSAPP_FROM` | Production, Preview, Development | `whatsapp:+14155238886` |
| `RESTAURANT_WHATSAPP_NUMBER` | Production, Preview, Development | Your WhatsApp number |

### Optional but Recommended:

| Variable | Environment | Value |
|----------|-------------|-------|
| `RESEND_API_KEY` | Production, Preview, Development | Your Resend API key |
| `EMAIL_FROM` | Production, Preview, Development | `noreply@yourdomain.com` |
| `EMAIL_FROM_NAME` | Production, Preview, Development | `Pizza Falchi` |
| `NEXT_PUBLIC_SENTRY_DSN` | Production, Preview | Your Sentry DSN |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Production | Your Google Analytics ID |

---

## Step 7: Security Headers (Next.js Config)

These headers will be added in the next step of the implementation.

Preview of what will be added to `next.config.ts`:

```typescript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
]
```

---

## Step 8: Regular Security Maintenance

### Weekly:
```bash
# Check for vulnerabilities
npm audit

# Update dependencies (test thoroughly after)
npm update
```

### Monthly:
```bash
# Check for high/critical vulnerabilities
npm audit --audit-level=high

# Review and update dependencies
npm outdated
```

### Quarterly:
- Review API keys and rotate if needed
- Audit database access logs
- Review Sentry error logs
- Security penetration testing

---

## Security Checklist Before Going Live

- [ ] Generated new strong NEXTAUTH_SECRET (32+ chars)
- [ ] Rotated MongoDB credentials
- [ ] Rotated Twilio credentials
- [ ] Set up Stripe keys (test vs. production)
- [ ] Verified .env.local is in .gitignore
- [ ] Verified .env.local is NOT in git history
- [ ] Set up Vercel environment variables
- [ ] Added security headers to next.config.ts
- [ ] Enabled rate limiting on API routes
- [ ] Added CSRF protection
- [ ] Set up error monitoring (Sentry)
- [ ] Ran `npm audit` and fixed vulnerabilities
- [ ] Configured SSL certificate (automatic on Vercel)
- [ ] Set up email service with proper SPF/DKIM records

---

## Emergency Response: If Credentials Are Leaked

**If you suspect credentials have been exposed:**

1. **IMMEDIATELY** rotate all credentials:
   - MongoDB password
   - Twilio Auth Token
   - Stripe API keys (if exposed)
   - NextAuth secret

2. Review recent activity:
   - MongoDB Atlas activity logs
   - Twilio usage logs
   - Stripe event logs
   - Server access logs

3. Check for unauthorized access:
   - Unusual orders in database
   - Unexpected API calls
   - Suspicious admin logins

4. Document the incident:
   - What was exposed
   - When it was exposed
   - How it was discovered
   - Actions taken

5. Notify affected parties if customer data was accessed

---

## Current Status

### ✅ Good News:
- `.env.local` is properly in `.gitignore`
- No `.env` files found in git history
- File has never been committed

### ⚠️ Action Required:
- Rotate credentials before production deployment
- Generate new NextAuth secret
- Consider rotating Twilio credentials
- Set up production MongoDB user with restricted permissions

---

## Questions?

- MongoDB Atlas Support: https://www.mongodb.com/cloud/atlas/support
- Twilio Support: https://support.twilio.com/
- Stripe Support: https://support.stripe.com/
- Vercel Support: https://vercel.com/support

---

**Last Updated:** October 31, 2025
**Next Review:** Before production deployment
