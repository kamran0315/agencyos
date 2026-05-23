import { NextResponse } from "next/server";
import { runAI } from "@/lib/ai";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { input?: string };
  const text = await runAI("breakdown", body.input ?? "");
  return NextResponse.json({ text });
}
