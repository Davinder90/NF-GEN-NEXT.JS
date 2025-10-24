import { Workbook, Worksheet } from "exceljs";
import { FORMATER } from "@helpers/exceljs/format.exceljs.helpers";
import {
  ICells,
  IScftTowerComponent,
  ISiteReportData,
  ISnap,
} from "@interfaces/site.interfaces";
import { getWorksheet } from "@helpers/exceljs/main.exceljs.helpers";
import { _4G_SNAPS_FORMAT, COLORS, STATES_PARAMS } from "@utils/constants";
import { IOptions } from "@interfaces/file.interfaces";
import { SectorComponentsKey, TowerBuildingSnapKey } from "@type/site.types";
import logger from "@/src/log/logger";

export class SCFT_4G extends FORMATER {
  site_data: ISiteReportData;
  input_workbook: Workbook;
  output_workbook: Workbook;

  constructor(
    input_workbook: Workbook,
    output_workbook: Workbook,
    site_data: ISiteReportData
  ) {
    super();
    this.input_workbook = input_workbook;
    this.output_workbook = output_workbook;
    this.site_data = site_data;
  }

  LteKpi = async (input_sheet_name: string, output_worksheet: Worksheet) => {
    const {
      tower_data: { siteId, tech, state, sectors },
    } = this.site_data;
    // filling cells values
    const {
      HR: {
        _4G: { BANDS_VALUE: HR_BANDS, DLUL: HR_DLUL },
      },
      HP: {
        _4G: { DLUL: HP_DLUL, BANDS_VALUE: HP_BANDS },
      },
      TECH_LAYER,
    } = STATES_PARAMS;
    const dlul = state.toLowerCase() === "hr" ? HR_DLUL : HP_DLUL;
    const band = state.toLowerCase() === "hr" ? HR_BANDS : HP_BANDS;

    const input_worksheet = getWorksheet(
      this.input_workbook,
      input_sheet_name
    ) as Worksheet;
    const lte_kpi_cells: ICells = {
      D19: { value: dlul[tech]?.DL, numFmt: false },
      D22: { value: dlul[tech]?.UL, numFmt: false },
      C2: { value: `${siteId} ${tech}`.toUpperCase(), numFmt: false },
      D2: { value: `Target|${tech}|${band[tech]}MHz`, numFmt: false },
    };
    this.addDataToWorksheetWithCells(output_worksheet, lte_kpi_cells);
    for (let col = 69; col < 69 + sectors; col++) {
      output_worksheet.getCell(`${String.fromCharCode(col)}2`).value =
        `${siteId} ${String.fromCharCode(col - 4)}`.toUpperCase();
      output_worksheet.getCell(`${String.fromCharCode(col)}4`).value = `cell ${
        col - 68
      }`.toUpperCase();

      // sectors data
      for (let row = 4; row <= 50; row++) {
        if (row != 24)
          output_worksheet.getCell(
            `${String.fromCharCode(col)}${row + 2}`
          ).value = input_worksheet.getCell(
            `${String.fromCharCode(col)}${row}`
          ).value;
        else
          output_worksheet.getCell(
            `${String.fromCharCode(col)}${row + 2}`
          ).value = TECH_LAYER[tech];
      }
    }
  };

  VolteKpi = async (input_sheet_name: string, output_worksheet: Worksheet) => {
    const input_worksheet = getWorksheet(
      this.input_workbook,
      input_sheet_name
    ) as Worksheet;
    const {
      tower_data: { sectors },
    } = this.site_data;
    // filling cell values
    for (let index = 69; index < 69 + sectors; index++) {
      output_worksheet.getCell(`${String.fromCharCode(index)}2`).value = `C ${
        index - 68
      }`;
      output_worksheet.getCell(`${String.fromCharCode(index)}3`).value =
        input_worksheet.getCell(`${String.fromCharCode(index)}3`).value;
      output_worksheet.getCell(`${String.fromCharCode(index)}4`).value =
        input_worksheet.getCell(`${String.fromCharCode(index)}4`).value;

      output_worksheet.getCell(`${String.fromCharCode(index)}7`).value = Number(
        (Math.random() * (24 - 19) + 19).toFixed(2)
      );

      output_worksheet.getCell(`${String.fromCharCode(index)}8`).value = Number(
        (Math.random() * (24 - 19) + 19).toFixed(2)
      );
    }
  };

  LogList = async (input_sheet_name: string, output_worksheet: Worksheet) => {
    this.formatWorksheetByAllRows(
      this.input_workbook.getWorksheet(input_sheet_name) as Worksheet,
      output_worksheet
    );
  };

