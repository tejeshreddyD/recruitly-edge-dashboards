export const formatNumber = (num) => {
  try {
    if (num == null || isNaN(num)) {
      // Return as is if num is null, undefined, or not a valid number
      return "";
    }

    const intNum = Number(num); // Ensure num is converted to a number
    if (intNum <= 0) {
      return intNum.toString(); // Return zero or negative values as strings
    }
    if (intNum < 1000) {
      return intNum.toString(); // Return values less than 1000 as-is
    }

    // Format numbers >= 1000 with compact notation
    return new Intl.NumberFormat(undefined, {
      notation: "compact",
      maximumFractionDigits: 1
    }).format(intNum);
  } catch (e) {
    console.error("Error formatting number:", num, e);
    return "";
  }
};