import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { fetchUserGoalsRecordData } from "@api/dashboardDataApi.js";
import { RECRUITLY_AGGRID_THEME } from "@constants";
import useUserDashboardGoalsDataStore from "@api/userDashboardGoalsDataStore";
import { CsvExportModule, ModuleRegistry } from "ag-grid-community";
import { ExcelExportModule, ServerSideRowModelModule, SparklinesModule } from "ag-grid-enterprise";
import { activityColumnMap } from "@components/goals/drilldown/recordDataGridConstants.jsx";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";

ModuleRegistry.registerModules([ServerSideRowModelModule, CsvExportModule, ExcelExportModule, SparklinesModule.with(AgChartsEnterpriseModule)]);

const RecordDataGrid = ({ tileData, selectedPeriodLabel }) => {

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
        const { startRow, endRow, sortModel } = params.request;
        const pageNumber = Math.floor(startRow / 25);
        const pageSize = endRow - startRow;
        const sortField = sortModel?.[0]?.colId || "createdOn";
        const sortOrder = sortModel?.[0]?.sort === "asc" ? "asc" : "desc";

        try {
          const { activityId, activityType } = tileData;
          const result = await fetchUserGoalsRecordData({
            periodCode: selectedPeriod,
            activityId,
            activityType,
            pageNumber,
            pageSize,
            sortField,
            sortOrder
          });
          const activityCode = result.data.activity?.code;


          const updatedColDefs = activityColumnMap[activityCode] ? activityColumnMap[activityCode] : (activityType === 'USER' ? activityColumnMap.JOURNAL : activityColumnMap.DEFAULT);
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
  }, [selectedPeriod,tileData]);

  const onGridReady = useCallback((params) => {
    const datasource = getServerSideDatasource();
    params.api.setGridOption("serverSideDatasource", datasource);
  }, [getServerSideDatasource]);

  useEffect(() => {
    if (gridRef.current && gridRef.current.api) {
      const datasource = getServerSideDatasource();
      gridRef.current.api.setGridOption("serverSideDatasource", datasource);
      gridRef.current.api.setGridOption("refreshServerSideStore", { purge: true });
    }
  }, [selectedPeriod]);

  return (
    <div>
      <div style={{ height: "500px", width: "100%" }} className="ag-theme-quartz">
        <AgGridReact
          headerHeight={36}
          rowHeight={30}
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
    </div>
  );
};

export default RecordDataGrid;
