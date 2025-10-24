"use client";
import { useState } from "react";
import { SectorInput, SiteInput } from "@type/helpers.types";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Network, Networks, TowerType, TowerTypes } from "@type/site.types";
import { handleAddSite, handleUpdateSite } from "@/src/requests/sites.requests";
import { ICreateSiteBodyRequest } from "@interfaces/zodSchema.interfaces";

export const SelectContainer = ({
  lableName,
  defaultValue,
  items,
}: {
  lableName: string;
  defaultValue: string | number;
  items: (number | string)[];
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={lableName}
        className="text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        {lableName}
      </label>
      <select
        name={lableName}
        id={lableName}
        defaultValue={defaultValue}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
               focus:outline-none focus:ring-2 focus:ring-blue-500 
               bg-white text-gray-800 
               dark:bg-gray-800 dark:text-white"
      >
        {items.map((type, index) => (
          <option key={index}>{type}</option>
        ))}
      </select>
    </div>
  );
};

export const InputContainer = ({
  value,
  placeHolder,
  name,
  caption,
  type,
}: SiteInput) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-1"
    >
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        {name
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())}
      </label>
      <input
        required
        type={type}
        id={name}
        name={name}
        defaultValue={value}
        placeholder={placeHolder}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-black/20 text-gray-800 dark:text-white"
      />
      {caption && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{caption}</p>
      )}
    </motion.div>
  );
};

export const TowerInputContainer = ({
  TowerInputs,
  towerType,
}: {
  TowerInputs: SiteInput[];
  towerType: TowerType;
}) => {
  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-2 mb-4">
        Tower Data
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {TowerInputs.map((data, index) => (
          <InputContainer key={index} {...data} />
        ))}
        <SelectContainer
          lableName="Tower Type"
          defaultValue={towerType}
          items={TowerTypes}
        />
        <SelectContainer
          lableName="Network"
          defaultValue={Networks[0]}
          items={Networks}
        />
      </div>
    </div>
  );
};

export const SectorsInputContainer = ({
  SectorsInputs,
  SiteId,
}: {
  SectorsInputs: SectorInput[];
  SiteId: string;
}) => {
  const [sectors, setSectors] = useState(SectorsInputs);
  const siteLabel = SiteId || "Sector";

  const handleAddNewSector = () => {
    const sectorIndex = sectors.length;
    const char = String.fromCharCode(65 + sectorIndex);
    const label = `${siteLabel} ${char}`;

    const new_sector: SectorInput = [
      {
        name: `Azimuth-${char}`,
        value: "",
        caption: "required",
        type: "text",
        placeHolder: `Enter the azimuth of ${label}`,
      },
      {
        name: `PCI-${char}`,
        value: "",
        caption: "required",
        type: "text",
        placeHolder: `Enter the PCI of ${label}`,
      },
      {
        name: `Antenna Height-${char}`,
        value: "",
        caption: "required",
        type: "text",
        placeHolder: `Enter the antenna height of ${label}`,
      },
    ];

    setSectors((prev) => [...prev, new_sector.map((item) => ({ ...item }))]);
  };

  const handleRemoveSector = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    event.preventDefault();
    setSectors((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 dark:text-white border-b border-gray-300 dark:border-gray-700 pb-2 mb-4">
        Sectors Data
      </h3>

      {sectors.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-4">
          No sector data available.
        </p>
      ) : (
        <div className="space-y-6 mb-4">
          <AnimatePresence>
            {sectors.map((sectorInputs, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-black/20 shadow-sm"
              >
                <h4 className="text-lg font-medium text-blue-700 dark:text-blue-400 mb-3">
                  {siteLabel}-{String.fromCharCode(65 + index)}
                </h4>

                <button
                  onClick={(event) => handleRemoveSector(event, index)}
                  aria-label="Remove sector"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition cursor-pointer"
                >
                  <IoIosRemoveCircleOutline size={24} />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {sectorInputs.map((sector, i) => (
                    <InputContainer key={i} {...sector} />
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <motion.button
        onClick={handleAddNewSector}
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow transition cursor-pointer"
      >
        <MdOutlinePlaylistAdd className="text-lg" />
        <span>Add Sector</span>
      </motion.button>
    </div>
  );
};

const UpsertSite = ({
  TowerInputs,
  SectorsInput,
  SiteId,
  buttonName,
  towerType,
}: {
  TowerInputs: SiteInput[];
  SectorsInput: SectorInput[];
  SiteId: string;
  buttonName: string;
  towerType: TowerType;
}) => {
  const handleSubmitData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const Antenna_Heights: number[] = [];
    const PCIs: number[] = [];
    const Azimuths: number[] = [];
    for (const [key, value] of Object.entries(data)) {
      const finder = key.split("-")[0];
      if (
        ["Antenna Height", "PCI", "Azimuth"].includes(finder) &&
        !Number(value) &&
        value != "0"
      )
        return toast.error(
          `${finder.toUpperCase()} ${key.split("-")[1]} must be number`
        );
      if ("Antenna Height" === finder) Antenna_Heights.push(Number(value));
      if ("PCI" == finder) PCIs.push(Number(value));
      if ("Azimuth" === finder) Azimuths.push(Number(value));
    }

    if (!Azimuths.length)
      return toast.error("Please enter atleast one sector data");
    const new_data: ICreateSiteBodyRequest = {
      SiteId: (data["SiteId"] as string).toUpperCase(),
      Latitude: Number(data["Latitude"]),
      Longitude: Number(data["Longitude"]),
      Tower_Type: data["Tower Type"] as TowerType,
      Building_Height: Number(data["Building Height"]),
      Tower_Height: Number(data["Tower Height"]),
      Antenna_Heights,
      PCIs,
      Azimuths,
      Network: data["Network"] as Network,
    };
    if (SiteId) {
      const { success, message } = await handleUpdateSite(new_data);
      if (success) return toast.success(message);
      return toast.error(message);
    }
    const { success, message } = await handleAddSite(new_data);
    if (success) return toast.success(message);
    return toast.error(message);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
        {SiteId ? `Update ${SiteId}` : `Add Site`}
      </h1>
      <form
        onSubmit={handleSubmitData}
        className="space-y-8 p-6 rounded-lg bg-white dark:bg-black/10 border border-gray-300 dark:border-gray-700 shadow-sm"
      >
        <TowerInputContainer TowerInputs={TowerInputs} towerType={towerType} />
        <hr className="border-t border-gray-300 dark:border-gray-700 my-6" />
        <SectorsInputContainer SectorsInputs={SectorsInput} SiteId={SiteId} />
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
          >
            {buttonName}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default UpsertSite;
