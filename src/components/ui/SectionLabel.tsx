interface SectionLabelProps {
  children: string;
  light?: boolean;
}

export default function SectionLabel({ children, light = false }: SectionLabelProps) {
  return (
    <p
      className={`font-cormorant italic text-lg tracking-widest mb-3 ${
        light ? "text-sand" : "text-terracotta"
      }`}
    >
      {children}
    </p>
  );
}
