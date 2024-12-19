import { Card } from "antd";
import { useState } from "react";
import { GrExpand } from "react-icons/gr";
import { AgGauge } from "ag-charts-react";
import "ag-charts-enterprise";

const TileGoal = ({ id, title, description, onExpand }) => {
  const [isHovered, setIsHovered] = useState(false);

  const options = {
    type: "radial-gauge",
    value: 80,
    startAngle: -135,
    endAngle: 135,
    scale: {
      min: 0,
      max: 100,
      fill: "#e6e6ec",
      label: {
        enabled: false
      }
    },
    targets: [
      {
        value: 85,
        shape: "star",
        placement: "outside",
        fill: "white",
        strokeWidth: 2,
        spacing: 2
      }
    ],
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
      style={{ backgroundColor: "#fff" }}
      styles={{ body: { padding: 0 }, header: { border: "none", margin: 0, fontSize: 16 } }}
      title={title}
      extra={
        <GrExpand
          onClick={() => onExpand({ id, title, description })}
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
      <AgGauge options={options} />
    </Card>
  );
};

export default TileGoal;
