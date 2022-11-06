// This assumes we're using materialize (and appending to the main element)
// Primary template for displaying segment lookback

let injectSegmentTemplateForParams = (docRef, insightId, lookbackId) => {
  let tLookbackEle = docRef.createElement("div");
  tLookbackEle.classList.add("segment-lookback");
  tLookbackEle.innerHTML =
    `
      <div class="row">
        <div class="col m6 s12 section">
          <h3>Data Insights for last 30 days</h3>
          <div id="${insightId}">
          </div>
        </div>
        <div class="col m6 s12 section">
          <h3>Trip Data last 30 Days</h3>
          <div id="${lookbackId}" class="section">
          </div>
        </div>
      </div>
    `  
    docRef.getElementsByTagName("main")[0].append(tLookbackEle);
}


let injectSegmentHeader = (docRef, classAName, classBName) => {
  var tH = docRef.createElement("h2");
  tH.innerHTML = `<span class="${classAName}"></span> to <span class="${classBName}"></span>`
  docRef.getElementsByTagName("main")[0].append(tH);
}