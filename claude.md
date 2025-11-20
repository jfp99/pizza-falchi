# CLAUDE.md - Workflow Développement S-Tier

> **Ce document est le cerveau opérationnel du projet. Il définit comment Claude Code et les MCP Servers travaillent ensemble pour livrer une application production-ready.**

---

## 🎯 CONTEXTE & OBJECTIFS

### Qui Je Suis

- **Freelance Senior** spécialisé en automatisations IA augmentées
- **Stack**: Next.js 15, TypeScript, MongoDB, MCP Servers
- **Valeur**: Développement custom à vitesse no-code avec qualité enterprise

### Ce Que Je Livre

- Applications production-ready
- Intégrations MCP custom
- Automatisations intelligentes (Claude + n8n)
- Documentation complète

### Standards Non-Négociables

- ✅ **Type-safe**: 100% TypeScript strict
- ✅ **Testé**: 80%+ coverage, E2E sur flows critiques
- ✅ **Sécurisé**: OWASP Top 10 appliqué
- ✅ **Accessible**: WCAG AA minimum
- ✅ **Documenté**: README, API docs, CHANGELOG

---

## 🔄 WORKFLOW DÉVELOPPEMENT AVEC MCP

### Vue d'ensemble

```
EXPLORE → PLAN → CODE → TEST → REVIEW → DEPLOY
   ↓        ↓       ↓       ↓        ↓         ↓
  MCP     MCP     MCP     MCP      MCP       MCP
```

### Phase 1: EXPLORE (Ne pas coder encore!)

**Objectif**: Comprendre avant d'agir

**MCP à utiliser**:
- Filesystem: Lire structure existante
- GitHub: Analyser repos similaires
- Notion: Récupérer specs client

**Prompt Template**:
```
Je dois implémenter [FEATURE].

Avant d'écrire du code:
1. Lis les fichiers pertinents: [liste]
2. Analyse l'architecture existante
3. Identifie les patterns utilisés
4. Note les dépendances impactées

Résume ta compréhension en 5 points clés.
Ne propose PAS de solution encore.
```

### Phase 2: PLAN (Think hard!)

**Objectif**: Plan détaillé avant implémentation

**Prompt Template**:
```
Basé sur ton exploration, crée un plan détaillé pour [FEATURE].

Le plan doit inclure:
1. Architecture: composants, flux de données
2. Database: schéma, migrations, indexes
3. API: endpoints, payloads, responses
4. UI: composants, states, interactions
5. Tests: unit, integration, E2E
6. Sécurité: validation, auth, sanitization
7. Risques: edge cases, dépendances, breaking changes
8. Rollback: comment annuler si problème

Chaque étape doit toucher <5 fichiers.
Pense HARD avant de répondre.
```

### Phase 3: CODE (Small diffs!)

**Objectif**: Implémentation incrémentale

**Règles absolues**:
- Diffs < 200 lignes par commit
- Un commit = une responsabilité
- Tests écrits AVEC le code (pas après)
- Checkpoints fréquents

**Prompt Template**:
```
Implémente l'étape [N] du plan: [DESCRIPTION]

Contraintes:
- Diff < 200 lignes
- Inclure les tests correspondants
- Suivre les patterns existants du projet
- Valider les inputs avec Zod
- Gérer les erreurs explicitement

Après implémentation:
1. Run les tests
2. Fix les erreurs
3. Commit avec message conventionnel

Format commit: type(scope): description
```

### Phase 4: TEST (TDD Loop)

**Objectif**: Validation complète

**Workflow TDD**:
```
1. Écrire le test (RED)
2. Vérifier qu'il échoue
3. Implémenter le minimum pour passer (GREEN)
4. Refactor si nécessaire
5. Commit
```

### Phase 5: REVIEW (Multi-Agent)

**Objectif**: Qualité et sécurité

**Utiliser des subagents spécialisés**:

**Security Agent**:
```
Agis comme un expert sécurité.
Review le code pour:
- Injection (SQL, NoSQL, XSS)
- Auth/AuthZ bypass
- Secrets exposés
- Input validation manquante
- Rate limiting absent

Liste chaque vulnérabilité avec sévérité et fix.
```

**Performance Agent**:
```
Agis comme un expert performance.
Analyse:
- Queries N+1
- Missing indexes
- Memory leaks
- Bundle size
- Lazy loading opportunities

Propose des optimisations concrètes.
```

**Code Quality Agent**:
```
Agis comme un senior reviewer.
Vérifie:
- Naming conventions
- DRY violations
- SOLID principles
- Error handling
- Documentation

Note de 1-10 avec justification.
```

### Phase 6: DEPLOY (Automated)

**Objectif**: Mise en production sécurisée

**Checklist pré-deploy**:
- [ ] Tests passent (100%)
- [ ] Build sans erreurs
- [ ] Lint clean
- [ ] Types check
- [ ] Coverage > 80%
- [ ] Env vars documentées
- [ ] Migrations prêtes
- [ ] Rollback plan

---

## 🧠 PROMPTS STRATÉGIQUES RÉUTILISABLES

### Analyse de Codebase
```
Analyse ce projet et génère:
1. Architecture diagram (mermaid)
2. Tech stack détecté
3. Patterns utilisés
4. Points d'amélioration
5. Technical debt identifié

Format: markdown structuré
```

### Refactoring Sécurisé
```
Refactor [FILE/COMPONENT] pour [OBJECTIF].

Contraintes:
- Garder la même API publique
- Pas de breaking changes
- Tests existants doivent passer
- Ajouter tests pour nouveau code

Procède par petits diffs avec commits.
```

### Debug Complexe
```
J'ai cette erreur: [ERROR]

Contexte:
- Fichier: [path]
- Action: [ce que je faisais]
- Attendu: [comportement attendu]
- Observé: [comportement réel]

Analyse:
1. Lis les fichiers pertinents
2. Identifie la root cause
3. Propose un fix
4. Explique pourquoi ça résout le problème
```

### API Design
```
Design l'API pour [FEATURE].

Inclure:
1. Endpoints (REST ou GraphQL)
2. Request/Response schemas (Zod)
3. Error codes et messages
4. Rate limiting strategy
5. Auth requirements
6. Exemples curl

Format: OpenAPI 3.0 ou schema TypeScript
```

### Database Schema
```
Design le schema pour [FEATURE].

Inclure:
1. Collections/Tables
2. Fields avec types
3. Relations
4. Indexes (performance)
5. Validation rules
6. Migration script

Optimise pour les queries fréquentes: [liste]
```

### Component UI
```
Crée le composant [NAME].

Specs:
- Props: [interface TypeScript]
- States: [liste des states]
- Events: [handlers]
- Responsive: mobile-first
- Accessible: ARIA, keyboard nav
- Style: Tailwind + Shadcn

Inclure:
1. Le composant
2. Tests RTL
3. Storybook story (si applicable)
```

---

## 📋 PROJECT DOCUMENTATION

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Code Style & Conventions

- **TypeScript:** Always use interfaces over types
- **Functions:** Prefer arrow functions
- **Line Length:** Maximum 100 characters
- **Quotes:** Use single quotes over double quotes
- **Naming:** Prefer verbose variable names over short ones (e.g., `userEmail` not `ue`)
- **Comments:** Explain complex logic with clear comments
- **HTML:** Use semantic HTML elements (header, nav, main, section, article, footer)

## Project Rules

- **Images:** All images must be under 500KB
- **Loading States:** Always add loading states for async operations
- **Mobile Testing:** Test on mobile before committing
- **Architecture:** Ask before making major architecture changes
- **Git:** Always show me the git diff before committing

---

## Tech Stack

