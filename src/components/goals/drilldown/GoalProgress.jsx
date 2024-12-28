import React, { useState } from "react";
import { AgGauge } from "ag-charts-react";
import "ag-charts-enterprise";

const GoalProgress = ({ target = 0, actual = 0 }) => {

  const progressValue = Math.min(Math.max(Math.round((actual / target) * 100), 1), 100);

  const [options, setOptions] = useState({
    type: "linear-gauge",
    direction: "horizontal",
    backgroundColor: "transparent",
    background: {
      visible: false
    },
    width: 300,
    height: 24,
    cornerRadius: 99,
    cornerMode: "container",
    label: {
      text: progressValue+'%',
      enabled: true,
      fontSize: "normal",
      placement: "inside-center",
      avoidCollisions: true
    },
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
    seriesArea: {
      padding: {
        left: 0,
        right: 0
      }
    },
    bar: {
      fills: [
        { color: "red", stop: 20 },
        { color: "#4CD137", stop: 100 }
      ],
      fillMode: "continuous"
    },
    value: progressValue,
    scale: {
      fill: "#fff",
      label: {
        enabled: false
      },
      min: 0,
      max: 100
    }
  });
  return <AgGauge options={options} />;
};

export default GoalProgress;

