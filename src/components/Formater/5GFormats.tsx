"use client";
import {
  FileType,
  Formats,
  InputFilesFormat,
  InputFilesFormats,
} from "@type/site.types";
import {
  AuditDataContainer,
  AuditSnapsContainer,
  GenerateReport,
  SiteSelector,
} from "./Common";
import { ISectorModel, ITowerModel } from "@interfaces/models.interfaces";
import { useCallback, useEffect, useState } from "react";
import { ISnap } from "@interfaces/site.interfaces";
import {
  CatSectorAuditData,
  DlULSnaps,
  InputCombineReport,
  ScftSectorsAuditSnaps,
  TowerAndBuildingSnaps,
  auditSnapsContext,
  cluttersSnaps,
  createSnapsArray,
} from "./4GFormats";
import { FaMinus, FaPlus } from "react-icons/fa";

const CAT5G = ({
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

  const [fileFormat, setFileFormat] = useState<InputFilesFormat>(
    InputFilesFormats[0]
  );
  const [dlulSnaps, setDlUlSanps] = useState<DlULSnaps>({
    pre_dl: {
      filename: "",
      destination: "",
    },
    post_dl: {
      filename: "",
      destination: "",
    },
    pre_ul: {
      filename: "",
      destination: "",
    },
    post_ul: {
      filename: "",
      destination: "",
    },
  });
  // input report
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
          network="5G"
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
            fileFormat,
            setFileFormat,
            file_type,
            network: "5G",
            dlulSnaps,
            setDlUlSanps,
          }}
        >
          <AuditSnapsContainer setState={setState} SiteId={Site?.SiteId} />
        </auditSnapsContext.Provider>
      );
    case "GENERATE REPORT":
      return (
        <auditSnapsContext.Provider
          value={{
            siteData: Site,
            sectorCatAuditData: auditData,
            network: "5G",
            file_type,
            format,
            inputCombineReport,
            fileFormat,
            isReady,
            dlulSnaps,
            outputReport,
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

const SCFTANTS5G = ({
  format,
  file_type,
}: {
  format: Formats;
  file_type: FileType;
}) => {
  const [state, setState] = useState("AUDIT SNAPS");
  const [sectors, setSectors] = useState(1);

  const [auditSectorsSnaps, setSectorsAuditSnaps] =
    useState<ScftSectorsAuditSnaps>({
      compass: createSnapsArray(1),
      electrical_tilts: createSnapsArray(1),
      mechanical_tilts: createSnapsArray(1),
      antenna_heights: createSnapsArray(1),
      azimuths: createSnapsArray(1),
    });

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

  const [cluttersSnaps, setCluttersSnaps] = useState<cluttersSnaps>(
    createSnapsArray(1)
  );
  const [fileFormat, setFileFormat] = useState<InputFilesFormat>(
    InputFilesFormats[0]
  );

  // input report
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
  const [isReady, setIsReady] = useState(false);

  const SectorsCounter = () => {
    const decrement = () => {
      if (sectors > 1) {
        setSectors(sectors - 1);
        setSectorsAuditSnaps((prev) => ({
          compass: prev.compass.slice(0, -1),
          electrical_tilts: prev.electrical_tilts.slice(0, -1),
          mechanical_tilts: prev.mechanical_tilts.slice(0, -1),
          antenna_heights: prev.antenna_heights.slice(0, -1),
          azimuths: prev.azimuths.slice(0, -1),
        }));
        setCluttersSnaps((prev) => prev.slice(0, -1));
      }
    };

    const increment = () => {
      setSectors(sectors + 1);
      const newSnap = { filename: "", destination: "" };
      setSectorsAuditSnaps((prev) => ({
        compass: [...prev.compass, newSnap],
        electrical_tilts: [...prev.electrical_tilts, newSnap],
        mechanical_tilts: [...prev.mechanical_tilts, newSnap],
        antenna_heights: [...prev.antenna_heights, newSnap],
        azimuths: [...prev.azimuths, newSnap],
      }));
      setCluttersSnaps((prev) => [...prev, newSnap]);
    };

    return (
      <div className="flex flex-col items-center justify-center gap-2 py-4">
        <label className="text-base font-semibold text-gray-700 dark:text-white">
          Number of Sectors
        </label>
        <div className="flex items-center gap-4 rounded-xl px-4 py-2 bg-white dark:bg-black/80 border border-gray-300 dark:border-white/20 shadow-md">
          <button
            onClick={decrement}
            disabled={sectors === 1}
            title="Remove Sector"
            className={`flex items-center gap-1 px-3 py-2 rounded-full transition text-sm font-medium ${
              sectors === 1
                ? "bg-gray-200 dark:bg-gray-700 cursor-not-allowed text-gray-400"
                : "bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 text-red-700 dark:text-white"
            }`}
          >
            <FaMinus className="text-sm" />
            Remove
          </button>

          <span className="text-lg font-semibold text-black dark:text-white">
            {sectors}
          </span>

          <button
            onClick={increment}
            title="Add Sector"
            className="flex items-center gap-1 px-3 py-2 rounded-full bg-green-100 dark:bg-green-800 hover:bg-green-200 dark:hover:bg-green-700 text-green-700 dark:text-white text-sm font-medium transition"
          >
            <FaPlus className="text-sm" />
            Add
          </button>
        </div>
      </div>
    );
  };

  const Snaps = () => {
    return (
      <div className="w-full">
        <SectorsCounter />
        <auditSnapsContext.Provider
          value={{
            auditSectorsSnaps,
            fileFormat,
            file_type,
            towerAndBuildingSnaps,
            network: "5G",
            clutters: cluttersSnaps,
            setSectorsAuditSnaps,
            setFileFormat,
            setTowerAndBuildingSnaps,
            setCluttersSnaps,
          }}
        >
          <AuditSnapsContainer setState={setState} SiteId={"5Gxxxx"} />
        </auditSnapsContext.Provider>
      </div>
    );
  };

  switch (state) {
    case "AUDIT SNAPS":
      return <Snaps />;
    case "GENERATE REPORT":
      return (
        <auditSnapsContext.Provider
          value={{
            network: "5G",
            file_type,
            format,
            auditSectorsSnaps,
            inputCombineReport,
            fileFormat,
            isReady,
            outputReport,
            towerAndBuildingSnaps,
            clutters: cluttersSnaps,
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

const Formats5G = ({
  format,
  file_type,
}: {
  file_type: FileType;
  format: Formats;
}) => {
  switch (format) {
    case "5G_CAT":
      return <CAT5G format={format} file_type={file_type} />;
    case "5G_SCFT_ANTS":
      return <SCFTANTS5G format={format} file_type={file_type} />;
  }
};

export default Formats5G;
