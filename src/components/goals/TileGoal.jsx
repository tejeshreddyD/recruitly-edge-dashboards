import { Card, Flex, Tag, Tooltip, Typography } from "antd";
import { useState } from "react";
import { GrExpand } from "react-icons/gr";
import { AgGauge } from "ag-charts-react";
import "ag-charts-enterprise";
import { TrophyOutlined, DollarOutlined, NumberOutlined } from "@ant-design/icons";
import { TbSum } from "react-icons/tb";
import { TrendUp } from "@phosphor-icons/react";
import { PiTelevisionBold } from "react-icons/pi";

const { Text, Link } = Typography;

const TileGoal = ({ tileData, onExpand }) => {
  const [isHovered, setIsHovered] = useState(false);
  const getIcon = () => {
    if (tileData.type === "currency") {
      return <DollarOutlined style={{ marginRight: 8 }} />;
    } else if (tileData.type === "counter") {
      return <TbSum style={{ marginRight: 8 }} />;
    } else {
      return <TrophyOutlined style={{ marginRight: 8 }} />;
    }
  };
  const options = {
    height: 120,    // Set the desired width
    padding: {
      top: 0,    // Reduce top padding
      right: 20,
      bottom: 30,
      left: 20
    },
    type: "radial-gauge",
    value: 80,
    startAngle: -135,
    endAngle: 135,
    background: {
      fill: "transparent"
    },
    scale: {
      min: 0,
      max: 100,
      fill: "#e6e6ec",
      label: {
        enabled: false
      }
    },
    // targets: [
    //   {
    //     value: 85,
    //     shape: "star",
    //     placement: "outside",
    //     fill: "white",
    //     strokeWidth: 2,
    //     spacing: 2
    //   }
    // ],
    cornerRadius: 99,
    cornerMode: "item",
    bar: {
      fill: "#35a124"
    }
  };

  return (
    <Card
      hoverable
      size="small"
      style={{ backgroundImage: "linear-gradient(145deg, rgb(227 252 255) 28%, rgb(255 255 255))" }}
      styles={{
        body: { padding: 0 },
        header: { border: "none", margin: 0, fontSize: 16 },
        actions: { border: "none", backgroundColor: "transparent" },
      }}
      title={
        <Flex gap={1} align={"center"}>
          {getIcon()}
          <Tooltip title={tileData.title}>
            {tileData.title}
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
      actions={[
        <Text>
          <TrendUp />
        </Text>,
        <PiTelevisionBold />
      ]}
    >
      <div style={{ padding: 5 }}>
        <Flex gap={"small"} vertical align={"center"} justify={"flex-start"}>
          <Tag>20/20000</Tag>
          <div style={{display: "inline-block" }}>
            <AgGauge options={options} />
          </div>
        </Flex>
      </div>
    </Card>
  );
};

export default TileGoal;
