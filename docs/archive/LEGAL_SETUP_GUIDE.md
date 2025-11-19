# 📋 Legal Compliance Setup Guide for Pizza Falchi Owner

This guide explains what information you (the business owner) need to provide to complete the legal pages before launching the website in production.

---

## ⚠️ IMPORTANT: Required Information

The following placeholders **MUST** be filled before deploying to production. These are **mandatory legal requirements** under French law (LCEN Article 6).

### 1️⃣ Business Registration Information

You need to provide the following information from your SARL registration documents:

#### **SIRET Number** (14 digits)
- **What it is**: Your unique business identification number assigned by INSEE
- **Format**: XXX XXX XXX XXXXX (14 digits)
- **Example**: `123 456 789 00012`
- **Where to find it**:
  - On your KBIS extract (extrait Kbis)
  - On your SIRET certificate from INSEE
  - On official documents from URSSAF

#### **SIREN Number** (9 digits)
- **What it is**: Your company identification number
- **Format**: XXX XXX XXX (9 digits)
- **Example**: `123 456 789`
- **How to get it**: It's the **first 9 digits** of your SIRET number
  - If SIRET is `123 456 789 00012`, then SIREN is `123 456 789`

#### **TVA Intracommunautaire** (VAT Number)
- **What it is**: Your European VAT number (mandatory for SARL)
- **Format**: FR XX XXXXXXXXX
- **Example**: `FR 12 123456789`
- **Where to find it**:
  - On your KBIS extract
  - On your tax documents
  - On impots.gouv.fr in your professional space

#### **Capital Social** (Share Capital)
- **What it is**: The registered share capital of your SARL
- **Format**: Amount in euros
- **Example**: `5 000 €` or `10 000 €`
- **Where to find it**:
  - On your KBIS extract (extrait Kbis)
  - In your company statutes (statuts de la société)
  - Minimum required: 1€ (but typically 1,000€ to 10,000€)

#### **RCS Registration** (Registre du Commerce et des Sociétés)
- **What it is**: Your registration in the Trade and Companies Register
- **Format**: City + SIREN number
- **Example**: `Aix-en-Provence 123 456 789` or `Marseille 987 654 321`
- **Where to find it**:
  - On your KBIS extract (first page)
  - Format is usually: [City name] + [SIREN number]

#### **Gérant Name** (Company Manager)
- **What it is**: The full first and last name of the company manager (gérant)
- **Format**: Prénom NOM
- **Example**: `Marie ROSSI` or `Jean DUPONT`
- **Where to find it**:
  - On your KBIS extract
  - In your company statutes
- **Note**: This is the person legally representing the SARL

---

## 📝 Files to Update

### File 1: `app/mentions-legales/page.tsx`

**Lines to update:**
- **Line ~59**: Replace `[À COMPLÉTER]` with your SIRET number
- **Line ~61**: Replace `[À COMPLÉTER]` with your SIREN number
- **Line ~63**: Replace `[À COMPLÉTER]` with your VAT number
- **Line ~65**: Replace `[À COMPLÉTER]` with your Capital social amount
- **Line ~67**: Replace `[À COMPLÉTER]` with your RCS registration
- **Line ~106**: Replace `[À COMPLÉTER - Nom et prénom du gérant]` with gérant's full name

**Look for comments marked with**: `⚠️ BUSINESS OWNER:`

**Example before:**
```tsx
<p><strong>Forme juridique :</strong> SARL</p>
<p><strong>SIRET :</strong> [À COMPLÉTER]</p>
<p><strong>Capital social :</strong> [À COMPLÉTER] €</p>
<p><strong>RCS :</strong> [À COMPLÉTER - Ville et numéro RCS]</p>
```

**Example after:**
```tsx
<p><strong>Forme juridique :</strong> SARL</p>
<p><strong>SIRET :</strong> 123 456 789 00012</p>
<p><strong>Capital social :</strong> 5 000 €</p>
<p><strong>RCS :</strong> Aix-en-Provence 123 456 789</p>
```

---

### File 2: `app/conditions-generales-vente/page.tsx`

**Lines to update:**
- **Line ~57**: Replace `[À COMPLÉTER]` with your SIRET number
- **Line ~59**: Replace `[À COMPLÉTER]` with your RCS registration
- **Line ~61**: Replace `[À COMPLÉTER]` with your Capital social amount

**Look for comments**: `⚠️ BUSINESS OWNER:`

---

## 📋 Step-by-Step Instructions

### Step 1: Gather Your Information

**You will need your KBIS extract (extrait Kbis).** This official document contains all the required information.

