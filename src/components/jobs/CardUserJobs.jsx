import { useEffect } from "react";
import { Alert, Card, Flex } from "antd";
import { Spinner } from "@phosphor-icons/react";
import useUserDashboardJobsStore from "@api/userDashboardJobsStore.js";
import { FaSuitcase } from "react-icons/fa";
import JobForecastGrid from "@components/jobs/JobsForecastGrid.jsx";

const CardUserJobs = () => {
  const { data, loading, error, fetchPipelineStatuses } = useUserDashboardJobsStore();

  useEffect(() => {
    fetchPipelineStatuses();
  }, []);

  return (
    <div>
      <Card
        style={{
          marginTop: "2rem",
          marginBottom: "15rem",
          background:"rgb(221 208 229)",
          border: "none"
        }}
        styles={{ header: { borderBottom: "none", fontSize: 18 } }}
        title={
          <Flex direction="row" align="center" justify="start" gap="small">
            <FaSuitcase />
            <span>
              Open Jobs
            </span>
          </Flex>
        }>
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "8px",
            whiteSpace: "nowrap"
          }}
        >{loading ? <Flex
            gap={8}
            style={{
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center"
            }}
          >
            <Spinner
              size={40}
              style={{
                color: "#1890ff",
                animation: "spin 1s linear infinite"
              }}
            />
            <div>
              <h4 style={{ fontWeight: "normal", fontSize: "1rem", margin: 0 }}>
                Fetching your jobs...
              </h4>
            </div>
          </Flex>
          : error ? <Alert message="Error loading data" type="error" /> : <JobForecastGrid statuses={data} />}
        </div>
      </Card>
    </div>
  );
};

export default CardUserJobs;
