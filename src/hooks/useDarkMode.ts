import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const useDarkMode = (): [boolean, () => void] => {
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('darkMode', false);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return [darkMode, toggleDarkMode];
};