Create a text file with your information:
```
SIRET: [Your 14-digit number from KBIS]
SIREN: [First 9 digits of SIRET]
TVA: [Your VAT number from KBIS - format FR XX XXXXXXXXX]
Capital social: [Share capital amount from KBIS - e.g., 5 000 €]
RCS: [City and SIREN from KBIS - e.g., Aix-en-Provence 123 456 789]
Gérant: [Manager's full name from KBIS]
```

### Step 2: Update Mentions Légales

1. Open `app/mentions-legales/page.tsx` in your code editor
2. Search for `[À COMPLÉTER]` (there are 6 occurrences)
3. Replace each one with the corresponding information from your KBIS
4. Save the file

### Step 3: Update CGV

1. Open `app/conditions-generales-vente/page.tsx`
2. Search for `[À COMPLÉTER]` (there are 3 occurrences)
3. Replace with SIRET, RCS, and Capital social from your KBIS
4. Save the file

### Step 4: Test the Changes

1. Start the development server: `npm run dev`
2. Visit http://localhost:3004/mentions-legales
3. Verify all information appears correctly
4. Visit http://localhost:3004/conditions-generales-vente
5. Verify SIRET appears correctly
6. Check that no `[À COMPLÉTER]` text remains

---

## ✅ Verification Checklist

Before deploying to production, verify:

- [ ] SIRET number is filled in Mentions Légales (14 digits)
- [ ] SIREN number is filled in Mentions Légales (9 digits)
- [ ] TVA number is filled in Mentions Légales (format: FR XX XXXXXXXXX)
- [ ] Capital social is filled in Mentions Légales (e.g., 5 000 €)
- [ ] RCS registration is filled in Mentions Légales (City + SIREN)
- [ ] Gérant's full name is filled as "Directeur de la publication"
- [ ] SIRET, RCS, and Capital social are filled in CGV
- [ ] No text containing `[À COMPLÉTER]` remains on the website
- [ ] All information matches your KBIS extract exactly

---

## 🔒 Legal Compliance Status

### ✅ Already Completed (No Action Needed)

The following legal pages are **ready to use** and require no modifications:

1. **Politique de Confidentialité** (Privacy Policy) - `/politique-confidentialite`
2. **Politique des Cookies** (Cookie Policy) - `/politique-cookies`
3. **Conditions Générales d'Utilisation** (Terms of Use) - `/conditions-generales-utilisation`
4. **Déclaration d'Accessibilité** (Accessibility) - `/accessibilite`
5. **Exercer mes Droits RGPD** (GDPR Rights Form) - `/exercer-mes-droits`
6. **Cookie Consent Banner** (Tarteaucitron.js) - Automatically appears on site

### 📋 Compliance Features

Your website now includes:

- ✅ **RGPD/GDPR Compliance** - Full compliance with EU data protection regulation
- ✅ **CNIL Guidelines** - Cookie consent follows French CNIL recommendations
- ✅ **French E-commerce Law** - Complies with Code de la Consommation
- ✅ **CGV Acceptance** - Customers must accept CGV before ordering
- ✅ **Data Protection Rights** - Interactive form for users to exercise GDPR rights
- ✅ **Accessibility Statement** - RGAA compliance declaration
- ✅ **Footer Integration** - All legal links accessible from every page

---

## 📞 Need Help?

### Finding Your KBIS Extract

1. **Online**: Order at www.infogreffe.fr (official, costs ~3€)
2. **By Phone**: Contact your local Greffe du Tribunal de Commerce
3. **Recent Creation**: If just created your SARL, check email or CFE documents

### If You Lost Your KBIS

- **Order New Extract**: www.infogreffe.fr (extrait Kbis)
- **Urgent Need**: Visit your local Greffe du Tribunal de Commerce
- **Digital Copy**: MonIdenum platform if you have an account

### Legal Questions

For legal questions about the content of legal pages, consult:
- A French business attorney (avocat d'affaires)
- Your local Chamber of Commerce (CCI)
- CNIL for data protection questions: www.cnil.fr

---

## 🚀 After Completing This Setup

Once you've filled in all placeholders:

1. ✅ Test all legal pages on your local server
2. ✅ Have a legal professional review the content (recommended)
3. ✅ Deploy to production with confidence
4. ✅ Your website will be legally compliant for French e-commerce

---

## 📅 Maintenance

### Regular Updates

- Review legal pages every 6-12 months
- Update if business structure changes (e.g., moving from auto-entrepreneur to EURL)
- Update if contact information changes
- Update if you add new data processing activities

### GDPR Data Processing Agreements

You should sign Data Processing Agreements (DPAs) with:
- MongoDB (database)
- Stripe (payment processing)
- Twilio SendGrid (email)
- Resend (email)
- Google Analytics (if used)

Most of these services provide standard DPAs in their admin dashboards.

---

**Last Updated**: November 7, 2025
**Developer Note**: This guide is for the Pizza Falchi business owner to complete the legal compliance setup.
