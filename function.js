const axios = require('axios')
const myDb = require('./db')

require('dotenv').config()

let API_KEY = process.env.MAPS_API_KEY;
let BASE_URL = (startLocation, endLocation, API_KEY) => `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${startLocation}&destinations=${endLocation}&key=${API_KEY}`;

// make a call to the service
let getCurrTimeDataObj = async (startLocString, endLocString) => {
  let res = await axios.get(BASE_URL(startLocString, endLocString, API_KEY));
  let retObj;

  // Handle response
  if (res.status == 200) {
    retObj = extractDataFromObj(res.data);
  }

  return retObj;
}


let extractDataFromObj = (responseData) => {

  let dataObj = {}

  try {
    // TODO: use some schema
    dataObj = {
      timeToDestMinutes: Math.floor(responseData.rows[0].elements[0].duration.value / (60)), // TODO: what if there are multiple?
      currDateTime: new Date(),
      startAddr: responseData.origin_addresses[0],
      endAddr: responseData.destination_addresses[0]
    }

  } catch (e) {
    console.error("Handle thie error: ", e);
  }

  return dataObj;
}

// Takes a startLoc and endLoc
exports.main = async (req, res) => {

  // Parse out the req params

  console.log("Params:", req.query);

  // We want a startLoc and endLoc

  // TODO: Make this a req middleware
  if (typeof(req.query.startLoc) == "undefined" || 
    typeof(req.query.endLoc) == "undefined") {
      res.status(400).json({error: 'Missing startLoc and endLoc query params'});
      return;
    }

  // TODO: More sanitization/error checking
  let startLocation = req.query.startLoc;
  let endLocation = req.query.endLoc;
  
  let obj = await getCurrTimeDataObj(startLocation, endLocation);

  await myDb.initDB();
  await myDb.insertLocationDataRowIntoDB(obj);
  let retObj = await myDb.sampleReportFromDB();
  // await myDb.cleanUp();
  res.json(retObj)
}