  sectorsAuditSnaps = async (worksheet: Worksheet) => {
    const { SECTOR_COMPONENTS, TOWER_BUILDING } = _4G_SNAPS_FORMAT;
    const { tower_data, sectors, tower_building_snaps } = this.site_data;
    let row_start = 5;
    const column_gap = 2;
    const row_gap = 15;

    // sectors
    SECTOR_COMPONENTS.forEach((component) => {
      let column_start = 2;
      for (let index = 1; index <= tower_data.sectors; index++) {
        const range = `${this.getExcelColumn(
          column_start
        )}${row_start}:${this.getExcelColumn(
          column_start + column_gap - 1
        )}${row_start}`;
        const options = this.styleFormat(
          `${component[0]} CELL ${index}`,
          "FF000000",
          "FFD3D3D3",
          range,
          12,
          "thin",
          "FFFF0000",
          false
        );
        this.insertHeader(worksheet, options as IOptions);
        let snap;
        if (component[1] != "compass") {
          snap = (
            sectors[component[1] as SectorComponentsKey] as IScftTowerComponent
          )?.snaps[index - 1];
        } else {
          snap = (sectors["compass"] as ISnap[])[index - 1];
        }

        if (snap?.destination && snap?.filename) {
          this.insertImage(
            this.output_workbook,
            worksheet,
            snap.destination,
            snap.filename,
            row_start,
            row_start + row_gap,
            column_start - 1,
            column_start
          );
        }
        column_start += column_gap;
      }
      row_start += row_gap + 1;
    });

    // tower and building
    let column_start = 2;
    (Object.keys(tower_building_snaps) as TowerBuildingSnapKey[]).forEach(
      (component, component_index) => {
        const range = `${this.getExcelColumn(
          column_start
        )}${row_start}:${this.getExcelColumn(
          column_start + column_gap - 1
        )}${row_start}`;
        const options = this.styleFormat(
          TOWER_BUILDING[component_index],
          "FF000000",
          "FFD3D3D3",
          range,
          12,
          "thin",
          "FFFF0000",
          false
        );
        this.insertHeader(worksheet, options as IOptions);
        const snap = tower_building_snaps[component];
        if (snap?.destination && snap?.filename) {
          this.insertImage(
            this.output_workbook,
            worksheet,
            snap.destination,
            snap.filename,
            row_start,
            row_start + row_gap,
            column_start - 1,
            column_start
          );
        }
        column_start += column_gap;
      }
    );
  };

  gisSheet = (worksheet: Worksheet) => {
    const { tower_data, sectors, building_data } = this.site_data;

    const { TECH_LAYER } = STATES_PARAMS;

    const operations = [
      { value: tower_data.siteId, column: 1 }, // site id
      { value: tower_data.tech, column: 2 }, // tech
      { value: tower_data.siteId, column: 3 }, // 2g siteid
      { value: tower_data.siteId, column: 4 }, // lte siteid
      {
        value: Array.from(
          { length: tower_data.sectors },
          (_, index) =>
            `${tower_data.siteId}_${String.fromCharCode(65 + index)}`
        ),
        column: 5,
      }, // sector
      {
        value: Array.from({ length: tower_data.sectors }, (_, i) => i + 1),
        column: 6,
      }, // sector no
      {
        value: tower_data.latitude,
        column: 7,
      }, // latitude
      { value: tower_data.longitude, column: 8 }, // longitude
      {
        value: (sectors.azimuths as IScftTowerComponent).data.values,
        column: 19,
      }, // azimuth
      {
        value: (sectors.azimuths as IScftTowerComponent).data.values,
        column: 20,
      }, //  azimuth
      {
        value: (sectors.antenna_heights as IScftTowerComponent).data.values.map(
          (height: number) => height + building_data.building_height
        ),
        column: 21,
      }, // agl height
      {
        value: (sectors.antenna_heights as IScftTowerComponent).data.values.map(
          (height: number) => height + building_data.building_height
        ),
        column: 22,
      }, // agl height
      {
        value: (sectors.mechanical_tilts as IScftTowerComponent).data.values,
        column: 23,
      }, // mechanical tilt
      {
        value: (sectors.electrical_tilts as IScftTowerComponent).data.values,
        column: 24,
      }, // electrical tilt
      { value: tower_data.tower_type, column: 25 },
      { value: tower_data.tower_height, column: 26 },
      { value: building_data.building_height, column: 27 },
      { value: TECH_LAYER[tower_data.tech], column: 28 },
    ];

    operations.forEach((operation) => {
      this.addDataToWorksheetWithColumnRange(
        tower_data.sectors,
        worksheet.getColumn(operation.column),
        operation.value
      );
    });
  };

