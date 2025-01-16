import React from "react";
import { IActivableProps } from "./types";
import {
  inactiveColor,
  activeColor,
  activeAccentColor,
} from "./common/ActivableColor";

const Checkin = ({ active }: IActivableProps) => {
  return (
    <svg
      id="event-ok"
      xmlns="http://www.w3.org/2000/svg"
      width="66"
      height="66"
      viewBox="0 0 66 66"
    >
      <defs>
        <clipPath id="clip-path">
          <rect
            id="Rectangle_360"
            data-name="Rectangle 360"
            width="66"
            height="66"
            fill="none"
          />
        </clipPath>
      </defs>
      <g id="Group_856" data-name="Group 856" clipPath="url(#clip-path)">
        <path
          style={{ fill: active ? activeColor : inactiveColor }}
          id="Path_583"
          data-name="Path 583"
          d="M59.753,21.92a12.95,12.95,0,0,1,0,22.16A12.926,12.926,0,0,1,44.08,59.754a12.95,12.95,0,0,1-22.159,0A12.928,12.928,0,0,1,6.246,44.079a12.95,12.95,0,0,1,0-22.16A12.926,12.926,0,0,1,21.921,6.247a12.95,12.95,0,0,1,22.159,0A12.924,12.924,0,0,1,59.753,21.92M33,5.95A27.05,27.05,0,1,1,5.949,33,27.053,27.053,0,0,1,33,5.95Z"
          transform="translate(-0.001 0.001)"
          fillRule="evenodd"
        />
        <path
          style={{ fill: active ? activeAccentColor : inactiveColor }}
          id="Path_584"
          data-name="Path 584"
          d="M26.623,6A20.625,20.625,0,1,0,47.25,26.626,20.625,20.625,0,0,0,26.623,6M36.872,23.5,26.386,34.1a3.067,3.067,0,0,1-4.342.037L16.4,28.608c-2.875-2.836,1.429-7.21,4.307-4.379l3.459,3.387,8.351-8.442c2.844-2.863,7.2,1.464,4.356,4.329"
          transform="translate(6.375 6.376)"
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
};

export default Checkin;
