"use client";
import {
  FileType,
  Formats,
  InputFilesFormat,
  InputFilesFormats,
  Network,
} from "@type/site.types";
import {
  AuditDataContainer,
  AuditSnapsContainer,
  GenerateReport,
  SiteSelector,
} from "./Common";
import { ISectorModel, ITowerModel } from "@interfaces/models.interfaces";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import { ISnap } from "@interfaces/site.interfaces";
import { createContext } from "react";

export type ScftSectorsSnapsFields =
  | "azimuths"
  | "mechanical_tilts"
  | "electrical_tilts"
  | "compass"
  | "antenna_heights";

export type DlUlSnapsFields = "pre_dl" | "post_dl" | "pre_ul" | "post_ul";

export type TowerAndBuildingSnapsFields =
  | "tower"
  | "building_height"
  | "tower_height";

export type ScftSectorDataFields = "mechanical_tilts" | "electrical_tilts";
export type CatSectorDataFields =
  | "pre_mechanical_tilts"
  | "post_mechanical_tilts"
  | "pre_electrical_tilts"
  | "post_electrical_tilts"
  | "pre_azimuths";
export type InputCombineReportFields =
  | "pre_combine"
  | "post_combine"
  | "single_combine";
export type cluttersSnaps = ISnap[];
export type ScftSectorsAuditSnaps = Record<ScftSectorsSnapsFields, ISnap[]>;
export type ScftSectorAuditData = Record<ScftSectorDataFields, number[]>;
export type CatSectorAuditData = Record<CatSectorDataFields, number[]>;
export type BlockageSnaps = ISnap[];
export type TowerAndBuildingSnaps = Record<TowerAndBuildingSnapsFields, ISnap>;
export type DlULSnaps = Record<DlUlSnapsFields, ISnap>;
export type InputCombineReport = Record<InputCombineReportFields, ISnap>;
export interface AuditSnapsContextType {
  auditSectorsSnaps?: ScftSectorsAuditSnaps;
  blockageSnaps?: BlockageSnaps;
  towerAndBuildingSnaps?: TowerAndBuildingSnaps;
  siteData?: ITowerModel;
  sectorScftAuditData?: ScftSectorAuditData;
  sectorCatAuditData?: CatSectorAuditData;
  format?: Formats;
  network?: Network;
  file_type?: FileType;
  inputCombineReport?: InputCombineReport;
  fileFormat: InputFilesFormat;
  isReady?: boolean;
  dlulSnaps?: DlULSnaps;
  outputReport?: ISnap;
  clutters?: cluttersSnaps;
  setSectorsAuditSnaps?: React.Dispatch<
    React.SetStateAction<ScftSectorsAuditSnaps>
  >;
  setBlockageSnaps?: React.Dispatch<React.SetStateAction<BlockageSnaps>>;
  setTowerAndBuildingSnaps?: React.Dispatch<
    React.SetStateAction<TowerAndBuildingSnaps>
  >;
  setInputCombineReport?: React.Dispatch<
    React.SetStateAction<InputCombineReport>
  >;
  setCluttersSnaps?: React.Dispatch<React.SetStateAction<cluttersSnaps>>;
  setIsReady?: React.Dispatch<React.SetStateAction<boolean>>;
  setFileFormat: React.Dispatch<React.SetStateAction<InputFilesFormat>>;
  setDlUlSanps?: React.Dispatch<React.SetStateAction<DlULSnaps>>;
  setOutputReport?: React.Dispatch<SetStateAction<ISnap>>;
}

export const auditSnapsContext = createContext<
  AuditSnapsContextType | undefined
>(undefined);

// snap fields in sector component to number sectors
export const createSnapsArray = (count: number) => {
  return Array.from({ length: count }, () => ({
    filename: "",
    destination: "",
  }));
};

