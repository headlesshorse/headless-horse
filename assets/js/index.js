const i = { e: document.querySelector('#installation'), x: 0, y: 0 };
let tX = 0, tY = 0;
let decelerate = false;

function init() {
  r();
  i.e.style.transform = 'translate(0px, 0px)';
  window.addEventListener('mousemove', mV);
  window.addEventListener('touchmove', mV);
  window.addEventListener('resize', r);

  document.body.style.overflow = 'hidden';
}

function r() {
  const { innerWidth: w, innerHeight: h } = window;
  i.xM = w - i.e.naturalWidth;
  i.yM = h - i.e.naturalHeight;
}

function mV(event) {
  const { clientX, clientY } = event.targetTouches?.[0] || event;
  tX = map(clientX, 0, window.innerWidth, 0, i.xM);
  tY = map(clientY, 0, window.innerHeight, 0, i.yM);
  decelerate = false;
}

function map(x, a, b, c, d) { return c + ((d - c) * (x - a)) / (b - a) || 0; }

function l(s, e, t) { return s * (1 - t) + e * t; }

function animate() {
  if (decelerate) {
    i.x = l(i.x, tX, 0.08);
    i.y = l(i.y, tY, 0.08);
  } else {
    i.x = l(i.x, tX, 0.03);
    i.y = l(i.y, tY, 0.03);
  }

  i.e.style.transform = `translate(${i.x}px, ${i.y}px)`;
  
  requestAnimationFrame(animate);
}

window.addEventListener('load', () => {
  init();
  animate();
});

window.addEventListener('beforeunload', () => {
  cancelAnimationFrame(animate);
});

const areas = document.getElementsByTagName('area');
const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

for (const area of areas) {
  const tooltip = document.createElement('div');
  tooltip.id = 'tooltip';
  tooltip.style.position = 'absolute';
  area.addEventListener('mouseover', mouseOver);
  area.addEventListener('mouseout', mouseOut);
}

function mouseOver(event) {
  if (mobile) return;
  const tooltip = document.createElement('div');
  tooltip.id = 'tooltip';
  tooltip.style.position = 'absolute';
  tooltip.innerHTML = this.getAttribute('title');
  document.body.appendChild(tooltip);
  updateTooltipPosition(event, tooltip);
  window.addEventListener('mousemove', (event) => updateTooltipPosition(event, tooltip));
  this.removeAttribute('title');
}

function mouseOut() {
  if (mobile) return;
  const tooltip = document.getElementById('tooltip');
  tooltip.remove();
  this.setAttribute('title', tooltip.innerHTML);
}

function updateTooltipPosition(event, tooltip) {
  tooltip.style.top = `${event.pageY + 10}px`;
  tooltip.style.left = `${event.pageX + 10}px`;
}