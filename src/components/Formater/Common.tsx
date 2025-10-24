"use client";
import { handleGetSite, handleSitesNames } from "@/src/requests/sites.requests";
import {
  FileType,
  Formats,
  InputFilesFormats,
  Network,
  States,
  Tech,
  Techs,
  TowerType,
} from "@type/site.types";
import React, {
  ChangeEvent,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { PyramidLoader } from "../Loader/Loader";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ISectorModel, ITowerModel } from "@interfaces/models.interfaces";
import { TowerAndSectorData } from "@/src/components/Common/TowerAndSector";
import {
  auditSnapsContext,
  BlockageSnaps,
  CatSectorAuditData,
  CatSectorDataFields,
  cluttersSnaps,
  DlULSnaps,
  DlUlSnapsFields,
  InputCombineReport,
  InputCombineReportFields,
  ScftSectorAuditData,
  ScftSectorDataFields,
  ScftSectorsAuditSnaps,
  ScftSectorsSnapsFields,
  TowerAndBuildingSnaps,
  TowerAndBuildingSnapsFields,
} from "./4GFormats";
import { InputContainer, SelectContainer } from "../UpsertSite/UpsertSite";
import {
  ICatTowerComponent,
  IScftTowerComponent,
  IScftTowerComponentData,
  ISectors,
  ISiteReportData,
  ISnap,
} from "@interfaces/site.interfaces";
import Image from "next/image";
import { IoImageOutline } from "react-icons/io5";
import {
  handleDeleteFile,
  handleDeleteFiles,
  handleDownloadReport,
  handleGenerateReport,
  handleUploadFile,
  handleUploadImage,
} from "@/src/requests/files.requests";
import { TbHttpDelete } from "react-icons/tb";
import { AiFillFileExcel, AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdCloudDownload } from "react-icons/md";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux-store/store";

// prev and next buttons
export const PrevAndNextButtons = ({
  handlePrevButton,
}: {
  handlePrevButton: () => void;
}) => {
  return (
    <div className="flex flex-col gap-4 pt-10 sm:flex-row sm:justify-between sm:items-center">
      <button
        type="button"
        onClick={handlePrevButton}
        className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-100 dark:bg-white text-black hover:bg-gray-200 transition transform hover:scale-105 shadow-lg cursor-pointer"
      >
        Prev
      </button>
      <button
        type="submit"
        className="w-full sm:w-auto px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition transform hover:scale-105 shadow-xl cursor-pointer"
      >
        Next
      </button>
    </div>
  );
};

// use context for audit snaps
export function useAuditSnaps() {
  const context = useContext(auditSnapsContext);
  if (!context) {
    throw new Error(
      "useAuditSnaps must be used within auditSnapsContext.Provider"
    );
  }
  return context;
}

// site selection container
export const SiteSelectorInputProps = ({
  Sites,
  Site,
  setSite,
}: {
  Sites: { SiteId: string }[];
  Site: string;
  setSite: (val: string) => void;
}) => {
  // site change function
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSite(event.target.value.toUpperCase());
  };

  return (
    <div className="relative">
      <motion.input
        whileFocus={{
          scale: 1.03,
          boxShadow: "0 0 0 3px rgba(99,102,241,0.5)",
        }}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300 }}
        type="text"
        name="site"
        id="site"
        list="sites"
        placeholder="Enter site ID"
        value={Site}
        onChange={handleChange}
        className="
          w-full
          px-3 py-2
          border border-gray-300 dark:border-gray-600
          rounded-md
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          shadow-sm
          focus:outline-none
          transition duration-200
          text-sm
        "
        autoComplete="off"
        spellCheck={false}
      />

      <datalist id="sites">
        {Sites.map((site, i) => (
          <option key={i} value={site.SiteId} />
        ))}
      </datalist>
    </div>
  );
};

