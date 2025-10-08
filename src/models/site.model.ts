import { ITowerModel } from "@interfaces/models.interfaces";
import mongoose, { model, models } from "mongoose";

const TowerSchema = new mongoose.Schema<ITowerModel>(
  {
    SiteId: {
      type: String,
      required: true,
      unique: true,
    },
    Latitude: {
      type: Number,
      required: true,
      unique: true,
    },
    Longitude: {
      type: Number,
      required: true,
      unique: true,
    },
    Sectors: {
      type: [
        {
          Name: {
            type: String,
            unique: true,
            required: true,
          },
          Azimuth: {
            type: Number,
            required: true,
          },
          PCI: {
            type: Number,
            required: true,
          },
          Antenna_Height: {
            type: Number,
          },
        },
      ],
    },
    Tower_Height: {
      type: Number,
    },
    Tower_Type: {
      type: String,
    },
    Building_Height: {
      type: Number,
    },
  },
  { timestamps: true }
);

export const TOWERS_4G =
  models.sites_4g || model<ITowerModel>("sites_4g", TowerSchema);
export const TOWERS_5G =
  models.sites_5g || model<ITowerModel>("sites_5g", TowerSchema);
