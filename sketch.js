//get the canvas ready
const cnv = document.querySelector("#canvas");
const ctx = cnv.getContext("2d");
cnv.width = window.innerWidth;
cnv.height = window.innerHeight;
cnv.style.backgroundColor = "#182C61";
const width = cnv.width;
const height = cnv.height;
const shapes = [rabbit, face, myName];

let t = 0;
let scale;
let circles = [];
let trail = [];
let min = { x: 1000, y: 1000 };
let max = { x: 0, y: 0 };

function setup() {
  //get the shape ready
  let s = 0;
  let shape = [];
  let skip = 1;
  if (shapes[s].length > 1000) skip = Math.floor(shapes[s].length / 1000);
  for (let i = 0; i < shapes[s].length; i += skip) {
    shape.push(shapes[s][i]);
    if (min.x > shapes[s][i].x) min.x = shapes[s][i].x;
    if (min.y > shapes[s][i].y) min.y = shapes[s][i].y;
    if (max.x < shapes[s][i].x) max.x = shapes[s][i].x;
    if (max.y < shapes[s][i].y) max.y = shapes[s][i].y;
  }
  shapeLength = Math.abs(max.x - min.x);
  shapeHeight = Math.abs(max.y - min.y);
  maxDim = length > height ? length : height;
  scale = Math.floor(
    shapeHeight > shapeLength ? maxDim / shapeHeight : maxDim / shapeLength
  );

  //obtain Fourier Transforms for x and y axis and a circles array
  X = fourierTransform(shape, "x");
  Y = fourierTransform(shape, "y");
  for (let i = 0; i < shape.length; i++) {
    circles.push(
      {
        r: scale * Math.sqrt(X[i].re * X[i].re + X[i].im * X[i].im),
        f: i,
        phi: Math.atan2(X[i].im, X[i].re),
      },
      {
        r: scale * Math.sqrt(Y[i].re * Y[i].re + Y[i].im * Y[i].im),
        f: i,
        phi: Math.atan2(Y[i].im, Y[i].re) + Math.PI / 2,
      }
    );
  }

  //sort the circles based on r and delete the circles with 0 freq
  //first and second are always with freq = 0;
  circles.sort((a, b) => b.r - a.r);
  circles.shift();
  circles.shift();
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  let x;
  let y;

  //start from the center of screen
  let cx = width / 2;
  let cy = height / 2;

  //loop over every circle and get the final vertex
  for (let i = 0; i < circles.length; i++) {
    let angle = 2 * Math.PI * circles[i].f * t + circles[i].phi;
    x = cx + circles[i].r * Math.cos(angle);
    y = cy + circles[i].r * Math.sin(angle);

    //draw circle
    ctx.beginPath();
    ctx.strokeStyle = `rgba(255,255,255, ${
      0.4 * ((circles.length - 10 * i) / circles.length)
    }`;
    ctx.arc(cx, cy, circles[i].r, 0, 2 * Math.PI, 1);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.lineWidth = 1;

    //draw the revolving line
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "lime";
    ctx.stroke();
    cx = x;
    cy = y;
  }
  //add final vertex to the trail array
  trail.unshift({ x, y });

  //draw the trail
  ctx.beginPath();
  for (let i = 0; i < trail.length; i++) {
    if (i == 0) ctx.moveTo(trail[i].x, trail[i].y);
    else ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
    ctx.lineTo(trail[i].x, trail[i].y);
  }
  ctx.strokeStyle = "#FC427B";
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.lineWidth = 1;

  //limit the trail
  if (trail.length > 1000) trail.pop();

  //define increment and limit t
  const dt = 1 / X.length;
  t += dt;
  if (t > 1) t = 0;

  requestAnimationFrame(animate);
}

setup();
requestAnimationFrame(animate);
