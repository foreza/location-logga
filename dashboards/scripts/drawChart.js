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
  let pRef = docRef.getElementById(parentRefName);
  pRef.appendChild(c);
  return c;
}


function drawLookBackChart(rawData, averagedData, graphID, title, minTime = 20, maxTime = 90) {

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
  }).sort((a, b) => a.x - b.x);

  new Chart(graphID, {
    type: "scatter",
    data: {
      datasets: [
        {
          type: "line",
          pointRadius: 4,
          pointBackgroundColor: "rgb(127,255,0)",
          data: chartDataArrAvg,
        }, {
          pointRadius: 1,
          pointBackgroundColor: "rgb(0,0,255)",
          data: chartDataArrRaw
        }

      ]
    },
    options: {
      legend: { display: false },
      scales: {
        xAxes: [{ ticks: { min: 1, max: 24 } }],
        yAxes: [{ ticks: { min: minTime, max: maxTime } }],
      },
      title: {
        display: true,
        text: title
      },

    }
  });
}




function mapArrToXY(subArr) {
  let retArr = subArr.map((entry) => {
    var tObj = {}
    tObj.x = parseInt(entry.hour);
    tObj.y = entry.daily_hourly_avg;
    return tObj;
  })
  return retArr;
}



function drawDowAvgChart(dataArr, graphID, title, minTime = 20, maxTime = 56) {

  // Line plot data for the raw untouched data
  new Chart(graphID, {
    type: "scatter",
    data: {
      datasets: [
        {
          type: "line",
          fill: false,
          pointRadius: 4,
          pointBackgroundColor: "red",
          borderColor: "red",
          data: mapArrToXY(dataArr[0]),
          label: 'Sunday',
        },
        {
          type: "line",
          fill: false,
          pointRadius: 2,
          pointBackgroundColor: "blue",
          borderColor: "navy",
          data: mapArrToXY(dataArr[1]),
          label: 'Monday',
        }, {
          type: "line",
          fill: false,
          pointRadius: 2,
          pointBackgroundColor: "blue",
          borderColor: "teal",
          data: mapArrToXY(dataArr[2]),
          label: 'Tuesday',
        }, {
          type: "line",
          fill: false,
          pointRadius: 2,
          pointBackgroundColor: "blue",
          borderColor: "blue",
          data: mapArrToXY(dataArr[3]),
          label: 'Wednesday',
        }, {
          type: "line",
          fill: false,
          pointRadius: 2,
          pointBackgroundColor: "blue",
          borderColor: "lightblue",
          data: mapArrToXY(dataArr[4]),
          label: 'Thursday',
        }, {
          type: "line",
          fill: false,
          pointRadius: 2,
          pointBackgroundColor: "green",
          borderColor: "green",
          data: mapArrToXY(dataArr[5]),
          label: 'Friday',
        }, {
          type: "line",
          fill: false,
          pointRadius: 2,
          pointBackgroundColor: "orange",
          borderColor: "orange",
          data: mapArrToXY(dataArr[6]),
          label: 'Saturday',
        }
      ]
    },
    options: {
      legend: { display: true },
      scales: {
        xAxes: [{ ticks: { min: 1, max: 24 } }],
        yAxes: [{ ticks: { min: minTime, max: maxTime } }],
      },
      title: {
        display: true,
        text: title
      },
      maintainAspectRatio: false
    }
  });

}