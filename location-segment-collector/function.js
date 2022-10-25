const myDb = require('./shared/db');
const mapAPI = require('./shared/mapApi');

require('dotenv').config();

// Takes a startLoc and endLoc, gets the current time, and then inserts this into DB
// Example invocation: http://localhost:8080/?startLoc=Ventura&endLoc=Koreatown
exports.main = async (req, res) => {

  console.log("Params:", req.query);

  // TODO: Make this a req middleware
  if (typeof (req.query.startLoc) == "undefined" ||
    typeof (req.query.endLoc) == "undefined") {
    res.status(400).json({ error: 'Missing startLoc and endLoc query params' });
    return;
  }

  // TODO: More sanitization/error checking
  let startLocation = req.query.startLoc;
  let endLocation = req.query.endLoc;

  let obj = await mapAPI.getCurrTimeDataObj(startLocation, endLocation);

  let retObj;

  if (typeof (obj) != "undefined") {
    await myDb.initDB();
    retObj = await myDb.insertLocationDataRowIntoDB(obj);
  } else {
    retObj = {}
  }

  res.json(retObj)
}