import { deleteFileFromAws } from "@/src/lib/helpers/aws-sdk.helpers";
import { deleteFile } from "@helpers/file.helpers";
import { authenticateToken } from "@middleware/auth.middleware";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function DELETE(req: NextRequest) {
  const authResponse = await authenticateToken(req);
  if (authResponse) return authResponse;
  const searchParams = req.nextUrl.searchParams;
  const filepath = searchParams.get("path") as string;
  const dirName = path.dirname(filepath);  
  const lastFolder = path.basename(dirName);
  const result = process.env.AWS_EXECUTION_ENV && lastFolder == "OUTPUT FILES"  ? await deleteFileFromAws(filepath) : await deleteFile(filepath);
  if (result) return result;
  return NextResponse.json({
    success: true,
    message: "File delete successfully",
  });
}
