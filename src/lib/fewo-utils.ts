export type ApartmentPricing = {
  perNight: number;
  extraBed: number;
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
  availableDates: string[];
};

export type FewoData = {
  apartments: Apartment[];
};

export function calculatePrice(
  nights: number,
  extraBeds: number,
  pricing: ApartmentPricing,
  discounts: ApartmentDiscounts
): {
  nightsTotal: number;
  discountPercent: number;
  discountAmount: number;
  extraBedTotal: number;
  total: number;
} {
  const nightsTotal = nights * pricing.perNight;
  const discountPercent =
    nights >= 7 ? discounts.sevenNights : nights >= 3 ? discounts.threeNights : 0;
  const discountAmount = Math.round((nightsTotal * discountPercent) / 100 * 100) / 100;
  const discountedNights = nightsTotal - discountAmount;
  const extraBedTotal = extraBeds * pricing.extraBed;
  const total = Math.round((discountedNights + extraBedTotal + pricing.cleaningFee) * 100) / 100;
  return { nightsTotal, discountPercent, discountAmount, extraBedTotal, total };
}
