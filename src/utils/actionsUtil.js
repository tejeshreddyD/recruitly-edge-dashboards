export const dashboardActionCode = {
  VIEW_CALENDAR_EVENT:"VIEW_CALENDAR_EVENT",
  VIEW_PIPELINE_SIDEBAR:"VIEW_PIPELINE_SIDEBAR",
  VIEW_TASK:'VIEW_TASK'
}

export const recordType = (ref) =>{

  if(!ref || ref === ''){
    return "";
  }

  const code = ref.trim().split('-')[0];

  switch(code){
    case "CA":
      return "CANDIDATE";
      case "CT":
        return "CONTACT";
    case "LD":
      return "LEAD";
    case "OP":
      return "OPPORTUNITY";
    case "JB":
      return "JOB";
    case "CY":
      return "COMPANY";
    case "PL":
      return "PLACEMENT";

  }

}

export const dashboardAction = (e, code, paramObj) => {

  if (e && e.preventDefault) {
    e.preventDefault();
  }

  return new Promise((resolve, reject) => {
    if (window.EDGE_UTIL && typeof window.EDGE_UTIL.dashboardAction === 'function') {
      window.EDGE_UTIL.dashboardAction({actionCode:code, paramsObj:paramObj}).then(resolve).catch(reject);
    } else {
      reject(new Error("dashboardAction is not available on EDGE_UTIL"));
    }
  });
};

