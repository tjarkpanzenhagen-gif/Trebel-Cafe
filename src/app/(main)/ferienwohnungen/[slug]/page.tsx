import { readFewo } from "@/lib/fewo-store";
import { readBookings, getBookedDatesForApartment } from "@/lib/bookings-store";
import { notFound } from "next/navigation";
import Link from "next/link";
import PricingTable from "@/components/fewo/PricingTable";
import BookingForm from "@/components/fewo/BookingForm";
import WeeklyMenuTeaser from "@/components/fewo/WeeklyMenuTeaser";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ImageGallery from "@/components/fewo/ImageGallery";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

const PLACEHOLDER_IMAGES: Record<string, string[]> = {
  "wohnung-1": [
    "/images/wohnungen/wohnung-01.jpg",
    "/images/wohnungen/wohnung-02.jpg",
    "/images/wohnungen/wohnung-03.jpg",
  ],
  "wohnung-2": [
    "/images/wohnungen/wohnung-04.jpg",
    "/images/wohnungen/wohnung-05.jpg",
    "/images/wohnungen/wohnung-01.jpg",
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await readFewo();
  const apt = data.apartments.find((a) => a.slug === slug);
  return {
    title: apt ? `${apt.name} | Trebel Café` : "Ferienwohnung | Trebel Café",
    description: apt?.description,
  };
}

export default async function ApartmentDetailPage({ params }: Props) {
  const { slug } = await params;
  const [data, bookingsData] = await Promise.all([readFewo(), readBookings()]);
  const apt = data.apartments.find((a) => a.slug === slug);
  if (!apt) notFound();

  const bookedDates = getBookedDatesForApartment(bookingsData.bookings, apt.id);
  const blockedDates = [...(data.globalBlockedDates ?? []), ...(apt.blockedDates ?? [])];
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
          <div>
            <span className="font-dm text-xs text-cream/35 uppercase tracking-widest">
              Ferienwohnung · Tribsees
            </span>
            <h1 className="font-playfair text-4xl md:text-5xl mt-1">{apt.name}</h1>
            <p className="font-dm text-cream/65 mt-3 leading-relaxed text-sm max-w-xl">
              {apt.description}
            </p>
          </div>

          {/* Amenity badges */}
          <div className="flex flex-wrap gap-2 mt-6">
            <span className="font-dm text-xs text-terracotta/90 bg-terracotta/15 border border-terracotta/25 px-3 py-1.5 rounded-full">
              ✓ Bettwäsche & Handtücher inklusive
            </span>
            <span className="font-dm text-xs text-cream/50 bg-cream/8 border border-cream/15 px-3 py-1.5 rounded-full">
              WLAN
            </span>
            <span className="font-dm text-xs text-cream/50 bg-cream/8 border border-cream/15 px-3 py-1.5 rounded-full">
              Ruhige Lage
            </span>
            <span className="font-dm text-xs text-cream/50 bg-cream/8 border border-cream/15 px-3 py-1.5 rounded-full">
              {apt.maxPersons} Personen (opt. {apt.maxPersons + 1})
            </span>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-cream px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <ImageGallery images={images} alt={apt.name} />
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

          </div>

          {/* Right column — booking form */}
          <AnimatedSection delay={0.2} className="bg-sand/30 rounded-2xl p-6 h-fit">
            <BookingForm
              apartmentName={apt.name}
              apartmentId={apt.id}
              maxPersons={apt.maxPersons}
              pricing={apt.pricing}
              discounts={apt.discounts}
              blockedDates={blockedDates}
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
