import React from 'react';
import { Menu } from '../../menu/Menu';
import { type ToolbarProps } from '../../../types/types';

import './style.css';

export const Toolbar = ({ className, children }: ToolbarProps): React.ReactElement => {
  return <Menu className={className}>{children}</Menu>;
};
