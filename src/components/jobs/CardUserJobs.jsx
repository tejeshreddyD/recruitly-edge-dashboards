import { useEffect, useState } from "react";
import { Alert, Card, Flex, Segmented } from "antd";
import { BsFunnel } from "react-icons/bs";
import { RiFocus2Line } from "react-icons/ri";

import useUserPlannerDashboardStore from "@api/userDashboardPlannerStore.js";
import DayTimeline from "@components/weekplanner/DayTimeline.jsx";
import PlannerDrillDownModal from "@components/weekplanner/drilldown/PlannerDrillDownModal.jsx";
import { aggregateData, categorizeData } from "@components/weekplanner/util/plannerUtil.js";
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
          marginBottom: "2rem",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          border: "none"
        }}
        styles={{ header: { borderBottom: "none", fontSize: 18 } }}
        title={
          <Flex direction="row" align="center" justify="start" gap="small">
            <FaSuitcase />
            <span>
              Jobs
            </span>
          </Flex>
        }>
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "16px",
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
                Fetching you jobs
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
