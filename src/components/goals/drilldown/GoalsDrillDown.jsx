import React, {
  useMemo,
  useState
} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { RECRUITLY_AGGRID_THEME } from "@constants";
import { Tabs, Tooltip } from "antd";
import { DollarCircleFilled } from "@ant-design/icons";

const GoalsDrillDown = ({ apiServer, apiKey, tenantId, userId, tile, matchedData }) => {

  const [rowData, setRowData] = useState([
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false }
  ]);

  const [goalItems, setGoalItems] = useState([]);

  const [colDefs, setColDefs] = useState([
    { field: "make" },
    { field: "model" },
    { field: "price" },
    { field: "electric" }
  ]);

  useMemo(() => {
    const goalItemLIst = matchedData.map((item) => (
      {
        key: item.id,
        label: (<>
            {item.title} {item.type === "value" && <DollarCircleFilled style={{ marginLeft: 4, color: "green" }} />}
          </>
        ),
        children: (
          <div style={{ width: "100%", height: "500px" }} className={"ag-theme-quartz"}>
            <AgGridReact theme={RECRUITLY_AGGRID_THEME} rowData={rowData} columnDefs={colDefs} />
          </div>
        )
      }
    ));
    setGoalItems(goalItemLIst);
  }, [matchedData]);


  return (
    <div style={{ height: "100%", width: "100%",paddingTop: "16px" }}>
      <Tabs
        tabPosition="left"
        style={{ width: "100%", height: "100%", borderRight: 0 }}
        items={goalItems}
      />
    </div>
  );
};

export default GoalsDrillDown;