// search and repersent the site data
export const SiteSelector = ({
  network,
  format,
  Site,
  setSite,
  setState,
}: {
  network: Network;
  format: Formats;
  Site: ITowerModel;
  setSite: (val: ITowerModel) => void;
  setState: (val: string) => void;
}) => {
  const [Sites, setSites] = useState<{ SiteId: string }[]>([]);
  const [loader, setLoader] = useState(true);
  const [SiteName, setSiteName] = useState(Site?.SiteId);
  const [loading, setLoading] = useState(false);

  // next button
  const handleNextButton = () => {
    if (!Site["SiteId"])
      return toast.error("Please select a Site ID before proceeding.");
    setState("AUDIT DATA");
  };

  // fetch site
  const handleSiteData = async () => {
    setLoading(true);
    if (!SiteName) {
      setLoading(false);
      return toast.error("Site ID is missing");
    }
    const {
      result: { site },
    } = await handleGetSite(network, SiteName);
    setLoading(false);
    if (!site) return toast.error(`${SiteName} is not Found`);
    setSite(site);
  };

  // fetch data
  const handleFetchData = useCallback(async () => {
    const {
      result: { sites },
    } = await handleSitesNames(network);
    setSites(sites);
    setLoader(false);
  }, [network]);

  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  if (loader) return <PyramidLoader />;
  return (
    <div className="w-full min-h-screen bg-gray-100 dark:bg-black px-4 py-6">
      <div className="flex justify-between items-center mb-2">
        <h1
          tabIndex={0}
          className="text-sm font-light italic text-gray-700 dark:text-gray-300 mb-2"
        >
          Site ID Format:{" "}
          <span className="not-italic font-medium text-indigo-600 dark:text-indigo-400">
            {format}
          </span>
        </h1>
        <button
          className="px-4 py-0.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition cursor-pointer"
          onClick={handleNextButton}
        >
          Next
        </button>
      </div>
      <motion.div
        className="w-full px-4 py-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="flex flex-col gap-4 border border-gray-300 dark:border-gray-700 shadow-sm rounded-lg p-6 bg-white dark:bg-[#1a1a1a] max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
            Select Site
          </p>

          <div className="flex items-center gap-4 w-full">
            <div className="flex-1">
              <SiteSelectorInputProps
                Sites={Sites}
                Site={SiteName}
                setSite={setSiteName}
              />
            </div>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.08 }}
              whileTap={{ scale: loading ? 1 : 0.96 }}
              transition={{ type: "spring", stiffness: 250 }}
              onClick={handleSiteData}
              disabled={loading}
              className={`flex items-center justify-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md text-sm font-semibold shadow hover:shadow-lg focus:outline-none transition-all duration-300 cursor-pointer
    ${loading ? "cursor-not-allowed opacity-70" : ""}
  `}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </motion.button>
          </div>
        </motion.div>

        {!Site?.SiteId ? (
          <div
            className={`flex items-center justify-center h-40 rounded-md border border-dashed border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-900  text-gray-500   dark:text-gray-400 text-center  px-4
                 py-6 max-w-4xl mx-auto select-none  font-medium  text-sm  mt-5`}
          >
            Please select a site ID and click{" "}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              Search
            </span>{" "}
            to view site.
          </div>
        ) : (
          <TowerAndSectorData
            siteId={Site["SiteId"]}
            Site={Site}
            network={network}
          />
        )}
      </motion.div>
    </div>
  );
};

// audit data
export const AuditDataContainer = ({
  scftAuditData,
  setScftAuditData,
  catAuditData,
  setCatAuditData,
  sectors,
  SiteId,
  file_type,
  setState,
}: {
  scftAuditData?: ScftSectorAuditData;
  setScftAuditData?: (val: ScftSectorAuditData) => void;
  catAuditData?: CatSectorAuditData;
  setCatAuditData?: (val: CatSectorAuditData) => void;
  sectors: ISectorModel[];
  SiteId: string;
  file_type: FileType;
  setState: (val: string) => void;
}) => {
  const FormFields =
    file_type == "SCFT"
      ? Object.keys(scftAuditData as ScftSectorAuditData)
      : Object.keys(catAuditData as CatSectorAuditData);
  // prev button
  const handlePrevButton = () => {
    setState("SITE SELECTION");
  };
  // next button
  const handleNextButton = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const mechanical_tilts = [];
    const electrical_tilts = [];
    const post_mechanical_tilts = [];
    const post_electrical_tilts = [];
    const pre_azimuths = [];

    for (const [key, value] of Object.entries(data)) {
      if (Number(value) != 0 && !Number(value))
        return toast.error(
          `${key.split("-")[0].split("_").join(" ").toUpperCase()} ${
            key.split("-")[1]
          } must be number`
        );
      const KEY = key.split("-")[0].toUpperCase();
      if (KEY == "ELECTRICAL_TILTS" || KEY == "PRE_ELECTRICAL_TILTS")
        electrical_tilts.push(Number(value));
      if (KEY == "MECHANICAL_TILTS" || KEY == "PRE_MECHANICAL_TILTS")
        mechanical_tilts.push(Number(value));
      if (KEY == "POST_ELECTRICAL_TILTS")
        post_electrical_tilts.push(Number(value));
      if (KEY == "POST_MECHANICAL_TILTS")
        post_mechanical_tilts.push(Number(value));
      if (KEY == "PRE_AZIMUTHS") pre_azimuths.push(Number(value));
    }
    if (file_type == "SCFT") {
      (setScftAuditData as React.Dispatch<SetStateAction<ScftSectorAuditData>>)(
        { mechanical_tilts, electrical_tilts }
      );
    } else {
      (setCatAuditData as React.Dispatch<SetStateAction<CatSectorAuditData>>)({
        pre_mechanical_tilts: mechanical_tilts,
        post_mechanical_tilts,
        pre_electrical_tilts: electrical_tilts,
        post_electrical_tilts,
        pre_azimuths,
      });
    }
    setState("AUDIT SNAPS");
  };
  return (
    <form
      onSubmit={handleNextButton}
      className="w-full max-w-4xl mx-auto p-6 bg-gray-100 dark:bg-[#111] rounded-xl shadow-md space-y-6"
    >
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 italic">
        Audit Data for Site:{" "}
        <span className="text-indigo-600 dark:text-indigo-400">{SiteId}</span>
      </h1>
      {FormFields.map((Field, index) => {
        return (
          <div key={index}>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              {Field.split("_").join(" ").toUpperCase()}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg border dark:border-white/30 border-black/20 shadow-md bg-white dark:bg-[#1a1a1a]">
              {sectors.map((_, index) => {
                const value =
                  file_type == "SCFT"
                    ? (scftAuditData as ScftSectorAuditData)?.[
                        Field as ScftSectorDataFields
                      ]?.[index]
                    : (catAuditData as CatSectorAuditData)?.[
                        Field as CatSectorDataFields
                      ]?.[index];
                const char = String.fromCharCode(65 + index);
                return (
                  <InputContainer
                    key={index}
                    name={`${Field}-${char}`}
                    placeHolder={`Enter ${Field} for ${SiteId} sector ${char}`}
                    value={value ? value : 2}
                    caption="required"
                    type="text"
                  />
                );
              })}
            </div>
          </div>
        );
      })}
      <PrevAndNextButtons handlePrevButton={handlePrevButton} />
    </form>
  );
};

