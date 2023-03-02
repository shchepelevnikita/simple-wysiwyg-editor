import React, {ReactNode, SyntheticEvent} from "react";

export type BaseProps = {
    className?: string;
    [key: string]: unknown; // what the hell is this ?
    onClick?: (event: SyntheticEvent) => void;
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

export type PredictionProps = BaseProps & {
    predictions: string[];
};

export type Hotkeys = {
    [key: string]: string;
}
