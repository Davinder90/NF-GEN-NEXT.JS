import { getCountTotalSites } from "@services/site.services";
import { Network } from "@type/site.types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const network = searchParams.get("network") as Network;
  const site = searchParams.get("siteId") as string;
  return await getCountTotalSites(site, network);
}
