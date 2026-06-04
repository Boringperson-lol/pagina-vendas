"use client";

import type { TrackingSettings } from "@/lib/types";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function ensureGoogleAds(settings: TrackingSettings) {
  if (!settings.googleAdsId || typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtagShim(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  if (!document.querySelector(`script[data-google-ads-id="${settings.googleAdsId}"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${settings.googleAdsId}`;
    script.dataset.googleAdsId = settings.googleAdsId;
    document.head.appendChild(script);
    window.gtag("js", new Date());
    window.gtag("config", settings.googleAdsId);
  }
}

export function trackEvent(name: string, payload: Record<string, unknown> = {}) {
  console.info("[analytics]", name, payload);
  window.gtag?.("event", name, payload);
}

export function trackConversion(settings: TrackingSettings) {
  if (!settings.googleAdsId || !settings.conversionLabel) return;

  console.info("[analytics]", "conversion", {
    send_to: `${settings.googleAdsId}/${settings.conversionLabel}`
  });
  window.gtag?.("event", "conversion", {
    send_to: `${settings.googleAdsId}/${settings.conversionLabel}`
  });
}

export async function trackClick(slug: string) {
  const payload = JSON.stringify({ slug });

  if (navigator.sendBeacon) {
    const sent = navigator.sendBeacon(
      "/api/track-click",
      new Blob([payload], { type: "application/json" })
    );
    if (sent) return true;
  }

  try {
    await fetch("/api/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true
    });
    return true;
  } catch {
    return false;
  }
}
