import { Alert, Card, Grid, Modal, Spin } from "antd";
import TileGoal from "@components/TileGoal.jsx";
import { TrophyOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import Sortable from "sortablejs";
import { GoalDrillDownContext } from "@components/GoalDrillDownContext.jsx";

const { useBreakpoint } = Grid;

const CardGoals = () => {
  const [data, setData] = useState([
    { id: "1", title: "Placements", description: "Tile Desc 1" },
    { id: "2", title: "Growth", description: "Tile Desc 2" },
    { id: "3", title: "Learning", description: "Tile Desc 3" },
    { id: "4", title: "Networking", description: "Tile Desc 4" },
    { id: "5", title: "Achievements", description: "Tile Desc 5" },
    { id: "6", title: "Interviews", description: "Tile Desc 5" },
    { id: "7", title: "Jobs", description: "Tile Desc 5" }
  ]);

  const containerRef = useRef(null);
  const screens = useBreakpoint();
  const [isDrillDownModalVisible, setDrillDownModalVisible] = useState(false);
  const [drillDownContent, setDrillDownContent] = useState(null);
  const [isDrillDownLoading, setIsDrillDownLoading] = useState(false);
  const [drillDownError, setDrillDownError] = useState(null);

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
      }
    });

    // Cleanup on unmount
    return () => sortable.destroy();
  }, [data]);
  const handleExpand = async (id) => {
    console.log(`Expanding for ${id}`);
    setDrillDownModalVisible(true);
    setIsDrillDownLoading(true);
    setDrillDownError(null);
    setDrillDownContent(null);
    try {
      // Simulate a server request with a delay
      const response = await new Promise((resolve) =>
        setTimeout(() => resolve({ data: `Detailed information for goal ID: ${id}` }), 500)
      );
      setDrillDownContent(response.data);

    } catch (err) {
      setDrillDownError("Failed to load goal details.");
    } finally {
      setIsDrillDownLoading(false);
    }
  };

  // Function to handle modal close
  const handleModalClose = () => {
    setDrillDownModalVisible(false);
  };

  return (
    <>

      <Card
        style={{ backgroundColor: "#f0f2f5" }}
        styles={{ header: { borderBottom: "none", fontSize: 18 } }}
        extra={
          <a
            href="#"
            style={{
              cursor: "pointer",
              color: "gray",
              fontSize: "smaller"
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
            gap: "16px"
          }}
        >
          {data.map((item) => (
            <div
              key={item.id}
              style={{
                width: screens.md ? "275px" : "100%" // Full width if md is false (xs/sm), otherwise fixed width
              }}
            >
              <GoalDrillDownContext.Provider value={handleExpand}>
                <TileGoal title={item.title} description={item.description} />
              </GoalDrillDownContext.Provider>
            </div>
          ))}
        </div>
      </Card>
      <Modal
        width="80vw"              // Set width to 80% of the viewport width
        style={{ top: 20 }}
        title="Goal Details"
        open={isDrillDownModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {isDrillDownLoading ? (
          <Spin tip="Loading...">
            <div style={{ minHeight: "100px" }} />
          </Spin>
        ) : drillDownError ? (
          <Alert message={"Failed to load"} type="error" showIcon />
        ) : (
          <div style={{ minHeight: "500px" }}>{drillDownContent}</div>
        )}
      </Modal>
    </>
  );
};

export default CardGoals;
