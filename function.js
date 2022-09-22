const axios = require('axios')
const myDb = require('./db')
  
let API_KEY = "GET_YOUR_OWN_GOSH"; // DO NOT PUSH THIS
let BASE_URL = (startLocation, endLocation, API_KEY) => `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${startLocation}&destinations=${endLocation}&key=${API_KEY}`;

// make a call to the service
let getCurrTimeDataObj = async (startLocString, endLocString) => {
    let res = await axios.get(BASE_URL(startLocString,endLocString, API_KEY));
    let retObj;

    // Handle response
    if (res.status == 200) {
        retObj = extractDataFromObj(res.data);
        console.log(retObj)
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
            startAddr:  responseData.origin_addresses[0],
            endAddr: responseData.destination_addresses[0]
        }
            
    } catch (e) {
        console.error("Handle thie error: ", e);
    }

    return dataObj;
}




let testRun = async () => {
// Sample invocation
let obj = await getCurrTimeDataObj("Goleta", "Ventura");


await myDb.initDB();
await myDb.insertLocationDataRowIntoDB(obj);
await myDb.cleanUp();
} 


testRun();

// store the results in our "DB"

let storeCurrTimeDataObj = (dateTimeObj) => {

    tempDB.push();

}


let getAllTravelDataForTrip = (startLocString, endLocString) => {


    console.log("todo");

}