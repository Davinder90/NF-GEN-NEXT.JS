"use client";
import { PyramidLoader } from "@components/Loader/Loader";
import { CustomFileType } from "@type/helpers.types";
import {
  handleDeleteFile,
  handleDownloadReport,
  handleGetFiles,
} from "@/src/requests/files.requests";
import { useEffect, useState } from "react";
import { IoDownloadOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFileExcel } from "react-icons/fa";
import toast from "react-hot-toast";

const FileContainer = ({
  file,
  index,
  deleteFunc,
  downloadFunc,
  disable,
}: {
  file: CustomFileType;
  index: number;
  deleteFunc: (val: number) => void;
  downloadFunc: (val: number) => void;
  disable: boolean;
}) => {
  return (
    <div className="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-black/20 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center gap-4">
        <FaFileExcel className="text-green-600 dark:text-green-500 text-xl" />
        <div className="flex flex-col">
          <p className="text-base font-medium text-gray-800 dark:text-white truncate max-w-xs">
            {file.filename}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Created: {file.modifiedAt.split(",")[0]}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Size: {file?.sizeInMB ? parseInt(file.sizeInMB).toFixed(2) : 0} MB
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => downloadFunc(index)}
          disabled={disable}
          className={`p-2 rounded-full transition ${
            disable
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
          }`}
          title="Download File"
        >
          <IoDownloadOutline size={18} />
        </button>

        <button
          onClick={() => deleteFunc(index)}
          disabled={disable}
          className={`p-2 rounded-full transition ${
            disable
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600 text-white cursor-pointer"
          }`}
          title="Delete File"
        >
          <RiDeleteBin6Line size={18} />
        </button>
      </div>
    </div>
  );
};

const FilesPage = () => {
  const [files, setFiles] = useState<CustomFileType[]>([]);
  const [loader, setLoader] = useState(true);
  const [disable, setDisable] = useState(false);

  const handleDownload = async (index: number) => {
    const loadingToast = toast.loading("Downloading....");
    setDisable(true);
    const result = await handleDownloadReport(
      files[index].destination,
      files[index].filename
    );
    toast.dismiss(loadingToast);
    if (result && result.data) {
      const url = window.URL.createObjectURL(new Blob([result.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", files[index].filename as string);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // clean up memory
    } else {
      throw new Error("Download failed or file not found.");
    }
    setDisable(false);
  };

  const handleDelete = async (index: number) => {
    const loadingToast = toast.loading("Deleting....");
    setDisable(true);
    const path = `${files[index].destination.replace(/\/$/, "")}/${
      files[index].filename
    }`;
    const { success } = await handleDeleteFile(path);
    toast.dismiss(loadingToast);
    if (!success) {
      return setDisable(false);
    }
    setFiles((prevVal) => prevVal.filter((_, i) => i !== index));
    setDisable(false);
  };

  const handleFiles = async () => {
    const {
      result: { Files },
    } = await handleGetFiles();
    setFiles(Files);
    setLoader(false);
  };

  useEffect(() => {
    handleFiles();
  }, []);

  if (loader) return <PyramidLoader />;

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100 dark:bg-black text-gray-800 dark:text-white transition-colors">
      <h2 className="text-3xl font-bold mb-6 text-center">📁 Output Files</h2>

      <div className="space-y-3 max-w-4xl mx-auto">
        {files.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 text-lg py-10">
            No output reports are currently available. Please generate a report
            to view it here.
          </div>
        ) : (
          files.map((file, index) => (
            <FileContainer
              key={index}
              index={index}
              file={file}
              deleteFunc={handleDelete}
              downloadFunc={handleDownload}
              disable={disable}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FilesPage;
