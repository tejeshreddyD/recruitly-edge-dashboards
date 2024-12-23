import { Card, Flex, Tag, Tooltip, Typography } from "antd";
import { useState } from "react";
import { GrExpand } from "react-icons/gr";
import { AgGauge, AgCharts } from "ag-charts-react";
import "ag-charts-enterprise";
import { TrophyOutlined } from "@ant-design/icons";
import { TbSum } from "react-icons/tb";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { PiTelevisionBold, PiTrendUp } from "react-icons/pi";
import { FiTarget } from "react-icons/fi";
import { BiTargetLock } from "react-icons/bi";

const { Text } = Typography;

const formatNumber = (num) => {

  if (!num) return num;

  if (num < 1000) {
    return num.toString(); // Show exact numbers for small values
  }
  const fmt = new Intl.NumberFormat(undefined, {
    notation: "compact", // Enables formatting like 1.2K, 3M
    maximumFractionDigits: 1 // One decimal point
  }).format(num); // Properly format large numbers

  console.log("NUMBER", num, " FORMATED ", fmt);

  return fmt;
};

const TileGoal = ({ tileData, onExpand }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = () => {
    if (tileData.type === "value") {
      return <AiOutlineDollarCircle style={{ marginRight: 8 }} />;
    } else if (tileData.type === "count") {
      return <TbSum style={{ marginRight: 8 }} />;
    } else {
      return <TrophyOutlined style={{ marginRight: 8 }} />;
    }
  };

  const progress = tileData.target > 0
    ? Math.min((tileData.actual / tileData.target) * 100, 100) // Cap progress at 100%
    : tileData.actual || 0;

  const gaugeOptions = {
    height: 120,
    padding: {
      top: 0,
      right: 20,
      bottom: 30,
      left: 20
    },
    type: "radial-gauge",
    value: progress,
    startAngle: -135,
    endAngle: 135,
    background: {
      fill: "transparent"
    },
    scale: {
      min: 0,
      max: 100, // Gauge always shows progress in percentage
      fill: "#e6e6ec",
      label: {
        enabled: false
      }
    },
    cornerRadius: 99,
    cornerMode: "item",
    bar: {
      fill: progress === 100 ? "#52c41a" : "#35a124" // Green when complete
    },
    label: {
      text: tileData.target > 0 ? `${progress.toFixed(0)}%` : `${progress}`, // Show percentage or value
      color: "#000",
      fontSize: 14
    }
  };

  const filteredPrevData = (tileData.prev || []).filter((item) => item !== null);

  const miniBarChartOptions = {
    width: 100, // Width for the sparkline chart
    height: 120, // Height for compact design
    data: [
      ...filteredPrevData
        .slice()
        .reverse() // Reverse the order for descending chronology
        .map((prev) => ({
          monthName: prev.monthName,
          actualValue: prev.actualValue || 0
        })),
      {
        monthName: tileData.monthName, // Add current month's name
        actualValue: tileData.actual || 0 // Use current month's actual value
      }
    ],
    background: {
      fill: "transparent" // No background
    },
    series: [
      {
        type: "bar",
        xKey: "monthName",
        yKey: "actualValue",
        fill: "#2450a1", // Bar fill color
        stroke: "transparent" // No stroke for the bars
      }
    ],
    axes: [
      {
        type: "category",
        position: "bottom",
        line: {
          width: 0 // Hide axis line
        },
        tick: {
          width: 0 // Hide ticks
        },
        label: {
          enabled: false // Disable labels
        }
      },
      {
        type: "number",
        position: "left",
        line: {
          width: 0 // Hide axis line
        },
        tick: {
          width: 0 // Hide ticks
        },
        label: {
          enabled: false // Disable labels
        }
      }
    ],
    legend: {
      enabled: false // No legend
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0 // Remove padding
    }
  };

  const gradientColor = "linear-gradient(173deg, rgb(230 247 255) 8%, rgb(255, 255, 255))";

  return (
    <Card
      hoverable
      size="small"
      style={{
        background: gradientColor,
        border: "none"
      }}
      styles={{
        body: { padding: 0 },
        header: { border: "none", margin: 0, fontSize: 14 },
        actions: { border: "none", backgroundColor: "transparent" }
      }}
      title={
        <Flex gap={1} align={"center"}>
          {getIcon()}
          <Tooltip title={tileData.title}><Text ellipsis>{tileData.title}</Text></Tooltip>
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
      actions={[
        <Flex direction="row" align="center" justify="end" gap="large" style={{ paddingRight: 16 }}>
          <TrophyOutlined />
        </Flex>
      ]}
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
              ) : <>&nbsp;</>}
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
