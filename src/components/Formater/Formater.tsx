import { FileType, Formats, Network } from "@type/site.types";
import Formats4G from "./4GFormats";
import Formats5G from "./5GFormats";

const Formater = ({
  format,
  network,
  file_type,
}: {
  network: Network;
  format: Formats;
  file_type: FileType;
}) => {
  switch (network) {
    case "2G":
      return <div></div>;
    case "3G":
      return <div></div>;
    case "4G":
      return <Formats4G format={format} file_type={file_type} />;
    case "5G":
      return <Formats5G format={format} file_type={file_type} />;
  }
};

export default Formater;
