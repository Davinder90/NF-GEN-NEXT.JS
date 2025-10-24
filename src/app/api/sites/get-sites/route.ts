import { getSites } from "@services/site.services";
import { Network } from "@type/site.types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const network = searchParams.get("network") as Network;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const site = searchParams.get("siteId") as string;
  return await getSites(limit, page, network, site);
}
