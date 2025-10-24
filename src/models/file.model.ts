import { IFile } from "@interfaces/models.interfaces";
import { Schema, model, models } from "mongoose";

const fileSchema = new Schema<IFile>({
  filename: {
    type: String,
    required: true,
    unique: true,
  },
  file_type: {
    type: String,
    required: true,
  },
  network_type: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  }
});

const FileModel = models.File || model<IFile>("File", fileSchema);
export default FileModel;
