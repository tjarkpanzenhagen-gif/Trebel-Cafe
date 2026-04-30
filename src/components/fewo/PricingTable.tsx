import type { ApartmentPricing, ApartmentDiscounts } from "@/lib/fewo-utils";

type Props = {
  pricing: ApartmentPricing;
  discounts: ApartmentDiscounts;
};

export default function PricingTable({ pricing, discounts }: Props) {
  return (
    <div className="bg-sand/40 rounded-2xl p-5 space-y-3">
      <div className="flex justify-between items-center">
        <span className="font-dm text-sm text-espresso">Preis / Nacht</span>
        <span className="font-playfair text-terracotta font-semibold">{pricing.perNight} €</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-dm text-sm text-espresso/70">Aufbettung</span>
        <span className="font-dm text-sm text-espresso">{pricing.extraBed} € / Person</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-dm text-sm text-espresso/70">Endreinigung</span>
        <span className="font-dm text-sm text-espresso">{pricing.cleaningFee} €</span>
      </div>
      <div className="border-t border-sand pt-3 space-y-1.5">
        <p className="font-dm text-xs text-espresso/50 uppercase tracking-wider mb-2">Rabatte</p>
        <div className="flex justify-between items-center">
          <span className="font-dm text-sm text-sage">✓ Ab 3 Nächten</span>
          <span className="font-dm text-sm font-medium text-sage">{discounts.threeNights}% Rabatt</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-dm text-sm text-sage">✓ Ab 7 Nächten</span>
          <span className="font-dm text-sm font-medium text-sage">{discounts.sevenNights}% Rabatt</span>
        </div>
      </div>
    </div>
  );
}
