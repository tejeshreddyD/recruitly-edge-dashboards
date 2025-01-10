import { create } from "zustand";

import {
  fetchUserPlannerCalendarEvents,
  fetchUserPlannerPendingJobApplications,
  fetchUserReminderById
} from "../api/dashboardDataApi.js";

const useUserPlannerDataStore = create((set, getState) => ({
  data: [],
  loading: false,
  error: null,
  reminderData: [],
  reminderLoading: false,
  reminderError: null,
  fetchUserReminderData: async ({id}) => {

    if (!getState().reminderLoading) {

      set({ reminderLoading: true, reminderError: null });
      try {
        const data = await fetchUserReminderById({id});
        set({ reminderData:data.data, reminderLoading: false });
      } catch (error) {
        set({ reminderError: error.message, reminderLoading: false });
      }
    }
  },
  fetchUserPlannerJobApplicationData: async ({page, page_size}) => {

    if (!getState().loading) {

      set({ loading: true, error: null });
      try {
        const data = await fetchUserPlannerPendingJobApplications({page, page_size});
        set({ data:data.data, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    }
  },

  fetchUserPlannerCalendarEventData: async ({start_date,end_date,type = "EVENT"}) => {

    if (!getState().loading) {

      set({ loading: true, error: null });
      try {
        const data = await fetchUserPlannerCalendarEvents({start_date, end_date,type});
        set({ data:data.data, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    }
  }
}));

export default useUserPlannerDataStore;
