import { Workbook, Worksheet } from "exceljs";
import { FORMATER } from "@helpers/exceljs/format.exceljs.helpers";
import { getWorksheet } from "./main.exceljs.helpers";
import {
  DlUlSnaps,
  ICatTowerComponent,
  IScftTowerComponent,
  ISiteReportData,
} from "@interfaces/site.interfaces";
import logger from "@/src/log/logger";
import { COLORS, PLOTS_FORMAT } from "@utils/constants";
import { IOptions } from "../../interfaces/file.interfaces";

export class CAT_5G extends FORMATER {
  site_data: ISiteReportData;
  output_workbook: Workbook;
  single_combine_input_workbook?: Workbook;
  pre_combine_input_workbook?: Workbook;
  post_combine_input_workbook?: Workbook;

  constructor(
    output_workbook: Workbook,
    site_data: ISiteReportData,
    single_combine_input_workbook?: Workbook,
    pre_combine_input_workbook?: Workbook,
    post_combine_input_workbook?: Workbook
  ) {
    super();
    this.single_combine_input_workbook = single_combine_input_workbook;
    this.output_workbook = output_workbook;
    this.site_data = site_data;
    this.pre_combine_input_workbook = pre_combine_input_workbook;
    this.post_combine_input_workbook = post_combine_input_workbook;
  }

  clusterAt = async (worksheet: Worksheet, input_sheet_name: string) => {
    const { tower_data } = this.site_data;
    const input_workbook = this.single_combine_input_workbook
      ? (this.single_combine_input_workbook as Workbook)
      : (this.post_combine_input_workbook as Workbook);
    worksheet.getCell("D3").value = tower_data.siteId;
    const input_worksheet = getWorksheet(
      input_workbook,
      input_sheet_name
    ) as Worksheet;
    for (let row = 13; row <= 56; row++) {
      worksheet.getCell(`G${row}`).value = input_worksheet.getCell(
        `G${row}`
      ).value;
      if (row == 53) worksheet.getCell(`G${row}`).value = `6, 5`;
    }
  };

