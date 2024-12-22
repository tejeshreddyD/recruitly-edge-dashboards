import React, { useState, useMemo } from "react";
import { Checkbox, Drawer, Collapse, Alert, Button, message, Space } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import {
  helpActivity,
  helpSystem,
  getSortedSystemOptions,
  getSortedActivityOptions,
} from "@components/goals/goalsConstants.jsx";
import useUserDashboardGoalsConfigStore from "@api/userDashboardGoalsConfigStore.js";

const { Panel } = Collapse;

const GoalSelector = ({ open, onClose, dashboardId }) => {
  const { configData, saveConfig } = useUserDashboardGoalsConfigStore();
  const [checkedValues, setCheckedValues] = useState(configData.selectedKpi || []);

  const options = useMemo(() => {
    if (!configData || !configData.kpiData) return { system: [], activity: [] };
    const { system, activity } = configData.kpiData;
    return {
      system: getSortedSystemOptions(system),
      activity: getSortedActivityOptions(activity),
    };
  }, [configData]);

  // Save selected KPIs to the server
  const handleSave = async () => {
    try {
      await saveConfig({ dashboardId, selectedKpi: checkedValues });
      message.success("Your goals have been saved successfully!");
      onClose(); // Optionally close the drawer after saving
    } catch (error) {
      message.error("Failed to save your goals. Please try again.");
    }
  };

  return (
    <Drawer width={550} title="Show/Hide Goals"
            onClose={onClose}
            open={open}
            extra={
              <Space>
                <Button type="primary" onClick={handleSave}>
                  Save Selection
                </Button>
              </Space>
            }
    >
      <Collapse
        accordion
        bordered
        defaultActiveKey={["1"]}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      >
        <Panel header="System Actions" key="1">
          <Alert message={helpSystem} type="info" style={{ marginBottom: "16px" }} />
          <Checkbox.Group
            value={checkedValues}
            onChange={(values) => setCheckedValues(values)}
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            options={options.system}
          />
        </Panel>
        <Panel header="Your Activity Types" key="2">
          <Alert message={helpActivity} type="info" style={{ marginBottom: "16px" }} />
          <Checkbox.Group
            value={checkedValues}
            onChange={(values) => setCheckedValues(values)}
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            options={options.activity}
          />
        </Panel>
      </Collapse>
    </Drawer>
  );
};

export default GoalSelector;
