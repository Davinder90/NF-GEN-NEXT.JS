"use client";
import { PyramidLoader } from "@/src/components/Loader/Loader";
import { ICreateSiteBodyRequest } from "@/src/lib/interfaces/zodSchema.interfaces";
import { Network, Networks } from "@/src/lib/type/site.types";
import { CLIENT_ROUTES } from "@/src/lib/utils/common-constants";
import {
  handleGetPaginationSites,
  handleTotalSitesCount,
} from "@/src/requests/sites.requests";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BsDatabaseFillAdd } from "react-icons/bs";
import { FaFileImport } from "react-icons/fa";

const SitesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const network = searchParams.get("network") as Network;
  const page = Number(searchParams.get("page"));
  const limit = Number(searchParams.get("limit"));
  const site = searchParams.get("site") || "";
  const [mounted, setMounted] = useState(false);
  const [totalSites, setTotalSites] = useState(0);
  const [Sites, setSites] = useState<
    (ICreateSiteBodyRequest & { Sectors: number })[]
  >([]);
  const [loader, setLoader] = useState(true);

  const SiteBox = ({
    data,
  }: {
    data: ICreateSiteBodyRequest & { Sectors: number };
  }) => (
    <Link
      href={`${CLIENT_ROUTES.SITES_ROUTE}${CLIENT_ROUTES.SITE_ROUTE}?network=${network}&siteId=${data.SiteId}`}
      className="block"
    >
      <div className="grid grid-cols-7 gap-2 text-xs sm:text-sm p-2 sm:p-3 bg-white dark:bg-black/70 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md shadow transition-all duration-200 border border-white/20 cursor-pointer overflow-x-auto">
        <p className="truncate">{data.SiteId}</p>
        <p className="truncate">{data.Latitude}</p>
        <p className="truncate">{data.Longitude}</p>
        <p className="truncate">{data.Sectors}</p>
        <p className="truncate">{data.Tower_Type}</p>
        <p className="truncate">{data.Tower_Height}</p>
        <p className="truncate">{data.Building_Height}</p>
      </div>
    </Link>
  );

  const handleNetworkSelection = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    router.push(
      `${CLIENT_ROUTES.SITES_ROUTE}?network=${event.target.value}&page=1&limit=${limit}`
    );
  };

  const handleSearchSite = (event: React.ChangeEvent<HTMLInputElement>) => {
    router.push(
      `${CLIENT_ROUTES.SITES_ROUTE}?network=${network}&page=1&limit=${limit}&site=${event.target.value}`
    );
  };

  const handlePageNavigation = (
    event: React.MouseEvent<HTMLButtonElement>,
    type: "forward" | "backward"
  ) => {
    event.preventDefault();
    const newPage = type === "forward" ? page + 1 : page - 1;
    router.push(
      `${CLIENT_ROUTES.SITES_ROUTE}?network=${network}&page=${newPage}&limit=${limit}&site=${site}`
    );
  };

  const fetchData = useCallback(async () => {
    const {
      result: { count },
      success: success1,
    } = await handleTotalSitesCount(network, site);
    if (success1) setTotalSites(count);
    const {
      result: { output_sites },
      success: success2,
    } = await handleGetPaginationSites(network, page, limit, site);
    if (success2) setSites(output_sites);
    setLoader(false);
  }, [network, page, limit, site]);

  useEffect(() => {
    fetchData();
    setMounted(true);
  }, [fetchData]);

  if (!mounted) return null; // Prevent SSR mismatch

  const page_sites = page * limit - (limit - Sites?.length);

  if (loader) return <PyramidLoader />;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black/10 text-gray-900 dark:text-white p-4 space-y-6">
      <div className="space-y-4">
        <h1 className="text-xl sm:text-2xl font-semibold">{network} Sites</h1>
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between w-full">
          {/* Left Group: Network & Limit Control */}
          <div className="flex flex-row justify-between sm:justify-start sm:gap-8 items-center">
            {/* Network Selection */}
            <label className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-white">
              Network:
              <select
                onChange={handleNetworkSelection}
                defaultValue={network}
                className="bg-white dark:bg-black/30 border border-gray-300 dark:border-gray-600 px-2 py-1 rounded focus:outline-none focus:ring focus:border-blue-500 transition"
              >
                {Networks.map((n, index) => (
                  <option key={index} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>

            {/* Limit Control */}
            <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-black/30 text-sm">
              <button
                onClick={() => {
                  if (limit > 1) {
                    router.push(
                      `${
                        CLIENT_ROUTES.SITES_ROUTE
                      }?network=${network}&page=1&limit=${
                        limit - 1
                      }&site=${site}`
                    );
                  }
                }}
                className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50 cursor-pointer"
                disabled={limit <= 1}
              >
                -
              </button>
              <span className="px-2 text-center w-8">{limit}</span>
              <button
                onClick={() =>
                  router.push(
                    `${
                      CLIENT_ROUTES.SITES_ROUTE
                    }?network=${network}&page=1&limit=${limit + 1}&site=${site}`
                  )
                }
                className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Middle: Search */}
          <input
            type="text"
            placeholder="Search site"
            onChange={handleSearchSite}
            defaultValue={site}
            className="w-full sm:w-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          {/* Right: import Button */}
          <button
            onClick={() => {
              /* your add site logic */
              router.push(
                `${CLIENT_ROUTES.SITES_ROUTE}${CLIENT_ROUTES.IMPORT_SITES_ROUTE}`
              );
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded shadow transition cursor-pointer"
          >
            <FaFileImport className="text-lg" />
            <span>Import Sites</span>
          </button>

          {/* Right: Add Button */}
          <button
            onClick={() => {
              /* your add site logic */
              router.push(
                `${CLIENT_ROUTES.SITES_ROUTE}${CLIENT_ROUTES.ADD_SITE_ROUTE}`
              );
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow transition cursor-pointer"
          >
            <BsDatabaseFillAdd className="text-lg" />
            <span>Add Site</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-2 font-semibold text-xs sm:text-sm bg-gray-200 dark:bg-white text-black px-3 py-2 rounded">
          <p>SiteId</p>
          <p>Latitude</p>
          <p>Longitude</p>
          <p>Sectors</p>
          <p>Tower Type</p>
          <p>Tower Height</p>
          <p>Building Height</p>
        </div>

        <div className="space-y-2 mt-2">
          {Sites.map((site, index) => (
            <SiteBox key={index} data={site} />
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <button
          disabled={page === 1}
          onClick={(event) => handlePageNavigation(event, "backward")}
          className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700 transition"
        >
          <GrFormPrevious />
          Previous
        </button>
        <span className="text-sm">
          {page_sites} / {totalSites}
        </span>
        <button
          disabled={page_sites >= totalSites}
          onClick={(event) => handlePageNavigation(event, "forward")}
          className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700 transition"
        >
          Next <GrFormNext />
        </button>
      </div>
    </div>
  );
};

export default SitesPage;
