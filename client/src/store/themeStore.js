import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set, get) => ({
      isDarkMode: false,

      toggleDarkMode: () => {
        const newDarkMode = !get().isDarkMode;
        set({ isDarkMode: newDarkMode });

        // Apply dark class to HTML element
        if (newDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      setDarkMode: (isDark) => {
        set({ isDarkMode: isDark });

        // Apply dark class to HTML element
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      // Initialize theme from stored preference or system preference
      initializeTheme: () => {
        const storedDarkMode = get().isDarkMode;

        // Apply the stored preference
        if (storedDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }),
    {
      name: 'mugodi-theme',
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    }
  )
);

export default useThemeStore;
