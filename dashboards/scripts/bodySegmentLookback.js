// This assumes we're using materialize (and appending to the main element)
// Primary template for displaying segment lookback
let segmentLb = document.createElement("div");
segmentLb.classList.add("segment-lookback");
segmentLb.innerHTML =
  `
  <div class="container">
  <h2><span class="loc-a-name"></span> to <span class="loc-b-name"></span></h2>
  <div class="row">
    <div class="col m6 s12 section">
      <h3>Data Insights for last 30 days</h3>
      <div id="a-b-insight-dynamic">
      </div>
    </div>
    <div class="col m6 s12 section">
      <h3>Trip Data last 30 Days</h3>
      <div id="monthlyLookBack_AToB" class="section">
      </div>
    </div>
  </div>
  <div class="divider"></div>
  <div class="row">
    <h2><span class="loc-b-name"></span> to <span class="loc-a-name"></span></h2>
    <div class="col m6 s12 section">
      <h3>Data Insights for last 30 days</h3>
      <div id="b-a-insight-dynamic">
      </div>
    </div>
    <div class="col m6 s12 section">
      <h3>Trip Data last 30 Days</h3>
      <div id="monthlyLookBack_BToA" class="section">
      </div>
    </div>
  </div>
</div>
`
document.getElementsByTagName("main")[0].append(segmentLb);