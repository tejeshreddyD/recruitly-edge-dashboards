import { Card, Grid } from "antd";
import TileGoal from "@components/TileGoal.jsx";
import { TrophyOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import Sortable from "sortablejs";

const { useBreakpoint } = Grid;

const CardGoals = () => {
  const [data, setData] = useState([
    { id: "1", title: "Placements", description: "Tile Desc 1" },
    { id: "2", title: "Growth", description: "Tile Desc 2" },
    { id: "3", title: "Learning", description: "Tile Desc 3" },
    { id: "4", title: "Networking", description: "Tile Desc 4" },
    { id: "5", title: "Achievements", description: "Tile Desc 5" },
    { id: "6", title: "Interviews", description: "Tile Desc 5" },
    { id: "7", title: "Jobs", description: "Tile Desc 5" },
  ]);

  const containerRef = useRef(null);
  const screens = useBreakpoint();

  useEffect(() => {
    const sortable = Sortable.create(containerRef.current, {
      animation: 150,
      onEnd: (evt) => {
        const { oldIndex, newIndex } = evt;
        if (oldIndex === newIndex) return;

        const updatedData = Array.from(data);
        const [movedItem] = updatedData.splice(oldIndex, 1);
        updatedData.splice(newIndex, 0, movedItem);

        setData(updatedData);
      },
    });

    // Cleanup on unmount
    return () => sortable.destroy();
  }, [data]);

  return (
    <Card
      style={{ backgroundColor:"#f0f0f0"}}
      styles={{ header: { borderBottom: "none", fontSize: 18 } }}
      extra={
        <a
          href="#"
          style={{
            cursor: "pointer",
            color: "gray",
            fontSize: "smaller",
          }}
        >
          Customise
        </a>
      }
      title={
        <span>
          <TrophyOutlined style={{ marginRight: 8 }} />
          My Goals
        </span>
      }
    >
      <div
        ref={containerRef}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        {data.map((item) => (
          <div
            key={item.id}
            style={{
              width: screens.md ? "275px" : "100%", // Full width if md is false (xs/sm), otherwise fixed width
            }}
          >
            <TileGoal title={item.title} description={item.description} />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CardGoals;
