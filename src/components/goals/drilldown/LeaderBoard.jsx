import React, { useState } from "react";
import { AgCharts } from "ag-charts-react";

const LeaderBoard = () => {
  // Leaderboard data
  const data = [
    { name: "Alice", score: 95 },
    { name: "Bob", score: 89 },
    { name: "Charlie", score: 82 },
    { name: "David", score: 75 },
    { name: "Eve", score: 70 }
  ];

  // Sort data by score in descending order
  const sortedData = [...data].sort((a, b) => b.score - a.score);

  const [options, setOptions] = useState({
    data: sortedData,
    seriesArea: {
      padding: {
        left: 0,
        right: 0,
      },
    },
    series: [
      {
        type: "funnel",
        stageKey: "name",
        valueKey: "score",
        fills: ["#5090DC", "#FFA03A", "#459D55", "#34BFE1"],
      },
    ],
  });

  return (
    <div style={{ width: "100%"}}>
      <AgCharts options={options} />
    </div>
  );
};

export default LeaderBoard;
