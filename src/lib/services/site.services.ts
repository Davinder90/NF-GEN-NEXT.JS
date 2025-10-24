import {
  asyncRequestHandler,
  generateResponseObject,
} from "@helpers/common.helpers";
import { getSiteSectorsData } from "@helpers/site.helpers";
import { IResponseObject } from "@interfaces/common.interfaces";
import { ISectorModel, ITowerModel } from "@interfaces/models.interfaces";
import { ICreateSiteBodyRequest } from "@interfaces/zodSchema.interfaces";
import { StatusCodes } from "http-status-codes";
import { Network } from "@type/site.types";
import {
  addSitesToDB,
  getSpreadSheet,
} from "@helpers/google-spreadsheet.helpers";
import { SHEET_ID } from "@utils/common-constants";
import { SITES_DB } from "../utils/constants";
import { dbConnection } from "@/src/config/dbConnection";
dbConnection();

// db queries
export const getSites = async (
  limit: number,
  page: number,
  network: Network,
  site: string
) => {
  const result = (await asyncRequestHandler(
    async () => {
      const skip = (page - 1) * limit;
      const query = site.length > 0 ? { SiteId: new RegExp(site, "i") } : {};
      const TOWERS = SITES_DB[network];
      const sites = await TOWERS.find(query)
        .select(
          "SiteId Latitude Longitude Tower_Height Tower_Type Building_Height Sectors -_id"
        )
        .skip(skip)
        .limit(limit);
      const output_sites = sites.map((site) => {
        return {
          SiteId: site.SiteId,
          Latitude: site.Latitude,
          Longitude: site.Longitude,
          Tower_Height: site.Tower_Height,
          Tower_Type: site.Tower_Type,
          Building_Height: site.Building_Height,
          Sectors: (site as ITowerModel)?.Sectors?.length,
        };
      });
      return { message: "Sites fetched successfully", data: { output_sites } };
    },
    "Internal Server Error, please try again later",
    StatusCodes.INTERNAL_SERVER_ERROR
  )) as IResponseObject;
  return generateResponseObject(result);
};

export const getSite = async (network: Network, site: string) => {
  const result = (await asyncRequestHandler(
    async () => {
      const TOWERS = SITES_DB[network];
      const site_data = await TOWERS.findOne({ SiteId: site }).select(" -_id");
      return {
        message: `${site} fetched successfully`,
        data: { site: site_data },
      };
    },
    "Internal Server Error, please try again later",
    StatusCodes.INTERNAL_SERVER_ERROR
  )) as IResponseObject;
  return generateResponseObject(result);
};

export const createSite = async (site_data: ICreateSiteBodyRequest) => {
  const result = (await asyncRequestHandler(
    async () => {
      const {
        SiteId,
        Tower_Height,
        Building_Height,
        Tower_Type,
        Latitude,
        Longitude,
        Network,
      } = site_data;

      const TOWERS = SITES_DB[Network as Network];
      const result = await TOWERS.findOne({ SiteId });
      if (result)
        return {
          error: `${SiteId} already present`,
          status_code: StatusCodes.OK,
        };
      const Sectors: ISectorModel[] = getSiteSectorsData(site_data);
      const new_site = new TOWERS({
        SiteId,
        Latitude: Number(Latitude),
        Longitude: Number(Longitude),
        Tower_Height: Number(Tower_Height),
        Building_Height: Number(Building_Height),
        Tower_Type: Tower_Type,

        Sectors: Sectors,
      });
      await new_site.save();
      return { message: `${SiteId} successfully created` };
    },
    "Internal Server Error, please try again later",
    StatusCodes.INTERNAL_SERVER_ERROR
  )) as IResponseObject;
  return generateResponseObject(result);
};

export const updateSite = async (site_data: ICreateSiteBodyRequest) => {
  const result = (await asyncRequestHandler(
    async () => {
      const {
        SiteId,
        Tower_Height,
        Building_Height,
        Tower_Type,
        Latitude,
        Longitude,
        Network,
      } = site_data;
      const TOWERS = SITES_DB[Network as Network];
      const result = await TOWERS.findOne({ SiteId });
      if (!result)
        return {
          error: `${SiteId} not found`,
          status_code: StatusCodes.OK,
        };
      const Sectors: ISectorModel[] = getSiteSectorsData(site_data);
      await TOWERS.findOneAndUpdate(
        { SiteId },
        {
          $set: {
            Latitude: Number(Latitude),
            Longitude: Number(Longitude),
            Tower_Height: Number(Tower_Height),
            Building_Height: Number(Building_Height),
            Tower_Type: Tower_Type,
          },
          Sectors: Sectors,
        }
      );
      return {
        message: `${SiteId} Updated successfully`,
        data: null,
      };
    },
    "Internal Server Error, please try again later",
    StatusCodes.FORBIDDEN
  )) as IResponseObject;
  return generateResponseObject(result);
};

export const deleteSite = async (SiteId: string, network: Network) => {
  const result = (await asyncRequestHandler(
    async () => {
      const TOWERS = SITES_DB[network];
      const result = await TOWERS.findOne({ SiteId });
      if (!result)
        return {
          error: `${SiteId} not found`,
          status_code: StatusCodes.OK,
        };

      await TOWERS.findOneAndDelete({ SiteId });
      return { message: `${SiteId} deleted successfully` };
    },
    "Internal Server Error, please try again later",
    StatusCodes.FORBIDDEN
  )) as IResponseObject;
  return generateResponseObject(result);
};

export const getCountTotalSites = async (site: string, network: Network) => {
  const result = (await asyncRequestHandler(
    async () => {
      const TOWERS = SITES_DB[network];
      const query = site.length ? { SiteId: new RegExp(site, "i") } : {};
      const count = await TOWERS.countDocuments(query);
      return {
        message: "Sites counted successfully",
        data: { count },
      };
    },
    "Internal Server Error, please try again later",
    StatusCodes.FORBIDDEN
  )) as IResponseObject;
  return generateResponseObject(result);
};

export const isValidSite = async (site: string, network: Network) => {
  const result = (await asyncRequestHandler(
    async () => {
      const TOWERS = SITES_DB[network];
      const result = await TOWERS.findOne({ SiteId: site });
      if (!result)
        return {
          error: `${site} not found`,
          status_code: StatusCodes.OK,
        };
      return {
        message: `${site} is Valid Site`,
        data: null,
      };
    },
    "Internal Server Error, please try again later",
    StatusCodes.FORBIDDEN
  )) as IResponseObject;
  return generateResponseObject(result);
};

export const getSitesNamesByNetwork = async (network: Network) => {
  const result = (await asyncRequestHandler(
    async () => {
      const TOWERS = SITES_DB[network];
      const sites = await TOWERS.find().select("SiteId -_id");
      return {
        message: `${network.toUpperCase()} sites fetched successfully`,
        data: { sites },
      };
    },
    "Internal Server Error, please try again later",
    StatusCodes.FORBIDDEN
  )) as IResponseObject;
  return generateResponseObject(result);
};

// spread sheet data
export const addNewSitesFromGoogleSpreadsheetToDatabase = async (
  network: Network
) => {
  const result = (await asyncRequestHandler(
    async () => {
      const spreadsheet = await getSpreadSheet(SHEET_ID[network]);
      if (spreadsheet == null)
        return {
          error: "Internal server side error",
          status_code: StatusCodes.NOT_FOUND,
        };
      return await addSitesToDB(spreadsheet, network);
    },
    "Internal Server Error, please try again later",
    StatusCodes.FORBIDDEN
  )) as IResponseObject;
  return generateResponseObject(result);
};
