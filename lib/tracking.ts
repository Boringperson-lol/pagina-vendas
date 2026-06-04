"use client";

import type { TrackingSettings } from "@/lib/types";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    __trackingLock?: boolean;
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

const clickCooldownMs = 500;
const lastTrackedClickBySlug = new Map<string, number>();

export async function trackClick(slug: string) {
  if (window.__trackingLock) return false;
  window.__trackingLock = true;

  const now = Date.now();
  const lastTrackedAt = lastTrackedClickBySlug.get(slug) || 0;

  if (now - lastTrackedAt < clickCooldownMs) {
    return false;
  }

  lastTrackedClickBySlug.set(slug, now);
  console.log("trackClick disparado", slug);

  const payload = JSON.stringify({ slug });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      "/api/track-click",
      new Blob([payload], { type: "application/json" })
    );
    return true;
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
