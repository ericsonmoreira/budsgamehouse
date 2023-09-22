import { useEffect, useState } from 'react';

const getCurrentTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

const useThemeDetector = (): 'dark' | 'light' => {
  const [isDarkTheme, setIsDarkTheme] = useState(getCurrentTheme());

  const mqListener = (e: MediaQueryListEvent) => {
    setIsDarkTheme(e.matches);
  };

  useEffect(() => {
    const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');

    darkThemeMq.addEventListener('change', mqListener);

    return () => darkThemeMq.removeEventListener('change', mqListener);
  }, []);

  return isDarkTheme ? 'dark' : 'light';
};

export default useThemeDetector;
