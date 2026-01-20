import { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, ChevronDown, X } from 'lucide-react';
import useCountryStore, { COUNTRIES } from '../store/countryStore';

// Country Modal - shown on first visit (only when multiple countries enabled)
export const CountryModal = () => {
  const {
    showCountryModal,
    closeCountryModal,
    setCountry,
    country,
    getEnabledCountries,
    shouldShowCountrySelector
  } = useCountryStore();

  const enabledCountries = getEnabledCountries();

  // Don't show modal if only one country enabled
  if (!showCountryModal || !shouldShowCountrySelector()) return null;

  const handleSelectCountry = (countryCode) => {
    setCountry(countryCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden dark:bg-gray-800">
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center dark:bg-primary-900/30">
            <MapPin className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">
            Where are you shopping from?
          </h2>
          <p className="text-gray-500 mb-6 dark:text-gray-400">
            Select your country to see prices and payment options available in your area.
          </p>

          <div className={`grid gap-4 mb-4 ${enabledCountries.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {enabledCountries.map((countryConfig) => (
              <button
                key={countryConfig.code}
                onClick={() => handleSelectCountry(countryConfig.code)}
                className={`p-4 border-2 rounded-xl transition-all hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 ${
                  country === countryConfig.code
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                    : 'border-gray-200 dark:border-gray-600'
                }`}
              >
                <span className="text-4xl mb-2 block">{countryConfig.flag}</span>
                <span className="font-semibold text-gray-900 dark:text-white block">
                  {countryConfig.name}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {countryConfig.currencySymbol} ({countryConfig.currency})
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={closeCountryModal}
            className="w-full py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

// Country Dropdown - for header/navbar (hidden when only one country enabled)
export const CountryDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const {
    country,
    setCountry,
    getFlag,
    getCountryName,
    getCurrencyCode,
    getEnabledCountries,
    shouldShowCountrySelector
  } = useCountryStore();

  const enabledCountries = getEnabledCountries();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = useCallback((e) => {
    e.stopPropagation();
    setIsOpen(prev => !prev);
  }, []);

  const handleSelectCountry = (countryCode) => {
    setCountry(countryCode);
    setIsOpen(false);
  };

  // Don't show dropdown if only one country enabled
  if (!shouldShowCountrySelector()) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
      >
        <span className="text-lg">{getFlag()}</span>
        <span className="text-sm font-medium hidden sm:inline">{getCurrencyCode()}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-[60] dark:bg-gray-800 dark:border-gray-700">
          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Select Country</p>
          </div>
          {enabledCountries.map((countryConfig) => (
            <button
              key={countryConfig.code}
              onClick={() => handleSelectCountry(countryConfig.code)}
              className={`w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center space-x-3 dark:hover:bg-gray-700 ${
                country === countryConfig.code
                  ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-200'
              }`}
            >
              <span className="text-xl">{countryConfig.flag}</span>
              <div className="flex-1">
                <span className="block text-sm font-medium">{countryConfig.name}</span>
                <span className="block text-xs text-gray-500 dark:text-gray-400">
                  {countryConfig.currencySymbol} {countryConfig.currency}
                </span>
              </div>
              {country === countryConfig.code && (
                <span className="w-2 h-2 bg-primary-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Main export component that includes both modal and dropdown
const CountrySelector = ({ variant = 'dropdown' }) => {
  const { initializeCountry } = useCountryStore();

  // Initialize country detection on mount
  useEffect(() => {
    initializeCountry();
  }, [initializeCountry]);

  if (variant === 'modal') {
    return <CountryModal />;
  }

  return <CountryDropdown />;
};

export default CountrySelector;
