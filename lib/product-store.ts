import { products as baseProducts } from "@/data/products";
import { normalizeProduct } from "@/lib/product-normalize";
import type { ProductContent } from "@/lib/types";

const PRODUCTS_STORAGE_KEY = "ege-sales-products";

type RedisResponse<T> = {
  result?: T;
  error?: string;
};

type ProductStoreData = {
  products: ProductContent[];
  deletedSlugs: string[];
};

export function getRedisConfig() {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_KV_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN;

  return url && token ? { url, token } : null;
}

export function isProductStoreConfigured() {
  return Boolean(getRedisConfig());
}

function emptyStore(): ProductStoreData {
  return {
    products: [],
    deletedSlugs: []
  };
}

function parseStore(raw: string | null): ProductStoreData {
  if (!raw) return emptyStore();

  try {
    const parsed = JSON.parse(raw) as ProductContent[] | Partial<ProductStoreData>;

    if (Array.isArray(parsed)) {
      return {
        products: parsed.map(normalizeProduct),
        deletedSlugs: []
      };
    }

    return {
      products: Array.isArray(parsed.products) ? parsed.products.map(normalizeProduct) : [],
      deletedSlugs: Array.isArray(parsed.deletedSlugs) ? parsed.deletedSlugs.filter(Boolean) : []
    };
  } catch {
    return emptyStore();
  }
}

export async function redisCommand<T>(command: unknown[]) {
  const config = getRedisConfig();
  if (!config) throw new Error("Armazenamento persistente nao configurado.");

  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command),
    cache: "no-store"
  });
  const data = (await response.json().catch(() => ({}))) as RedisResponse<T>;

  if (!response.ok || data.error) {
    throw new Error(data.error || "Falha ao acessar o armazenamento persistente.");
  }

  return data.result;
}

export async function readPersistedProducts() {
  if (!isProductStoreConfigured()) return [];

  const raw = await redisCommand<string | null>(["GET", PRODUCTS_STORAGE_KEY]);
  return parseStore(raw ?? null).products;
}

async function readProductStore() {
  if (!isProductStoreConfigured()) return emptyStore();

  const raw = await redisCommand<string | null>(["GET", PRODUCTS_STORAGE_KEY]);
  return parseStore(raw ?? null);
}

async function writeProductStore(store: ProductStoreData) {
  await redisCommand<string>(
    [
      "SET",
      PRODUCTS_STORAGE_KEY,
      JSON.stringify({
        products: store.products.map(normalizeProduct),
        deletedSlugs: Array.from(new Set(store.deletedSlugs))
      })
    ]
  );
}

export async function upsertPersistedProduct(product: ProductContent) {
  const store = await readProductStore();
  const normalizedProduct = normalizeProduct(product);
  const nextProducts = [
    normalizedProduct,
    ...store.products.filter((storedProduct) => storedProduct.slug !== normalizedProduct.slug)
  ];
  const nextDeletedSlugs = store.deletedSlugs.filter((slug) => slug !== normalizedProduct.slug);

  await writeProductStore({ products: nextProducts, deletedSlugs: nextDeletedSlugs });
  return listProducts();
}

export async function listProducts() {
  const store = await readProductStore();

  return [
    ...store.products,
    ...baseProducts.filter(
      (product) =>
        !store.deletedSlugs.includes(product.slug) &&
        !store.products.some((storedProduct) => storedProduct.slug === product.slug)
    )
  ];
}

export async function getProductBySlug(slug: string) {
  const store = await readProductStore();

  if (store.deletedSlugs.includes(slug)) return undefined;

  const storedProduct = store.products.find((product) => product.slug === slug);
  return storedProduct || baseProducts.find((product) => product.slug === slug);
}

export async function deletePersistedProduct(slug: string) {
  const store = await readProductStore();
  const nextProducts = store.products.filter((product) => product.slug !== slug);
  const nextDeletedSlugs = Array.from(new Set([...store.deletedSlugs, slug]));

  await writeProductStore({ products: nextProducts, deletedSlugs: nextDeletedSlugs });
  return listProducts();
}
