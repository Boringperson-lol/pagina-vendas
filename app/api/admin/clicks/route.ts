import { NextResponse, type NextRequest } from "next/server";
import { isClickStoreConfigured, listAllClicks } from "@/lib/click-store";
import { requestHasAdminSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  if (!(await requestHasAdminSession(request))) {
    return NextResponse.json({ error: "Sessao expirada. Faca login novamente." }, { status: 401 });
  }

  return NextResponse.json({
    clicks: await listAllClicks(),
    storageConfigured: isClickStoreConfigured()
  });
}
