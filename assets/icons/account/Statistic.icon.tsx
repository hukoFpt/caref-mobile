import React from "react";
import { Path, Svg } from "react-native-svg";

const StatisticIcon = () => {
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
      <Path
        fill="black"
        d="M21 5.47 12 12 7.62 7.62 3 11V8.52L7.83 5l4.38 4.38L21 3v2.47zM21 15h-4.7l-4.17 3.34L6 12.41l-3 2.13V17l2.8-2 6.2 6 5-4h4v-2z"
      ></Path>
    </Svg>
  );
};

export default StatisticIcon;
