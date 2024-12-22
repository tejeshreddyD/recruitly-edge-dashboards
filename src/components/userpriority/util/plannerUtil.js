
import { extractTimeFromTimestamp } from "@utils/dateUtil.js";

export const categorizeData = (apiResponse, plannerType) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const tomorrowStart = todayStart + 24 * 60 * 60 * 1000;
  const endOfToday = tomorrowStart - 1;

  if(!apiResponse || !apiResponse.tasks || !apiResponse.tasks.length) {
    return [];
  }

  const result = [];

  let todayItems = [];
  let todayApplications = apiResponse.job_applications || 0;
  let todayOverdueCount = 0;

  let tomorrowItems = [];

  const upcomingDays = {};

  let data = {
    "REMINDER":apiResponse.tasks,
    "EVENTS":apiResponse.events.filter((event) => event.type && event.type !== 'INTERVIEW'),
    "INTERVIEWS":apiResponse.events.filter((event) => event.type && event.type === 'INTERVIEW'),
    "INVOICE_DUE":apiResponse.invoice_due,
  }

  const addCategory = (date, applications = 0, overdueCount = 0,items = []) => {
    result.push({
      date,
      applications,
      overDueTasks: overdueCount,
      items: items.sort((a, b) => {
        const timeA = new Date(`1970-01-01T${a.time}`).getTime();
        const timeB = new Date(`1970-01-01T${b.time}`).getTime();
        return timeA - timeB;
      }),
    });
  };

  if(plannerType === 'ALL' || plannerType === 'REMINDER'){
    data["REMINDER"]?.forEach((taskDay) => {
      taskDay.tasks.forEach((task) => {
        const taskDate = new Date(taskDay.date).getTime();
        if (task.dueDate < todayStart) {
          todayOverdueCount += task.count;
        } else if (taskDate <= endOfToday) {
          todayItems.push({
            time: extractTimeFromTimestamp(task.dueDate),
            type: "Task",
            count: task.count,
          });
        } else if (taskDate >= tomorrowStart && taskDate < tomorrowStart + 24 * 60 * 60 * 1000) {
          tomorrowItems.push({
            time: extractTimeFromTimestamp(task.dueDate),
            type: "Task",
            count: task.count,
          });
        } else {
          const upcomingDate = new Date(taskDate).toDateString();
          if (!upcomingDays[upcomingDate]) {
            upcomingDays[upcomingDate] = [];
          }
          upcomingDays[upcomingDate].push({
            time: extractTimeFromTimestamp(task.dueDate),
            type: "Task",
            count: task.count,
          });
        }
      });
    });
  }

  if(plannerType === 'ALL' || plannerType === 'EVENTS'){
    data["EVENTS"]?.forEach((eventDay) => {
      const eventDate = new Date(eventDay.eventDate).getTime();
      const events = eventDay.events.map((event) => ({
        time: extractTimeFromTimestamp(event.date),
        type: event.type,
        attendees: event.attendees,
      }));

      if (eventDate <= endOfToday) {
        todayItems.push(...events);
      } else if (eventDate >= tomorrowStart && eventDate < tomorrowStart + 24 * 60 * 60 * 1000) {
        tomorrowItems.push(...events);
      } else {
        const upcomingDate = new Date(eventDate).toDateString();
        if (!upcomingDays[upcomingDate]) {
          upcomingDays[upcomingDate] = [];
        }
        upcomingDays[upcomingDate].push(...events);
      }
    });
  }

  if(plannerType === 'ALL' || plannerType === 'INTERVIEWS'){
    data["INTERVIEWS"]?.forEach((eventDay) => {
      const eventDate = new Date(eventDay.eventDate).getTime();
      const events = eventDay.events.map((event) => ({
        time: extractTimeFromTimestamp(event.date),
        type: event.type,
        attendees: event.attendees,
      }));

      if (eventDate <= endOfToday) {
        todayItems.push(...events);
      } else if (eventDate >= tomorrowStart && eventDate < tomorrowStart + 24 * 60 * 60 * 1000) {
        tomorrowItems.push(...events);
      } else {
        const upcomingDate = new Date(eventDate).toDateString();
        if (!upcomingDays[upcomingDate]) {
          upcomingDays[upcomingDate] = [];
        }
        upcomingDays[upcomingDate].push(...events);
      }
    });
  }

  addCategory("Today", todayApplications, todayOverdueCount, todayItems);

  addCategory("Tomorrow", 0, 0, tomorrowItems);

  Object.keys(upcomingDays).forEach((date) => {
    addCategory(date, 0, 0, upcomingDays[date]);
  });

  return result;
};