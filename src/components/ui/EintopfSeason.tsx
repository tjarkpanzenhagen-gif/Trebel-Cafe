type Props = {
  upcoming?: boolean;
  className?: string;
};

export function EintopfSeason({ upcoming = false, className = "" }: Props) {
  return (
    <div
      className={`border border-terracotta/30 bg-paper card-warm kraft-texture rounded-2xl px-6 py-6 text-center ${className}`}
    >
      <div className="w-12 h-px bg-terracotta mx-auto mb-4" />
      <p className="font-dm text-xs uppercase tracking-widest text-terracotta mb-2">
        {upcoming ? "Ab Dezember" : "Winterzeit"}
      </p>
      <h3 className="font-playfair text-2xl text-espresso mb-2">
        {upcoming ? "Ab Dezember gibt es Eintöpfe" : "Bei uns gibt es Eintöpfe"}
      </h3>
      <p className="font-dm text-sm text-espresso/60 leading-relaxed max-w-md mx-auto">
        Bis Ende Februar 2027 kochen wir für euch wärmende Eintöpfe — frisch aus unserer Küche.
        Welcher heute auf dem Herd steht, erfahrt ihr direkt vor Ort.
      </p>
    </div>
  );
}
