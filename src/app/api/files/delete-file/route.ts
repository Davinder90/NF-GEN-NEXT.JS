import { deleteFile } from "@helpers/file.helpers";
import { authenticateToken } from "@middleware/auth.middleware";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const authResponse = await authenticateToken(req);
  if (authResponse) return authResponse;
  const searchParams = req.nextUrl.searchParams;
  const path = searchParams.get("path") as string;
  const result = await deleteFile(path);
  if (result) return result;
  return NextResponse.json({
    success: true,
    message: "File delete successfully",
  });
}
