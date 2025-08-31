import { ZodSchema } from "zod";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

export const validateSchema = async <T extends object>(
  body: object,
  schema: ZodSchema<T>
) => {
  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { success: false, message: result.error.issues[0].message },
      { status: StatusCodes.BAD_REQUEST }
    );
  }
  return null;
};
