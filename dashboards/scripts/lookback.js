// Depends on all the other scripts.
let renderLookBackData = async (documentRef, locationA, locationB, dataURI_AtoB, dataURI_BtoA) => {

  let graphObj_AToB = {
    dataRaw: undefined,
    dataAvg: undefined,
    insightsArr: undefined,
  }

  let graphObj_BToA = {
    dataRaw: undefined,
    dataAvg: undefined,
    insightsArr: undefined,
  }

  // Draw A->B
  await renderLookBackSegment(documentRef, "monthlyLookBack_AToB", "a-b-insight-dynamic", graphObj_AToB, dataURI_AtoB, locationA, locationB);
  await renderLookBackSegment(documentRef, "monthlyLookBack_BToA", "b-a-insight-dynamic", graphObj_BToA, dataURI_BtoA, locationB, locationA);
}


let renderLookBackSegment = async (documentRef, graphDOMRef, insightDOMRef, dataObj, dataURI, firstLoc, secondLoc) => {

  dataObj.dataRaw = await async_getDataFromBucket(dataURI);
  dataObj.dataAvg = getAveragedSetFromData(dataObj.dataRaw);
  
  createCanvasObject(documentRef, graphDOMRef, `lookBack_${firstLoc}To${secondLoc}`);

  let insightObj = getInsights(dataObj.dataRaw, dataObj.dataAvg);
  let insightRef = documentRef.getElementById(insightDOMRef);

  renderInsightsToDOMRef(insightRef, insightObj)
  
  let calculatedCeil = insightObj["trip-avg-time-val"].value + 
    Math.ceil((insightObj["trip-peak-time-val"].value - insightObj["trip-avg-time-val"].value)/2)

  drawLookBackChart(dataObj.dataRaw, dataObj.dataAvg, `lookBack_${firstLoc}To${secondLoc}`,
    `${locationA} -> ${locationB} Scatter`,
    insightObj["trip-lowest-time-val"].value-5, calculatedCeil+5);
}


// TODO: move these

let renderDowAverageData = async (documentRef, locationA, locationB, dataURI_AtoB, dataURI_BtoA) => {

  let graphObj_AToB = {
    dataRaw: undefined,
    dataSorted: [],
  }

  let graphObj_BToA = {
    dataRaw: undefined,
    dataSorted: [],
  }

  await renderDOWAvgSegment(documentRef, "dowAvg_AToB", graphObj_AToB, dataURI_AtoB, locationA, locationB);
  await renderDOWAvgSegment(documentRef, "dowAvg_BToA", graphObj_BToA, dataURI_BtoA, locationB, locationA);

}


let renderDOWAvgSegment = async (documentRef, graphDOMRef, dataObj, dataURI, firstLoc, secondLoc) => {

  dataObj.dataRaw = await async_getDataFromBucket(dataURI);
  if (typeof (dataObj.dataRaw) == 'undefined'){
    console.error("Error: no data from source")
    return;
  } 
  dataObj.dataRaw = shiftDayOfWeekDataToPT(transformAllObjectValuesToNumber(dataObj.dataRaw));
  
  // TODO: perhaps move these into functions on process data
  for (let i = 0; i < dataObj.dataRaw.length; ++i) {
    let tDow = dataObj.dataRaw[i].day_of_week;
    if (typeof dataObj.dataSorted[tDow] == "undefined") {
      dataObj.dataSorted[tDow] = [];
    }
    dataObj.dataSorted[tDow].push(dataObj.dataRaw[i]);
  }

  for (let i = 0; i < dataObj.dataSorted.length; ++i) {
    dataObj.dataSorted[i].sort((a,b) => a.hour - b.hour);
  }

  let insightDowObj = getDowInsights(dataObj.dataRaw);
  createCanvasObject(documentRef, graphDOMRef, `dowAvg_${firstLoc}To${secondLoc}`);

  drawDowAvgChart(dataObj.dataSorted, `dowAvg_${firstLoc}To${secondLoc}`, `${locationA} -> ${locationB} Day of Week Average Time (Hours)`, 
  insightDowObj["trip-lowest-time-val"].value - 5, insightDowObj["trip-peak-time-val"].value + 5);
  
}