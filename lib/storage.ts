"use client";

import type { ProductContent } from "@/lib/types";
import { normalizeProduct } from "@/lib/product-normalize";

export const PRODUCTS_STORAGE_KEY = "ege-sales-products";
const LEGACY_STORAGE_KEY = "sales-template-products";

export function readStoredProducts(): ProductContent[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(PRODUCTS_STORAGE_KEY) || window.localStorage.getItem(LEGACY_STORAGE_KEY);
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
  const nextProducts = [normalizeProduct(product), ...products.filter((item) => item.slug !== product.slug)];
  writeStoredProducts(nextProducts);
  return nextProducts;
}

export function getStoredProduct(slug: string) {
  return readStoredProducts().find((product) => product.slug === slug);
}
