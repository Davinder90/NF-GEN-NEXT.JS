import { downloadFile } from "@helpers/file.helpers";
import { authenticateToken } from "@middleware/auth.middleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const authResponse = await authenticateToken(req);
  if (authResponse) return authResponse;
  return await downloadFile(req);
}
