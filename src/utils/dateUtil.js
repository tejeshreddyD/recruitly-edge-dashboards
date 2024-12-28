import moment from "moment-timezone";
import { format, isThisYear } from "date-fns";

export const getLocalizedDateString = (timestamp, format = "YYYY-MM-DD HH:mm:ss z") => {
  return moment(timestamp).local().format(format);
};

export const getLocalizedDateObject = (timestamp) => {
  return moment(timestamp).local().toDate();
};

export const getDateStringInTimeZone = (timestamp, timeZone, format = "YYYY-MM-DD HH:mm:ss z") => {
  return moment(timestamp).tz(timeZone).format(format);
};

export const getDateObjectInTimeZone = (timestamp, timeZone) => {
  return moment.tz(timestamp, timeZone).toDate();
};

export const getTimestampByDay = (inputTimestamp, increaseminute) => {
  const tz = getUserTimeZone();

  if (!inputTimestamp) {
    increaseminute = 0;
  }

  return moment(inputTimestamp)
    .tz(tz)
    .startOf("day")
    .add(9, "hours").add(increaseminute, "minutes")
    .valueOf();
};

export const getEndOfDayTimestamp = (timestamp) => {
  return moment(timestamp).endOf("day").valueOf();
};

export const getTodayTimestampByTimeZone = () => {

  const tz = getUserTimeZone();

  return moment.tz(tz)
    .startOf("day")
    .add(0, "hours")
    .valueOf();
};

export const getDateMoment = (timestamp) => {
  let timeZone = "Europe/London";

  if (window.COOL_GLOBALS && !!window.COOL_GLOBALS?.USER && window.COOL_GLOBALS?.USER?.timeZone) {
    timeZone = window.COOL_GLOBALS?.USER?.timeZone;
  }

  const now = moment().tz(timeZone);
  const date = moment(timestamp).tz(timeZone);

  if (now.isSame(date, "day")) {
    // If the timestamp is from today
    return date.fromNow(); // e.g., "a few hours ago", "5 minutes ago"
  } else if (now.diff(date, "days") === 1) {
    // If the timestamp is from yesterday
    return `Yesterday at ${date.format("HH:mm")}`; // e.g., "Yesterday at 15:45"
  } else if (now.isSame(date, "week")) {
    // If the timestamp is within the current week
    return `${date.format("ddd, HH:mm")}`; // e.g., "Monday, 15:45"
  } else if (now.isSame(date, "year")) {
    // If the timestamp is within the current year
    return `${date.format("DD MMM [at] HH:mm")}`; // e.g., "21 Jun at 15:45"
  } else {
    // If the timestamp is from a different year
    return `${date.format("DD MMM YYYY [at] HH:mm")}`; // e.g., "21 Jun 2023 at 15:45"
  }
};

export const dateUtcTimeStamp = (dateObj) => {
  return moment(dateObj).utc().valueOf();
};

export const calculateDaysBetween = (date1, date2) => {
  // Calculate the difference in days
  return moment(date1).diff(moment(date2), "days");
};

export const extractTimeFromTimestamp = (timestamp) => {

  if (!timestamp) {
    return timestamp;
  }

  try {

    const tz = getUserTimeZone();

    return moment.tz(timestamp, tz).format("hh:mm A");
  } catch (error) {
    console.error("Error extracting time from timestamp:", error.message);
    return null;
  }

};

function getUserTimeZone() {

  if (window.COOL_GLOBALS && !!window.COOL_GLOBALS?.USER && window.COOL_GLOBALS?.USER?.timeZone) {
    return window.COOL_GLOBALS?.USER?.timeZone;
  }

  return "Europe/London";

}

export const getDateStringByUserTimeZone = (timestamp, format) => {
  let defaultFormat = "DD/MM/YYYY";

  if (format) {
    defaultFormat = format;
  }

  let timeZone = getUserTimeZone();

  if (!format && window.COOL_GLOBALS && window.COOL_GLOBALS?.TENANT && window.COOL_GLOBALS?.TENANT?.preferredDateFormat) {
    const preferred_format = window.COOL_GLOBALS.TENANT.preferredDateFormat;

    if (preferred_format === "default") {
      return moment(timestamp).tz(timeZone).fromNow();
    }

    if (preferred_format === "dateTime") {
      defaultFormat = "DD/MM/YYYY HH:mm";
    } else if (preferred_format === "dateTimeHr") {
      defaultFormat = "DD/MM/YYYY hh:mm a";
    } else if (preferred_format === "usdate") {
      defaultFormat = "MM/DD/YYYY";
    } else if (preferred_format === "usdateTime") {
      defaultFormat = "MM/DD/YYYY HH:mm";
    } else if (preferred_format === "usdateTimeHr") {
      defaultFormat = "MM/DD/YYYY hh:mm a";
    }
  }

  return moment(timestamp).tz(timeZone).format(defaultFormat);
};

