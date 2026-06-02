import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/painelsecreto", "/painelsecreto/login", "/api/admin"]
      }
    ]
  };
}
