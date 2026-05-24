export type ApartmentPricing = {
  perNight: number;
  kinderbettFee: number;
  aufbettungFee: number;
  cleaningFee: number;
};

export type ApartmentDiscounts = {
  threeNights: number;
  sevenNights: number;
};

export type Apartment = {
  id: string;
  slug: string;
  name: string;
  description: string;
  details: string;
  maxPersons: number;
  images: string[];
  pricing: ApartmentPricing;
  discounts: ApartmentDiscounts;
  blockedDates: string[];
};

export type FewoData = {
  apartments: Apartment[];
  globalBlockedDates: string[];
};

export function calculatePrice(
  nights: number,
  extras: { kinderbett: boolean; aufbettung: boolean },
  pricing: ApartmentPricing,
  discounts: ApartmentDiscounts
): {
  nightsTotal: number;
  discountPercent: number;
  discountAmount: number;
  extrasTotal: number;
  total: number;
} {
  const nightsTotal = nights * pricing.perNight;
  const discountPercent =
    nights >= 7 ? discounts.sevenNights : nights >= 3 ? discounts.threeNights : 0;
  const discountAmount = Math.round((nightsTotal * discountPercent / 100) * 100) / 100;
  const discountedNights = nightsTotal - discountAmount;
  const extrasTotal =
    (extras.kinderbett ? pricing.kinderbettFee : 0) +
    (extras.aufbettung ? pricing.aufbettungFee : 0);
  const total = Math.round((discountedNights + extrasTotal + pricing.cleaningFee) * 100) / 100;
  return { nightsTotal, discountPercent, discountAmount, extrasTotal, total };
}
