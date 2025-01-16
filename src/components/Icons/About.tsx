import React from "react";
import { IActivableProps } from "./types";
import {
  inactiveColor,
  activeColor,
  activeAccentColor,
} from "./common/ActivableColor";

const About = ({ active }: IActivableProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="32"
      viewBox="0 0 32 32"
      width="32"
    >
      <g fillRule="evenodd" transform="translate(122.211 -532.155)">
        <path
          style={{ fill: active ? activeColor : inactiveColor }}
          d="m-120.361 554.725-1.3 4.393a3.546 3.546 0 0 0 .868 3.488 3.549 3.549 0 0 0 3.471.936l4.526-1.243a15.52 15.52 0 0 0 6.584 1.456 15.607 15.607 0 0 0 15.6-15.6 15.607 15.607 0 0 0 -15.6-15.6 15.608 15.608 0 0 0 -15.6 15.6 15.5 15.5 0 0 0 1.451 6.57zm1.942.844a1.531 1.531 0 0 0 -.106-1.135 13.772 13.772 0 0 1 -1.506-6.279 13.827 13.827 0 0 1 13.82-13.82 13.827 13.827 0 0 1 13.821 13.82 13.827 13.827 0 0 1 -13.821 13.82 13.759 13.759 0 0 1 -6.279-1.506 1.524 1.524 0 0 0 -1.105-.114l-5.459 1.5a.768.768 0 0 1 -.753-.2.764.764 0 0 1 -.187-.755z"
        />
        <path
          style={{ fill: active ? activeAccentColor : inactiveColor }}
          d="m-111.883 546.737h11.345a1.418 1.418 0 0 0 1.418-1.418 1.419 1.419 0 0 0 -1.418-1.419h-11.345a1.42 1.42 0 0 0 -1.419 1.419 1.419 1.419 0 0 0 1.419 1.418z"
        />
        <path
          style={{ fill: active ? activeAccentColor : inactiveColor }}
          d="m-111.883 552.41h5.672a1.42 1.42 0 0 0 1.419-1.419 1.42 1.42 0 0 0 -1.419-1.418h-5.672a1.42 1.42 0 0 0 -1.419 1.418 1.42 1.42 0 0 0 1.419 1.419z"
        />
      </g>
      <path d="m0 0h32v32h-32z" fill="none" />
    </svg>
  );
};

export default About;
