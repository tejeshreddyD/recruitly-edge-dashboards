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
import { Flex, Tooltip,Typography } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { FaRegGrinStars, FaRegSmile } from "react-icons/fa";
import { PiSmileySadBold } from "react-icons/pi";
import { LuTurtle } from "react-icons/lu";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule
]);

const { Text, Link } = Typography;

const JobForecastGrid = ({ statuses = [] }) => {

  const { forecastData, forecastloading, error, fetchPipelineForecastData } = useUserDashboardJobsStore();

  const containerStyle = useMemo(() => ({ width: "100%", height: "450px" }), []);
  const gridStyle = useMemo(() => ({ height: "100vh", width: "100%" }), []);

  const [rowData, setRowData] = useState();

  const getTrends = (model) => {
    const avgDaysInCurrentStage = model.avgDaysPerStage;
    const estDaysToClose = model.estimatedDaysToClose;
    const daysRemainingToClose = model.daysRemainingToClose;
    const daysInCurrentStage = model.daysInCurrentStage;
    const actualDaysToPlace = model.actualDaysToClose;
    const weightedStageCode = model.weightedStageCode;

    switch (weightedStageCode) {
      case 'PLACED':
        if (actualDaysToPlace <= estDaysToClose) {
          return (<Tooltip title={`Exceeded expectations! Placement was made within ${actualDaysToPlace} days, meeting the expectation of ${estDaysToClose} days.`}><FaRegGrinStars color={"green"} size={20}/></Tooltip> )
        } else if (actualDaysToPlace <= (estDaysToClose + (estDaysToClose * 25 / 100))) {
          return (<Tooltip title={`Good job! Placement took ${actualDaysToPlace} days, slightly longer than the expected ${estDaysToClose} days.`}><FaRegGrinStars color={"green"} size={20}/></Tooltip> )
        } else {
          return (<Tooltip title={`Placement took ${actualDaysToPlace} days, exceeding the expected ${estDaysToClose} days.`}><PiSmileySadBold color={"red"} size={20}/></Tooltip> )
        }
      case 'OFFER':
      case 'INTERVIEW':
      case 'CV_SENT':
      case 'SHORT_LIST':
        if (daysInCurrentStage > avgDaysInCurrentStage) {
          return (<Tooltip title={`Start chasing! ${daysInCurrentStage} days in the current stage, slower than the average of ${avgDaysInCurrentStage} days.`}><LuTurtle color={"rgb(255, 95, 21)"} size={20}/></Tooltip> );
        } else {
          return (<Tooltip title={`${daysInCurrentStage} days in the current stage.`}><FaRegSmile color={"rgb(255, 95, 21)"} size={20}/></Tooltip> );
        }
      default:
        return (<Tooltip title={`${daysInCurrentStage} days in the current stage with no progress.`}><PiSmileySadBold color={"red"} size={20}/></Tooltip> );
    }
  };

  const status_list = [];

  statuses.forEach((status) => {
    status_list.push({
      headerName: status.name,
      field: `pipelines['${status.statusCode}']`,
      width:100,
      cellRenderer: (row) => {
        return row.data.pipelines[status.statusCode];
      }
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
      pinned:'left',
      cellRenderer: (row) => {

        const job = row.data;

        return (<Flex align="center" gap={10} style={{ marginBottom: "auto" }}>
          {getTrends(job)}
          <Flex vertical align="start" justify="center" style={{ flexGrow: 1 }} gap={0}>
            <Flex align="center" style={{ whiteSpace: "nowrap" }}>
              <Text
                ellipsis
                className="recruitly-candidate-name"
                style={{ maxWidth: 190, fontSize: "14.5px", fontWeight: "500", cursor: "pointer" }}
                onClick={(e) => {}}
              >
                {job.jobLabel}
              </Text>
            </Flex>
            {job.jobLocation && (
              <Text ellipsis color="secondary" style={{ marginBottom: 0, fontSize: 11, color: "#6b7483", width: 150 }}>
                {job.jobLocation}
              </Text>
            )}
          </Flex>
        </Flex>)

      }
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
      headerName: "Est.Closing Date",
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
    ...status_list
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