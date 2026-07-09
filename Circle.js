// Responsive, interactive spatial canvas
let attractPos = { x: 0, y: 0 };
const attractEase = 0.12;

function setup() {
  const container = document.getElementById('sc-container');
  const w = container ? container.clientWidth : window.innerWidth;
  const h = container ? container.clientHeight : Math.min(window.innerHeight * 0.7, 800);
  const cnv = createCanvas(w, h);
  if (container) cnv.parent(container);
  frameRate(60);
  noStroke();
  attractPos.x = width / 2;
  attractPos.y = height / 2;
}

function draw() {
  background(240, 247, 220);

  const tipX = width / 2;
  const tipY = height;
  const maxR = Math.max(width, height) * 0.55;
  const minR = 10;
  const steps = 35;

  const hasMouse = typeof mouseX !== 'undefined' && typeof mouseY !== 'undefined';
  const targetX = hasMouse ? mouseX : width / 2;
  const targetY = hasMouse ? mouseY : height / 2;

  attractPos.x = lerp(attractPos.x, targetX, attractEase);
  attractPos.y = lerp(attractPos.y, targetY, attractEase);

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const r = lerp(maxR, minR, t);
    const influence = pow(t, 1.4);
    const origCx = tipX;
    const origCy = tipY - r;
    const cx = lerp(origCx, attractPos.x, influence);
    const cy = lerp(origCy, attractPos.y, influence);

    const col = lerpColor(color(210, 235, 40), color(8, 8, 2), t);
    fill(col);
    circle(cx, cy, r * 2);
  }
}

function windowResized() {
  const container = document.getElementById('sc-container');
  if (!container) return;
  resizeCanvas(container.clientWidth, container.clientHeight || Math.min(window.innerHeight * 0.7, 800));
}
