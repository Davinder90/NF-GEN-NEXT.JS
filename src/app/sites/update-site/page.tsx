"use client";
import { TowerInputs } from "@utils/common-constants";
import UpsertSite from "@components/UpsertSite/UpsertSite";
import { useSearchParams } from "next/navigation";
import { Network, TowerType } from "@/src/lib/type/site.types";
import { useCallback, useEffect, useState } from "react";
import { handleGetSite } from "@/src/requests/sites.requests";
import { PyramidLoader } from "@/src/components/Loader/Loader";
import { SectorInput, SiteInput } from "@/src/lib/type/helpers.types";
import { ISectorModel } from "@/src/lib/interfaces/models.interfaces";

const UpdateSite = () => {
  const searchParams = useSearchParams();
  const network = searchParams.get("network") as Network;
  const siteId = searchParams.get("siteId") as string;
  const [towerInputs, setTowerInputs] = useState<SiteInput[]>(TowerInputs);
  const [sectorInputs, setSectorInputs] = useState<SectorInput[]>([]);
  const [towerType, setTowerType] = useState<TowerType>("NA");
  const [loader, setLoader] = useState(true);
  const handleFetchData = useCallback(async () => {
    const {
      result: { site },
    } = await handleGetSite(network, siteId);
    const temp_tower = TowerInputs.map((input) => {
      if (input.name == "SiteId")
        return { ...input, value: site["SiteId"] as string };
      if (input.name == "Latitude")
        return { ...input, value: site["Latitude"] as number };
      if (input.name == "Longitude")
        return { ...input, value: site["Longitude"] as number };
      if (input.name == "Building Height")
        return { ...input, value: site["Building_Height"] as number };
      if (input.name == "Tower Height")
        return { ...input, value: site["Tower_Height"] as number };
    });

    const temp_sectors: SectorInput[] = [];
    site["Sectors"].forEach((sector: ISectorModel, index: number) => {
      const char = String.fromCharCode(65 + index);
      temp_sectors.push([
        {
          name: `Azimuth-${char}`,
          placeHolder: `Enter the Azimuth of ${site["SiteId"]} ${char}`,
          value: sector["Azimuth"],
          type: "text",
          caption: "required",
        },
        {
          name: `PCI-${char}`,
          placeHolder: `Enter the PCI of ${site["SiteId"]} ${char}`,
          value: sector["PCI"],
          type: "text",
          caption: "required",
        },
        {
          name: `Antenna Height-${char}`,
          placeHolder: `Enter the Antenna Height of ${site["SiteId"]} ${char}`,
          value: sector["Antenna_Height"] as number,
          type: "text",
          caption: "required",
        },
      ]);
    });
    setTowerType(site["Tower_Type"]);
    setSectorInputs(temp_sectors);
    setTowerInputs(temp_tower as SiteInput[]);
    setLoader(false);
  }, [network, siteId]);
  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  if (loader) return <PyramidLoader />;
  return (
    <UpsertSite
      buttonName="Update Site"
      TowerInputs={towerInputs}
      SectorsInput={sectorInputs}
      SiteId={siteId}
      towerType={towerType}
    />
  );
};

export default UpdateSite;
