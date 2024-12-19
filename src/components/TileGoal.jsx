import { Card } from "antd";
import { useState } from "react";
import { GrExpand } from "react-icons/gr";

const { Meta } = Card;

const TileGoal = ({ title, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      size={"small"}
      styles={{ header: { border: "none", margin:0, fontSize: 16 } }}
      title={title}
      extra={
        <GrExpand
          style={{
            color: "#0052ff",
            cursor: "pointer",
            display: isHovered ? "inline-block" : "none",
            transition: "opacity 0.3s"
          }}
        />
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>{description}</div>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
  );
};

export default TileGoal;
