import {
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule
]);

const JobForecastGrid = ({ statuses = [] }) => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "70vh" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();

  const status_list = [];

  console.log("status_list", statuses);

  statuses.forEach((status) => {
    status_list.push({
      headerName: status.name,
      field: status.statusCode,
    });
  });

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Pipeline Count",
      children: status_list,
    },
    {
      headerName: "Weighted Pipeline",
      children: [
        { headerName: "Current", field: "current" },
        { headerName: "30 days", field: "gold" },
        { headerName: "60 days", field: "silver" },
        { headerName: "90 days", field: "bronze" },
        { headerName: "120 days", field: "bronze" },
      ],
    },
  ]);

  console.log(columnDefs);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact rowData={rowData} columnDefs={columnDefs} onGridReady={onGridReady} />
      </div>
    </div>
  );
};

export default JobForecastGrid;