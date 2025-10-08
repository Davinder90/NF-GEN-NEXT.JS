import { Document } from "mongoose";
import { FileType, Network } from "../type/site.types";

export interface IUserModel extends Document {
  email: string;
  password: string;
  name: string;
  username?: string;
  isAllowed: boolean;
}

export interface IAdminModel extends Document {
  email: string;
}

export interface ISectorModel {
  Name: string;
  Azimuth: number;
  PCI: number;
  Antenna_Height?: number;
}

export interface IFile {
  filename: string,
  file_type: FileType,
  network_type: Network,
  size: string,
  destination:string,
  createdAt?: Date;
  updatedAt?: Date; 
}

export interface ITowerModel {
  SiteId: string;
  Latitude: number;
  Longitude: number;
  Sectors?: ISectorModel[];
  Tower_Height?: number;
  Tower_Type?: string;
  Building_Height?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
