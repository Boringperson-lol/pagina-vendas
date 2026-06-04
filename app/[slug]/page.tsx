import type { Metadata } from "next";
import type { ProductContent } from "@/lib/types";
import { getProductBySlug } from "@/lib/product-store";
import { SalesPage } from "@/components/SalesPage";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

function emptyProduct(slug: string): ProductContent {
  return {
    slug,
    headline: "Produto ainda nao publicado",
    subheadline: "Crie ou edite este produto no painel secreto para publicar a pagina.",
    price: "R$ 0,00",
    originalPrice: "",
    cta: "Voltar para o painel",
    urgencyMinutes: 15,
    checkoutUrl: "/painelsecreto",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    benefits: ["Crie ou edite este slug em /painelsecreto para publicar a pagina."],
    contentList: ["Dados locais ainda nao encontrados para este slug."],
    guarantee: "A pagina sera publicada quando o produto for salvo no armazenamento persistente.",
    footerText: "Pagina aguardando configuracao.",
    tracking: {
      googleAdsId: "",
      conversionLabel: ""
    }
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return {
    title: product?.headline || `Pagina ${slug}`,
    description: product?.subheadline || "Pagina de vendas dinamica."
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = (await getProductBySlug(slug)) || emptyProduct(slug);

  return <SalesPage baseProduct={product} />;
}
