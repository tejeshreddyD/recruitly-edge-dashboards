import {
  useCallback, useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {
  ClientSideRowModelModule,
  ModuleRegistry
} from "ag-grid-community";
import { LicenseManager } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import { RECRUITLY_AGGRID_LICENSE, RECRUITLY_AGGRID_THEME } from "@constants";
import userDashboardPlannerDataStore from "@api/userDashboardPlannerDataStore.js";
import {
  calculateDaysBetween,
  getDateMoment,
  getDateStringByUserTimeZone,
  getTodayTimestampByTimeZone
} from "@utils/dateUtil.js";
import { Card, Tag } from "antd";
ModuleRegistry.registerModules([
  ClientSideRowModelModule
]);

LicenseManager.setLicenseKey(RECRUITLY_AGGRID_LICENSE)

const PlannerGridTasks = ({type = "TODAY",filterType = "ALL",date = ""}) => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();

  const {data,loading,error,fetchUserPlannerTasksData} = userDashboardPlannerDataStore()

  const [columnDefs, setColumnDefs] = useState([
    { field: "dueDate",
      label: "Due Date",
      cellRenderer:(params) => {

        const today = getTodayTimestampByTimeZone();
        const due_date = params.value

        const due_date_formatted = getDateMoment(params.value);

        if(due_date && due_date < today){

          const day_diff = calculateDaysBetween(today,due_date);

          return (<Tag color={"red"} title={due_date_formatted} content={"Past due"}>Past due {day_diff} day(s)</Tag>)
        }

        return (<Tag color={"blue"}>{due_date_formatted}</Tag>);
      }},
    { field: "subject", label: "Subject" },
    { field: "ownerName", label: "Assignee" },
    { field: "createdOn",
      cellRenderer:(params) => {
        console.log(params);
        return (getDateStringByUserTimeZone(params.value));
      }},
    { field: "status" },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      resize:false,
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
  return (<Card title={"Tasks"} bordered={false} styles={{header:{border:0},body:{height:"60vh"}}} style={{boxShadow:"none"}}>
      <div style={gridStyle}>
        <AgGridReact
          theme={RECRUITLY_AGGRID_THEME}
          loading={loading}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          rowGroupPanelShow={"onlyWhenGrouping"}
          groupDefaultExpanded={1}
          onGridReady={onGridReady}
        />
    </div></Card>);
};

export default PlannerGridTasks;