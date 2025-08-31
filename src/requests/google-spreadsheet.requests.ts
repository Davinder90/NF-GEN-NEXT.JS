import { AxiosResponse } from "axios";
import axiosInstance from "@helpers/axios.helpers";
import { asyncResponseHandler } from "@helpers/client.helpers";
import { API_ROUTES } from "@utils/common-constants";
import { Network } from "@type/site.types";

export const addNewSites = async (network: Network) => {
  const result = (await asyncResponseHandler(async () => {
    return await axiosInstance.get(
      API_ROUTES.SPREADSHEET_ROUTE +
        API_ROUTES.SPREADSHEET_NEWSITES_ROUTE +
        `?network=${network}`
    );
  })) as AxiosResponse;
  console.log(result.data);
  return result?.data
    ? result.data
    : { success: false, message: result.statusText };
};