- **Next.js 15.5.4** (App Router) with React 19
- **TypeScript** for type safety
- **Tailwind CSS 4.0** for styling
- **MongoDB** with Mongoose for data persistence
- **react-hot-toast** for notifications
- **Lucide React** for icons

## Development Commands

```bash
npm run dev              # Start dev server (standard webpack - stable)
npm run dev:turbo        # Start dev server with Turbopack (experimental, may fail on Windows)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run test             # Run tests with Vitest
npm run test:ui          # Run tests with UI
npm run test:coverage    # Run tests with coverage report
npm run seed             # Seed database with products (runs scripts/seedProducts.ts)
npm run seed:admin       # Create admin user
npm run verify-images    # Check for missing product images
npm run update:images    # Update all products with local images from public/images
npm run check:images     # Check first 5 products' image URLs
```

**Note:** Turbopack has known issues on Windows (exit code 0xc0000142). Use `npm run dev` for stable development.

## Architecture Overview

### State Management
- **Cart State:** Managed via `useCart` hook (hooks/useCart.ts) with localStorage persistence
- **Client-side State:** React hooks (useState, useEffect)
- **No global state management library** - local state per component

### Database Layer
- **Connection:** Singleton pattern in lib/mongodb.ts with connection caching for Next.js
- **Models:** Mongoose schemas in models/ directory:
  - `Product`: Products with categories (pizza, boisson, dessert, accompagnement)
  - `Order`: Orders with items, customer info, delivery details, and status tracking
  - `User`: User accounts with roles (admin, customer)

### API Routes (app/api/)
- `/api/products` - GET all products, POST new product
- `/api/products/[id]` - GET/PUT/DELETE single product
- `/api/orders` - GET all orders, POST new order
- `/api/orders/[id]` - GET/PUT single order
- `/api/auth/[...nextauth]` - NextAuth authentication
- `/api/admin/stats` - Admin dashboard statistics
- `/api/upload` - Image upload handling

### Type System
- **Central types:** Defined in types/index.ts
- **Key interfaces:** Product, CartItem, Order, OrderItem, DeliveryAddress
- All components use these shared interfaces for type safety

### Cart System
The cart hook (hooks/useCart.ts) provides:
- `addItem(product)` - Add/increment product
- `removeItem(productId)` - Remove product from cart
- `updateQuantity(productId, quantity)` - Update quantity
- `clearCart()` - Empty cart
- `getTotalItems()` - Total item count
- `getTotalPrice()` - Total price calculation
- Cart persists to localStorage automatically

## Design System

