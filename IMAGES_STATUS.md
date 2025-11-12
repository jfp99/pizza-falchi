# 📸 Statut des Images - Pizza Falchi

**Date:** 2025-11-10
**Progression:** 4/51 images (7.8%) ✅

---

## ✅ Ce qui a été accompli

### 1. **Scripts de Gestion d'Images**

✅ **Script de Validation** (`scripts/validateImages.ts`)
- Vérifie quelles images existent et lesquelles manquent
- Détecte les images trop volumineuses (>500KB)
- Fournit un rapport détaillé par catégorie
- **Commande:** `npm run validate-images`

✅ **Script de Compression** (`scripts/compressImages.ts`)
- Compresse automatiquement les images >500KB
- Utilise Sharp avec optimisation JPEG mozjpeg
- Crée des backups avant compression
- Maintient la qualité visuelle
- **Commande:** `npm run compress-images`

### 2. **Optimisation des Images Existantes**

✅ **Images compressées avec succès:**
- `chouffe.jpg`: 1321.1KB → 425.4KB (-67.8%)
- `corona.jpg`: 688.8KB → 163.6KB (-76.3%)
- **Total économisé:** 1420.9KB

✅ **Images déjà optimisées:**
- `4-fromages.jpg`: 219.1KB ✅
- `heineken.jpg`: 399.4KB ✅

### 3. **Guide de Téléchargement Complet**

✅ **Document créé:** `IMAGE_DOWNLOAD_GUIDE.md`
- 28 produits prioritaires avec URLs Unsplash/Pexels
- Instructions de recherche spécifiques
- Nomenclature exacte des fichiers
- Checklist de progression

---

## 📊 État Actuel des Images

### Images Présentes (4/51)

#### Pizzas (1/39)
- ✅ `4-fromages.jpg` (219.1KB)
- ✅ `custom-pizza.jpg` (269.8KB) - Pour pizza builder
- ✅ `margherita.jpg` (269.8KB) - Non utilisé dans DB

#### Boissons (3/12)
- ✅ `heineken.jpg` (399.4KB)
- ✅ `corona.jpg` (163.6KB) - Optimisé
- ✅ `chouffe.jpg` (425.4KB) - Optimisé

### Images Manquantes (47/51)

#### Pizzas Prioritaires (16/17 manquantes)
- ❌ `fromage.jpg`
- ❌ `jambon.jpg`
- ❌ `regina.jpg`
- ❌ `savoyarde.jpg`
- ❌ `kebab.jpg`
- ❌ `chevre-miel.jpg`
- ❌ `normande.jpg`
- ❌ `chicken.jpg`
- ❌ `savoyarde-creme.jpg`
- ❌ `4-fromages-creme.jpg`
- ❌ `chevre-miel-creme.jpg`
- ❌ `kebab-creme.jpg`
- ❌ `vegetarienne.jpg`
- ❌ `mexicana.jpg`
- ❌ `orientale.jpg`
- ❌ `pagnol.jpg`

#### Boissons Prioritaires (9/12 manquantes)
- ❌ `vin-rouge.jpg`
- ❌ `vin-rose.jpg`
- ❌ `vin-blanc.jpg`
- ❌ `san-miguel.jpg`
- ❌ `perrier.jpg`
- ❌ `coca-cola-bouteille.jpg`
- ❌ `cristaline.jpg`
- ❌ `soft.jpg`
- ❌ `ice-tea-bouteille.jpg`

#### Autres Pizzas (22 manquantes)
Voir `IMAGE_DOWNLOAD_GUIDE.md` pour la liste complète

---

## 🎯 Prochaines Étapes

### Option 1: Téléchargement Manuel (Recommandé)

**Temps estimé:** 2-3 heures pour toutes les images

1. **Ouvrir le guide**
   ```bash
   # Voir IMAGE_DOWNLOAD_GUIDE.md
   ```

2. **Télécharger les images prioritaires** (25 images)
   - Suivre les URLs Unsplash/Pexels fournies
   - Rechercher par mots-clés spécifiques
   - Choisir les images les plus appétissantes

3. **Placer dans les bons dossiers**
   ```
   public/images/menu/pizzas/[nom-fichier].jpg
   public/images/menu/boissons/[nom-fichier].jpg
   ```

4. **Compresser automatiquement**
   ```bash
   npm run compress-images
   ```

5. **Vérifier la progression**
   ```bash
   npm run validate-images
   ```

### Option 2: Téléchargement par Lots

