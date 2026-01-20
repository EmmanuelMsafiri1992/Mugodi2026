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

      // Actions
      setCountry: (countryCode) => {
        if (COUNTRIES[countryCode]) {
          set({ country: countryCode, showCountryModal: false });
        }
      },

      openCountryModal: () => set({ showCountryModal: true }),
      closeCountryModal: () => set({ showCountryModal: false }),

      // Initialize country (called on app start)
      initializeCountry: () => {
        const currentCountry = get().country;
        if (!currentCountry) {
          // First visit - auto-detect and show modal
          const detected = detectCountry();
          set({ country: detected, showCountryModal: true });
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
