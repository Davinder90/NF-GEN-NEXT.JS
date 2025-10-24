import {
  ISignInRequestBodyInterface,
  ISignUpRequestBodyInterface,
} from "@interfaces/zodSchema.interfaces";
import User from "@models/user.model";
import {
  asyncRequestHandler,
  generateResponseObject,
} from "@helpers/common.helpers";
import {
  comparePassword,
  generateAccessToken,
  generateHashPassword,
} from "@helpers/auth.helpers";
import { StatusCodes } from "http-status-codes";
import { IResponseObject } from "@interfaces/common.interfaces";
import { dbConnection } from "@/src/config/dbConnection";
import Admin from "@/src/models/admin.model";

export const signIn = async (data: ISignInRequestBodyInterface) => {
  await dbConnection();
  const { email, password } = data;
  const result = await asyncRequestHandler(
    async (): Promise<IResponseObject> => {
      const user = await User.findOne({ email: email });
      if (!user)
        return {
          error: "Email not found",
          status_code: StatusCodes.OK,
        };
      const passwordMatches = await comparePassword(password, user.password);
      if (!passwordMatches)
        return {
          error: "Incorrect Password",
          status_code: StatusCodes.OK,
        };
      const access_token = generateAccessToken(user._id as string);
      return {
        message: "Login Successfully",
        data: {
          access_token: access_token,
          isAllowed: user?.isAllowed,
          username: user?.username,
        },
      };
    },
    "DATABASE_ERROR, An error occurred while processing your request.",
    StatusCodes.FORBIDDEN
  );

  return generateResponseObject(result as IResponseObject);
};

export const generateUsername = async (name: string): Promise<string> => {
  const base = name.split(" ")[0].toLowerCase();

  const randomNum = Math.floor(1000 + Math.random() * 9000); // always 1000–9999

  const username = `${base}${randomNum}`;

  const user = await User.findOne({ username });
  if (user) return await generateUsername(name); // recursion for collision

  return username;
};

export const signUp = async (data: ISignUpRequestBodyInterface) => {
  await dbConnection();
  const { name, email, password } = data;
  const result = await asyncRequestHandler(
    async () => {
      const user = await User.findOne({ email: email });
      if (user)
        return {
          error: "Email already exits",
          status_code: StatusCodes.OK,
        };
      const hash_password = await generateHashPassword(password);
      const username = await generateUsername(name);
      const new_user = new User({
        name: name,
        password: hash_password,
        email: email,
        username: username,
        isAllowed: false,
      });
      new_user.save();
      const access_token = generateAccessToken(new_user._id as string);
      return {
        message: "Account created Successfully",
        data: { access_token: access_token, isAllowed: false },
      };
    },
    "DATABASE_ERROR, An error occurred while processing your request.",
    StatusCodes.FORBIDDEN
  );
  return generateResponseObject(result as IResponseObject);
};

export const getUsers = async (
  auth_email: string,
  page: number,
  limit: number,
  username: string
) => {
  await dbConnection();
  const result = await asyncRequestHandler(
    async () => {
      const user = await User.findOne({ email: auth_email });
      if (!user)
        return {
          error: "You are not admin",
          status_code: StatusCodes.OK,
        };
      const query = username.length
        ? { username: new RegExp(username, "i") }
        : {};

      const users = await User.find(query)
        .select("username email name isAllowed -_id")
        .skip((page - 1) * limit)
        .limit(limit);

      return {
        message: "Users fetched successfully",
        data: { users },
      };
    },
    "DATABASE_ERROR, An error occurred while processing your request.",
    StatusCodes.FORBIDDEN
  );
  return generateResponseObject(result as IResponseObject);
};

export const getUser = async (email: string) => {
  await dbConnection();
  const result = (await asyncRequestHandler(
    async () => {
      const user = await User.findOne({ email });
      if (!user)
        return {
          error: "User not found",
          status_code: StatusCodes.OK,
        };

      return {
        message: `Fetched successfully`,
        data: { user },
      };
    },
    "Internal Server Error, please try again later",
    StatusCodes.INTERNAL_SERVER_ERROR
  )) as IResponseObject;
  return generateResponseObject(result);
};

export const updateUserAllowance = async (
  auth_email: string,
  email: string,
  isAllowed: boolean
) => {
  await dbConnection();
  const result = (await asyncRequestHandler(
    async () => {
      const isAdmin = await Admin.findOne({ email: auth_email });
      if (!isAdmin)
        return {
          error: "You are not admin",
          status_code: StatusCodes.OK,
        };
      const user = await User.findOneAndUpdate(
        { email },
        { $set: { isAllowed: isAllowed } }
      );
      if (!user)
        return {
          error: "User allowance not updated",
          status_code: StatusCodes.OK,
        };

      return {
        message: `User allowance updated successfully`,
        data: { user },
      };
    },
    "Internal Server Error, please try again later",
    StatusCodes.INTERNAL_SERVER_ERROR
  )) as IResponseObject;
  return generateResponseObject(result);
};

export const getUserAllowance = async (email: string) => {
  await dbConnection();
  const result = (await asyncRequestHandler(
    async () => {
      const user = await User.findOne({ email });
      if (!user)
        return {
          error: "User not found",
          status_code: StatusCodes.OK,
        };

      return {
        message: `Allowance fetched successfully`,
        data: { isAllowed: user?.isAllowed },
      };
    },
    "Internal Server Error, please try again later",
    StatusCodes.INTERNAL_SERVER_ERROR
  )) as IResponseObject;
  return generateResponseObject(result);
};
