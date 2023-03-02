import React from "react";

import { PredictionProps } from "../../../types/types";

import './style.css';

export const PredictionBar = ({predictions, onClick}: PredictionProps) => {
  return (
    <div className="predictions">
        {predictions.map((prediction) => <span className="prediction" onClick={onClick}>{prediction}</span>)}
    </div>
  );
};