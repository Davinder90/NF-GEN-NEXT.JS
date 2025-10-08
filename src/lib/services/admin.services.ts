import User from "@/src/models/user.model";
import {
  asyncRequestHandler,
  generateResponseObject,
} from "@helpers/common.helpers";
import { StatusCodes } from "http-status-codes";
import { env_var } from "@/src/config/env.config";
import Admin from "@/src/models/admin.model";
import { IResponseObject } from "@interfaces/common.interfaces";

export const makeAdmin = async (email: string, password: string) => {
  const result = await asyncRequestHandler(
    async () => {
      const user = await User.findOne({ email });
      if (!user)
        return {
          error: "Email not found",
          status_code: StatusCodes.OK,
        };
      if (password != (env_var.ADMIN_PASSWORD as string))
        return {
          error: "Invalid password",
          status_code: StatusCodes.OK,
        };
      const isAlready = await Admin.findOne({ email });
      if (isAlready)
        return {
          error: "You are already a admin",
          status_code: StatusCodes.OK,
        };
      const admin = new Admin({
        email,
      });
      admin.save();
      return {
        message: "Admin created successfully",
      };
    },
    "DATABASE_ERROR, An error occurred while processing your request.",
    StatusCodes.FORBIDDEN
  );
  return generateResponseObject(result as IResponseObject);
};

export const verifyAdmin = async (email: string) => {
  const result = await asyncRequestHandler(
    async () => {
      const user = await User.findOne({ email });
      const admin = await Admin.findOne({ email });
      if (!user || !admin)
        return {
          error: "You are not admin",
          status_code: StatusCodes.OK,
        };
      return {
        message: "Welcome, admin",
        data: { isAdmin: true },
      };
    },
    "DATABASE_ERROR, An error occurred while processing your request.",
    StatusCodes.FORBIDDEN
  );
  return generateResponseObject(result as IResponseObject);
};
