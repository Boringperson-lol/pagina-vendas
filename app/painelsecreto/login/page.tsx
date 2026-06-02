import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLogin } from "@/components/AdminLogin";

export const metadata: Metadata = {
  title: "Login do painel EGE",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false
    }
  }
};

export default function SecretLoginPage() {
  return (
    <Suspense>
      <AdminLogin />
    </Suspense>
  );
}
