import type { ProductContent } from "@/lib/types";

export const defaultTracking = {
  googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "",
  conversionLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || ""
};

export const products: ProductContent[] = [
  {
    slug: "produto1",
    headline: "Seu mes de junho planejado em 5 minutos com o Projeto Junino completo",
    subheadline:
      "Um guia passo a passo em PDF e video para salvar o seu planejamento escolar. Criado de professora para professora, com acesso imediato.",
    price: "R$ 7,97",
    originalPrice: "R$ 37,00",
    cta: "Quero meu planejamento pronto",
    urgencyMinutes: 15,
    checkoutUrl: "https://pay.kiwify.com.br/seu-checkout",
    imageUrl: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1400&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    benefits: [
      "Adeus horas perdidas buscando ideias: tenha tudo organizado em um so lugar.",
      "Aulas ludicas que prendem a atencao das criancas com facilidade.",
      "Planejamento estruturado do inicio ao fim para aplicar com seguranca.",
      "Dinamicas com materiais simples, sem gastar mais do proprio bolso.",
      "Mais tempo livre para terminar o planejamento em poucos minutos."
    ],
    contentList: [
      "Apostila completa em PDF pronta para impressao",
      "Video com instrucoes praticas de aplicacao",
      "Bonus surpresa liberado na area de membros",
      "Acesso imediato apos confirmacao do pagamento"
    ],
    guarantee:
      "Garantia de 7 dias EGE: Adquira o material com tranquilidade. Caso a nossa proposta não traga praticidade para a sua rotina dentro desse período, o seu direito de devolução está garantido.",
    finalCtaTitle: "Pronto para facilitar sua vida?",
    footerText: "Todos os direitos reservados a EGE - Escola Genial da Existencia.",
    tracking: defaultTracking
  },
  {
    slug: "produto2",
    headline: "Template pronto para lancar sua proxima oferta sem recomecar do zero",
    subheadline:
      "Troque textos, preco, video, imagens e checkout pelo painel secreto e publique uma nova pagina em minutos.",
    price: "R$ 47,00",
    originalPrice: "R$ 97,00",
    cta: "Quero criar minha pagina agora",
    urgencyMinutes: 15,
    checkoutUrl: "https://pay.kiwify.com.br/outro-checkout",
    imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1400&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    benefits: [
      "Crie ofertas novas apenas mudando os dados do produto.",
      "Todos os botoes usam automaticamente o checkout configurado.",
      "Tracking pronto para Google Ads e eventos de clique.",
      "Experiencia mobile com botao fixo e carregamento leve.",
      "Estrutura pronta para deploy direto na Vercel."
    ],
    contentList: [
      "Pagina dinamica por slug",
      "Painel secreto com criacao e edicao de produtos",
      "Campos para Google Ads ID e conversion label",
      "Template componentizado e reutilizavel"
    ],
    guarantee: "Voce recebe uma base flexivel para multiplicar paginas de vendas sem mexer no codigo.",
    finalCtaTitle: "Pronto para facilitar sua vida?",
    footerText: "Sistema EGE Sales para produtos digitais.",
    tracking: defaultTracking
  }
];

export function getBaseProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
