import Link from "next/link";
import { ShoppingBag } from "lucide-react";

type SalesHeaderProps = {
  storeUrl?: string;
};

export function SalesHeader({ storeUrl = process.env.NEXT_PUBLIC_EGE_STORE_URL }: SalesHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-primary text-white shadow-ege">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3" aria-label="EGE">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-sm font-black text-primary">
            EGE
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-black uppercase">EGE</span>
            <span className="block text-xs font-semibold text-white/75">Escola Genial da Existencia</span>
          </span>
        </Link>

        {storeUrl ? (
          <a
            href={storeUrl}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/20 px-3 py-2 text-sm font-extrabold text-white transition hover:border-secondary hover:bg-secondary hover:text-primary"
          >
            <ShoppingBag size={17} aria-hidden="true" />
            Loja
          </a>
        ) : null}
      </div>
    </header>
  );
}
