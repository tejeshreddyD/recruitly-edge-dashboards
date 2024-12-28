import React, { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { fetchUserGoalsRecordData } from "@api/dashboardDataApi.js";
import { RECRUITLY_AGGRID_THEME } from "@constants";
import useUserDashboardGoalsDataStore from "@api/userDashboardGoalsDataStore";
import { CsvExportModule, ModuleRegistry } from "ag-grid-community";
import { ExcelExportModule, ServerSideRowModelModule } from "ag-grid-enterprise";
import { Button, Flex } from "antd";
import { DatabaseFilled } from "@ant-design/icons";
import { DiDatabase } from "react-icons/di";

// Register the required modules
ModuleRegistry.registerModules([ServerSideRowModelModule, CsvExportModule, ExcelExportModule]);

const nameGetter = function(params) {
  return `${params.data.firstName || ""} ${params.data.surname || ""}`.trim();
};
const sysrecordCandidateGetter = function(params) {
  if (!params.data.candidate) {
    return "";
  }
  return `${params.data.candidate.label || ""}`.trim();
};
const sysrecordContactGetter = function(params) {
  if (!params.data.contact) {
    return "";
  }
  return `${params.data.contact.label || ""}`.trim();
};
const sysrecordCompanyGetter = function(params) {
  if (!params.data.company) {
    return "";
  }
  return `${params.data.company.label || ""}`.trim();
};

const activityColumnMap = {
  LEADS_CREATED: [
    { field: "reference", headerName: "#REF" },
    { field: "firstName", headerName: "Name", valueGetter: nameGetter },
    { field: "owner.label", headerName: "Owner" },
    { field: "createdOn", headerName: "Created At", type: "date", dateFormat: "dd/MM/yy", sort: "desc", sortedAt: 0 }
  ],
  PLACEMENTS_CREATED: [
    { field: "reference", headerName: "#REF" },
    { field: "candidate._id", headerName: "Candidate", valueGetter: sysrecordCandidateGetter },
    { field: "contact._id", headerName: "Contact", valueGetter: sysrecordContactGetter },
    { field: "company._id", headerName: "Company", valueGetter: sysrecordCompanyGetter },
    { field: "owner.label", headerName: "Owner" },
    { field: "createdOn", headerName: "Created At", type: "date", dateFormat: "dd/MM/yy", sort: "desc", sortedAt: 0 }
  ],
  PLACEMENTS_VALUE: [
    { field: "reference", headerName: "#REF" },
    { field: "candidate._id", headerName: "Candidate", valueGetter: sysrecordCandidateGetter },
    { field: "contact._id", headerName: "Contact", valueGetter: sysrecordContactGetter },
    { field: "company._id", headerName: "Company", valueGetter: sysrecordCompanyGetter },
    { field: "owner.label", headerName: "Owner" },
    { field: "createdOn", headerName: "Created At", type: "date", dateFormat: "dd/MM/yy", sort: "desc", sortedAt: 0 }
  ],
  CANDIDATES_CREATED: [
    { field: "reference", headerName: "#REF" },
    { field: "firstName", headerName: "Name", valueGetter: nameGetter },
    { field: "owner.label", headerName: "Recruiter" },
    { field: "createdOn", headerName: "Created At", type: "date", dateFormat: "dd/MM/yy", sort: "desc", sortedAt: 0 }
  ],
  CONTACTS_CREATED: [
    { field: "reference", headerName: "#REF" },
    { field: "firstName", headerName: "Name", valueGetter: nameGetter },
    { field: "owner.label", headerName: "Contact Owner" },
    { field: "createdOn", headerName: "Created At", type: "date", dateFormat: "dd/MM/yy", sort: "desc", sortedAt: 0 }
  ],
  DEFAULT: [
    { field: "reference", headerName: "#REF" },
    { field: "name", headerName: "Record" },
    { field: "owner.label", headerName: "Owner" },
    { field: "createdOn", headerName: "Created At", type: "date", dateFormat: "dd/MM/yy", sort: "desc", sortedAt: 0 }
  ]
};

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
        console.log("[Datasource] - rows requested by grid: ", params.request);

        const { startRow, endRow, sortModel } = params.request; // Extract sorting info
        const pageNumber = Math.floor(startRow / 25);
        const pageSize = endRow - startRow;

        // Determine sortField and sortOrder dynamically
        const sortField = sortModel?.[0]?.colId || "createdOn"; // Default to createdOn
        const sortOrder = sortModel?.[0]?.sort === "asc" ? "asc" : "desc"; // Default to descending

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

  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsExcel();
  }, []);

  return (
    <Flex vertical={true} gap={"middle"}>
      <Flex direction="row" align="center" justify="start" gap="small">
        <DiDatabase /><span>Records Added {selectedPeriodLabel}</span>
      </Flex>
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
    </Flex>
  );
};

export default RecordDataGrid;
