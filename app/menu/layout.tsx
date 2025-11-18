import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notre Carte',
  description: 'Découvrez notre menu complet de pizzas artisanales et boissons. Pizzas au feu de bois préparées avec des ingrédients frais importés d\'Italie. Commandez en ligne pour une livraison rapide.',
  openGraph: {
    title: 'Notre Carte | Pizza Falchi',
    description: 'Découvrez nos pizzas artisanales préparées avec passion et des ingrédients de qualité. Pizzas classiques, crèmes fraîches, et spécialités provençales.',
    url: 'https://www.pizzafalchi.com/menu',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Notre Carte | Pizza Falchi',
    description: 'Découvrez nos pizzas artisanales au feu de bois et nos boissons sélectionnées.',
  },
  alternates: {
    canonical: '/menu',
  },
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
