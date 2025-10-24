import { env_var } from "@/src/config/env.config";
import logger from "@/src/log/logger";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import { PATHS } from "../utils/constants";
import { Readable } from "stream";
import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import { asyncRequestHandler, generateResponseObject } from "./common.helpers";
import { IResponseObject } from "../interfaces/common.interfaces";
import { ERROR_MESSAGES } from "../utils/common-constants";

const s3 = new S3Client({
  region: env_var.AWS_BUCKET_REGION as string,
  credentials: {
    accessKeyId: env_var.AWS_USER_ACCESS_KEY as string,
    secretAccessKey: env_var.AWS_USER_SECRET_ACCESS_KEY as string,
  },
});

const IS_LAMBDA = process.env.AWS_EXECUTION_ENV;

export async function uploadFile(filePath: string) {
  if (!IS_LAMBDA) return;
  logger.info("Inside production 4");
  if (!fs.existsSync(filePath)) {
    return { error: `File not found: ${filePath}`, status: false };
  }
  const fileContent = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);

  const uploadParams = {
    Bucket: env_var.AWS_BUCKET_NAME,
    Key: path.join(PATHS.AWS_OUTPUT_FILES, fileName),
    Body: fileContent,
  };

  await s3.send(new PutObjectCommand(uploadParams));
  logger.info(`File uploaded: ${fileName}`);
  return { message: `File uploaded: ${fileName}`, status: true };
}

export async function deleteFileFromAws(filePath: string) {
  if (!IS_LAMBDA) return;
  logger.info("Inside production 3");
  const result = (await asyncRequestHandler(
    async () => {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: env_var.AWS_BUCKET_NAME as string,
          Key: filePath as string,
        })
      );
    },
    ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    StatusCodes.INTERNAL_SERVER_ERROR
  )) as IResponseObject;
  if (result?.error) return generateResponseObject(result);
}

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

export async function downloadFileFromAws(req: NextRequest) {
  logger.info("Inside production 2");
  const { searchParams } = new URL(req.url);
  const destination = searchParams.get("path") as string;
  const filename = searchParams.get("filename") as string;
  const key = path.join(destination, filename);

  const result = (await asyncRequestHandler(
    async () => {
      if (!filename || !destination) {
        return NextResponse.json({
          error: "Missing parameters",
          status_code: StatusCodes.BAD_REQUEST,
        });
      }
    },
    ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    StatusCodes.INTERNAL_SERVER_ERROR
  )) as IResponseObject;

  if (result?.error) return generateResponseObject(result);

  // Download from S3
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
  });

  const { Body } = await s3.send(command);

  if (!(Body instanceof Readable)) {
    return generateResponseObject({
      error: "Invalid file stream from S3",
      status_code: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }

  const fileBuffer = await streamToBuffer(Body);

  return new NextResponse(new Uint8Array(fileBuffer), {
    status: 200,
    headers: {
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
}

export async function establishAwsTemporaryStorage() {
  if (!IS_LAMBDA) return;
  logger.info("Inside production 1");
  const format_files = [
    "4G SCFT FORMAT.xlsx",
    "4G CAT FORMAT.xlsx",
    "5G CAT FORMAT.xlsx",
  ];
  fs.mkdirSync(PATHS.FILE_FORMATS_PATH, { recursive: true });

  for (const filename of format_files) {
    const localPath = path.join(PATHS.FILE_FORMATS_PATH, filename);
    if (fs.existsSync(localPath)) {
      console.log(` Already in /tmp, reusing: ${localPath}`);
      continue;
    }
    const command = new GetObjectCommand({
      Bucket: env_var.AWS_BUCKET_NAME,
      Key: `${PATHS.AWS_FORMAT_FILES}/${filename}`,
    });

    const { Body } = await s3.send(command);
    if (Body instanceof Readable) {
      const fileStream = fs.createWriteStream(localPath);
      await new Promise<void>((resolve, reject) => {
        Body.pipe(fileStream).on("finish", resolve).on("error", reject);
      });
    }
  }
}
