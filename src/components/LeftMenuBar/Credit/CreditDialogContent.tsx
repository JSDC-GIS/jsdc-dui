import icon from "../../../icon";
import React from "react";
import "./CreditDialogContent.scss";

export interface ICreditDialogContentProps {
  description: string;
  herf?: string;
}

const CreditDialogContent: React.FC<ICreditDialogContentProps> = ({
  description,
  herf,
}: ICreditDialogContentProps) => {
  return (
    <div className="dui-CreditDialogContent">
      <div className="dui-CreditDialogContent-content">
        <span dangerouslySetInnerHTML={{ __html: description }}></span>
        <img className="qr-code" src={icon.credit.qrcode} alt="qrcode" />
      </div>
      <div className="final">
        <a href={herf}>
          <img src={icon.credit.logo} alt="jsdc-logo" />
        </a>
      </div>
    </div>
  );
};
CreditDialogContent.displayName = "CreditDialogContent";
export default CreditDialogContent;
