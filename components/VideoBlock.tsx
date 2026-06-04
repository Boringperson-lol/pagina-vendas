"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import type { ProductContent } from "@/lib/types";
import { trackEvent } from "@/lib/tracking";

export function VideoBlock({ product }: { product: ProductContent }) {
  const [isPlaying, setIsPlaying] = useState(false);

  function handlePlay() {
    trackEvent("video_click", { slug: product.slug, videoUrl: product.videoUrl });
    setIsPlaying(true);
  }

  return (
    <section className="bg-white px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-ink md:text-4xl">Veja mais detalhes do material</h2>
          <p className="mt-3 text-lg text-muted">Clique no video para conhecer a entrega antes de garantir o acesso.</p>
        </div>
        <div className="relative aspect-video w-full overflow-hidden rounded-md bg-ink shadow-xl">
          {isPlaying ? (
            <iframe
              className="h-full w-full"
              src={product.videoUrl}
              title={`Video de ${product.slug}`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={handlePlay}
              className="flex h-full w-full flex-col items-center justify-center gap-4 bg-primary text-white"
              aria-label="Reproduzir video"
            >
              <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white text-accent shadow-lg transition hover:scale-105">
                <Play size={38} fill="currentColor" aria-hidden="true" />
              </span>
              <span className="text-lg font-extrabold">Clique para assistir</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
