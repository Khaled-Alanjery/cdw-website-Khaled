// ---- Front-camera flicker-wave effect ----
// Click the button to turn on the front camera. The page displays
// horizontal stripes of live video, and the blank areas show repeating
// "HELLO WORLD" text over a black background.

const startBtn = document.getElementById('demoButton');
const display = document.getElementById('messageDisplay');
const MESSAGE = 'HELLO WORLD';

let video;
let canvas;
let ctx;
let textCanvas;
let textCtx;
let running = false;
let mirror = true;

const cameraContainer = document.getElementById('camera-container');

async function startCameraWave() {
  if (running) return;
  console.log('startCameraWave() called');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
      audio: false
    });

    video = document.createElement('video');
    video.srcObject = stream;
    video.playsInline = true;
    video.muted = true;

    await new Promise((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error('Video metadata load failed'));
    });

    await video.play();
    console.log('video play() succeeded');

    canvas = document.createElement('canvas');
    canvas.id = 'waveCanvas';
    (cameraContainer || document.body).appendChild(canvas);
    console.log('appended camera canvas to', cameraContainer || 'body');
    ctx = canvas.getContext('2d');

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    startBtn.style.display = 'none';
    display.textContent = '';
    running = true;
    requestAnimationFrame(loop);
  } catch (err) {
    console.error('startCameraWave error', err);
    display.textContent = 'Camera access failed: ' + err.message;
  }
}

function resizeCanvas() {
  if (!canvas) return;
  console.log('resizeCanvas to camera container size');
  const w = (cameraContainer && cameraContainer.clientWidth) || window.innerWidth;
  const h = (cameraContainer && cameraContainer.clientHeight) || window.innerHeight;
  canvas.width = w;
  canvas.height = h;
  // ensure CSS sizing matches
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  buildTextLayer();
}

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

  const lineHeight = 52;
  const unit = `  ${MESSAGE}  `;
  const unitWidth = textCtx.measureText(unit).width;
  const repeatCount = Math.ceil(textCanvas.width / unitWidth) + 2;
  const fullLine = unit.repeat(repeatCount);

  let y = 0;
  let row = 0;
  while (y < textCanvas.height) {
    const shift = (row % 2) * (unitWidth / 2);
    textCtx.fillText(fullLine, -shift, y);
    y += lineHeight;
    row += 1;
  }
}

function loop(timestamp) {
  if (!running) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(textCanvas, 0, 0);

  const stripeHeight = 6;
  const waveFreq = 0.035;
  const waveSpeed = 0.0015;
  const xJitter = 14;

  ctx.save();
  if (mirror) {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }

  for (let y = 0; y < canvas.height; y += stripeHeight) {
    const band = Math.sin(y * waveFreq + timestamp * waveSpeed);
    if (band > 0.1) {
      const flicker = 0.35 + Math.random() * 0.65;
      const xOffset = Math.sin(timestamp * 0.002 + y * 0.05) * xJitter;
      const srcY = Math.max(0, (y / canvas.height) * video.videoHeight);
      const srcH = Math.min(video.videoHeight - srcY, (stripeHeight / canvas.height) * video.videoHeight);

      ctx.globalAlpha = flicker;
      ctx.drawImage(
        video,
        0,
        srcY,
        video.videoWidth,
        srcH,
        xOffset,
        y,
        canvas.width + Math.abs(xOffset),
        stripeHeight
      );
      ctx.globalAlpha = 1;
    }
  }

  ctx.restore();
  requestAnimationFrame(loop);
}

if (startBtn) {
  startBtn.textContent = 'Turn On Camera';
  startBtn.addEventListener('click', startCameraWave);
} else {
  console.warn('demoButton not found — camera button unavailable');
}

// reveal the spatial canvas when it scrolls into view
function initRevealObserver() {
  const target = document.getElementById('sc-container');
  if (!target) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        target.classList.add('visible');
        // ensure p5 canvas resizes and redraws when revealed
        if (typeof windowResized === 'function') windowResized();
        if (typeof redraw === 'function') redraw();
      } else {
        target.classList.remove('visible');
      }
    });
  }, { threshold: 0.25 });
  obs.observe(target);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRevealObserver);
} else {
  initRevealObserver();
}