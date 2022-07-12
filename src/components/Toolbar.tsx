import React, {PropsWithChildren, Ref} from "react";
import {BaseProps, Menu, OrNull} from "./Menu";
import {css, cx} from "@emotion/css";

export const Toolbar = React.forwardRef(
    (
        { className, ...props }: PropsWithChildren<BaseProps>,
        ref: Ref<OrNull<HTMLDivElement>>
    ) => (
        <Menu
            {...props}
            // @ts-ignore
            ref={ref}
            className={cx(
                className,
                css`
          position: relative;
          padding: 1px 18px 17px;
          margin: 0 -20px;
          border-bottom: 2px solid #eee;
          margin-bottom: 20px;
        `
            )}
        />
    )
);