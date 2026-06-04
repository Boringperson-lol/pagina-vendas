"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import type { MouseEvent } from "react";
import type { ProductContent } from "@/lib/types";
import { ensureGoogleAds, trackClick, trackConversion, trackEvent } from "@/lib/tracking";

type CTAButtonProps = {
  product: ProductContent;
  className?: string;
  label?: string;
  variant?: "primary" | "secondary";
};

const variants = {
  primary: "bg-accent text-white shadow-red-950/20 hover:bg-secondary hover:text-primary focus:ring-secondary/35",
  secondary: "bg-primary text-white shadow-primary/20 hover:bg-secondary hover:text-primary focus:ring-secondary/35"
};

export function CTAButton({ product, className = "", label, variant = "primary" }: CTAButtonProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    ensureGoogleAds(product.tracking);
    trackEvent("cta_click", {
      slug: product.slug,
      checkoutUrl: product.checkoutUrl
    });
    void trackClick(product.slug);
    trackConversion(product.tracking);
    window.setTimeout(() => {
      window.location.href = product.checkoutUrl;
    }, 180);
  }

  return (
    <a
      href={product.checkoutUrl}
      onClick={handleClick}
      className={`inline-flex min-h-14 items-center justify-center gap-2 rounded-md px-6 py-4 text-center text-base font-extrabold shadow-lg transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 ${variants[variant]} ${className}`}
    >
      <ShieldCheck size={20} aria-hidden="true" />
      {label || product.cta}
      <ArrowRight size={20} aria-hidden="true" />
    </a>
  );
}
