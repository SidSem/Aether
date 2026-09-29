// Currency utility with mock conversion rates from base INR
export const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', rateFromINR: 1, name: 'Indian Rupee' },
  USD: { code: 'USD', symbol: '$', rateFromINR: 0.012, name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', rateFromINR: 0.011, name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', rateFromINR: 0.0095, name: 'British Pound' },
  JPY: { code: 'JPY', symbol: '¥', rateFromINR: 1.82, name: 'Japanese Yen' },
};

/**
 * Converts an INR amount to target currency and returns numeric value
 */
export function convertCurrency(amountInINR, currencyCode = 'INR') {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.INR;
  const converted = amountInINR * curr.rateFromINR;
  
  // Format precision: JPY and INR generally round to integer, USD/EUR/GBP to integer or 2 decimals
  if (currencyCode === 'JPY' || currencyCode === 'INR') {
    return Math.round(converted);
  }
  return Math.round(converted);
}

/**
 * Formats an INR amount according to the chosen currency with symbol and localized grouping
 */
export function formatCurrency(amountInINR, currencyCode = 'INR') {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.INR;
  const value = convertCurrency(amountInINR, currencyCode);

  let formattedNumber = '';
  try {
    formattedNumber = new Intl.NumberFormat(
      currencyCode === 'INR' ? 'en-IN' : 'en-US', 
      { maximumFractionDigits: 0 }
    ).format(value);
  } catch (e) {
    formattedNumber = value.toLocaleString();
  }

  return `${curr.symbol}${formattedNumber}`;
}
