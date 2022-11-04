const mapAPI = require('./shared/mapApi');
const myDb = require('./shared/db')
const myBucket = require('./shared/bucket')

require('dotenv').config()

// Reporting endpoint - we can re-use the same function?
// TODO: remove code duplication & look into middleware
exports.main = async (req, res) => {

  console.log("Params:", req.query);

  // TODO: Make this a req middleware
  if (typeof (req.query.startLoc) == "undefined" ||
    typeof (req.query.endLoc) == "undefined") {
    res.status(400).json({ error: 'Missing startLoc and endLoc query params' });
    return;
  }

  // TODO: More sanitization/error checking
  // We need to provide the raw query params initially
  let startLocation = req.query.startLoc;
  let endLocation = req.query.endLoc;


  // use the query to figure out the actual location string to look up in the DB
  // Return should be something like "Oxnard, CA, 93036... which is what we need for a DB lookup"
  // TODO: we should be using a CID... or a map hash...
  let mapRetObj = await mapAPI.getCurrTimeDataObj(startLocation, endLocation);
  
  // Handle daily report data fetch
  // Get both daily/monthly reports
  // The map API gives us the key to look up in the DB

  /*
    0 = daily
    1 = monthly
    2 = 30 day lookback
  */

  let dailyDataObj = await fetchSegmentDataForType(mapRetObj, 0, mapRetObj.startAddr, mapRetObj.endAddr);
  let monthlyDataObj = await fetchSegmentDataForType(mapRetObj, 1, mapRetObj.startAddr, mapRetObj.endAddr);
  let lookBackDataObj = await fetchSegmentDataForType(mapRetObj, 2, mapRetObj.startAddr, mapRetObj.endAddr);


  // Upload our files with the corresponding data
  let dailyFileURI = await uploadSegmentDataForType(dailyDataObj, 0, mapRetObj.startAddr, mapRetObj.endAddr);
  let monthlyFileURI = await uploadSegmentDataForType(monthlyDataObj, 1, mapRetObj.startAddr, mapRetObj.endAddr);
  let lookBackFileURI = await uploadSegmentDataForType(lookBackDataObj, 2, mapRetObj.startAddr, mapRetObj.endAddr);


  // grab the URI
  let retObj = {
    "dailyFileURI": dailyFileURI,
    "monthlyFileURI": monthlyFileURI,
    "lookBackFileURI": lookBackFileURI
  }

  // Tell GCP everything will be ok in the end.
  res.status(200).json(retObj);
}

// Calls the bucket to upload a file with some provided data
let uploadSegmentDataForType = async (dbObj, type, startAddr, endAddr) => {

  let foldername = `${sanitizeLocationName(startAddr)}-${sanitizeLocationName(endAddr)}`
  let filename;
  let tDate = new Date();
 
  switch (type) {
    case 0: 
      filename = `daily-${tDate.getMonth()+1}_${tDate.getDate()}_${tDate.getFullYear()}.json`
      break;
    case 1:
      filename = `monthly-${tDate.getMonth()+1}_${tDate.getFullYear()}.json`
      break;
    case 2:
      filename = `30day-lookback.json`
      break;
    default:
      filename = "whatareyoudoing";
  }
  
  console.log(filename, JSON.stringify(dbObj));

  // Upload the file
  try {
    var uploadedFileURI = await myBucket.uploadFileToBucket(foldername, filename, JSON.stringify(dbObj));
  } catch (e) {
    console.error("Failed to upload file with error: ", e);
  }

  return uploadedFileURI;
}

// Accepts the map object, the type (0 = daily, 1 = monthly) and the start/end addr for the lookup and filename
// Returns the results from the DB as an array
let fetchSegmentDataForType = async (mapObj, type, startAddr, endAddr) => {

  let dbResultObj = {}

  // Get data from DB for daily data
  try {
    if (typeof (mapObj) != "undefined") {
      // 0: today; 1: month 2: lookback
      switch (type) {
        case 0: 
        dbResultObj = await myDb.getTodayDataForSegment(startAddr, endAddr);
        break;
      case 1:
        dbResultObj = await myDb.getMonthDataForSegment(startAddr, endAddr);
        break;
      case 2:
        dbResultObj = await myDb.get30DayLookBackForSegment(startAddr, endAddr);
        break;
      default:
        // :(
      }
    } else {
      console.log("object undefined; no dbResultObj")
  }} catch (e) {
    console.log("Error happened when fetching today data for dbResultObj")
  }

  return dbResultObj;
}





// make the location name itself safe
let sanitizeLocationName = (locationString) => {
  return locationString.split(/[-_,\s]+/).join("").toLowerCase();
}