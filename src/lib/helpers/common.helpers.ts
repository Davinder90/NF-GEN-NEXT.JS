import { IResponseObject } from "@interfaces/common.interfaces";
import { StatusCodes } from "http-status-codes";
import logger from "@log/logger";
import { NextResponse } from "next/server";
import { Network } from "../type/site.types";

const generateResponse = (
  status_code: number,
  success: boolean,
  message: string,
  result: object | null
): NextResponse => {
  return NextResponse.json(
    {
      success,
      message,
      result,
    },
    { status: status_code }
  );
};

export const generateResponseObject = (
  result: IResponseObject
): NextResponse => {
  if (result?.error) {
    return generateResponse(
      result.status_code as number,
      false,
      result.error,
      null
    );
  }
  return generateResponse(
    StatusCodes.OK,
    true,
    result?.message as string,
    result?.data ? result.data : null
  );
};

export const asyncRequestHandler = async <T>(
  fn: () => Promise<T>,
  errorMessage: string,
  status_code: number
): Promise<T | unknown> => {
  try {
    return await fn();
  } catch (error) {
    logger.error(errorMessage, error);
    return {
      error: errorMessage,
      status_code,
    };
  }
};

export const asyncHandler = async <T>(fn: () => Promise<T>) => {
  try {
    await fn();
  } catch (error) {
    logger.error(error);
  }
};

export const getDateForFile = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}${month}${year}`;
};

export const generateOutputFileName = (
  state: string,
  tech: string,
  siteId: string,
  file_type: string,
  network: Network
) => {
  switch (network) {
    case "4G":
      return `${getDateForFile()}_${state}_${tech}_${file_type}_${siteId}.xlsx`;
    case "5G":
      return `${getDateForFile()}_${state}_${siteId}_${network}_STANDALONE.xlsx`;
  }
};

export const todayDate = () => {
  const date = `${new Date()}`.split(" ");
  return `${date[2]}-${date[1]}-${date[3]}`;
};