### Tailwind Configuration (tailwind.config.js)
Custom color palette defined:
- **primary:** red (#E30613), yellow (#FFD200) with dark/light variants
- **soft:** red (#F2828B), yellow (#FFE999) with lighter variants
- **basil:** green (#2D5016) for vegetarian indicators
- **cream/warm-cream:** Background colors (#FFF5E6, #FFF9F0)

### Design Philosophy
**IMPORTANT:** All design implementations must be:
- **Authentic:** True to Italian pizza culture and food truck aesthetics
- **Clean:** Minimalist, uncluttered layouts with clear visual hierarchy
- **Professional:** Polished, modern UI without excessive decoration
- **Functional:** Every element serves a purpose - no unnecessary embellishments
- Avoid overly playful or gimmicky elements unless specifically requested
- Prioritize readability and usability over visual complexity

### Design Patterns
- Glass-morphism effects: `bg-white/70 backdrop-blur`
- Rounded corners: `rounded-2xl`, `rounded-3xl`
- Smooth animations: `transition-all duration-300`
- Hover effects: `hover:shadow-2xl`, `transform hover:-translate-y-2`, `hover:scale-105`
- Gradient buttons: `bg-gradient-to-r from-primary-red to-soft-red`

## File Organization

```
app/
  ├── (pages)/              # Public pages
  ├── admin/                # Admin dashboard pages
  ├── api/                  # API routes
  └── layout.tsx            # Root layout with Navigation, Footer, Toaster

components/
  ├── admin/                # Admin-specific components
  ├── cart/                 # Cart components (CartSidebar, CartItem)
  ├── layout/               # Layout components (Navigation, Footer)
  ├── menu/                 # Menu components (ProductCard, CategoryFilter)
  └── providers/            # Context providers (AuthProvider)

hooks/
  └── useCart.ts            # Cart management hook

lib/
  └── mongodb.ts            # Database connection singleton

models/                     # Mongoose schemas
  ├── Product.ts
  ├── Order.ts
  └── User.ts

types/
  └── index.ts              # Shared TypeScript interfaces

scripts/
  └── seedProducts.ts       # Database seeding script

public/images/              # Static product images
  ├── pizzas/
  ├── boissons/
  ├── desserts/
  └── accompagnements/
```

## Order Flow

1. **Browse Menu** (app/menu/page.tsx) → Filter by category → View products
2. **Add to Cart** → useCart hook adds item → Persists to localStorage
3. **View Cart** (app/cart/page.tsx) → Review items → Adjust quantities
4. **Checkout** (app/checkout/page.tsx) → Enter delivery details → Submit order
5. **Order Confirmation** (app/order-confirmation/[id]/page.tsx) → Display order details
6. **Admin Dashboard** (app/admin/orders/page.tsx) → Track order status

### Order Status Lifecycle
`pending` → `confirmed` → `preparing` → `ready` → `completed`
(Can be `cancelled` at any point)

## Environment Variables

Required in `.env.local`:
- `MONGODB_URI` - MongoDB connection string

## Key Implementation Details

### MongoDB Connection Pattern
The connection singleton (lib/mongodb.ts) uses a global cache to prevent connection leaks in Next.js development mode where hot reloading can create multiple connections.

### Cart Persistence
The useCart hook uses two useEffect hooks:
1. Load cart from localStorage on mount
2. Save cart to localStorage on every change

### Product Categories
Products have 4 fixed categories: 'pizza', 'boisson', 'dessert', 'accompagnement'. The category filter and product queries use these exact strings.

### Image Management
Product images are stored in public/images/ with subdirectories by category. The verify-images script checks for missing images referenced in the database.

---

## S-Tier Development Principles

### Security Best Practices

#### I. Authentication & Authorization
- **Secure Session Management:** Use httpOnly, secure, and sameSite cookies for session tokens
- **Password Security:** Hash passwords with bcrypt (min 10 rounds) or Argon2
- **Role-Based Access Control (RBAC):** Implement proper admin/user role checks on all protected routes
- **API Route Protection:** Validate authentication on ALL API endpoints that modify data
- **Token Expiration:** Implement reasonable session timeouts (e.g., 7 days with refresh)
- **Logout Mechanism:** Clear sessions completely on logout (client + server)

#### II. Input Validation & Sanitization
- **Server-Side Validation:** NEVER trust client-side validation alone - validate on server
- **Input Sanitization:** Sanitize all user inputs before database operations
- **Type Validation:** Use TypeScript interfaces + runtime validation (e.g., Zod, Yup)
- **SQL/NoSQL Injection Prevention:** Use parameterized queries, ORM/ODM methods (Mongoose)
- **XSS Prevention:** Sanitize HTML inputs, use Content Security Policy headers
- **File Upload Security:** Validate file types, sizes, and sanitize filenames

#### III. API Security
- **Rate Limiting:** Implement rate limiting on API routes (especially auth endpoints)
- **CORS Configuration:** Restrict CORS to specific trusted domains in production
- **HTTP Security Headers:** Set proper headers (X-Frame-Options, X-Content-Type-Options, etc.)
- **HTTPS Only:** Enforce HTTPS in production, redirect HTTP to HTTPS
- **API Versioning:** Version APIs to prevent breaking changes
- **Error Messages:** Never expose stack traces or sensitive data in error responses

#### IV. Data Protection
- **Environment Variables:** NEVER commit secrets (.env files) to version control
- **Sensitive Data:** Never log passwords, tokens, or PII
- **Database Security:** Use connection string encryption, limit database user permissions
- **Encryption at Rest:** Encrypt sensitive data fields in database
- **Secure File Storage:** Store uploaded files outside web root or use cloud storage (S3)
- **Data Minimization:** Only collect and store necessary user data

#### V. Dependencies & Code Security
- **Regular Updates:** Keep dependencies updated, run `npm audit` regularly
- **Minimal Dependencies:** Only install necessary packages from trusted sources
- **Lock Files:** Commit package-lock.json to ensure consistent dependency versions
- **Code Review:** Review third-party code before integration
- **Subresource Integrity:** Use SRI for external scripts/CDN resources

---

### Accessibility Standards (WCAG 2.1 AA)

#### I. Semantic HTML & Structure
- **Semantic Elements:** Use proper HTML5 elements (header, nav, main, article, footer, aside)
- **Heading Hierarchy:** Maintain logical heading order (h1 → h2 → h3), don't skip levels
- **Landmark Regions:** Define clear page regions with ARIA landmarks when semantic HTML insufficient
- **Skip Links:** Provide 'Skip to main content' link for keyboard users
- **Document Language:** Set lang attribute on html element
- **Page Titles:** Unique, descriptive page titles for every route

#### II. Keyboard Navigation
- **Focus Management:** Ensure logical tab order for all interactive elements
- **Focus Indicators:** Clear visible focus states (outline, border, background change)
- **Keyboard Shortcuts:** Support common keyboard patterns (Esc to close, Enter to submit)
- **No Keyboard Traps:** Users can navigate away from all elements using only keyboard
- **Focus Restoration:** Return focus appropriately after modal/dialog closes
- **Interactive Elements:** All clickable elements must be keyboard accessible (no onClick on divs)

#### III. Color & Contrast
- **Contrast Ratios:** Minimum 4.5:1 for normal text, 3:1 for large text (WCAG AA)
- **Color Independence:** Never rely on color alone to convey information
- **Link Identification:** Links distinguishable from text (underline, bold, icons)
- **Error Indication:** Use icons/text + color for error states
- **Focus Indicators:** 3:1 contrast ratio for focus indicators against background

#### IV. Screen Reader Support
- **Alt Text:** Descriptive alt text for all images (empty alt="" for decorative images)
- **ARIA Labels:** Use aria-label/aria-labelledby for non-text interactive elements
- **ARIA States:** Update aria-expanded, aria-selected, aria-checked dynamically
- **Form Labels:** Every form input has associated label element or aria-label
- **Error Messages:** Associate error messages with inputs via aria-describedby
- **Live Regions:** Use aria-live for dynamic content updates (toasts, notifications)
- **Button Labels:** Descriptive button text, not just icons (or aria-label for icon-only)

#### V. Forms & Inputs
- **Clear Labels:** Visible, associated labels for all form controls
- **Required Fields:** Mark required fields clearly (visual + aria-required)
- **Input Purpose:** Use autocomplete attributes (name, email, tel, address)
- **Error Handling:** Clear, specific error messages near relevant fields
- **Field Groups:** Use fieldset/legend for radio buttons and checkboxes
- **Help Text:** Provide helper text via aria-describedby

#### VI. Media & Content
- **Video Captions:** Provide captions/subtitles for video content
- **Audio Transcripts:** Provide text transcripts for audio content
- **Animation Control:** Allow users to pause, stop, or hide animations
- **No Auto-Play:** Don't auto-play audio/video without user interaction
- **Text Resize:** Support text resize up to 200% without breaking layout
- **Readable Text:** Minimum 16px font size for body text

---

### SEO Optimization

#### I. Technical SEO
- **Meta Tags:** Unique title (50-60 chars), description (150-160 chars) for every page
- **Open Graph Tags:** og:title, og:description, og:image, og:url for social sharing
- **Twitter Cards:** twitter:card, twitter:title, twitter:description, twitter:image
- **Canonical URLs:** Set canonical link to prevent duplicate content issues
- **Sitemap:** Generate and submit XML sitemap to search engines
- **Robots.txt:** Configure robots.txt to allow/disallow crawling appropriately
- **Structured Data:** Implement JSON-LD schema markup (Product, Organization, Review, etc.)
- **Mobile-Friendly:** Ensure responsive design, passes Google Mobile-Friendly Test

#### II. Performance for SEO
- **Core Web Vitals:** Optimize for LCP (<2.5s), FID (<100ms), CLS (<0.1)
- **Page Speed:** Target PageSpeed Insights score >90
- **Image Optimization:** Use Next.js Image component, WebP format, lazy loading
- **Server Response Time:** Optimize API routes, database queries (<200ms TTFB)

#### III. Content & Structure
- **URL Structure:** Clean, descriptive URLs (kebab-case), avoid query parameters when possible
- **Internal Linking:** Strategic internal links with descriptive anchor text
- **Heading Structure:** Use h1 for main heading, h2-h6 for subheadings (content hierarchy)
- **Alt Text:** Descriptive alt text for images (helps SEO + accessibility)
- **Content Quality:** Original, valuable content with target keywords naturally integrated
- **Mobile-First:** Design for mobile first (Google mobile-first indexing)

#### IV. Next.js Specific
- **Metadata API:** Use Next.js 15 metadata API for dynamic meta tags
- **Static Generation:** Use generateStaticParams for static pages when possible
- **Server Components:** Leverage React Server Components for faster initial loads
- **Dynamic Imports:** Code-split heavy components with next/dynamic

---

### Performance Optimization

#### I. Core Web Vitals
- **Largest Contentful Paint (LCP):** <2.5s (optimize images, fonts, server response)
- **First Input Delay (FID):** <100ms (minimize JavaScript execution time)
- **Cumulative Layout Shift (CLS):** <0.1 (reserve space for images, avoid layout shifts)
- **Time to First Byte (TTFB):** <200ms (optimize server, use CDN)
- **First Contentful Paint (FCP):** <1.8s (critical CSS, defer non-critical resources)

#### II. Image Optimization
- **Next.js Image Component:** Always use next/image for automatic optimization
- **Modern Formats:** Use WebP/AVIF with fallbacks
- **Responsive Images:** Serve appropriately sized images per viewport
- **Lazy Loading:** Implement lazy loading for below-fold images
- **Image Compression:** Compress images <500KB (as per project rules), use tools like Squoosh
- **Dimensions:** Always specify width/height to prevent layout shift

#### III. JavaScript & Bundle Optimization
- **Code Splitting:** Split code by route, lazy load components with dynamic imports
- **Tree Shaking:** Remove unused code, analyze bundle with @next/bundle-analyzer
- **Minification:** Enable in production (automatic in Next.js)
- **Third-Party Scripts:** Use next/script with appropriate loading strategy
- **Remove Console Logs:** Strip console.log statements in production
- **Bundle Size:** Keep initial bundle <200KB gzipped

#### IV. CSS Optimization
- **Tailwind Purging:** Ensure Tailwind purges unused CSS (automatic in production)
- **Critical CSS:** Inline critical CSS for above-fold content
- **CSS-in-JS:** If using, optimize with compile-time extraction
- **Font Loading:** Use font-display: swap, preload critical fonts

#### V. Caching & CDN
- **Static Assets:** Set long cache headers for immutable assets (images, JS, CSS)
- **API Caching:** Implement caching strategies (SWR, React Query, server-side cache)
- **CDN Usage:** Serve static assets from CDN (Vercel Edge Network)
- **Service Worker:** Consider PWA with service worker for offline support
- **Database Query Caching:** Cache frequent database queries (Redis, in-memory)

#### VI. Rendering Strategies
- **Static Generation (SSG):** Use for pages that don't change frequently
- **Incremental Static Regeneration (ISR):** Use for semi-dynamic content
- **Server-Side Rendering (SSR):** Use only when necessary for dynamic data
- **Client-Side Rendering:** Minimize for initial page load, use for interactivity
- **React Server Components:** Leverage for zero-bundle server-rendered components

#### VII. Database & API Performance
- **Query Optimization:** Index frequently queried fields, use projection to limit fields
- **Connection Pooling:** Reuse database connections (singleton pattern in lib/mongodb.ts)
- **Pagination:** Implement cursor-based or offset pagination for large datasets
- **Data Fetching:** Fetch only necessary data, avoid N+1 queries
- **Rate Limiting:** Prevent abuse with rate limiting on API routes

---

### Testing & Quality Assurance (TDD)

#### I. Testing Philosophy
- **Test-Driven Development:** Write tests before implementation when possible
- **Test Coverage:** Aim for >80% code coverage on critical paths
- **Test Pyramid:** More unit tests, fewer integration tests, minimal E2E tests
- **Fast Tests:** Keep unit tests fast (<1s total), run frequently during development
- **Isolated Tests:** Tests should not depend on each other, can run in any order

#### II. Unit Testing
- **Pure Functions:** Test all pure utility functions with multiple scenarios
- **Component Testing:** Test React components in isolation with React Testing Library
- **User-Centric Tests:** Test behavior from user perspective, not implementation details
- **Edge Cases:** Test error conditions, empty states, loading states, edge cases
- **Mocking:** Mock external dependencies (API calls, database, third-party services)
- **Async Testing:** Properly handle async operations with waitFor, findBy queries

#### III. Integration Testing
- **API Routes:** Test API endpoints with mock database
- **Database Operations:** Test CRUD operations with test database
- **Authentication Flows:** Test login, logout, protected routes
- **Data Transformations:** Test complex data processing pipelines
- **Error Scenarios:** Test error handling and edge cases

#### IV. End-to-End Testing
- **Critical Paths:** Test key user journeys (checkout flow, order placement)
- **Cross-Browser:** Test on major browsers (Chrome, Firefox, Safari)
- **Mobile Testing:** Test on mobile devices/viewports before committing (project rule)
- **Performance Testing:** Monitor load times, Core Web Vitals in production
- **Accessibility Testing:** Automated accessibility tests (axe, pa11y)

#### V. Testing Best Practices
- **Descriptive Test Names:** Use clear, descriptive test names (describe what, not how)
- **Arrange-Act-Assert:** Structure tests with clear setup, action, and assertion
- **One Assertion Focus:** Each test should focus on one behavior/scenario
- **Test Data:** Use realistic test data, factories for complex objects
- **Cleanup:** Clean up after tests (reset mocks, clear test data)
- **CI/CD Integration:** Run tests automatically on commits, PRs

#### VI. Quality Checks
- **Linting:** Run ESLint before commits, fix all warnings
- **Type Checking:** TypeScript strict mode enabled, no `any` types unless justified
- **Format Checking:** Use Prettier for consistent code formatting
- **Pre-commit Hooks:** Run lint, type-check, and tests before allowing commits
- **Code Review:** All changes reviewed by another developer when possible
- **Security Scanning:** Regular dependency audits with `npm audit`

#### VII. Testing Tools (Current Stack)
- **Vitest:** Unit and integration testing framework
- **React Testing Library:** Component testing with user-centric approach
- **Coverage Reports:** Use `npm run test:coverage` to track coverage
- **Test UI:** Use `npm run test:ui` for interactive test debugging
- **Mock Service Worker (MSW):** Consider for API mocking in tests

---

## Implementation Checklist

When implementing new features, ensure you follow this checklist:

**Before Starting:**
- [ ] Understand the requirement fully
- [ ] Check existing patterns in the codebase
- [ ] Plan the implementation approach
- [ ] Identify security, accessibility, and performance implications

**During Development:**
- [ ] Write tests first (TDD) or alongside implementation
- [ ] Use TypeScript interfaces for all data structures
- [ ] Validate all inputs (client + server)
- [ ] Add proper error handling
- [ ] Implement loading states for async operations
- [ ] Ensure keyboard accessibility
- [ ] Add ARIA labels where needed
- [ ] Optimize images (<500KB)
- [ ] Use semantic HTML
- [ ] Follow existing code style conventions

**Before Committing:**
- [ ] Run linter: `npm run lint`
- [ ] Run tests: `npm run test`
- [ ] Test on mobile viewport
- [ ] Check accessibility (keyboard navigation, screen reader)
- [ ] Verify no console errors
- [ ] Review git diff
- [ ] Ensure no secrets in code
- [ ] Check bundle size impact (if applicable)

**Production Readiness:**
- [ ] Test in production-like environment
- [ ] Verify SEO meta tags
- [ ] Check Core Web Vitals
- [ ] Test on multiple browsers
- [ ] Verify error logging works
- [ ] Ensure database indexes exist for new queries
- [ ] Update documentation if needed

---

## 🔌 CONFIGURATION MCP

### MCP Essentiels

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/project"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "$GITHUB_TOKEN" }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "$DATABASE_URL"]
    }
  }
}
```

### MCP Business (Optional)

```json
{
  "notion": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-notion"],
    "env": { "NOTION_TOKEN": "$NOTION_TOKEN" }
  },
  "slack": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-slack"],
    "env": { "SLACK_TOKEN": "$SLACK_TOKEN" }
  }
}
```

### Permissions Recommandées

```bash
# Auto-approve safe operations
/permissions add Edit
/permissions add "Bash(npm:*)"
/permissions add "Bash(git commit:*)"
/permissions add "Bash(git push:*)"
/permissions add "Bash(npm test:*)"

