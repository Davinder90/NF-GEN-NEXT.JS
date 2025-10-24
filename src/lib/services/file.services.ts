import FileModel from "@/src/models/file.model";
import {
  asyncRequestHandler,
  generateResponseObject,
} from "../helpers/common.helpers";
import { CustomFileType } from "../type/helpers.types";
import { ERROR_MESSAGES } from "../utils/common-constants";
import { StatusCodes } from "http-status-codes";
import { IResponseObject } from "../interfaces/common.interfaces";

export const createOrUpdateFile = async (
  filename: string,
  file_type: string,
  network_type: string,
  size: string,
  destination: string
) => {
  await FileModel.findOneAndUpdate(
    { filename },
    { destination, size, file_type, network_type, updatedAt: new Date() },
    { new: true, upsert: true }
  );
};

export const deleteFile = async (filename: string) => {
  await FileModel.findOneAndDelete({ filename });
};

export const getFilesFromDB = async () => {
  const result = (await asyncRequestHandler(
    async () => {
      const indiaTime = (date: Date) => {
        return new Date(date).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
      };

      const Files: CustomFileType[] = [];

      const dbFiles = await FileModel.find().sort({ createdAt: -1 });

      dbFiles.forEach((file) => {
        Files.push({
          filename: file.filename,
          createdAt: indiaTime(file.createdAt ?? new Date()),
          modifiedAt: indiaTime(file.updatedAt ?? new Date()),
          destination: file.destination,
          sizeInMB: file.size,
        });
      });

      return {
        message: "Files fetched successfully",
        data: { Files },
      };
    },
    ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    StatusCodes.INTERNAL_SERVER_ERROR
  )) as IResponseObject;

  return generateResponseObject(result);
};
