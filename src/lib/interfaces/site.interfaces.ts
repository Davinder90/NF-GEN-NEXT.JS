import {
  Tech,
  Formats,
  Network,
  FileType,
  TowerType,
  InputFilesFormat,
} from "@type/site.types";

// tower data
interface ITower {
  siteId: string;
  tower_height: number;
  tower_type: TowerType;
  sectors: number;
  latitude: number;
  longitude: number;
  state: string;
  tech: Tech;
}

// snap data
export interface ISnap {
  filename: string;
  destination: string;
  base64Image?: string;
  name?: string;
}

export interface IScftTowerComponentData {
  values: number[];
}

interface ICatTowerComponentData {
  pre_values: number[];
  post_values: number[];
}

// scft file tower component structure
export interface IScftTowerComponent {
  data: IScftTowerComponentData;
  snaps: ISnap[];
}

// cat file tower component structure
export interface ICatTowerComponent {
  data: ICatTowerComponentData;
}

export interface ISectors {
  azimuths: IScftTowerComponent | ICatTowerComponent;
  electrical_tilts: IScftTowerComponent | ICatTowerComponent;
  mechanical_tilts: IScftTowerComponent | ICatTowerComponent;
  antenna_heights: IScftTowerComponent | IScftTowerComponentData;
  compass?: ISnap[];
  pci?: IScftTowerComponentData;
}

interface IBuilding {
  building_height: number;
}

interface IFile {
  single_combine?: ISnap;
  pre_combine?: ISnap;
  post_combine?: ISnap;
}

export interface ITowerBuildingSnaps {
  building_height: ISnap;
  tower: ISnap;
  tower_height: ISnap;
}

export interface DlUlSnaps {
  pre_dl: ISnap;
  post_dl: ISnap;
  pre_ul: ISnap;
  post_ul: ISnap;
}

export interface ISiteReportData {
  network: Network;
  file_type: FileType;
  tower_data: ITower;
  building_data: IBuilding;
  sectors: ISectors;
  combine_report: IFile;
  combine_input_report_format: InputFilesFormat;
  blockage_snaps: ISnap[];
  format: Formats;
  tower_building_snaps: ITowerBuildingSnaps;
  output_file_path?: string;
  dlulSnaps?: DlUlSnaps;
  plots?: ISnap[][];
  clutters?: ISnap[];
}

export interface ICells {
  [key: string]: { value: string | number | undefined; numFmt: boolean };
}

export interface IDLUL {
  DL: number;
  UL: number;
}
