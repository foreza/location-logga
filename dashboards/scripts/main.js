let renderTemplatePage = async (docRef, locationA, locationB, lookBack_dataURI_AtoB, lookBack_dataURI_BtoA, dowAvg_dataURI_AtoB, dowAvg_dataURI_BtoA) => {
  injectSegmentHeader(docRef, "loc-a-name", "loc-b-name");
  injectSegmentTemplateForParams(docRef, "a-b-insight-dynamic", "monthlyLookBack_AToB")
  injectSegmentTemplateDowForParams(docRef, "dowAvg_AToB");
    
  injectSegmentHeader(docRef, "loc-b-name", "loc-a-name");
  injectSegmentTemplateForParams(docRef, "b-a-insight-dynamic", "monthlyLookBack_BToA")
  injectSegmentTemplateDowForParams(docRef, "dowAvg_BToA");
  
  util_updateAllEleForClassNameToText(docRef, "loc-a-name", locationA);
  util_updateAllEleForClassNameToText(docRef, "loc-b-name", locationB);
  
  // Render data to the template
  await renderLookBackData(docRef, locationA, locationB,
    lookBack_dataURI_AtoB, lookBack_dataURI_BtoA);
  await renderDowAverageData(docRef, locationA, locationB,
    dowAvg_dataURI_AtoB, dowAvg_dataURI_BtoA)
}