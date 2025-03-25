import React from "react";
import { Svg, Path, G, Defs, Rect } from "react-native-svg";
import tw from "twrnc";

const StatisticIcon = () => {
  return (
    <Svg
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
    >
      <G clipPath="url(#clip0_36_452)">
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M4.72242 2.69482C4.72242 1.45219 3.71505 0.444824 2.47241 0.444824C1.22977 0.444824 0.222412 1.45219 0.222412 2.69482V39.3047C0.222412 40.5476 1.22977 41.5547 2.47241 41.5547H39.0824C40.325 41.5547 41.3324 40.5476 41.3324 39.3047C41.3324 38.0621 40.325 37.0547 39.0824 37.0547H4.72242V2.69482ZM30.6644 7.29366C30.0032 6.82146 29.179 6.63756 28.3799 6.78402C27.5808 6.93048 26.8753 7.39479 26.4246 8.07075L17.1899 21.9229L12.7371 17.4701C11.5655 16.2985 9.66603 16.2985 8.49444 17.4701C7.32288 18.6416 7.32288 20.5411 8.49444 21.7127L15.5348 28.7531C16.1704 29.3886 17.0573 29.7057 17.9518 29.6172C18.8461 29.5286 19.6537 29.0437 20.1523 28.2959L29.6983 13.9769L37.0334 19.2164C38.3819 20.1795 40.2554 19.8672 41.2184 18.519C42.1814 17.1707 41.8691 15.2971 40.5209 14.334L30.6644 7.29366Z"
          fill="white"
        />
      </G>
      <Defs>
        <clipPath id="clip0_36_452">
          <Rect width="42" height="42" fill="white" />
        </clipPath>
      </Defs>
    </Svg>
  );
};

export default StatisticIcon;
