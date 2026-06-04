import { NextResponse, type NextRequest } from "next/server";
import { isClickStoreConfigured, resetClicks } from "@/lib/click-store";
import { requestHasAdminSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  if (!(await requestHasAdminSession(request))) {
    return NextResponse.json({ error: "Sessao expirada. Faca login novamente." }, { status: 401 });
  }

  if (!isClickStoreConfigured()) {
    return NextResponse.json(
      { error: "Armazenamento persistente nao configurado." },
      { status: 500 }
    );
  }

  const { slug } = (await request.json().catch(() => ({}))) as { slug?: string };
  if (!slug) {
    return NextResponse.json({ error: "Slug obrigatorio." }, { status: 400 });
  }

  return NextResponse.json({
    clicks: await resetClicks(slug),
    storageConfigured: true
  });
}
