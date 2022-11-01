  // Utility function to take a set of hours and trip times
  // Returns the hour and the averaged trip time for that hour

  let processData = {};

  let getAveragedSetFromData = (data) => {

    var tMap = {};
  
    for (var i = 0; i < data.length; ++i) {
      if (tMap[data[i].hour] == undefined) {
        tMap[data[i].hour] = [data[i].timetodestminutes]
      } else {
        tMap[data[i].hour].push(data[i].timetodestminutes);
      }
    }
  
    var retDataSet = [];
  
    var tKeys = Object.keys(tMap);
    console.log(tKeys);
  
    for (var i = 0; i < tKeys.length; ++i) {
  
      var tAvg = tMap[tKeys[i]].reduce((a,b) => a+b) / tMap[tKeys[i]].length;
      retDataSet.push({
        "timetodestminutes": tAvg,
        "hour":tKeys[i]
      })
    }  
    return retDataSet;
  }


  // For rendering
  const insightsFriendlyMap = {
    "trip-peak-time-val": "Peak overall trip time:",
    "trip-avg-time-val": "Average overall trip time" ,
    "best-times-to-leave-am": "Best times to leave in the morning",
    "best-times-to-leave-pm": "Best times to leave in the evening",
    "worst-times-to-leave": "Worst time to leave, all"
  }

  let getInsights = (rawData, averagedData) => {

    let insightsObj = {
      "trip-peak-time-val" : undefined,           // Uses the rawData
      "trip-avg-time-val": undefined,             // Uses the rawData
      "best-times-to-leave-am": undefined,        // Uses the averagedData
      "best-times-to-leave-pm": undefined,        // Uses the averagedData
      "worst-times-to-leave":undefined            // Uses the averagedData
    }
    
    // Use the rawData to get overall peak and average times
    let insightsData = rawData.map(({ hour, timetodestminutes }) =>
      ({ hour: adjustTimeForUTC(parseInt(hour)), timetodestminutes: timetodestminutes }))
  
    // Calculate peak time
    insightsData.sort((a, b) => b.timetodestminutes - a.timetodestminutes);
    insightsObj["trip-peak-time-val"] = insightsData[0].timetodestminutes;

    // Calculate average time
    let tSum = insightsData.reduce((a,b) => a + b.timetodestminutes, 0);
    insightsObj["trip-avg-time-val"] = Math.round(tSum / Object.keys(insightsData).length);

    // Use the averagedData to get the best/worst times to leave
    let insightsAvgData = averagedData.map(({ hour, timetodestminutes }) =>
    ({ hour: adjustTimeForUTC(parseInt(hour)), timetodestminutes: timetodestminutes }))

    // Calculate worst times to leave
    insightsAvgData.sort((a, b) => b.timetodestminutes - a.timetodestminutes);
    insightsObj["worst-times-to-leave"] =  [insightsAvgData[0].hour, insightsAvgData[1].hour, insightsAvgData[2].hour]
    
    // Calculate best times to leave, AM
    let morningData = insightsAvgData.filter((a) => a.hour < 12 && a.hour >= 6)
    morningData.sort((a, b) => a.timetodestminutes - b.timetodestminutes);
    insightsObj["best-times-to-leave-am"] = [morningData[0].hour, morningData[1].hour, morningData[2].hour];
  
    let afternoonData = insightsAvgData.filter((a) => a.hour >= 12 && a.hour <= 18)
    afternoonData.sort((a, b) => a.timetodestminutes - b.timetodestminutes);  
    insightsObj["best-times-to-leave-pm"] = [afternoonData[0].hour, afternoonData[1].hour, afternoonData[2].hour];

    console.log(insightsObj);

    return insightsObj;
  }


  // This assumes we're passing an array like above
  // let injectInsightsArrIntoParent(parentNode, insightsArr) {



  // }