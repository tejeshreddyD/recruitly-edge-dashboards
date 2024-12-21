
export const categorizeData = (apiResponse) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const tomorrowStart = todayStart + 24 * 60 * 60 * 1000;
  const endOfToday = tomorrowStart - 1;

  const categorized = {
    today: {
      date: "Today",
      applications:apiResponse.job_applications,
      items: [],
      overdueCount: 0,
    },
    tomorrow: {
      date: "Tomorrow",
      items: [],
    },
    upcoming: [],
  };

  const addItemsToCategory = (category, items) => {
    items.forEach((item) => {
      category.items.push({
        time: new Date(item.date || item.dueDate).toLocaleTimeString(),
        type: item.type || "Task",
        count: item.count || 1,
        attendees: item.attendees || [],
      });
    });
  };

  // Process tasks
  apiResponse.tasks.forEach((taskDay) => {
    taskDay.tasks.forEach((task) => {
      if (task.dueDate < todayStart) {
        // Overdue - add to today's overdue count
        categorized.today.overdueCount += task.count;
      } else if (taskDay.date <= endOfToday) {
        // Today
        categorized.today.items.push({
          time: new Date(task.dueDate).toLocaleTimeString(),
          type: "Task",
          count: task.count,
        });
      } else if (taskDay.date >= tomorrowStart && taskDay.date < tomorrowStart + 24 * 60 * 60 * 1000) {
        // Tomorrow
        categorized.tomorrow.items.push({
          time: new Date(task.dueDate).toLocaleTimeString(),
          type: "Task",
          count: task.count,
        });
      } else {
        // Upcoming
        const dateString = new Date(taskDay.date).toDateString();
        let upcomingDay = categorized.upcoming.find((day) => day.date === dateString);
        if (!upcomingDay) {
          upcomingDay = { date: dateString, items: [] };
          categorized.upcoming.push(upcomingDay);
        }
        upcomingDay.items.push({
          time: new Date(task.dueDate).toLocaleTimeString(),
          type: "Task",
          count: task.count,
        });
      }
    });
  });

  // Process events
  apiResponse.events.forEach((eventDay) => {
    const eventDate = new Date(eventDay.eventDate).getTime();
    const events = eventDay.events.map((event) => ({
      date: new Date(event.date).getTime(),
      type: event.type,
      attendees: event.attendees,
    }));

    if (eventDate <= endOfToday) {
      addItemsToCategory(categorized.today, events);
    } else if (eventDate >= tomorrowStart && eventDate < tomorrowStart + 24 * 60 * 60 * 1000) {
      addItemsToCategory(categorized.tomorrow, events);
    } else {
      const dateString = new Date(eventDate).toDateString();
      let upcomingDay = categorized.upcoming.find((day) => day.date === dateString);
      if (!upcomingDay) {
        upcomingDay = { date: dateString, items: [] };
        categorized.upcoming.push(upcomingDay);
      }
      addItemsToCategory(upcomingDay, events);
    }
  });

  return categorized;
}

