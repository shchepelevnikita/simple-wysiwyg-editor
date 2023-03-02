import React from "react";
import {Menu} from "../../menu/Menu";
import {ToolbarProps} from "../../../types/types";

import './style.css';

export const Toolbar = ({className, children}: ToolbarProps) => {
  return (
      <Menu className={className}>
        { children }
      </Menu>
  );
};
