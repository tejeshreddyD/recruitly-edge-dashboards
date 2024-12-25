
import { extractTimeFromTimestamp, getTimestampByDay, getTodayTimestampByTimeZone } from "@utils/dateUtil.js";

export const aggregateData = (respData,plannerType) => {
  const uniqueDayMap = new Map();

  const today = getTodayTimestampByTimeZone();

  const overduetasks = respData.tasks ? respData.tasks.filter((task) => task.date < today) :[];
  const overdueReminders = respData.reminders ? respData.reminders.filter((reminder) => reminder.day < today) : [];

  let overduetasks_count = 0;
  let overduereminders_count = 0;

  if(overduetasks.length > 0){

    overduetasks_count += overduetasks.reduce((total, task) => {
      const taskCount = task.tasks.reduce((sum, item) => sum + (item.count || 0), 0);
      return total + taskCount;
    }, 0);

  }

  if(overdueReminders.length > 0){

    overduereminders_count +=  overdueReminders.reduce((total, reminder) => {
      const reminderCount = reminder.reminders.reduce((sum, item) => sum + (item.count || 0), 0);
      return total + reminderCount;
    }, 0);

  }

  const tasks = plannerType === 'ALL' || plannerType === 'REMINDER' ?  respData.tasks.filter((task) => task.date >= today) || [] : [];
  const reminders = plannerType === 'ALL' || plannerType === 'REMINDER' ? respData.reminders.filter((reminder) => reminder.day >= today) || [] : [];
  const starters = plannerType === 'ALL' || plannerType === 'PLACEMENT_STARTER' ? respData.placement_starters : [];
  const action_items  = plannerType === 'ALL' || plannerType === 'REMINDER' ? respData.action_items || [] : [];
  const invoices_due = plannerType === 'ALL' || plannerType === 'INVOICE_DUE' ? respData.invoice_due || [] : [];

  const events =
    plannerType === 'ALL'
      ? respData.events
      : plannerType === 'EVENTS'
        ? respData.events.filter((event) =>
          event.times.some((event_time) =>
            event_time.events.some((event_type) => event_type.type !== 'INTERVIEW')
          )
        )
        : plannerType === 'INTERVIEWS'
          ? respData.events.filter((event) =>
            event.times.some((event_time) =>
              event_time.events.some((event_type) => event_type.type === 'INTERVIEW')
            )
          )
          : [];


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
      addToMap(task.date, taskTime.dueDate, "TASK", taskTime);
    });
  });

  reminders.forEach((reminder) => {
    reminder.reminders.forEach((reminderTime) => {
      addToMap(reminder.day, reminderTime.time, "REMINDER", reminderTime);
    });
  });

  action_items.forEach((action) => {
    action.actions.forEach((actionTime) => {
      addToMap(action.day, actionTime.time, "CUSTOM_ACTION", actionTime);
    });
  });

  events.forEach((event) => {
    event.times.forEach((eventTime) => {

      eventTime.events.forEach((event_data) => {
        addToMap(event.eventDate, eventTime.time, event_data.type, event_data);
      })

    });
  });

  starters.forEach((starter) => {
    const time = getTimestampByDay(starter.day);
    addToMap(starter.day, time,"PLACEMENT_STARTER",{count:starter.count,time:time});
  });

  if(plannerType === 'ALL'){

    const today = getTodayTimestampByTimeZone();
    let time = getTimestampByDay(today);

    if(respData.job_applications && respData.job_applications > 0) {

      addToMap(today,time,"APPLICATION",{count:respData.job_applications,time:time});

    }

    time = getTimestampByDay(time,30);

    if(overduetasks_count >0){
      addToMap(today,time,"OVERDUE_TASK",{count:overduetasks_count,time:time});
    }

    time = getTimestampByDay(time,30);

    if(overduereminders_count >0){
      addToMap(today,time,"OVERDUE_REMINDER",{count:overduereminders_count,time:time});
    }

  }

  const data = Array.from(uniqueDayMap.values()).map((dayEntry) => {
    return {
      due_date: dayEntry.day,
      data: Array.from(dayEntry.times.entries())
        .map(([time, items]) => ({
          time,
          formatted_time:extractTimeFromTimestamp(time),
          items,
        }))
        .sort((a, b) => a.time - b.time),
    };
  });

  data.sort((a, b) => a.due_date - b.due_date);

  return {
    job_applications:respData.job_applications,
    data:data
  };
};

export const categorizeData = (apiResponse) => {

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

  apiResponse.data.forEach((dayData) => {
    const dayTimestamp = dayData.due_date;
    const dayItems = dayData.data;

    if (dayTimestamp < todayStart) {

      todayOverdueCount += dayItems.forEach((item) => item.items.filter((item) => item.type === "Task" || item.type === 'Reminder').reduce((sum, item) => sum + (item.count || 0), 0));
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

  return result;
};
