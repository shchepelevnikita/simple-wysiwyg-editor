import React, {PropsWithChildren, Ref} from "react";
import {BaseProps, OrNull} from "./Menu";
import {css, cx} from "@emotion/css";

export const Icon = React.forwardRef(
    (
        { className, ...props }: PropsWithChildren<BaseProps>,
        ref: Ref<OrNull<HTMLSpanElement>>
    ) => (
        <span
            {...props}
            // @ts-ignore
            ref={ref}
            className={cx(
                'material-icons',
                className,
                css`
          font-size: 18px;
          vertical-align: text-bottom;
        `
            )}
        />
    )
);