# MCP tools (adjust based on your MCP servers)
/permissions add mcp__*
```

---

## 📊 MÉTRIQUES SUCCÈS

### Par Projet

- **Time to first commit**: < 30min
- **Test coverage**: > 80%
- **Build time**: < 2min
- **Lighthouse score**: > 90
- **Zero critical vulnerabilities**

### Par Sprint

- **PRs merged sans rework**: > 90%
- **Bugs en prod**: 0
- **Client satisfaction**: 5/5

### Core Web Vitals Targets

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **TTFB** (Time to First Byte): < 200ms

---

## 🚀 SLASH COMMANDS CUSTOM

Create these files in `.claude/commands/` for reusable workflows:

### .claude/commands/fix-issue.md

```markdown
Analyse et fix le GitHub issue: $ARGUMENTS

1. `gh issue view` pour les détails
2. Comprendre le problème
3. Chercher les fichiers pertinents
4. Implémenter le fix
5. Écrire/update les tests
6. Commit avec "fix: [description]"
7. Créer PR si nécessaire
```

### .claude/commands/create-component.md

```markdown
Crée le composant: $ARGUMENTS

1. Génère le composant dans components/
2. Ajoute les tests RTL
3. Props typées avec interface
4. Responsive + accessible
5. Export depuis index.ts
6. Update Storybook si applicable
```

### .claude/commands/deploy.md

```markdown
Prépare le déploiement:

1. Run `npm run test`
2. Run `npm run build`
3. Check `npm run lint`
4. Génère CHANGELOG si needed
5. Crée PR avec description complète
6. Tag version (semver)
```

### .claude/commands/security-audit.md

```markdown
Effectue un audit sécurité:

1. Scan des dépendances: `npm audit`
2. Check des secrets exposés
3. Review validation inputs
4. Vérifier auth/authz
5. Test rate limiting
6. Check CORS config
7. Générer rapport avec recommandations
```

---

**Version**: 2.0
**Dernière mise à jour**: Novembre 2025
