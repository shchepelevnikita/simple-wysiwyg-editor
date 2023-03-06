import React from 'react';
import { type IconProps } from '../../../types/types';

export const Icon = ({ children }: IconProps): React.ReactElement => {
  return <span className="material-icons">{children}</span>;
};
