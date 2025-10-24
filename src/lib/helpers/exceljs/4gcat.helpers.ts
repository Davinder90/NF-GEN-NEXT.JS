import { Workbook, Worksheet } from "exceljs";
import { FORMATER } from "@helpers/exceljs/format.exceljs.helpers";
import { getWorksheet } from "./main.exceljs.helpers";
import { ICells, ISiteReportData } from "@interfaces/site.interfaces";
import logger from "@/src/log/logger";
import { COLORS } from "../../utils/constants";

export class CAT_4G extends FORMATER {
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

  catLogList = async (
    input_sheet_name: string,
    output_worksheet: Worksheet,
    bool: boolean
  ) => {
    if (this.single_combine_input_workbook) {
      const input_worksheet = getWorksheet(
        this.single_combine_input_workbook,
        input_sheet_name
      ) as Worksheet;
      this.formatWorksheetAllColumnsWidth(input_worksheet, output_worksheet);
      let rowNumber = 1;
      input_worksheet.eachRow((row, rowIndex) => {
        const cell = input_worksheet.getCell(`L${rowIndex}`);
        const Pre =
          typeof cell.value === "string"
            ? cell.value
            : (cell.value ?? "").toString();
        const isPre = Pre.split("_").includes("PRE");
        if (rowNumber <= 5) {
          this.formatRowData(output_worksheet.getRow(rowNumber), row);
          rowNumber++;
        } else if (isPre === bool) {
          this.formatRowData(output_worksheet.getRow(rowNumber), row);
          rowNumber++;
        }
      });
    } else {
      const workbook = bool
        ? this.pre_combine_input_workbook
        : this.post_combine_input_workbook;
      const input_worksheet = getWorksheet(
        workbook as Workbook,
        input_sheet_name
      ) as Worksheet;
      this.formatWorksheetByAllRows(input_worksheet, output_worksheet);
    }
  };

  volteClusterAt = async (
    output_worksheet: Worksheet,
    input_sheet_name: string
  ) => {
    const input_workbook = this.single_combine_input_workbook
      ? this.single_combine_input_workbook
      : this.post_combine_input_workbook;
    const input_worksheet = getWorksheet(
      input_workbook as Workbook,
      input_sheet_name
    ) as Worksheet;

    for (let index = 0; index <= 16; index++) {
      output_worksheet.getCell(`F${3 + index}`).value = input_worksheet.getCell(
        `E${8 + index}`
      ).value;
    }
  };

  siteDetail = async (output_worksheet: Worksheet) => {
    output_worksheet.getCell("B2").value = this.site_data.tower_data.siteId;
  };

  clusterAt = async (output_worksheet: Worksheet, input_sheet_name: string) => {
    const { tower_data } = this.site_data;
    const cells: ICells = {
      C3: { value: tower_data.siteId, numFmt: false },
      E6: { value: `Target|${tower_data.tech}|`, numFmt: false },
    };

    const input_worksheet1 = getWorksheet(
      this.single_combine_input_workbook
        ? (this.single_combine_input_workbook as Workbook as Workbook)
        : (this.post_combine_input_workbook as Workbook),
      input_sheet_name
    ) as Worksheet;

    const input_worksheet2 = getWorksheet(
      this.pre_combine_input_workbook as Workbook,
      input_sheet_name
    ) as Worksheet;

    for (let row = 8; row <= 16; row++) {
      const eValue = input_worksheet1.getCell(`E${row}`).value as number;
      const fValue = input_worksheet1.getCell(`F${row}`).value;
      cells[`E${row - 1}`] = { value: eValue, numFmt: false };

      if (row === 11 || row === 12) {
        const [a, b] = `${fValue}`.split("/").map(Number);
        cells[`F${row - 1}`] = { value: Math.max(a, b), numFmt: false };
      } else {
        cells[`F${row - 1}`] = { value: Number(fValue), numFmt: true };
      }
    }

    for (let row = 39; row < 42; row++) {
      cells[`F${row}`] = {
        value: Number(input_worksheet1.getCell(`F${row + 4}`).value),
        numFmt: true,
      };
      const sourceWorksheet = this.pre_combine_input_workbook
        ? input_worksheet2
        : input_worksheet1;
      cells[`E${row}`] = {
        value: Number(sourceWorksheet.getCell(`F${row + 4}`).value),
        numFmt: false,
      };
    }

    this.addDataToWorksheetWithCells(output_worksheet, cells);
  };

  generate4GCatReport = async () => {
    for (const sheet of this.output_workbook.worksheets) {
      logger.info(`${COLORS.BLUE}4G CAT ${sheet.name}${COLORS.RESET}`);
      switch (sheet.name.toUpperCase()) {
        case "CLUSTER AT":
          await this.clusterAt(sheet, "Cluster AT");
          break;
        case "DRIVE ROUTE":
          // pre drive plot
          await this.Plots(
            "PRE FDD AT Plots",
            sheet,
            this.single_combine_input_workbook
              ? (this.single_combine_input_workbook as Workbook)
              : (this.pre_combine_input_workbook as Workbook),
            this.output_workbook,
            this.site_data
          );
          // post drive plot
          await this.Plots(
            "POST FDD AT Plots",
            sheet,
            this.single_combine_input_workbook
              ? (this.single_combine_input_workbook as Workbook)
              : (this.post_combine_input_workbook as Workbook),
            this.output_workbook,
            this.site_data
          );
          break;
        case "LTE CAT PLOTS":
          // pre lte plots
          await this.Plots(
            "PRE FDD AT ZOOM PLOTS",
            sheet,
            this.single_combine_input_workbook
              ? (this.single_combine_input_workbook as Workbook)
              : (this.pre_combine_input_workbook as Workbook),
            this.output_workbook,
            this.site_data
          );
          // post lte plot
          await this.Plots(
            "POST FDD AT ZOOM PLOTS",
            sheet,
            this.single_combine_input_workbook
              ? (this.single_combine_input_workbook as Workbook)
              : (this.post_combine_input_workbook as Workbook),
            this.output_workbook,
            this.site_data
          );
          await this.insertBlockageSnaps(
            sheet,
            "R213:AC215",
            218,
            17,
            this.output_workbook,
            this.site_data.blockage_snaps
          );
          break;
        case "VOLTE PLOTS":
          // pre volte plots
          await this.Plots(
            "PRE VoLTE Drive Test ZOOM Plot",
            sheet,
            this.single_combine_input_workbook
              ? (this.single_combine_input_workbook as Workbook)
              : (this.pre_combine_input_workbook as Workbook),
            this.output_workbook,
            this.site_data
          );
          // post volte plot
          await this.Plots(
            "POST VoLTE Drive Test ZOOM Plo",
            sheet,
            this.single_combine_input_workbook
              ? (this.single_combine_input_workbook as Workbook)
              : (this.post_combine_input_workbook as Workbook),
            this.output_workbook,
            this.site_data
          );
          await this.insertBlockageSnaps(
            sheet,
            "T116:AB118",
            119,
            19,
            this.output_workbook,
            this.site_data.blockage_snaps
          );
          break;
        case "VOLTE CLUSTER AT":
          await this.volteClusterAt(sheet, "VoLTE Drive Test KPIs");
          break;
        case "SITE DETAIL":
          await this.siteDetail(sheet);
          break;
        case "AUDIT SHEET":
          await this.auditSheet(sheet, this.site_data);
          break;
        case "PRE LOG LIST":
          await this.catLogList("Log_list", sheet, true);
          break;
        case "POST LOG LIST":
          await this.catLogList("Log_list", sheet, false);
          break;
        default:
          logger.warn(sheet.name);
      }
    }
  };
}
