import { AxiosResponse } from "axios";
import axiosInstance from "@helpers/axios.helpers";
import { asyncResponseHandler } from "@helpers/client.helpers";
import { API_ROUTES } from "@/src/lib/utils/common-constants";
import { ISiteReportData, ISnap } from "../lib/interfaces/site.interfaces";

export const handleUploadImage = async (
  body: FormData,
  snapName: string,
  multiple: boolean,
  prev_file: string,
  username: string
) => {
  const result = (await asyncResponseHandler(async () => {
    return await axiosInstance.post(
      API_ROUTES.FILE_ROUTE +
        API_ROUTES.FILE_UPLOAD_IMAGE_ROUTE +
        `?snapName=${snapName}&multiple=${multiple}&username=${username}`,
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          previousFilePath: multiple ? "" : prev_file,
        },
      }
    );
  })) as AxiosResponse;
  return result?.data
    ? result.data
    : { success: false, message: "Internal server error" };
};

export const handleDeleteFile = async (path: string) => {
  const result = (await asyncResponseHandler(async () => {
    return await axiosInstance.delete(
      API_ROUTES.FILE_ROUTE +
        API_ROUTES.FILE_DELETE_FILE_ROUTE +
        `?path=${path}`
    );
  })) as AxiosResponse;
  return result?.data
    ? result.data
    : { success: false, message: "Internal server error" };
};

export const handleDeleteFiles = async (Files: ISnap[]) => {
  const result = (await asyncResponseHandler(async () => {
    return await axiosInstance.post(
      API_ROUTES.FILE_ROUTE + API_ROUTES.FILE_DELETE_FILES_ROUTE,
      { Files: Files }
    );
  })) as AxiosResponse;
  return result?.data
    ? result.data
    : { success: false, message: "Internal server error" };
};

export const handleUploadFile = async (
  body: FormData,
  fileName: string,
  prev_file: string,
  username: string
) => {
  const result = (await asyncResponseHandler(async () => {
    return await axiosInstance.post(
      API_ROUTES.FILE_ROUTE +
        API_ROUTES.FILE_UPLOAD_FILE_ROUTE +
        `?fileName=${fileName}&username=${username}`,
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          previousFilePath: prev_file,
        },
      }
    );
  })) as AxiosResponse;
  return result?.data
    ? result.data
    : { success: false, message: "Internal server error" };
};

export const handleGenerateReport = async (data: ISiteReportData) => {
  const result = (await asyncResponseHandler(async () => {
    return await axiosInstance.post(
      API_ROUTES.FILE_ROUTE + API_ROUTES.FILE_GENERATE_REPORT_ROUTE,
      {
        site_data: data,
      }
    );
  })) as AxiosResponse;
  return result?.data
    ? result.data
    : { success: false, message: "Internal server error" };
};

export const handleDownloadReport = async (path: string, filename: string) => {
  const result = (await asyncResponseHandler(async () => {
    return await axiosInstance.get(
      API_ROUTES.FILE_ROUTE +
        API_ROUTES.FILE_DOWNLOAD_FILE_ROUTE +
        `?path=${path}&filename=${filename}`,
      {
        responseType: "blob",
      }
    );
  })) as AxiosResponse;
  return result;
};

export const handleGetFiles = async () => {
  const result = (await asyncResponseHandler(async () => {
    return await axiosInstance.get(API_ROUTES.FILE_ROUTE);
  })) as AxiosResponse;
  return result?.data
    ? result.data
    : { success: false, message: "Internal server error" };
};
