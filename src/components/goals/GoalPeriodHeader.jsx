import React, { useEffect, useMemo, useCallback } from "react";
import { TrophyOutlined, DownOutlined } from "@ant-design/icons";
import { Dropdown, Button, Spin, Typography, Divider } from "antd";
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
    selectedQuarter,
    fetchPeriodDataByMonth,
    fetchPeriodDataByQuarter,
    fetchPeriodDataByYear,
    loading,
    error,
  } = useGoalsPeriodStore();

  // Set default period on mount
  useEffect(() => {
    if (!selectedPeriod) {
      const currentDate = new Date();
      setPeriod("THIS_MONTH", currentDate.getMonth() + 1, currentDate.getFullYear(), "CURRENT_QUARTER");
    }
  }, [selectedPeriod, setPeriod]);

  // Debounced fetch for month-based data
  const fetchPeriodDataDebouncedByMonth = useCallback(
    debounce((month, year) => fetchPeriodDataByMonth(month, year), 300),
    [fetchPeriodDataByMonth]
  );

  // Debounced fetch for quarter-based data
  const fetchPeriodDataDebouncedByQuarter = useCallback(
    debounce((quarterCode) => fetchPeriodDataByQuarter(quarterCode), 300),
    [fetchPeriodDataByQuarter]
  );

  // Debounced fetch for year-based data
  const fetchPeriodDataDebouncedByYear = useCallback(
    debounce((year) => fetchPeriodDataByYear(year), 300),
    [fetchPeriodDataByYear]
  );

  // Fetch data when selected period changes
  useEffect(() => {
    if (selectedPeriod === "THIS_MONTH" && selectedMonth && selectedYear) {
      fetchPeriodDataDebouncedByMonth(selectedMonth, selectedYear);
    } else if (selectedPeriod.includes("QUARTER") && selectedQuarter) {
      fetchPeriodDataDebouncedByQuarter(selectedQuarter);
    } else if (selectedPeriod.includes("YEAR") && selectedYear) {
      fetchPeriodDataDebouncedByYear(selectedYear);
    }
  }, [selectedPeriod, selectedMonth, selectedYear, selectedQuarter, fetchPeriodDataDebouncedByMonth, fetchPeriodDataDebouncedByQuarter, fetchPeriodDataDebouncedByYear]);
  const menuItems = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();

    const getQuarterRange = (date) => {
      const startMonth = Math.floor(date.getMonth() / 3) * 3; // First month of the quarter
      const endMonth = startMonth + 2; // Last month of the quarter
      const start = new Date(date.getFullYear(), startMonth, 1);
      const end = new Date(date.getFullYear(), endMonth + 1, 0); // Last day of the quarter
      return `${start.toLocaleString("default", { month: "short" })} - ${end.toLocaleString("default", { month: "short" })}`;
    };

    const getMonthName = (date, offset = 0) => {
      const adjustedDate = new Date(date.getTime());
      adjustedDate.setMonth(adjustedDate.getMonth() + offset);
      return adjustedDate.toLocaleString("default", { month: "long" });
    };

    return [
      { key: "CURRENT_YEAR", label: `This Year (${currentYear})` },
      { key: "CURRENT_QUARTER", label: `This Quarter (${getQuarterRange(now)})` },
      { key: "THIS_MONTH", label: `This Month (${getMonthName(now)})` },
      {type: 'divider'},
      { key: "PREVIOUS_YEAR", label: `Last Year (${currentYear - 1})` },
      { key: "PREVIOUS_QUARTER", label: `Last Quarter (${getQuarterRange(new Date(now.getFullYear(), now.getMonth() - 3, 1))})` },
      { key: "LAST_MONTH", label: `Last Month (${getMonthName(now, -1)})` },
      {type: 'divider'},
      { key: "NEXT_YEAR", label: `Next Year (${currentYear + 1})` },
      { key: "NEXT_QUARTER", label: `Next Quarter (${getQuarterRange(new Date(now.getFullYear(), now.getMonth() + 3, 1))})` },
      { key: "NEXT_MONTH", label: `Next Month (${getMonthName(now, 1)})` },
    ];
  }, []);

  const calculatePeriod = (period) => {
    const currentDate = new Date();
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();
    let quarter = "CURRENT_QUARTER";

    switch (period) {
      case "PREVIOUS_QUARTER":
        quarter = "PREVIOUS_QUARTER";
        break;
      case "NEXT_QUARTER":
        quarter = "NEXT_QUARTER";
        break;
      case "PREVIOUS_YEAR":
        year -= 1;
        quarter = null;
        break;
      case "NEXT_YEAR":
        year += 1;
        quarter = null;
        break;
      case "THIS_YEAR":
        quarter = null;
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
      default:
        break;
    }

    return { month, year, quarter };
  };

  const handleMenuClick = ({ key }) => {
    const { month, year, quarter } = calculatePeriod(key);
    setPeriod(key, month, year, quarter);
  };

  const menuConfig = {
    items: menuItems,
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
      {loading && <Spin size="small" />}
      {error && (
        <Text type="danger" style={{ marginLeft: 12 }}>
          Error: {error}
        </Text>
      )}
    </div>
  );
};

export default GoalPeriodHeader;