  logList = async (worksheet: Worksheet, input_sheet_name: string) => {
    if (this.single_combine_input_workbook) {
      const input_worksheet = getWorksheet(
        this.single_combine_input_workbook,
        input_sheet_name
      ) as Worksheet;
      this.formatWorksheetByAllRows(input_worksheet, worksheet);
    } else {
      const pre_input_worksheet = getWorksheet(
        this.pre_combine_input_workbook as Workbook,
        input_sheet_name
      ) as Worksheet;
      const post_input_worksheet = getWorksheet(
        this.post_combine_input_workbook as Workbook,
        input_sheet_name
      ) as Worksheet;
      // pre worksheet log list
      let counter = this.formatWorksheetByAllRows(
        pre_input_worksheet,
        worksheet
      );
      // post worksheet log list
      post_input_worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 5) {
          this.formatRowData(worksheet.getRow(counter), row);
          counter++;
        }
      });
    }
  };

  preAndPostPlots = async (worksheet: Worksheet, input_sheet_name: string) => {
    const pre_plots: Record<string, string> = {};
    const post_plots: Record<string, string> = {};
    const pre_input_workbook = this.single_combine_input_workbook
      ? (this.single_combine_input_workbook as Workbook)
      : (this.pre_combine_input_workbook as Workbook);
    const post_input_workbook = this.single_combine_input_workbook
      ? (this.single_combine_input_workbook as Workbook)
      : (this.post_combine_input_workbook as Workbook);
    const pre_input_worksheet = getWorksheet(
      pre_input_workbook,
      input_sheet_name
    ) as Worksheet;
    const post_input_worksheet = getWorksheet(
      post_input_workbook,
      input_sheet_name
    ) as Worksheet;
    const { PRE_POST_COMPARISON_PLOTS } = PLOTS_FORMAT._5G.CAT;

    // pre plots
    await this.extractImages(
      pre_input_workbook,
      pre_input_worksheet,
      PRE_POST_COMPARISON_PLOTS.STORAGE_PATH,
      PRE_POST_COMPARISON_PLOTS.INPUT_FORMAT,
      pre_plots,
      this.site_data,
      "EVEN",
      true
    );
    const inserted_pre_plots = await this.insertPlots(
      this.output_workbook,
      worksheet,
      PRE_POST_COMPARISON_PLOTS.STORAGE_PATH,
      pre_plots,
      PRE_POST_COMPARISON_PLOTS.OUTPUT_FORMAT,
      4,
      43,
      1,
      2,
      this.site_data.file_type,
      this.site_data.output_file_path as string,
      "EVEN",
      true
    );
    this.site_data.plots?.push(inserted_pre_plots);
    // post plots
    await this.extractImages(
      post_input_workbook,
      post_input_worksheet,
      PRE_POST_COMPARISON_PLOTS.STORAGE_PATH,
      PRE_POST_COMPARISON_PLOTS.INPUT_FORMAT,
      post_plots,
      this.site_data,
      "ODD",
      true
    );
    const inserted_post_plots = await this.insertPlots(
      this.output_workbook,
      worksheet,
      PRE_POST_COMPARISON_PLOTS.STORAGE_PATH,
      post_plots,
      PRE_POST_COMPARISON_PLOTS.OUTPUT_FORMAT,
      4,
      43,
      8,
      9,
      this.site_data.file_type,
      this.site_data.output_file_path as string,
      "ODD",
      true
    );
    this.site_data.plots?.push(inserted_post_plots);
  };

  focusAreas = async (worksheet: Worksheet) => {
    const { dlulSnaps } = this.site_data;
    const { pre_dl, post_dl, pre_ul, post_ul } = dlulSnaps as DlUlSnaps;
    // pre ul
    this.insertImage(
      this.output_workbook,
      worksheet,
      pre_ul.destination,
      pre_ul.filename,
      14,
      44,
      2,
      4
    );
    // pre dl
    this.insertImage(
      this.output_workbook,
      worksheet,
      pre_dl.destination,
      pre_dl.filename,
      14,
      44,
      5,
      7
    );

    // post ul
    this.insertImage(
      this.output_workbook,
      worksheet,
      post_ul.destination,
      post_ul.filename,
      14,
      44,
      12,
      14
    );
    // post dl
    this.insertImage(
      this.output_workbook,
      worksheet,
      post_dl.destination,
      post_dl.filename,
      14,
      44,
      15,
      17
    );
  };

  siteDatabase = async (worksheet: Worksheet) => {
    const { tower_data, sectors, network, building_data } = this.site_data;
    const azimuths_changes: number[] = [];
    const mt_changes: number[] = [];
    const component_changes: string[][] = [];
    for (let index = 0; index < tower_data.sectors; index++) {
      component_changes.push([]);
    }

    let col_counter = 1;
    // state or circle
    worksheet.getColumn(col_counter).eachCell((cell, cell_number) => {
      if (cell_number > 2 + tower_data.sectors) return;
      if (cell_number > 2) cell.value = tower_data.state;
    });
    col_counter++;
    // site id
    worksheet.getColumn(col_counter).eachCell((cell, cell_number) => {
      if (cell_number > 2 + tower_data.sectors) return;
      if (cell_number > 2) cell.value = tower_data.siteId;
    });
    col_counter++;

    // latitude
    worksheet.getColumn(col_counter).eachCell((cell, cell_number) => {
      if (cell_number > 2 + tower_data.sectors) return;
      if (cell_number > 2) cell.value = tower_data.latitude;
    });
    col_counter++;

    // longitude
    worksheet.getColumn(col_counter).eachCell((cell, cell_number) => {
      if (cell_number > 2 + tower_data.sectors) return;
      if (cell_number > 2) cell.value = tower_data.longitude;
    });
    col_counter++;

    // network
    worksheet.getColumn(col_counter).eachCell((cell, cell_number) => {
      if (cell_number > 2 + tower_data.sectors) return;
      if (cell_number > 2) cell.value = network;
    });
    col_counter++;

    // sector id
    worksheet.getColumn(col_counter).eachCell((cell, cell_number) => {
      if (cell_number > 2 + tower_data.sectors) return;
      if (cell_number > 2)
        cell.value = `${tower_data.state}_5_EE_T1_OM_5_xxxx${
          tower_data.siteId
        }_${String.fromCharCode(62 + cell_number)}`;
    });
    col_counter++;

    // sector index
    worksheet.getColumn(col_counter).eachCell((cell, cell_number) => {
      if (cell_number > 2 + tower_data.sectors) return;
      if (cell_number > 2) cell.value = cell_number - 2;
    });
    col_counter++;

    // pci
    worksheet.getColumn(col_counter).eachCell((cell, cell_number) => {
      if (cell_number > 2 + tower_data.sectors) return;
      if (cell_number > 2) cell.value = sectors.pci?.values[cell_number - 3];
    });
    col_counter++;

    //antenna height

    // console.log(sectors.antenna_heights, typeof building_data.building_height);
    worksheet.getColumn(col_counter).eachCell((cell, cell_number) => {
      if (cell_number > 2 + tower_data.sectors) return;
      if (cell_number > 2)
        cell.value =
          (sectors.antenna_heights as IScftTowerComponent).data.values[
            cell_number - 3
          ] + building_data.building_height;
    });
    col_counter++;

    // azimuth pre values (5g cat)
    worksheet.getColumn(col_counter).eachCell((cell, cell_number) => {
      if (cell_number > 2 + tower_data.sectors) return;
      if (cell_number > 2)
        cell.value = (sectors.azimuths as ICatTowerComponent).data.pre_values[
          cell_number - 3
        ];
    });
    col_counter++;
    // azimuth post values (5g cat)
    worksheet.getColumn(col_counter).eachCell((cell, cell_number) => {
      if (cell_number > 2 + tower_data.sectors) return;
      if (cell_number > 2) {
        cell.value = (sectors.azimuths as ICatTowerComponent).data.post_values[
          cell_number - 3
        ];
        const change = Math.abs(
          (sectors.azimuths as ICatTowerComponent).data.pre_values[
            cell_number - 3
          ] -
            (sectors.azimuths as ICatTowerComponent).data.post_values[
              cell_number - 3
            ]
        );
        azimuths_changes.push(change);
        if (change) {
          component_changes[cell_number - 3].push("AZIMUTH");
        } else {
          component_changes[cell_number - 3].push("");
        }
      }
    });
    col_counter++;
    // azimuth changes
    worksheet.getColumn(col_counter).eachCell((cell, cell_number) => {
      if (cell_number > 2 + tower_data.sectors) return;
      if (cell_number > 2) cell.value = azimuths_changes[cell_number - 3];
    });
    col_counter++;

    // mechanical tilt pre values (5g cat)
    worksheet.getColumn(col_counter).eachCell((cell, cell_number) => {
      if (cell_number > 2 + tower_data.sectors) return;
      if (cell_number > 2)
        cell.value = (
          sectors.mechanical_tilts as ICatTowerComponent
        ).data.pre_values[cell_number - 3];
    });
    col_counter++;
    // mechanical tilt post values (5g cat)
    worksheet.getColumn(col_counter).eachCell((cell, cell_number) => {
      if (cell_number > 2 + tower_data.sectors) return;
      if (cell_number > 2) {
        cell.value = (
          sectors.mechanical_tilts as ICatTowerComponent
        ).data.post_values[cell_number - 3];
        const change = Math.abs(
          (sectors.mechanical_tilts as ICatTowerComponent).data.pre_values[
            cell_number - 3
          ] -
            (sectors.mechanical_tilts as ICatTowerComponent).data.post_values[
              cell_number - 3
            ]
        );
        mt_changes.push(change);
        if (change) {
          component_changes[cell_number - 3].push("MT");
        } else {
          component_changes[cell_number - 3].push("");
        }
      }
    });
    col_counter++;
    // mt changes
    worksheet.getColumn(col_counter).eachCell((cell, cell_number) => {
      if (cell_number > 2 + tower_data.sectors) return;
      if (cell_number > 2) cell.value = mt_changes[cell_number - 3];
    });
    col_counter++;
    // pre et
    worksheet.getColumn(col_counter).eachCell((cell, cell_number) => {
      if (cell_number > 2 + tower_data.sectors) return;
      if (cell_number > 2) cell.value = "RET";
    });
    col_counter++;
    // post et
    worksheet.getColumn(col_counter).eachCell((cell, cell_number) => {
      if (cell_number > 2 + tower_data.sectors) return;
      if (cell_number > 2) cell.value = "RET";
    });
    col_counter++;
    // et changes
    worksheet.getColumn(col_counter).eachCell((cell, cell_number) => {
      if (cell_number > 2 + tower_data.sectors) return;
      if (cell_number > 2) cell.value = "NA";
    });
    col_counter++;
    // remarks
    worksheet.getColumn(col_counter).eachCell((cell, cell_number) => {
      if (cell_number > 2 + tower_data.sectors) return;
      if (cell_number > 2) {
        let temp = "";
        component_changes[cell_number - 3].forEach((component) => {
          if (component.length && !temp.length) temp = component;
          else if (component.length) temp = temp + " AND " + component;
        });
        cell.value = temp.length ? temp + " CHANGED" : "NO CHANGE";
      }
    });
    col_counter++;
  };

  generate5GCatReport = async () => {
    for (const sheet of this.output_workbook.worksheets) {
      logger.info(`${COLORS.BLUE}5G CAT ${sheet.name}${COLORS.RESET}`);
      switch (sheet.name.toUpperCase()) {
        case "CLUSTER AT":
          await this.clusterAt(sheet, sheet.name);
          break;
        case "SITE DATABASE":
          await this.siteDatabase(sheet);
          break;
        case "NEIGHBOUR SITE DISTANCE SNAP":
          const options = this.styleFormat(
            "Neighbour Site Distance",
            "FF0000FF",
            "FFE0F0FF",
            "B2:Q4",
            18,
            "thick",
            "FF0000FF",
            true
          );
          await this.insertHeader(sheet, options as IOptions);
          // nothing
          break;
        case "PRE & POST COMPARISON":
          await this.preAndPostPlots(sheet, sheet.name);
          break;
        case "FOCUS AREAS":
          await this.focusAreas(sheet);
          break;
        case "WEBPAGE SNAPS":
          // nothing
          break;
        case "LOG LIST":
          await this.logList(sheet, sheet.name);
          break;
        default:
          logger.warn(sheet.name);
      }
    }
  };
}
