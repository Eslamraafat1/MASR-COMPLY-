import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * MASR COMPLY mark: an abstract pyramid (nod to Egyptian geometry) enclosing a verification check,
 * grounded on a restrained red base line with a green check — the flag colours used as accents only.
 * Original geometry; not derived from any government emblem.
 */
export function LogoMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <rect width="48" height="48" rx="11" fill="#111214" />
      <rect x="0.5" y="0.5" width="47" height="47" rx="10.5" stroke="#fff" strokeOpacity=".12" />
      <path d="M24 9 39.5 34H8.5L24 9Z" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M24 9v6" stroke="#fff" strokeOpacity=".5" strokeWidth="2.4" strokeLinecap="round" />
      <path d="m17 27 5 5 9.5-11" stroke="#ff4d5e" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="8.5" y="38.2" width="31" height="2.6" rx="1.3" fill="#fff" />
    </svg>
  );
}

export function Logo({
  tone = "dark",
  href = "/",
  subtitle,
  subtitleClassName,
  className,
}: {
  tone?: "dark" | "light";
  href?: string;
  subtitle?: string;
  subtitleClassName?: string;
  className?: string;
}) {
  const light = tone === "light";
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-3 rounded-lg", className)} aria-label="MASR COMPLY">
      <LogoMark size={40} className="shrink-0 transition-transform duration-300 group-hover:scale-[1.04]" />
      <span className="flex flex-col leading-none">
        <span
          dir="ltr"
          className={cn("font-[family-name:var(--font-en)] text-[17px] font-extrabold tracking-[0.14em]", light ? "text-white" : "text-navy-900")}
        >
          MASR<span className="text-flag-red">·</span>COMPLY
        </span>
        {subtitle && <span className={cn("mt-1.5 whitespace-nowrap text-[11px] font-medium", light ? "text-white/60" : "text-muted", subtitleClassName)}>{subtitle}</span>}
      </span>
    </Link>
  );
}
