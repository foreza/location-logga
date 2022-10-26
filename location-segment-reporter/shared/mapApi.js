// EDIT ONLY THE ONE in SHARED
// During the build process; this file is copied over
const axios = require('axios')

require('dotenv').config()

let API_KEY = process.env.MAPS_API_KEY;
let BASE_URL = (startLocation, endLocation, API_KEY) => 
`https://maps.googleapis.com/maps/api/distancematrix/json?departure_time=now&origins=${startLocation}&destinations=${endLocation}&key=${API_KEY}`;


// Expose a call to the service
exports.getCurrTimeDataObj = async (startLocString, endLocString) => {
  const reqURL = BASE_URL(startLocString, endLocString, API_KEY)
  console.log("Request URL:", reqURL)
  let res = await axios.get(reqURL);
  let retObj;

  // Handle response
  if (res.status == 200) {
    retObj = extractDataFromObj(res.data);
  }

  return retObj;
}

// Utility function
let extractDataFromObj = (responseData) => {

  let dataObj;

  console.log(`Getting distance from to [${responseData.origin_addresses[0]}] to [${responseData.destination_addresses[0]}]`);

  // If there is no valid route, status code is ZERO_RESULTS
  if (responseData.rows[0].elements[0].status === "ZERO_RESULTS") {
    console.error("No valid path found")
    return dataObj;
  }


  try {
    // TODO: use some schema
    dataObj = {
      timeToDestMinutes: Math.floor(responseData.rows[0].elements[0].duration_in_traffic.value / (60)), // TODO: what if there are multiple?
      currDateTime: new Date(),
      startAddr: responseData.origin_addresses[0],
      endAddr: responseData.destination_addresses[0]
    }

  } catch (e) {
    console.error("Handle this error: ", e);
  }


  return dataObj;
}

