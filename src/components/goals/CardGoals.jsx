import { Alert, Card, Grid, Modal, Spin } from "antd";
import TileGoal from "@components/goals/TileGoal.jsx";
import { useEffect, useRef, useMemo, useState } from "react";
import Sortable from "sortablejs";
import PlacementsDrillDown from "@components/goals/drilldown/PlacementsDrillDown.jsx";
import JobsDrillDown from "@components/goals/drilldown/JobsDrillDown.jsx";
import GoalSelector from "@components/goals/GoalSelector.jsx";
import useUserDashboardGoalsConfigStore from "@api/userDashboardGoalsConfigStore.js";
import useUserDashboardGoalsDataStore from "@api/userDashboardGoalsDataStore.js";
import GoalPeriodHeader from "@components/goals/GoalPeriodHeader.jsx";

const { useBreakpoint } = Grid;

const drillDownComponents = {
  placements: PlacementsDrillDown,
  jobs: JobsDrillDown
};

const CardGoals = ({ apiKey, apiServer, userId, tenantId, dashboardId = "" }) => {
  const { configData, loading: configLoading, error: configError, fetchConfig } =
    useUserDashboardGoalsConfigStore();
  const { periodData, loading: dataLoading, error: dataError } =
    useUserDashboardGoalsDataStore();

  const [goalSelectorOpen, setGoalSelectorOpen] = useState(false);
  const [isDrillDownModalVisible, setDrillDownModalVisible] = useState(false);
  const [drillDownContent, setDrillDownContent] = useState(null);
  const [isDrillDownLoading, setIsDrillDownLoading] = useState(false);
  const [drillDownError, setDrillDownError] = useState(null);

  useEffect(() => {
    if (dashboardId) {
      fetchConfig({ dashboardId });
    }
  }, [dashboardId, fetchConfig]);

  const showGoalSel = () => setGoalSelectorOpen(true);
  const onGoalSelectorClose = () => setGoalSelectorOpen(false);

  const matchedData = useMemo(() => {

    if (!periodData || !periodData.length  || periodData.length<=0 || !configData?.selectedKpi) {
      return [];
    }

    return periodData
      .filter((item) =>
        configData.selectedKpi.some(
          (kpi) =>
            kpi.value === item.activityId &&
            kpi.type === (item.activityType === "USER" ? "ACTIVITY" : "SYSTEM")
        )
      )
      .map((item) => ({
        id: item.activityId, // Use activityId as id
        drilldown: item.activityModule.toLowerCase(), // e.g., "placements" or "jobs"
        title: item.activityName,
        trackWithoutTarget: item.trackWithoutTarget,
        target: item.targetValue,
        actual: item.actualValue,
        monthName: item.monthName || "N/A", // Default for quarters/years
        difference: item.difference,
        prev: item.prev || [], // Ensure prev data is passed
        type: item.targetType.toLowerCase(), // e.g., "currency" or "counter"
      }));
  }, [periodData, configData]);

  const containerRef = useRef(null);
  const screens = useBreakpoint();

  // useEffect(() => {
  //   const sortable = Sortable.create(containerRef.current, {
  //     animation: 150,
  //     onEnd: (evt) => {
  //       const { oldIndex, newIndex } = evt;
  //       if (oldIndex === newIndex) return;
  //       const updatedData = Array.from(matchedData);
  //       const [movedItem] = updatedData.splice(oldIndex, 1);
  //       updatedData.splice(newIndex, 0, movedItem);
  //     }
  //   });
  //
  //   return () => sortable.destroy();
  // }, [matchedData]);
  const handleExpand = async (tile) => {
    setDrillDownModalVisible(true);
    setIsDrillDownLoading(true);
    setDrillDownError(null);
    setDrillDownContent(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const ContentComponent = drillDownComponents[tile.drilldown];
      if (ContentComponent) {
        setDrillDownContent(
          <ContentComponent
            apiKey={apiKey}
            apiServer={apiServer}
            userId={userId}
            tenantId={tenantId}
            tile={tile}
          />
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


  const handleModalClose = () => setDrillDownModalVisible(false);

  return (
    <>
      <Card
        bordered
        style={{ backgroundColor: "#1e3a8a",border:"none" }}
        styles={{ header: { color: "#fff", borderBottom: "none", fontSize: 18 } }}
        extra={
          <span
            onClick={showGoalSel}
            style={{ cursor: "pointer", color: "white", fontSize: "smaller" }}
          >
            Customise
          </span>
        }
        title={<GoalPeriodHeader />}
      >
        <div
          ref={containerRef}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px"
          }}
        >
          {dataLoading || configLoading ? (
            <div style={{textAlign: "center",alignContent:'center',width: "100%",color:"#fff"}}>
              Generating your goals...
            </div>
          ) : dataError || configError ? (
            <Alert message={dataError || configError} type="error" showIcon />
          ) : (
            matchedData.map((item) => (
              <div
                key={item.id}
                style={{
                  width: screens.md ? "185px" : "100%"
                }}
              >
                <TileGoal
                  tileData={item}
                  onExpand={() => handleExpand(item)}
                />
              </div>
            ))
          )}
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

      <GoalSelector
        dashboardId={dashboardId}
        open={goalSelectorOpen}
        onClose={onGoalSelectorClose}
        tenantId={tenantId}
        userId={userId}
        apiServer={apiServer}
        apiKey={apiKey}
      />
    </>
  );
};

export default CardGoals;
