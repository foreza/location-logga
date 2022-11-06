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

  util_updateAllEleForClassNameToText(documentRef, "loc-a-name", locationA);
  util_updateAllEleForClassNameToText(documentRef, "loc-b-name", locationB);
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

  drawChart(dataObj.dataRaw, dataObj.dataAvg, `lookBack_${firstLoc}To${secondLoc}`,
    `${locationA} -> ${locationB} Scatter`,
    insightObj["trip-lowest-time-val"].value-5, calculatedCeil+5);
}