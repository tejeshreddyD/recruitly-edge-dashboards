import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import { ColumnApiModule, CsvExportModule, ModuleRegistry } from "ag-grid-community";
import {
  ExcelExportModule,
  ServerSideRowModelModule,
  SparklinesModule,
} from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";

import { fetchUserGoalsRecordData } from "@api/dashboardDataApi.js";
import useUserDashboardGoalsDataStore from "@api/userDashboardGoalsDataStore";
import { activityColumnMap } from "@components/goals/drilldown/recordDataGridConstants.jsx";
import { RECRUITLY_AGGRID_THEME } from "@constants";

import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([
  ServerSideRowModelModule,
  CsvExportModule,
  ExcelExportModule,
  SparklinesModule.with(AgChartsEnterpriseModule),
  ColumnApiModule,
]);

const RecordDataGrid = ({ tileData, selectedPeriodLabel }) => {
  const { selectedPeriod } = useUserDashboardGoalsDataStore((state) => state);
  const gridRef = useRef(null);
  const [colDefs, setColDefs] = useState(
    tileData.activityType === "USER" ? activityColumnMap.JOURNAL : activityColumnMap.DEFAULT
  );

  const [activityCode, setActivityCode] = useState(null);

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      minWidth: 90,
    }),
    []
  );

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
            sortOrder,
          });

          const newActivityCode = result.data.activity?.code;
          setActivityCode(newActivityCode);

          const updatedColDefs =
            activityColumnMap[newActivityCode] ||
            (activityType === "USER" ? activityColumnMap.JOURNAL : activityColumnMap.DEFAULT);

          console.log("Selected colDefs:", updatedColDefs);
          setColDefs(updatedColDefs);

          params.success({
            rowData: result.data.records || [],
            rowCount: result.data.totalCount || -1,
          });
        } catch (error) {
          console.error("Error fetching data:", error);
          params.fail();
        }
      },
    };
  }, [selectedPeriod, tileData]);

  useEffect(() => {
    if (gridRef.current && gridRef.current.api) {
      const datasource = getServerSideDatasource();
      gridRef.current.api.setGridOption("serverSideDatasource", datasource);
      gridRef.current.api.setGridOption("refreshServerSideStore", { purge: true });
      restoreColumnState(); // Restore column state after data fetch
    }
  }, [selectedPeriod, getServerSideDatasource]);

  useEffect(() => {
    if (gridRef.current?.api) {
      restoreColumnState();
    }
  }, [colDefs, activityCode]);


  const onGridReady = useCallback(
    (params) => {
      gridRef.current = params;
      const datasource = getServerSideDatasource();
      params.api.setGridOption("serverSideDatasource", datasource);
      restoreColumnState();
    },
    [getServerSideDatasource]
  );

  const saveColumnState = () => {
    const key = tileData.activityType === "USER" ? "JOURNAL" : activityCode;
    if (!key) {
      console.error("ActivityCode or ActivityId or ActivityName is not available");
      return;
    }

    const columnApi = gridRef.current?.api;
    if (!columnApi) {
      console.error("Column API is not initialized");
      return;
    }

    const columnState = columnApi.getColumnState();
    try {
      // Save the column state to localStorage
      localStorage.setItem(`columnState_${key}`, JSON.stringify(columnState));
      console.log(`Column state saved with key: columnState_${key}`);
      console.log("Saved Column State:", columnState);

      // Display saved data from localStorage
      const savedState = localStorage.getItem(`columnState_${key}`);
      console.log("Data in localStorage:", JSON.parse(savedState));
    } catch (error) {
      console.error("Error saving column state to localStorage:", error);
    }
  };


  const restoreColumnState = () => {
    if (!gridRef.current?.api) return;

    const key = tileData.activityType === "USER" ? "JOURNAL": activityCode;
    if (!key) return;

    const savedState = localStorage.getItem(`columnState_${key}`);
    if (savedState) {
      try {
        const columnState = JSON.parse(savedState);
        gridRef.current.api.applyColumnState({ state: columnState, applyOrder: true });
        console.log("Restored column state from localStorage:", columnState);
      } catch (error) {
        console.error("Error restoring column state from localStorage:", error);
      }
    } else {
      console.log(`No saved column state for key: ${key}`);
    }
  };


  const onColumnResized = (event) => {
    console.log("Column resized:", event);
    if (event.finished) {
      saveColumnState();
    }
  };

  const onColumnMoved = () => {
    saveColumnState();
  };

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
          onColumnResized={onColumnResized}
          onColumnMoved={onColumnMoved}
          theme={RECRUITLY_AGGRID_THEME}
        />
      </div>
    </div>
  );
};

export default RecordDataGrid;
