"use client";

import { CheckCircle2, FileText, Gift, LockKeyhole, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import type { ProductContent } from "@/lib/types";
import { getStoredProduct } from "@/lib/storage";
import { ensureGoogleAds, trackEvent } from "@/lib/tracking";
import { CTAButton } from "@/components/CTAButton";
import { UrgencyTimer } from "@/components/UrgencyTimer";
import { VideoBlock } from "@/components/VideoBlock";
import { ViewCounter } from "@/components/ViewCounter";

type SalesPageProps = {
  baseProduct: ProductContent;
};

export function SalesPage({ baseProduct }: SalesPageProps) {
  const [product, setProduct] = useState(baseProduct);

  useEffect(() => {
    const storedProduct = getStoredProduct(baseProduct.slug);
    if (storedProduct) setProduct(storedProduct);
  }, [baseProduct.slug]);

  useEffect(() => {
    ensureGoogleAds(product.tracking);
    trackEvent("PageView", { slug: product.slug });
    trackEvent("ViewContent", {
      slug: product.slug,
      price: product.price
    });
  }, [product]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-cream pb-24 md:pb-0">
      <div className="flex h-2 w-full">
        <div className="flex-1 bg-accent" />
        <div className="flex-1 bg-primary" />
        <div className="flex-1 bg-green" />
        <div className="flex-1 bg-accent" />
      </div>

      <section className="px-4 py-12 md:py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <ViewCounter />
              <UrgencyTimer minutes={product.urgencyMinutes} />
            </div>
            <h1 className="text-4xl font-bold leading-tight text-ink md:text-6xl">{product.headline}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted md:text-xl">{product.subheadline}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CTAButton product={product} className="w-full sm:w-auto" />
              <span className="text-sm font-bold text-green">Compra segura e acesso imediato</span>
            </div>
          </div>
          <div className="relative">
            <img
              src={product.imageUrl}
              alt=""
              loading="eager"
              className="aspect-[4/3] w-full rounded-md object-cover shadow-2xl"
            />
            <div className="absolute bottom-4 left-4 right-4 rounded-md bg-white/95 p-4 shadow-lg">
              <p className="text-sm font-bold uppercase tracking-wide text-accent">Oferta atual</p>
              <div className="mt-1 flex items-end gap-3">
                <span className="text-4xl font-extrabold text-primary-dark">{product.price}</span>
                {product.originalPrice ? <span className="pb-1 text-sm text-muted line-through">{product.originalPrice}</span> : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <VideoBlock product={product} />

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-ink md:text-4xl">Benefícios diretos para quem compra agora</h2>
            <div className="mt-8 space-y-5">
              {product.benefits.map((benefit) => (
                <div key={benefit} className="flex gap-3">
                  <CheckCircle2 className="mt-1 shrink-0 text-green" size={24} aria-hidden="true" />
                  <p className="text-lg leading-7 text-muted">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-primary/20 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-5 inline-flex rounded-md bg-primary/10 p-3 text-primary">
              <FileText size={28} aria-hidden="true" />
            </div>
            <h2 className="text-3xl font-bold text-ink">O que você recebe</h2>
            <ul className="mt-6 space-y-4">
              {product.contentList.map((item) => (
                <li key={item} className="flex gap-3 text-muted">
                  <Gift className="mt-1 shrink-0 text-accent" size={20} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="oferta" className="bg-primary-dark px-4 py-16 text-white">
        <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-[1fr_0.8fr]">
          <div>
            <Sparkles className="mb-4 text-yellow-300" size={34} aria-hidden="true" />
            <h2 className="text-3xl font-bold md:text-5xl">Garanta o acesso antes do tempo acabar</h2>
            <p className="mt-4 text-lg leading-8 text-white/80">
              Todos os botões desta página enviam para o checkout configurado no painel. O evento de conversão é disparado no clique.
            </p>
          </div>
          <div className="rounded-md bg-white p-6 text-ink shadow-2xl">
            <p className="text-sm font-extrabold uppercase tracking-wide text-accent">Pagamento único</p>
            {product.originalPrice ? <p className="mt-3 text-muted line-through">De {product.originalPrice}</p> : null}
            <p className="text-5xl font-extrabold text-primary-dark">{product.price}</p>
            <div className="my-5">
              <UrgencyTimer minutes={product.urgencyMinutes} />
            </div>
            <CTAButton product={product} className="w-full" />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-5 md:flex-row md:items-center">
          <div className="rounded-full bg-green/10 p-5 text-green">
            <LockKeyhole size={42} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-ink">Garantia e segurança</h2>
            <p className="mt-3 text-lg leading-8 text-muted">{product.guarantee}</p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-ink md:text-4xl">Pronto para facilitar sua próxima etapa?</h2>
          <p className="mt-4 text-lg text-muted">Clique abaixo e conclua a compra no checkout configurado.</p>
          <div className="mt-8">
            <CTAButton product={product} className="w-full sm:w-auto" label={`${product.cta} - ${product.price}`} />
          </div>
        </div>
      </section>

      <footer className="bg-ink px-4 py-8 text-center text-sm text-white/70">
        <p>{product.footerText}</p>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white p-3 shadow-2xl md:hidden">
        <CTAButton product={product} className="w-full py-3" label={product.cta} />
      </div>
    </main>
  );
}
