import React, { useState, useMemo, useEffect } from "react";
import { Checkbox, Drawer, Collapse, Alert, Button, message, Space } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import {
  helpActivity,
  helpSystem,
  getSortedSystemOptions,
  getSortedActivityOptions
} from "@components/goals/goalsConstants.jsx";
import useUserDashboardGoalsConfigStore from "@api/userDashboardGoalsConfigStore.js";

const { Panel } = Collapse;

const GoalSelector = ({ open, onClose, dashboardId }) => {
  const { configData, saveConfig } = useUserDashboardGoalsConfigStore();

  const [checkedValues, setCheckedValues] = useState([]);

  // Sync checkedValues with selectedKpi on initialisation or when configData changes
  useEffect(() => {
    if (configData?.selectedKpi) {
      setCheckedValues(configData.selectedKpi);
    }
  }, [configData]);

  const options = useMemo(() => {
    if (!configData || !configData.kpiData) return { system: [], activity: [] };
    const { system, activity } = configData.kpiData;
    return {
      system: getSortedSystemOptions(system),
      activity: getSortedActivityOptions(activity)
    };
  }, [configData]);

  // Helper to convert checkedValues to a unified array of objects
  const handleSelectionChange = (values, sourceOptions, type) => {
    const selectedItems = values.map((value) => ({
      value,
      type
    }));
    setCheckedValues((prev) => {
      const filteredPrev = prev.filter(
        (item) => !sourceOptions.some((option) => option.value === item.value)
      );
      return [...filteredPrev, ...selectedItems];
    });
  };

  // Save selected KPIs to the server
  const handleSave = async () => {
    try {
      const serializableSelectedKpi = checkedValues.map(({ value, type }) => ({
        value,
        type
      }));
      await saveConfig({ dashboardId, selectedKpi: serializableSelectedKpi });
      message.success("Your goals have been saved successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving user goals config:", error.message);
      message.error("Failed to save your goals. Please try again.");
    }
  };

  // Calculate selected counts
  const systemSelectedCount = checkedValues.filter((item) => item.type === "SYSTEM").length;
  const activitySelectedCount = checkedValues.filter((item) => item.type === "ACTIVITY").length;

  return (
    <Drawer
      width={550}
      title="Show/Hide Goals"
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
        {/* System Actions */}
        <Panel header={`System Actions (${systemSelectedCount} selected)`}
               key="1">
          <Alert message={helpSystem} type="info" style={{ marginBottom: "16px",fontSize: 11 }} />
          <Checkbox.Group
            value={checkedValues.filter((item) => item.type === "SYSTEM").map((item) => item.value)} // Extract values for UI
            onChange={(values) => handleSelectionChange(values, options.system, "SYSTEM")}
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            options={options.system}
          />
        </Panel>

        {/* User Activity Types */}
        <Panel header={`Your Activity Types (${activitySelectedCount} selected)`}
               key="2">
          <Alert message={helpActivity} type="info" style={{ marginBottom: "16px",fontSize: 11 }} />
          <Checkbox.Group
            value={checkedValues.filter((item) => item.type === "ACTIVITY").map((item) => item.value)} // Extract values for UI
            onChange={(values) => handleSelectionChange(values, options.activity, "ACTIVITY")}
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            options={options.activity}
          />
        </Panel>
      </Collapse>
    </Drawer>
  );
};

export default GoalSelector;
