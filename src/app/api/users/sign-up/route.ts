import { validateSchema } from "@/src/lib/helpers/zod.helpers";
import { signUp } from "@/src/lib/services/user.services";
import { signUpRequestBodySchema } from "@/src/lib/zod-schema/user.schema";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await validateSchema(body, signUpRequestBodySchema);
  if (result?.status) return result;
  const { email, password, name } = body;
  return await signUp({ email, password, name });
}
