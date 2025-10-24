import { getSitesNamesByNetwork } from "@/src/lib/services/site.services";
import { Network } from "@type/site.types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const network = searchParams.get("network") as Network;
  return await getSitesNamesByNetwork(network);
}
