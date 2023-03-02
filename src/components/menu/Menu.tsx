import React from "react";
import {MenuProps} from "../../types/types";

export const Menu = ({children, className}: MenuProps) => {
  return (
      <div className={className}>
          {children}
      </div>
  );
};
