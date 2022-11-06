import React from "react";
import { ButtonProps } from '../../types/types';

import './style.css';

export const Button = ({className, children, active, onClick}: ButtonProps) => {
    const buttonClassNames = [className];

    if (active) buttonClassNames.push('active');

    return (
        <button className={buttonClassNames.join(' ')} onClick={onClick}>
            {children}
        </button>
    );
};
