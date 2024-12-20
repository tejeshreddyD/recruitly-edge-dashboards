import { Alert, Card, Grid, Modal, Spin } from "antd";
import TileGoal from "@components/goals/TileGoal.jsx";
import { TrophyFilled, TrophyOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import Sortable from "sortablejs";
import PlacementsDrillDown from "@components/goals/drilldown/PlacementsDrillDown.jsx";
import JobsDrillDown from "@components/goals/drilldown/JobsDrillDown.jsx";

const { useBreakpoint } = Grid;

const drillDownComponents = {
  placements: PlacementsDrillDown,
  jobs: JobsDrillDown
};

const CardGoals = ({ apiKey, apiServer, userId, tenantId }) => {
  // TODO: Load this data for the user from API
  const [data, setData] = useState([
    { id: "1", drilldown: "placements", title: "A very long title goes here - may be activity type", description: "Tile Desc 1", type:"currency" },
    { id: "2", drilldown: "placements", title: "Growth", description: "Tile Desc 2", type:"currency" },
    { id: "3", drilldown: "placements", title: "Learning", description: "Tile Desc 3", type:"currency" },
    { id: "4", drilldown: "jobs", title: "Networking", description: "Tile Desc 4", type:"counter" },
    { id: "5", drilldown: "jobs", title: "Networking", description: "Tile Desc 4", type:"counter"  },
    { id: "6", drilldown: "jobs", title: "Networking", description: "Tile Desc 4", type:"counter"  },
    { id: "7", drilldown: "jobs", title: "Jobs", description: "Tile Desc 7", type:"counter"  }
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

  const handleExpand = async (tile) => {
    setDrillDownModalVisible(true);
    setIsDrillDownLoading(true);
    setDrillDownError(null);
    setDrillDownContent(null);

    try {
      // Simulate a server request with a delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const ContentComponent = drillDownComponents[tile.drilldown];

      if (ContentComponent) {
        setDrillDownContent(<ContentComponent apiKey={apiKey}
                                              apiServer={apiServer}
                                              userId={userId}
                                              tenantId={tenantId}
                                              tile={tile} />
        );
      } else {
        setDrillDownError("Unknown content type.");
      }
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
      <Card bordered
            style={{ backgroundColor: "#1e3a8a" }}
            styles={{ header: { color: "#fff", borderBottom: "none", fontSize: 18 } }}
            extra={
              <a
                href="#"
                style={{
                  cursor: "pointer",
                  color: "white",
                  fontSize: "smaller"
                }}
              >
                Customise
              </a>
            }
            title={
              <span>
            <TrophyOutlined style={{ marginRight: 8 }} />
            Goals
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
                width: screens.md ? "185px" : "100%" // Full width if md is false (xs/sm), otherwise fixed width
              }}
            >
              <TileGoal
                tileData={item}
                onExpand={() => handleExpand(item)}
              />
            </div>
          ))}
        </div>
      </Card>

      <Modal
        width="80vw"
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
          <Alert message={drillDownError} type="error" showIcon />
        ) : (
          <div style={{ minHeight: "500px" }}>{drillDownContent}</div>
        )}
      </Modal>
    </>
  );
};

export default CardGoals;
