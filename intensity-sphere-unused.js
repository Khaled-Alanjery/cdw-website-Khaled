/* ==================================================================
   INTENSITY SPHERE - UNUSED
   Removed from adiliyah-mosque-matrix.html on Khaled's instruction
   ("remove all intensity sphere i dont want it now but keep it in a
   separate file in the repo"). Kept verbatim so it can be dropped
   back in: it depends on d3, and on these globals from the matrix
   page - conflictEvents, temperature, nearestReading, zones,
   currentDate - plus #cloud-svg / #cloud-legend in the markup and
   the #pane-graph .pane-body container for sizing.
   ================================================================== */
// ============================ INTENSITY SPHERE ============================
// A second view of the same pane: ONE merged point cloud ("sphere") representing
// three real intensities at once - conflict (green), environmental (purple),
// damage (yellow). Each point is drawn from whichever aggregate it belongs to,
// chosen in proportion to that aggregate's real, data-derived intensity share -
// so the sphere's overall colour is dominated by whichever intensity is
// currently highest, and total point density scales with combined intensity.
// This is the one deliberate departure from grayscale, per explicit instruction.
// Interpretive choices (disclosed): point positions are random within a disc
// (a 2D stand-in for a "sphere"), not sourced coordinates; only the counts,
// shares, and colour-dominance are derived from real data below.
const CLOUD_COLORS = { conflict:"#4a7a4a", environmental:"#7a4a8a", damage:"#c9a227" };
let cloudInited = false;

function initIntensitySphere(){
  const svg = d3.select("#cloud-svg");
  svg.selectAll("*").remove();
  svg.append("g").attr("id","cloud-points");
  cloudInited = true;

  document.getElementById("cloud-legend").innerHTML = `
    <div><span class="sw g"></span><strong>Conflict</strong> <span id="ci-conflict">0%</span> - share of documented Battle-of-Aleppo events reached by the timeline. Source: Wikipedia.</div>
    <div><span class="sw p"></span><strong>Environmental</strong> <span id="ci-environmental">0%</span> - how close the timeline date sits to a real NOAA station reading (dense 2010–2023, sparse in the real 2012–2019 gap). Source: NOAA GHCN.</div>
    <div><span class="sw y"></span><strong>Damage</strong> <span id="ci-damage">0%</span> - cumulative real % structural loss (Rapid Damage Assessment) across zones damaged by the current date.</div>
    <div style="margin-top:4px;">One sphere, one merged cloud: each point's colour is chosen in proportion to its aggregate's real intensity share, so the dominant colour shifts as the timeline moves. Total density scales with combined intensity. Conflict deaths (~31,000) are a fixed historical total and do not change with the slider.</div>
  `;
}

function updateIntensitySphere(){
  const cloudSvgEl = document.getElementById("cloud-svg");
  if (!cloudSvgEl || cloudSvgEl.style.display === "none") return; // not the active view; skip work
  if (!cloudInited) initIntensitySphere();
  const container = document.querySelector("#pane-graph .pane-body");
  const w = container.clientWidth, h = container.clientHeight;
  const cx = w/2, cy = h/2;

  // ---- three real intensities, each normalized 0-1 ----
  const activeConflict = conflictEvents.filter(c=>c._date<=currentDate).length;
  const conflictIntensity = conflictEvents.length ? Math.min(1, activeConflict/conflictEvents.length) : 0;

  const tRead = nearestReading(temperature, "tavg", currentDate);
  const daysSinceReading = tRead ? Math.abs(currentDate - tRead.date)/86400000 : Infinity;
  const envIntensity = daysSinceReading <= 3 ? 1 : daysSinceReading <= 30 ? 0.55 : daysSinceReading <= 365 ? 0.25 : 0.07;

  const dmgThresholds = { Minaret: new Date(2014,5,1), "Central dome": new Date(2015,0,1), Portico: new Date(2016,11,1) };
  let lossSum = 0, maxLoss = 0;
  zones.forEach(z=>{ maxLoss += (+z.overall_loss_pct||0); const th = dmgThresholds[z.zone]; if (th && currentDate >= th) lossSum += (+z.overall_loss_pct||0); });
  const damageIntensity = maxLoss ? Math.min(1, lossSum/maxLoss) : 0;

  const total = conflictIntensity + envIntensity + damageIntensity;
  const shares = total > 0
    ? { conflict:conflictIntensity/total, environmental:envIntensity/total, damage:damageIntensity/total }
    : { conflict:1/3, environmental:1/3, damage:1/3 };

  // ---- combined intensity drives total point density: more intensity, more points ----
  const combined = total / 3;
  const n = Math.round(24 + combined*260);

  // ---- each point's aggregate is chosen in proportion to real intensity share ----
  const points = [];
  for (let i=0;i<n;i++){
    const r0 = Math.random();
    let color = CLOUD_COLORS.damage;
    if (r0 < shares.conflict) color = CLOUD_COLORS.conflict;
    else if (r0 < shares.conflict + shares.environmental) color = CLOUD_COLORS.environmental;
    const ang = Math.random()*Math.PI*2;
    const rad = Math.pow(Math.random(),0.5) * Math.min(w,h)*0.30;
    points.push({ x:cx+Math.cos(ang)*rad, y:cy+Math.sin(ang)*rad, color });
  }

  const svg = d3.select("#cloud-svg");
  const pSel = svg.select("#cloud-points").selectAll("circle").data(points);
  pSel.exit().remove();
  pSel.enter().append("circle").attr("r",0)
    .merge(pSel)
    .attr("cx",d=>d.x).attr("cy",d=>d.y)
    .attr("fill",d=>d.color).attr("opacity",0.6)
    .transition().duration(300).attr("r",2.4);

  const ciConflict = document.getElementById("ci-conflict");
  const ciEnv = document.getElementById("ci-environmental");
  const ciDamage = document.getElementById("ci-damage");
  if (ciConflict) ciConflict.textContent = Math.round(conflictIntensity*100)+"%";
  if (ciEnv) ciEnv.textContent = Math.round(envIntensity*100)+"%";
  if (ciDamage) ciDamage.textContent = Math.round(damageIntensity*100)+"%";
}

