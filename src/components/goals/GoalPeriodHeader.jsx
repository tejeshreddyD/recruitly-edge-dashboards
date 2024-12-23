import React, { useEffect, useMemo, useCallback } from "react";
import { TrophyOutlined, DownOutlined } from "@ant-design/icons";
import { Dropdown, Button, Spin, Typography } from "antd";
import { LuCalendarDays } from "react-icons/lu";
import debounce from "lodash.debounce";
import useGoalsPeriodStore from "@api/userDashboardGoalsDataStore.js";

const { Text } = Typography;

const GoalPeriodHeader = () => {
  const {
    selectedPeriod,
    setPeriod,
    selectedMonth,
    selectedYear,
    fetchPeriodData,
    loading,
    error,
  } = useGoalsPeriodStore();

  // Set default period on mount
  useEffect(() => {
    if (!selectedPeriod) {
      const currentDate = new Date();
      setPeriod("THIS_MONTH", currentDate.getMonth() + 1, currentDate.getFullYear());
    }
  }, [selectedPeriod, setPeriod]);

  // Debounced fetch to reduce unnecessary API calls
  const fetchPeriodDataDebounced = useCallback(
    debounce((month, year) => fetchPeriodData(month, year), 300),
    [fetchPeriodData]
  );

  // Fetch data when selected period changes
  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchPeriodDataDebounced(selectedMonth, selectedYear);
    }
  }, [selectedMonth, selectedYear, fetchPeriodDataDebounced]);

  const menuItems = useMemo(
    () => [
      { key: "LAST_QUARTER", label: "Last Quarter" },
      { key: "LAST_MONTH", label: "Last Month" },
      { key: "THIS_MONTH", label: "This Month" },
      { key: "NEXT_MONTH", label: "Next Month" },
      { key: "NEXT_QUARTER", label: "Next Quarter" },
    ],
    []
  );

  const calculatePeriod = (period) => {
    const currentDate = new Date();
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();

    switch (period) {
      case "LAST_QUARTER":
        month -= 3;
        if (month <= 0) {
          month += 12;
          year -= 1;
        }
        break;
      case "LAST_MONTH":
        month -= 1;
        if (month <= 0) {
          month = 12;
          year -= 1;
        }
        break;
      case "NEXT_MONTH":
        month += 1;
        if (month > 12) {
          month = 1;
          year += 1;
        }
        break;
      case "NEXT_QUARTER":
        month += 3;
        if (month > 12) {
          month -= 12;
          year += 1;
        }
        break;
      default:
        break;
    }

    return { month, year };
  };

  const handleMenuClick = ({ key }) => {
    const { month, year } = calculatePeriod(key);
    setPeriod(key, month, year);
  };

  const menuConfig = {
    items: menuItems.map(({ key, label }) => ({
      key,
      label: (
        <>
          <LuCalendarDays style={{ marginRight: 4 }} />
          {label}
        </>
      ),
    })),
    onClick: handleMenuClick,
  };

  const selectedLabel = menuItems.find((item) => item.key === selectedPeriod)?.label || "Select Period";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <span style={{ display: "flex", alignItems: "center" }}>
        <TrophyOutlined style={{ marginRight: 8 }} /> Goals
      </span>
      <Dropdown menu={menuConfig} trigger={["click"]}>
        <Button
          size="small"
          style={{
            color: "white",
            background: "transparent",
            border: "none",
            boxShadow: "none",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {selectedLabel} <DownOutlined />
        </Button>
      </Dropdown>
      {loading && <></>}
      {error && (
        <Text type="danger" style={{ marginLeft: 12 }}>
          Error: {error}
        </Text>
      )}
    </div>
  );
};

export default GoalPeriodHeader;
