import { z } from "zod";

export const siteSchema = z.object({
  SiteId: z
    .string({
      required_error: "Site Id is required",
      invalid_type_error: "SiteId must be string",
    })
    .readonly(),
  Azimuths: z.array(
    z.number({
      required_error: "Azimuths are required",
      invalid_type_error: "Each value of azimuth must be a number",
    })
  ),
  PCIs: z.array(
    z.number({
      required_error: "PCIs are required",
      invalid_type_error: "Each value of pci must be a number",
    })
  ),
  Antenna_Heights: z.array(
    z.number({
      required_error: "Antenna Heights are required",
      invalid_type_error: "Each value of pci must be a number",
    })
  ),
  // State: z.string({
  //   required_error: "State is required",
  //   invalid_type_error: "state must be string",
  // }),
  Tower_Height: z.number({
    required_error: "Tower height is required",
    invalid_type_error: "Each value of antenna height must be number",
  }),
  Building_Height: z.number({
    required_error: "Building Height is required",
    invalid_type_error: "Building Height must be a number",
  }),
  Tower_Type: z.string({
    required_error: "Tower type is required",
    invalid_type_error: "Tower type must be a string",
  }),
  Latitude: z.number({
    required_error: "Latitude is required",
    invalid_type_error: "Latitude must be a number",
  }),
  Longitude: z.number({
    required_error: "Longitude is required",
    invalid_type_error: "Longitude must be a number",
  }),
  Network: z.string({
    required_error: "Network is required",
    invalid_type_error: "Network must be a string",
  }),
  // ANT_BW: z.number({
  //   required_error: "ANT BW is required",
  //   invalid_type_error: "ANT BW must be a number",
  // }),
  // TAC: z.number({
  //   required_error: "TAC is required",
  //   invalid_type_error: "TAC must be a number",
  // }),
  // LAC: z.number({
  //   required_error: "LAC is required",
  //   invalid_type_error: "LAC BW must be a number",
  // }),
  // MCC: z.number({
  //   required_error: "MCC is required",
  //   invalid_type_error: "MCC must be a number",
  // }),
  // EARFCN: z.number({
  //   required_error: "EARFCN is required",
  //   invalid_type_error: "EARFCN must be a number",
  // }),
});
