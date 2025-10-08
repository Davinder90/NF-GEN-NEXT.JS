import path from "path";
import fs from "fs";
import { Row, Worksheet, Cell, Column, Workbook, ImageRange } from "exceljs";
import {
  ICatTowerComponent,
  ICells,
  IScftTowerComponent,
  ISiteReportData,
  ISnap,
} from "@interfaces/site.interfaces";
import { asyncHandler, todayDate } from "@helpers/common.helpers";
import { IOptions, IRange } from "@interfaces/file.interfaces";
import {
  _4G_CAT_PLOTS,
  _4G_PLOTS,
  _4G_SCFT_PLOTS,
  FileOperationFormats,
  WorkbooksFormats,
} from "@type/site.types";
import {
  getWorkbook,
  getWorksheet,
  workbookIntializer,
} from "./main.exceljs.helpers";
import logger from "@/src/log/logger";
import { PATHS, PLOTS_FORMAT } from "@utils/constants";
import imageSize from "image-size";

export class FORMATER {
  // column
  formatWorksheetAllColumnsWidth = (
    format_worksheet: Worksheet,
    output_worksheet: Worksheet
  ) => {
    format_worksheet.columns.forEach((col, idx) => {
      if (col && col.width) {
        output_worksheet.getColumn(idx + 1).width = col.width;
      }
    });
  };

  formatWorksheetColumnWidth = (
    format_column: Column,
    output_column: Column
  ) => {
    output_column.width = format_column.width;
  };

  formatWorksheetByAllColumns = (
    format_worksheet: Worksheet,
    output_worksheet: Worksheet
  ) => {
    this.formatWorksheetAllColumnsWidth(format_worksheet, output_worksheet);
    this.formatWorksheetAllRowsHeight(output_worksheet, 1.5);
    for (
      let column_number = 1;
      column_number <= format_worksheet.columnCount;
      column_number++
    ) {
      this.formatColumnData(
        output_worksheet.getColumn(column_number),
        format_worksheet.getColumn(column_number)
      );
    }
  };

  formatWorksheetColumnsByColumnsRange = (
    output_start: number,
    output_end: number,
    format_start: number,
    format_end: number,
    format_worksheet: Worksheet,
    output_worksheet: Worksheet
  ) => {
    this.formatWorksheetAllColumnsWidth(format_worksheet, output_worksheet);
    this.formatWorksheetAllRowsHeight(output_worksheet, 1.5);
    while (output_start <= output_end && format_start <= format_end) {
      this.formatColumnData(
        output_worksheet.getColumn(output_start),
        format_worksheet.getColumn(format_start)
      );
      format_start += 1;
      output_start += 1;
    }
  };

  formatWorksheetColumnsByColumn = (
    format_column_number: number,
    format_worksheet: Worksheet,
    output_worksheet: Worksheet,
    output_start: number,
    output_end: number
  ) => {
    const format_column = format_worksheet.getColumn(format_column_number);
    while (output_start <= output_end) {
      const output_column = output_worksheet.getColumn(output_start);
      this.formatWorksheetColumnWidth(format_column, output_column);
      this.formatColumnData(output_column, format_column);
      output_start += 1;
    }
  };

  formatColumnData = (output_column: Column, format_column: Column) => {
    format_column.eachCell((cell, rowNumber) => {
      const output_cell = output_column.worksheet
        .getRow(rowNumber)
        .getCell(output_column.number);
      this.formatCell(cell, output_cell);
    });
  };

  // row
  formatWorksheetAllRowsHeight = (worksheet: Worksheet, height: number) => {
    worksheet.eachRow((row) => {
      row.height *= height; // 1.5
    });
  };

  formatWorksheetByAllRows = (
    format_worksheet: Worksheet,
    output_worksheet: Worksheet
  ) => {
    let counter = 0;
    this.formatWorksheetAllColumnsWidth(format_worksheet, output_worksheet);
    this.formatWorksheetAllRowsHeight(output_worksheet, 1.5);
    format_worksheet.eachRow((row: Row, rowNumber) => {
      this.formatRowData(output_worksheet.getRow(rowNumber), row);
      counter++;
    });
    return counter;
  };

