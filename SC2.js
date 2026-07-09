(function () {
  const sketch = function (p) {
    let attractPos = { x: 0, y: 0 };
    const attractEase = 0.12;
    let container;

    p.setup = function () {
      container = document.getElementById('sc-container-2');
      const w = container.clientWidth;
      const h = container.clientHeight || Math.min(window.innerHeight * 0.7, 800);
      const cnv = p.createCanvas(w, h);
      cnv.parent(container);
      p.frameRate(60);
      p.noStroke();
      attractPos.x = p.width / 2;
      attractPos.y = p.height / 2;
    };

    p.draw = function () {
      p.background(240, 247, 220);
      const tipX = p.width / 2;
      const tipY = p.height;
      const maxR = Math.max(p.width, p.height) * 0.55;
      const minR = 10, steps = 35;

      attractPos.x = p.lerp(attractPos.x, p.mouseX, attractEase);
      attractPos.y = p.lerp(attractPos.y, p.mouseY, attractEase);

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const r = p.lerp(maxR, minR, t);
        const influence = Math.pow(t, 1.4);
        const cx = p.lerp(tipX, attractPos.x, influence);
        const cy = p.lerp(tipY - r, attractPos.y, influence);

        p.fill(p.lerpColor(p.color(210, 235, 40), p.color(8, 8, 2), t));
        p.circle(cx, cy, r * 2);
      }
    };

    p.windowResized = function () {
      p.resizeCanvas(container.clientWidth, container.clientHeight || Math.min(window.innerHeight * 0.7, 800));
    };
  };

  new p5(sketch);
})();