import { ImUngroup } from "react-icons/im";
import { TiSortAlphabeticallyOutline } from "react-icons/ti";
import { AiOutlineAlignLeft } from "react-icons/ai";
import { getLabelSelections } from "./lib/lists";
import { ReactSelectDropdown } from "../ReactSelectDropdown";

const defaultGroupSelections = {
  "no-group": {
    id: "no-group",
    name: "no-group",
    icon: <ImUngroup />,
    description: "No Grouping",
    value: "no-group",
    labelValue: null,
    key: "no-group"
  },
  canary_name: {
    id: "canary_name",
    name: "canary_name",
    icon: <TiSortAlphabeticallyOutline />,
    description: "Group Name",
    value: "canary_name",
    labelValue: null,
    key: "canary_name"
  },
  name: {
    id: "name",
    name: "name",
    icon: <TiSortAlphabeticallyOutline />,
    description: "Name",
    value: "name",
    labelValue: null,
    key: "name"
  },
  description: {
    id: "description",
    name: "description",
    icon: <AiOutlineAlignLeft />,
    description: "Description",
    value: "description",
    labelValue: null,
    key: "description"
  }
};

export function GroupByDropdown({ checks, ...rest }) {
  const items = getLabelSelections(checks, defaultGroupSelections);
  return <ReactSelectDropdown {...rest} items={items} />;
}
