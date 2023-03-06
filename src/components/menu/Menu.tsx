import React from 'react';
import { type MenuProps } from '../../types/types';

export const Menu = ({ children, className }: MenuProps): React.ReactElement => {
  return <div className={className}>{children}</div>;
};
