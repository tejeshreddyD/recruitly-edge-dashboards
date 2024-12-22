import React, { useEffect } from "react";
import { TrophyOutlined, DownOutlined } from "@ant-design/icons";
import { Dropdown, Button } from "antd";
import useGoalsPeriodStore from "@api/useDashboardGoalsPeriodStore.js";
import { BsCalendar2Range } from "react-icons/bs";

const periods = [
  { label: "Last Quarter", value: "LAST_QUARTER" },
  { label: "Last Month", value: "LAST_MONTH" },
  { label: "This Month", value: "THIS_MONTH" },
  { label: "This Quarter", value: "THIS_QUARTER" },
  { label: "Next Quarter", value: "NEXT_QUARTER" }
];

const GoalPeriodHeader = () => {
  const { selectedPeriod, setPeriod, selectedMonth, selectedYear } = useGoalsPeriodStore();

  useEffect(() => {
    if (!selectedPeriod) {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      setPeriod("THIS_MONTH", currentMonth, currentYear);
    }
  }, [selectedPeriod, setPeriod]);

  const handleMenuClick = ({ key }) => {
    const period = periods.find((p) => p.value === key);
    const currentDate = new Date();
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();

    switch (period.value) {
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
      case "THIS_MONTH":
        break;
      case "THIS_QUARTER":
        month = Math.ceil((month + 2) / 3) * 3 - 2;
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

    setPeriod(period.value, month, year);
  };

  const menu = {
    items: periods.map((period) => ({
      key: period.value,
      label: period.label
    })),
    onClick: handleMenuClick
  };

  const selectedLabel = periods.find((p) => p.value === selectedPeriod)?.label || "Select Period";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <span style={{ display: "flex", alignItems: "center" }}>
        <TrophyOutlined style={{ marginRight: 8 }} /> Goals
      </span>
      <Dropdown menu={menu} trigger={["click", "hover"]}>
        <Button
          size="small"
          style={{
            color: "white",
            background: "transparent",
            border: "none",
            boxShadow: "none",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          <BsCalendar2Range style={{ marginRight: 4 }} /> {selectedLabel} <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};

export default GoalPeriodHeader;
