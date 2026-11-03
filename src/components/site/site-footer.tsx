import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { CONTACT, LINKS, NAV } from "@/content/home";
import { BrandLogo } from "./brand-logo";

type FooterLink = { label: string; href: string; external?: boolean };

function Column({ title, links, className }: { title: string; links: FooterLink[]; className?: string }) {
  return (
    <div className={className}>
      <h4 className="text-[14px] font-medium text-white">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              {...(l.external ? { target: "_blank", rel: "noopener" } : {})}
              className="text-[15px] text-mute transition-colors duration-200 hover:text-white"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/[0.06] pt-20">
      <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-x-8 gap-y-12 px-5 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:px-10">
        <div className="col-span-2 md:col-span-1">
          <BrandLogo className="h-[46px]" />
          <p className="mt-5 max-w-[320px] text-[15px] leading-relaxed text-mute">
            KI-Agenten, Automatisierungen und intelligente Workflows für Unternehmen. Von der Potenzialanalyse bis zur Umsetzung.
          </p>
        </div>
        <Column title="Entdecken" links={NAV} />
        <Column
          title="Kontakt"
          className="col-span-2 max-md:order-last md:col-span-1"
          links={[
            { label: CONTACT.email, href: `mailto:${CONTACT.email}` },
            { label: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/\s/g, "")}` },
            { label: "Beratungsgespräch buchen", href: LINKS.booking, external: true },
          ]}
        />
        <Column
          title="Rechtliches"
          links={[
            { label: "Impressum", href: LINKS.imprint, external: true },
            { label: "Datenschutz", href: LINKS.privacy, external: true },
            { label: "AGB", href: LINKS.terms, external: true },
          ]}
        />
      </div>

      <div className="mx-auto mt-14 h-[64px] max-w-[1420px] px-4 sm:h-[120px] lg:h-[200px]">
        <TextHoverEffect text="BRANDED GENIUS" />
      </div>

      <div className="mx-auto flex max-w-[1320px] flex-col gap-2 border-t border-white/[0.06] px-5 py-7 text-[13px] text-mute md:flex-row md:items-center md:justify-between md:px-10">
        <p>© 2026 Branded Genius, {CONTACT.city}</p>
        <a href="#top" className="transition-colors duration-200 hover:text-white">
          Nach oben
        </a>
      </div>
    </footer>
  );
}
