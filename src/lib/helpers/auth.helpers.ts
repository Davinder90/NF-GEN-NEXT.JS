import { env_var } from "@/src/config/env.config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const generateAccessToken = (user_id: string) =>
  jwt.sign({ id: user_id }, env_var.JWT_SECRET as string);

export const generateHashPassword = async (password: string) =>
  await bcrypt.hash(password, 10);

export const comparePassword = async (
  password: string,
  hashPassword: string
) => {
  return bcrypt.compare(password, hashPassword);
};
