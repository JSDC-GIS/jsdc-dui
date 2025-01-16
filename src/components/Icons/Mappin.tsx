import React from "react";
import { IActivableProps } from "./types";
import {
  inactiveColor,
  activeColor,
  activeAccentColor,
} from "./common/ActivableColor";

const Mappin = ({ active }: IActivableProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="32"
      viewBox="0 0 32 32"
      width="32"
    >
      <g fillRule="evenodd" transform="translate(122.211 -377.572)">
        <path
          style={{ fill: active ? activeColor : inactiveColor }}
          d="m-96.812 396.206h-18.794l-6.2 8.87v1.666h31.2v-1.666zm-23.249 8.255 5.342-7.639h17.019l5.343 7.639z"
        />
        <path
          style={{ fill: active ? activeAccentColor : inactiveColor }}
          d="m-106.211 401.474s-8.394-8.155-8.394-12.791c0-11.042 16.789-11.042 16.789 0 0 4.635-8.395 12.791-8.395 12.791zm0-8.418a4.382 4.382 0 0 0 4.374-4.373 4.383 4.383 0 0 0 -4.374-4.374 4.382 4.382 0 0 0 -4.373 4.374 4.382 4.382 0 0 0 4.373 4.373z"
        />
      </g>
      <path d="m0 0h32v32h-32z" fill="none" />
    </svg>
  );
};

export default Mappin;
