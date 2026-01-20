import { Category } from '@/types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          suppressHydrationWarning
          aria-label={`Filtrer par ${category.name}`}
          aria-pressed={selectedCategory === category.id}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
            selectedCategory === category.id
              ? 'bg-brand-red text-white shadow-soft-md'
              : 'bg-surface dark:bg-surface text-text-primary dark:text-text-primary border border-border dark:border-border hover:border-brand-red dark:hover:border-brand-gold hover:shadow-soft-md'
          }`}
        >
          {/* Icon */}
          <span className="text-xl">
            {category.icon}
          </span>

          {/* Label */}
          <span className="tracking-wide">{category.name}</span>
        </button>
      ))}
    </div>
  );
}