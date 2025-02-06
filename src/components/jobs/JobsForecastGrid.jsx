import {
  useCallback, useEffect,
  useMemo,
  useState
} from "react";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  ValidationModule
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Flex, Image, Tooltip, Typography } from "antd";
import { FaBuilding, FaRegBuilding, FaRegGrinStars, FaRegSmile } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { PiSmileySadBold } from "react-icons/pi";

import useUserDashboardJobsStore from "@api/userDashboardJobsStore.js";
import { RECRUITLY_AGGRID_THEME } from "@constants";
import { getDateStringByUserTimeZone } from "@utils/dateUtil.js";
import { dashboardAction, dashboardActionCode } from "@utils/actionsUtil.js";
import { GiSeaTurtle, GiTortoise, GiTurtle, GiTurtleShell } from "react-icons/gi";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule
]);

const { Text } = Typography;

const JobForecastGrid = ({ statuses = [] }) => {

  const {
    forecastData,
    forecastloading,
    error,
    tenantCurrency,
    fetchPipelineForecastData
  } = useUserDashboardJobsStore();

  const containerStyle = useMemo(() => ({ width: "100%", height: "450px" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [rowData, setRowData] = useState();

  const getCompanyLogo = (jobDoc) => {

    const model = jobDoc.companyModel;

    // Helper function to extract domain from a URL or email
    const extractDomain = (urlOrEmail) => {

      try {
        if (urlOrEmail.includes("@")) {
          // Extract domain from email
          return urlOrEmail.split("@")[1];
        } else {
          // Extract domain from URL
          const url = new URL(urlOrEmail);
          return url.hostname;
        }
      } catch (error) {
        return null;
      }
    };

    // Validate if a string is a proper domain
    const isValidDomain = (domain) => {

      if(!domain){
        return false;
      }

      const domainRegex = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.[A-Za-z]{2,}$/;
      return domainRegex.test(domain);
    };

    // Determine the domain
    let domain = model.domain || null;

    if (!domain && model.website) {
      domain = extractDomain(model.website);
    }

    if (!domain && model.emailDomain) {
      domain = extractDomain(model.emailDomain);
    }

    if (domain && !isValidDomain(domain)) {
      domain = null; // Invalidate if the domain does not match the regex
    }

    // Determine the image source
    if (domain) {
      return <img height={25} src={`https://logo.clearbit.com/${domain}`} alt={""} />;
    } else {
      return <FaBuilding size={25} />; // Use the FaBuilding icon from react-icons for the fallback
    }
  };


  const getTrends = (model) => {
    const avgDaysInCurrentStage = Math.round(model.avgDaysPerStage);
    const estDaysToClose = Math.round(model.estimatedDaysToClose);
    const daysRemainingToClose = Math.round(model.daysRemainingToClose);
    const daysInCurrentStage = Math.round(model.daysInCurrentStage);
    const actualDaysToPlace = Math.round(model.actualDaysToClose);
    const weightedStageCode = model.weightedStageCode;

    switch (weightedStageCode) {
      case "PLACED":
        if (actualDaysToPlace <= estDaysToClose) {
          return (<Tooltip
            title={`Exceeded expectations! Placement was made within ${actualDaysToPlace} days, meeting the expectation of ${estDaysToClose} days.`}><FaRegGrinStars
            color={"green"} size={20} /></Tooltip>);
        } else if (actualDaysToPlace <= (estDaysToClose + (estDaysToClose * 25 / 100))) {
          return (<Tooltip
            title={`Good job! Placement took ${actualDaysToPlace} days, slightly longer than the expected ${estDaysToClose} days.`}><FaRegGrinStars
            color={"green"} size={20} /></Tooltip>);
        } else {
          return (
            <Tooltip title={`Placement took ${actualDaysToPlace} days, exceeding the expected ${estDaysToClose} days.`}><PiSmileySadBold
              color={"red"} size={20} /></Tooltip>);
        }
      case "OFFER":
      case "INTERVIEW":
      case "CV_SENT":
      case "SHORT_LIST":
        if (daysInCurrentStage > avgDaysInCurrentStage) {
          return (<Tooltip
            title={`Start chasing! ${daysInCurrentStage} days in the current stage, slower than the average of ${avgDaysInCurrentStage} days.`}><GiTortoise
            color={"rgb(255, 95, 21)"} size={20} /></Tooltip>);
        } else {
          return (
            <Tooltip title={`${daysInCurrentStage} days in the current stage.`}><FaRegSmile color={"rgb(255, 95, 21)"}
                                                                                            size={20} /></Tooltip>);
        }
      default:
        return (<Tooltip title={`${daysInCurrentStage} days in the current stage with no progress.`}><PiSmileySadBold
          color={"red"} size={20} /></Tooltip>);
    }
  };

  const status_list = [];

  statuses.forEach((status) => {
    status_list.push({
      headerName: status.name,
      field: `pipelines.${status.statusCode}`,
      width: 100,
      cellDataType: "number",
      onCellClicked: (params) => {
        dashboardAction(params.event, dashboardActionCode.VIEW_PIPELINE_SIDEBAR, { records: [{ jobId: params.data.jobId }] });
      },
      cellRenderer: (row) => {
        return row.data.pipelines[status.statusCode];
      }
    });
  });

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      suppressMovable: false,
      resizable: false,
      minWidth: 100
    };
  }, []);

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Job",
      field: "jobLabel",
      minWidth: 350,
      pinned: "left",
      cellRenderer: (row) => {

        const job = row.data;

        return (<Flex align="center" gap={10} style={{ marginBottom: "auto" }}>
          <Flex align={"center"} justify={"center"}>{getCompanyLogo(job)}</Flex>
          <Flex vertical align="start" justify="center" style={{ flexGrow: 1 }} gap={0}>
            <Flex align="center" style={{ whiteSpace: "nowrap" }}>
              <Text
                ellipsis
                className="recruitly-candidate-name"
                style={{ maxWidth: 325, fontSize: "14px", fontWeight: "400", cursor: "pointer" }}
                onClick={(e) => {
                  e.preventDefault();
                  window.COOLUTIL.viewRecordPopupByType("JOB", job.jobRef);
                }}
              >
                {job.jobLabel}
              </Text>
            </Flex>
            <Flex gap={"small"} align={"flex-start"}>
              <Text ellipsis color="secondary" title={job.companyLabel}
                    style={{ marginBottom: 0, fontSize: 11, color: "#6b7483", maxWidth: job.jobLocation ? 200 : 300 }}>
                {job.companyLabel}
              </Text>
              {job.jobLocation && (
                <Text ellipsis color="secondary" title={job.jobLocation}
                      style={{ marginBottom: 0, fontSize: 11, color: "#6b7483", maxWidth: 100 }}>
                  {"| "}<IoLocationOutline size={10} color={"#6b7483"} />{job.jobLocation}
                </Text>
              )}
            </Flex>
          </Flex>
        </Flex>);

      }
    },
    {
      headerName: "Pulse",
      field: "_id",
      maxWidth: 75,
      cellRenderer: (row) => {
        const job = row.data;
        return (
          <span style={{ display: "flex", alignItems: "center", height: "100%" }}>{getTrends(job)}</span>
        );
      }
    }, {
      headerName: "Fee",
      field: "fee",
      minWidth: 150,
      cellRenderer: (param) => {

        const formatter = new Intl.NumberFormat("en-GB", {
          style: "currency",
          currency: tenantCurrency,
          minimumFractionDigits: 0
        });

        return formatter.format(param.value);

      }
    },
    ...status_list
  ]);

  const onGridReady = useCallback((params) => {

    fetchPipelineForecastData();

  }, []);

  useEffect(() => {

    setRowData(forecastData);

  }, [forecastData]);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          loading={forecastloading}
          rowHeight={50}
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