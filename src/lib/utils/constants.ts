import path from "path";
import {
  Network,
  PlotsFormat,
  StateParams,
  WorkbooksFormats,
} from "@type/site.types";
import { TOWERS_4G, TOWERS_5G } from "@/src/models/site.model";
import { Model } from "mongoose";
import { ITowerModel } from "@interfaces/models.interfaces";

// paths constants
// Detect if running in AWS Lambda
export const COLORS = {
  RESET: "\x1b[0m",
  RED: "\x1b[31m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  BLUE: "\x1b[34m",
  MAGENTA: "\x1b[35m",
  CYAN: "\x1b[36m",
  WHITE: "\x1b[37m",
};

const IS_LAMBDA = process.env.AWS_EXECUTION_ENV !== undefined;

// base directory
const ROOT_DIRECTORY_PATH = process.cwd();

// storage path (local → ./src/storage, lambda → /tmp/storage)
const STORAGE_PATH = IS_LAMBDA
  ? path.join("/tmp", "storage")
  : path.join(ROOT_DIRECTORY_PATH, "src", "storage");

export const PATHS = {
  AWS_OUTPUT_FILES: "OUTPUT FILES",
  AWS_FORMAT_FILES: "FORMAT FILES",
  ROOT_DIRECTORY_PATH,
  STORAGE_PATH,

  INPUT_COMBINE_FILES_PATH: path.join(
    STORAGE_PATH,
    "EXCEL FILE STORAGE SETUP",
    "INPUT COMBINE REPORTS"
  ),
  FILE_FORMATS_PATH: path.join(
    STORAGE_PATH,
    "EXCEL FILE STORAGE SETUP",
    "FILE FORMATS"
  ),
  OUTPUT_FILES_PATH: path.join(
    STORAGE_PATH,
    "EXCEL FILE STORAGE SETUP",
    "OUTPUT GENERATED REPORTS"
  ),
  PLOT_STORAGE_PATH: path.join(
    STORAGE_PATH,
    "IMAGE FILE STORAGE SETUP",
    "PLOT STORAGE SETUP"
  ),
  BLOCKAGE_SNAPS_PATH: path.join(
    STORAGE_PATH,
    "IMAGE FILE STORAGE SETUP",
    "TOWER BLOCKAGE SNAPS"
  ),
  SECTOR_SNAPS_PATH: path.join(
    STORAGE_PATH,
    "IMAGE FILE STORAGE SETUP",
    "TOWER SECTOR SNAPS"
  ),
};

// 4g scft plots format
const _4G_SCFT_PLOTS = {
  SCFT_PLOTS: {
    INPUT_FORMAT: [
      "PCI",
      "ROUTE",
      "RSRP",
      "RSRQ",
      "SINR",
      "IGNORE",
      "EARFCN",
      "CQI",
      "DL",
      "UL",
      "LOG TAG",
    ],
    OUTPUT_FORMAT: [
      "PCI",
      "RSRP",
      "RSRQ",
      "SINR",
      "EARFCN",
      "CQI",
      "DL",
      "UL",
      "LOG TAG",
      "ROUTE",
    ],
    STORAGE_PATH: path.join(PATHS.PLOT_STORAGE_PATH, "4G SCFT PLOTS"),
  },
  VOLTE_PLOTS: {
    INPUT_FORMAT: [
      "PCI",
      "ROUTE",
      "RSRP",
      "RSRQ",
      "SINR",
      "CQI",
      "BLER",
      "IGNORE",
      "EARFCN",
      "SPEECH CODEC",
      "IGNORE",
      "LOG TAG",
    ],
    OUTPUT_FORMAT: [
      "PCI",
      "RSRP",
      "RSRQ",
      "SINR",
      "CQI",
      "BLER",
      "EARFCN",
      "SPEECH CODEC",
      "LOG TAG",
      "ROUTE",
    ],
    STORAGE_PATH: path.join(PATHS.PLOT_STORAGE_PATH, "4G SCFT VOLTE PLOTS"),
  },
};

// 4g cat plots formats
const DRIVE_PLOTS_4G_CAT = [
  "IGNORE",
  "IGNORE",
  "IGNORE",
  "IGNORE",
  "IGNORE",
  "IGNORE",
  "IGNORE",
  "IGNORE",
  "DRIVE",
];
const _4G_CAT_PLOTS = {
  PRE_DRIVE_PLOTS: {
    INPUT_FORMAT: DRIVE_PLOTS_4G_CAT,
    OUTPUT_FORMAT: ["DRIVE"],
    STORAGE_PATH: path.join(PATHS.PLOT_STORAGE_PATH, "4G CAT PRE DRIVE PLOTS"),
  },
  POST_DRIVE_PLOTS: {
    INPUT_FORMAT: DRIVE_PLOTS_4G_CAT,
    OUTPUT_FORMAT: ["DRIVE"],
    STORAGE_PATH: path.join(PATHS.PLOT_STORAGE_PATH, "4G CAT POST DRIVE PLOTS"),
  },
  PRE_LTE_CAT_PLOTS: {
    INPUT_FORMAT: ["PCI", "RSRP", "RSRQ", "SINR", "DL", "UL"],
    OUTPUT_FORMAT: ["PCI", "RSRP", "RSRQ", "SINR", "DL", "UL"],
    STORAGE_PATH: path.join(PATHS.PLOT_STORAGE_PATH, "4G CAT PRE LTE PLOTS"),
  },
  POST_LTE_CAT_PLOTS: {
    INPUT_FORMAT: ["PCI", "RSRP", "RSRQ", "SINR", "DL", "UL"],
    OUTPUT_FORMAT: ["PCI", "RSRP", "RSRQ", "SINR", "DL", "UL"],
    STORAGE_PATH: path.join(PATHS.PLOT_STORAGE_PATH, "4G CAT POST LTE PLOTS"),
  },
  PRE_VOLTE_CAT_PLOTS: {
    INPUT_FORMAT: ["PCI", "RSRP", "RSRQ", "SINR", "MOS"],
    OUTPUT_FORMAT: ["PCI", "RSRP", "RSRQ", "SINR", "MOS"],
    STORAGE_PATH: path.join(PATHS.PLOT_STORAGE_PATH, "4G CAT PRE VOLTE PLOTS"),
  },
  POST_VOLTE_CAT_PLOTS: {
    INPUT_FORMAT: ["PCI", "RSRP", "RSRQ", "SINR", "MOS"],
    OUTPUT_FORMAT: ["PCI", "RSRP", "RSRQ", "SINR", "MOS"],
    STORAGE_PATH: path.join(PATHS.PLOT_STORAGE_PATH, "4G CAT POST VOLTE PLOTS"),
  },
};

const PLOTS_5G = [
  "PRE_SYSTEM_MODE",
  "POST_SYSTEM_MODE",
  "PRE_DL_FREQUENCY",
  "POST_DL_FREQUENCY",
  "PRE_SERVING_CHANNEL",
  "POST_SERVING_CHANNEL",
  "PRE_PCI",
  "POST_PCI",
  "PRE_RSRP",
  "POST_RSRP",
  "PRE_RSRQ",
  "POST_RSRQ",
  "PRE_SINR",
  "POST_SINR",
  "PRE_CQI",
  "POST_CQI",
  "PRE_DL_PDCP",
  "POST_DL_PDCP",
  "PRE_DL_PDSCH",
  "POST_DL_PDSCH",
  "PRE_UL_PDCP",
  "POST_UL_PDCP",
  "PRE_UL_PUSCH",
  "POST_UL_PUSCH",
  "PRE_DL_PRB",
  "POST_DL_PRB",
  "PRE_UL_PRB",
  "POST_UL_PRB",
  "PRE_DL_MCS",
  "POST_DL_MCS",
  "PRE_UL_MCS",
  "POST_UL_MCS",
  "PRE_RANK_INDICATION",
  "POST_RANK_INDICATION",
  "PRE_PUSCH_POWER",
  "POST_PUSCH_POWER",
  "PRE_BEAM_INDEX",
  "POST_BEAM_INDEX",
];
const _5G_CAT_PLOTS = {
  PRE_POST_COMPARISON_PLOTS: {
    INPUT_FORMAT: PLOTS_5G,
    OUTPUT_FORMAT: PLOTS_5G,
    STORAGE_PATH: path.join(
      PATHS.PLOT_STORAGE_PATH,
      "5G CAT PRE POST COMPARISON PLOTS"
    ),
  },
};

// plots format
export const PLOTS_FORMAT: PlotsFormat = {
  _4G: {
    SCFT: _4G_SCFT_PLOTS,
    CAT: _4G_CAT_PLOTS,
  },
  _5G: {
    CAT: _5G_CAT_PLOTS,
  },
};

// state constants
export const STATES_PARAMS: StateParams = {
  HR: {
    _4G: {
      DLUL: {
        L2100: {
          DL: 70,
          UL: 18,
        },
        L850: {
          DL: 20,
          UL: 6.5,
        },
        L2300: {
          DL: 80,
          UL: 20,
        },
        L1800: {
          DL: 80,
          UL: 20,
        },
      },

      BANDS_VALUE: {
        L850: 5,
        L2100: 15,
        L1800: 15,
        L2300: 20,
      },
    },
  },

  HP: {
    _4G: {
      DLUL: {
        L2300: {
          DL: 80,
          UL: 20,
        },
        L1800: {
          DL: 80,
          UL: 20,
        },
        L900: {
          DL: 40,
          UL: 15,
        },
      },

      BANDS_VALUE: {
        L900: 10,
        L1800: 20,
        L2300: 20,
      },
    },
  },
  TECH_LAYER: {
    L850: "FDD",
    L900: "FDD",
    L1800: "FDD",
    L2100: "FDD",
    L2300: "TDD",
  },
};

// customize formats constants
export const FORMATS = (sectors: number): WorkbooksFormats => {
  return {
    "4G_SCFT": {
      workbook_name: "4G SCFT FORMAT.xlsx",
      sheets: [
        {
          sheet_name: "LTE KPI",
          type: "customize",
          ranges: [
            {
              output_start: 1,
              output_end: 4,
              format_start: 1,
              format_end: 4,
              method: "FormaWorksheetColumnsByColumnsRange",
            },
            {
              output_start: 5,
              output_end: 5 + sectors - 1,
              format_start: 5,
              format_end: 5 + sectors - 1,
              method: "FormatWorksheetColumnsByColumn",
            },
            {
              output_start: 5 + sectors,
              output_end: 5 + sectors,
              format_start: 8,
              format_end: 0,
              method: "FormatWorksheetColumnsByColumn",
            },
          ],
        },
        {
          sheet_name: "AUDIT SHEET",
          type: "customize",
          ranges: [
            {
              format_start: 1,
              format_end: 1,
              output_start: 1,
              output_end: 1,
              method: "FormatWorksheetRowsByRowsRange",
            },
            {
              format_start: 2,
              format_end: 0,
              output_start: 2,
              output_end: 2 + sectors - 1,
              method: "FormatWorksheetRowsByRow",
            },
          ],
        },
        {
          sheet_name: "VOLTE KPI",
          type: "customize",
          ranges: [
            {
              format_start: 1,
              format_end: 4,
              output_start: 1,
              output_end: 4,
              method: "FormaWorksheetColumnsByColumnsRange",
            },
            {
              format_start: 5,
              format_end: 0,
              output_start: 5,
              output_end: 5 + sectors - 1,
              method: "FormatWorksheetColumnsByColumn",
            },
          ],
        },
        {
          sheet_name: "GIS",
          type: "customize",
          ranges: [
            {
              format_start: 1,
              format_end: 1,
              output_start: 1,
              output_end: 1,
              method: "FormatWorksheetRowsByRowsRange",
            },
            {
              format_start: 2,
              format_end: 0,
              output_start: 2,
              output_end: 1 + sectors,
              method: "FormatWorksheetRowsByRow",
            },
          ],
        },
        {
          sheet_name: "GIS_Data",
          type: "customize",
          ranges: [
            {
              format_start: 1,
              format_end: 1,
              output_start: 1,
              output_end: 1,
              method: "FormatWorksheetRowsByRowsRange",
            },
            {
              format_start: 2,
              format_end: 0,
              output_start: 2,
              output_end: 6,
              method: "FormatWorksheetRowsByRow",
            },
          ],
        },
      ],
    },
    "4G_CAT": {
      workbook_name: "4G CAT FORMAT.xlsx",
      sheets: [
        {
          sheet_name: "AUDIT SHEET",
          type: "customize",
          ranges: [
            {
              format_start: 1,
              format_end: 1,
              output_start: 1,
              output_end: 1,
              method: "FormatWorksheetRowsByRowsRange",
            },
            {
              format_start: 2,
              format_end: 0,
              output_start: 2,
              output_end: 2 + sectors - 1,
              method: "FormatWorksheetRowsByRow",
            },
          ],
        },
      ],
    },
    "5G_CAT": {
      workbook_name: "5G CAT FORMAT.xlsx",
      sheets: [
        {
          sheet_name: "SITE DATABASE",
          type: "customize",
          ranges: [
            {
              format_start: 1,
              format_end: 2,
              output_start: 1,
              output_end: 2,
              method: "FormatWorksheetRowsByRowsRange",
            },
            {
              format_start: 3,
              format_end: 0,
              output_start: 3,
              output_end: 3 + sectors - 1,
              method: "FormatWorksheetRowsByRow",
            },
          ],
        },
      ],
    },
    // "5G_SCFT_ANTS": {}
  };
};

// snaps constants
export const _4G_SNAPS_FORMAT = {
  SECTOR_COMPONENTS: [
    ["Compass", "compass"],
    ["Electrical Tilt", "electrical_tilts"],
    ["Mechanical Tilt", "mechanical_tilts"],
    ["Azimuth", "azimuths"],
    ["Antenna Height", "antenna_heights"],
  ],
  TOWER_BUILDING: ["Tower", "Tower Height", "Building Height"],
};

export const SITES_DB: Record<Network, Model<ITowerModel>> = {
  // "2G": null,
  // "3G": null,
  "4G": TOWERS_4G,
  "5G": TOWERS_5G,
};
