// Creates the command for us if we want to track against new segments
// node cloud-scheduler-cmd

let CF_LOCATION = 'us-central1' // // For now, we only have stuff in us-central1

let CF_COLLECTOR_SCHEDULE = '10 6-20/1 * * *';
let CF_REPORTED_SCHEDULE = '12 20 * * *';

let COMMAND_BASE_STRING = (jobName, location, schedule, uri) => `gcloud scheduler jobs create http '${jobName}' \
    --location='${location}' \
    --schedule='${schedule}' \
    --uri='${uri}' \
    --http-method 'GET' \
    --time-zone 'America/Los_Angeles'`

let COLLECTOR_URI = (locA, locB) => 
  `https://us-central1-pioneering-mode-209418.cloudfunctions.net/location-logger-function-alpha?startLoc=${locA}&endLoc=${locB}`

let REPORTER_URI = (locA, locB ) => 
  `https://us-central1-pioneering-mode-209418.cloudfunctions.net/location-logger-reporter?startLoc=${locA}&endLoc=${locB}`


// Current convenience function to quickly create the 4 commands required to onboard a new segment and begin reporting data on it
let generateJobCommandsForSegment = (jobKey, startLoc, endLoc) => {

  var cmdArr = [];

  let collectAB = COMMAND_BASE_STRING(jobKey+`-collect${startLoc}-${endLoc}`, CF_LOCATION, CF_COLLECTOR_SCHEDULE, COLLECTOR_URI(startLoc, endLoc));
  let collectBA = COMMAND_BASE_STRING(jobKey+`-collect${endLoc}-${startLoc}`, CF_LOCATION, CF_COLLECTOR_SCHEDULE, COLLECTOR_URI(endLoc, startLoc));
  let reportAB = COMMAND_BASE_STRING(jobKey+`-report${startLoc}-${endLoc}`, CF_LOCATION, CF_REPORTED_SCHEDULE, REPORTER_URI(startLoc, endLoc));
  let reportBA = COMMAND_BASE_STRING(jobKey+`-report${endLoc}-${startLoc}`, CF_LOCATION, CF_REPORTED_SCHEDULE, REPORTER_URI(endLoc, startLoc));

  cmdArr.push(collectAB, collectBA, reportAB, reportBA);
  return cmdArr;
}

let printJobCmdForExcution = (cmdArr) => {
  let outputStr = cmdArr.join("\n\n");
  console.log("\n\n" + outputStr + "\n\n");
}


// Testing
// printJobCmdForExcution(
//   generateJobCommandsForSegment("la-coffee", "550forestparkblvd", "koreatownlosangeles"));
// printJobCmdForExcution(
//   generateJobCommandsForSegment("le-jpn-food", "550forestparkblvd", "sawtellelosangeles"))