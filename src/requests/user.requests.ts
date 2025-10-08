import { AxiosResponse } from "axios";
import axiosInstance from "@helpers/axios.helpers";
import { asyncResponseHandler } from "@helpers/client.helpers";
import { API_ROUTES } from "@/src/lib/utils/common-constants";

export const handleGetUserAuthToken = async (
  body: object,
  isSignIn: boolean
) => {
  const result = (await asyncResponseHandler(async () => {
    return await axiosInstance.post(
      API_ROUTES.USER_ROUTE +
        (isSignIn === true
          ? API_ROUTES.USER_SIGNIN_ROUTE
          : API_ROUTES.USER_SIGNUP_ROUTE),
      body
    );
  })) as AxiosResponse;
  return result?.data
    ? result.data
    : { success: false, message: result.statusText };
};

export const handleGetUsers = async (
  body: object,
  page: number,
  limit: number,
  username: string
) => {
  const result = (await asyncResponseHandler(async () => {
    return await axiosInstance.post(
      API_ROUTES.USER_ROUTE +
        `?page=${page}&limit=${limit}&username=${username}`,
      body
    );
  })) as AxiosResponse;
  return result?.data
    ? result.data
    : { success: false, message: result.statusText };
};

export const handleUpdateUserAllowance = async (
  auth_email: string,
  email: string,
  isAllowed: boolean
) => {
  const result = (await asyncResponseHandler(async () => {
    return await axiosInstance.post(
      API_ROUTES.USER_ROUTE + API_ROUTES.UPDATE_USER_ALLOWANCE,
      { auth_email, email, isAllowed }
    );
  })) as AxiosResponse;
  return result?.data
    ? result.data
    : { success: false, message: result.statusText };
};

export const handleGetUserAllowance = async (email: string) => {
  const result = (await asyncResponseHandler(async () => {
    return await axiosInstance.post(
      API_ROUTES.USER_ROUTE + API_ROUTES.GET_USER_ALLOWANCE,
      { email }
    );
  })) as AxiosResponse;
  return result?.data
    ? result.data
    : { success: false, message: result.statusText };
};
