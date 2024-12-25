import {
  useCallback, useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  RowSelectionModule
} from "ag-grid-community";
import { LicenseManager } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import { Card, Tag } from "antd";

import userDashboardPlannerDataStore from "@api/userDashboardPlannerDataStore.js";
import { RECRUITLY_AGGRID_LICENSE, RECRUITLY_AGGRID_THEME } from "@constants";
import {
  calculateDaysBetween,
  getDateMoment,
  getDateStringByUserTimeZone, getEndOfDayTimestamp,
  getTodayTimestampByTimeZone
} from "@utils/dateUtil.js";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule
]);

LicenseManager.setLicenseKey(RECRUITLY_AGGRID_LICENSE)

const PlannerJobApplicationsGrid = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();

  const {data,loading,error,fetchUserPlannerJobApplicationData} = userDashboardPlannerDataStore()

  const [columnDefs, setColumnDefs] = useState([
    { field: "applicantName",
      label: "Applicant Name",
      cellRenderer:(params) => {

        return (params.value);
      }},
    { field: "applicantEmail", headerName: "Applicant Email" },
    { field: "job.name", headerName: "Job" },
    { field: "company.name", headerName: "Company",
      cellRenderer:(params) => {

        return (params.value);

      } },
    { field: "appliedOn", headerName: "Applied On",
      cellRenderer:(params) => {
        return (getDateStringByUserTimeZone(params.value));
      }}
  ]);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      suppressMovable:false,
      resizable: false,
      minWidth: 100,
    };
  }, []);

  const rowSelection = useMemo(() => {
    return { mode: "singleRow" };
  }, []);

  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 200,
    };
  }, []);

  const onGridReady = useCallback((params) => {

    fetchUserPlannerJobApplicationData({page:0,page_size:25});

  }, []);


  useEffect(() => {

    setRowData(data.data);

  }, [data]);
  return (<Card title={"Job Applications"} bordered={false} styles={{header:{border:0},body:{height:"60vh"}}} style={{boxShadow:"none"}}>
    <div style={gridStyle}>
      <AgGridReact
        theme={RECRUITLY_AGGRID_THEME}
        loading={loading}
        rowData={rowData}
        columnDefs={columnDefs}
        rowSelection={rowSelection}
        defaultColDef={defaultColDef}
        autoGroupColumnDef={autoGroupColumnDef}
        rowGroupPanelShow={"onlyWhenGrouping"}
        groupDefaultExpanded={1}
        onGridReady={onGridReady}
      />
    </div></Card>);
};

export default PlannerJobApplicationsGrid;