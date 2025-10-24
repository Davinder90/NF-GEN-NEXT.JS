"use client";
import { FileFormat, FilesFormats, FileType, Network } from "@type/site.types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FILE_FORMATS } from "@/src/lib/utils/common-constants";
import { useSelector } from "react-redux";
import { RootState } from "../redux-store/store";
import { SplashScreen } from "../components/Auth/AuthGaurd";

const FormatsBox = ({
  formats,
  network,
  file_type,
}: {
  formats: FileFormat[];
  network: Network;
  file_type: FileType;
}) => {
  const router = useRouter();
  const [format, setFormat] = useState<string>(formats[0].name);

  const handleFormat = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormat(event.target.value);
  };

  const handleFormatOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    router.push(
      `/format?network=${network}&file_type=${file_type}&format=${format}`
    );
  };

  return (
    <div className="w-full max-w-xs flex items-center gap-3">
      <select
        name="format"
        defaultValue={format}
        onChange={handleFormat}
        className="
      flex-1
      px-4 py-2
      text-sm
      rounded-md
      bg-white dark:bg-gray-800
      text-gray-800 dark:text-gray-100
      border border-gray-300 dark:border-gray-600
      focus:outline-none
      focus:ring-2
      focus:ring-black dark:focus:ring-white
      focus:ring-offset-2 dark:focus:ring-offset-gray-900
      transition duration-300 ease-in-out
      shadow-sm
    "
      >
        {formats.map((format, index) => (
          <option
            key={index}
            value={format.name}
            className="text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800"
          >
            {format.name}
          </option>
        ))}
      </select>

      <button
        className="
      px-4 py-2
      rounded-md
      bg-orange-600 dark:bg-orange-400
      text-white dark:text-black
      font-medium text-sm
      hover:bg-orange-700 dark:hover:bg-orange-300
      transition duration-300
      focus:outline-none
      focus:ring-2
      focus:ring-black dark:focus:ring-white
      focus:ring-offset-2 dark:focus:ring-offset-gray-900
      shadow-sm cursor-pointer
    "
        onClick={handleFormatOpen}
      >
        Open
      </button>
    </div>
  );
};

// File card box
const FileBox = ({ file }: { file: FilesFormats }) => {
  return (
    <div
      className="file-glow rounded-md shadow-2xl"
      style={{ "--glow-color": file.color } as React.CSSProperties}
    >
      {/* Overlay Content */}

      <div
        className="relative z-10 p-5 bg-white/10 dark:bg-black/30 backdrop-blur-md rounded-md"
        style={{
          boxShadow: `0 0 2px 1px ${file.color}`,
          border: `1px solid ${file.color}`,
        }}
      >
        <div>
          <p className="text-gray-900 dark:text-white font-bold text-lg mb-2">
            {file.name}
          </p>
          <p className="text-sm text-gray-800 dark:text-gray-300 font-medium">
            Formats:
          </p>
          <div className="mt-2 space-y-1">
            {file.formats.length > 0 ? (
              <FormatsBox
                formats={file.formats}
                network={file.network}
                file_type={file.file_type}
              />
            ) : (
              <p className="text-gray-500 italic text-sm">
                No formats available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const isAllowed = useSelector((state: RootState) => state.user.isAllowed);
  return (
    <>
      {!isAllowed ? (
        <SplashScreen />
      ) : (
        <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 dark:from-black dark:to-zinc-900 py-12 px-6 transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-2xl font-bold mb-12 text-center text-gray-900 dark:text-white font-serif italic tracking-wide transition-all duration-300 hover:scale-105">
              Generate Network Files
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
              {FILE_FORMATS.map((file, index) => (
                <FileBox key={index} file={file} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
