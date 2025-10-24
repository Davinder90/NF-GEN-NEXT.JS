import { Workbook, Worksheet } from "exceljs";
import { FORMATER } from "@helpers/exceljs/format.exceljs.helpers";
import logger from "@/src/log/logger";
import {
  IScftTowerComponent,
  ISiteReportData,
  ISnap,
} from "@interfaces/site.interfaces";
import { SectorComponentsKey } from "@type/site.types";

export class SCFT_ANTS_5G extends FORMATER {
  site_data: ISiteReportData;
  output_workbook: Workbook;

  constructor(output_workbook: Workbook, site_data: ISiteReportData) {
    super();
    this.output_workbook = output_workbook;
    this.site_data = site_data;
  }

  perfSnap = (worksheet: Worksheet) => {
    const SNAPS_FORMAT = [
      "compass",
      "electrical_tilts",
      "mechanical_tilts",
      "antenna_heights",
      "azimuths",
    ];
    const {
      tower_data,
      sectors,
      tower_building_snaps: { tower, tower_height, building_height },
    } = this.site_data;
    let row_start = 9;
    const row_gap = 18;
    const column_gap = 3;
    SNAPS_FORMAT.forEach((component, main_index) => {
      let column_start = 2;
      for (let index = 1; index <= tower_data.sectors; index++) {
        const snap =
          component == "compass"
            ? (sectors["compass"] as ISnap[])[index - 1]
            : (sectors[component as SectorComponentsKey] as IScftTowerComponent)
                ?.snaps[index - 1];

        if (snap?.destination && snap?.filename) {
          this.insertImage(
            this.output_workbook,
            worksheet,
            snap.destination,
            snap.filename,
            row_start,
            row_start + row_gap,
            column_start + 6,
            column_start
          );
        }
        column_start += column_gap + 6;
      }
      row_start += row_gap + 4;
      if (main_index > 1) row_start += 1;
    });

    if (tower?.filename)
      this.insertImage(
        this.output_workbook,
        worksheet,
        tower.destination,
        tower.filename,
        122,
        143,
        2,
        8
      );

    if (tower_height?.filename)
      this.insertImage(
        this.output_workbook,
        worksheet,
        tower_height.destination,
        tower_height.filename,
        122,
        143,
        11,
        17
      );

    if (building_height?.filename)
      this.insertImage(
        this.output_workbook,
        worksheet,
        building_height.destination,
        building_height.filename,
        147,
        165,
        2,
        8
      );
  };

  clutterPhotos = (worksheet: Worksheet) => {
    const { tower_data, clutters } = this.site_data;
    let column_start = 2;
    const column_gap = 3;
    for (let index = 0; index <= tower_data.sectors; index++) {
      const snap = (clutters as ISnap[])[index];
      if (snap?.destination && snap?.filename) {
        this.insertImage(
          this.output_workbook,
          worksheet,
          snap.destination,
          snap.filename,
          11,
          30,
          column_start + 6,
          column_start
        );
      }
      column_start += column_gap + 6;
    }
  };

  generate5GSCFT_ANTSReport = async () => {
    for (const sheet of this.output_workbook.worksheets) {
      logger.info(`5G CAT ${sheet.name}`);
      switch (sheet.name.toUpperCase()) {
        case "PERF SNAP":
          this.perfSnap(sheet);
          break;
        case "CLUTTER_PHOTOS":
          this.clutterPhotos(sheet);
          break;
        default:
          logger.warn(sheet.name);
      }
    }
  };
}
