import exceljs, { Workbook, Worksheet } from "exceljs";

export const workbookIntializer = () => {
  return new exceljs.Workbook();
};

export const getWorkbook = async (path: string) => {
  if (!path) return undefined;
  const workbook = workbookIntializer();
  return await workbook.xlsx.readFile(path);
};

export const getWorksheet = (
  workbook: Workbook,
  sheet_name: string
): Worksheet | null => {
  if (!workbook || !sheet_name) return null;
  return workbook.getWorksheet(sheet_name) as Worksheet;
};
