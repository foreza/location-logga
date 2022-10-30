/*
  Requires chart JS

  TODO:
  - Dynamically inject chart js
  - Break this out into more files
*/

// Create a DOM canvas object with a given ID
function createCanvasObject(docRef, parentRefName, graphID) {

  // TODO: check for existing id conflict, make this safer

  let c = docRef.createElement("canvas");
  c.id = graphID;
  let pRef = document.getElementById(parentRefName);
  pRef.appendChild(c);
  return c;
}


function updateViewWithInsights(object) {

  var obj = {
    'trip-peak-time-val' : 1,
    "trip-avg-time-val": 1,
    "best-times-to-leave-am": [1,2,3],
    "best-times-to-leave-pm":[1,2,3],
    "worst-times-to-leave":[4,5,6]
  }


}


function drawChart(rawData, averagedData, graphID) {


  // Scatter plot data for the raw untouched data
  var chartDataArrRaw = rawData.map(function (entry) {
    var tObj = {}
    tObj.x = adjustTimeForUTC(parseInt(entry.hour));
    tObj.y = parseInt(entry.timetodestminutes);
    return tObj;
  })


  // Scatter plot for the above data, but averaged
  var chartDataArrAvg = averagedData.map(function (entry) {
    var tObj = {}
    tObj.x = adjustTimeForUTC(parseInt(entry.hour));
    tObj.y = parseInt(entry.timetodestminutes);
    return tObj;
  })

  new Chart(graphID, {
    type: "scatter",
    data: {
      datasets: [{
        pointRadius: 2,
        pointBackgroundColor: "rgb(0,0,255)",
        data: chartDataArrRaw
      },{
        pointRadius: 4,
        pointBackgroundColor: "rgb(127,255,0)",
        data: chartDataArrAvg
      }
    ]
    },
    options: {
      legend: { display: false },
      scales: {
        xAxes: [{ ticks: { min: 1, max: 24 } }],
        yAxes: [{ ticks: { min: 20, max: 90 } }],
      },
      title: {
        display: true,
        text: "Oxnard -> UCSB (Full month)"
      }
    }
  });

}



