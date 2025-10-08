import { AxiosResponse } from "axios";
import axiosInstance from "@helpers/axios.helpers";
import { asyncResponseHandler } from "@helpers/client.helpers";
import { API_ROUTES } from "@/src/lib/utils/common-constants";

export const handleNewAdmin = async (body: object) => {
  const result = (await asyncResponseHandler(async () => {
    return await axiosInstance.post(
      API_ROUTES.ADMIN_ROUTE + API_ROUTES.NEW_ADMIN_ROUTE,
      body
    );
  })) as AxiosResponse;
  return result?.data
    ? result.data
    : { success: false, message: result.statusText };
};

export const handleVerifyAdmin = async (email: string) => {
  const result = (await asyncResponseHandler(async () => {
    return await axiosInstance.post(
      API_ROUTES.ADMIN_ROUTE + API_ROUTES.VERIFY_ADMIN_ROUTE,
      { email }
    );
  })) as AxiosResponse;
  return result?.data
    ? result.data
    : { success: false, message: result.statusText };
};
