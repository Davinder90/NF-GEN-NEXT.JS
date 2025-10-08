import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { asyncRequestHandler } from "./common.helpers";
import { StatusCodes } from "http-status-codes";
import { Network } from "@type/site.types";
import { ICreateSiteBodyRequest } from "@interfaces/zodSchema.interfaces";
import { createSite, isValidSite } from "@services/site.services";
import logger from "@/src/log/logger";
import { env_var } from "@/src/config/env.config";

const credentials = JSON.parse(env_var.GOOGLE_SERVICE_ACCOUNT as string);
const serviceAccountAuth = new JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

export const getSpreadSheet = async (sheet_id: string) => {
  const result = (await asyncRequestHandler(
    async () => {
      const sheet = new GoogleSpreadsheet(sheet_id, serviceAccountAuth);
      await sheet.loadInfo();
      return sheet;
    },
    "Spread sheet not exists",
    StatusCodes.OK
  )) as GoogleSpreadsheet;
  if (result?.sheetCount) return result;
  return null;
};

export const addSitesToDB = async (
  spread_sheet: GoogleSpreadsheet,
  network: Network
) => {
  const sheet = spread_sheet.sheetsByTitle["Sheet1"];
  const sites = [];
  const rows = await sheet.getRows();
  for (const siterow of rows) {
    const validate_response = await isValidSite(siterow.get("SITE"), network);
    const validate_data = await validate_response.json();
    logger.info(validate_data);
    if (validate_data.success) continue;
    let counter = 0;
    const site: ICreateSiteBodyRequest = {
      SiteId: siterow.get("SITE"),
      Latitude: siterow.get("LAT"),
      Longitude: siterow.get("LON"),
      Building_Height: 0,
      Tower_Height: 0,
      Tower_Type: "NA",
      Antenna_Heights: [],
      PCIs: [],
      Azimuths: [],
      Network: network,
    };
    for (const row of rows) {
      if (counter == 3) break;
      if (siterow.get("SITE") == row.get("SITE")) {
        site.Antenna_Heights.push(0);
        site.PCIs.push(row.get("PCI"));
        site.Azimuths.push(row.get("DIR"));
        counter += 1;
      }
    }
    const site_response = await createSite(site);
    const site_body = await site_response.json();
    if (site_body.success) {
      logger.info(`${site.SiteId} added to db successfully`);
      sites.push(site.SiteId);
    }
  }

  return {
    message: "sites added to database successfully",
    data: sites,
  };
};
