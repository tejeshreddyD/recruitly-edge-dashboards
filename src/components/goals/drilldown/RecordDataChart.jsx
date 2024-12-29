import useUserDashboardGoalsDataStore from "@api/userDashboardGoalsDataStore.js";
import React, { useEffect, useState } from "react";
import { Card, Flex } from "antd";
import { DiDatabase } from "react-icons/di";
import { formatNumber } from "@utils/numberUtil.js";
import { AgCharts } from "ag-charts-react";

const RecordDataChart = ({ apiServer, apiKey, activityId, activityType, selectedPeriodLabel }) => {
  const { selectedPeriod } = useUserDashboardGoalsDataStore((state) => state);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchRecordDataMetrics = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(
          `${apiServer}/api/kpi_record_data_metrics?periodCode=${selectedPeriod}&activityId=${activityId}&activityType=${activityType}&apiKey=${apiKey}`
        );
        const result = await response.json();

        console.log("result", result);
        if (result.success && result.data) {
          // Process data to simplify the period for _MONTH
          const processedData = result.data.data.map((item) => {
            if (selectedPeriod.includes("_MONTH")) {
              const day = new Date(item.period).getDate(); // Extract day (1, 2, 3, ...)
              return { ...item, period: day.toString() };
            }
            return item;
          });
          setData(processedData);
        } else {
          setErrorMessage("Failed to fetch chart data.");
        }
      } catch (error) {
        setErrorMessage("Error fetching chart data.");
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false); // Loading complete
      }
    };

    fetchRecordDataMetrics().then(() => {
      setLoading(false);
    });
  }, [apiServer, apiKey, activityId, activityType, selectedPeriod]);

  return (
    <div style={{marginBottom:20}}>
      <Flex vertical={true} gap={"small"}>
        <Flex direction="row" align="center" justify="start" gap="small">
          <DiDatabase /><span>{selectedPeriodLabel}</span>
        </Flex>
        <Card>
          <AgCharts
            options={{
              theme: "ag-polychroma",
              data: data,
              background: { fill: "transparent" },
              series: [
                {
                  type: "bar",
                  xKey: "period",
                  yKey: "count",
                  stroke: "transparent",
                  label: {
                    formatter: ({ value }) => formatNumber(value)
                  }
                }
              ],
              axes: [
                {
                  type: "category",
                  position: "bottom",
                  title: false,
                  label: {
                    formatter: ({ value }) =>
                      selectedPeriod.includes("_MONTH") ? `Day ${value}` : value
                  }
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
      </Flex>
    </div>
  );
};

export default RecordDataChart;
