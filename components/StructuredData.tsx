import React from 'react';

interface StructuredDataProps {
  data: Record<string, unknown>;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

// LocalBusiness Schema for Pizza Falchi
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  '@id': 'https://www.pizzafalchi.com/#restaurant',
  name: 'Pizza Falchi',
  description: 'Pizzeria artisanale à Puyricard spécialisée dans les pizzas cuites au feu de bois. Commandez en ligne pour livraison ou à emporter.',
  url: 'https://www.pizzafalchi.com',
  logo: 'https://www.pizzafalchi.com/images/logo.png',
  image: [
    'https://www.pizzafalchi.com/images/og-image.jpg',
    'https://www.pizzafalchi.com/images/food-truck.jpg',
  ],
  telephone: '+33-6-12-34-56-78',
  email: 'contact@pizzafalchi.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Puyricard',
    addressLocality: 'Aix-en-Provence',
    postalCode: '13540',
    addressCountry: 'FR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 43.5297,
    longitude: 5.4474,
  },
  priceRange: '€€',
  servesCuisine: ['Italian', 'Pizza'],
  acceptsReservations: false,
  paymentAccepted: 'Cash, Credit Card',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '11:00',
      closes: '22:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday', 'Sunday'],
      opens: '12:00',
      closes: '23:00',
    },
  ],
  menu: 'https://www.pizzafalchi.com/menu',
  hasMenu: {
    '@type': 'Menu',
    '@id': 'https://www.pizzafalchi.com/menu#menu',
    name: 'Pizza Falchi Menu',
    description: 'Pizzas artisanales, boissons, desserts et accompagnements',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '124',
    bestRating: '5',
    worstRating: '1',
  },
};

// Organization Schema
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://www.pizzafalchi.com/#organization',
  name: 'Pizza Falchi',
  url: 'https://www.pizzafalchi.com',
  logo: 'https://www.pizzafalchi.com/images/logo.png',
  sameAs: [
    'https://www.facebook.com/pizzafalchi',
    'https://www.instagram.com/pizzafalchi',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+33-6-12-34-56-78',
    contactType: 'customer service',
    email: 'contact@pizzafalchi.com',
    availableLanguage: ['French', 'Italian'],
  },
};

// WebSite Schema with Search
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://www.pizzafalchi.com/#website',
  name: 'Pizza Falchi',
  url: 'https://www.pizzafalchi.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.pizzafalchi.com/menu?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

// BreadcrumbList Schema (for menu page)
export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

// Product Schema for individual products
export const productSchema = (product: {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
  ingredients?: string[];
  vegetarian?: boolean;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': `https://www.pizzafalchi.com/products/${product._id}#product`,
  name: product.name,
  description: product.description,
  image: product.image.startsWith('http') ? product.image : `https://www.pizzafalchi.com${product.image}`,
  category: product.category,
  offers: {
    '@type': 'Offer',
    price: product.price.toFixed(2),
    priceCurrency: 'EUR',
    availability: product.available
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
    url: `https://www.pizzafalchi.com/products/${product._id}`,
    seller: {
      '@type': 'Restaurant',
      name: 'Pizza Falchi',
    },
  },
  ...(product.ingredients && product.ingredients.length > 0 && {
    recipeIngredient: product.ingredients,
  }),
  brand: {
    '@type': 'Brand',
    name: 'Pizza Falchi',
  },
});
