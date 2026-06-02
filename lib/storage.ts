"use client";

import type { ProductContent } from "@/lib/types";

export const PRODUCTS_STORAGE_KEY = "sales-template-products";
const LEGACY_FOOTER_TEXT = "Produto digital com acesso imediato. Todos os direitos reservados.";
const UPDATED_FOOTER_TEXT =
  "Todos os direitos reservados ao Planeta Zetrus. Garantia EGE - Escola Genial da Existência.";

function normalizeProduct(product: ProductContent): ProductContent {
  if (product.footerText !== LEGACY_FOOTER_TEXT) return product;

  return {
    ...product,
    footerText: UPDATED_FOOTER_TEXT
  };
}

export function readStoredProducts(): ProductContent[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(PRODUCTS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProductContent[]).map(normalizeProduct) : [];
  } catch {
    return [];
  }
}

export function writeStoredProducts(products: ProductContent[]) {
  window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}

export function upsertStoredProduct(product: ProductContent) {
  const products = readStoredProducts();
  const nextProducts = [product, ...products.filter((item) => item.slug !== product.slug)];
  writeStoredProducts(nextProducts);
  return nextProducts;
}

export function getStoredProduct(slug: string) {
  return readStoredProducts().find((product) => product.slug === slug);
}