  formatWorksheetRowsByRowsRange = (
    output_start: number,
    output_end: number,
    format_start: number,
    format_end: number,
    format_worksheet: Worksheet,
    output_worksheet: Worksheet
  ) => {
    this.formatWorksheetAllColumnsWidth(format_worksheet, output_worksheet);
    this.formatWorksheetAllRowsHeight(output_worksheet, 1.5);
    while (output_start <= output_end && format_start <= format_end) {
      this.formatRowData(
        output_worksheet.getRow(output_start),
        format_worksheet.getRow(format_start)
      );
      format_start += 1;
      output_start += 1;
    }
  };

  formatWorksheetRowsByRow = (
    format_row_number: number,
    format_worksheet: Worksheet,
    output_worksheet: Worksheet,
    output_start: number,
    output_end: number
  ) => {
    const format_row = format_worksheet.getRow(format_row_number);
    while (output_start <= output_end) {
      const output_row = output_worksheet.getRow(output_start);
      output_row.height *= 1.5;
      this.formatRowData(output_row, format_row);
      output_start += 1;
    }
  };

  formatRowData = (output_row: Row, format_row: Row) => {
    format_row.eachCell((cell, colNumber) => {
      const output_cell = output_row.getCell(colNumber);
      this.formatCell(cell, output_cell);
    });
  };

  // cell
  formatCell = (source: Cell, target: Cell) => {
    target.value = source.value;
    target.style = source.style;
  };

  addDataToWorksheetWithCells = (
    output_worksheet: Worksheet,
    cells: ICells
  ) => {
    for (const [key, value] of Object.entries(cells)) {
      output_worksheet.getCell(key).value = value.value;
      if (value.numFmt) {
        output_worksheet.getCell(key).numFmt = "0.00";
      }
    }
  };

  addDataToWorksheetWithColumnRange = (
    limit: number,
    column: Column,
    value: unknown
  ) => {
    column.eachCell((cell: Cell, cell_number: number) => {
      if (cell_number > limit + 1) return;
      if (cell_number > 1) {
        if (Array.isArray(value)) cell.value = value[cell_number - 2];
        else {
          cell.value = String(value);
        }
      }
    });
  };

  getImageName = (site_data: ISiteReportData, name: string, ext: string) => {
    return `${Date.now()} - ${Math.round(Math.random() * 1e9)} - ${
      site_data.network
    } - ${site_data.file_type} - ${site_data.tower_data.siteId} - ${
      site_data.tower_data.tech
    } ${name}.${ext}`;
  };
  // image
  extractImages = async (
    workbook: Workbook,
    worksheet: Worksheet,
    storage_path: string,
    names: string[],
    hash: Record<string, string>,
    site_data: ISiteReportData,
    operation?: "EVEN" | "ODD",
    operationOn?: boolean
  ) => {
    let pre_pci_legend = false;
    let post_pci_legend = false;
    asyncHandler(async () => {
      const media = workbook.model.media;
      const images = worksheet.getImages();
      images.sort((a, b) => {
        if (a.range.tl.row !== b.range.tl.row)
          return a.range.tl.row - b.range.tl.row;
        return a.range.tl.col - b.range.tl.col;
      });
      let counter = 0;
      images.forEach((img) => {
        const image = media[parseInt(img.imageId)];
        const image_name = this.getImageName(
          site_data,
          names[counter],
          image.extension
        );
        const dimensions = imageSize(Buffer.from(image.buffer));
        const isvalid = dimensions.width <= 15 ? false : true;
        // console.log(names[counter], dimensions);
        // operation off
        if (isvalid && !operationOn) {
          if (names[counter] != "IGNORE") {
            fs.writeFileSync(
              path.join(storage_path, image_name),
              Buffer.from(image?.buffer)
            );
            hash[names[counter]] = image_name;
          }
          counter++;
        }
        // operation on
        const curr_op = counter % 2 == 0 ? "EVEN" : "ODD";
        if (isvalid && operationOn) {
          if (
            operation === "EVEN" &&
            curr_op === "ODD" &&
            pre_pci_legend == false &&
            names[counter] == "POST_PCI"
          ) {
            if (dimensions.width < 210) {
              const name = this.getImageName(
                site_data,
                "PRE_PCI_LEGEND",
                image.extension
              );
              hash["PRE_PCI_LEGEND"] = name;
              fs.writeFileSync(
                path.join(storage_path, name),
                Buffer.from(image?.buffer)
              );
              pre_pci_legend = true;
            }
          } else if (
            operation === "ODD" &&
            curr_op === "EVEN" &&
            post_pci_legend == false &&
            names[counter] == "PRE_RSRP"
          ) {
            if (dimensions.width < 210) {
              const name = this.getImageName(
                site_data,
                "POST_PCI_LEGEND",
                image.extension
              );
              hash["POST_PCI_LEGEND"] = name;
              fs.writeFileSync(
                path.join(storage_path, name),
                Buffer.from(image?.buffer)
              );
              post_pci_legend = true;
            }
          } else if (
            dimensions.width > 300 &&
            ((operation === "EVEN" && curr_op === "EVEN") ||
              (operation === "ODD" && curr_op === "ODD"))
          ) {
            fs.writeFileSync(
              path.join(storage_path, image_name),
              Buffer.from(image?.buffer)
            );
            hash[names[counter]] = image_name;
            counter++;
          } else if (dimensions.width > 300) {
            counter++;
          }
        }
      });
    });
  };

