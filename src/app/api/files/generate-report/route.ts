import { generateReport } from "@/src/lib/helpers/file.helpers";
import { authenticateToken } from "@middleware/auth.middleware";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const authResponse = await authenticateToken(req);
  if (authResponse) return authResponse;
  const { site_data } = await req.json();
  return await generateReport(site_data);
}
