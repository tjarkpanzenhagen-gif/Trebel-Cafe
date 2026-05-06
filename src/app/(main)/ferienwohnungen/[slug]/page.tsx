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

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const data = await readFewo();
  return data.apartments.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await readFewo();
  const apt = data.apartments.find((a) => a.slug === slug);
  return {
    title: apt ? `${apt.name} | Trebelcafé` : "Ferienwohnung | Trebelcafé",
    description: apt?.description,
  };
}

const PLACEHOLDER_COLORS = ["bg-[#C8B89A]", "bg-[#D4C4AC]", "bg-[#BFB090]", "bg-[#C0AD95]"];

export default async function ApartmentDetailPage({ params }: Props) {
  const { slug } = await params;
  const [data, bookingsData] = await Promise.all([readFewo(), readBookings()]);
  const apt = data.apartments.find((a) => a.slug === slug);
  if (!apt) notFound();

  const bookedDates = getBookedDatesForApartment(bookingsData.bookings, apt.id);
  const hasImages = apt.images.length > 0;

  return (
    <main>
      {/* Header */}
      <section className="bg-espresso text-cream py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/ferienwohnungen"
            className="font-dm text-xs text-cream/50 hover:text-cream transition-colors mb-6 inline-block"
          >
            ← Zurück zur Übersicht
          </Link>
          <h1 className="font-playfair text-4xl md:text-5xl">{apt.name}</h1>
          <p className="font-dm text-cream/70 mt-3 max-w-lg leading-relaxed">
            {apt.description}
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-cream px-6 py-10">
        <div className="max-w-4xl mx-auto">
          {hasImages ? (
            <div className="grid grid-cols-3 gap-3 rounded-2xl overflow-hidden h-72">
              {apt.images.slice(0, 4).map((src, i) => (
                <div key={i} className={i === 0 ? "col-span-2" : ""}>
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 rounded-2xl overflow-hidden h-64">
              <div
                className={`${PLACEHOLDER_COLORS[0]} col-span-2 flex items-center justify-center`}
              >
                <span className="font-dm text-xs text-espresso/40">Fotos folgen</span>
              </div>
              {PLACEHOLDER_COLORS.slice(1, 3).map((cls, i) => (
                <div key={i} className={cls} />
              ))}
            </div>
          )}
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
              <p className="font-dm text-xs text-espresso/50 mt-4">
                Bis zu {apt.maxPersons} Personen
              </p>
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
