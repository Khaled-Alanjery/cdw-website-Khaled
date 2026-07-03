// ---- Front-camera flicker-wave effect ----
// Click the demo button -> front camera turns on -> the screen fills with
// horizontal stripes. Stripes riding the wave show live camera video
// (with a random flicker), the rest of the screen shows tiled text.

const startBtn = document.getElementById('demoButton');
const display = document.getElementById('messageDisplay');

// Change this to whatever text you want filling the gaps
const MESSAGE = 'HELLO WORLD';

let video, canvas, ctx, textCanvas, textCtx;
let running = false;
let mirror = true; // flip horizontally for a natural "selfie" view

async function startCameraWave() {
  if (running) return;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
      audio: false
    });

    video = document.createElement('video');
    video.srcObject = stream;
    video.playsInline = true;
    video.muted = true;
    await video.play();

    canvas = document.createElement('canvas');
    canvas.id = 'waveCanvas';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    startBtn.style.display = 'none';
    display.textContent = '';

    running = true;
    requestAnimationFrame(loop);
  } catch (err) {
    display.textContent = 'Camera access failed: ' + err.message;
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  buildTextLayer();
}

// Pre-render the repeating text onto a black background, once per resize
function buildTextLayer() {
  textCanvas = document.createElement('canvas');
  textCanvas.width = canvas.width;
  textCanvas.height = canvas.height;
  textCtx = textCanvas.getContext('2d');

  textCtx.fillStyle = '#000';
  textCtx.fillRect(0, 0, textCanvas.width, textCanvas.height);

  textCtx.fillStyle = '#fff';
  textCtx.font = 'bold 42px Roboto, sans-serif';
  textCtx.textBaseline = 'top';

  const lineHeight = 50;
  const unit = `  ${MESSAGE}  `;
  const unitWidth = textCtx.measureText(unit).width;
  const repeats = Math.ceil(textCanvas.width / unitWidth) + 2;
  const fullLine = unit.repeat(repeats);

  let y = 0;
  let row = 0;
  while (y < textCanvas.height) {
    const shift = (row % 2) * (unitWidth / 2);
    textCtx.fillText(fullLine, -shift, y);
    y += lineHeight;
    row++;
  }
}

function loop(t) {
  if (!running) return;

  // base layer: black + tiled text
  ctx.drawImage(textCanvas, 0, 0);

  const stripeHeight = 6;   // thickness of each scan stripe
  const waveFreq = 0.035;   // how tightly packed the wave bands are
  const waveSpeed = 0.0015; // how fast the wave travels down the screen
  const xJitter = 14;       // horizontal drift per stripe (adds to the "wave" feel)

  ctx.save();
  if (mirror) {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }

  for (let y = 0; y < canvas.height; y += stripeHeight) {
    const band = Math.sin(y * waveFreq + t * waveSpeed);
    if (band > 0.1) {
      const flicker = 0.35 + Math.random() * 0.65;
      const xOffset = Math.sin(t * 0.002 + y * 0.05) * xJitter;

      const srcY = (y / canvas.height) * video.videoHeight;
      const srcH = (stripeHeight / canvas.height) * video.videoHeight;

      ctx.globalAlpha = flicker;
      ctx.drawImage(
        video,
        0, srcY, video.videoWidth, srcH,
        xOffset, y, canvas.width, stripeHeight
      );
      ctx.globalAlpha = 1;
    }
  }

  ctx.restore();
  requestAnimationFrame(loop);
}

startBtn.textContent = 'Turn On Camera';
startBtn.addEventListener('click', startCameraWave);