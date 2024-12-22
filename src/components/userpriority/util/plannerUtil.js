
import { extractTimeFromTimestamp } from "@utils/dateUtil.js";

export const aggregateData = (respData,plannerType) => {
  const uniqueDayMap = new Map();

  const tasks = plannerType === 'ALL' || plannerType === 'REMINDER' ?  respData.tasks || [] : [];
  const reminders = plannerType === 'ALL' || plannerType === 'REMINDER' ? respData.reminders || [] : [];
  const events = plannerType === 'ALL' || plannerType === 'EVENTS' ? respData.events || [] : [];

  const addToMap = (date, time, type, data) => {
    if (!uniqueDayMap.has(date)) {
      uniqueDayMap.set(date, { day: date, times: new Map() });
    }

    const dayEntry = uniqueDayMap.get(date);
    if (!dayEntry.times.has(time)) {
      dayEntry.times.set(time, []);
    }

    dayEntry.times.get(time).push({ type, ...data });
  };

  tasks.forEach((task) => {
    task.tasks.forEach((taskTime) => {
      addToMap(task.date, taskTime.dueDate, "Task", taskTime);
    });
  });

  reminders.forEach((reminder) => {
    reminder.reminders.forEach((reminderTime) => {
      addToMap(reminder.day, reminderTime.time, "Reminder", reminderTime);
    });
  });

  events.forEach((event) => {
    event.times.forEach((eventTime) => {
      addToMap(event.eventDate, eventTime.time, "Event", eventTime);
    });
  });

  const data = Array.from(uniqueDayMap.values()).map((dayEntry) => {
    return {
      due_date: dayEntry.day,
      data: Array.from(dayEntry.times.entries())
        .map(([time, items]) => ({
          time:extractTimeFromTimestamp(time),
          items,
        }))
        .sort((a, b) => a.time - b.time),
    };
  });

  data.sort((a, b) => a.due_date - b.due_date);

  return data;
};


export const categorizeData = (apiResponse) => {

  if (!apiResponse || !apiResponse.length) {
    return [];
  }

  console.log("APIResponse", apiResponse);

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const tomorrowStart = todayStart + 24 * 60 * 60 * 1000;
  const endOfToday = tomorrowStart - 1;

  const result = [];
  const upcomingDays = {};

  let todayApplications = apiResponse.job_applications || 0;
  let todayOverdueCount = 0;
  let todayItems = [];
  let tomorrowItems = [];

  const addCategory = (date, applications = 0, overdueCount = 0, items = []) => {
    result.push({
      date,
      applications,
      overDueTasks: overdueCount,
      items: items.sort((a, b) => a.time - b.time), // Sort items by time
    });
  };

  apiResponse.forEach((dayData) => {
    const dayTimestamp = dayData.due_date;
    const dayItems = dayData.data;

    if (dayTimestamp < todayStart) {

      todayOverdueCount += dayItems.filter((item) => item.type === "Task" || item.type === 'Reminder').reduce((sum, item) => sum + (item.count || 0), 0);
    } else if (dayTimestamp <= endOfToday) {

      todayItems.push(...dayItems);
    } else if (dayTimestamp >= tomorrowStart && dayTimestamp < tomorrowStart + 24 * 60 * 60 * 1000) {

      tomorrowItems.push(...dayItems);
    } else {

      if (!upcomingDays[dayTimestamp]) {
        upcomingDays[dayTimestamp] = [];
      }
      upcomingDays[dayTimestamp].push(...dayItems);
    }
  });

  addCategory("Today", todayApplications, todayOverdueCount, todayItems);
  addCategory("Tomorrow", 0, 0, tomorrowItems);

  Object.keys(upcomingDays)
    .sort((a, b) => a - b)
    .forEach((dayTimestamp) => {
      addCategory(new Date(parseInt(dayTimestamp)).toDateString(), 0, 0, upcomingDays[dayTimestamp]);
    });

  console.log("TOTAL_LIST", result);

  return result;
};
