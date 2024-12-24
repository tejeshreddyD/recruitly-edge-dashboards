import {
  useCallback, useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import { RowGroupingModule, RowGroupingPanelModule } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import { RECRUITLY_AGGRID_THEME } from "@constants";
import userDashboardPlannerDataStore from "@api/userDashboardPlannerDataStore.js";
import { getTodayTimestampByTimeZone } from "@utils/dateUtil.js";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowGroupingModule,
  RowGroupingPanelModule,
  ValidationModule
]);

const PlannerGridTasks = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();

  const {data,loading,error,fetchUserPlannerTasksData} = userDashboardPlannerDataStore()

  const [columnDefs, setColumnDefs] = useState([
    { field: "subject" },
    { field: "dueDate"},
    { field: "ownerName" },
    { field: "sport" },
    { field: "status" },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
    };
  }, []);

  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 200,
    };
  }, []);



  const onGridReady = useCallback((params) => {

    const date = getTodayTimestampByTimeZone();

    fetchUserPlannerTasksData({start_date:date,end_date:date});

  }, []);


  useEffect(() => {

    setRowData(data);

  }, [data]);
  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          theme={RECRUITLY_AGGRID_THEME}
          loading={loading}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          rowGroupPanelShow={"always"}
          groupDefaultExpanded={1}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

export default PlannerGridTasks;