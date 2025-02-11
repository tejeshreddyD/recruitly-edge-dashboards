import { Card, Flex } from "antd";
import { FaRegChartBar } from "react-icons/fa";
import { AgCharts } from "ag-charts-react";
import { formatNumber } from "@utils/numberUtil.js";
import React from "react";
const PerformanceTrends = ({ item }) => {

  return (
    <Card style={{ marginBottom: 16 }} styles={{ header: { border: "none" } }} title={(
      <Flex direction="row" align="center" justify="start" gap={"small"}>
        <FaRegChartBar />
        Your Performance Trends
      </Flex>
    )}>
      <AgCharts
        options={{
          height: 250,
          theme: "ag-polychroma",
          data: [
            ...(item.prev ? [...item.prev].reverse().map((prev) => ({
              monthName: prev?.monthName || "N/A",
              actualValue: prev?.actualValue || 0
            })) : []),
            {
              monthName: item?.monthName || "N/A",
              actualValue: item?.actual || 0
            }
          ],

          background: { fill: "transparent" },
          series: [
            {
              type: "bar",
              xKey: "monthName",
              yKey: "actualValue",
              stroke: "transparent",
              label: {
                formatter: ({ value }) => formatNumber(value)
              },
              itemStyler: (dataItem) => {
                const color = dataItem.datum.monthName === item.monthName ? "orange" : "#436ff4";
                return { fill: color };
              }
            }
          ],
          axes: [
            {
              type: "category",
              position: "bottom",
              title: false
            },
            {
              type: "number",
              position: "left",
              label: {
                formatter: ({ value }) => formatNumber(value)
              }
            }
          ]
        }}
      />
    </Card>
  );
};

export default PerformanceTrends;