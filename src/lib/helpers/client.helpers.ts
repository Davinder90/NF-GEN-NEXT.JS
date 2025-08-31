import {
  FileType,
  FileTypes,
  Formats,
  Network,
  Networks,
} from "@type/site.types";

export const asyncResponseHandler = async <T>(
  fn: () => Promise<T>
): Promise<T | unknown> => {
  try {
    return await fn();
  } catch (error) {
    return error;
  }
};

export const formatChecker = (
  network: Network,
  format: Formats,
  file_type: FileType
) => {
  if (!Networks.includes(network))
    return { state: false, errorMessage: `${network} is invalid network` };
  if (!Formats.includes(format))
    return { state: false, errorMessage: `${format} is invalid format` };
  if (!FileTypes.includes(file_type))
    return { state: false, errorMessage: `${file_type} is invalid file type` };
};
