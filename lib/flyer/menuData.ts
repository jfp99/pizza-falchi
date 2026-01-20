/**
 * Flyer Menu Data - Pizza Falchi
 * Static menu data organized by section for flyer generation
 * Organization: Option B - Par Popularite
 */

export interface FlyerProduct {
  name: string;
  price: number;
  priceGrande?: number; // Price for 34.5cm size
  description?: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isBestSeller?: boolean;
  hasDualBase?: boolean; // Can be ordered with tomato OR cream base
}

// Pizza sizes
export const PIZZA_SIZES = {
  moyenne: { label: 'Moyenne', size: '30cm' },
  grande: { label: 'Grande', size: '34.5cm', supplement: 1.50 },
};

// Pizzas that can be ordered with tomato OR cream base
export const DUAL_BASE_PIZZAS = [
  'Chèvre Miel',
  'Regina',
  '4 Fromages',
  'Savoyarde',
];

export interface FlyerFormule {
  name: string;
  price: number;
  originalPrice: number;
  description: string;
}

export interface FlyerMenuData {
  bestSellers: FlyerProduct[];
  classiques: FlyerProduct[];
  cremes: FlyerProduct[];
  specialites: FlyerProduct[];
  boissons: {
    vins: FlyerProduct[];
    bieres: FlyerProduct[];
    softs: FlyerProduct[];
  };
  formules: FlyerFormule[];
}

// Stars - Golden Triangle (user selected)
export const STAR_PIZZAS = [
  'Chèvre Miel',
  'Regina',
  '4 Fromages',
  'Savoyarde',
];

