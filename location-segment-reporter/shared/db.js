// EDIT ONLY THE ONE in SHARED
// During the build process; this file is copied over

const { Pool} = require('pg')
require('dotenv').config()

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
  })


// For a brand new deployment, create the table
let initDB = async () => {

    let createTable = await pool.query(`CREATE TABLE IF NOT EXISTS location_data (
        timeToDestMinutes integer NOT NULL,
        currDateTime timestamp default current_timestamp,
        startAddr VARCHAR NOT NULL,
        endAddr VARCHAR NOT NULL
     );`)

     console.log(createTable);

}


// TODO: When is the right place to terminate the connection pool?
let cleanUp = async () => {
    await pool.end()
}

// Log an entry for that specific trip
let insertLocationDataRowIntoDB = async (dataObject) => {

    let newRow = await pool.query(
        `INSERT INTO location_data(timeToDestMinutes, startAddr, endAddr)
     VALUES (${dataObject.timeToDestMinutes}, '${dataObject.startAddr}', '${dataObject.endAddr}') RETURNING *;`)
    return newRow.rows;

}

// Get the segment data for just that day (for more granular reporting)
let getTodayDataForSegment = async (startLoc, endLoc) => {

    let rawQuery = `
    SELECT 
    timetodestminutes, 
    extract(hour from currdatetime) as hour 
    FROM location_data 
    WHERE 
    endaddr='${endLoc}' AND 
    startaddr='${startLoc}' AND
    extract(day from currdatetime)=extract (day from CURRENT_DATE)
    `
    // console.log(rawQuery);
    let result = await pool.query(rawQuery);
    return result.rows;

}


// For now, query for all the data we have thus far and overwrite
let getMonthDataForSegment = async (startLoc, endLoc) => {
  let rawQuery = `
  SELECT 
  timetodestminutes, 
  extract(hour from currdatetime) as hour,
  extract(day from currdatetime) as day 
  FROM location_data 
  WHERE 
  endaddr='${endLoc}' AND 
  startaddr='${startLoc}' AND
  extract(month from currdatetime)=extract (month from CURRENT_DATE)
  `
  // console.log(rawQuery);
  let result = await pool.query(rawQuery);
  return result.rows;
}


let get30DayLookBackForSegment = async (startLoc, endLoc) => {
  let rawQuery = `
  SELECT 
  timetodestminutes, 
  extract(hour from currdatetime) as hour,
  extract(day from currdatetime) as day
  FROM location_data 
  WHERE 
  endaddr='${endLoc}' AND 
  startaddr='${startLoc}' AND
  currdatetime > (CURRENT_DATE - INTERVAL '30 days');
  `
  // console.log(rawQuery);
  let result = await pool.query(rawQuery);
  return result.rows;
}


let getRolling90DailyHourlyForSegment = async (startLoc, endLoc) => {
  let rawQuery = `
  SELECT 
  (SUM(timetodestminutes)/COUNT(timetodestminutes)) as daily_hourly_avg,
  extract(hour from currdatetime) as hour,
  extract(DOW from currdatetime) as day_of_week
  FROM location_data 
  WHERE 
  endaddr='${endLoc}' AND 
  startaddr='${startLoc}' AND
  currdatetime > (CURRENT_DATE - INTERVAL '90 days')
  GROUP BY day_of_week, hour
  `
  console.log(rawQuery);
  let result = await pool.query(rawQuery);
  return result.rows;
}



module.exports = {initDB, insertLocationDataRowIntoDB, getTodayDataForSegment, getMonthDataForSegment, get30DayLookBackForSegment, getRolling90DailyHourlyForSegment, cleanUp};