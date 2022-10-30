// Utility function to fetch
let async_getDataFromBucket = async (dataURI) => {
  const response = await fetch(dataURI);
  const data = await response.json();
  // console.log("monthlyData", data);
  return data;
}

// Utility function to help
function adjustTimeForUTC(originalUTCHr) {
  var utcDiff = -7;
  var tVal = originalUTCHr + utcDiff;
  return tVal < 0 ? tVal + 24 : tVal;
}
