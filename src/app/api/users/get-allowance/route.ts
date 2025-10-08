import { getUserAllowance } from "@/src/lib/services/user.services";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email } = body;
  return await getUserAllowance(email);
}
