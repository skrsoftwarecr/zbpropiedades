import type { CurrencyCode } from '@/lib/types';

export const DEFAULT_CURRENCY: CurrencyCode = 'CRC';

export function normalizeCurrency(currency?: CurrencyCode): CurrencyCode {
  return currency === 'USD' ? 'USD' : DEFAULT_CURRENCY;
}

export function currencySymbol(currency?: CurrencyCode): string {
  return normalizeCurrency(currency) === 'USD' ? '$' : '₡';
}

export function formatCurrency(amount: number, currency?: CurrencyCode): string {
  const normalized = normalizeCurrency(currency);
  const locale = normalized === 'USD' ? 'en-US' : 'es-CR';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: normalized,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
