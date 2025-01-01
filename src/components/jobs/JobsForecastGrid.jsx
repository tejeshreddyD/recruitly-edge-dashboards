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

  console.log(status_list);

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
          <SmileOutlined color={"blue"} size={50}/>
          <Flex vertical align="start" justify="center" style={{ flexGrow: 1 }} gap={0}>
            <Flex align="center" style={{ whiteSpace: "nowrap" }}>

              <Text
                ellipsis
                className="recruitly-candidate-name"
                style={{ maxWidth: 200, fontSize: "14.5px", fontWeight: "500", cursor: "pointer" }}
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