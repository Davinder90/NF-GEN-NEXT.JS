import { env_var } from "@/src/config/env.config";
import { FilesFormats, Network } from "@type/site.types";
import { SiteInput } from "../type/helpers.types";

// client routes
export const CLIENT_ROUTES = {
  HOME_ROUTE: "/",
  ADMIN_ROUTE: "/admin",
  LOGIN_ROUTE: "/login",
  SIGNUP_ROUTE: "/sign-up",
  SITES_ROUTE: "/sites",
  SITE_ROUTE: "/site",
  TASKS_ROUTE: "/tasks",
  FILES_ROUTE: "/files",
  ADD_SITE_ROUTE: "/add-site",
  UPDATE_SITE_ROUTE: "/update-site",
  FORMAT_ROUTE: "/format",
  IMPORT_SITES_ROUTE: "/import-sites",
};

// api routes
export const API_ROUTES = {
  // user routes
  USER_ROUTE: "/users",
  USER_SIGNUP_ROUTE: "/sign-up",
  USER_SIGNIN_ROUTE: "/sign-in",
  UPDATE_USER_ALLOWANCE: "/update-allowance",
  GET_USER_ALLOWANCE: "/get-allowance",
  DELETE_USER: "/delete",
  // admin routes
  ADMIN_ROUTE: "/admin",
  NEW_ADMIN_ROUTE: "/new-admin",
  VERIFY_ADMIN_ROUTE: "/verify-admin",
  // cell file routes
  SPREADSHEET_ROUTE: "/google-spreadsheet",
  SPREADSHEET_NEWSITES_ROUTE: "/add-newsites",
  // site routes
  SITE_ROUTE: "/sites",
  SITE_GET_SITES_ROUTE: "/get-sites",
  SITE_GET_SITE_ROUTE: "/get-site",
  SITE_CREATE_SITE_ROUTE: "/create-site",
  SITE_UPDATE_SITE_ROUTE: "/update-site",
  SITE_DELETE_SITE_ROUTE: "/delete-site",
  SITE_GET_TOTALSITES_ROUTE: "/total-sites",
  SITE_SITESNAMES_ROUTE: "/sites-names",
  SITE_ISVALID_SITE_ROUTE: "/isvalid-site",
  // file routes
  FILE_ROUTE: "/files",
  FILE_DELETE_FILE_ROUTE: "/delete-file",
  FILE_DELETE_FILES_ROUTE: "/delete-files",
  FILE_DOWNLOAD_FILE_ROUTE: "/download-file",
  FILE_UPLOAD_FILE_ROUTE: "/upload-file",
  FILE_UPLOAD_IMAGE_ROUTE: "/upload-image",
  FILE_GENERATE_REPORT_ROUTE: "/generate-report",
};

export const FILE_FORMATS: FilesFormats[] = [
  {
    name: "4G SCFT",
    formats: [
      {
        name: "4G_SCFT",
      },
    ],
    file_type: "SCFT",
    network: "4G",
    color: "#ffffff",
  },
  {
    name: "4G CAT",
    formats: [
      {
        name: "4G_CAT",
      },
    ],
    file_type: "CAT",
    network: "4G",
    color: "#ea580c",
  },
  {
    name: "5G CAT",
    formats: [
      {
        name: "5G_CAT",
      },
    ],
    file_type: "CAT",
    network: "5G",
    color: "#dc2626",
  },
  {
    name: "5G SCFT ANTS",
    formats: [
      {
        name: "5G_SCFT_ANTS",
      },
    ],
    file_type: "SCFT ANTS",
    network: "5G",
    color: "#2563eb",
  },
];

// error messages constants
export const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: "Internal server error, please try again later",
  INVALID_ROUTE: "Please enter the valid route",
};

export const SHEET_ID: Record<Network, string> = {
  // "2G": "",
  // "3G": "",
  "4G": env_var.CELLFILE_4G_ID as string,
  "5G": env_var.CELLFILE_5G_ID as string,
};

export const TowerInputs: SiteInput[] = [
  {
    name: "SiteId",
    placeHolder: "Enter the siteid",
    caption: "required",
    type: "text",
    value: "",
  },
  {
    name: "Latitude",
    placeHolder: "Enter the latitude",
    caption: "required",
    type: "text",
    value: "",
  },
  {
    name: "Longitude",
    placeHolder: "Enter the longitude",
    caption: "required",
    type: "text",
    value: "",
  },
  {
    name: "Tower Height",
    placeHolder: "Enter the tower height",
    caption: "required",
    type: "text",
    value: "",
  },
  {
    name: "Building Height",
    placeHolder: "Enter the building height",
    caption: "required",
    type: "text",
    value: "",
  },
];
