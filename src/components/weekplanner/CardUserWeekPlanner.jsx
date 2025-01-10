import React, { useEffect, useState } from "react";
import { Alert, Card, Drawer, Flex, Segmented } from "antd";
import { BsFunnel } from "react-icons/bs";
import { RiFocus2Line } from "react-icons/ri";

import useUserPlannerDashboardStore from "@api/userDashboardPlannerStore.js";
import DayTimeline from "@components/weekplanner/DayTimeline.jsx";
import { aggregateData, categorizeData } from "@components/weekplanner/util/plannerUtil.js";
import { Spinner } from "@phosphor-icons/react";
import ReminderViewer from "@components/weekplanner/ReminderViewer.jsx";
import userDashboardPlannerDataStore from "@api/userDashboardPlannerDataStore.js";

const CardUserWeekPlanner = () => {
  const { data, loading, error, fetchUserPlannerData } = useUserPlannerDashboardStore();

  const {reminderData, reminderLoading, reminderError, fetchUserReminderData} = userDashboardPlannerDataStore();

  const [selectedPlannerType, setSelectedPlannerType] = useState("ALL");
  const [filteredPlanner, setFilteredPlanner] = useState([]);

  const [isReminderViewerOpen, setReminderViewerOpen] = useState(false);
  const [isReminderLoading, setIsReminderLoading] = useState(false);

  useEffect(() => {
    fetchUserPlannerData();
  }, []);


  useEffect(() => {
    if (data && data.tasks) {

      const aggregated_data = aggregateData(data, selectedPlannerType);

      const categorizedData = categorizeData(aggregated_data);

      setFilteredPlanner(categorizedData);
    }
  }, [data, selectedPlannerType]);

  const handleReminderViewer = (id) => {

    console.log(id);

    fetchUserReminderData({id:id})

    setReminderViewerOpen(true);
  }

  useEffect(() => {



  },[reminderData])

  return (
    <div>
      <Card
        extra={
          <Flex direction="row" align="center" justify="start" gap="small">
            <BsFunnel />
            <Segmented
              options={[
                { label: "All", value: "ALL" },
                { label: "Interviews", value: "INTERVIEWS" },
                { label: "Tasks/Reminders", value: "REMINDER" },
                { label: "Events", value: "EVENTS" },
                { label: "Invoice Due", value: "INVOICE_DUE" }
              ]}
              value={selectedPlannerType}
              onChange={(value) => setSelectedPlannerType(value)}
            />
          </Flex>
        }
        style={{
          marginTop: "2rem",
          marginBottom: "2rem",
          backgroundImage: "url('https://recruitlycdn.com/edge/plannerbg.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          border: "none"
        }}
        styles={{ header: { borderBottom: "none", fontSize: 18 } }}
        title={
          <Flex direction="row" align="center" justify="start" gap="small">
            <RiFocus2Line />
            <span>
              Week Planner
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
                Organizing your planner
              </h4>
            </div>
          </Flex>
          : error ? <Alert message="Error loading data" type="error" /> : filteredPlanner.map((data) => (
            <DayTimeline title={data.date} date={data.dayTimestamp} key={data.date} color="" items={data.items} reminderViewer={handleReminderViewer} />
          ))}
        </div>
      </Card>
      <Drawer title="Reminder Viewer" width={'40%'} loading={reminderLoading} placement="right" closable={true} onClose={() => setReminderViewerOpen(false)} open={isReminderViewerOpen} key="right">{isReminderViewerOpen && <ReminderViewer data={reminderData}/>}</Drawer>
    </div>
  );
};

export default CardUserWeekPlanner;
