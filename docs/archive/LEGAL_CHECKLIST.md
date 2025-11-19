# ✅ Legal Compliance Checklist - Pizza Falchi SARL

## Quick Reference for Business Owner

---

## 📋 MANDATORY: Information to Provide

### Your SARL Registration Information

**Fill these in from your KBIS extract (extrait Kbis):**

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  SIRET (14 digits):  ___ ___ ___ ___ ___ ___ ___ ___   │
│                                                         │
│  SIREN (9 digits):   ___ ___ ___ ___ ___ ___ ___       │
│                                                         │
│  TVA Number:         FR __ _________                    │
│                                                         │
│  Capital social:     __________ €                       │
│                                                         │
│  RCS:                _____________ (city) _________     │
│                                                         │
│  Gérant Name:        _____________________________      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔍 Where to Find This Information

**ALL information is on your KBIS extract (extrait Kbis)**

| Information | Where on KBIS | Format |
|------------|---------------|---------|
| **SIRET** | Top of document | 14 digits |
| **SIREN** | Top of document | 9 digits (first 9 of SIRET) |
| **TVA Number** | Registration section | FR XX XXXXXXXXX |
| **Capital social** | Company details section | Amount in euros |
| **RCS** | Registration heading | City + SIREN number |
| **Gérant Name** | Management section | Full first and last name |

**Don't have your KBIS?** Order it at www.infogreffe.fr (~3€)

---

## 📝 Files to Update (2 files)

### ✏️ File 1: `app/mentions-legales/page.tsx`

**Search for** `[À COMPLÉTER]` and replace (6 occurrences):

- [ ] Line ~59: SIRET number (14 digits)
- [ ] Line ~61: SIREN number (9 digits)
- [ ] Line ~63: TVA number (FR XX XXXXXXXXX)
- [ ] Line ~65: Capital social (e.g., 5 000 €)
- [ ] Line ~67: RCS registration (City + SIREN)
- [ ] Line ~106: Gérant's full legal name

**Look for comments**: `⚠️ BUSINESS OWNER:`

---

### ✏️ File 2: `app/conditions-generales-vente/page.tsx`

**Search for** `[À COMPLÉTER]` and replace (3 occurrences):

- [ ] Line ~57: SIRET number (14 digits)
- [ ] Line ~59: RCS registration (City + SIREN)
- [ ] Line ~61: Capital social (e.g., 5 000 €)

**Look for comments**: `⚠️ BUSINESS OWNER:`

---

## ✅ Before Production Deployment

### Pre-Launch Checklist

- [ ] All `[À COMPLÉTER]` placeholders replaced
- [ ] SIRET/SIREN numbers verified against official documents
- [ ] Your full name added as publication director
- [ ] Tested all legal pages on local server (npm run dev)
- [ ] No placeholder text visible on the website
- [ ] Legal pages reviewed (recommended: consult attorney)

---

## 🧪 Testing Steps

1. **Start server**: `npm run dev`
2. **Visit**: http://localhost:3004
3. **Check footer links**: Click each of the 7 legal links
4. **Verify Mentions Légales**: All business info filled
5. **Verify CGV**: SIRET number filled
6. **Search website**: No `[À COMPLÉTER]` text remains

---

## 📞 Emergency Contacts

| Need Help With | Contact |
|---------------|---------|
| Lost KBIS | Infogreffe: www.infogreffe.fr<br>Greffe du Tribunal de Commerce |
| VAT questions | impots.gouv.fr<br>Your local tax office |
| Legal review | French business attorney |
| GDPR questions | CNIL: www.cnil.fr |

---

## 🚀 Production Ready When

✅ All 6 pieces of information filled in (from KBIS)
✅ No placeholders remain
✅ Legal pages tested and working
✅ All information matches KBIS extract exactly
✅ (Optional but recommended) Legal review completed

---

## 📅 Timeline

| Task | Duration | When |
|------|----------|------|
| Gather your information | 5 minutes | Now |
| Update 2 files | 5 minutes | Now |
| Test changes | 5 minutes | Now |
| Legal review (optional) | 1-2 days | Before launch |
| **TOTAL** | **~15 minutes** | **Can be done today** |

---

## 💡 Pro Tips

1. **Keep your KBIS**: Save a digital copy in a secure location
2. **Order recent KBIS**: If your KBIS is over 3 months old, order a new one
3. **Take screenshots**: Screenshot your filled legal pages for records
4. **Annual review**: Check legal pages every year for updates
5. **Update if changes**: Update legal pages if gérant or capital social changes

---

## 🎯 What's Already Done

You don't need to modify these - they're ready to use:

✅ Privacy Policy (Politique de Confidentialité)
✅ Cookie Policy (Politique des Cookies)
✅ Terms of Use (CGU)
✅ Accessibility Statement
✅ GDPR Rights Form
✅ Cookie Consent Banner (Tarteaucitron.js)
✅ Footer integration
✅ Checkout CGV acceptance

---

**Need detailed instructions?** → See `LEGAL_SETUP_GUIDE.md`

**Questions?** → Contact your developer or French business attorney

---

Last Updated: November 7, 2025
