import { getFiles } from "@helpers/file.helpers";
import { authenticateToken } from "@middleware/auth.middleware";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const authResponse = await authenticateToken(req);
  if (authResponse) return authResponse;
  return await getFiles();
}
