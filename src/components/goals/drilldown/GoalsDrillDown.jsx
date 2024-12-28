import React, { useEffect, useState } from "react";
import { Card, Col, Flex, Row, Tabs } from "antd";
import { DollarCircleFilled, TrophyOutlined } from "@ant-design/icons";
import { AgCharts } from "ag-charts-react";
import LeaderBoard from "@components/goals/drilldown/LeaderBoard.jsx";
import "./tabstats.css";
import { FaRegChartBar } from "react-icons/fa";
import { TbSum } from "react-icons/tb";
import { formatNumber } from "@utils/numberUtil.js";
import useUserDashboardGoalsDataStore from "@api/userDashboardGoalsDataStore.js";
import RecordDataGrid from "@components/goals/drilldown/RecordDataGrid.jsx";

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
        <div>
          <div style={{ fontSize: "medium", marginBottom: 16 }}>{item.title}</div>
          <div>
            <Flex vertical={true} gap={"large"} style={{ paddingRight: 20, paddingBottom: 20 }}>
              <Row gutter={12}>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
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
                      Leader Board
                    </Flex>
                  )}>
                    <LeaderBoard apiKey={apiKey} apiServer={apiServer} currentTile={item} />
                  </Card>
                </Col>
              </Row>
              <RecordDataGrid selectedPeriodLabel={selectedPeriodLabel} tileData={item} />
            </Flex>
          </div>
        </div>
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
    <div style={{ width: "100%", height:'105vh', paddingTop: "16px" }}>
      <Tabs
        tabPosition="left"
        size={"small"}
        type={"line"}
        className="stats-tab"
        style={{ width: "100%", height: "100vh", borderRight: 0 }}
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
