import UpsertSite from "@components/UpsertSite/UpsertSite";
import { TowerInputs } from "@utils/common-constants";

const AddSite = () => {
  return (
    <UpsertSite
      TowerInputs={TowerInputs}
      SectorsInput={[]}
      buttonName="Add Site"
      SiteId=""
      towerType="NA"
    />
  );
};

export default AddSite;
