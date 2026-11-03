/* eslint-disable @next/next/no-img-element */

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`relative inline-flex ${className}`}>
      <img src="/brand/logo.svg" alt="Branded Genius" width={620} height={172} draggable={false} className="block h-full w-auto" />
      <span aria-hidden className="logo-shine pointer-events-none absolute inset-0" />
    </span>
  );
}
