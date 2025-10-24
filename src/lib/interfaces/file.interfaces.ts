import { Alignment, Border, Fill, Font } from "exceljs";

export interface IPartialStyle {
  font?: Partial<Font>;
  alignment?: Partial<Alignment>;
  fill?: Partial<Fill>;
  border?: Partial<Border>;
  numFmt?: string;
}

export interface IOptions {
  name: string;
  range: string;
  style?: IPartialStyle;
  merge: boolean;
}

export interface IRange {
  format_start: number;
  format_end: number;
  output_start: number;
  output_end: number;
  method:
    | "FormaWorksheetColumnsByColumnsRange"
    | "FormatWorksheetColumnsByColumn"
    | "FormatWorksheetRowsByRowsRange"
    | "FormatWorksheetRowsByRow";
}

export interface ISheetFormat {
  sheet_name: string;
  type: "full" | "customize";
  ranges?: IRange[];
}

export interface IFormat {
  workbook_name: string;
  sheets: ISheetFormat[];
}
