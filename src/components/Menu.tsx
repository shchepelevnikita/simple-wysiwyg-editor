import React, {PropsWithChildren, Ref} from "react";
import {css, cx} from "@emotion/css";

export interface BaseProps {
    className: string
    [key: string]: unknown
}

export type OrNull<T> = T | null;

export const Menu = React.forwardRef(
    (
        { className, ...props }: PropsWithChildren<BaseProps>,
        ref: Ref<OrNull<HTMLDivElement>>
    ) => (
        <div
            {...props}
            // @ts-ignore
            ref={ref}
            className={cx(
                className,
                css`
          & > * {
            display: inline-block;
          }
          & > * + * {
            margin-left: 15px;
          }
        `
            )}
        />
    )
);
