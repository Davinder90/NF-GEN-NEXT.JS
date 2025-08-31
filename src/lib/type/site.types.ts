import formidable, { File } from "formidable";
import { IDLUL, ISnap } from "@interfaces/site.interfaces";
import { IFormat } from "@interfaces/file.interfaces";

export const InputFilesFormats = ["SINGLE COMBINE FILE", "PRE, POST FILES"];
export type InputFilesFormat = (typeof InputFilesFormats)[number];

export const States = ["HR", "HP"];
export type State = (typeof States)[number];

export const Networks = ["4G", "5G"]; // "3G", "2G"
export type Network = (typeof Networks)[number];

export const Formats = ["4G_SCFT", "4G_CAT", "5G_CAT", "5G_SCFT_ANTS"] as const;
export const FileOperationFormats = ["4G_SCFT", "4G_CAT", "5G_CAT"] as const;
export type FileOperationFormats = (typeof FileOperationFormats)[number];
export type Formats = (typeof Formats)[number];

export const Techs = ["L850", "L900", "L1800", "L2100", "L2300"];
export type Tech = (typeof Techs)[number];

export const TowerTypes = ["NA", "GBT", "RTP", "RTT", "GBM", "COW"];
export type TowerType = (typeof TowerTypes)[number];

export const FileTypes = ["SCFT", "CAT", "SCFT ANTS"] as const;
export type FileType = (typeof FileTypes)[number];
export type SectorComponentsKey =
  | "azimuths"
  | "electrical_tilts"
  | "mechanical_tilts"
  | "antenna_heights"
  | "compass";

export type TowerBuildingSnapKey = "building_height" | "tower" | "tower_height";
export type TechLayervalue = Record<Tech, "FDD" | "TDD">;

export type DLULvalue = Partial<Record<Tech, IDLUL>>;
export type Bandvalue = Partial<Record<Tech, number>>;
export type WorkbooksFormats = Record<FileOperationFormats, IFormat>;

// file upload
export type MultiUploadResult = {
  fields: formidable.Fields;
  files: { [key: string]: ISnap[] };
};

export type SingleUploadResult = {
  fields: formidable.Fields;
  file: File;
  destination: string;
  filename: string;
};

// states
export type _4G = {
  DLUL: DLULvalue;
  BANDS_VALUE: Bandvalue;
};

export type StateParams = {
  HR: {
    _4G: _4G;
  };
  HP: {
    _4G: _4G;
  };
  TECH_LAYER: TechLayervalue;
};

// plots
export type PLOT = {
  INPUT_FORMAT: string[];
  OUTPUT_FORMAT: string[];
  STORAGE_PATH: string;
};

export type _4G_SCFT_PLOTS = {
  SCFT_PLOTS: PLOT;
  VOLTE_PLOTS: PLOT;
};

export type _4G_CAT_PLOTS = {
  PRE_DRIVE_PLOTS: PLOT;
  POST_DRIVE_PLOTS: PLOT;
  PRE_LTE_CAT_PLOTS: PLOT;
  POST_LTE_CAT_PLOTS: PLOT;
  PRE_VOLTE_CAT_PLOTS: PLOT;
  POST_VOLTE_CAT_PLOTS: PLOT;
};

export type _5G_CAT_PLOTS = {
  PRE_POST_COMPARISON_PLOTS: PLOT;
};

export type _4G_PLOTS = {
  SCFT: _4G_SCFT_PLOTS;
  CAT: _4G_CAT_PLOTS;
};

export type _5G_PLOTS = {
  CAT: _5G_CAT_PLOTS;
};

export type PlotsFormat = {
  _4G: _4G_PLOTS;
  _5G: _5G_PLOTS;
};

export type FileFormat = {
  name: Formats;
};

export type FilesFormats = {
  name: string;
  formats: FileFormat[];
  network: Network;
  file_type: FileType;
  color: string;
};
