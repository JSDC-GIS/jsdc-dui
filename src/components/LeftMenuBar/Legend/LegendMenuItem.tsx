import MenuItemWithDialog, {
  IMenuItemWithDialogProps,
} from "../..//LeftMenuBar/MenuList/MenuItemWithDialog";
import icon from "../../../icon";
import React from "react";
import LegendDialogContent, {
  ILegendDialogContentProps,
} from "./LegendDialogContent";
import Hamburger from "../../Icons/Hamburger";

export interface ILegendMenuItemProps
  extends Omit<IMenuItemWithDialogProps, "title" | "Icon" | "children">,
    ILegendDialogContentProps {}

const LegendMenuItem: React.FC<ILegendMenuItemProps> = (
  props: ILegendMenuItemProps,
) => {
  return (
    <MenuItemWithDialog {...props} title="圖例說明" Icon={Hamburger}>
      <LegendDialogContent activeLegends={props.activeLegends} />
    </MenuItemWithDialog>
  );
};
LegendMenuItem.displayName = "LegendMenuItem";
export default LegendMenuItem;
