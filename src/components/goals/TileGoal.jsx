import React, { useMemo, useState } from "react";
import { Card, Flex, Tooltip, Typography } from "antd";
import { GrExpand } from "react-icons/gr";
import { AgGauge, AgCharts } from "ag-charts-react";
import "ag-charts-enterprise";
import { TrophyOutlined } from "@ant-design/icons";
import { TbSum } from "react-icons/tb";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { BiTargetLock } from "react-icons/bi";

const { Text } = Typography;

const formatNumber = (num) => {
  if (!num) return num;
  if (num <= 0) return num.toString();
  if (num < 1000) return num.toString();
  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(num);
};

const TileGoal = ({ tileData, onExpand }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = () => {
    switch (tileData.type) {
      case "value":
        return <AiOutlineDollarCircle style={{ marginRight: 8 }} />;
      case "count":
        return <TbSum style={{ marginRight: 8 }} />;
      default:
        return <TrophyOutlined style={{ marginRight: 8 }} />;
    }
  };

  const progress = useMemo(() => {
    if (tileData.target > 0) {
      return Math.min((tileData.actual / tileData.target) * 100, 100);
    }
    return tileData.actual || 0;
  }, [tileData.actual, tileData.target]);

  const gaugeOptions = useMemo(() => ({
    height: 120,
    padding: { top: 0, right: 20, bottom: 30, left: 20 },
    type: "radial-gauge",
    value: progress,
    startAngle: -135,
    endAngle: 135,
    background: { fill: "transparent" },
    scale: {
      min: 0,
      max: 100,
      fill: "#e6e6ec",
      label: { enabled: false }
    },
    cornerRadius: 99,
    cornerMode: "item",
    bar: {
      fill: progress === 100 ? "#52c41a" : "#35a124"
    },
    label: {
      text: tileData.target > 0 ? `${progress.toFixed(0)}%` : `${progress}`,
      color: "#000",
      fontSize: 14
    }
  }), [progress, tileData.target]);

  const filteredPrevData = useMemo(
    () => (tileData.prev || []).filter((item) => item !== null),
    [tileData.prev]
  );

  const miniBarChartOptions = useMemo(() => ({
    width: 100,
    height: 120,
    data: [
      ...filteredPrevData.slice().reverse().map((prev) => ({
        monthName: prev.monthName,
        actualValue: prev.actualValue || 0
      })),
      {
        monthName: tileData.monthName,
        actualValue: tileData.actual || 0
      }
    ],
    background: { fill: "transparent" },
    series: [
      {
        type: "bar",
        xKey: "monthName",
        yKey: "actualValue",
        fill: "#2450a1",
        stroke: "transparent"
      }
    ],
    axes: [
      {
        type: "category",
        position: "bottom",
        line: { width: 0 },
        tick: { width: 0 },
        label: { enabled: false }
      },
      {
        type: "number",
        position: "left",
        line: { width: 0 },
        tick: { width: 0 },
        label: { enabled: false }
      }
    ],
    legend: { enabled: false },
    padding: { top: 0, right: 0, bottom: 0, left: 0 }
  }), [filteredPrevData, tileData.monthName, tileData.actual]);

  const gradientColor = "linear-gradient(173deg, rgb(230 247 255) 8%, rgb(255, 255, 255))";

  return (
    <Card
      hoverable
      size="small"
      style={{ background: gradientColor, border: "none" }}
      styles={{
        body: { padding: 0 },
        header: { border: "none", margin: 0, fontSize: 14 },
        actions: { border: "none", backgroundColor: "transparent" }
      }}
      onClick={() => onExpand({ tileData })}
      title={
        <Flex gap={1} align={"center"}>
          {getIcon()}
          <Tooltip title={tileData.title}>
            <Text ellipsis>{tileData.title}</Text>
          </Tooltip>
        </Flex>
      }
      extra={
        <GrExpand
          onClick={() => onExpand({ tileData })}
          style={{
            color: "#000",
            cursor: "pointer",
            display: isHovered ? "inline-block" : "none",
            transition: "opacity 0.3s"
          }}
        />
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ padding: 5 }}>
        <Flex gap={"middle"} vertical align={"center"} justify={"space-around"}>
          <Text strong style={{ fontSize: 16 }}>
            <Flex direction="row" align="center" justify="start" gap={1}>
              {formatNumber(tileData.actual || 0)}
              {tileData.target && tileData.target > 0 ? (
                <Tooltip title="Target">
                  <Flex direction="row" align="center" justify="start" gap={1}>
                    /{formatNumber(tileData.target)} <BiTargetLock />
                  </Flex>
                </Tooltip>
              ) : (
                <>&nbsp;</>
              )}
            </Flex>
          </Text>
          <div style={{ display: "inline-block" }}>
            {tileData.target > 0 ? (
              <AgGauge options={gaugeOptions} />
            ) : filteredPrevData.length > 0 ? (
              <AgCharts options={miniBarChartOptions} />
            ) : (
              <Text type="secondary">No data to display</Text>
            )}
          </div>
        </Flex>
      </div>
    </Card>
  );
};

export default TileGoal;
