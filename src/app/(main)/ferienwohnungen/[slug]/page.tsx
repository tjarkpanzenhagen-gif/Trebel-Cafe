import { readFewo } from "@/lib/fewo-store";
import { readBookings, getBookedDatesForApartment } from "@/lib/bookings-store";
import { notFound } from "next/navigation";
import Link from "next/link";
import PricingTable from "@/components/fewo/PricingTable";
import AvailabilityCalendar from "@/components/fewo/AvailabilityCalendar";
import BookingForm from "@/components/fewo/BookingForm";
import WeeklyMenuTeaser from "@/components/fewo/WeeklyMenuTeaser";
import AnimatedSection from "@/components/ui/AnimatedSection";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

const PLACEHOLDER_IMAGES: Record<string, string[]> = {
  "wohnung-1": [
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=900&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=450&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=450&auto=format&fit=crop&q=80",
  ],
  "wohnung-2": [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=450&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=450&auto=format&fit=crop&q=80",
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await readFewo();
  const apt = data.apartments.find((a) => a.slug === slug);
  return {
    title: apt ? `${apt.name} | Trebelcafé` : "Ferienwohnung | Trebelcafé",
    description: apt?.description,
  };
}

export default async function ApartmentDetailPage({ params }: Props) {
  const { slug } = await params;
  const [data, bookingsData] = await Promise.all([readFewo(), readBookings()]);
  const apt = data.apartments.find((a) => a.slug === slug);
  if (!apt) notFound();

  const bookedDates = getBookedDatesForApartment(bookingsData.bookings, apt.id);
  const images =
    apt.images.length > 0
      ? apt.images
      : (PLACEHOLDER_IMAGES[apt.id] ?? PLACEHOLDER_IMAGES["wohnung-1"]);

  return (
    <main>
      {/* Header */}
      <section className="bg-espresso text-cream py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-terracotta/8 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <Link
            href="/ferienwohnungen"
            className="font-dm text-xs text-cream/45 hover:text-cream transition-colors mb-6 inline-block"
          >
            ← Zurück zur Übersicht
          </Link>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="font-dm text-xs text-cream/35 uppercase tracking-widest">
                Ferienwohnung · Tribsees
              </span>
              <h1 className="font-playfair text-4xl md:text-5xl mt-1">{apt.name}</h1>
              <p className="font-dm text-cream/65 mt-3 max-w-lg leading-relaxed text-sm">
                {apt.description}
              </p>
            </div>
            <div className="text-right">
              <p className="font-playfair text-3xl text-terracotta">{apt.pricing.perNight} €</p>
              <p className="font-dm text-xs text-cream/35 mt-0.5">pro Nacht</p>
            </div>
          </div>

          {/* Amenity badges */}
          <div className="flex flex-wrap gap-2 mt-6">
            <span className="font-dm text-xs text-terracotta/90 bg-terracotta/15 border border-terracotta/25 px-3 py-1.5 rounded-full">
              ✓ Frühstück inklusive
            </span>
            <span className="font-dm text-xs text-cream/50 bg-cream/8 border border-cream/15 px-3 py-1.5 rounded-full">
              WLAN
            </span>
            <span className="font-dm text-xs text-cream/50 bg-cream/8 border border-cream/15 px-3 py-1.5 rounded-full">
              Ruhige Lage
            </span>
            <span className="font-dm text-xs text-cream/50 bg-cream/8 border border-cream/15 px-3 py-1.5 rounded-full">
              bis zu {apt.maxPersons} Personen
            </span>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-cream px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-3 rounded-2xl overflow-hidden h-72">
            <div className="col-span-2 relative overflow-hidden">
              <img
                src={images[0]}
                alt={apt.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="grid grid-rows-2 gap-3">
              {images.slice(1, 3).map((src, i) => (
                <div key={i} className="relative overflow-hidden">
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content grid */}
      <section className="bg-cream px-6 pb-20">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Left column */}
          <div className="space-y-10">
            <AnimatedSection>
              <h2 className="font-playfair text-2xl text-espresso mb-3">Über die Wohnung</h2>
              <p className="font-dm text-sm text-espresso/70 leading-relaxed">{apt.details}</p>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h2 className="font-playfair text-2xl text-espresso mb-3">Preise</h2>
              <PricingTable pricing={apt.pricing} discounts={apt.discounts} />
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <h2 className="font-playfair text-2xl text-espresso mb-3">Verfügbarkeit</h2>
              <AvailabilityCalendar availableDates={apt.availableDates} bookedDates={bookedDates} />
            </AnimatedSection>
          </div>

          {/* Right column — booking form */}
          <AnimatedSection delay={0.2} className="bg-sand/30 rounded-2xl p-6 h-fit">
            <BookingForm
              apartmentName={apt.name}
              apartmentId={apt.id}
              pricing={apt.pricing}
              discounts={apt.discounts}
              availableDates={apt.availableDates}
              bookedDates={bookedDates}
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Weekly menu */}
      <WeeklyMenuTeaser />
    </main>
  );
}
