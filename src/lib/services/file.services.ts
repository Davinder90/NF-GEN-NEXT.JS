import FileModel from "@/src/models/file.model";
<<<<<<< HEAD
import {
  asyncRequestHandler,
  generateResponseObject,
} from "@helpers/common.helpers";
import { CustomFileType } from "@type/helpers.types";
import { ERROR_MESSAGES } from "@utils/common-constants";
import { StatusCodes } from "http-status-codes";
import { IResponseObject } from "@interfaces/common.interfaces";
=======
import { asyncRequestHandler, generateResponseObject } from "../helpers/common.helpers";
import { CustomFileType } from "../type/helpers.types";
import { ERROR_MESSAGES } from "../utils/common-constants";
import { StatusCodes } from "http-status-codes";
import { IResponseObject } from "../interfaces/common.interfaces";

>>>>>>> 7941f6d (new system)

export const createOrUpdateFile = async (
  filename: string,
  file_type: string,
  network_type: string,
  size: string,
  destination: string
) => {
  await FileModel.findOneAndUpdate(
<<<<<<< HEAD
    { filename },
    { destination, size, file_type, network_type, updatedAt: new Date() },
    { new: true, upsert: true }
=======
    { filename }, 
    { destination ,size, file_type, network_type, updatedAt: new Date() },
    { new: true, upsert: true } 
>>>>>>> 7941f6d (new system)
  );
  return;
};

<<<<<<< HEAD
export const deleteFile = async (filename: string) => {
=======

export const deleteFileFromDB = async (filename: string) => {
>>>>>>> 7941f6d (new system)
  await FileModel.findOneAndDelete({ filename });
  return;
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
<<<<<<< HEAD
          sizeInMB: file.size,
=======
          sizeInMB : file.size
>>>>>>> 7941f6d (new system)
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
<<<<<<< HEAD
};
=======
};
>>>>>>> 7941f6d (new system)
