import { validateSchema } from "@helpers/zod.helpers";
import { authenticateToken } from "@middleware/auth.middleware";
import { updateSite } from "@services/site.services";
import { siteSchema } from "@/src/lib/zod-schema/site.schema";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const authResponse = await authenticateToken(req);
  if (authResponse) return authResponse;
  const body = await req.json();
  const { site_data } = body;
  const result = await validateSchema(site_data, siteSchema);
  if (result) return result;
  return await updateSite(site_data);
}
