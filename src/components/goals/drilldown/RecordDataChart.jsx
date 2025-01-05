import useUserDashboardGoalsDataStore from "@api/userDashboardGoalsDataStore.js";
import React, {useEffect, useState} from "react";
import {Card, Flex} from "antd";
import {DiDatabase} from "react-icons/di";
import {formatNumber} from "@utils/numberUtil.js";
import {AgCharts} from "ag-charts-react";

const RecordDataChart = ({apiServer, apiKey, activityId, activityType, selectedPeriodLabel}) => {
    const {selectedPeriod} = useUserDashboardGoalsDataStore((state) => state);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [data, setData] = useState([]);
    const [chartKey, setChartKey] = useState(0); // Key to force chart refresh

    useEffect(() => {
        const fetchRecordDataMetrics = async () => {
            setLoading(true);
            setErrorMessage("");

            try {
                const response = await fetch(
                    `${apiServer}/api/kpi_record_data_metrics?period=${selectedPeriod}&activityId=${activityId}&activityType=${activityType}&apiKey=${apiKey}`
                );
                const result = await response.json();

                console.log("result", result);

                if (result.success) {
                    if (result.data && result.data.data && result.data.data.length > 0) {
                        // Process data to simplify the period for _MONTH
                        const processedData = result.data.data.map((item) => {
                            if (selectedPeriod.includes("_MONTH")) {
                                const day = new Date(item.period).getDate(); // Extract day (1, 2, 3, ...)
                                return {...item, period: day.toString()};
                            }
                            return item;
                        });
                        setData(processedData); // Update with processed data
                    } else {
                        setData([]); // Reset the graph data if no data is returned
                    }
                } else {
                    setErrorMessage("Failed to fetch chart data.");
                    setData([]); // Ensure graph is reset on error
                }
            } catch (error) {
                setErrorMessage("Error fetching chart data.");
                console.error("Error fetching chart data:", error);
                setData([]); // Ensure graph is reset on error
            } finally {
                setLoading(false); // Loading complete
                setChartKey((prev) => prev + 1); // Force chart refresh
            }
        };

        fetchRecordDataMetrics();
    }, [apiServer, apiKey, activityId, activityType, selectedPeriod]);

    return (
        <div style={{marginBottom: 20}}>
            <Flex vertical={true} gap={"small"}>
                <Flex direction="row" align="center" justify="start" gap="small">
                    <DiDatabase/><span>{selectedPeriodLabel}</span>
                </Flex>
                <Card>
                    <AgCharts
                        key={chartKey} // Use key to force re-render when data changes
                        options={{
                            theme: "ag-polychroma",
                            data: data,
                            background: {fill: "transparent"},
                            series: [
                                {
                                    type: "bar",
                                    xKey: "period",
                                    yKey: "count",
                                    stroke: "transparent",
                                    label: {
                                        formatter: ({value}) => formatNumber(value)
                                    }
                                }
                            ],
                            axes: [
                                {
                                    type: "category",
                                    position: "bottom",
                                    title: false,
                                    label: {
                                        formatter: ({value}) =>
                                            selectedPeriod.includes("_MONTH") ? `Day ${value}` : value
                                    }
                                },
                                {
                                    type: "number",
                                    position: "left",
                                    label: {
                                        formatter: ({value}) => formatNumber(value)
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
