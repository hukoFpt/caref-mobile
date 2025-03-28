import React from "react";
import { Svg, Path } from "react-native-svg";
import tw from "twrnc";

const PlusIcon = () => {
  return (
    <Svg
      stroke="currentColor"
      fill="currentColor"
      stroke-width="0"
      viewBox="0 0 24 24"
      height="24px"
      width="24px"
    >
      <Path fill="none" d="M0 0h24v24H0z"></Path>
      <Path fill="#2563eb" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></Path>
    </Svg>
  );
};

export default PlusIcon;
