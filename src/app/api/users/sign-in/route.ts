import { validateSchema } from "@/src/lib/helpers/zod.helpers";
import { signInRequestBodySchema } from "@/src/lib/zod-schema/user.schema";
import { signIn } from "@services/user.services";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await validateSchema(body, signInRequestBodySchema);
  if (result?.status) return result;
  const { email, password } = body;
  return signIn({ email, password });
}