const SnapContainer = ({
  labelName,
  multiple,
  value,
  index,
  Field,
}: {
  multiple: boolean;
  labelName: string;
  value: ISnap;
  index: number;
  Field:
    | ScftSectorsSnapsFields
    | TowerAndBuildingSnapsFields
    | DlUlSnapsFields
    | null;
}) => {
  const {
    towerAndBuildingSnaps,
    blockageSnaps,
    auditSectorsSnaps,
    clutters,
    setSectorsAuditSnaps,
    setBlockageSnaps,
    setTowerAndBuildingSnaps,
    setDlUlSanps,
    setCluttersSnaps,
  } = useAuditSnaps();
  const [disable, setDisable] = useState(false);
  const imageType = multiple ? "image/*" : ".png, .jpg, .jpeg, .webp";
  const username = useSelector((state: RootState) => state.user.name) as string;

  // delete button
  const handleDeleteImage = async (index: number, snap: ISnap) => {
    setDisable(true);
    const loadingToast = toast.loading("Deleting...");
    // blockage
    if (multiple) {
      await handleDeleteFiles(blockageSnaps as BlockageSnaps);
      toast.dismiss(loadingToast);
      setDisable(false);
      return (
        setBlockageSnaps as React.Dispatch<React.SetStateAction<BlockageSnaps>>
      )([]);
    }
    // api request
    const { success } = await handleDeleteFile(snap.destination);
    toast.dismiss(loadingToast);
    setDisable(false);
    if (!success) return;
    // clutters
    if (Field === null && Array.isArray(clutters)) {
      return (
        setCluttersSnaps as React.Dispatch<React.SetStateAction<ISnap[]>>
      )((prev) =>
        prev.map((prev, i) => {
          if (index === i)
            return {
              filename: "",
              destination: "",
            };
          return prev;
        })
      );
    }

    // Guard clause: if Field is null but not clutters, exit early
    if (Field === null) return;

    // sectors snaps
    if (
      (auditSectorsSnaps as ScftSectorsAuditSnaps)?.[
        Field as ScftSectorsSnapsFields
      ]
    ) {
      return (
        setSectorsAuditSnaps as React.Dispatch<
          React.SetStateAction<ScftSectorsAuditSnaps>
        >
      )((prevSnaps: ScftSectorsAuditSnaps) => {
        const field = Field as ScftSectorsSnapsFields;
        return {
          ...prevSnaps,
          [field]: (prevSnaps as ScftSectorsAuditSnaps)[field].map(
            (prev, i) => {
              if (index === i)
                return {
                  filename: "",
                  destination: "",
                };
              return prev;
            }
          ),
        };
      });
    }
    // tower and building snaps
    if (
      (towerAndBuildingSnaps as TowerAndBuildingSnaps)?.[
        Field as TowerAndBuildingSnapsFields
      ]
    ) {
      return (
        setTowerAndBuildingSnaps as React.Dispatch<
          React.SetStateAction<TowerAndBuildingSnaps>
        >
      )((prevSnaps: TowerAndBuildingSnaps) => {
        const field = Field as TowerAndBuildingSnapsFields;
        return {
          ...prevSnaps,
          [field]: {
            filename: "",
            destination: "",
          },
        };
      });
    }
    // dl ul snaps
    return (setDlUlSanps as React.Dispatch<React.SetStateAction<DlULSnaps>>)(
      (PrevSnaps: DlULSnaps) => {
        const field = Field as DlUlSnapsFields;
        return {
          ...PrevSnaps,
          [field]: {
            filename: "",
            destination: "",
          },
        };
      }
    );
  };

  // upload image
  const handleImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const formData = new FormData();
    setDisable(true);
    const loadingToast = toast.loading("Uploading...");
    if (multiple) {
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });
    } else {
      formData.append("file", files[0]);
    }
    if (multiple && (blockageSnaps as BlockageSnaps).length)
      await handleDeleteFiles(blockageSnaps as BlockageSnaps);
    // api requerst result
    const {
      success,
      result: { files: data },
      message,
    } = await handleUploadImage(
      formData,
      labelName,
      multiple,
      value.destination,
      username
    );
    toast.dismiss(loadingToast);
    setDisable(false);
    if (!success) return toast.error(message);
    toast.success(message);

    // clutters
    if (Field === null && Array.isArray(clutters)) {
      return (
        setCluttersSnaps as React.Dispatch<React.SetStateAction<ISnap[]>>
      )((prev) => prev.map((snap, i) => (i === index ? data[0] : snap)));
    }

    // blockage snaps
    if (multiple) {
      return (
        setBlockageSnaps as React.Dispatch<React.SetStateAction<BlockageSnaps>>
      )(data);
    }

    // Guard clause: if Field is null but not clutters, exit early
    if (Field === null) return;

    // sectors snaps
    if (
      (auditSectorsSnaps as ScftSectorsAuditSnaps)?.[
        Field as ScftSectorsSnapsFields
      ]
    ) {
      return (
        setSectorsAuditSnaps as React.Dispatch<
          React.SetStateAction<ScftSectorsAuditSnaps>
        >
      )((prevSnaps: ScftSectorsAuditSnaps) => {
        const field = Field as ScftSectorsSnapsFields;
        return {
          ...prevSnaps,
          [field]: prevSnaps[field].map((snap, i) =>
            i === index ? data[0] : snap
          ),
        };
      });
    }
    // tower and building snaps
    if (
      (towerAndBuildingSnaps as TowerAndBuildingSnaps)?.[
        Field as TowerAndBuildingSnapsFields
      ]
    ) {
      return (
        setTowerAndBuildingSnaps as React.Dispatch<
          React.SetStateAction<TowerAndBuildingSnaps>
        >
      )((PrevSnaps: TowerAndBuildingSnaps) => {
        const field = Field as TowerAndBuildingSnapsFields;
        return {
          ...PrevSnaps,
          [field]: data[0],
        };
      });
    }
    // dl ul snaps
    return (setDlUlSanps as React.Dispatch<React.SetStateAction<DlULSnaps>>)(
      (PrevSnaps: DlULSnaps) => {
        const field = Field as DlUlSnapsFields;
        return {
          ...PrevSnaps,
          [field]: data[0],
        };
      }
    );
  };

  // snap container
  return (
    <div className="inline-block max-w-fit p-3 rounded-xl dark:bg-[#090909] bg-gray-300 transition-transform hover:scale-105 dark:shadow-[0_0_10px_#00000020] shadow-[0_0_10px_#ffffff40]">
      <button
        onClick={() => {
          handleDeleteImage(index, value);
        }}
        type="button"
        className="absolute top-2 right-2 p-1 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md focus:outline-none cursor-pointer"
        aria-label="Delete Image"
        disabled={value?.filename ? false : true || disable}
      >
        <TbHttpDelete size={18} />
      </button>
      <p className="text-sm font-semibold mb-2 dark:text-white text-black select-none">
        {labelName
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())}
      </p>
      <div className="border border-dashed dark:border-white border-black rounded-lg">
        <label htmlFor={labelName} className="cursor-pointer block p-2">
          <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-md overflow-hidden flex items-center justify-center dark:bg-black bg-gray-300">
            {value?.filename ? (
              <Image
                src={(value?.base64Image as string) || ""}
                alt={labelName}
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            ) : (
              <IoImageOutline className="text-6xl dark:text-white text-black" />
            )}
          </div>
          <input
            type="file"
            id={labelName}
            accept={imageType}
            hidden
            onChange={handleImage}
            name={labelName}
            multiple={multiple}
            disabled={disable}
          />
        </label>
      </div>
    </div>
  );
};

