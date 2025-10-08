import { inputFile } from "@helpers/file.helpers";
import { authenticateToken } from "@middleware/auth.middleware";
import { parseSingleFile } from "@middleware/formidable.middleware";
import { PATHS } from "@utils/constants";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const authResponse = await authenticateToken(req);
  if (authResponse) return authResponse;
  const searchParams = req.nextUrl.searchParams;
  const fileName = searchParams.get("fileName") as string;
  const username = searchParams.get("username") as string;
  
  const result = await parseSingleFile(
    req,
    fileName,
    PATHS.INPUT_COMBINE_FILES_PATH,
    username
  );
  return await inputFile(req, [
    {
      filename: result.filename,
      destination: result.destination,
    },
  ]);
}
