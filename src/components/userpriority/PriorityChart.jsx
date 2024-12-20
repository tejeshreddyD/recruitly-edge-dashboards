import React, { useRef, useState } from "react";
import { AgCharts } from 'ag-charts-react';
import 'ag-charts-enterprise';

const PriorityChart = () => {
  // Generate dummy data for a month
  function getData() {
    const data = [];
    const daysInMonth = 31; // Assuming a 31-day month
    const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

    for (let day = 1; day <= daysInMonth; day++) {
      for (const time of times) {
        const count = Math.floor(Math.random() * 5); // Random count for demonstration
        data.push({
          day: day,
          time: time,
          count: count,
        });
      }
    }

    return data;
  }

  const containerRef = useRef(null);

  const [options, setOptions] = useState({
    data: getData(),
    series: [
      {
        type: 'heatmap',
        xKey: 'day',
        xName: 'Date',
        yKey: 'time',
        yName: 'Time',
        // Remove `colorKey` to prevent gradient behavior
        fill: ({ count }) => (count > 0 ? '#7E60BF' : '#D3D3D3'), // Single color or conditionally gray for empty cells
        strokeWidth: 1,
        highlightStyle: {
          fill: '#7E60BF',
        },
        emptyCellFill: '#D3D3D3', // Light gray for empty cells
      },
    ],
    legend: {
      enabled: false, // Disable legend since it's no longer meaningful
    },
    axes: [
      {
        position: 'left',
        type: 'category',
        label: {
          enabled: false,
        },
      },
      {
        position: 'top',
        type: 'category',
        label: {
          enabled: false,
          rotation: -45, // Rotate labels for better readability
        },
        line: {
          enabled: false,
        },
      },
    ],
  });

  return (
    <div className={"center"} ref={containerRef} style={{ marginTop: "5px" }}>
      <AgCharts options={options} />
    </div>
  );
};

export default PriorityChart;

