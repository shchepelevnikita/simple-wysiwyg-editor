import React, {PropsWithChildren, Ref} from "react";
import {BaseProps, OrNull} from "./Menu";
import {css, cx} from "@emotion/css";

export const Button = React.forwardRef(
    (
        {
            className,
            active,
            reversed,
            ...props
        }: PropsWithChildren<
            {
                active: boolean
                reversed: boolean
            } & BaseProps
            >,
        ref: Ref<OrNull<HTMLSpanElement>>
    ) => (
        <span
            {...props}
            // @ts-ignore
            ref={ref}
            className={cx(
                className,
                css`
          cursor: pointer;
          color: ${reversed
                    ? active
                        ? 'white'
                        : '#aaa'
                    : active
                        ? 'black'
                        : '#ccc'};
        `
            )}
        />
    )
);
