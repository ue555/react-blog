import { type FC } from 'react';
import { Github, Twitter, Mail } from 'lucide-react';
import type { FooterProps } from '../types';

const Footer: FC<FooterProps> = ({ darkMode }) => {
  return (
    <footer className={`border-t transition-colors ${
      darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TB</span>
              </div>
              <h3 className="text-lg font-bold">Tech Blog</h3>
            </div>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              React 19とTypeScriptで構築された現代的な技術ブログ。最新のWeb技術トレンドと実践的な開発手法を発信しています。
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">カテゴリー</h4>
            <ul className="space-y-2">
              <li><a href="#" className={`hover:text-blue-500 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>React</a></li>
              <li><a href="#" className={`hover:text-blue-500 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>TypeScript</a></li>
              <li><a href="#" className={`hover:text-blue-500 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Vite</a></li>
              <li><a href="#" className={`hover:text-blue-500 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>JavaScript</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">フォロー</h4>
            <div className="flex space-x-4">
              <a href="#" className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}>
                <Github size={20} />
              </a>
              <a href="#" className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}>
                <Twitter size={20} />
              </a>
              <a href="#" className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}>
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className={`mt-8 pt-8 border-t text-center ${
          darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'
        }`}>
          <p>&copy; 2025 Tech Blog. Built with React 19 + TypeScript + Vite.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
