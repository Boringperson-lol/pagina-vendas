import { NextResponse, type NextRequest } from "next/server";
import {
  deletePersistedProduct,
  isProductStoreConfigured,
  listProducts,
  upsertPersistedProduct
} from "@/lib/product-store";
import { requestHasAdminSession } from "@/lib/session";
import type { ProductContent } from "@/lib/types";

async function requireAdmin(request: NextRequest) {
  if (await requestHasAdminSession(request)) return null;
  return NextResponse.json({ error: "Sessao expirada. Faca login novamente." }, { status: 401 });
}

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  return NextResponse.json({
    products: await listProducts(),
    storageConfigured: isProductStoreConfigured()
  });
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  if (!isProductStoreConfigured()) {
    return NextResponse.json(
      {
        error:
          "Armazenamento persistente nao configurado. Configure UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN na Vercel."
      },
      { status: 500 }
    );
  }

  const product = (await request.json().catch(() => null)) as ProductContent | null;
  if (!product?.slug || !product.headline) {
    return NextResponse.json({ error: "Dados do produto incompletos." }, { status: 400 });
  }

  return NextResponse.json({
    products: await upsertPersistedProduct(product),
    storageConfigured: true
  });
}

export async function DELETE(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  if (!isProductStoreConfigured()) {
    return NextResponse.json(
      {
        error:
          "Armazenamento persistente nao configurado. Configure UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN na Vercel."
      },
      { status: 500 }
    );
  }

  const { slug } = (await request.json().catch(() => ({}))) as { slug?: string };
  if (!slug) {
    return NextResponse.json({ error: "Slug obrigatorio para excluir a pagina." }, { status: 400 });
  }

  return NextResponse.json({
    products: await deletePersistedProduct(slug),
    storageConfigured: true
  });
}
