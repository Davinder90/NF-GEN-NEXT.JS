import formidable, { File } from "formidable";
import fs from "fs/promises";
import path from "path";
import { NextRequest } from "next/server";
import { generateFileUniqueName } from "@helpers/file.helpers";
import { MultiUploadResult, SingleUploadResult } from "@type/site.types";
import { IncomingMessage } from "http";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false,
  },
};

function nextRequestToIncomingMessage(req: NextRequest): IncomingMessage {
  const reader = (req.body as ReadableStream<Uint8Array>).getReader();

  const readable = new Readable({
    read() {
      function process({
        done,
        value,
      }: ReadableStreamReadResult<Uint8Array>): Promise<void> {
        if (done) {
          readable.push(null);
          return Promise.resolve();
        } else {
          readable.push(Buffer.from(value));
          return reader.read().then(process);
        }
      }

      reader
        .read()
        .then(process)
        .catch((err) => {
          readable.destroy(err);
        });
    },
  });

  const headers = Object.fromEntries(req.headers.entries());

  return Object.assign(readable, {
    headers,
    method: req.method,
    url: req.nextUrl.pathname,
  }) as IncomingMessage;
}

export const parseSingleFile = async (
  req: NextRequest,
  snapName: string,
  storage_path: string,
  username: string
): Promise<SingleUploadResult> => {
  const form = formidable({
    uploadDir: storage_path,
    keepExtensions: true,
    maxFiles: 1,
  });
  await fs.mkdir(storage_path, { recursive: true });
  const incomingReq = nextRequestToIncomingMessage(req);
  return await new Promise((resolve, reject) => {
    form.parse(incomingReq, async (err, fields, files) => {
      if (err) return reject(err);
      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!file) return reject(new Error("No file uploaded"));
      const uniqueName = generateFileUniqueName(file, snapName, username);
      const destination = path.join(storage_path, uniqueName);
      await fs.rename(file.filepath, destination);
      resolve({ fields, file, destination, filename: uniqueName });
    });
  });
};

export const parseMultipleFiles = async (
  req: NextRequest,
  snapName: string,
  storage_path: string,
  username: string,
  maxFiles: number = 40
): Promise<MultiUploadResult> => {
  const form = formidable({
    uploadDir: storage_path,
    keepExtensions: true,
    maxFiles,
    multiples: true,
  });
  await fs.mkdir(storage_path, { recursive: true });
  const incomingReq = nextRequestToIncomingMessage(req);
  return await new Promise((resolve, reject) => {
    form.parse(incomingReq, async (err, fields, files) => {
      if (err) return reject(err);
      const savedFiles: MultiUploadResult["files"] = {};
      for (const [key, fileList] of Object.entries(files)) {
        const fileArray = Array.isArray(fileList) ? fileList : [fileList];
        savedFiles[key] = [];
        for (const file of fileArray) {
          const uniqueName = generateFileUniqueName(file as File, snapName, username);
          const destination = path.join(storage_path, uniqueName);
          await fs.rename((file as File)?.filepath, destination);
          savedFiles[key].push({ filename: uniqueName, destination });
        }
      }
      resolve({ fields, files: savedFiles });
    });
  });
};
