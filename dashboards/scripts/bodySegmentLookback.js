// This assumes we're using materialize (and appending to the main element)
// Primary template for displaying segment lookback
let segmentLb = document.createElement("div");
segmentLb.classList.add("segment-lookback");
segmentLb.innerHTML =
  `
    <div class="container">
        <h1><span class="loc-a-name"></span> to <span class="loc-b-name"></span></h1>
        <div class="section">
          <h2>Data Insights for last 30 days</h2>
          <div id="a-b-insight-dynamic">
          </div>
        </div>
        <div class="divider"></div>
        <div class="section">
          <h2>Trip Data for last 30 Days (scatter)</h2>
          <div id="monthlyLookBack_AToB" class="section">
          </div>
        </div>
  
      </div>
  
      <div class="container">
        <h1><span class="loc-b-name"></span> to <span class="loc-a-name"></span></h1>
  
        <div class="section">
          <h2>Data Insights for last 30 days</h2>
          <div id="b-a-insight-dynamic">
          </div>
        </div>
  
        <div class="divider"></div>
        <div class="section">
          <h2>Trip Data for last 30 Days (scatter)</h2>
          <div id="monthlyLookBack_BToA" class="section">
          </div>
        </div>

      </div>
`
document.getElementsByTagName("main")[0].append(segmentLb);