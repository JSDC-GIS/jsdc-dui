import React from 'react'

interface INavigatorArrowProps {
  color?: string
}
const NavigatorArrow = ({ color= 'var(--dui-primary)' }: INavigatorArrowProps) => {
  return (
    <svg id="nav-icon" xmlns="http://www.w3.org/2000/svg" width="25" height="25.005" viewBox="0 0 25 25.005">
      <defs>
        <clipPath id="clip-path">
          <rect id="Rectangle_1067" data-name="Rectangle 1067" width="25" height="25.005" transform="translate(0 0)" fill="none" />
        </clipPath>
      </defs>
      <g id="Group_943" data-name="Group 943" transform="translate(0 0)">
        <g id="Group_947" data-name="Group 947" clipPath="url(#clip-path)">
          <path id="Path_711" data-name="Path 711" d="M12.5,0A12.267,12.267,0,0,1,25,12.021v.962A12.267,12.267,0,0,1,12.5,25,12.267,12.267,0,0,1,0,12.983v-.962A12.267,12.267,0,0,1,12.5,0" style={{ fill: color }} />
          <path id="Path_712" data-name="Path 712" d="M12.512,5.182a.433.433,0,0,0-.4.255L7.279,16.4a.431.431,0,0,0,.591.557l4.638-2.337,4.64,2.339a.431.431,0,0,0,.59-.558L12.907,5.438a.431.431,0,0,0-.4-.255Z" fill="#fff" />
        </g>
      </g>
    </svg>
  )
}

export default NavigatorArrow
