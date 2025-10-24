import { IAdminModel } from "@interfaces/models.interfaces";
import { Schema, model, models } from "mongoose";

const adminSchema = new Schema<IAdminModel>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

const AdminModel = models.Admin || model<IAdminModel>("Admin", adminSchema);
export default AdminModel;
