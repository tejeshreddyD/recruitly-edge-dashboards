import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { RECRUITLY_AGGRID_THEME } from "@constants";
import { Card, Col, Flex, Row, Tabs } from "antd";
import { DollarCircleFilled, TrophyOutlined } from "@ant-design/icons";
import { AgCharts } from "ag-charts-react";
import { DiDatabase } from "react-icons/di";
import LeaderBoard from "@components/goals/drilldown/LeaderBoard.jsx";
import "./tabstats.css";
import { FaRegChartBar } from "react-icons/fa";
import { TbSum } from "react-icons/tb";

const formatNumber = (num) => {
  try {
    if (num == null || isNaN(num)) {
      // Return as is if num is null, undefined, or not a valid number
      return "";
    }

    const intNum = Number(num); // Ensure num is converted to a number
    if (intNum <= 0) {
      return intNum.toString(); // Return zero or negative values as strings
    }
    if (intNum < 1000) {
      return intNum.toString(); // Return values less than 1000 as-is
    }

    // Format numbers >= 1000 with compact notation
    return new Intl.NumberFormat(undefined, {
      notation: "compact",
      maximumFractionDigits: 1
    }).format(intNum);
  } catch (e) {
    console.error("Error formatting number:", num, e);
    return "";
  }
};


const GoalsDrillDown = ({ apiServer, apiKey, tenantId, userId, tileData, matchedData, selectedPeriodLabel }) => {
  const [currentTile, setCurrentTile] = useState(tileData || null);
  const [prevData, setPrevData] = useState([]);
  const [goalItems, setGoalItems] = useState([]);
  const [rowData] = useState([
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false }
  ]);
  const [colDefs] = useState([
    { field: "make" },
    { field: "model" },
    { field: "price" },
    { field: "electric" }
  ]);
  const [activeKey, setActiveKey] = useState(tileData.id);

  useEffect(() => {
    setActiveKey(tileData.id);
  }, [tileData]);

  // Compute previous data when tileData changes
  useEffect(() => {
    if (tileData) {
      setCurrentTile(tileData);
      setPrevData((tileData.prev || []).filter((item) => item !== null));
    } else {
      setCurrentTile(null);
      setPrevData([]);
    }
  }, [tileData]);

  // Update goal items whenever matchedData changes
  useEffect(() => {
    const goalItemList = matchedData.map((item) => ({
      key: item.id,
      label: (
        <Flex direction="row" align="center" justify="start" gap={"small"}>
          {item.type === "value" && <DollarCircleFilled style={{ color: "green" }} />}
          {item.type === "count" && <TbSum style={{ color: "gray" }} />}
          {item.title}{" "}
        </Flex>
      ),
      children: (
        <div>
          <div style={{ width: "auto", height: "500px", marginRight: 15 }} className={"ag-theme-quartz"}>
            <Row gutter={12}>
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Card style={{ marginBottom: 16 }} title={(
                  <Flex direction="row" align="center" justify="start" gap={"small"}>
                    <FaRegChartBar />
                    Your Performance Trends: {item && item.title}
                  </Flex>
                )}>
                  <AgCharts
                    options={{
                      theme: "ag-polychroma",
                      data: [
                        ...item.prev.slice().reverse().map((prev) => ({
                          monthName: prev.monthName,
                          actualValue: prev.actualValue || 0
                        })),
                        {
                          monthName: item.monthName,
                          actualValue: item.actual || 0
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
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Card style={{ marginBottom: 16 }} title={(
                  <Flex direction="row" align="center" justify="start" gap={"small"}>
                    <TrophyOutlined />
                    Leader Board: {item && item.title}
                  </Flex>
                )}>
                  <LeaderBoard apiKey={apiKey} apiServer={apiServer} currentTile={item} />
                </Card>
              </Col>
            </Row>
            <AgGridReact theme={RECRUITLY_AGGRID_THEME} rowData={rowData} columnDefs={colDefs} />
          </div>
        </div>
      )
    }));

    setGoalItems(goalItemList);
  }, [matchedData, rowData, colDefs]);

  const handleTabChange = (key) => {
    const selectedItem = matchedData.find((item) => item.id === key);
    if (selectedItem) {
      console.log("Selected Tab Data:", selectedItem);
      setCurrentTile(selectedItem);
    }
  };

  return (
    <div style={{ height: "100vh", width: "100%", paddingTop: "16px" }}>
      <Tabs
        tabPosition="left"
        size={"small"}
        type={"line"}
        className="stats-tab"
        style={{ width: "100%", height: "100%", borderRight: 0 }}
        activeKey={activeKey}
        items={goalItems}
        onChange={(key) => {
          setActiveKey(key);
          handleTabChange(key);
        }}
      />
    </div>
  );
};

export default GoalsDrillDown;
