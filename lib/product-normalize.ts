import type { ProductContent } from "@/lib/types";

export function normalizeProduct(product: ProductContent): ProductContent {
  return {
    ...product,
    footerText: product.footerText || "Todos os direitos reservados a EGE - Escola Genial da Existencia.",
    tracking: product.tracking || {
      googleAdsId: "",
      conversionLabel: ""
    }
  };
}
