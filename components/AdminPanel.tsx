"use client";

import { Eye, Plus, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ProductContent } from "@/lib/types";
import { readStoredProducts, upsertStoredProduct } from "@/lib/storage";

type AdminPanelProps = {
  baseProducts: ProductContent[];
};

const emptyProduct: ProductContent = {
  slug: "novo-produto",
  headline: "Headline da nova oferta",
  subheadline: "Subheadline explicando a promessa principal do produto.",
  price: "R$ 0,00",
  originalPrice: "R$ 0,00",
  cta: "Quero comprar agora",
  urgencyMinutes: 15,
  checkoutUrl: "https://pay.kiwify.com.br/seu-checkout",
  imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  benefits: ["Benefício principal", "Benefício secundário", "Benefício de segurança"],
  contentList: ["Item entregue 1", "Item entregue 2", "Item entregue 3"],
  guarantee: "Descreva aqui sua garantia.",
  footerText: "Todos os direitos reservados.",
  tracking: {
    googleAdsId: "",
    conversionLabel: ""
  }
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function listToText(items: string[]) {
  return items.join("\n");
}

function textToList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function AdminPanel({ baseProducts }: AdminPanelProps) {
  const [products, setProducts] = useState<ProductContent[]>(baseProducts);
  const [selectedSlug, setSelectedSlug] = useState(baseProducts[0]?.slug || emptyProduct.slug);
  const selectedProduct = useMemo(
    () => products.find((product) => product.slug === selectedSlug) || products[0] || emptyProduct,
    [products, selectedSlug]
  );
  const [draft, setDraft] = useState<ProductContent>(selectedProduct);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const storedProducts = readStoredProducts();
    const mergedProducts = [
      ...storedProducts,
      ...baseProducts.filter((product) => !storedProducts.some((stored) => stored.slug === product.slug))
    ];
    setProducts(mergedProducts);
    setSelectedSlug(mergedProducts[0]?.slug || emptyProduct.slug);
  }, [baseProducts]);

  useEffect(() => {
    setDraft(selectedProduct);
  }, [selectedProduct]);

  function updateField<Key extends keyof ProductContent>(key: Key, value: ProductContent[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function saveProduct() {
    const normalizedSlug = slugify(draft.slug);
    const nextDraft = { ...draft, slug: normalizedSlug || emptyProduct.slug };
    const nextProducts = upsertStoredProduct(nextDraft);
    const mergedProducts = [
      ...nextProducts,
      ...baseProducts.filter((product) => !nextProducts.some((stored) => stored.slug === product.slug))
    ];
    setProducts(mergedProducts);
    setSelectedSlug(nextDraft.slug);
    setSavedMessage(`Produto salvo. Acesse /${nextDraft.slug}`);
    window.setTimeout(() => setSavedMessage(""), 4000);
  }

  function createProduct() {
    const nextSlug = `produto-${Date.now().toString().slice(-5)}`;
    const nextProduct = { ...emptyProduct, slug: nextSlug };
    setProducts((current) => [nextProduct, ...current]);
    setSelectedSlug(nextSlug);
    setDraft(nextProduct);
  }

  return (
    <main className="min-h-screen bg-[#f5f2ea] px-4 py-8 text-ink">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-wide text-accent">Acesso direto por URL</p>
            <h1 className="mt-2 text-4xl font-bold">Painel secreto</h1>
            <p className="mt-2 max-w-2xl text-muted">
              Edite conteúdo, checkout, mídia e Google Ads sem alterar código. Os dados são salvos neste navegador.
            </p>
          </div>
          <button
            type="button"
            onClick={createProduct}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 font-bold text-white"
          >
            <Plus size={18} aria-hidden="true" />
            Novo produto
          </button>
        </header>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-md bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-muted">Produtos</h2>
            <div className="space-y-2">
              {products.map((product) => (
                <button
                  key={product.slug}
                  type="button"
                  onClick={() => setSelectedSlug(product.slug)}
                  className={`w-full rounded-md px-3 py-3 text-left font-bold transition ${
                    product.slug === selectedSlug ? "bg-primary text-white" : "bg-[#f5f2ea] text-ink hover:bg-primary/10"
                  }`}
                >
                  /{product.slug}
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-md bg-white p-4 shadow-sm md:p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Slug" value={draft.slug} onChange={(value) => updateField("slug", slugify(value))} />
              <Field label="Preço" value={draft.price} onChange={(value) => updateField("price", value)} />
              <Field
                label="Preço original"
                value={draft.originalPrice || ""}
                onChange={(value) => updateField("originalPrice", value)}
              />
              <Field label="Texto do CTA" value={draft.cta} onChange={(value) => updateField("cta", value)} />
              <Field
                label="Link da Kiwify"
                value={draft.checkoutUrl}
                onChange={(value) => updateField("checkoutUrl", value)}
                className="md:col-span-2"
              />
              <Field
                label="Imagem principal (URL)"
                value={draft.imageUrl}
                onChange={(value) => updateField("imageUrl", value)}
                className="md:col-span-2"
              />
              <Field
                label="Vídeo (URL embed)"
                value={draft.videoUrl}
                onChange={(value) => updateField("videoUrl", value)}
                className="md:col-span-2"
              />
              <Field
                label="Google Ads ID"
                value={draft.tracking.googleAdsId}
                onChange={(value) => updateField("tracking", { ...draft.tracking, googleAdsId: value })}
              />
              <Field
                label="Conversion Label"
                value={draft.tracking.conversionLabel}
                onChange={(value) => updateField("tracking", { ...draft.tracking, conversionLabel: value })}
              />
              <Field
                label="Timer de urgência (minutos)"
                value={String(draft.urgencyMinutes)}
                onChange={(value) => updateField("urgencyMinutes", Number(value) || 15)}
              />
              <Field
                label="Rodapé"
                value={draft.footerText}
                onChange={(value) => updateField("footerText", value)}
              />
              <TextArea
                label="Headline"
                value={draft.headline}
                onChange={(value) => updateField("headline", value)}
                className="md:col-span-2"
              />
              <TextArea
                label="Subheadline"
                value={draft.subheadline}
                onChange={(value) => updateField("subheadline", value)}
                className="md:col-span-2"
              />
              <TextArea
                label="Benefícios (um por linha)"
                value={listToText(draft.benefits)}
                onChange={(value) => updateField("benefits", textToList(value))}
              />
              <TextArea
                label="Lista do conteúdo (um por linha)"
                value={listToText(draft.contentList)}
                onChange={(value) => updateField("contentList", textToList(value))}
              />
              <TextArea
                label="Garantia"
                value={draft.guarantee}
                onChange={(value) => updateField("guarantee", value)}
                className="md:col-span-2"
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={saveProduct}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 font-extrabold text-white"
              >
                <Save size={18} aria-hidden="true" />
                Salvar alterações
              </button>
              <a
                href={`/${draft.slug}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-ink/20 px-5 py-3 font-bold text-ink"
              >
                <Eye size={18} aria-hidden="true" />
                Ver página
              </a>
              {savedMessage ? <p className="font-bold text-green">{savedMessage}</p> : null}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  className = ""
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-extrabold text-muted">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 w-full rounded-md border border-black/15 bg-white px-3 py-2 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  className = ""
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-extrabold text-muted">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={5}
        className="w-full resize-y rounded-md border border-black/15 bg-white px-3 py-2 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
      />
    </label>
  );
}
