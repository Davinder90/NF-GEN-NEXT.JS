import { updateUserAllowance } from "@/src/lib/services/user.services";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, auth_email, isAllowed } = body;
  return await updateUserAllowance(auth_email, email, isAllowed);
}
