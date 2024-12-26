import { Alert, Card, Grid, Modal, Spin } from "antd";
import TileGoal from "@components/goals/TileGoal.jsx";
import { useEffect, useRef, useMemo, useState } from "react";
import Sortable from "sortablejs";
import GoalSelector from "@components/goals/GoalSelector.jsx";
import useUserDashboardGoalsConfigStore from "@api/userDashboardGoalsConfigStore.js";
import useUserDashboardGoalsDataStore from "@api/userDashboardGoalsDataStore.js";
import GoalPeriodHeader from "@components/goals/GoalPeriodHeader.jsx";
import GoalsDrillDown from "@components/goals/drilldown/GoalsDrillDown.jsx";

const { useBreakpoint } = Grid;

const CardGoals = ({ apiKey, apiServer, userId, tenantId, dashboardId = "" }) => {
  const { configData, loading: configLoading, error: configError, fetchConfig } =
    useUserDashboardGoalsConfigStore();
  const { periodData, loading: dataLoading, error: dataError } =
    useUserDashboardGoalsDataStore();

  const [goalSelectorOpen, setGoalSelectorOpen] = useState(false);
  const [isDrillDownModalVisible, setDrillDownModalVisible] = useState(false);
  const [drillDownTile, setDrillDownTile] = useState(null);
  const [matchedData, setMatchedData] = useState([]);
  const [selectedPeriodLabel, setSelectedPeriodLabel] = useState("");

  useEffect(() => {
    if (dashboardId) {
      fetchConfig({ dashboardId });
    }
  }, [dashboardId, fetchConfig]);

  const showGoalSel = () => setGoalSelectorOpen(true);
  const onGoalSelectorClose = () => setGoalSelectorOpen(false);

  useMemo(() => {

    if (!periodData || !periodData.length || periodData.length <= 0 || !configData?.selectedKpi) {
      setMatchedData([]);
    }

    const matchedDataItems = periodData
      .filter((item) =>
        configData.selectedKpi.some(
          (kpi) =>
            kpi.value === item.activityId &&
            kpi.type === (item.activityType === "USER" ? "ACTIVITY" : "SYSTEM")
        )
      )
      .map((item) => ({
        id: item.activityId, // Use activityId as id
        activityId:item.activityId,
        activityType:item.activityType,
        drilldown: item.activityModule.toLowerCase(), // e.g., "placements" or "jobs"
        title: item.activityName,
        trackWithoutTarget: item.trackWithoutTarget,
        target: item.targetValue,
        actual: item.actualValue,
        monthName: item.monthName || "N/A", // Default for quarters/years
        difference: item.difference,
        prev: item.prev || [], // Ensure prev data is passed
        type: item.targetType.toLowerCase() // e.g., "currency" or "counter"
      }));

    setMatchedData(matchedDataItems);

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
  const handleExpand = async ({ tile }) => {
    setDrillDownTile(tile);
    setDrillDownModalVisible(true);
  };

  const handleModalClose = () => setDrillDownModalVisible(false);

  return (
    <>
      <Card
        bordered
        style={{ backgroundColor: "#1e3a8a", border: "none" }}
        styles={{ header: { color: "#fff", borderBottom: "none", fontSize: 18 } }}
        extra={
          <span
            onClick={showGoalSel}
            style={{ cursor: "pointer", color: "white", fontSize: "smaller" }}
          >
            Customise
          </span>
        }
        title={<GoalPeriodHeader selectedPeriodLabel={setSelectedPeriodLabel} />}
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
            <div style={{ textAlign: "center", alignContent: "center", width: "100%", color: "#fff" }}>
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
                  onExpand={() => handleExpand({ tile: item })}
                />
              </div>
            ))
          )}
        </div>
      </Card>

      <Modal
        width="80vw"
        style={{ top: 20 }}
        title={`Goals ${selectedPeriodLabel}`}
        open={isDrillDownModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <GoalsDrillDown apiKey={apiKey} apiServer={apiServer} tenantId={tenantId} userId={userId}
                        tileData={drillDownTile} matchedData={matchedData} selectedPeriodLabel={selectedPeriodLabel} />
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