const SCFT4G = ({
  format,
  file_type,
}: {
  file_type: FileType;
  format: Formats;
}) => {
  // state manager
  const [state, setState] = useState("SITE SELECTION");
  // site data
  const [Site, setSite] = useState<ITowerModel>({
    SiteId: "",
    Latitude: 0,
    Longitude: 0,
    Sectors: [],
  });
  // number of sectors
  const sectorCount = Site?.["Sectors"]?.length || 0;
  const [sectorAuditData, setSectorAuditData] = useState<ScftSectorAuditData>({
    mechanical_tilts: [],
    electrical_tilts: [],
  });
  // audit sector snaps
  const [auditSectorsSnaps, setSectorsAuditSnaps] =
    useState<ScftSectorsAuditSnaps>({
      compass: [],
      electrical_tilts: [],
      mechanical_tilts: [],
      antenna_heights: [],
      azimuths: [],
    });
  // audit blockage snaps
  const [blockageSnaps, setBlockageSnaps] = useState<BlockageSnaps>([]);
  // audit tower and building snaps
  const [towerAndBuildingSnaps, setTowerAndBuildingSnaps] =
    useState<TowerAndBuildingSnaps>({
      tower: {
        filename: "",
        destination: "",
      },
      tower_height: {
        filename: "",
        destination: "",
      },
      building_height: {
        filename: "",
        destination: "",
      },
    });
  const [fileFormat, setFileFormat] = useState<InputFilesFormat>(
    InputFilesFormats[0]
  );
  // combine files
  const [inputCombineReport, setInputCombineReport] =
    useState<InputCombineReport>({
      single_combine: { filename: "", destination: "" },
      pre_combine: { filename: "", destination: "" },
      post_combine: { filename: "", destination: "" },
    });
  // output file
  const [outputReport, setOutputReport] = useState<ISnap>({
    filename: "",
    destination: "",
  });
  useEffect(() => {
    setSectorsAuditSnaps({
      compass: createSnapsArray(sectorCount),
      electrical_tilts: createSnapsArray(sectorCount),
      mechanical_tilts: createSnapsArray(sectorCount),
      antenna_heights: createSnapsArray(sectorCount),
      azimuths: createSnapsArray(sectorCount),
    });
  }, [sectorCount]);

  const [isReady, setIsReady] = useState(false);
  switch (state) {
    case "SITE SELECTION":
      return (
        <SiteSelector
          network="4G"
          format={format}
          Site={Site}
          setSite={setSite}
          setState={setState}
        />
      );
    case "AUDIT DATA":
      return (
        <AuditDataContainer
          scftAuditData={sectorAuditData}
          setScftAuditData={setSectorAuditData}
          sectors={Site?.Sectors as ISectorModel[]}
          file_type={file_type}
          SiteId={Site?.SiteId as string}
          setState={setState}
        />
      );
    case "AUDIT SNAPS":
      return (
        <auditSnapsContext.Provider
          value={{
            auditSectorsSnaps,
            blockageSnaps,
            towerAndBuildingSnaps,
            fileFormat,
            file_type,
            network: "4G",
            setBlockageSnaps,
            setSectorsAuditSnaps,
            setTowerAndBuildingSnaps,
            setFileFormat,
          }}
        >
          <AuditSnapsContainer setState={setState} SiteId={Site?.SiteId} />
        </auditSnapsContext.Provider>
      );
    case "GENERATE REPORT":
      return (
        <auditSnapsContext.Provider
          value={{
            auditSectorsSnaps,
            blockageSnaps,
            towerAndBuildingSnaps,
            siteData: Site,
            sectorScftAuditData: sectorAuditData,
            network: "4G",
            file_type,
            format,
            inputCombineReport,
            fileFormat,
            isReady,
            outputReport,
            setBlockageSnaps,
            setSectorsAuditSnaps,
            setTowerAndBuildingSnaps,
            setFileFormat,
            setInputCombineReport,
            setIsReady,
            setOutputReport,
          }}
        >
          <GenerateReport setState={setState} />;
        </auditSnapsContext.Provider>
      );
  }
};

const CAT4G = ({
  format,
  file_type,
}: {
  file_type: FileType;
  format: Formats;
}) => {
  const [state, setState] = useState("SITE SELECTION");
  const [Site, setSite] = useState<ITowerModel>({
    SiteId: "",
    Latitude: 0,
    Longitude: 0,
    Sectors: [],
  });

  const [auditData, setAuditData] = useState<CatSectorAuditData>({
    pre_electrical_tilts: [],
    post_electrical_tilts: [],
    pre_mechanical_tilts: [],
    post_mechanical_tilts: [],
    pre_azimuths: [],
  });

  const [blockageSnaps, setBlockageSnaps] = useState<BlockageSnaps>([]);

  const [fileFormat, setFileFormat] = useState<InputFilesFormat>(
    InputFilesFormats[0]
  );
  const [inputCombineReport, setInputCombineReport] =
    useState<InputCombineReport>({
      single_combine: { filename: "", destination: "" },
      pre_combine: { filename: "", destination: "" },
      post_combine: { filename: "", destination: "" },
    });
  // output file
  const [outputReport, setOutputReport] = useState<ISnap>({
    filename: "",
    destination: "",
  });
  const preData = useCallback(() => {
    const azimuths: number[] =
      Site.Sectors?.map((sector) => sector.Azimuth) || [];
    setAuditData({
      pre_electrical_tilts: [],
      post_electrical_tilts: [],
      pre_mechanical_tilts: [],
      post_mechanical_tilts: [],
      pre_azimuths: azimuths,
    });
  }, [Site.Sectors]);

  useEffect(() => {
    preData();
  }, [preData, Site]);

  const [isReady, setIsReady] = useState(false);
  switch (state) {
    case "SITE SELECTION":
      return (
        <SiteSelector
          network="4G"
          format={format}
          Site={Site}
          setSite={setSite}
          setState={setState}
        />
      );
    case "AUDIT DATA":
      return (
        <AuditDataContainer
          catAuditData={auditData}
          setCatAuditData={setAuditData}
          file_type={file_type}
          sectors={Site?.Sectors as ISectorModel[]}
          SiteId={Site?.SiteId as string}
          setState={setState}
        />
      );
    case "AUDIT SNAPS":
      return (
        <auditSnapsContext.Provider
          value={{
            blockageSnaps,
            setBlockageSnaps,
            fileFormat,
            setFileFormat,
            file_type,
            network: "4G",
          }}
        >
          <AuditSnapsContainer setState={setState} SiteId={Site?.SiteId} />
        </auditSnapsContext.Provider>
      );
    case "GENERATE REPORT":
      return (
        <auditSnapsContext.Provider
          value={{
            blockageSnaps,
            siteData: Site,
            sectorCatAuditData: auditData,
            network: "4G",
            file_type,
            format,
            inputCombineReport,
            fileFormat,
            isReady,
            outputReport,
            setBlockageSnaps,
            setFileFormat,
            setInputCombineReport,
            setIsReady,
            setOutputReport,
          }}
        >
          <GenerateReport setState={setState} />;
        </auditSnapsContext.Provider>
      );
  }
};

const Formats4G = ({
  format,
  file_type,
}: {
  file_type: FileType;
  format: Formats;
}) => {
  switch (format) {
    case "4G_SCFT":
      return <SCFT4G format={format} file_type={file_type} />;
    case "4G_CAT":
      return <CAT4G format={format} file_type={file_type} />;
  }
};

export default Formats4G;