// Complete flyer menu data - Descriptions from database
export const flyerMenuData: FlyerMenuData = {
  // NOS BEST-SELLERS (Stars - Golden Triangle)
  // Base (Tomate/Crème) omise car hasDualBase = true
  bestSellers: [
    {
      name: 'Chèvre Miel',
      price: 13.00,
      priceGrande: 14.50,
      description: 'Emmental, Chèvre, Miel',
      isVegetarian: true,
      isBestSeller: true,
      hasDualBase: true,
    },
    {
      name: 'Regina',
      price: 12.00,
      priceGrande: 13.50,
      description: 'Emmental, Jambon, Champignons',
      isBestSeller: true,
      hasDualBase: true,
    },
    {
      name: '4 Fromages',
      price: 12.50,
      priceGrande: 14.00,
      description: 'Emmental, Chèvre, Mozzarella, Roquefort',
      isVegetarian: true,
      isBestSeller: true,
      hasDualBase: true,
    },
    {
      name: 'Savoyarde',
      price: 12.50,
      priceGrande: 14.00,
      description: 'Emmental, Fromage à raclette, Lardons',
      isBestSeller: true,
      hasDualBase: true,
    },
  ],

  // LES CLASSIQUES (Base Tomate) - "Tomate" omis car induit par la catégorie
  classiques: [
    { name: 'Anchois', price: 10.50, priceGrande: 12.00, description: 'Anchois' },
    { name: 'Fromage', price: 10.50, priceGrande: 12.00, isVegetarian: true, description: 'Emmental' },
    { name: 'Poivron', price: 11.00, priceGrande: 12.50, isVegetarian: true, description: 'Emmental, Poivron' },
    { name: 'Palermo', price: 11.50, priceGrande: 13.00, description: 'Emmental, Câpres, Anchois' },
    { name: 'Jambon', price: 11.50, priceGrande: 13.00, description: 'Emmental, Jambon' },
    { name: 'Venise', price: 11.50, priceGrande: 13.00, isVegetarian: true, description: 'Emmental, Mozzarella' },
    { name: 'Champignon', price: 11.50, priceGrande: 13.00, isVegetarian: true, description: 'Emmental, Champignons' },
    { name: 'Biquette', price: 12.00, priceGrande: 13.50, isVegetarian: true, description: 'Emmental, Chèvre' },
    { name: 'Belzebuth', price: 12.00, priceGrande: 13.50, isSpicy: true, description: 'Emmental, Chorizo' },
    { name: 'Roquefort', price: 12.50, priceGrande: 14.00, isVegetarian: true, description: 'Emmental, Roquefort' },
    { name: 'Figatelli', price: 12.50, priceGrande: 14.00, description: 'Emmental, Figatelli' },
    { name: 'Fruits de Mer', price: 12.50, priceGrande: 14.00, description: 'Emmental, Fruits de mer, Ail, Persil' },
    { name: 'Kebab', price: 12.50, priceGrande: 14.00, description: 'Emmental, Viande de kebab', hasDualBase: true },
  ],

  // LES CREMES FRAICHES (Base Creme) - "Crème fraîche" omis car induit par la catégorie
  cremes: [
    { name: 'Dame Blanche', price: 12.50, priceGrande: 14.00, description: 'Emmental, Lardons, Oignons' },
    { name: 'Tonthon', price: 12.50, priceGrande: 14.00, description: 'Emmental, Thon, Câpres' },
    { name: 'Chicken', price: 12.50, priceGrande: 14.00, description: 'Emmental, Poulet, Champignons' },
    { name: 'Viking', price: 13.00, priceGrande: 14.50, description: 'Emmental, Saumon, Amandes' },
  ],

  // LES SPECIALITES MAISON - Descriptions exactes de la BDD
  specialites: [
    { name: 'Pizza du Moment', price: 13.00, priceGrande: 14.50, description: 'Demandez-nous!' },
    { name: 'Arménienne', price: 13.00, priceGrande: 14.50, isSpicy: true, description: 'Tomate, Emmental, Oignons, Poivrons, Viande Hachée' },
    { name: 'Pagnol', price: 13.00, priceGrande: 14.50, description: 'Tomate Fraîche, Emmental, Oeuf, Lardons, Herbes' },
    { name: 'Niçoise', price: 13.00, priceGrande: 14.50, description: 'Tomate Fraîche, Oignons, Anchois, Herbes, Huile d\'olive' },
    { name: 'Mexicana', price: 13.00, priceGrande: 14.50, isSpicy: true, description: 'Tomate, Emmental, Oignons, Poivrons, Chorizo' },
    { name: 'Indienne', price: 13.00, priceGrande: 14.50, description: 'Sauce curry, Emmental, Poulet, Poivron' },
    { name: 'Pistou', price: 13.00, priceGrande: 14.50, isVegetarian: true, description: 'Tomate, Ail, Basilic, Tomates cerise, Parmesan' },
    { name: 'Napoléon', price: 13.00, priceGrande: 14.50, description: 'Tomate, Emmental, Figatelli, Brousse' },
    { name: 'Orientale', price: 13.00, priceGrande: 14.50, isSpicy: true, description: 'Tomate, Emmental, Oignons, Poivrons, Merguez' },
    { name: 'Végétarienne', price: 13.00, priceGrande: 14.50, isVegetarian: true, description: 'Tomate, Oignons, Poivrons, Champignons, Emmental' },
    { name: 'Anti-Pasti', price: 13.00, priceGrande: 14.50, description: 'Tomate, Mozzarella, Artichauts, Ail, Persil, Jambon cru' },
    { name: 'Parmesane', price: 13.00, priceGrande: 14.50, isVegetarian: true, description: 'Tomate, Emmental, Aubergines, Parmesan, Filet de crème fraîche' },
    { name: 'Justine', price: 13.00, priceGrande: 14.50, description: 'Tomate, Anchois, Mozzarella' },
  ],

  // BOISSONS
  boissons: {
    vins: [
      { name: 'Vin Rouge', price: 7.50 },
      { name: 'Vin Rosé', price: 7.50 },
      { name: 'Vin Blanc', price: 7.50 },
    ],
    bieres: [
      { name: 'Heineken 33cl', price: 1.80 },
      { name: 'San Miguel 33cl', price: 2.80 },
      { name: 'Corona 35.5cl', price: 3.30 },
      { name: 'Chouffe 33cl', price: 4.50 },
    ],
    softs: [
      { name: 'Cristaline 50cl', price: 1.30 },
      { name: 'Perrier 33cl', price: 1.80 },
      { name: 'Soft 33cl', price: 1.80 },
      { name: 'Coca-Cola 1.25L', price: 3.50 },
      { name: 'Ice-Tea 1.5L', price: 3.50 },
    ],
  },

  // NOS FORMULES
  formules: [
    {
      name: 'Menu Solo',
      price: 12.90,
      originalPrice: 14.50,
      description: '1 Pizza + 1 Boisson',
    },
    {
      name: 'Menu Duo',
      price: 24.90,
      originalPrice: 29.00,
      description: '2 Pizzas + 2 Boissons',
    },
    {
      name: 'Menu Famille',
      price: 36.90,
      originalPrice: 43.50,
      description: '3 Pizzas + 3 Boissons',
    },
  ],
};

// Contact info for flyer
export const flyerContactInfo = {
  phone: '04 42 92 03 08',
  address: '615 avenue de la Touloubre',
  city: '13540 Puyricard',
  website: 'www.pizzafalchi.com',
  hours: 'Mardi - Dimanche : 18h - 21h30',
  closedDay: 'Fermé le Lundi',
};

// Location data for stylized map - Coordonnées exactes Google Maps
export const flyerLocationData = {
  coordinates: {
    lat: 43.57683337098537,
    lng: 5.418354712321976,
  },
  placeId: '0x12c98c9a1aea85bb:0x7c03b9a5f1f1d9fb',
  landmarks: [
    { name: 'Maternité de l\'Étoile', type: 'hospital' },
    { name: 'Stade', type: 'stadium' },
    { name: 'Parking', type: 'parking' },
  ],
  parking: 'Parking gratuit à proximité',
  googleMapsUrl: 'https://www.google.com/maps/place/Pizza+Falchi/@43.5768334,5.4183547,17z',
  googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2890.426430988316!2d5.418354712321976!3d43.57683337098537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12c98c9a1aea85bb%3A0x7c03b9a5f1f1d9fb!2sPizza%20Falchi!5e0!3m2!1sfr!2sfr',
  directions: 'Avenue de la Touloubre, proche maternité',
};

// Heritage info
export const flyerHeritage = {
  since: '2001',
  tagline: 'Maison de Qualité',
  cooking: 'Cuisson au Feu de Bois',
  loyalty: '10 pizzas achetées = 1 OFFERTE',
};
