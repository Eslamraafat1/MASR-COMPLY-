import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "secondary" | "outline" | "ghost" | "danger" | "light";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary: "bg-navy-900 text-white hover:bg-navy-700 shadow-[0_1px_0_rgb(255_255_255/.12)_inset]",
  accent: "bg-flag-green text-white hover:bg-flag-green-dark",
  secondary: "bg-navy-50 text-navy-900 hover:bg-navy-100",
  outline: "border border-[#cfd7e3] bg-white text-navy-900 hover:border-navy-900/40 hover:bg-surface",
  ghost: "text-navy-900 hover:bg-navy-50",
  danger: "bg-flag-red text-white hover:bg-flag-red-dark",
  light: "bg-white text-navy-900 hover:bg-white/90",
};
const SIZE: Record<Size, string> = {
  sm: "min-h-9 px-3.5 text-sm gap-1.5",
  md: "min-h-11 px-5 text-[15px] gap-2",
  lg: "min-h-12 px-6 text-base gap-2.5",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex select-none items-center justify-center whitespace-nowrap rounded-lg font-semibold transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55",
    VARIANT[variant],
    SIZE[size],
    className,
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; loading?: boolean; children: ReactNode };

export function Button({ variant, size, loading, className, children, disabled, type = "button", ...rest }: BtnProps) {
  return (
    <button type={type} disabled={disabled || loading} aria-busy={loading || undefined} className={buttonClasses(variant, size, className)} {...rest}>
      {loading && <Loader2 className="animate-spin" size={16} aria-hidden="true" />}
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant,
  size,
  className,
  children,
  ...rest
}: { href: string; variant?: Variant; size?: Size; className?: string; children: ReactNode } & Omit<React.ComponentProps<typeof Link>, "href" | "className">) {
  return (
    <Link href={href} className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}
