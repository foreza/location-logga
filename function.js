const axios = require('axios')
const myDb = require('./db')

require('dotenv').config()

let API_KEY = process.env.MAPS_API_KEY;
let BASE_URL = (startLocation, endLocation, API_KEY) => 
`https://maps.googleapis.com/maps/api/distancematrix/json?departure_time=now&origins=${startLocation}&destinations=${endLocation}&key=${API_KEY}`;

// make a call to the service
let getCurrTimeDataObj = async (startLocString, endLocString) => {
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

// Takes a startLoc and endLoc
// Example invocation: http://localhost:8080/?startLoc=Ventura&endLoc=Koreatown
exports.main = async (req, res) => {

  // Parse out the req params

  console.log("Params:", req.query);

  // We want a startLoc and endLoc

  // TODO: Make this a req middleware
  if (typeof (req.query.startLoc) == "undefined" ||
    typeof (req.query.endLoc) == "undefined") {
    res.status(400).json({ error: 'Missing startLoc and endLoc query params' });
    return;
  }

  // TODO: More sanitization/error checking
  let startLocation = req.query.startLoc;
  let endLocation = req.query.endLoc;

  let obj = await getCurrTimeDataObj(startLocation, endLocation);

  let retObj;

  if (typeof (obj) != "undefined") {
    await myDb.initDB();
    retObj = await myDb.insertLocationDataRowIntoDB(obj);
    // retObj = await myDb.sampleReportFromDB();
  } else {
    retObj = {}
  }

  res.json(retObj)
}


