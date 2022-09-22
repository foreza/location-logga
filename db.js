const { Pool, Client } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'dev-location-logger',
    password: 'jasonchiu8191',
    port: 5432,
  })

let initDB = async () => {

    let createTable = await pool.query(`CREATE TABLE IF NOT EXISTS location_data (
        timeToDestMinutes integer NOT NULL,
         currDateTime timestamp default current_timestamp,
        startAddr VARCHAR NOT NULL,
        endAddr VARCHAR NOT NULL
     );`)

     console.log(createTable);

}

let testInsertIntoDB = async () => {

    let addRowTest = await pool.query(
        `INSERT INTO location_data(timeToDestMinutes, startAddr, endAddr)
     VALUES (${Math.floor(Math.random()*100)}, 'test', 'exit') RETURNING *;`)

    //  console.log(addRowTest);
     

}

let cleanUp = async () => {

    await pool.end()
}

let insertLocationDataRowIntoDB = async (dataObject) => {

    let newRow = await pool.query(
        `INSERT INTO location_data(timeToDestMinutes, startAddr, endAddr)
     VALUES (${dataObject.timeToDestMinutes}, '${dataObject.startAddr}', '${dataObject.endAddr}') RETURNING *;`)

     console.log("Inserted", newRow.rows)

}

let sampleReportFromDB = async () => {

    let result = await pool.query(`
    SELECT * FROM location_data WHERE  
    startAddr = '550 Forest Park Blvd, Oxnard, CA 93036, USA' AND
    endAddr = 'Goleta, CA, USA'
    `);

    console.log(result.rows);


}

let testRun = async () => {

// await initDB();
await testInsertIntoDB();
await sampleReportFromDB();
}

// testRun();


module.exports = {initDB, testInsertIntoDB, insertLocationDataRowIntoDB, sampleReportFromDB, cleanUp};