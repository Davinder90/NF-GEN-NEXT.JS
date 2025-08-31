import { inputFile } from "@helpers/file.helpers";
import { ISnap } from "@interfaces/site.interfaces";
import { authenticateToken } from "@middleware/auth.middleware";
import {
  parseMultipleFiles,
  parseSingleFile,
} from "@middleware/formidable.middleware";
import { PATHS } from "@utils/constants";
import { NextRequest } from "next/server";

const fileUploader = async (
  req: NextRequest,
  multiple: boolean,
  snapName: string
) => {
  if (!multiple) {
    const sector_snap_result = await parseSingleFile(
      req,
      snapName,
      PATHS.SECTOR_SNAPS_PATH
    );
    return [
      {
        filename: sector_snap_result.filename,
        destination: sector_snap_result.destination,
      },
    ];
  }
  const { files } = await parseMultipleFiles(
    req,
    snapName,
    PATHS.BLOCKAGE_SNAPS_PATH
  );
  return Object.values(files).flat();
};

export async function POST(req: NextRequest) {
  const authResponse = await authenticateToken(req);
  if (authResponse) return authResponse;
  const searchParams = req.nextUrl.searchParams;
  const multiple = searchParams.get("multiple") as string;
  const snapName = searchParams.get("snapName") as string;
  const result = await fileUploader(
    req,
    multiple === "false" ? false : true,
    snapName
  );
  return await inputFile(req, result as ISnap[]);
}
