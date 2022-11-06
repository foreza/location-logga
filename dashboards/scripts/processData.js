
// Utility function to take a set of hours and trip times
// Returns the hour and the averaged trip time for that hour
let getAveragedSetFromData = (data) => {

  let tMap = {};

  for (let i = 0; i < data.length; ++i) {
    if (tMap[data[i].hour] == undefined) {
      tMap[data[i].hour] = [data[i].timetodestminutes]
    } else {
      tMap[data[i].hour].push(data[i].timetodestminutes);
    }
  }

  let retDataSet = [];

  let tKeys = Object.keys(tMap);

  for (let i = 0; i < tKeys.length; ++i) {

    let tAvg = tMap[tKeys[i]].reduce((a, b) => a + b) / tMap[tKeys[i]].length;
    retDataSet.push({
      "timetodestminutes": tAvg,
      "hour": tKeys[i]
    })
  }
  return retDataSet;
}


// Add insights here, and calculate them within
let getInsights = (rawData, averagedData) => {

  let insightsObj = {
    "trip-peak-time-val": {
      "value": undefined,
      "friendlyName": "Peak overall trip time",
      "suffix": "minutes"
    },           // Uses the rawData
    "trip-lowest-time-val": {
      "value": undefined,
      "friendlyName": "Lowest overall trip time",
      "suffix": "minutes"
    },           // Uses the rawData
    "trip-avg-time-val": {
      "value": undefined,
      "friendlyName": "Average overall trip time",
      "suffix": "minutes"
    },             // Uses the rawData
    "best-times-to-leave-am": {
      "value": undefined,
      "friendlyName": "Best times to leave in the morning",
      "suffix": "min"
    },        // Uses the averagedData
    "best-times-to-leave-pm": {
      "value": undefined,
      "friendlyName": "Best times to leave in the evening",
      "suffix": "min"
    },        // Uses the averagedData
    "worst-times-to-leave": {
      "value": undefined,
      "friendlyName": "Worst time to leave, all",
      "suffix": "min"
      
    }            // Uses the averagedData
  }

  // Use the rawData to get overall peak and average times
  let insightsData = rawData.map(({ hour, timetodestminutes }) =>
    ({ hour: adjustTimeForUTC(parseInt(hour)), timetodestminutes: timetodestminutes }))

  // Calculate peak and min times
  insightsData.sort((a, b) => b.timetodestminutes - a.timetodestminutes);
  insightsObj["trip-peak-time-val"].value = insightsData[0].timetodestminutes;
  insightsObj["trip-lowest-time-val"].value = insightsData[insightsData.length - 1].timetodestminutes;

  // Calculate average time
  let tSum = insightsData.reduce((a, b) => a + b.timetodestminutes, 0);
  insightsObj["trip-avg-time-val"].value = Math.round(tSum / Object.keys(insightsData).length);

  // Use the averagedData to get the best/worst times to leave
  let insightsAvgData = averagedData.map(({ hour, timetodestminutes }) =>
    ({ hour: adjustTimeForUTC(parseInt(hour)), timetodestminutes: timetodestminutes }))

  // Calculate worst times to leave
  insightsAvgData.sort((a, b) => b.timetodestminutes - a.timetodestminutes);
  insightsObj["worst-times-to-leave"].value = [insightsAvgData[0], insightsAvgData[1], insightsAvgData[2]]

  // Calculate best times to leave, AM
  let morningData = insightsAvgData.filter((a) => a.hour < 12 && a.hour >= 6)
  morningData.sort((a, b) => a.timetodestminutes - b.timetodestminutes);
  insightsObj["best-times-to-leave-am"].value = [morningData[0], morningData[1], morningData[2]];

    // Calculate best times to leave, PM
  let afternoonData = insightsAvgData.filter((a) => a.hour >= 12 && a.hour <= 18)
  afternoonData.sort((a, b) => a.timetodestminutes - b.timetodestminutes);
  insightsObj["best-times-to-leave-pm"].value = [afternoonData[0], afternoonData[1], afternoonData[2]];

  return insightsObj;
}


let renderInsightsToDOMRef = (domRef, insightObj) => {

  let tInsightRenderObject = document.createElement("div");
  let insightObjKeys = Object.keys(insightObj);

  for (let i = 0; i < insightObjKeys.length; ++i) {

    let tP = document.createElement("p");
    let tName = insightObj[insightObjKeys[i]].friendlyName;
    let tVal = insightObj[insightObjKeys[i]].value;
    let tSuffix = insightObj[insightObjKeys[i]].suffix;

    // Unnest first layer - if we are looking at an object, assume we have a custom handling scheme
    if (typeof(tVal) == 'object') {

      if (insightObjKeys[i] == "worst-times-to-leave" || 
          insightObjKeys[i] == "best-times-to-leave-pm" ||
          insightObjKeys[i] == "best-times-to-leave-am" ) {
      
        let tString = "";
        let tValKeys = Object.keys(tVal);
        for (let j = 0; j < tValKeys.length; ++j) {
          // requires utils.js
          tString += `${get12HrSuffixedString(tVal[tValKeys[j]].hour)}(${Math.round(tVal[tValKeys[j]].timetodestminutes)}${tSuffix}) `; 
        }
        tVal = tString;
      }
      // If we don't match any specific rules for object handling, use this rule
      else {
        tVal = tVal.join(", ");
      }
      
    
    } else { // String values
      tVal = tVal + " " + tSuffix;
    }

    tP.innerHTML = `<b>${tName}: </b><span> ${tVal}</span>`
    tInsightRenderObject.appendChild(tP);
  }
  
  
  domRef.appendChild(tInsightRenderObject);
}




let shiftDayOfWeekDataToPT = (data) => {

  for (let e = 0; e < data.length; ++e) {

    let adjustedHour = adjustTimeForUTC(data[e].hour);
    // if the adjusted hour is greater than current hour
    // this means we have to subtract one from the day of the week
    if (adjustedHour > data[e].hour) {
      let tDow = data[e].day_of_week - 1;
      if (tDow == -1) {
        tDow = 0
      }
      data[e].day_of_week = tDow;
    }
    data[e].hour = adjustedHour;
  }

  return data;
}


let transformAllObjectValuesToNumber = (data) => {

  for (let i = 0; i < data.length; ++i) {

    let tObjKeys = Object.keys(data[i]);
    for (let y = 0; y < tObjKeys.length; ++y) {
      data[i][tObjKeys[y]] = parseInt(data[i][tObjKeys[y]])
    }
  }

  return data;

}

let getDowInsights = (data) => {

  let insightsDowObj = {
    "trip-peak-time-val": {
      "value": undefined,
      "friendlyName": "Peak overall trip time",
      "suffix": "minutes"
    },           // Uses the rawData
    "trip-lowest-time-val": {
      "value": undefined,
      "friendlyName": "Lowest overall trip time",
      "suffix": "minutes"
    }
  }

  data.sort((a, b) => b.daily_hourly_avg - a.daily_hourly_avg);
  insightsDowObj["trip-peak-time-val"].value = data[0].daily_hourly_avg;
  insightsDowObj["trip-lowest-time-val"].value = data[data.length - 1].daily_hourly_avg;
  return insightsDowObj;
}