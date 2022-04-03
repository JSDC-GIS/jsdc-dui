import React from 'react';
import './index.scss';
export interface IButtonProps extends React.HTMLProps<HTMLButtonElement> {
    children: React.ReactNode;
    type?: "button" | "submit" | "reset" | undefined;
}
declare const Button: (props: IButtonProps) => JSX.Element;
export default Button;
