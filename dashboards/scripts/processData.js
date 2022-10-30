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


  function getInsights(rawData, averagedData) {

    let insightsObj = {
      'trip-peak-time-val' : 1,
      "trip-avg-time-val": 1,
      "best-times-to-leave-am": [1,2,3],
      "best-times-to-leave-pm":[1,2,3],
      "worst-times-to-leave":[4,5,6]
    }
  
    // Trip peak time is the max of the set, sort the set by highest
  
  
    // Make a copy and modify this set to be UTC data
    let insightsData = rawData.map(({ hour, timetodestminutes }) =>
      ({ hour: adjustTimeForUTC(parseInt(hour)), timetodestminutes: timetodestminutes }))
  
    insightsData.sort((a, b) => b.timetodestminutes - a.timetodestminutes);
    var peakEntry = insightsData[0];
    console.log("Highest Trip Time observed: ", peakEntry);
    
  
    var worstTripTimes = [insightsData[0].hour, insightsData[1].hour, insightsData[2].hour]
  
    console.log("Avoid these times: ", worstTripTimes)
  
    // // Best trip times:
  
    let morningData = insightsData.filter((a) => a.hour < 12)
    morningData.sort((a, b) => a.timetodestminutes - b.timetodestminutes);
  
    var bestTripTimesAM = [morningData[0].hour, morningData[1].hour, morningData[2].hour];
    console.log("bestTripTimesInTheMorning: ", bestTripTimesAM);
  
    let afternoonData = insightsData.filter((a) => a.hour >= 12)
    afternoonData.sort((a, b) => a.timetodestminutes - b.timetodestminutes);
  
    var bestTripTimesPM = [afternoonData[0].hour, afternoonData[1].hour, afternoonData[2].hour];
    console.log("bestTripTimesInTheAfternoon: ", bestTripTimesPM);
  
  }
  