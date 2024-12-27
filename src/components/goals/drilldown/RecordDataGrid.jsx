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

const RecordDataGrid = ({ tileData }) => {
  const { selectedPeriod } = useUserDashboardGoalsDataStore((state) => state);
  const gridRef = useRef(null);

  const [colDefs] = useState([
    { field: "reference", headerName: "#REF" },
    { field: "label", headerName: "Record" },
    { field: "owner.label", headerName: "Owner" },
    { field: "createdOn", headerName: "Created At", type: "date", dateFormat: "dd/MM/yy" },
    { field: "owner.", headerName: "Owner" }
  ]);

  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 90,
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

          params.success({
            rowData: result.data || [],
            rowCount: result.total || -1,
          });
        } catch (error) {
          console.error("Error fetching data:", error);
          params.fail();
        }
      },
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