export const dashboardActionCode = {
  VIEW_CALENDAR_EVENT:"VIEW_CALENDAR_EVENT"
}

export const dashboardAction = (e, code, paramObj) => {

  if (e && e.preventDefault) {
    e.preventDefault();
  }

  return new Promise((resolve, reject) => {
    if (window.EDGE_UTIL && typeof window.EDGE_UTIL.dashboardAction === 'function') {
      window.EDGE_UTIL.dashboardAction({code, paramObj}).then(resolve).catch(reject);
    } else {
      reject(new Error("dashboardAction is not available on EDGE_UTIL"));
    }
  });
};

