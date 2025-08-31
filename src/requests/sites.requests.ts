import { AxiosResponse } from "axios";
import axiosInstance from "@helpers/axios.helpers";
import { asyncResponseHandler } from "@helpers/client.helpers";
import { API_ROUTES } from "@/src/lib/utils/common-constants";
import { Network } from "@type/site.types";
import { ICreateSiteBodyRequest } from "../lib/interfaces/zodSchema.interfaces";

export const handleGetPaginationSites = async (
  network: Network,
  page: number,
  limit: number,
  siteId: string
) => {
  const result = (await asyncResponseHandler(async () => {
    return await axiosInstance.get(
      API_ROUTES.SITE_ROUTE +
        API_ROUTES.SITE_GET_SITES_ROUTE +
        `?network=${network}&page=${page}&limit=${limit}&siteId=${siteId}`
    );
  })) as AxiosResponse;
  return result?.data
    ? result.data
    : { success: false, message: result.statusText };
};

export const handleTotalSitesCount = async (
  network: Network,
  siteId: string
) => {
  const result = (await asyncResponseHandler(async () => {
    return await axiosInstance.get(
      API_ROUTES.SITE_ROUTE +
        API_ROUTES.SITE_GET_TOTALSITES_ROUTE +
        `?network=${network}&siteId=${siteId}`
    );
  })) as AxiosResponse;
  return result?.data
    ? result.data
    : { success: false, message: result.statusText };
};

export const handleGetSite = async (network: Network, siteId: string) => {
  const result = (await asyncResponseHandler(async () => {
    return await axiosInstance.get(
      API_ROUTES.SITE_ROUTE +
        API_ROUTES.SITE_GET_SITE_ROUTE +
        `?network=${network}&siteId=${siteId}`
    );
  })) as AxiosResponse;
  return result?.data
    ? result.data
    : { success: false, message: result.statusText };
};

export const handleAddSite = async (data: ICreateSiteBodyRequest) => {
  const result = (await asyncResponseHandler(async () => {
    return await axiosInstance.post(
      API_ROUTES.SITE_ROUTE + API_ROUTES.SITE_CREATE_SITE_ROUTE,
      { site_data: data }
    );
  })) as AxiosResponse;
  return result?.data
    ? result.data
    : { success: false, message: result.statusText };
};

export const handleUpdateSite = async (data: ICreateSiteBodyRequest) => {
  const result = (await asyncResponseHandler(async () => {
    return await axiosInstance.post(
      API_ROUTES.SITE_ROUTE + API_ROUTES.SITE_UPDATE_SITE_ROUTE,
      { site_data: data }
    );
  })) as AxiosResponse;
  return result?.data
    ? result.data
    : { success: false, message: result.statusText };
};

export const handleSitesNames = async (network: Network) => {
  const result = (await asyncResponseHandler(async () => {
    return await axiosInstance.get(
      API_ROUTES.SITE_ROUTE +
        API_ROUTES.SITE_SITESNAMES_ROUTE +
        `?network=${network}`
    );
  })) as AxiosResponse;
  return result?.data
    ? result.data
    : { success: false, message: result.statusText };
};
