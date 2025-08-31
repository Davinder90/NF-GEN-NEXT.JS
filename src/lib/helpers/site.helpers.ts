import { ISectorModel } from "@interfaces/models.interfaces";
import { ICreateSiteBodyRequest } from "@interfaces/zodSchema.interfaces";

export const getSiteSectorsData = (site_data: ICreateSiteBodyRequest) => {
  const { Azimuths, SiteId, PCIs, Antenna_Heights } = site_data;
  const Sectors: ISectorModel[] = [];
  for (let index = 0; index < Azimuths.length; index++) {
    const sector: ISectorModel = {
      Name: "",
      Azimuth: 0,
      PCI: 0,
      Antenna_Height: 0,
    };
    sector["Name"] = SiteId + String.fromCharCode(65 + index);
    sector["Azimuth"] = Number(Azimuths[index]);
    sector["PCI"] = Number(PCIs[index]);
    sector["Antenna_Height"] = Number(Antenna_Heights[index]);
    Sectors.push(sector);
  }
  return Sectors;
};
