import React, {ReactNode} from "react";

export type BaseProps = {
    className: string;
    [key: string]: unknown; // what the hell is this ?
}

export type PropsWithChildren = {
    children: ReactNode;
}

export type ButtonProps = BaseProps & PropsWithChildren & {
    active: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export type MarkButtonProps = {
    format: string;
    icon: string;
};

export type IconProps = PropsWithChildren;

export type ToolbarProps = BaseProps & PropsWithChildren;

export type MenuProps = BaseProps & PropsWithChildren;
