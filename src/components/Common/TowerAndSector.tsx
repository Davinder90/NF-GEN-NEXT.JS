"use client";
import {
  ISectorModel,
  ITowerModel,
} from "@/src/lib/interfaces/models.interfaces";
import { Network } from "@/src/lib/type/site.types";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CLIENT_ROUTES } from "@/src/lib/utils/common-constants";

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div>
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-base font-medium text-gray-800 dark:text-white">
      {value}
    </p>
  </div>
);

const SectorBox = ({ Sector }: { Sector: ISectorModel }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 bg-gradient-to-br from-indigo-50 to-white dark:from-black/40 dark:to-black/20 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-lg transition duration-300"
    >
      <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-3">
        {Sector.Name}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
        <p>
          <span className="font-semibold">Azimuth:</span> {Sector.Azimuth}
        </p>
        <p>
          <span className="font-semibold">PCI:</span> {Sector.PCI}
        </p>
        <p>
          <span className="font-semibold">Antenna Height:</span>{" "}
          {Sector.Antenna_Height}
        </p>
      </div>
    </motion.div>
  );
};

export const TowerAndSectorData = ({
  network,
  siteId,
  Site,
}: {
  network: Network;
  siteId: string;
  Site: ITowerModel;
}) => {
  const router = useRouter();

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-10 bg-gray-100 dark:bg-black/90 min-h-screen text-gray-900 dark:text-white">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-400">
          {network} Site:{" "}
          <span className="font-mono text-gray-900 dark:text-white">
            {siteId}
          </span>
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Site overview and technical information
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tower Info Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-black/50 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 space-y-4"
        >
          <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-4">
            Tower Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoItem label="Latitude" value={Site.Latitude} />
            <InfoItem label="Longitude" value={Site.Longitude} />
            <InfoItem label="Tower Type" value={Site.Tower_Type || "N/A"} />
            <InfoItem label="Tower Height" value={Site.Tower_Height || "N/A"} />
            <InfoItem
              label="Building Height"
              value={Site.Building_Height || "N/A"}
            />
          </div>
        </motion.div>

        {/* Sectors Column */}
        <div className="space-y-6">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-semibold text-indigo-700 dark:text-indigo-300"
          >
            Sectors
          </motion.h2>

          {Site.Sectors?.length ? (
            Site.Sectors.map((Sector, index) => (
              <SectorBox key={index} Sector={Sector} />
            ))
          ) : (
            <p className="text-gray-500 italic dark:text-gray-400">
              No sectors available.
            </p>
          )}
        </div>
      </div>

      <div
        className="text-center pt-6"
        onClick={() => {
          router.push(
            CLIENT_ROUTES.SITES_ROUTE +
              CLIENT_ROUTES.UPDATE_SITE_ROUTE +
              `?siteId=${siteId}&network=${network}`
          );
        }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-300 cursor-pointer"
        >
          Update Site
        </motion.button>
      </div>
    </div>
  );
};
