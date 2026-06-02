export type TrackingSettings = {
  googleAdsId: string;
  conversionLabel: string;
};

export type ProductContent = {
  slug: string;
  headline: string;
  subheadline: string;
  price: string;
  originalPrice?: string;
  cta: string;
  urgencyMinutes: number;
  checkoutUrl: string;
  imageUrl: string;
  videoUrl: string;
  benefits: string[];
  contentList: string[];
  guarantee: string;
  footerText: string;
  tracking: TrackingSettings;
};
