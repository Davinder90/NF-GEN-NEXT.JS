export type sessionData = {
  email: string;
  access_token: string;
};

export type InvalidFormat = {
  state: boolean;
  errorMessage: string;
};

// site inputs types
export type SiteInput = {
  value: string | number;
  placeHolder: string;
  name: string;
  caption: string;
  type: string;
};

export type CustomFileType = {
  filename: string;
  createdAt: string;
  modifiedAt: string;
  destination: string;
  sizeInMB: string;
};

export type SectorInput = SiteInput[];

export const mimeTypeMap: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  bmp: "image/bmp",
  svg: "image/svg+xml",
  tiff: "image/tiff",
  ico: "image/x-icon",
};