  // header
  insertHeader = async (worksheet: Worksheet, options: IOptions) => {
    const { name, range, style, merge } = options;
    const [startCell] = range.split(":");
    if (merge && range.includes(":")) {
      worksheet.mergeCells(range);
    }
    const cell = worksheet.getCell(startCell);
    cell.value = name;
    if (style) {
      Object.assign(cell, { style });
    }
  };

  styleFormat = (
    value: string,
    color: string,
    background_color: string,
    range: string,
    size: number,
    style: string,
    border_color: string,
    merge: boolean
  ) => {
    return {
      name: value,
      style: {
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: background_color },
        },
        font: {
          color: { argb: color },
          size: size,
        },
        alignment: {
          horizontal: "center",
          vertical: "middle",
        },
        border: {
          style: style,
          color: {
            argb: border_color,
          },
        },
      },
      merge: merge,
      range: range,
    };
  };

  // format output workbook by range methods
  formatWorksheetByRanges = async (
    format_worksheet: Worksheet,
    output_worksheet: Worksheet,
    ranges: IRange[]
  ) => {
    if (!ranges.length) return;
    ranges.forEach((range) => {
      switch (range.method) {
        case "FormaWorksheetColumnsByColumnsRange":
          this.formatWorksheetColumnsByColumnsRange(
            range.output_start,
            range.output_end,
            range.format_start,
            range.format_end,
            format_worksheet,
            output_worksheet
          );
          break;
        case "FormatWorksheetColumnsByColumn":
          this.formatWorksheetColumnsByColumn(
            range.format_start,
            format_worksheet,
            output_worksheet,
            range.output_start,
            range.output_end
          );
          break;
        case "FormatWorksheetRowsByRowsRange":
          this.formatWorksheetRowsByRowsRange(
            range.output_start,
            range.output_end,
            range.format_start,
            range.format_end,
            format_worksheet,
            output_worksheet
          );
          break;
        case "FormatWorksheetRowsByRow":
          this.formatWorksheetRowsByRow(
            range.format_start,
            format_worksheet,
            output_worksheet,
            range.output_start,
            range.output_end
          );
          break;
        default:
          logger.warn("Invalid format method");
      }
    });
  };

  // formated output workbook step 1
  formatOutputWorkbook = async (
    sheets_format: WorkbooksFormats,
    format_name: FileOperationFormats
  ) => {
    const format = sheets_format[format_name];
    const format_workbook = (await getWorkbook(
      path.join(PATHS.FILE_FORMATS_PATH, format.workbook_name)
    )) as Workbook;
    const output_workbook = workbookIntializer();
    format_workbook.eachSheet((worksheet) => {
      const sheet = format.sheets.find(
        (ws) => ws.sheet_name === worksheet.name.toUpperCase()
      );
      output_workbook.addWorksheet(worksheet.name);
      const output_worksheet = getWorksheet(
        output_workbook,
        worksheet.name
      ) as Worksheet;
      if (sheet && sheet.type === "customize") {
        this.formatWorksheetByRanges(
          worksheet,
          output_worksheet,
          sheet.ranges as IRange[]
        );
      } else {
        this.formatWorksheetByAllColumns(worksheet, output_worksheet);
      }
    });
    return output_workbook;
  };

  insertImage = (
    workbook: Workbook,
    worksheet: Worksheet,
    image_path: string,
    image_name: string,
    rs: number,
    re: number,
    cs: number,
    ce: number
  ) => {
    asyncHandler(async () => {
      if (!image_path || !image_name) return;
      const imageId = workbook.addImage({
        filename: image_path,
        extension: path.extname(image_name).slice(1) as "png" | "jpeg",
      });
      const range = {
        tl: {
          col: cs,
          row: rs,
        },
        br: {
          col: ce,
          row: re,
        },
      };
      worksheet.addImage(imageId, range as ImageRange);
    });
  };

  // common method of files
  insertPlots = async (
    workbook: Workbook,
    worksheet: Worksheet,
    storage_path: string,
    hash: Record<string, string>,
    plots_format: string[],
    start_row: number,
    end_row: number,
    column_start: number,
    column_end: number,
    file_type: string,
    file_path: string,
    operation?: "EVEN" | "ODD",
    operationOn?: boolean
  ) => {
    const inserted_plots: ISnap[] = [];
    const gap = start_row - 1;
    const len = file_type.toUpperCase() == "SCFT" ? 9 : plots_format.length;
    const end = end_row;
    let index = 0;
    while (index < len) {
      end_row = end * (index + 1) - index;
      if (!operationOn) {
        this.insertImage(
          workbook,
          worksheet,
          path.join(storage_path, hash[plots_format[index]]),
          hash[plots_format[index]],
          start_row,
          end_row,
          column_start,
          column_end
        );
        inserted_plots.push({
          filename: "",
          destination: path.join(storage_path, hash[plots_format[index]]),
        });
        index++;
        start_row = end_row + gap;
      } else {
        const shouldInsert =
          (operation === "EVEN" && index % 2 === 0) ||
          (operation === "ODD" && index % 2 !== 0);

        if (shouldInsert) {
          const logicalBlockIndex = Math.floor(index / 2);
          end_row = end * (logicalBlockIndex + 1) - logicalBlockIndex;
          this.insertImage(
            workbook,
            worksheet,
            path.join(storage_path, hash[plots_format[index]]),
            hash[plots_format[index]],
            start_row,
            end_row,
            column_start,
            column_end
          );
          inserted_plots.push({
            filename: "",
            destination: path.join(storage_path, hash[plots_format[index]]),
          });
          start_row = end_row + gap;
          index += 2;
        } else {
          index++;
        }
      }
    }
    if (
      ["SCFT PLOTS", "VOLTE PLOTS"].includes(worksheet.name.toUpperCase()) &&
      file_type == "SCFT"
    ) {
      this.insertImage(
        workbook,
        worksheet,
        path.join(storage_path, hash["ROUTE"]),
        hash["ROUTE"],
        4,
        41,
        11,
        20
      );
      inserted_plots.push({
        filename: "",
        destination: path.join(storage_path, hash["ROUTE"]),
      });
    }

    if (
      worksheet.name.toUpperCase() === "PRE & POST COMPARISON" &&
      file_type === "CAT"
    ) {
      const name = operation === "EVEN" ? "PRE_PCI_LEGEND" : "POST_PCI_LEGEND";
      const cs = operation === "EVEN" ? 2 : 9;
      const ce = operation === "EVEN" ? 4 : 11;
      this.insertImage(
        workbook,
        worksheet,
        path.join(storage_path, hash[name]),
        hash[name],
        131,
        135,
        cs,
        ce
      );
      inserted_plots.push({
        filename: "",
        destination: path.join(storage_path, hash[name]),
      });
    }
    await workbook.xlsx.writeFile(file_path);
    return inserted_plots;
  };

  auditSheet = async (worksheet: Worksheet, site_data: ISiteReportData) => {
    const { tower_data, building_data, sectors, file_type } = site_data;
    const operations = [
      { value: tower_data.siteId, column: 1 }, // site id
      {
        value: Array.from(
          { length: tower_data.sectors },
          (_, index) =>
            `${tower_data.siteId}_${String.fromCharCode(65 + index)}`
        ),
        column: 2,
      }, // sectors name
      { value: tower_data.latitude, column: 3 }, // latitude
      { value: tower_data.longitude, column: 4 }, // longitude
      { value: tower_data.tech, column: 5 }, // tech
      {
        value: (sectors.antenna_heights as IScftTowerComponent).data.values.map(
          (height: number) => height + building_data.building_height
        ),
        column: 6,
      }, // agl height
      {
        value: building_data.building_height,
        column: 7,
      }, // building height
      { value: tower_data.tower_height, column: 8 }, // tower height
      { value: tower_data.tower_type, column: 9 }, // tower type
      {
        value: (sectors.azimuths as ICatTowerComponent).data.pre_values,
        file_type: "CAT",
        column: 11,
      }, // azimuth pre values (4g cat)
      {
        value: (sectors.azimuths as ICatTowerComponent).data.post_values,
        file_type: "CAT",
        column: 12,
      }, // azimuth post values (4g cat)
      {
        value: (sectors.azimuths as IScftTowerComponent).data.values,
        file_type: "SCFT",
        column: 11,
      }, // azimuth values (4g scft)
      {
        value: (sectors.mechanical_tilts as ICatTowerComponent).data.pre_values,
        file_type: "CAT",
        column: 13,
      }, // mechanical tilt pre values (4g cat)
      {
        value: (sectors.mechanical_tilts as ICatTowerComponent).data
          .post_values,
        file_type: "CAT",
        column: 14,
      }, // mechanical tilt post values (4g cat)
      {
        value: (sectors.mechanical_tilts as IScftTowerComponent).data.values,
        file_type: "SCFT",
        column: 12,
      }, // mechanical tilt values (4g scft)
      {
        value: (sectors.electrical_tilts as ICatTowerComponent).data.pre_values,
        file_type: "CAT",
        column: 15,
      }, // electrical tilt pre values (4g cat)
      {
        value: (sectors.electrical_tilts as ICatTowerComponent).data
          .post_values,
        file_type: "CAT",
        column: 16,
      }, // electrical tilt values (4g cat)
      {
        value: (sectors.electrical_tilts as IScftTowerComponent).data.values,
        file_type: "SCFT",
        column: 13,
      }, // electrical tilt values (4g scft)
      { value: 200, column: file_type === "SCFT" ? 14 : 17 }, // power
      { value: todayDate(), column: file_type === "SCFT" ? 15 : 18 }, // date
    ];

    operations.forEach((operation) => {
      if (
        !operation.file_type ||
        (operation.file_type && operation.file_type == site_data.file_type)
      ) {
        this.addDataToWorksheetWithColumnRange(
          tower_data.sectors,
          worksheet.getColumn(operation.column),
          operation.value
        );
      }
    });
  };

  Plots = async (
    input_sheet_name: string,
    output_worksheet: Worksheet,
    input_workbook: Workbook,
    output_workbook: Workbook,
    site_data: ISiteReportData
  ) => {
    const input_worksheet = getWorksheet(
      input_workbook,
      input_sheet_name
    ) as Worksheet;

    const NETWORK =
      site_data.network.toUpperCase() == "4G"
        ? PLOTS_FORMAT._4G
        : PLOTS_FORMAT._5G;

    const PLOTS =
      site_data.file_type.toUpperCase() == "SCFT"
        ? (NETWORK as _4G_PLOTS).SCFT
        : (NETWORK as _4G_PLOTS).CAT;

    switch (input_sheet_name.toUpperCase()) {
      case "PLOT":
        const { SCFT_PLOTS } = PLOTS as _4G_SCFT_PLOTS;
        const scft_plots: Record<string, string> = {};
        this.extractImages(
          input_workbook,
          input_worksheet,
          SCFT_PLOTS.STORAGE_PATH,
          SCFT_PLOTS.INPUT_FORMAT,
          scft_plots,
          site_data
        );
        const inserted_scft_plots = await this.insertPlots(
          output_workbook,
          output_worksheet,
          SCFT_PLOTS.STORAGE_PATH,
          scft_plots,
          SCFT_PLOTS.OUTPUT_FORMAT,
          4,
          41,
          0,
          9,
          site_data.file_type,
          site_data.output_file_path as string
        );
        site_data.plots?.push(inserted_scft_plots);
        break;

      case "VOLTE PLOTS":
        const { VOLTE_PLOTS } = PLOTS as _4G_SCFT_PLOTS;
        const volte_plots: Record<string, string> = {};
        this.extractImages(
          input_workbook,
          input_worksheet,
          VOLTE_PLOTS.STORAGE_PATH,
          VOLTE_PLOTS.INPUT_FORMAT,
          volte_plots,
          site_data
        );
        const inserted_scft_volte_plots = await this.insertPlots(
          output_workbook,
          output_worksheet,
          VOLTE_PLOTS.STORAGE_PATH,
          volte_plots,
          VOLTE_PLOTS.OUTPUT_FORMAT,
          4,
          41,
          0,
          9,
          site_data.file_type,
          site_data.output_file_path as string
        );
        site_data.plots?.push(inserted_scft_volte_plots);
        break;

      case "PRE FDD AT PLOTS":
        const { PRE_DRIVE_PLOTS } = PLOTS as _4G_CAT_PLOTS;
        const pre_drive_plot: Record<string, string> = {};
        this.extractImages(
          input_workbook,
          input_worksheet,
          PRE_DRIVE_PLOTS.STORAGE_PATH,
          PRE_DRIVE_PLOTS.INPUT_FORMAT,
          pre_drive_plot,
          site_data
        );
        const inserted_cat_pre_drive_plots = await this.insertPlots(
          output_workbook,
          output_worksheet,
          PRE_DRIVE_PLOTS.STORAGE_PATH,
          pre_drive_plot,
          PRE_DRIVE_PLOTS.OUTPUT_FORMAT,
          2,
          35,
          0,
          1,
          site_data.file_type,
          site_data.output_file_path as string
        );
        site_data.plots?.push(inserted_cat_pre_drive_plots);

        break;

      case "POST FDD AT PLOTS":
        const { POST_DRIVE_PLOTS } = PLOTS as _4G_CAT_PLOTS;
        const post_drive_plot: Record<string, string> = {};
        this.extractImages(
          input_workbook,
          input_worksheet,
          POST_DRIVE_PLOTS.STORAGE_PATH,
          POST_DRIVE_PLOTS.INPUT_FORMAT,
          post_drive_plot,
          site_data
        );
        const inserted_cat_post_drive_plots = await this.insertPlots(
          output_workbook,
          output_worksheet,
          POST_DRIVE_PLOTS.STORAGE_PATH,
          post_drive_plot,
          POST_DRIVE_PLOTS.OUTPUT_FORMAT,
          2,
          35,
          5,
          6,
          site_data.file_type,
          site_data.output_file_path as string
        );
        site_data.plots?.push(inserted_cat_post_drive_plots);
        break;

      case "PRE FDD AT ZOOM PLOTS":
        const { PRE_LTE_CAT_PLOTS } = PLOTS as _4G_CAT_PLOTS;
        const pre_lte_plots: Record<string, string> = {};
        this.extractImages(
          input_workbook,
          input_worksheet,
          PRE_LTE_CAT_PLOTS.STORAGE_PATH,
          PRE_LTE_CAT_PLOTS.INPUT_FORMAT,
          pre_lte_plots,
          site_data
        );
        const inserted_cat_pre_lte_plots = await this.insertPlots(
          output_workbook,
          output_worksheet,
          PRE_LTE_CAT_PLOTS.STORAGE_PATH,
          pre_lte_plots,
          PRE_LTE_CAT_PLOTS.OUTPUT_FORMAT,
          5,
          72,
          0,
          1,
          site_data.file_type,
          site_data.output_file_path as string
        );
        site_data.plots?.push(inserted_cat_pre_lte_plots);
        break;

      case "POST FDD AT ZOOM PLOTS":
        const { POST_LTE_CAT_PLOTS } = PLOTS as _4G_CAT_PLOTS;
        const post_lte_plots: Record<string, string> = {};
        this.extractImages(
          input_workbook,
          input_worksheet,
          POST_LTE_CAT_PLOTS.STORAGE_PATH,
          POST_LTE_CAT_PLOTS.INPUT_FORMAT,
          post_lte_plots,
          site_data
        );
        const inserted_cat_post_lte_plots = await this.insertPlots(
          output_workbook,
          output_worksheet,
          POST_LTE_CAT_PLOTS.STORAGE_PATH,
          post_lte_plots,
          POST_LTE_CAT_PLOTS.OUTPUT_FORMAT,
          5,
          72,
          5,
          6,
          site_data.file_type,
          site_data.output_file_path as string
        );
        site_data.plots?.push(inserted_cat_post_lte_plots);
        break;

      case "PRE VOLTE DRIVE TEST ZOOM PLOT":
        const { PRE_VOLTE_CAT_PLOTS } = PLOTS as _4G_CAT_PLOTS;
        const pre_volte_plots: Record<string, string> = {};
        this.extractImages(
          input_workbook,
          input_worksheet,
          PRE_VOLTE_CAT_PLOTS.STORAGE_PATH,
          PRE_VOLTE_CAT_PLOTS.INPUT_FORMAT,
          pre_volte_plots,
          site_data
        );
        const inserted_cat_pre_volte_plots = await this.insertPlots(
          output_workbook,
          output_worksheet,
          PRE_VOLTE_CAT_PLOTS.STORAGE_PATH,
          pre_volte_plots,
          PRE_VOLTE_CAT_PLOTS.OUTPUT_FORMAT,
          4,
          40,
          1,
          2,
          site_data.file_type,
          site_data.output_file_path as string
        );
        site_data.plots?.push(inserted_cat_pre_volte_plots);
        break;
      case "POST VOLTE DRIVE TEST ZOOM PLO":
        const { POST_VOLTE_CAT_PLOTS } = PLOTS as _4G_CAT_PLOTS;
        const post_volte_plots: Record<string, string> = {};
        this.extractImages(
          input_workbook,
          input_worksheet,
          POST_VOLTE_CAT_PLOTS.STORAGE_PATH,
          POST_VOLTE_CAT_PLOTS.INPUT_FORMAT,
          post_volte_plots,
          site_data
        );
        const inserted_cat_post_volte_plots = await this.insertPlots(
          output_workbook,
          output_worksheet,
          POST_VOLTE_CAT_PLOTS.STORAGE_PATH,
          post_volte_plots,
          POST_VOLTE_CAT_PLOTS.OUTPUT_FORMAT,
          4,
          40,
          6,
          7,
          site_data.file_type,
          site_data.output_file_path as string
        );
        site_data.plots?.push(inserted_cat_post_volte_plots);
        break;
      default:
        logger.warn(input_sheet_name.toUpperCase());
    }
  };

  insertBlockageSnaps = async (
    worksheet: Worksheet,
    range: string,
    row_start: number,
    col_start: number,
    output_workbook: Workbook,
    blockage_snaps: ISnap[]
  ) => {
    if (!blockage_snaps.length) return;
    const options = this.styleFormat(
      "POOR SINR / BLOCKAGE SNAPS",
      "FF0000FF",
      "FFE0F0FF",
      range,
      30,
      "thick",
      "FF0000FF",
      true
    );
    this.insertHeader(worksheet, options as IOptions);
    const len = blockage_snaps.length;
    const grid = (end: number) => {
      let start = 0;
      const key = end;
      while (start <= end) {
        const mid = Math.round(start + (end - start) / 2);
        if (mid * mid == key) return mid;
        else if (mid * mid > end) end = mid - 1;
        else start = mid + 1;
      }
      return end;
    };
    let blockage_index = 0;
    let blockageGrid = grid(len);
    if (blockageGrid * blockageGrid != len)
      blockageGrid =
        blockageGrid + Math.ceil((len - blockageGrid * blockageGrid) / 2);
    for (let row = 0; row < blockageGrid; row++) {
      let rs = row_start + row * 9 + 2 * row;
      if (row == 0) {
        rs = row_start;
      }
      let cs = col_start;
      for (let column = 0; column < blockageGrid; column++) {
        if (blockage_index >= len) break;
        const snap = blockage_snaps[blockage_index];
        this.insertImage(
          output_workbook,
          worksheet,
          snap.destination,
          snap.filename,
          rs,
          rs + 9,
          cs,
          cs + 3
        );
        cs += 4;
        blockage_index++;
      }
    }
  };

  getExcelColumn = (colNum: number): string => {
    let col = "";
    while (colNum > 0) {
      const rem = (colNum - 1) % 26;
      col = String.fromCharCode(65 + rem) + col;
      colNum = Math.floor((colNum - 1) / 26);
    }
    return col;
  };
}
