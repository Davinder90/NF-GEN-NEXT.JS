import { deleteUser } from "@/src/lib/services/user.services";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, auth_email } = body;
  return await deleteUser(auth_email, email);
}
