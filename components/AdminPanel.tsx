"use client";

import { Eye, LogOut, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductContent } from "@/lib/types";
import { readStoredProducts, writeStoredProducts } from "@/lib/storage";

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
  benefits: ["Beneficio principal", "Beneficio secundario", "Beneficio de seguranca"],
  contentList: ["Item entregue 1", "Item entregue 2", "Item entregue 3"],
  guarantee: "Descreva aqui sua garantia.",
  footerText: "Todos os direitos reservados a EGE - Escola Genial da Existencia.",
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
  const router = useRouter();
  const [products, setProducts] = useState<ProductContent[]>(baseProducts);
  const [selectedSlug, setSelectedSlug] = useState(baseProducts[0]?.slug || emptyProduct.slug);
  const selectedProduct = useMemo(
    () => products.find((product) => product.slug === selectedSlug) || products[0] || emptyProduct,
    [products, selectedSlug]
  );
  const canDeleteSelectedProduct = products.some((product) => product.slug === selectedProduct.slug);
  const [draft, setDraft] = useState<ProductContent>(selectedProduct);
  const [savedMessage, setSavedMessage] = useState("");
  const [storageMessage, setStorageMessage] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadProducts() {
      const storedProducts = readStoredProducts();

      try {
        const response = await fetch("/api/admin/products", { cache: "no-store" });
        const data = (await response.json()) as {
          products?: ProductContent[];
          storageConfigured?: boolean;
          error?: string;
        };

        if (!response.ok) throw new Error(data.error || "Nao foi possivel carregar os produtos.");
        if (!isCurrent) return;

        const serverProducts = data.products || [];
        const mergedProducts = [
          ...serverProducts,
          ...storedProducts.filter((product) => !serverProducts.some((serverProduct) => serverProduct.slug === product.slug))
        ];

        setProducts(mergedProducts);
        setSelectedSlug(mergedProducts[0]?.slug || emptyProduct.slug);
        setStorageMessage(
          data.storageConfigured
            ? ""
            : "Armazenamento persistente pendente: configure Redis/Upstash na Vercel antes de usar em producao."
        );
      } catch (error) {
        if (!isCurrent) return;

        const mergedProducts = [
          ...storedProducts,
          ...baseProducts.filter((product) => !storedProducts.some((stored) => stored.slug === product.slug))
        ];
        setProducts(mergedProducts);
        setSelectedSlug(mergedProducts[0]?.slug || emptyProduct.slug);
        setStorageMessage(error instanceof Error ? error.message : "Nao foi possivel carregar os produtos persistidos.");
      }
    }

    loadProducts();

    return () => {
      isCurrent = false;
    };
  }, [baseProducts]);

  useEffect(() => {
    setDraft(selectedProduct);
  }, [selectedProduct]);

  function updateField<Key extends keyof ProductContent>(key: Key, value: ProductContent[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function saveProduct() {
    const normalizedSlug = slugify(draft.slug);
    const nextDraft = { ...draft, slug: normalizedSlug || emptyProduct.slug };

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextDraft)
      });
      const data = (await response.json()) as { products?: ProductContent[]; error?: string };

      if (!response.ok) throw new Error(data.error || "Nao foi possivel salvar o produto.");

      const nextProducts = data.products || [];
      writeStoredProducts(nextProducts);
      setProducts(nextProducts);
      setSelectedSlug(nextDraft.slug);
      setStorageMessage("");
      setSavedMessage(`Produto salvo com persistencia. Acesse /${nextDraft.slug}`);
    } catch (error) {
      setSavedMessage(error instanceof Error ? error.message : "Nao foi possivel salvar o produto.");
    }

    window.setTimeout(() => setSavedMessage(""), 6000);
  }

  async function deleteProduct() {
    const slugToDelete = selectedProduct.slug;
    const confirmed = window.confirm(`Excluir a pagina /${slugToDelete}?`);
    if (!confirmed) return;

    try {
      const response = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: slugToDelete })
      });
      const data = (await response.json()) as { products?: ProductContent[]; error?: string };

      if (!response.ok) throw new Error(data.error || "Nao foi possivel excluir a pagina.");

      const nextProducts = data.products || [];
      writeStoredProducts(nextProducts);
      setProducts(nextProducts);
      setSelectedSlug(nextProducts[0]?.slug || emptyProduct.slug);
      setStorageMessage("");
      setSavedMessage(`Pagina /${slugToDelete} excluida.`);
    } catch (error) {
      setSavedMessage(error instanceof Error ? error.message : "Nao foi possivel excluir a pagina.");
    }

    window.setTimeout(() => setSavedMessage(""), 6000);
  }

  function createProduct() {
    const nextSlug = `produto-${Date.now().toString().slice(-5)}`;
    const nextProduct = { ...emptyProduct, slug: nextSlug };
    setProducts((current) => [nextProduct, ...current]);
    setSelectedSlug(nextSlug);
    setDraft(nextProduct);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/painelsecreto/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-soft px-4 py-8 text-ink">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-accent">EGE Sales Admin</p>
            <h1 className="mt-2 text-4xl font-black text-primary">Painel secreto</h1>
            <p className="mt-2 max-w-2xl text-muted">
              Edite conteudo, checkout, midia e Google Ads sem alterar codigo.
            </p>
            {storageMessage ? <p className="mt-3 max-w-2xl font-bold text-accent">{storageMessage}</p> : null}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={createProduct}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-black text-white transition hover:bg-secondary hover:text-primary"
            >
              <Plus size={18} aria-hidden="true" />
              Novo produto
            </button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary/20 bg-white px-4 py-3 font-black text-primary transition hover:border-accent hover:text-accent"
            >
              <LogOut size={18} aria-hidden="true" />
              Sair
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-md bg-white p-4 shadow-ege">
            <h2 className="mb-3 text-sm font-black uppercase text-muted">Produtos</h2>
            <div className="space-y-2">
              {products.map((product) => (
                <button
                  key={product.slug}
                  type="button"
                  onClick={() => setSelectedSlug(product.slug)}
                  className={`w-full rounded-md px-3 py-3 text-left font-bold transition ${
                    product.slug === selectedSlug ? "bg-primary text-white" : "bg-soft text-ink hover:bg-primary/10"
                  }`}
                >
                  /{product.slug}
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-md bg-white p-4 shadow-ege md:p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Slug" value={draft.slug} onChange={(value) => updateField("slug", slugify(value))} />
              <Field label="Preco" value={draft.price} onChange={(value) => updateField("price", value)} />
              <Field
                label="Preco original"
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
                label="Video (URL embed)"
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
                label="Timer de urgencia (minutos)"
                value={String(draft.urgencyMinutes)}
                onChange={(value) => updateField("urgencyMinutes", Number(value) || 15)}
              />
              <Field label="Rodape" value={draft.footerText} onChange={(value) => updateField("footerText", value)} />
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
                label="Beneficios (um por linha)"
                value={listToText(draft.benefits)}
                onChange={(value) => updateField("benefits", textToList(value))}
              />
              <TextArea
                label="Lista do conteudo (um por linha)"
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
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 font-black text-white transition hover:bg-secondary hover:text-primary"
              >
                <Save size={18} aria-hidden="true" />
                Salvar alteracoes
              </button>
              <a
                href={`/${draft.slug}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-primary/20 px-5 py-3 font-bold text-primary transition hover:border-secondary hover:bg-secondary"
              >
                <Eye size={18} aria-hidden="true" />
                Ver pagina
              </a>
              <button
                type="button"
                onClick={deleteProduct}
                disabled={!canDeleteSelectedProduct}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-red-200 px-5 py-3 font-bold text-red-700 transition hover:border-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={18} aria-hidden="true" />
                Excluir pagina
              </button>
              {savedMessage ? <p className="font-bold text-primary">{savedMessage}</p> : null}
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
        className="min-h-11 w-full rounded-md border border-primary/15 bg-white px-3 py-2 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
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
        className="w-full resize-y rounded-md border border-primary/15 bg-white px-3 py-2 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
      />
    </label>
  );
}
