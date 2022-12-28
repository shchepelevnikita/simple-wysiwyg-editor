import React from "react";
import {IconProps} from "../../types/types";

export const Icon = ({children}: IconProps) => {
  return (
    <span className="material-icons">
      {children}
    </span>
  );
};
