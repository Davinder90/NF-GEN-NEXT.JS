import { deleteFiles } from "@helpers/file.helpers";
import { authenticateToken } from "@middleware/auth.middleware";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authResponse = await authenticateToken(req);
  if (authResponse) return authResponse;
  const body = await req.json();
  const { Files } = body;
  deleteFiles(Files);
  return NextResponse.json({
    success: true,
    message: "Files deleted successfully",
  });
}
