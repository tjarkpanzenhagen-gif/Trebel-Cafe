import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  href: string;
  variant?: "filled" | "outline" | "outline-light";
  children: ReactNode;
  className?: string;
}

export default function Button({
  href,
  variant = "filled",
  children,
  className = "",
}: ButtonProps) {
  const base =
    "inline-block px-6 py-3 rounded-full text-sm font-dm font-medium tracking-wide transition-all duration-300";

  const variants = {
    filled:
      "bg-terracotta text-white hover:bg-[#b3623c] hover:shadow-lg hover:-translate-y-0.5",
    outline:
      "border-2 border-terracotta text-terracotta hover:bg-terracotta hover:text-white",
    "outline-light":
      "border-2 border-white text-white hover:bg-white hover:text-espresso",
  };

  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
