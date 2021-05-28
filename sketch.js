let t = 0;
let cx;
let cy;
let r;
let circlesX = [];
let circlesY = [];
let trail = [];
let scale = 1;
let skip = 16;
let s = 0;
const shapes = [
  { shape: rabbit, scale: 0.5, skip: 1 },
  { shape: linkedin, scale: 0.5, skip: 1 },
  { shape: face, scale: 0.5, skip: 1 },
  { shape: drawing, scale: 1, skip: 16 },
];
let cnv;
let ctx;
let width;
let height;
window.onload = function () {
  cnv = document.querySelector("#canvas");
  ctx = cnv.getContext("2d");
  cnv.width = window.innerWidth;
  cnv.height = window.innerHeight;
  cnv.style.backgroundColor = "#353b48";
  width = cnv.width;
  height = cnv.height;
  setup();
  requestAnimationFrame(animate);
};

function setup() {
  r = 100;
  let bigShape = shapes[s].shape;
  scale = shapes[s].scale;
  skip = shapes[s].skip;
  let shape = [];
  for (let i = 0; i < bigShape.length; i += skip) {
    shape.push(bigShape[i]);
  }
  X = fourierTransform(shape, "x");
  Y = fourierTransform(shape, "y");
  for (let i = 0; i < shape.length; i++) {
    circlesX.push({
      r: scale * Math.sqrt(X[i].re * X[i].re + X[i].im * X[i].im),
      f: i,
      phi: Math.atan2(X[i].im, X[i].re),
    });
    circlesY.push({
      r: scale * Math.sqrt(Y[i].re * Y[i].re + Y[i].im * Y[i].im),
      f: i,
      phi: Math.atan2(Y[i].im, Y[i].re) + Math.PI / 2,
    });
  }
  circlesX.sort((a, b) => b.r - a.r);
  circlesY.sort((a, b) => b.r - a.r);
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  let x;
  let y;

  cx = 200;
  cy = (2 * height) / 3;
  for (let i = 0; i < circlesY.length; i++) {
    x =
      cx +
      circlesY[i].r *
        Math.cos(2 * Math.PI * circlesY[i].f * t + circlesY[i].phi);
    y =
      cy +
      circlesY[i].r *
        Math.sin(2 * Math.PI * circlesY[i].f * t + circlesY[i].phi);
    ctx.beginPath();
    ctx.strokeStyle = "#dcdde1";
    ctx.arc(cx, cy, circlesY[i].r, 0, 2 * Math.PI, 1);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "lime";
    ctx.stroke();
    cx = x;
    cy = y;
  }
  y0 = y;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(width, y);
  ctx.strokeStyle = "red";
  ctx.stroke();

  cx = (2 * width) / 3;
  cy = 200;
  for (let i = 0; i < circlesX.length; i++) {
    x =
      cx +
      circlesX[i].r *
        Math.cos(2 * Math.PI * circlesX[i].f * t + circlesX[i].phi);
    y =
      cy +
      circlesX[i].r *
        Math.sin(2 * Math.PI * circlesX[i].f * t + circlesX[i].phi);
    ctx.beginPath();
    ctx.strokeStyle = "#dcdde1";
    ctx.arc(cx, cy, circlesX[i].r, 0, 2 * Math.PI, 1);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "lime";
    ctx.stroke();
    cx = x;
    cy = y;
  }
  x0 = x;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, height);
  ctx.strokeStyle = "red";
  ctx.stroke();

  trail.unshift({ x: x0, y: y0 });
  ctx.beginPath();
  for (let i = 0; i < trail.length; i++) {
    if (i == 0) ctx.moveTo(trail[i].x, trail[i].y);
    else ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
    ctx.lineTo(trail[i].x, trail[i].y);
  }
  ctx.strokeStyle = "#8c7ae6";
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.lineWidth = 1;

  if (trail.length > 400) trail.pop();

  const dt = 1 / X.length;
  t += dt;

  if (t > 1) {
    t = 0;
  }
  requestAnimationFrame(animate);
}
