import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Country configuration
const COUNTRIES = {
  MW: {
    code: 'MW',
    name: 'Malawi',
    currency: 'MWK',
    currencySymbol: 'MWK',
    flag: '🇲🇼',
    paymentMethods: ['cash_on_delivery', 'airtel_money', 'tnm_mpamba', 'bank_transfer', 'wallet']
  },
  ZA: {
    code: 'ZA',
    name: 'South Africa',
    currency: 'ZAR',
    currencySymbol: 'R',
    flag: '🇿🇦',
    paymentMethods: ['cash_on_delivery', 'bank_transfer', 'wallet']
  }
};

// Default enabled countries (can be overridden by API)
const DEFAULT_ENABLED_COUNTRIES = {
  MW: true,
  ZA: false
};

// Auto-detect country based on browser settings
const detectCountry = () => {
  try {
    // Try timezone first
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone?.includes('Johannesburg') || timezone?.includes('Africa/Johannesburg')) {
      return 'ZA';
    }

    // Check browser language/locale
    const language = navigator.language || navigator.userLanguage;
    if (language?.includes('za') || language?.includes('ZA')) {
      return 'ZA';
    }

    // Default to Malawi
    return 'MW';
  } catch {
    return 'MW';
  }
};

const useCountryStore = create(
  persist(
    (set, get) => ({
      // State
      country: null, // null means not yet selected
      showCountryModal: false,
      enabledCountries: DEFAULT_ENABLED_COUNTRIES,
      isLoadingEnabledCountries: true,

      // Actions
      setCountry: (countryCode) => {
        const enabledCountries = get().enabledCountries;
        // Only allow setting to enabled countries
        if (COUNTRIES[countryCode] && enabledCountries[countryCode]) {
          set({ country: countryCode, showCountryModal: false });
        }
      },

      openCountryModal: () => set({ showCountryModal: true }),
      closeCountryModal: () => set({ showCountryModal: false }),

      // Fetch enabled countries from API
      fetchEnabledCountries: async () => {
        try {
          const response = await fetch('/api/settings/enabled-countries');
          const data = await response.json();
          if (data.success && data.data) {
            set({ enabledCountries: data.data, isLoadingEnabledCountries: false });
            return data.data;
          }
        } catch (error) {
          console.error('Failed to fetch enabled countries:', error);
        }
        set({ isLoadingEnabledCountries: false });
        return get().enabledCountries;
      },

      // Initialize country (called on app start)
      initializeCountry: async () => {
        // First fetch enabled countries
        const enabledCountries = await get().fetchEnabledCountries();
        const enabledList = Object.entries(enabledCountries)
          .filter(([_, enabled]) => enabled)
          .map(([code]) => code);

        const currentCountry = get().country;

        // If only one country is enabled, auto-select it
        if (enabledList.length === 1) {
          set({ country: enabledList[0], showCountryModal: false });
          return;
        }

        // If current country is not enabled, reset
        if (currentCountry && !enabledCountries[currentCountry]) {
          const detected = detectCountry();
          const validDetected = enabledCountries[detected] ? detected : enabledList[0];
          set({ country: validDetected, showCountryModal: true });
          return;
        }

        if (!currentCountry) {
          // First visit - auto-detect and show modal (only if multiple countries enabled)
          const detected = detectCountry();
          const validDetected = enabledCountries[detected] ? detected : enabledList[0];
          set({ country: validDetected, showCountryModal: enabledList.length > 1 });
        }
      },

      // Getters
      getCountryConfig: () => {
        const country = get().country || 'MW';
        return COUNTRIES[country];
      },

      getCurrencyCode: () => {
        const config = get().getCountryConfig();
        return config.currency;
      },

      getCurrencySymbol: () => {
        const config = get().getCountryConfig();
        return config.currencySymbol;
      },

      getCountryName: () => {
        const config = get().getCountryConfig();
        return config.name;
      },

      getFlag: () => {
        const config = get().getCountryConfig();
        return config.flag;
      },

      getPaymentMethods: () => {
        const config = get().getCountryConfig();
        return config.paymentMethods;
      },

      isPaymentMethodAvailable: (method) => {
        const paymentMethods = get().getPaymentMethods();
        return paymentMethods.includes(method);
      },

      // Get enabled countries list
      getEnabledCountries: () => {
        const enabledCountries = get().enabledCountries;
        return Object.entries(COUNTRIES)
          .filter(([code]) => enabledCountries[code])
          .map(([_, config]) => config);
      },

      // Check if country is enabled
      isCountryEnabled: (countryCode) => {
        return get().enabledCountries[countryCode] || false;
      },

      // Check if country selector should be shown (more than one country enabled)
      shouldShowCountrySelector: () => {
        const enabledCountries = get().enabledCountries;
        const enabledCount = Object.values(enabledCountries).filter(Boolean).length;
        return enabledCount > 1;
      }
    }),
    {
      name: 'country-storage',
      partialize: (state) => ({
        country: state.country
      })
    }
  )
);

// Export country config for use in other files
export { COUNTRIES };
export default useCountryStore;
