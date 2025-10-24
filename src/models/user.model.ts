import { IUserModel } from "@interfaces/models.interfaces";
import { Schema, model, models } from "mongoose";

const userSchema = new Schema<IUserModel>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  isAllowed: {
    type: Boolean,
    required: true,
  },
});

const UserModel = models.User || model<IUserModel>("User", userSchema);
export default UserModel;
