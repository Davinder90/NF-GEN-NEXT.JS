"use client";

import { Networks } from "@/src/lib/type/site.types";
import { addNewSites } from "@/src/requests/google-spreadsheet.requests";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { LuFileScan } from "react-icons/lu";

const ImportSites = () => {
  const [cellFile, setCellFile] = useState("4G");
  const [sites, setSites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleNetworkSelection = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCellFile(event.target.value);
    setSites([]);
  };

  const handleImport = async () => {
    setIsLoading(true);
    const { result } = await addNewSites(cellFile);
    setSites(result);
    setIsLoading(false);
  };

  return (
    <>
      {/* Background blur */}
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-0" />

      {/* Main Container */}
      <div
        className={`fixed top-28 left-1/2 -translate-x-1/2 p-[2px] rounded-2xl shadow-xl z-10 w-[90%] max-w-md transition-all duration-500 ${
          isLoading ? "border-animate" : ""
        }`}
      >
        <div
          className={`relative rounded-[1rem] p-6 overflow-hidden transition-colors duration-500 bg-white dark:bg-black/80 border border-black/10 dark:border-white/30`}
        >
          {/* Shimmer background while loading */}
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-green-100/10 via-green-300/20 to-green-100/10 bg-[length:200%_100%] animate-shimmer pointer-events-none rounded-[1rem] z-0" />
          )}

          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Import Sites from{" "}
              <span className="text-green-600">{cellFile}</span> Cell File
            </h2>

            <label className="flex items-center gap-3 text-sm font-medium text-gray-800 dark:text-gray-200 mb-6">
              Cell File:
              <select
                onChange={handleNetworkSelection}
                defaultValue={cellFile}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              >
                {Networks.map((n, index) => (
                  <option key={index} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>

            <button
              onClick={handleImport}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 active:scale-95 text-white font-medium rounded-lg shadow-md transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin text-lg" />
                  Importing...
                </>
              ) : (
                <span>Import</span>
              )}
            </button>

            {/* Scanner Animation or Site List */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center mt-6 h-20">
                <LuFileScan className="text-5xl text-green-600 animate-scanner-move" />
                Scanning Cell File
              </div>
            ) : sites.length > 0 ? (
              <div className="mt-6 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-transparent transition-all duration-300">
                <ul className="space-y-2">
                  {sites.map((site, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm text-gray-800 dark:text-gray-100 transition hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
                      <span className="font-medium">{site}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .animate-shimmer {
          animation: shimmer 2s linear infinite;
        }

        .border-animate {
          background: linear-gradient(
            135deg,
            rgba(34, 197, 94, 0.6),
            rgba(255, 255, 255, 0.1),
            rgba(34, 197, 94, 0.6)
          );
          background-size: 300% 300%;
          animation: shimmer 3s linear infinite;
        }

        @keyframes scannerBounce {
          0% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.1);
          }
          100% {
            transform: translateY(0) scale(1);
          }
        }

        .animate-scanner-move {
          animation: scannerBounce 1s ease-in-out infinite;
          display: inline-block;
        }
      `}</style>
    </>
  );
};

export default ImportSites;
