import { type FC, useTransition } from 'react';
import { Search, Loader2 } from 'lucide-react';
import type { SearchBoxProps } from '../types';

const SearchBox: FC<SearchBoxProps> = ({
                                         onSearch,
                                         darkMode,
                                         placeholder = "記事を検索..."
                                       }) => {
  const [isPending, startTransition] = useTransition();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    startTransition(() => {
      onSearch(value);
    });
  };

  return (
    <div className="relative max-w-md mx-auto mb-8 px-4 sm:px-6 lg:px-8">
      <div className="relative">
        <Search
          size={20}
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}
        />
        <input
          type="text"
          placeholder={placeholder}
          onChange={handleInputChange}
          className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-all duration-200 ${
            darkMode
              ? 'bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-500'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
          } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
        />
        {isPending && (
          <Loader2
            size={20}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin text-blue-500"
          />
        )}
      </div>
    </div>
  );
};

export default SearchBox;
