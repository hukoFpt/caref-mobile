import React from "react";
import { Svg, Path } from "react-native-svg";
import tw from "twrnc";

const EditIcon = () => {
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
      <Path fill="blue" d="M3 10h11v2H3v-2zm0-2h11V6H3v2zm0 8h7v-2H3v2zm15.01-3.13.71-.71a.996.996 0 0 1 1.41 0l.71.71c.39.39.39 1.02 0 1.41l-.71.71-2.12-2.12zm-.71.71-5.3 5.3V21h2.12l5.3-5.3-2.12-2.12z"></Path>
    </Svg>
  );
};

export default EditIcon;
