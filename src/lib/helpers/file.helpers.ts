import path from "path";
import { File } from "formidable";
import fs from "fs";
import {
  asyncRequestHandler,
  generateOutputFileName,
  generateResponseObject,
} from "./common.helpers";
import { StatusCodes } from "http-status-codes";
import { IResponseObject } from "@interfaces/common.interfaces";
import { getWorkbook } from "./exceljs/main.exceljs.helpers";
import { NextRequest, NextResponse } from "next/server";
import { FORMATS, PATHS } from "@utils/constants";
import { FORMATER } from "./exceljs/format.exceljs.helpers";
import { Workbook } from "exceljs";
import {
  FileOperationFormats,
  Formats,
  WorkbooksFormats,
} from "@type/site.types";
import logger from "@/src/log/logger";
import { SCFT_4G } from "./exceljs/4gscft.helpers";
import { ISiteReportData, ISnap } from "@interfaces/site.interfaces";
import { CAT_4G } from "./exceljs/4gcat.helpers";
import { ERROR_MESSAGES } from "@utils/common-constants";
import { mimeTypeMap } from "@type/helpers.types";
import { CAT_5G } from "./exceljs/5gcat.helpers";
import { SCFT_ANTS_5G } from "./exceljs/5gscftAnts.helpers";
import { establishAwsTemporaryStorage, uploadFile } from "./aws-sdk.helpers";
import { createOrUpdateFile } from "../services/file.services";

const IS_LAMBDA = process.env.AWS_EXECUTION_ENV;
export const generateFileUniqueName = (
  file: File,
  snap_name: string,
  username: string
) => {
  return (
    Date.now() +
    "-" +
    Math.round(Math.random() * 1e9) +
    "-" +
    snap_name +
    "-" +
    username +
    "-" +
    file.originalFilename
  );
};

export const deleteFile = async (path: string) => {
  if (!path) return;
  const result = (await asyncRequestHandler(
    async () => {
      fs.unlinkSync(path);
    },
    ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    StatusCodes.INTERNAL_SERVER_ERROR
  )) as IResponseObject;
  if (result?.error) return generateResponseObject(result);
};

export const inputFile = async (req: NextRequest, files: ISnap[] | null) => {
  const result = (await asyncRequestHandler(
    async () => {
      const headers = req.headers;
      const previousFilePath = headers.get("previousFilePath");
      await deleteFile(previousFilePath as string);
      if (!files?.length)
        return {
          error: "File is not uploaded",
          status_code: StatusCodes.OK,
        };
      if (!files[0].filename.toLowerCase().endsWith(".xlsx")) {
        files = files.map((file) => {
          const base64Image = getImage(file.filename, file.destination);
          return { ...file, base64Image: base64Image };
        });
      }
      return {
        message: "File uploaded successfully",
        data: { files },
      };
    },
    ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    StatusCodes.INTERNAL_SERVER_ERROR
  )) as IResponseObject;
  return generateResponseObject(result);
};

export const downloadFile = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const destination = searchParams.get("path") as string;
  const filename = searchParams.get("filename") as string;
  const fullpath = path.join(destination, filename);
  const result = (await asyncRequestHandler(
    async () => {
      if (!filename || !destination) {
        return NextResponse.json({
          error: "Missing parameters",
          status_code: StatusCodes.OK,
        });
      }
      if (!fs.existsSync(fullpath)) {
        return NextResponse.json(
          { error: "File not found" },
          { status: StatusCodes.OK }
        );
      }
    },
    ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    StatusCodes.INTERNAL_SERVER_ERROR
  )) as IResponseObject;
  if (result?.error) return generateResponseObject(result);
  const fileBuffer = fs.readFileSync(fullpath);
  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
};

export const deleteFiles = (files: ISnap[]) => {
  files.forEach(({ destination }) => {
    fs.unlinkSync(destination);
  });
  return;
};

// export const getFiles = async () => {
//   const result = (await asyncRequestHandler(
//     async () => {
//       const indiaTime = (date: Date) => {
//         return new Date(date).toLocaleString("en-IN", {
//           timeZone: "Asia/Kolkata",
//           year: "numeric",
//           month: "2-digit",
//           day: "2-digit",
//           hour: "2-digit",
//           minute: "2-digit",
//           second: "2-digit",
//           hour12: true,
//         });
//       };

//       const Files: CustomFileType[] = [];
//       const folder = fs.readdirSync(PATHS.OUTPUT_FILES_PATH);
//       folder.forEach((file) => {
//         const file_path = path.join(PATHS.OUTPUT_FILES_PATH, file);
//         const file_stats = fs.statSync(file_path);
//         Files.push({
//           filename: file,
//           createdAt: indiaTime(file_stats.birthtime),
//           modifiedAt: indiaTime(file_stats.mtime),
//           destination: PATHS.OUTPUT_FILES_PATH,
//           sizeInMB: file_stats.size / (1024 * 1024),
//         });
//       });
//       return {
//         message: "Files fetched successfully",
//         data: { Files },
//       };
//     },
//     ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
//     StatusCodes.INTERNAL_SERVER_ERROR
//   )) as IResponseObject;
//   return generateResponseObject(result);
// };

