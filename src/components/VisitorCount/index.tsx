import React from "react";
import { counter } from "../../icon";
import "./index.scss";

export interface IVisitorCountProps {
  value: number;
}

const VisitorCount = ({ value }: IVisitorCountProps) => {
  const displayValue = String(value).padStart(10, "0");
  return (
    <div className="dui-VisitorCount">
      <div className="dui-VisitorCount-title">瀏覽人次</div>
      <div className="dui-VisitorCount-display">
        {displayValue.split("").map((val, key) => (
          <img key={key} src={counter[val]} alt={String(key)} />
        ))}
      </div>
    </div>
  );
};

export default VisitorCount;
