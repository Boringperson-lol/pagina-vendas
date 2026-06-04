import { NextResponse, type NextRequest } from "next/server";
import { incrementClick, isClickStoreConfigured } from "@/lib/click-store";

export async function POST(request: NextRequest) {
  if (!isClickStoreConfigured()) {
    return NextResponse.json(
      { error: "Armazenamento persistente nao configurado." },
      { status: 503 }
    );
  }

  const { slug } = (await request.json().catch(() => ({}))) as { slug?: string };
  if (!slug) {
    return NextResponse.json({ error: "Slug obrigatorio." }, { status: 400 });
  }

  return NextResponse.json({
    slug,
    clicks: await incrementClick(slug)
  });
}