export const getImage = (filename: string, destination: string) => {
  const buffer = fs.readFileSync(destination);
  const base64Image = buffer.toString("base64");
  const ext = filename.split(".").pop()?.toLowerCase();
  const mimeType =
    ext && mimeTypeMap[ext] ? mimeTypeMap[ext] : "application/octet-stream";
  return `data:${mimeType};base64,${base64Image}`;
};

const generateOutputWorkbook = async (
  site_data: ISiteReportData,
  format: Formats,
  output_workbook: Workbook,
  single_combine_input_workbook?: Workbook,
  pre_combine_input_workbook?: Workbook,
  post_combine_input_workbook?: Workbook
) => {
  switch (format) {
    case "4G_SCFT":
      const scft = new SCFT_4G(
        single_combine_input_workbook as Workbook,
        output_workbook,
        site_data
      );
      await scft.generate4GOldScftReport();
      break;
    case "4G_CAT":
      const cat = new CAT_4G(
        output_workbook,
        site_data,
        single_combine_input_workbook,
        pre_combine_input_workbook,
        post_combine_input_workbook
      );
      await cat.generate4GCatReport();
      break;
    case "5G_CAT":
      const cat_5g = new CAT_5G(
        output_workbook,
        site_data,
        single_combine_input_workbook,
        pre_combine_input_workbook,
        post_combine_input_workbook
      );
      await cat_5g.generate5GCatReport();
      break;
    case "5G_SCFT_ANTS":
      const scft_5g = new SCFT_ANTS_5G(
        single_combine_input_workbook as Workbook,
        site_data
      );
      await scft_5g.generate5GSCFT_ANTSReport();
      break;
    default:
      logger.error("Invalid format method");
  }
};

const deletePlots = async (plots: ISnap[][]) => {
  plots.map((plot) => {
    deleteFiles(plot);
  });
};

export const generateReport = async (site_data: ISiteReportData) => {
  const result = (await asyncRequestHandler(
    async () => {
      await establishAwsTemporaryStorage();
      const {
        combine_report: { single_combine, pre_combine, post_combine },
        tower_data: { state, tech, siteId },
        combine_input_report_format,
        format,
        file_type,
        network,
      } = site_data;
      site_data.plots = [];
      const Formater = new FORMATER();
      const Formats =
        file_type == "SCFT ANTS" ? null : FORMATS(site_data.tower_data.sectors);
      const formated_output_workbook = Formats
        ? await Formater.formatOutputWorkbook(
            Formats as WorkbooksFormats,
            format as FileOperationFormats
          )
        : undefined;
      const file_name =
        file_type == "SCFT ANTS"
          ? (single_combine?.name as string)
          : (generateOutputFileName(
              state,
              tech,
              siteId,
              file_type,
              network
            ) as string);
      site_data.output_file_path = path.join(
        PATHS.OUTPUT_FILES_PATH,
        file_name
      );

      const Path = single_combine?.destination as string;
      const input_workbook = await getWorkbook(Path);
      switch (combine_input_report_format) {
        case "SINGLE COMBINE FILE":
          await generateOutputWorkbook(
            site_data,
            format,
            formated_output_workbook as Workbook,
            input_workbook,
            undefined,
            undefined
          );
          break;
        case "PRE, POST FILES":
          const pre_path = pre_combine?.destination as string;
          const post_path = post_combine?.destination as string;
          const pre_input_workbook = await getWorkbook(pre_path);
          const post_input_workbook = await getWorkbook(post_path);
          await generateOutputWorkbook(
            site_data,
            format,
            formated_output_workbook as Workbook,
            undefined,
            pre_input_workbook,
            post_input_workbook
          );
          break;
      }

      await (file_type == "SCFT ANTS"
        ? (input_workbook as Workbook)
        : (formated_output_workbook as Workbook)
      ).xlsx.writeFile(site_data.output_file_path);

      await deletePlots(site_data.plots);

      if (file_type === "SCFT ANTS") {
        const oldPath = path.join(
          PATHS.OUTPUT_FILES_PATH,
          single_combine?.filename as string
        );
        const newPath = path.join(PATHS.OUTPUT_FILES_PATH, file_name);

        if (fs.existsSync(oldPath)) {
          fs.renameSync(oldPath, newPath);
        }
      }

      const destination = IS_LAMBDA
        ? PATHS.AWS_FORMAT_FILES
        : PATHS.OUTPUT_FILES_PATH;
      await uploadFile(site_data.output_file_path);
      const filestats = fs.statSync(site_data.output_file_path);
      const size = filestats.size / (1024 * 1024);
      await createOrUpdateFile(
        file_name,
        file_type,
        network,
        `${size}`,
        destination
      );
      if (IS_LAMBDA) fs.unlinkSync(site_data.output_file_path);

      return {
        message: "File generated successfully",
        data: {
          filename: file_name,
          destination,
        },
      };
    },
    ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    StatusCodes.INTERNAL_SERVER_ERROR
  )) as IResponseObject;
  return generateResponseObject(result);
};
