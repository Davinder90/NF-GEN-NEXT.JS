import { z } from "zod";
import {
  signInRequestBodySchema,
  signUpRequestBodySchema,
} from "@zodSchema/user.schema";
import { siteSchema } from "@zodSchema/site.schema";

export type ISignInRequestBodyInterface = z.infer<
  typeof signInRequestBodySchema
>;

export type ISignUpRequestBodyInterface = z.infer<
  typeof signUpRequestBodySchema
>;

export type ICreateSiteBodyRequest = z.infer<typeof siteSchema>;
