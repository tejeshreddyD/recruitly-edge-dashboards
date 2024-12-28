import React, { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { fetchUserGoalsRecordData } from "@api/dashboardDataApi.js";
import { RECRUITLY_AGGRID_THEME } from "@constants";
import useUserDashboardGoalsDataStore from "@api/userDashboardGoalsDataStore";
import { ModuleRegistry } from "ag-grid-community";
import { ServerSideRowModelModule } from "ag-grid-enterprise";

// Register the required modules
ModuleRegistry.registerModules([ServerSideRowModelModule]);

const nameGetter=function(params) {
  return `${params.data.firstName || ""} ${params.data.surname || ""}`.trim();
}

const activityColumnMap = {
  LEADS_CREATED: [
    { field: "reference", headerName: "#REF" },
    { field: "firstName", headerName: "Name",   valueGetter: nameGetter},
    { field: "owner.label", headerName: "Owner" },
    { field: "createdOn", headerName: "Created At", type: "date", dateFormat: "dd/MM/yy" }
  ],
  CANDIDATES_CREATED: [
    { field: "reference", headerName: "#REF" },
    { field: "firstName", headerName: "Name",   valueGetter: nameGetter},
    { field: "owner.label", headerName: "Recruiter" },
    { field: "createdOn", headerName: "Created At", type: "date", dateFormat: "dd/MM/yy" }
  ],
  CONTACTS_CREATED: [
    { field: "reference", headerName: "#REF" },
    { field: "firstName", headerName: "Name",   valueGetter: nameGetter},
    { field: "owner.label", headerName: "Contact Owner" },
    { field: "createdOn", headerName: "Created At", type: "date", dateFormat: "dd/MM/yy" }
  ],
  DEFAULT: [
    { field: "reference", headerName: "#REF" },
    { field: "name", headerName: "Record" },
    { field: "owner.label", headerName: "Owner" },
    { field: "createdOn", headerName: "Created At", type: "date", dateFormat: "dd/MM/yy" }
  ]
};

const RecordDataGrid = ({ tileData }) => {
  const { selectedPeriod } = useUserDashboardGoalsDataStore((state) => state);
  const gridRef = useRef(null);

  const [colDefs, setColDefs] = useState(activityColumnMap.DEFAULT);

  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 90
  }), []);

  const getServerSideDatasource = useCallback(() => {
    return {
      getRows: async (params) => {
        console.log("[Datasource] - rows requested by grid: ", params.request);

        const { startRow, endRow } = params.request;
        const pageNumber = Math.floor(startRow / 25);
        const pageSize = endRow - startRow;

        try {
          const { activityId, activityType } = tileData;
          const result = await fetchUserGoalsRecordData({
            periodCode: selectedPeriod,
            activityId,
            activityType,
            pageNumber,
            pageSize
          });

          // Update columns dynamically based on activity code
          const activityCode = result.data.activity?.code;
          const updatedColDefs = activityColumnMap[activityCode] || activityColumnMap.DEFAULT;
          setColDefs(updatedColDefs);

          params.success({
            rowData: result.data.records || [],
            rowCount: result.data.totalCount || -1
          });
        } catch (error) {
          console.error("Error fetching data:", error);
          params.fail();
        }
      }
    };
  }, [selectedPeriod, tileData]);

  const onGridReady = useCallback((params) => {
    const datasource = getServerSideDatasource();
    params.api.setGridOption("serverSideDatasource", datasource);
  }, [getServerSideDatasource]);

  return (
    <div style={{ height: "500px", width: "100%" }} className="ag-theme-quartz">
      <AgGridReact
        ref={gridRef}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        rowModelType="serverSide"
        pagination={true}
        paginationPageSize={25}
        cacheBlockSize={25}
        onGridReady={onGridReady}
        theme={RECRUITLY_AGGRID_THEME}
      />
    </div>
  );
};

export default RecordDataGrid;
