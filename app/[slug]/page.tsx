import type { Metadata } from "next";
import { getBaseProduct, products } from "@/data/products";
import type { ProductContent } from "@/lib/types";
import { SalesPage } from "@/components/SalesPage";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

function emptyProduct(slug: string): ProductContent {
  return {
    slug,
    headline: "Produto ainda nao publicado neste navegador",
    subheadline:
      "Se voce criou este produto no painel secreto, abra a pagina no mesmo navegador em que salvou os dados.",
    price: "R$ 0,00",
    originalPrice: "",
    cta: "Voltar para o painel",
    urgencyMinutes: 15,
    checkoutUrl: "/painelsecreto",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    benefits: ["Crie ou edite este slug em /painelsecreto para publicar a pagina."],
    contentList: ["Dados locais ainda nao encontrados para este slug."],
    guarantee: "O painel salva os dados em localStorage como mock API para prototipagem.",
    footerText: "Pagina aguardando configuracao.",
    tracking: {
      googleAdsId: "",
      conversionLabel: ""
    }
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getBaseProduct(slug);

  return {
    title: product?.headline || `Pagina ${slug}`,
    description: product?.subheadline || "Pagina de vendas dinamica."
  };
}

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getBaseProduct(slug) || emptyProduct(slug);

  return <SalesPage baseProduct={product} />;
}
