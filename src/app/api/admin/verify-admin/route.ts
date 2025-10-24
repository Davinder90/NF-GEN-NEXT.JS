import { verifyAdmin } from "@/src/lib/services/admin.services";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email } = body;
  return verifyAdmin(email);
}
