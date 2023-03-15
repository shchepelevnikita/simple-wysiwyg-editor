import React from 'react';

import { type PredictionProps } from '../../../types/types';

import './style.css';

export const PredictionBar = ({ predictions, onClick }: PredictionProps): React.ReactElement => {
  return (
    <div className="predictions">
      {predictions.map((prediction) => (
        <span className="prediction" onClick={onClick} key={prediction}>
          {prediction}
        </span>
      ))}
    </div>
  );
};
