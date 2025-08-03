import {type FC, memo } from 'react';
import type { CategoryFilterProps } from '../types';

const CategoryFilter: FC<CategoryFilterProps> = memo(({
                                                        categories,
                                                        selectedCategory,
                                                        onCategoryChange,
                                                        darkMode
                                                      }) => {
  const getCategoryDisplayName = (category: string): string => {
    return category === 'all' ? 'すべて' : category;
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 mb-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 shadow-sm'
              }`}
            >
              {getCategoryDisplayName(category)}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
});

CategoryFilter.displayName = 'CategoryFilter';

export default CategoryFilter;
