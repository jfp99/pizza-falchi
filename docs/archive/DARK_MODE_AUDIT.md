# Dark Mode Styling Audit - Pizza Falchi

## Overview
This audit identifies all components and pages that need dark mode styling (dark: variants). The codebase has a dark mode infrastructure in place (ThemeProvider, theme toggle), but many components lack dark: variants in their Tailwind CSS classes.

## Current Dark Mode Implementation Status

### Already Implemented (Good Examples)
- Navigation.tsx - Has comprehensive dark: variants
- Footer.tsx - Complete dark mode support
- ThemeToggle.tsx - Built for dark mode switching
- Home page (page.tsx) - Has most dark: variants
- About page (page.tsx) - Has dark: variants
- Card component - Complete dark mode support
- ProductCard.tsx - Has dark: variants

### Missing Dark Mode Support (Priority Order)

## HIGH PRIORITY - Critical User-Facing Pages & Components

### 1. Contact Page (/app/contact/page.tsx)
Status: Missing dark mode
Issues:
- Line 27: min-h-screen bg-warm-cream needs dark:bg-gray-900
- Hero section background is hardcoded to light colors
- All text colors need dark variants
- Form inputs need dark styling
- Buttons and links need dark variants

### 2. Category Filter (/components/menu/CategoryFilterWithIcons.tsx)
Status: Missing dark mode
Issues:
- Line 23-26: Inactive buttons hardcoded to bg-white and text-charcoal
- No dark variants for selected/inactive states
- Border colors hardcoded

### 3. Menu Page (/app/menu/page.tsx)
Status: Partially implemented
Issues:
- Search bar styling needs dark variants
- Filter buttons need dark mode
- Section backgrounds hardcoded to light colors
- Special offer banner needs dark mode integration

### 4. Cart Page (/app/cart/page.tsx)
Status: Missing dark mode
Issues:
- Line 33: bg-gradient-to-br from-warm-cream to-primary-yellow/10 needs dark variant
- Line 59: Same gradient issue
- Cart item containers hardcoded to light colors
- All text and background colors need dark support

### 5. Checkout Page (/app/checkout/page.tsx)
Status: Missing dark mode
Issues:
- Form backgrounds and inputs need dark variants
- Section backgrounds hardcoded
- All form elements need dark styling
- Summary section needs dark mode

### 6. Product Detail Page (/app/products/[id]/page.tsx)
Status: Partially missing
Issues:
- Product image container: bg-white needs dark:bg-gray-800
- Badge colors hardcoded
- All text colors need dark variants
- Ingredient list styling needs dark mode
- Review section needs dark mode

### 7. Special Offer Banner (/components/promotions/SpecialOfferBanner.tsx)
Status: Missing dark mode
Issues:
- Line 11: bg-warm-cream hardcoded
- Gradient backgrounds have light colors only
- Text colors hardcoded to charcoal
- No dark variants for any elements

## MEDIUM PRIORITY - Supporting Components

### 8. Newsletter Signup (/components/newsletter/NewsletterSignup.tsx)
Status: Partially missing
Issues:
- Line 74: bg-warm-cream/50 needs dark variant
- Input styling: border-gray-300 needs dark variant
- Button styling inconsistent
- Text colors hardcoded

### 9. Package Card (/components/packages/PackageCard.tsx)
Status: Missing dark mode
Issues:
- Line 79: bg-white hardcoded
- Badge backgrounds hardcoded
- All content areas hardcoded to light colors
- Icon background: bg-gray-50 needs dark variant
- Items list: bg-gray-50 needs dark variant

### 10. Cart Sidebar (/components/cart/CartSidebar.tsx)
Status: Partially implemented
Issues:
- Line 29: bg-white has dark variant but can be improved
- Item styling needs review

## LOW PRIORITY - Admin Pages & Less Visible Components

### 11-23. Admin Pages (/app/admin/*)
Affected Pages:
- /app/admin/page.tsx - Dashboard
- /app/admin/orders/page.tsx - Orders
- /app/admin/products/page.tsx - Products
- /app/admin/customers/page.tsx - Customers
- /app/admin/newsletter/page.tsx - Newsletter
- /app/admin/promo-codes/page.tsx - Promo codes
- /app/admin/reviews/page.tsx - Reviews
- /app/admin/time-slots/page.tsx - Time slots
- /app/admin/opening-hours/page.tsx - Opening hours

### 24-26. User Account Pages
- /app/my-orders/page.tsx - Order history
- /app/wishlist/page.tsx - Wishlist
- /app/auth/signin/page.tsx - Sign in

### 27-40. Utility Components
- ProgressiveImage.tsx
- Skeleton.tsx
- PhoneButton.tsx
- Badge.tsx
- ProductCardSkeleton.tsx
- CartItemSkeleton.tsx
- PackageCardSkeleton.tsx
- And other utility components

## Color Mapping for Dark Mode

Light Mode              Dark Mode
bg-white           →    dark:bg-gray-800
bg-gray-50         →    dark:bg-gray-700
bg-gray-100        →    dark:bg-gray-700
bg-warm-cream      →    dark:bg-gray-900

text-charcoal      →    dark:text-gray-100
text-gray-900      →    dark:text-gray-100
text-gray-700      →    dark:text-gray-300
text-gray-600      →    dark:text-gray-400

border-gray-100    →    dark:border-gray-700
border-gray-200    →    dark:border-gray-600
border-gray-300    →    dark:border-gray-600

## Recommended Implementation Order

1. Phase 1 (Critical): Contact, Menu, Cart, Checkout
2. Phase 2 (Important): Product Detail, Special Offer, Package Card, Newsletter
3. Phase 3 (Admin): Admin dashboard pages
4. Phase 4 (Polish): Utility components, skeletons, minor components

