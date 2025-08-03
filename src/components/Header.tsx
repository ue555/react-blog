import { type FC, useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import type { HeaderProps } from '../types';

const Header: FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md transition-colors duration-300 ${
      darkMode ? 'bg-gray-900/90 border-gray-700' : 'bg-white/90 border-gray-200'
    } border-b`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TB</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tech Blog
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="hover:text-blue-500 transition-colors">Home</a>
            <a href="#" className="hover:text-blue-500 transition-colors">About</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Archive</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Contact</a>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all duration-200 ${
                darkMode ? 'hover:bg-gray-800 hover:scale-105' : 'hover:bg-gray-100 hover:scale-105'
              }`}
              aria-label={darkMode ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-all duration-200 ${
                darkMode ? 'hover:bg-gray-800 hover:scale-105' : 'hover:bg-gray-100 hover:scale-105'
              }`}
              aria-label="メニューを開く"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className={`md:hidden border-t transition-all duration-300 ${
            darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
          }`}>
            <nav className="px-4 py-4 space-y-2">
              <a href="#" className="block py-2 hover:text-blue-500 transition-colors">Home</a>
              <a href="#" className="block py-2 hover:text-blue-500 transition-colors">About</a>
              <a href="#" className="block py-2 hover:text-blue-500 transition-colors">Archive</a>
              <a href="#" className="block py-2 hover:text-blue-500 transition-colors">Contact</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
