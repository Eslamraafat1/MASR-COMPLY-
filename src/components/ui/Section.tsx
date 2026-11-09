import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "start",
  tone = "dark",
  action,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "start" | "center";
  tone?: "dark" | "light";
  action?: ReactNode;
}) {
  return (
    <div className={cn("mb-10 flex flex-col gap-4 sm:mb-12 md:flex-row md:items-end md:justify-between", align === "center" && "items-center text-center md:flex-col md:items-center")}>
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <span className={cn("eyebrow mb-3", tone === "light" && "!text-[#ff6b79]")}>{eyebrow}</span>}
        <h2 className={cn("text-[1.7rem] font-bold leading-[1.35] sm:text-[2.1rem]", tone === "light" ? "text-white" : "text-navy-900")}>{title}</h2>
        {text && <p className={cn("mt-3 text-base leading-8", tone === "light" ? "text-white/70" : "text-muted")}>{text}</p>}
      </div>
      {action}
    </div>
  );
}

/** Inner-page banner with breadcrumb. */
export function PageHero({ title, text, crumbs, children }: { title: string; text?: string; crumbs: { label: string; href?: string }[]; children?: ReactNode }) {
  return (
    <section className="pattern-lattice relative overflow-hidden bg-navy-900">
      <div className="absolute inset-x-0 bottom-0 flag-rule opacity-90" aria-hidden="true" />
      <div aria-hidden="true" className="pointer-events-none absolute -end-24 -top-24 size-80 rounded-full bg-flag-green/20 blur-3xl" />
      <div className="container-x relative py-12 sm:py-16">
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-white/65">
            {crumbs.map((c, i) => (
              <li key={i} className="flex items-center gap-2">
                {c.href ? (
                  <Link href={c.href} className="hover:text-white">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-white">
                    {c.label}
                  </span>
                )}
                {i < crumbs.length - 1 && <span aria-hidden="true" className="opacity-50">/</span>}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="max-w-3xl text-3xl font-bold leading-[1.35] text-white sm:text-4xl">{title}</h1>
        {text && <p className="mt-4 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">{text}</p>}
        {children && <div className="mt-7">{children}</div>}
      </div>
    </section>
  );
}
