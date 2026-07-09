function setup() {
  createCanvas(800, 600);
  noLoop();
  noStroke();
}

function draw() {
  background(240, 247, 220);

  let tipX = width / 2;   // tangent point
  let tipY = height;    // bottom center
  let maxR = 400;         // big enough to fill past the canvas edges
  let minR = 10;           // smallest circle at the center
  let steps = 35;          // more steps = smoother gradient, more circles

  // draw largest circle first, smallest last, so it "tunnels" inward
  for (let i = 0; i <= steps; i++) {
    let t = i / steps; // 0 = outer edge, 1 = center
    let r = lerp(maxR, minR, t);

    // color ramps from light yellow-green to near black
    let col = lerpColor(color(210, 235, 40), color(8, 8, 2), t);
    fill(col);

    // every circle is tangent to the same point (tipX, tipY)
    circle(tipX, tipY - r, r * 2);
  }
}