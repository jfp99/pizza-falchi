# Quick Start: Testing Your New Features! 🚀

## 🎉 What's New

Your Pizza Falchi app now has:
- ✅ **Email notifications** - Professional order confirmations
- ✅ **Online payments** - Stripe integration enabled
- ✅ **Webhooks** - Automatic payment handling
- ✅ **Enhanced security** - Rate limiting, secure headers

---

## ⚡ 5-Minute Setup

### Step 1: Get Resend API Key (2 minutes)

1. Go to https://resend.com/
2. Sign up (free tier: 100 emails/day)
3. Get API key
4. Add to `.env.local`:
   ```bash
   RESEND_API_KEY=re_your_key_here
   ```

### Step 2: Get Stripe Test Keys (2 minutes)

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy **Publishable key** and **Secret key**
3. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   STRIPE_SECRET_KEY=sk_test_your_key_here
   ```

### Step 3: Restart Server (1 minute)

```bash
npm run dev
```

---

## 🧪 Quick Test (10 minutes)

### Test Email Notifications

1. Go to http://localhost:3001/menu
2. Add a pizza to cart
3. Go to checkout
4. Fill in:
   - Name: Test User
   - Phone: 06 12 34 56 78
   - **Email: your_real_email@gmail.com** (use real email!)
   - Select time slot
   - Payment: Espèces (cash)
5. Confirm order
6. **Check your email** - You should receive a beautiful order confirmation!

### Test Online Payment

1. Add items to cart
2. Go to checkout
3. Fill in info (including email)
4. Select "En ligne" payment
5. Use test card:
   ```
   Card: 4242 4242 4242 4242
   Expiry: 12/34
   CVC: 123
   ZIP: 12345
   ```
6. Click "Payer"
7. Check your email for confirmation

---

## 📖 Full Documentation

- **Email System:** `docs/SECURITY_SETUP.md`
- **Stripe Testing:** `docs/STRIPE_TESTING_GUIDE.md`
- **Webhooks:** `docs/STRIPE_WEBHOOK_TESTING.md`
- **Complete Audit:** `docs/MARKETABILITY_AUDIT_2025.md`
- **Session Summary:** `docs/SESSION_SUMMARY_OCT_31.md`

---

## 🆘 Problems?

### Email not sending?
- Check Resend API key is correct
- Check server logs for errors
- Verify email address format

### Payment not working?
- Verify Stripe keys start with `pk_test_` and `sk_test_`
- Check browser console for errors
- Restart dev server

### Still stuck?
- Check `docs/STRIPE_TESTING_GUIDE.md` for detailed troubleshooting
- Review server terminal for error messages
- Ensure `.env.local` is properly configured

---

## ✅ What to Test

- [ ] Order confirmation email received
- [ ] Email has all order details
- [ ] Online payment option visible
- [ ] Stripe form loads
- [ ] Test payment succeeds
- [ ] Order created successfully
- [ ] Admin email received

---

## 🚀 Ready for Production?

Once testing is complete:
1. Get **production** Stripe keys (not test keys)
2. Set up Stripe webhooks in Dashboard
3. Deploy to Vercel
4. Test on production URL
5. Start accepting real orders!

---

**Need Help?** Check the comprehensive guides in the `docs/` folder!

**Happy Testing!** 🍕
