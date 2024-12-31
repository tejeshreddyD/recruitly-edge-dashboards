import {
  useCallback, useEffect,
  useMemo,
  useState
} from "react";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { RECRUITLY_AGGRID_THEME } from "@constants";
import useUserDashboardJobsStore from "@api/userDashboardJobsStore.js";
import { getDateStringByUserTimeZone } from "@utils/dateUtil.js";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule
]);

const JobForecastGrid = ({ statuses = [] }) => {

  const { forecastData, forecastloading, error, fetchPipelineForecastData } = useUserDashboardJobsStore();

  const containerStyle = useMemo(() => ({ width: "100%", height: "70vh" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [rowData, setRowData] = useState();

  const status_list = [];

  statuses.forEach((status) => {
    status_list.push({
      headerName: status.name,
      field: status.statusCode,
      width:100
    });
  });

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      suppressMovable:false,
      resizable: false,
      minWidth: 100,
    };
  }, []);

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Job",
      field: "jobLabel",
      minWidth: 250,
      pinned:'left'
    },
    {
      headerName: "Pulse",
      field: "",
      minWidth: 100,
    },
    {
      headerName: "Created",
      field: "createdDate",
      minWidth: 150,
      cellRenderer: (param) => {
        return getDateStringByUserTimeZone(param.data.createdDate);
      }
    },
    {
      headerName: "Closing Date",
      field: "closingDate",
      minWidth: 150,
      cellRenderer: (param) => {

        return getDateStringByUserTimeZone(param.data.closingDate);
      }
    },{
      headerName: "Fee",
      field: "fee",
      minWidth: 150,
    },
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

  const onGridReady = useCallback((params) => {

   fetchPipelineForecastData();

  }, []);

  useEffect(() => {

    setRowData(forecastData);

  },[forecastData])

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          loading={forecastloading}
          theme={RECRUITLY_AGGRID_THEME}
          defaultColDef={defaultColDef}
          rowData={rowData}
          columnDefs={columnDefs}
          onGridReady={onGridReady} />
      </div>
    </div>
  );
};

export default JobForecastGrid;