**Pour accélérer le processus:**

1. **Créer un compte Unsplash API** (gratuit)
   - Permet de télécharger par script
   - 50 images/heure en mode gratuit

2. **Utiliser un outil de téléchargement**
   - Extension navigateur pour téléchargement en masse
   - Wget/curl avec liste d'URLs

3. **Renommer en batch**
   - Script PowerShell pour renommage automatique
   - Ou utiliser un outil comme Bulk Rename Utility

### Option 3: Images Temporaires

**Solution rapide pour test:**

1. **Utiliser les placeholders actuels** (déjà en place)
   - Placeholder dynamiques pour pizzas ✅
   - Placeholder SVG pour boissons ✅

2. **Ajouter des images une par une**
   - Commencer par les 5 pizzas les plus populaires
   - Progression graduelle sans tout bloquer

---

## 📝 Workflow Recommandé

### Téléchargement Quotidien

**Jour 1: Pizzas populaires (8 images)**
- fromage, jambon, regina, 4-fromages ✅, savoyarde, kebab, chevre-miel, normande

**Jour 2: Pizzas crème & spécialités (8 images)**
- chicken, vegetarienne, mexicana, orientale, pagnol, savoyarde-creme, 4-fromages-creme, chevre-miel-creme

**Jour 3: Boissons (9 images)**
- vins (3), bières manquantes (1), soft drinks (5)

**Jour 4: Autres pizzas (22 images)**
- Toutes les pizzas restantes du menu

### Après chaque session

```bash
# 1. Compresser les nouvelles images
npm run compress-images

# 2. Vérifier la progression
npm run validate-images

# 3. Tester visuellement
npm run dev
# Aller sur http://localhost:3001/menu
```

---

## 🔧 Commandes Utiles

```bash
# Voir l'état actuel des images
npm run validate-images

# Compresser toutes les images >500KB
npm run compress-images

# Lancer le serveur de développement
npm run dev

# Réinitialiser la base de données avec les nouvelles images
npm run seed:atlas:force
```

---

## 📚 Ressources

### Sites d'Images Gratuites
- **Unsplash:** https://unsplash.com/ (Haute qualité, libre de droits)
- **Pexels:** https://www.pexels.com/ (Gratuit, commercial OK)
- **Pixabay:** https://pixabay.com/ (Alternative)

### Outils de Compression
- **TinyPNG:** https://tinypng.com/ (En ligne, gratuit)
- **Squoosh:** https://squoosh.app/ (Google, offline-capable)
- **Notre script:** `npm run compress-images` ✅ (Automatique)

### Images Produits Officielles
- **Coca-Cola:** Site officiel presse
- **Heineken:** Site officiel
- **Perrier:** Nestlé Waters press kit
- **San Miguel:** Site officiel

---

## ⚠️ Rappels Importants

1. **Taille maximale:** 500KB par image (script compresse automatiquement)
2. **Format:** JPEG préféré (meilleur ratio compression/qualité)
3. **Nommage:** Exactement comme indiqué dans le guide (kebab-case)
4. **Qualité:** Privilégier les photos appétissantes et professionnelles
5. **Droits:** Utiliser uniquement des images libres de droits

---

## 🎉 Progression Cible

| Catégorie | Actuel | Cible | Priorité |
|-----------|--------|-------|----------|
| Pizzas Populaires | 1/17 | 17/17 | 🔴 HAUTE |
| Boissons Populaires | 3/12 | 12/12 | 🔴 HAUTE |
| Autres Pizzas | 0/22 | 22/22 | 🟡 MOYENNE |
| Desserts | 0/0 | - | ⚪ Aucune |
| Accompagnements | 0/0 | - | ⚪ Aucune |

**Objectif prioritaire:** 29/29 produits populaires

---

## 💡 Astuces

### Recherche Efficace sur Unsplash
```
"italian pizza [ingrédient]" + filter:portrait
"professional food photography pizza"
"pizza restaurant menu"
```

### Recherche sur Pexels
- Utiliser la recherche avancée
- Filtrer par orientation (square pour menus)
- Télécharger en taille "Large" (optimale pour web)

### Après téléchargement
1. Vérifier visuellement chaque image
2. S'assurer qu'elle correspond au produit
3. Privilégier la cohérence visuelle entre images
4. Tester sur le site avant de valider

---

**Besoin d'aide ?** Consultez `IMAGE_DOWNLOAD_GUIDE.md` pour les URLs spécifiques et instructions détaillées.
