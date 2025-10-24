import { getUsers } from "@/src/lib/services/user.services";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const body = await req.json();
  const { email } = body;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const username = searchParams.get("username") as string;
  return await getUsers(email, page, limit, username);
}
