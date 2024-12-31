import React, { useMemo } from "react";
import { Card, Flex, Tooltip, Typography } from "antd";
import { AgGauge } from "ag-charts-react";
import "ag-charts-enterprise";
import { BiTargetLock } from "react-icons/bi";
import { TrophyOutlined } from "@ant-design/icons";

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

const ProgressGauge = ({ tileData }) => {

  const progress = useMemo(() => {
    if (tileData.target > 0) {
      return Math.min((tileData.actual / tileData.target) * 100, 100);
    }
    return tileData.actual || 0;
  }, [tileData.actual, tileData.target]);

  const gaugeOptions = useMemo(() => ({
    height: 200,
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

  return (
    <Card styles={{ header: { border: "none" } }} title={(
      <Flex direction="row" align="center" justify="start" gap={"small"}>
        <TrophyOutlined />
        {tileData.title}
      </Flex>
    )}>
      <div>
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
              ) : (
                <Text type="secondary">No data to display</Text>
              )}
            </div>
          </Flex>
        </div>
      </div>
    </Card>
  );
};

export default ProgressGauge;
