import { Category } from '@/types';
import { PizzaSliceIcon, DrinkIcon, GiftBoxIcon, DessertIcon } from '@/components/icons/CategoryIcons';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

// Map icon names to actual components
const iconMap: { [key: string]: React.FC<{ size?: number; className?: string }> } = {
  'PizzaSliceIcon': PizzaSliceIcon,
  'DrinkIcon': DrinkIcon,
  'GiftBoxIcon': GiftBoxIcon,
  'DessertIcon': DessertIcon,
};

export default function CategoryFilterWithIcons({
  categories,
  selectedCategory,
  onCategoryChange
}: CategoryFilterProps) {
  return (
    <nav aria-label="Filtrer par catégorie" role="navigation">
      <div
        className="flex flex-wrap justify-center gap-3"
        role="group"
        aria-label="Catégories de produits"
      >
        {categories.map(category => {
          const IconComponent = iconMap[category.icon as string] || PizzaSliceIcon;
          const isSelected = selectedCategory === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(category.id)}
              suppressHydrationWarning
              aria-label={`Filtrer par ${category.name}${isSelected ? ' (sélectionné)' : ''}`}
              aria-pressed={isSelected}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-brand-red text-white shadow-soft-md'
                  : 'bg-surface dark:bg-surface text-text-primary dark:text-text-primary border border-border dark:border-border hover:border-brand-red dark:hover:border-brand-gold hover:shadow-soft-md'
              }`}
            >
              {/* Icon */}
              <IconComponent
                size={20}
                className={isSelected ? 'text-white' : 'text-text-primary dark:text-text-primary'}
                aria-hidden="true"
              />

              {/* Label */}
              <span className="tracking-wide">{category.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}