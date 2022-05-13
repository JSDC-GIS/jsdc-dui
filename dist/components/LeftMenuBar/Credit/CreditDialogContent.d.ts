/// <reference types="react" />
import './CreditDialogContent.scss';
export interface ICreditDialogContentProps {
    description: string;
    herf?: string;
}
declare const CreditDialogContent: ({ description, herf }: ICreditDialogContentProps) => JSX.Element;
export default CreditDialogContent;
