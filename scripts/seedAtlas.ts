import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Product from '../models/Product';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

const MONGODB_URI = process.env.MONGODB_URI;

// User model for seeding
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  phone: String,
}, {
  timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Product Data - Updated with real Pizza Truck products
const pizzaFalchiProducts = [
  // NOS CLASSIQUES - Pizzas Tomate
  {
    name: "Anchois",
    description: "Tomate, Anchois",
    price: 11.00,
    category: "pizza",
    image: "/images/menu/pizzas/anchois.jpg",
    ingredients: ["tomate", "anchois"],
    available: true,
    popular: false,
    spicy: false,
    vegetarian: false,
    tags: ["classique", "poisson"]
  },
  {
    name: "Fromage",
    description: "Tomate, Emmental",
    price: 11.00,
    category: "pizza",
    image: "/images/menu/pizzas/fromage.jpg",
    ingredients: ["tomate", "emmental"],
    available: true,
    popular: true,
    spicy: false,
    vegetarian: true,
    tags: ["classique", "végétarienne"]
  },
  {
    name: "Palermo",
    description: "Tomate, Emmental, Câpres, Anchois",
    price: 12.00,
    category: "pizza",
    image: "/images/menu/pizzas/palermo.jpg",
    ingredients: ["tomate", "emmental", "câpres", "anchois"],
    available: true,
    popular: false,
    spicy: false,
    vegetarian: false,
    tags: ["classique", "poisson"]
  },
  {
    name: "Jambon",
    description: "Tomate, Emmental, Jambon",
    price: 12.00,
    category: "pizza",
    image: "/images/menu/pizzas/jambon.jpg",
    ingredients: ["tomate", "emmental", "jambon"],
    available: true,
    popular: true,
    spicy: false,
    vegetarian: false,
    tags: ["classique", "viande"]
  },
  {
    name: "Venise",
    description: "Tomate, Emmental, Mozzarella",
    price: 12.00,
    category: "pizza",
    image: "/images/menu/pizzas/venise.jpg",
    ingredients: ["tomate", "emmental", "mozzarella"],
    available: true,
    popular: false,
    spicy: false,
    vegetarian: true,
    tags: ["classique", "végétarienne"]
  },
  {
    name: "Poivron",
    description: "Tomate, Emmental, Poivron",
    price: 11.50,
    category: "pizza",
    image: "/images/menu/pizzas/poivron.jpg",
    ingredients: ["tomate", "emmental", "poivron"],
    available: true,
    popular: false,
    spicy: false,
    vegetarian: true,
    tags: ["classique", "végétarienne"]
  },
  {
    name: "Regina",
    description: "Tomate, Emmental, Jambon, Champignons",
    price: 12.50,
    category: "pizza",
    image: "/images/menu/pizzas/regina.jpg",
    ingredients: ["tomate", "emmental", "jambon", "champignons"],
    available: true,
    popular: true,
    spicy: false,
    vegetarian: false,
    tags: ["classique", "viande"]
  },
  {
    name: "Biquette",
    description: "Tomate, Emmental, Chèvre",
    price: 12.50,
    category: "pizza",
    image: "/images/menu/pizzas/biquette.jpg",
    ingredients: ["tomate", "emmental", "chèvre"],
    available: true,
    popular: false,
    spicy: false,
    vegetarian: true,
    tags: ["classique", "végétarienne", "fromage"]
  },
  {
    name: "Roquefort",
    description: "Tomate, Emmental, Roquefort",
    price: 13.00,
    category: "pizza",
    image: "/images/menu/pizzas/roquefort.jpg",
    ingredients: ["tomate", "emmental", "roquefort"],
    available: true,
    popular: false,
    spicy: false,
    vegetarian: true,
    tags: ["classique", "végétarienne", "fromage"]
  },
  {
    name: "Champignon",
    description: "Tomate, Champignons de Paris, Emmental",
    price: 12.00,
    category: "pizza",
    image: "/images/menu/pizzas/champignon.jpg",
    ingredients: ["tomate", "champignons", "emmental"],
    available: true,
    popular: false,
    spicy: false,
    vegetarian: true,
    tags: ["classique", "végétarienne"]
  },
  {
    name: "Figatelli",
    description: "Tomate, Emmental, Figatelli",
    price: 13.00,
    category: "pizza",
    image: "/images/menu/pizzas/figatelli.jpg",
    ingredients: ["tomate", "emmental", "figatelli"],
    available: true,
    popular: false,
    spicy: false,
    vegetarian: false,
    tags: ["classique", "viande", "provence"]
  },
  {
    name: "Fruits de Mer",
    description: "Tomate, Emmental, Fruits de mer, Ail, Persil",
    price: 13.00,
    category: "pizza",
    image: "/images/menu/pizzas/fruits-mer.jpg",
    ingredients: ["tomate", "emmental", "fruits de mer", "ail", "persil"],
    available: true,
    popular: false,
    spicy: false,
    vegetarian: false,
    tags: ["classique", "poisson"]
  },
  {
    name: "4 Fromages",
    description: "Tomate, Emmental, Chèvre, Mozzarella, Roquefort",
    price: 13.00,
    category: "pizza",
    image: "/images/menu/pizzas/4-fromages.jpg",
    ingredients: ["tomate", "emmental", "chèvre", "mozzarella", "roquefort"],
    available: true,
    popular: true,
    spicy: false,
    vegetarian: true,
    tags: ["classique", "végétarienne", "fromage"]
  },
  {
    name: "Savoyarde",
    description: "Tomate, Emmental, Fromage à raclette, Lardons",
    price: 13.00,
    category: "pizza",
    image: "/images/menu/pizzas/savoyarde.jpg",
    ingredients: ["tomate", "emmental", "raclette", "lardons"],
    available: true,
    popular: true,
    spicy: false,
    vegetarian: false,
    tags: ["classique", "viande", "fromage"]
  },
  {
    name: "Kebab",
    description: "Tomate, Emmental, Viande de kebab",
    price: 13.00,
    category: "pizza",
    image: "/images/menu/pizzas/kebab.jpg",
    ingredients: ["tomate", "emmental", "viande kebab"],
    available: true,
    popular: true,
    spicy: false,
    vegetarian: false,
    tags: ["classique", "viande"]
  },
  {
    name: "Belzebuth",
    description: "Tomate, Emmental, Chorizo",
    price: 12.50,
    category: "pizza",
    image: "/images/menu/pizzas/belzebuth.jpg",
    ingredients: ["tomate", "emmental", "chorizo"],
    available: true,
    popular: false,
    spicy: true,
    vegetarian: false,
    tags: ["classique", "viande", "épicée"]
  },
  {
    name: "Chèvre Miel",
    description: "Tomate, Emmental, Chèvre, Miel",
    price: 13.50,
    category: "pizza",
    image: "/images/menu/pizzas/chevre-miel.jpg",
    ingredients: ["tomate", "emmental", "chèvre", "miel"],
    available: true,
    popular: true,
    spicy: false,
    vegetarian: true,
    tags: ["classique", "végétarienne", "fromage"]
  },

  // NOS CRÈMES FRAÎCHES
  {
    name: "Normande",
    description: "Crème fraîche, Emmental, Champignons, Jambon",
    price: 13.00,
    category: "pizza",
    image: "/images/menu/pizzas/normande.jpg",
    ingredients: ["crème fraîche", "emmental", "champignons", "jambon"],
    available: true,
    popular: true,
    spicy: false,
    vegetarian: false,
    tags: ["crème", "viande"]
  },
  {
    name: "Dame Blanche",
    description: "Crème fraîche, Emmental, Lardons, Oignons",
    price: 13.00,
    category: "pizza",
    image: "/images/menu/pizzas/dame-blanche.jpg",
    ingredients: ["crème fraîche", "emmental", "lardons", "oignons"],
    available: true,
    popular: false,
    spicy: false,
    vegetarian: false,
    tags: ["crème", "viande"]
  },
  {
    name: "Tonthon",
    description: "Crème fraîche, Emmental, Thon, Câpres",
    price: 13.00,
    category: "pizza",
    image: "/images/menu/pizzas/tonthon.jpg",
    ingredients: ["crème fraîche", "emmental", "thon", "câpres"],
    available: true,
    popular: false,
    spicy: false,
    vegetarian: false,
    tags: ["crème", "poisson"]
  },
  {
    name: "Chicken",
    description: "Crème fraîche, Emmental, Poulet, Champignons",
    price: 13.00,
    category: "pizza",
    image: "/images/menu/pizzas/chicken.jpg",
    ingredients: ["crème fraîche", "emmental", "poulet", "champignons"],
    available: true,
    popular: true,
    spicy: false,
    vegetarian: false,
    tags: ["crème", "viande"]
  },
  {
    name: "Viking",
    description: "Crème fraîche, Emmental, Saumon, Amandes",
    price: 13.50,
    category: "pizza",
    image: "/images/menu/pizzas/viking.jpg",
    ingredients: ["crème fraîche", "emmental", "saumon", "amandes"],
    available: true,
    popular: false,
    spicy: false,
    vegetarian: false,
    tags: ["crème", "poisson"]
  },
  {
    name: "Savoyarde Crème",
    description: "Crème fraîche, Emmental, Lardons, Fromage à Raclette",
    price: 13.00,
    category: "pizza",
    image: "/images/menu/pizzas/savoyarde-creme.jpg",
    ingredients: ["crème fraîche", "emmental", "lardons", "raclette"],
    available: true,
    popular: true,
    spicy: false,
    vegetarian: false,
    tags: ["crème", "viande", "fromage"]
  },
  {
    name: "4 Fromages Crème",
    description: "Crème fraîche, Emmental, Mozzarella, Chèvre, Roquefort",
    price: 13.00,
    category: "pizza",
    image: "/images/menu/pizzas/4-fromages-creme.jpg",
    ingredients: ["crème fraîche", "emmental", "mozzarella", "chèvre", "roquefort"],
    available: true,
    popular: true,
    spicy: false,
    vegetarian: true,
    tags: ["crème", "végétarienne", "fromage"]
  },
  {
    name: "Chèvre Miel Crème",
    description: "Crème fraîche, Emmental, Chèvre, Miel",
    price: 13.50,
    category: "pizza",
    image: "/images/menu/pizzas/chevre-miel-creme.jpg",
    ingredients: ["crème fraîche", "emmental", "chèvre", "miel"],
    available: true,
    popular: true,
    spicy: false,
    vegetarian: true,
    tags: ["crème", "végétarienne", "fromage"]
  },
  {
    name: "Kebab Crème",
    description: "Crème fraîche, Emmental, Viande kebab",
    price: 13.00,
    category: "pizza",
    image: "/images/menu/pizzas/kebab-creme.jpg",
    ingredients: ["crème fraîche", "emmental", "viande kebab"],
    available: true,
    popular: true,
    spicy: false,
    vegetarian: false,
    tags: ["crème", "viande"]
  },

  // NOS SPÉCIALITÉS
  {
    name: "Pagnol",
    description: "Tomate, Tomate Fraîche, Emmental, Oeuf, Lardons, Herbes de Provence",
    price: 13.50,
    category: "pizza",
    image: "/images/menu/pizzas/pagnol.jpg",
    ingredients: ["tomate", "tomate fraîche", "emmental", "oeuf", "lardons", "herbes de provence"],
    available: true,
    popular: true,
    spicy: false,
    vegetarian: false,
    tags: ["spécialité", "viande"]
  },
  {
    name: "Niçoise",
    description: "Tomate, Tomate Fraîche, Oignons, Anchois, Herbes de Provence, Huile d'olive",
    price: 13.50,
    category: "pizza",
    image: "/images/menu/pizzas/nicoise.jpg",
    ingredients: ["tomate", "tomate fraîche", "oignons", "anchois", "herbes de provence", "huile d'olive"],
    available: true,
    popular: false,
    spicy: false,
    vegetarian: false,
    tags: ["spécialité", "poisson"]
  },
  {
    name: "Mexicana",
    description: "Tomate, Emmental, Oignons, Poivrons, Chorizo",
    price: 13.50,
    category: "pizza",
    image: "/images/menu/pizzas/mexicana.jpg",
    ingredients: ["tomate", "emmental", "oignons", "poivrons", "chorizo"],
    available: true,
    popular: true,
    spicy: true,
    vegetarian: false,
    tags: ["spécialité", "viande", "épicée"]
  },
  {
    name: "Arménienne",
    description: "Tomate, Emmental, Oignons, Poivrons, Viande Hachée",
    price: 13.50,
    category: "pizza",
    image: "/images/menu/pizzas/armenienne.jpg",
    ingredients: ["tomate", "emmental", "oignons", "poivrons", "viande hachée"],
    available: true,
    popular: false,
    spicy: true,
    vegetarian: false,
    tags: ["spécialité", "viande", "épicée"]
  },
  {
    name: "Indienne",
    description: "Sauce curry, Emmental, Poulet, Poivron",
    price: 13.50,
    category: "pizza",
    image: "/images/menu/pizzas/indienne.jpg",
    ingredients: ["sauce curry", "emmental", "poulet", "poivron"],
    available: true,
    popular: false,
    spicy: false,
    vegetarian: false,
    tags: ["spécialité", "viande"]
  },
  {
    name: "Pistou",
    description: "Tomate, Ail, Basilic, Tomates cerise, Parmesan",
    price: 13.50,
    category: "pizza",
    image: "/images/menu/pizzas/pistou.jpg",
    ingredients: ["tomate", "ail", "basilic", "tomates cerise", "parmesan"],
    available: true,
    popular: false,
    spicy: false,
    vegetarian: true,
    tags: ["spécialité", "végétarienne", "saisonnière"]
  },
  {
    name: "Végétarienne",
    description: "Tomate, Oignons, Poivrons, Champignons, Emmental",
    price: 13.50,
    category: "pizza",
    image: "/images/menu/pizzas/vegetarienne.jpg",
    ingredients: ["tomate", "oignons", "poivrons", "champignons", "emmental"],
    available: true,
    popular: true,
    spicy: false,
    vegetarian: true,
    tags: ["spécialité", "végétarienne"]
  },
  {
    name: "Napoléon",
    description: "Tomate, Emmental, Figatelli, Brousse",
    price: 13.50,
    category: "pizza",
    image: "/images/menu/pizzas/napoleon.jpg",
    ingredients: ["tomate", "emmental", "figatelli", "brousse"],
    available: true,
    popular: false,
    spicy: false,
    vegetarian: false,
    tags: ["spécialité", "viande", "provence"]
  },
  {
    name: "Anti-Pasti",
    description: "Tomate, Emmental, Mozzarella, Artichauts, Jambon cru",
    price: 13.50,
    category: "pizza",
    image: "/images/menu/pizzas/anti-pasti.jpg",
    ingredients: ["tomate", "emmental", "mozzarella", "artichauts", "jambon cru"],
    available: true,
    popular: false,
    spicy: false,
    vegetarian: false,
    tags: ["spécialité", "viande"]
  },
  {
    name: "Parmesane",
    description: "Tomate, Emmental, Aubergines Grillées, Parmesan, Filet de crème fraîche",
    price: 13.50,
    category: "pizza",
    image: "/images/menu/pizzas/parmesane.jpg",
    ingredients: ["tomate", "emmental", "aubergines grillées", "parmesan", "crème fraîche"],
    available: true,
    popular: false,
    spicy: false,
    vegetarian: true,
    tags: ["spécialité", "végétarienne"]
  },
  {
    name: "Orientale",
    description: "Tomate, Emmental, Oignons, Poivrons, Merguez",
    price: 13.50,
    category: "pizza",
    image: "/images/menu/pizzas/orientale.jpg",
    ingredients: ["tomate", "emmental", "oignons", "poivrons", "merguez"],
    available: true,
    popular: true,
    spicy: true,
    vegetarian: false,
    tags: ["spécialité", "viande", "épicée"]
  },
  {
    name: "Justine",
    description: "Tomate, Tomates fraîches, Anchois, Mozzarella",
    price: 13.50,
    category: "pizza",
    image: "/images/menu/pizzas/justine.jpg",
    ingredients: ["tomate", "tomates fraîches", "anchois", "mozzarella"],
    available: true,
    popular: false,
    spicy: false,
    vegetarian: false,
    tags: ["spécialité", "poisson"]
  },
  {
    name: "Pizza du Moment",
    description: "Demandez la Pizza du Moment à notre Équipe",
    price: 13.50,
    category: "pizza",
    image: "/images/menu/pizzas/pizza-moment.jpg",
    ingredients: [],
    available: true,
    popular: false,
    spicy: false,
    vegetarian: false,
    tags: ["spécialité", "du moment"]
  },

  // NOS VINS
  {
    name: "Vin Rouge Vignerons du Castellas",
    description: "Vin rouge, Coteau d'Aix, La Fare les Oliviers",
    price: 7.50,
    category: "boisson",
    image: "/images/menu/boissons/vin-rouge.jpg",
    ingredients: [],
    available: true,
    popular: true,
    tags: ["vin", "alcool", "rouge"]
  },
  {
    name: "Vin Rosé Vignerons du Castellas",
    description: "Vin rosé, Coteau d'Aix, La Fare les Oliviers",
    price: 7.50,
    category: "boisson",
    image: "/images/menu/boissons/vin-rose.jpg",
    ingredients: [],
    available: true,
    popular: true,
    tags: ["vin", "alcool", "rosé"]
  },
  {
    name: "Vin Blanc Vignerons du Castellas",
    description: "Vin Blanc, Coteau d'Aix, La Fare les Oliviers",
    price: 7.50,
    category: "boisson",
    image: "/images/menu/boissons/vin-blanc.jpg",
    ingredients: [],
    available: true,
    popular: false,
    tags: ["vin", "alcool", "blanc"]
  },

  // NOS BIÈRES
  {
    name: "Heineken",
    description: "Bière blonde 33cl",
    price: 1.80,
    category: "boisson",
    image: "/images/menu/boissons/heineken.jpg",
    ingredients: [],
    available: true,
    popular: true,
    tags: ["bière", "alcool"]
  },
  {
    name: "Corona",
    description: "Bière mexicaine 35,5cl",
    price: 3.30,
    category: "boisson",
    image: "/images/menu/boissons/corona.jpg",
    ingredients: [],
    available: true,
    popular: true,
    tags: ["bière", "alcool"]
  },
  {
    name: "San Miguel",
    description: "Bière espagnole 33cl",
    price: 2.80,
    category: "boisson",
    image: "/images/menu/boissons/san-miguel.jpg",
    ingredients: [],
    available: true,
    popular: false,
    tags: ["bière", "alcool"]
  },
  {
    name: "Chouffe",
    description: "Bière belge 33cl",
    price: 4.50,
    category: "boisson",
    image: "/images/menu/boissons/chouffe.jpg",
    ingredients: [],
    available: true,
    popular: false,
    tags: ["bière", "alcool"]
  },

  // NOS BOISSONS
  {
    name: "Perrier",
    description: "Eau pétillante 33cl",
    price: 1.80,
    category: "boisson",
    image: "/images/menu/boissons/perrier.jpg",
    ingredients: [],
    available: true,
    popular: true,
    tags: ["eau", "pétillante"]
  },
  {
    name: "Bouteille de Coca-Cola",
    description: "Coca-Cola 1,25L",
    price: 3.50,
    category: "boisson",
    image: "/images/menu/boissons/coca-cola-bouteille.jpg",
    ingredients: [],
    available: true,
    popular: true,
    tags: ["soft", "bouteille"]
  },
  {
    name: "Cristaline",
    description: "Eau plate 50cl",
    price: 1.30,
    category: "boisson",
    image: "/images/menu/boissons/cristaline.jpg",
    ingredients: [],
    available: true,
    popular: true,
    tags: ["eau", "plate"]
  },
  {
    name: "Soft",
    description: "Boisson soft 33cl",
    price: 1.80,
    category: "boisson",
    image: "/images/menu/boissons/soft.jpg",
    ingredients: [],
    available: true,
    popular: true,
    tags: ["soft"]
  },
  {
    name: "Bouteille Ice-Tea",
    description: "Ice-Tea 1,5L",
    price: 3.50,
    category: "boisson",
    image: "/images/menu/boissons/ice-tea-bouteille.jpg",
    ingredients: [],
    available: true,
    popular: true,
    tags: ["soft", "bouteille", "thé"]
  }
];

// Admin users for Pizza Falchi
const adminUsers = [
  {
    name: 'Admin Pizza Falchi',
    email: 'admin@pizzafalchi.com',
    password: 'PizzaFalchi2024!',
    role: 'admin',
    phone: '+33442920308'
  },
  {
    name: 'Marco Falchi',
    email: 'marco@pizzafalchi.com',
    password: 'Marco2024!',
    role: 'admin',
    phone: '+33442920308'
  },
  {
    name: 'Client Test',
    email: 'client@example.com',
    password: 'client123',
    role: 'customer',
    phone: '+33442920308'
  }
];

async function seedAtlas() {
  try {
    console.log('');
    console.log('🔗 Connexion à MongoDB Atlas...');
    console.log(`📍 URI: ${MONGODB_URI.replace(/:[^:]*@/, ':****@')}`);

    await mongoose.connect(MONGODB_URI);

    console.log('✅ Connecté avec succès à MongoDB Atlas!');
    console.log('');

    // Check if data already exists
    const existingProducts = await Product.countDocuments();
    const existingUsers = await User.countDocuments();

    if (existingProducts > 0 || existingUsers > 0) {
      console.log('⚠️  La base de données contient déjà des données:');
      console.log(`   - ${existingProducts} produits`);
      console.log(`   - ${existingUsers} utilisateurs`);
      console.log('');
      console.log('❓ Voulez-vous:');
      console.log('   1. Effacer et réinitialiser (ATTENTION: perte de données!)');
      console.log('   2. Ajouter les données manquantes uniquement');
      console.log('   3. Annuler');
      console.log('');
      console.log('💡 Pour forcer la réinitialisation, utilisez: npm run seed:atlas:force');
      console.log('');

      if (process.argv.includes('--force')) {
        console.log('🗑️  Mode FORCE activé - Suppression de toutes les données...');
        if (mongoose.connection.db) {
          await mongoose.connection.db.dropDatabase();
          console.log('✅ Base de données nettoyée');
        }
      } else {
        console.log('ℹ️  Ajout des données manquantes uniquement...');
      }
    }

    console.log('');
    console.log('👤 Création des utilisateurs...');

    // Create users
    for (const userData of adminUsers) {
      const existingUser = await User.findOne({ email: userData.email });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        await User.create({
          ...userData,
          password: hashedPassword
        });
        console.log(`   ✅ ${userData.name} (${userData.email})`);
      } else {
        console.log(`   ⏭️  ${userData.name} existe déjà`);
      }
    }

    console.log('');
    console.log('🍕 Création des produits...');

    // Create products
    let added = 0;
    let skipped = 0;

    for (const productData of pizzaFalchiProducts) {
      const existingProduct = await Product.findOne({ name: productData.name });

      if (!existingProduct) {
        await Product.create(productData);
        added++;
        console.log(`   ✅ ${productData.name} (${productData.category})`);
      } else {
        skipped++;
        console.log(`   ⏭️  ${productData.name} existe déjà`);
      }
    }

    // Create indexes for performance
    console.log('');
    console.log('🔍 Création des index...');
    await Product.collection.createIndex({ category: 1 });
    await Product.collection.createIndex({ name: 'text', description: 'text' });
    await Product.collection.createIndex({ available: 1 });
    await Product.collection.createIndex({ popular: 1 });
    console.log('   ✅ Index créés avec succès');

    // Stats
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const productsByCategory = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ BASE DE DONNÉES PIZZA FALCHI INITIALISÉE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('📊 STATISTIQUES:');
    console.log(`   • Total produits: ${totalProducts}`);
    console.log(`   • Total utilisateurs: ${totalUsers}`);
    console.log('');
    console.log('📦 PRODUITS PAR CATÉGORIE:');
    productsByCategory.forEach(cat => {
      const emoji = cat._id === 'pizza' ? '🍕' :
                    cat._id === 'boisson' ? '🥤' :
                    cat._id === 'dessert' ? '🍰' : '🍴';
      console.log(`   ${emoji} ${cat._id}: ${cat.count}`);
    });
    console.log('');
    console.log('📈 CETTE SESSION:');
    console.log(`   • Ajoutés: ${added}`);
    console.log(`   • Ignorés (existants): ${skipped}`);
    console.log('');
    console.log('🔑 COMPTES ADMIN:');
    console.log('   📧 admin@pizzafalchi.com');
    console.log('   🔒 PizzaFalchi2024!');
    console.log('');
    console.log('   📧 marco@pizzafalchi.com');
    console.log('   🔒 Marco2024!');
    console.log('');
    console.log('🚀 PRÊT! Démarrez l\'application avec:');
    console.log('   npm run dev');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('❌ ERREUR lors du seed:', error);
    console.error('');
    if (error instanceof Error) {
      console.error('Message:', error.message);
      if (error.stack) {
        console.error('Stack:', error.stack);
      }
    }
    process.exit(1);
  }
}

// Gestion propre de la fermeture
process.on('SIGINT', async () => {
  console.log('\n🔄 Fermeture de la connexion MongoDB...');
  await mongoose.connection.close();
  process.exit(0);
});

// Execute the seed function
seedAtlas();
