"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import type { MouseEvent } from "react";
import type { ProductContent } from "@/lib/types";
import { ensureGoogleAds, trackConversion, trackEvent } from "@/lib/tracking";

type CTAButtonProps = {
  product: ProductContent;
  className?: string;
  label?: string;
};

export function CTAButton({ product, className = "", label }: CTAButtonProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    ensureGoogleAds(product.tracking);
    trackEvent("cta_click", {
      slug: product.slug,
      checkoutUrl: product.checkoutUrl
    });
    trackConversion(product.tracking);
    window.setTimeout(() => {
      window.location.href = product.checkoutUrl;
    }, 180);
  }

  return (
    <a
      href={product.checkoutUrl}
      onClick={handleClick}
      className={`inline-flex min-h-14 items-center justify-center gap-2 rounded-md bg-accent px-6 py-4 text-center text-base font-extrabold text-white shadow-lg shadow-red-900/20 transition hover:-translate-y-0.5 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 ${className}`}
    >
      <ShieldCheck size={20} aria-hidden="true" />
      {label || product.cta}
      <ArrowRight size={20} aria-hidden="true" />
    </a>
  );
}
