"use client";
import { TowerAndSectorData } from "@/src/components/Common/TowerAndSector";
import { PyramidLoader } from "@/src/components/Loader/Loader";
import { ITowerModel } from "@/src/lib/interfaces/models.interfaces";
import { Network } from "@/src/lib/type/site.types";
import { handleGetSite } from "@/src/requests/sites.requests";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const SitePage = () => {
  const searchParams = useSearchParams();
  const network = searchParams.get("network") as Network;
  const siteId = searchParams.get("siteId") || "";

  const [Site, setSite] = useState<ITowerModel>({
    SiteId: "",
    Latitude: 0,
    Longitude: 0,
  });
  const [loader, setLoader] = useState(true);

  const handleFetchData = useCallback(async () => {
    const {
      result: { site },
    } = await handleGetSite(network, siteId);
    setSite(site);
    setLoader(false);
  }, [network, siteId]);

  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  if (loader) return <PyramidLoader />;

  return <TowerAndSectorData siteId={siteId} Site={Site} network={network} />;
};

export default SitePage;
