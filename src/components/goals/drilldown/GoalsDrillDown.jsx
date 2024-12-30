import React, { useEffect, useState } from "react";
import { Card, Col, Flex, Row, Tabs } from "antd";
import { DollarCircleFilled, TrophyOutlined } from "@ant-design/icons";
import { AgCharts } from "ag-charts-react";
import LeaderBoard from "@components/goals/drilldown/LeaderBoard.jsx";
import "./tabstats.css";
import { FaRegChartBar } from "react-icons/fa";
import { TbSum } from "react-icons/tb";
import { formatNumber } from "@utils/numberUtil.js";
import RecordDataGrid from "@components/goals/drilldown/RecordDataGrid.jsx";
import GoalProgress from "@components/goals/drilldown/GoalProgress.jsx";
import { FiTarget } from "react-icons/fi";
import RecordDataChart from "@components/goals/drilldown/RecordDataChart.jsx";
import ProgressGauge from "@components/goals/drilldown/ProgressGauge.jsx";

const GoalsDrillDown = ({ apiServer, apiKey, tenantId, userId, tileData, matchedData, selectedPeriodLabel }) => {

  const [currentTile, setCurrentTile] = useState(tileData || null);
  const [prevData, setPrevData] = useState([]);
  const [goalItems, setGoalItems] = useState([]);
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
        <Flex vertical={true} gap={"large"}
              style={{ paddingLeft: 20, paddingTop: 10, paddingRight: 20, paddingBottom: 20 }}>
          <Flex direction="row" align="flex-start" justify="space-between" gap={"small"} style={{ marginRight: 20 }}>
            <span style={{ fontSize: "normal" }}><span
              style={{ fontWeight: "bold" }}>{item.title}</span> - {selectedPeriodLabel}</span>
            {item.target <= 0 && (
              <Flex direction="row" align="center" justify="start" gap={"small"}>
                <FiTarget />
                <span>Target not assigned</span>
              </Flex>
            )}
          </Flex>
          <div>
            <Flex vertical={true} gap={"large"} style={{ paddingRight: 20, paddingBottom: 20 }}>
              <Row gutter={20}>
                {item.target > 0 && (
                <Col xs={24} sm={24} md={24} lg={24} xl={8}>
                  <Card title={(
                    <Flex direction="row" align="center" justify="start" gap={"small"}>
                      <TrophyOutlined />
                      {item.title}
                    </Flex>
                  )}>
                    <ProgressGauge tileData={item} />
                  </Card>
                </Col>
                  )}
                <Col xs={24} sm={24} md={24} lg={24} xl={item.target > 0 ? 16 : 24}>
                  <Card style={{ marginBottom: 16 }} title={(
                    <Flex direction="row" align="center" justify="start" gap={"small"}>
                      <FaRegChartBar />
                      Your Performance Trends
                    </Flex>
                  )}>
                    <AgCharts
                      options={{
                        theme: "ag-polychroma",
                        data: [
                          ...(item.prev || []).reverse().map((prev) => ({
                            monthName: prev?.monthName || "N/A",
                            actualValue: prev?.actualValue || 0
                          })),
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
                </Col>
              </Row>
              <RecordDataChart apiServer={apiServer} apiKey={apiKey} activityId={item.activityId}
                               activityType={item.activityType} selectedPeriodLabel={selectedPeriodLabel}
                               tileData={item} />
              <RecordDataGrid selectedPeriodLabel={selectedPeriodLabel} tileData={item} />
            </Flex>
          </div>
        </Flex>
      )
    }));

    setGoalItems(goalItemList);

  }, [matchedData]);

  const handleTabChange = (key) => {
    const selectedItem = matchedData.find((item) => item.id === key);
    if (selectedItem) {
      setCurrentTile(selectedItem);
    }
  };

  return (
    <div style={{ width: "100%", paddingTop: "16px" }}>
      <Tabs
        tabPosition="left"
        size={"small"}
        type={"line"}
        className="stats-tab"
        style={{ width: "100%", borderRight: 0 }}
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
