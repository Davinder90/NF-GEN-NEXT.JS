import { authenticateToken } from "@middleware/auth.middleware";
import { addNewSitesFromGoogleSpreadsheetToDatabase } from "@services/site.services";
import { Network } from "@type/site.types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const authResponse = await authenticateToken(req);
  if (authResponse) return authResponse;
  const searchParams = req.nextUrl.searchParams;
  const network = searchParams.get("network") as Network;
  return await addNewSitesFromGoogleSpreadsheetToDatabase(network);
}
