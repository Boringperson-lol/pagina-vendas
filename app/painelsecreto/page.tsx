import type { Metadata } from "next";
import { products } from "@/data/products";
import { AdminPanel } from "@/components/AdminPanel";

export const metadata: Metadata = {
  title: "Painel secreto",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false
    }
  }
};

export default function SecretAdminPage() {
  return <AdminPanel baseProducts={products} />;
}
