"use client";
import { Formats, Network, FileType } from "@type/site.types";
import Formater from "@components/Formater/Formater";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formatChecker } from "@/src/lib/helpers/client.helpers";
import { InvalidFormat } from "@/src/lib/type/helpers.types";

const InvalidCrenditials = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black transition-colors duration-500">
      <div
        className="
      max-w-2xl
      px-10 py-8 
      rounded-2xl 
      bg-white-100 dark:bg-black 
      text-gray-900 dark:text-white 
      shadow-lg 
      glow-red
      transition-all duration-500
    "
      >
        <p className="text-xl font-semibold tracking-wide text-center">
          {message.toUpperCase()}
        </p>
      </div>
    </div>
  );
};

const Format = () => {
  const searchParams = useSearchParams();
  const network = searchParams.get("network") as Network;
  const file_type = searchParams.get("file_type") as FileType;
  const format = searchParams.get("format") as Formats;

  const [checker, setChecker] = useState<InvalidFormat>({
    state: true,
    errorMessage: "",
  });
  useEffect(() => {
    const result = formatChecker(network, format, file_type);
    if (result?.errorMessage) setChecker(result as InvalidFormat);
  }, [file_type, format, network]);

  if (!checker.state)
    return <InvalidCrenditials message={checker.errorMessage} />;

  return <Formater format={format} file_type={file_type} network={network} />;
};

export default Format;
