import { Leaf } from "@/components/ui/Leaf";

interface SectionLabelProps {
  children: string;
  light?: boolean;
}

export default function SectionLabel({ children, light = false }: SectionLabelProps) {
  return (
    <p
      className={`font-cormorant italic text-lg tracking-widest mb-3 inline-flex items-center gap-2 ${
        light ? "text-sand" : "text-terracotta"
      }`}
    >
      <span className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
        <Leaf color={light ? "#D9B888" : "#A94B22"} rotate={-15} />
      </span>
      {children}
    </p>
  );
}
