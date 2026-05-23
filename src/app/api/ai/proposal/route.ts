import { NextResponse } from "next/server";
import { runAI } from "@/lib/ai";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    jobDescription?: string;
    input?: string;
  };
  const input = body.jobDescription ?? body.input ?? "";
  const text = await runAI("proposal", input);
  return NextResponse.json({ text });
}
