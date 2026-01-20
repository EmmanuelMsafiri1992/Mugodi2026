import useCountryStore from '../store/countryStore';

/**
 * Format a price based on the selected country
 * @param {number} amount - The amount in MWK
 * @param {string} country - The country code ('MW' or 'ZA'), defaults to store value
 * @returns {string} - Formatted price string
 */
export const formatPrice = (amount, country = null) => {
  const selectedCountry = country || useCountryStore.getState().country || 'MW';

  if (selectedCountry === 'ZA') {
    return `R ${(amount || 0).toLocaleString()}`;
  }
  return `MWK ${(amount || 0).toLocaleString()}`;
};

/**
 * Get the appropriate price from a product object based on selected country
 * @param {object} product - The product object
 * @param {string} priceType - Type of price: 'price', 'discountPrice', 'finalPrice'
 * @param {string} country - The country code, defaults to store value
 * @returns {number} - The price amount
 */
export const getProductPrice = (product, priceType = 'price', country = null) => {
  if (!product) return 0;

  const selectedCountry = country || useCountryStore.getState().country || 'MW';

  if (selectedCountry === 'ZA') {
    switch (priceType) {
      case 'price':
        return product.priceZAR || 0;
      case 'discountPrice':
        return product.discountPriceZAR || 0;
      case 'finalPrice':
        return product.finalPriceZAR || product.discountPriceZAR || product.priceZAR || 0;
      default:
        return product.priceZAR || 0;
    }
  }

  // Default to MWK
  switch (priceType) {
    case 'price':
      return product.price || 0;
    case 'discountPrice':
      return product.discountPrice || 0;
    case 'finalPrice':
      return product.finalPrice || product.discountPrice || product.price || 0;
    default:
      return product.price || 0;
  }
};

/**
 * Format product price display with proper currency
 * @param {object} product - The product object
 * @param {string} country - The country code, defaults to store value
 * @returns {string} - Formatted price string
 */
export const formatProductPrice = (product, country = null) => {
  const finalPrice = getProductPrice(product, 'finalPrice', country);
  return formatPrice(finalPrice, country);
};

/**
 * Get the currency symbol for a country
 * @param {string} country - The country code
 * @returns {string} - Currency symbol
 */
export const getCurrencySymbol = (country = null) => {
  const selectedCountry = country || useCountryStore.getState().country || 'MW';
  return selectedCountry === 'ZA' ? 'R' : 'MWK';
};

/**
 * Get the currency code for a country
 * @param {string} country - The country code
 * @returns {string} - Currency code (MWK or ZAR)
 */
export const getCurrencyCode = (country = null) => {
  const selectedCountry = country || useCountryStore.getState().country || 'MW';
  return selectedCountry === 'ZA' ? 'ZAR' : 'MWK';
};

/**
 * Check if product has ZAR pricing available
 * @param {object} product - The product object
 * @returns {boolean} - Whether ZAR pricing is available
 */
export const hasZARPricing = (product) => {
  return product && (product.priceZAR > 0);
};

/**
 * Calculate discount percentage for a product
 * @param {object} product - The product object
 * @param {string} country - The country code
 * @returns {number} - Discount percentage (0-100)
 */
export const getDiscountPercent = (product, country = null) => {
  if (!product) return 0;

  // If product has explicit discount percent, use it
  if (product.discountPercent) {
    return product.discountPercent;
  }

  const selectedCountry = country || useCountryStore.getState().country || 'MW';

  if (selectedCountry === 'ZA') {
    if (product.discountPriceZAR && product.priceZAR > product.discountPriceZAR) {
      return Math.round((1 - product.discountPriceZAR / product.priceZAR) * 100);
    }
  } else {
    if (product.discountPrice && product.price > product.discountPrice) {
      return Math.round((1 - product.discountPrice / product.price) * 100);
    }
  }

  return 0;
};