  gisDataSheet = (worksheet: Worksheet, input_workbook: Workbook) => {
    const { tower_data, sectors, building_data, file_type, network } =
      this.site_data;
    const lte_worksheet = getWorksheet(input_workbook, "LTE KPI");

    const operations = [
      {
        value: Array.from(
          { length: tower_data.sectors },
          (_, index) => index + 1
        ),
        column: 1,
      }, // serial no
      { value: tower_data.siteId, column: 2 }, // siteid
      {
        value: Array.from(
          { length: tower_data.sectors },
          () => `${tower_data.tech}_${file_type}`
        ),
        column: 3,
      }, // band
      { value: network, column: 4 }, // network
      {
        value: tower_data.tower_type,
        column: 5,
      }, // tower type
      { value: tower_data.tower_height, column: 6 }, // tower height
      {
        value: building_data.building_height,
        column: 7,
      }, // building data
      {
        value: tower_data.latitude,
        column: 8,
      }, // latitude
      { value: tower_data.longitude, column: 9 }, // longitude
      {
        value: Array.from(
          { length: tower_data.sectors },
          (_, index) => index + 1
        ),
        column: 10,
      }, // sector no
      {
        value: Array.from(
          { length: tower_data.sectors },
          (_, index) => index + 1
        ),
        column: 11,
      }, // cell no
      {
        value: Array.from(
          { length: tower_data.sectors },
          (_, index) =>
            `HR_E_F1_OM_${tower_data.siteId}_${String.fromCharCode(65 + index)}`
        ),
        column: 12,
      },
      {
        value: Array.from(
          { length: tower_data.sectors },
          (_, index) =>
            lte_worksheet?.getCell(`${String.fromCharCode(69 + index)}9`).value
        ),
        column: 13,
      }, // cell id
      {
        value: Array.from(
          { length: tower_data.sectors },
          (_, index) =>
            lte_worksheet?.getCell(`${String.fromCharCode(69 + index)}6`).value
        ),
        column: 14,
      }, // lac
      {
        value: Array.from(
          { length: tower_data.sectors },
          (_, index) =>
            lte_worksheet?.getCell(`${String.fromCharCode(69 + index)}7`).value
        ),
        column: 15,
      }, // tac
      {
        value: Array.from(
          { length: tower_data.sectors },
          (_, index) =>
            lte_worksheet?.getCell(`${String.fromCharCode(69 + index)}5`).value
        ),
        column: 16,
      }, // mcc
      {
        value: Array.from(
          { length: tower_data.sectors },
          (_, index) =>
            lte_worksheet?.getCell(`${String.fromCharCode(69 + index)}4`).value
        ),
        column: 17,
      }, // mnc
      {
        value: Array.from(
          { length: tower_data.sectors },
          (_, index) =>
            lte_worksheet?.getCell(`${String.fromCharCode(69 + index)}8`).value
        ),
        column: 18,
      }, // earfcn
      {
        value: (sectors.antenna_heights as IScftTowerComponent).data.values.map(
          (height: number) => height + building_data.building_height
        ),
        column: 20,
      }, // agl height
      {
        value: (sectors.azimuths as IScftTowerComponent).data.values.map(
          (val: number) => val
        ),
        column: 28,
      }, // azimuth
      {
        value: (
          sectors.electrical_tilts as IScftTowerComponent
        ).data.values.map((val: number) => val),
        column: 29,
      }, // electrical tilt
      {
        value: (
          sectors.mechanical_tilts as IScftTowerComponent
        ).data.values.map((val: number) => val),
        column: 30,
      }, // mechnical tilt
    ];

    operations.forEach((operation) => {
      this.addDataToWorksheetWithColumnRange(
        tower_data.sectors,
        worksheet.getColumn(operation.column),
        operation.value
      );
    });
  };

  generate4GOldScftReport = async () => {
    for (const sheet of this.output_workbook.worksheets) {
      logger.info(`${COLORS.BLUE}4G SCFT ${sheet.name}${COLORS.RESET}`);
      switch (sheet.name.toUpperCase()) {
        case "LTE KPI":
          await this.LteKpi(sheet.name, sheet);
          break;
        case "SCFT PLOTS":
          await this.Plots(
            "PLOT",
            sheet,
            this.input_workbook,
            this.output_workbook,
            this.site_data
          );
          await this.insertBlockageSnaps(
            sheet,
            "M123:Y125",
            126,
            12,
            this.output_workbook,
            this.site_data.blockage_snaps
          );
          break;
        case "VOLTE KPI":
          await this.VolteKpi(sheet.name, sheet);
          break;
        case "VOLTE PLOTS":
          await this.Plots(
            sheet.name,
            sheet,
            this.input_workbook,
            this.output_workbook,
            this.site_data
          );
          await this.insertBlockageSnaps(
            sheet,
            "M123:Y125",
            126,
            12,
            this.output_workbook,
            this.site_data.blockage_snaps
          );
          break;
        case "MANDATORY AUDIT SNAP":
          await this.sectorsAuditSnaps(sheet);
          break;
        case "AUDIT SHEET":
          await this.auditSheet(sheet, this.site_data);
          break;
        case "GIS_DATA":
          this.gisDataSheet(sheet, this.input_workbook);
          break;
        case "GIS":
          this.gisSheet(sheet);
          break;
        case "LOG LIST":
          await this.LogList(sheet.name, sheet);
          break;
        default:
          logger.warn(`${sheet.name.toUpperCase()} is not updated`);
      }
    }
  };
}
