// script.js — camera wave effect, auto-starts when camera-container scrolls into view
const display = document.getElementById('messageDisplay');
const MESSAGE = 'HELLO WORLD';

let video, canvas, ctx, textCanvas, textCtx;
let running = false;
let mirror = true;

async function startCameraWave() {
  if (running) return;
  running = true;

  const container = document.getElementById('camera-container');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });

    video = document.createElement('video');
    video.srcObject = stream;
    video.playsInline = true;
    video.muted = true;

    await new Promise((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error('Video metadata load failed'));
    });
    await video.play();

    canvas = document.createElement('canvas');
    canvas.id = 'waveCanvas';
    container.appendChild(canvas);
    ctx = canvas.getContext('2d');

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    if (display) display.textContent = '';
    requestAnimationFrame(loop);
  } catch (err) {
    running = false;
    if (display) display.textContent = 'Camera access failed: ' + err.message;
  }
}

function resizeCanvas() {
  const container = document.getElementById('camera-container');
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
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

  let y = 0, row = 0;
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

  const stripeHeight = 6, waveFreq = 0.035, waveSpeed = 0.0015, xJitter = 14;
  ctx.save();
  if (mirror) { ctx.translate(canvas.width, 0); ctx.scale(-1, 1); }

  for (let y = 0; y < canvas.height; y += stripeHeight) {
    const band = Math.sin(y * waveFreq + timestamp * waveSpeed);
    if (band > 0.1) {
      const flicker = 0.35 + Math.random() * 0.65;
      const xOffset = Math.sin(timestamp * 0.002 + y * 0.05) * xJitter;
      const srcY = Math.max(0, (y / canvas.height) * video.videoHeight);
      const srcH = Math.min(video.videoHeight - srcY, (stripeHeight / canvas.height) * video.videoHeight);
      ctx.globalAlpha = flicker;
      ctx.drawImage(video, 0, srcY, video.videoWidth, srcH, xOffset, y, canvas.width + Math.abs(xOffset), stripeHeight);
      ctx.globalAlpha = 1;
    }
  }
  ctx.restore();
  requestAnimationFrame(loop);
}

// Auto-start when the camera section scrolls into view
const cameraObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) startCameraWave();
  });
}, { threshold: 0.3 });

const cameraEl = document.getElementById('camera-container');
if (cameraEl) cameraObserver.observe(cameraEl);