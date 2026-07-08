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

export function isAufbettungRequired(persons: number, pricing: ApartmentPricing): boolean {
  return pricing.aufbettungFee > 0 && persons >= 3;
}

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
  const perNight = Number(pricing.perNight) || 0;
  const kinderbettFee = Number(pricing.kinderbettFee) || 0;
  const aufbettungFee = Number(pricing.aufbettungFee) || 0;
  const cleaningFee = Number(pricing.cleaningFee) || 0;
  const threeNightsDiscount = Number(discounts.threeNights) || 0;
  const sevenNightsDiscount = Number(discounts.sevenNights) || 0;

  const nightsTotal = nights * perNight;
  const discountPercent =
    nights >= 7 ? sevenNightsDiscount : nights >= 3 ? threeNightsDiscount : 0;
  const discountAmount = Math.round((nightsTotal * discountPercent / 100) * 100) / 100;
  const discountedNights = nightsTotal - discountAmount;
  const extrasTotal =
    (extras.kinderbett ? kinderbettFee : 0) +
    (extras.aufbettung ? aufbettungFee : 0);
  const total = Math.round((discountedNights + extrasTotal + cleaningFee) * 100) / 100;
  return { nightsTotal, discountPercent, discountAmount, extrasTotal, total };
}
