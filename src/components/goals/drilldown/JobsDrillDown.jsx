import React, {
  useState
} from "react";
import { AgGridReact } from "ag-grid-react";

import { RECRUITLY_AGGRID_THEME } from "@constants";

import "ag-grid-community/styles/ag-theme-quartz.css";

const JobsDrillDown = ({ apiServer, apiKey, tenantId, userId, tile }) => {

  const [rowData, setRowData] = useState([
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false }
  ]);

  const [colDefs, setColDefs] = useState([
    { field: "make" },
    { field: "model" },
    { field: "price" },
    { field: "electric" }
  ]);

  return (
    <div style={{height:'100%',width:'100%'}}>
      <>Jobs DrillDown ${tile.title}</>
      <div style={{ width: "100%", height: "500px" }} className={'ag-theme-quartz'}>
        <AgGridReact theme={RECRUITLY_AGGRID_THEME} rowData={rowData} columnDefs={colDefs} />
      </div>
    </div>
  );
};

export default JobsDrillDown;