export function formatGlobalDate(dateString) {
  const date = new Date(dateString);
  const formatString = isThisYear(date) ? "do MMM" : "do MMM yyyy";
  return format(date, formatString);
}

export const dateRanges = {
  TODAY: {
    start: moment().utc().startOf("day").valueOf(),
    end: moment().utc().endOf("day").valueOf()
  },
  YESTERDAY: {
    start: moment().utc().subtract(1, "day").startOf("day").valueOf(),
    end: moment().utc().subtract(1, "day").endOf("day").valueOf()
  },
  THIS_WEEK: {
    start: moment().utc().startOf("week").valueOf(),
    end: moment().utc().endOf("week").valueOf()
  },
  THIS_WEEK_SO_FAR: {
    start: moment().utc().startOf("week").valueOf(),
    end: moment().utc().valueOf()
  },
  LAST_WEEK: {
    start: moment().utc().subtract(1, "week").startOf("week").valueOf(),
    end: moment().utc().subtract(1, "week").endOf("week").valueOf()
  },
  THIS_MONTH: {
    start: moment().utc().startOf("month").valueOf(),
    end: moment().utc().endOf("month").valueOf()
  },
  LAST_MONTH: {
    start: moment().utc().subtract(1, "month").startOf("month").valueOf(),
    end: moment().utc().subtract(1, "month").endOf("month").valueOf()
  },
  THIS_QUARTER: {
    start: moment().utc().startOf("quarter").valueOf(),
    end: moment().utc().endOf("quarter").valueOf()
  },
  LAST_QUARTER: {
    start: moment().utc().subtract(1, "quarter").startOf("quarter").valueOf(),
    end: moment().utc().subtract(1, "quarter").endOf("quarter").valueOf()
  },
  THIS_YEAR: {
    start: moment().utc().startOf("year").valueOf(),
    end: moment().utc().endOf("year").valueOf()
  },
  THIS_YEAR_SO_FAR: {
    start: moment().utc().startOf("year").valueOf(),
    end: moment().utc().valueOf()
  },
  LAST_YEAR: {
    start: moment().utc().subtract(1, "year").startOf("year").valueOf(),
    end: moment().utc().subtract(1, "year").endOf("year").valueOf()
  },
  LAST_7_DAYS: {
    start: moment().utc().subtract(7, "days").startOf("day").valueOf(),
    end: moment().utc().endOf("day").valueOf()
  },
  LAST_14_DAYS: {
    start: moment().utc().subtract(14, "days").startOf("day").valueOf(),
    end: moment().utc().endOf("day").valueOf()
  },
  LAST_30_DAYS: {
    start: moment().utc().subtract(30, "days").startOf("day").valueOf(),
    end: moment().utc().endOf("day").valueOf()
  },
  LAST_60_DAYS: {
    start: moment().utc().subtract(60, "days").startOf("day").valueOf(),
    end: moment().utc().endOf("day").valueOf()
  },
  LAST_90_DAYS: {
    start: moment().utc().subtract(90, "days").startOf("day").valueOf(),
    end: moment().utc().endOf("day").valueOf()
  },
  LAST_180_DAYS: {
    start: moment().utc().subtract(180, "days").startOf("day").valueOf(),
    end: moment().utc().endOf("day").valueOf()
  },
  LAST_365_DAYS: {
    start: moment().utc().subtract(365, "days").startOf("day").valueOf(),
    end: moment().utc().endOf("day").valueOf()
  },
  LAST_1_YEAR: {
    start: moment().utc().subtract(1, "year").startOf("day").valueOf(),
    end: moment().utc().endOf("day").valueOf()
  },
  LAST_2_YEAR: {
    start: moment().utc().subtract(2, "years").startOf("day").valueOf(),
    end: moment().utc().endOf("day").valueOf()
  },
  LAST_3_YEAR: {
    start: moment().utc().subtract(3, "years").startOf("day").valueOf(),
    end: moment().utc().endOf("day").valueOf()
  }
};
