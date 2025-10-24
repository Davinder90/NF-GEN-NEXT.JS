import jwt from "jsonwebtoken";
import {
  IAuthTokenRequest,
  IDecodeUser,
  IResponseObject,
} from "@interfaces/common.interfaces";
import { StatusCodes } from "http-status-codes";
import {
  asyncRequestHandler,
  generateResponseObject,
} from "@helpers/common.helpers";
import { NextRequest } from "next/server";
import { env_var } from "@config/env.config";

export const authenticateToken = async (req: NextRequest) => {
  const result = (await asyncRequestHandler(
    async () => {
      const authHeader = req.headers.get("authorization");
      const token = authHeader && authHeader.split(" ")[1];
      if (!token)
        return {
          error: "Access token required",
          status_code: StatusCodes.UNAUTHORIZED,
        };
      const decodeUser = jwt.verify(
        token,
        env_var.JWT_SECRET as string
      ) as IDecodeUser;
      if (!decodeUser.id)
        return {
          error: "Invalid token",
          status_code: StatusCodes.UNAUTHORIZED,
        };
      (req as IAuthTokenRequest).user = decodeUser;
    },
    "Internal server error",
    StatusCodes.INTERNAL_SERVER_ERROR
  )) as IResponseObject;
  if (result?.error) return generateResponseObject(result);
  return null;
};
