import React, { useState, useEffect } from "react";
import { AgCharts } from "ag-charts-react";
import useGoalsPeriodStore from "@api/userDashboardGoalsDataStore.js";

const LeaderBoard = ({ apiKey, apiServer, currentTile }) => {
  // Extracting activityId and activityType
  const { activityId, activityType } = currentTile;

  // Getting the selectedPeriod from the store
  const { selectedPeriod } = useGoalsPeriodStore();

  // State for chart data, loading, and error message
  const [options, setOptions] = useState({
    data: [],
    seriesArea: {
      padding: {
        left: 0,
        right: 0
      }
    },
    series: [
      {
        type: "funnel",
        stageKey: "name",
        valueKey: "actual",
        fills: ["#5090DC", "#FFA03A", "#459D55", "#34BFE1"]
      }
    ]
  });
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [errorMessage, setErrorMessage] = useState(""); // Tracks error message if any

  // Fetch leaderboard data from the API
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true); // Start loading
      setErrorMessage(""); // Reset error message
      try {
        const response = await fetch(
          `${apiServer}/api/kpi_leaderboard_data?periodCode=${selectedPeriod}&activityId=${activityId}&activityType=${activityType}&apiKey=${apiKey}`
        );
        const result = await response.json();

        if (result.success && result.data) {
          const leaderboardData = result.data.leaders.map((leader) => ({
            name: leader.name,
            actual: leader.actual || 0, // Fallback to 0 if actual is missing
            profilePic: leader.profilePic, // Included for potential use
            email: leader.email // Included for potential use
          }));

          // Sort data by actual score in descending order
          const sortedData = leaderboardData.sort((a, b) => b.actual - a.actual);

          // Update chart options with the sorted data
          setOptions((prevOptions) => ({
            ...prevOptions,
            data: sortedData
          }));
        } else {
          setErrorMessage("Failed to fetch leaderboard data.");
        }
      } catch (error) {
        setErrorMessage("Error fetching leaderboard data.");
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setLoading(false); // Loading complete
      }
    };

    fetchLeaderboardData();
  }, [apiServer, apiKey, selectedPeriod, activityId, activityType]);

  return (
    <div style={{ width: "100%" }}>
      {loading && <div>Loading...</div>}
      {!loading && options.data.length === 0 && <div>No data to display</div>}
      {!loading && options.data.length > 0 && <AgCharts options={options} />}
    </div>
  );
};

export default LeaderBoard;
