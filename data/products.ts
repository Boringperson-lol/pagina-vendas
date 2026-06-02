import type { ProductContent } from "@/lib/types";

export const defaultTracking = {
  googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "",
  conversionLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || ""
};

export const products: ProductContent[] = [
  {
    slug: "produto1",
    headline: "Seu mês de junho planejado em 5 minutos com o Projeto Junino completo",
    subheadline:
      "Um guia passo a passo em PDF e vídeo para salvar o seu planejamento escolar. Criado de professora para professora, com acesso imediato.",
    price: "R$ 7,97",
    originalPrice: "R$ 37,00",
    cta: "Quero meu planejamento pronto",
    urgencyMinutes: 15,
    checkoutUrl: "https://pay.kiwify.com.br/seu-checkout",
    imageUrl:
      "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1400&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    benefits: [
      "Adeus horas perdidas buscando ideias: tenha tudo mastigado em um só lugar.",
      "Aulas lúdicas que prendem a atenção das crianças com facilidade.",
      "Planejamento estruturado do início ao fim para aplicar com segurança.",
      "Dinâmicas com materiais simples, sem gastar mais do próprio bolso.",
      "Mais tempo livre para terminar o planejamento em poucos minutos."
    ],
    contentList: [
      "Apostila completa em PDF pronta para impressão",
      "Vídeo com instruções práticas de aplicação",
      "Bônus surpresa liberado na área de membros",
      "Acesso imediato após confirmação do pagamento"
    ],
    guarantee:
      "Garantia incondicional de 7 dias. Se o material não facilitar sua rotina, você pode solicitar reembolso.",
    footerText: "Todos os direitos reservados ao Planeta Zetrus. Garantia EGE - Escola Genial da Existência.",
    tracking: defaultTracking
  },
  {
    slug: "produto2",
    headline: "Template pronto para lançar sua próxima oferta sem recomeçar do zero",
    subheadline:
      "Troque textos, preço, vídeo, imagens e checkout pelo painel secreto e publique uma nova página em minutos.",
    price: "R$ 47,00",
    originalPrice: "R$ 97,00",
    cta: "Quero criar minha página agora",
    urgencyMinutes: 15,
    checkoutUrl: "https://pay.kiwify.com.br/outro-checkout",
    imageUrl:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1400&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    benefits: [
      "Crie ofertas novas apenas mudando os dados do produto.",
      "Todos os botões usam automaticamente o checkout configurado.",
      "Tracking pronto para Google Ads e eventos de clique.",
      "Experiência mobile com botão fixo e carregamento leve.",
      "Estrutura pronta para deploy direto na Vercel."
    ],
    contentList: [
      "Página dinâmica por slug",
      "Painel secreto com criação e edição de produtos",
      "Campos para Google Ads ID e conversion label",
      "Template componentizado e reutilizável"
    ],
    guarantee:
      "Você recebe uma base flexível para multiplicar páginas de vendas sem mexer no código.",
    footerText: "Template escalável para produtos digitais.",
    tracking: defaultTracking
  }
];

export function getBaseProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