// snaps container
const SectorSnapsContainer = ({ Field }: { Field: ScftSectorsSnapsFields }) => {
  const { auditSectorsSnaps } = useAuditSnaps();
  return (
    <div className="p-6 rounded-2xl bg-black/90 dark:bg-gray-300 dark:shadow-[0_0_8px_#00000040] shadow-[0_0_8px_#ffffff35] w-full">
      <h3 className="text-xl font-bold mb-6 dark:text-gray-900 text-white capitalize tracking-wide px-4 sm:px-6 md:px-8">
        {Field.replace(/_/g, " ")}
      </h3>
      <div className="flex flex-wrap justify-between gap-y-6 px-4 sm:px-6 md:px-8">
        {(auditSectorsSnaps as ScftSectorsAuditSnaps)[Field].map(
          (_: ISnap, index: number) => {
            const char = String.fromCharCode(65 + index);
            return (
              <SnapContainer
                key={index}
                labelName={`${Field}-${char}`}
                multiple={false}
                value={
                  (auditSectorsSnaps as ScftSectorsAuditSnaps)[Field][index]
                }
                index={index}
                Field={Field}
              />
            );
          }
        )}
      </div>
    </div>
  );
};

// blockage snaps
export const AuditBlockageSnaps = ({ SiteId }: { SiteId: string }) => {
  const { blockageSnaps } = useAuditSnaps();

  const isBlockageAvailable =
    Array.isArray(blockageSnaps) && blockageSnaps.length > 0;

  return (
    <div className="border border-white dark:border-white/30 p-5 rounded-lg mt-4">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white text-black italic">
        {SiteId} Blockage Snaps
      </h2>

      <div className="bg-black dark:bg-gray-300 p-5 rounded-lg space-y-4">
        <SnapContainer
          multiple={true}
          labelName={`${SiteId}-Blockages`}
          value={
            isBlockageAvailable
              ? blockageSnaps[0]
              : { filename: "", destination: "", base64Image: "" }
          }
          Field={null}
          index={0}
        />

        {isBlockageAvailable ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {blockageSnaps.map((snap: ISnap, index: number) => (
              <div
                key={index}
                className="relative group overflow-hidden border border-gray-300 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-900"
              >
                <Image
                  src={
                    snap.base64Image?.startsWith("data:")
                      ? snap.base64Image
                      : `data:image/jpeg;base64,${snap.base64Image}`
                  }
                  alt={`Blockage Snap ${index + 1}`}
                  width={80}
                  height={120}
                  className="object-cover w-full h-48"
                />
                <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow">
                  {`#${index + 1}`}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-md shadow-sm text-yellow-800 text-sm italic">
            ⚠️ No blockage snaps uploaded yet. Please upload images if any
            blockage exists on site.
          </div>
        )}
      </div>
    </div>
  );
};

export const AuditSectorsSnaps = ({ SiteId }: { SiteId: string }) => {
  const { auditSectorsSnaps } = useAuditSnaps();
  const FormFields = Object.keys(auditSectorsSnaps as ScftSectorsAuditSnaps);
  return (
    <div className="border border-white dark:border-white/30 p-5 rounded-lg">
      <h2 className="text-2xl font-semibold mb-8 dark:text-white text-black italic">
        {SiteId} Sectors Snaps
      </h2>

      <div className="flex flex-col gap-8">
        {FormFields.map((Field, index) => (
          <SectorSnapsContainer
            key={index}
            Field={Field as ScftSectorsSnapsFields}
          />
        ))}
      </div>
    </div>
  );
};

export const AuditTowerAndBuildingSnaps = ({ SiteId }: { SiteId: string }) => {
  const { towerAndBuildingSnaps } = useAuditSnaps();
  const Fields = Object.keys(towerAndBuildingSnaps as TowerAndBuildingSnaps);
  return (
    <div className="border border-white dark:border-white/30 p-5 rounded-lg">
      <h2 className="text-2xl font-semibold mb-8 dark:text-white text-black italic">
        {SiteId} Tower And Building Snaps
      </h2>
      <div className="p-6 rounded-2xl bg-black/90 dark:bg-gray-300 dark:shadow-[0_0_8px_#00000040] shadow-[0_0_8px_#ffffff35] w-full">
        <div className="flex flex-wrap justify-between gap-y-6 px-4 sm:px-6 md:px-8">
          {Fields.map((Field, index) => (
            <SnapContainer
              key={index}
              multiple={false}
              labelName={Field}
              value={
                (towerAndBuildingSnaps as TowerAndBuildingSnaps)[
                  Field as TowerAndBuildingSnapsFields
                ]
              }
              Field={Field as TowerAndBuildingSnapsFields}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const CluttersSnaps = ({ SiteId }: { SiteId: string }) => {
  const { clutters } = useAuditSnaps();
  return (
    <div className="border border-white dark:border-white/30 p-5 rounded-lg">
      <h2 className="text-2xl font-semibold mb-8 dark:text-white text-black italic">
        {SiteId} Clutters Snaps
      </h2>
      <div className="p-6 rounded-2xl bg-black/90 dark:bg-gray-300 dark:shadow-[0_0_8px_#00000040] shadow-[0_0_8px_#ffffff35] w-full">
        <div className="flex flex-wrap justify-between gap-y-6 px-4 sm:px-6 md:px-8">
          {(clutters as cluttersSnaps).map((clutter, index) => (
            <SnapContainer
              key={index}
              multiple={false}
              labelName={`clutter-${String.fromCharCode(65 + index)}`}
              value={clutter}
              Field={null}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const AuditDlUlSnaps = ({ SiteId }: { SiteId: string }) => {
  const { dlulSnaps } = useAuditSnaps();
  const Fields = Object.keys(dlulSnaps as DlULSnaps);
  return (
    <div className="border border-white dark:border-white/30 p-5 rounded-lg">
      <h2 className="text-2xl font-semibold mb-8 dark:text-white text-black italic">
        {SiteId} Tower And Building Snaps
      </h2>
      <div className="p-6 rounded-2xl bg-black/90 dark:bg-gray-300 dark:shadow-[0_0_8px_#00000040] shadow-[0_0_8px_#ffffff35] w-full">
        <div className="flex flex-wrap justify-between gap-y-6 px-4 sm:px-6 md:px-8">
          {Fields.map((Field, index) => (
            <SnapContainer
              key={index}
              multiple={false}
              labelName={Field}
              value={(dlulSnaps as DlULSnaps)[Field as DlUlSnapsFields]}
              Field={Field as DlUlSnapsFields}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// 4G scft audit snaps
export const AuditSnapsContainer = ({
  SiteId,
  setState,
}: {
  SiteId: string;
  setState: (val: string) => void;
}) => {
  const handleNextButton = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("GENERATE REPORT");
  };
  const handlePrevButton = () => {
    setState("AUDIT DATA");
  };
  const { file_type, network } = useAuditSnaps();

  return (
    <form
      onSubmit={handleNextButton}
      className="max-w-7xl mx-auto p-6 md:p-10 dark:bg-black bg-gray-300 rounded-2xl shadow-[0_0_25px_#00000020] dark:shadow-[0_0_25px_#ffffff20]"
    >
      <h1 className="text-3xl font-extrabold mb-6 dark:text-white text-black text-center sm:text-left">
        {`${SiteId} AUDIT SNAPS`}
      </h1>
      {/* 4g scft */}
      {file_type == "SCFT" && network == "4G" ? (
        <>
          <AuditTowerAndBuildingSnaps SiteId={SiteId} />
          <AuditSectorsSnaps SiteId={SiteId} />
          <AuditBlockageSnaps SiteId={SiteId} />
        </>
      ) : null}
      {/* 4g cat */}
      {file_type == "CAT" && network == "4G" ? (
        <AuditBlockageSnaps SiteId={SiteId} />
      ) : null}

      {/* 5g cat */}
      {file_type == "CAT" && network == "5G" ? (
        <AuditDlUlSnaps SiteId={SiteId} />
      ) : null}
      {/* 5g scft ants */}
      {file_type == "SCFT ANTS" && network == "5G" ? (
        <>
          <AuditTowerAndBuildingSnaps SiteId={SiteId} />
          <AuditSectorsSnaps SiteId={SiteId} />
          <CluttersSnaps SiteId={SiteId} />
        </>
      ) : null}
      <PrevAndNextButtons handlePrevButton={handlePrevButton} />
    </form>
  );
};

export const InputCombineReportContainer = ({
  labelName,
  isLoading,
}: {
  labelName: InputCombineReportFields;
  isLoading: boolean;
}) => {
  const {
    inputCombineReport,
    setInputCombineReport,
    setIsReady,
    setOutputReport,
  } = useAuditSnaps();
  const [selectedFileName, setSelectedFileName] = useState<string | null>(
    (inputCombineReport as InputCombineReport)[
      labelName as InputCombineReportFields
    ].filename
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const username = useSelector((state: RootState) => state.user.name) as string;

  const removeFile = async () => {
    setSelectedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    await handleDeleteFile(
      (inputCombineReport as InputCombineReport)[labelName].destination
    );
    switch (labelName.toUpperCase()) {
      case "SINGLE_COMBINE":
        (
          setInputCombineReport as React.Dispatch<
            React.SetStateAction<InputCombineReport>
          >
        )((preVal) => ({
          ...preVal,
          single_combine: {
            filename: "",
            destination: "",
          },
        }));
        break;
      case "PRE_COMBINE":
        (
          setInputCombineReport as React.Dispatch<
            React.SetStateAction<InputCombineReport>
          >
        )((preVal) => ({
          ...preVal,
          pre_combine: {
            filename: "",
            destination: "",
          },
        }));
        break;
      case "POST_COMBINE":
        (
          setInputCombineReport as React.Dispatch<
            React.SetStateAction<InputCombineReport>
          >
        )((preVal) => ({
          ...preVal,
          post_combine: {
            filename: "",
            destination: "",
          },
        }));
        break;
    }
    (setIsReady as React.Dispatch<React.SetStateAction<boolean>>)(false);
  };

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const loadingToast = toast.loading(
      `Uploading ${labelName} Combine Report...`
    );
    const formData = new FormData();
    formData.append("file", files[0]);
    const {
      result: { files: data },
    } = await handleUploadFile(
      formData,
      labelName,
      (inputCombineReport as InputCombineReport)[labelName].destination,
      username
    );
    toast.dismiss(loadingToast);
    (setOutputReport as React.Dispatch<React.SetStateAction<ISnap>>)({
      filename: "",
      destination: "",
    });
    switch (labelName.toUpperCase()) {
      case "SINGLE_COMBINE":
        (
          setInputCombineReport as React.Dispatch<
            React.SetStateAction<InputCombineReport>
          >
        )((preVal) => ({
          ...preVal,
          single_combine: { ...data[0], name: files[0].name },
        }));
        setSelectedFileName(data[0].filename);
        return (setIsReady as React.Dispatch<React.SetStateAction<boolean>>)(
          true
        );

      case "PRE_COMBINE":
        (
          setInputCombineReport as React.Dispatch<
            React.SetStateAction<InputCombineReport>
          >
        )((preVal) => ({ ...preVal, pre_combine: data[0] }));
        setSelectedFileName(data[0].filename);
        if ((inputCombineReport as InputCombineReport).post_combine.destination)
          (setIsReady as React.Dispatch<React.SetStateAction<boolean>>)(true);
        break;
      case "POST_COMBINE":
        (
          setInputCombineReport as React.Dispatch<
            React.SetStateAction<InputCombineReport>
          >
        )((preVal) => ({ ...preVal, post_combine: data[0] }));
        setSelectedFileName(data[0].filename);
        if ((inputCombineReport as InputCombineReport).pre_combine.destination)
          (setIsReady as React.Dispatch<React.SetStateAction<boolean>>)(true);
        break;
    }
  };

  return (
    <div className="w-full max-w-md">
      <label
        htmlFor={`xlsxUpload-${labelName}`}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        {`Upload ${labelName.split(" ").join(" ")} Report (.xlsx)`}
      </label>
      <div className="flex items-center space-x-2">
        <input
          id={`xlsxUpload-${labelName}`}
          type="file"
          accept=".xlsx"
          onChange={handleFile}
          ref={fileInputRef}
          className="block w-full text-sm text-gray-800 dark:text-gray-200
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-lg file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-600 file:text-white 
                   hover:file:bg-blue-700
                   transition-all duration-300 ease-in-out
                   bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm"
        />
        {selectedFileName && (
          <button
            type="button"
            onClick={removeFile}
            disabled={isLoading}
            className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            <RiDeleteBin6Line />
          </button>
        )}
      </div>
      {selectedFileName && (
        <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
          {selectedFileName ? selectedFileName : "No file is selected"}
        </p>
      )}
    </div>
  );
};

export const InputCombinesContainer = ({
  isLoading,
}: {
  isLoading: boolean;
}) => {
  const { file_type, fileFormat, setFileFormat } = useAuditSnaps();
  const handleInputFileFormat = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFileFormat(event.target.value);
  };

  return (
    <div
      className="w-full mt-6 border border-gray-300 dark:border-gray-700 
             space-y-6 bg-white dark:bg-black/20 
             p-6 rounded-xl shadow-md 
             transition-all duration-300"
    >
      {/* Header */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        Combine File Formats
      </h2>

      {/* Select Input */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="combine-format"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Choose Format
        </label>
        <select
          id="combine-format"
          onChange={handleInputFileFormat}
          value={fileFormat}
          disabled={file_type != "CAT"}
          className="px-4 py-2 rounded-lg shadow-sm border border-gray-300 dark:border-gray-600 
        bg-white text-gray-800 dark:bg-gray-800 dark:text-white 
        focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          {InputFilesFormats.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Conditional Inputs */}
      <div className="space-y-4">
        {fileFormat === "SINGLE COMBINE FILE" ? (
          <InputCombineReportContainer
            labelName="single_combine"
            isLoading={isLoading}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputCombineReportContainer
              labelName="pre_combine"
              isLoading={isLoading}
            />
            <InputCombineReportContainer
              labelName="post_combine"
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const OutputReportContainer = ({
  isLoading,
  setIsLoading,
}: {
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
}) => {
  const { outputReport } = useAuditSnaps();
  const hasFile = !!outputReport?.filename;
  // download file
  const handleDownload = async () => {
    const loadingToast = toast.loading("Downloading...");
    setIsLoading(true);
    const result = await handleDownloadReport(
      outputReport?.destination as string,
      outputReport?.filename as string
    );
    if (result && result.data) {
      const url = window.URL.createObjectURL(new Blob([result.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", outputReport?.filename as string);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // clean up memory
    } else {
      throw new Error("Download failed or file not found.");
    }
    toast.dismiss(loadingToast);
    setIsLoading(false);
  };

  return (
    <div
      className="w-full mt-6 border border-gray-300 dark:border-gray-700 
             space-y-6 bg-white dark:bg-black/20 
             p-6 rounded-xl shadow-md 
             transition-all duration-300"
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        Generated Output File
      </h2>
      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/10 rounded-lg">
        {/* Excel Icon */}
        <AiFillFileExcel
          className={`text-3xl ${hasFile ? "text-green-600" : "text-gray-400"}`}
        />

        {/* Filename */}
        <div className="flex-1 text-sm text-gray-800 dark:text-gray-200">
          {hasFile ? (
            <p className="font-medium">{outputReport.filename}</p>
          ) : (
            <p className="italic text-gray-500 dark:text-gray-400">
              No output file has been generated yet. Please generate the report
              to see it here.
            </p>
          )}
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={!hasFile || isLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-semibold
            ${
              !hasFile || isLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            }`}
        >
          <MdCloudDownload className="text-xl" />
          Download
        </button>
      </div>
    </div>
  );
};

export const GenerateReport = ({
  setState,
}: {
  setState: (val: string) => void;
}) => {
  const {
    siteData,
    auditSectorsSnaps,
    sectorScftAuditData,
    sectorCatAuditData,
    blockageSnaps,
    towerAndBuildingSnaps,
    inputCombineReport,
    network,
    format,
    file_type,
    fileFormat,
    isReady,
    dlulSnaps,
    clutters,
    setOutputReport,
  } = useAuditSnaps();
  const [isLoading, setIsLoading] = useState(false);
  const handlePrevButton = () => setState("AUDIT SNAPS");
  // generate report
  const handleGenerate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    setIsLoading(true);
    (setOutputReport as React.Dispatch<React.SetStateAction<ISnap>>)({
      filename: "",
      destination: "",
    });
    const antenna_heights: number[] = [];
    const azimuths: number[] = [];
    const pcis: number[] = [];
    (siteData as ITowerModel)?.Sectors?.map((sector) => {
      antenna_heights.push(sector.Antenna_Height as number);
      azimuths.push(sector.Azimuth);
      pcis.push(sector.PCI);
    });
    const sectors: ISectors = {
      antenna_heights: {
        data: {
          values: antenna_heights || [],
        },
        snaps: auditSectorsSnaps?.antenna_heights as ISnap[],
      },
      azimuths:
        file_type == "SCFT" || file_type == "SCFT ANTS"
          ? ({
              data: {
                values: azimuths || [],
              },
              snaps: auditSectorsSnaps?.azimuths as ISnap[],
            } as IScftTowerComponent)
          : ({
              data: {
                pre_values: sectorCatAuditData?.pre_azimuths,
                post_values: azimuths,
              },
            } as ICatTowerComponent),
      compass: auditSectorsSnaps?.compass as ISnap[],
      pci: { values: pcis } as IScftTowerComponentData,
      electrical_tilts:
        file_type == "SCFT" || file_type == "SCFT ANTS"
          ? ({
              data: {
                values:
                  (sectorScftAuditData?.electrical_tilts as number[]) || [],
              },
              snaps: auditSectorsSnaps?.electrical_tilts as ISnap[],
            } as IScftTowerComponent)
          : ({
              data: {
                pre_values: sectorCatAuditData?.pre_electrical_tilts,
                post_values: sectorCatAuditData?.post_electrical_tilts,
              },
            } as ICatTowerComponent),
      mechanical_tilts:
        file_type == "SCFT" || file_type == "SCFT ANTS"
          ? ({
              data: {
                values: sectorScftAuditData?.mechanical_tilts as number[],
              },
              snaps: auditSectorsSnaps?.mechanical_tilts as ISnap[],
            } as IScftTowerComponent)
          : ({
              data: {
                pre_values: sectorCatAuditData?.pre_mechanical_tilts,
                post_values: sectorCatAuditData?.post_mechanical_tilts,
              },
            } as ICatTowerComponent),
    };
    // Simulate async task
    const sitedata: ISiteReportData = {
      tower_data: {
        siteId: (siteData as ITowerModel)?.SiteId,
        tower_height: (siteData as ITowerModel)?.Tower_Height as number,
        tower_type: (siteData as ITowerModel)?.Tower_Type as TowerType,
        sectors:
          ((siteData as ITowerModel)?.Sectors?.length as number) ||
          (auditSectorsSnaps?.azimuths.length as number),
        latitude: (siteData as ITowerModel)?.Latitude,
        longitude: (siteData as ITowerModel)?.Longitude,
        state: data["State"] as string,
        tech: data["Tech"] as Tech,
      },
      network: network as Network,
      file_type: file_type as FileType,
      blockage_snaps: blockageSnaps as BlockageSnaps,
      combine_report: inputCombineReport as InputCombineReport,
      format: format as Formats,
      building_data: {
        building_height: (siteData as ITowerModel)?.Building_Height as number,
      },
      tower_building_snaps: {
        tower: towerAndBuildingSnaps?.tower as ISnap,
        tower_height: towerAndBuildingSnaps?.tower_height as ISnap,
        building_height: towerAndBuildingSnaps?.building_height as ISnap,
      },
      combine_input_report_format: fileFormat,
      sectors: sectors,
      dlulSnaps: dlulSnaps,
      clutters: clutters as cluttersSnaps,
    };
    const { success, message, result } = await handleGenerateReport(sitedata);
    setIsLoading(false);
    if (!success) {
      (setOutputReport as React.Dispatch<React.SetStateAction<ISnap>>)({
        filename: "",
        destination: "",
      });
      return toast.error(message);
    }
    (setOutputReport as React.Dispatch<React.SetStateAction<ISnap>>)(result);
    return toast.success(message);
  };

  return (
    <div className="p-6 rounded-2xl shadow-md bg-gray-100 dark:bg-black/5 transition-all duration-300 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors italic">
        Generate Combine Report
      </h1>

      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        onSubmit={handleGenerate}
      >
        {file_type != "SCFT ANTS" ? (
          <>
            <SelectContainer
              lableName="State"
              defaultValue={States[0]}
              items={States}
            />
            <SelectContainer
              lableName="Tech"
              defaultValue={Techs[0]}
              items={Techs}
            />
          </>
        ) : null}

        <InputCombinesContainer isLoading={isLoading} />

        <OutputReportContainer
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        <div className="w-full max-w-screen-xl mx-auto px-4">
          <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base font-medium pt-2">
            {`Generate ${file_type} Report for Site ID ${
              (siteData as ITowerModel)?.["SiteId"]
            } on ${network} Network using ${format} Format`}
          </p>

          <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 pt-6 w-full">
            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrevButton}
              disabled={isLoading}
              className="w-full lg:w-1/2 px-6 py-3 rounded-lg bg-gray-400 dark:bg-white text-black hover:bg-gray-300 dark:hover:bg-gray-100 transition-transform transform hover:scale-105 shadow-md font-medium cursor-pointer"
            >
              Prev
            </button>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={!isReady || isLoading}
              className={`w-full lg:w-1/2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md flex items-center justify-center gap-2
        ${
          isReady
            ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }
        ${isLoading ? "opacity-70" : ""}
      `}
            >
              {isLoading ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin text-lg" />
                  Generating...
                </>
              ) : (
                "Generate"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
