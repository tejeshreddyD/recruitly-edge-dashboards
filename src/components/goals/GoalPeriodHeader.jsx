import React, { useEffect, useMemo, useCallback, useState } from "react";
import { TrophyOutlined, DownOutlined } from "@ant-design/icons";
import { Dropdown, Button, Spin, Typography } from "antd";
import debounce from "lodash.debounce";
import useGoalsPeriodStore from "@api/userDashboardGoalsDataStore.js";

const { Text } = Typography;

const GoalPeriodHeader = ({ theme = "dark", selectedPeriodLabel }) => {
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
    error
  } = useGoalsPeriodStore();

  const [label, setLabel] = useState("Select Period");

  const menuItems = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();

    const getQuarterRange = (date) => {
      const startMonth = Math.floor(date.getMonth() / 3) * 3;
      const endMonth = startMonth + 2;
      const start = new Date(date.getFullYear(), startMonth, 1);
      const end = new Date(date.getFullYear(), endMonth + 1, 0);
      return `${start.toLocaleString("default", { month: "short" })} - ${end.toLocaleString("default", { month: "short" })}`;
    };

    const getMonthName = (date, offset = 0) => {
      const adjustedDate = new Date(date.getFullYear(), date.getMonth() + offset, 1); // Use the proper month offset
      return adjustedDate.toLocaleString("default", { month: "long" });
    };

    const getLast6Months = () => {
      const months = [];
      for (let i = -2; i >= -7; i--) { // Generate last 6 months (not including last month)
        const adjustedDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const key = `${String(adjustedDate.getMonth() + 1).padStart(2, "0")}/${adjustedDate.getFullYear()}`;
        const label = `${adjustedDate.toLocaleString("default", { month: "short" })} ${adjustedDate.getFullYear()}`;
        months.push({ key, label });
      }
      return months;
    };

    return [
      { key: "CURRENT_YEAR", label: `This Year (${currentYear})` },
      { key: "CURRENT_QUARTER", label: `This Quarter (${getQuarterRange(now)})` },
      { key: "THIS_MONTH", label: `This Month (${getMonthName(now)})` },
      { type: "divider" },
      { key: "LAST_MONTH", label: `Last Month (${getMonthName(now, -1)})` },
      {
        key: "PREVIOUS_QUARTER",
        label: `Last Quarter (${getQuarterRange(new Date(now.getFullYear(), now.getMonth() - 3, 1))})`
      },
      { key: "PREVIOUS_YEAR", label: `Last Year (${currentYear - 1})` },
      { type: "divider" },
      ...getLast6Months() // Add last 6 months dynamically
    ];
  }, []);


  useEffect(() => {
    if (!selectedPeriod) {
      const currentDate = new Date();
      setPeriod("THIS_MONTH", currentDate.getMonth() + 1, currentDate.getFullYear(), "CURRENT_QUARTER");
    }
  }, [selectedPeriod, setPeriod]);

  useEffect(() => {
    const selectedLabel = menuItems.find((item) => item.key === selectedPeriod)?.label || "Select Period";
    setLabel(selectedLabel);
    selectedPeriodLabel(selectedLabel);
  }, [selectedPeriod, menuItems, selectedPeriodLabel]);

  const fetchDebouncedData = useCallback(
    debounce((period, month, year, quarter) => {
      console.log("fetchDebouncedData ", period, month, year, quarter);
      if (period.includes("/")) {
        fetchPeriodDataByMonth(month, year);
      } else if (period.includes("_MONTH") && month && year) {
        fetchPeriodDataByMonth(month, year);
      } else if (period.includes("_QUARTER") && quarter) {
        fetchPeriodDataByQuarter(quarter);
      } else if (period.includes("_YEAR") && year) {
        fetchPeriodDataByYear(year);
      }
    }, 300),
    [fetchPeriodDataByMonth, fetchPeriodDataByQuarter, fetchPeriodDataByYear]
  );

  useEffect(() => {
    fetchDebouncedData(selectedPeriod, selectedMonth, selectedYear, selectedQuarter);
    return () => fetchDebouncedData.cancel();
  }, [selectedPeriod, selectedMonth, selectedYear, selectedQuarter, fetchDebouncedData]);

  const handleMenuClick = ({ key }) => {

    console.log(key);

    const currentDate = new Date();
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();
    let quarter = "CURRENT_QUARTER";

    if (key === "PREVIOUS_YEAR") {
      year -= 1;
    } else if (key === "NEXT_YEAR") {
      year += 1;
    } else if (key === "LAST_MONTH") {
      month -= 1;
      if (month <= 0) {
        month = 12;
        year -= 1;
      }
    } else if (key === "NEXT_MONTH") {
      month += 1;
      if (month > 12) {
        month = 1;
        year += 1;
      }
    } else if (key === "PREVIOUS_QUARTER") {
      quarter = "PREVIOUS_QUARTER";
    } else if (key === "NEXT_QUARTER") {
      quarter = "NEXT_QUARTER";
    } else if (key.includes("/")) {
      const [m, y] = key.split("/");
      month = parseInt(m);
      year = parseInt(y);
      console.log(`Month: ${m}, Year: ${y}`);
    }

    setPeriod(key, month, year, quarter);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <span style={{ display: "flex", alignItems: "center" }}>
        <TrophyOutlined style={{ marginRight: 8 }} /> Goals
      </span>
      <Dropdown menu={{
        items: menuItems,
        onClick: handleMenuClick
      }}
                trigger={["click"]}
      >
        <Button
          size="small"
          style={{
            color: `${theme === "dark" ? "white" : "black"}`,
            background: "transparent",
            boxShadow: "none",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          {label} <DownOutlined />
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
