// import path from "path";
// import multer from "multer";
// import { Request } from "express";
// import { generateFileUniqueName, STORAGE_PATH } from "@helpers/filte-helpers";

// const createStorage = (
//   folderPath: string,
//   getSnapName?: (req: Request, file: Express.Multer.File) => string
// ) =>
//   multer.diskStorage({
//     destination: (
//       req: Request,
//       file: Express.Multer.File,
//       cb: (error: Error | null, destination: string) => void
//     ) => {
//       cb(null, path.join(STORAGE_PATH, folderPath));
//     },
//     filename: (
//       req: Request,
//       file: Express.Multer.File,
//       cb: (error: Error | null, filename: string) => void
//     ) => {
//       const snapName = getSnapName ? getSnapName(req, file) : file.fieldname;
//       const uniqueName = generateFileUniqueName(file, snapName);
//       cb(null, uniqueName);
//     },
//   });

// export const uploadTowerSectorComponentImage = multer({
//   storage: createStorage(
//     path.join("IMAGE FILE STORAGE SETUP", "TOWER SECTOR SNAPS"),
//     (req) => req.headers.snap_name as string
//   ),
// }).single("file");

// export const uploadTowerBlockageImages = multer({
//   storage: createStorage(
//     path.join("IMAGE FILE STORAGE SETUP", "TOWER BLOCKAGE SNAPS"),
//     () => "blockage"
//   ),
// }).array("files", 40);

// export const uploadInputCombineReport = multer({
//   storage: createStorage(
//     path.join("EXCEL FILE STORAGE SETUP", "INPUT COMBINE REPORTS"),
//     () => "input combine"
//   ),
// }).single("file");
