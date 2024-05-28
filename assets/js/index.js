const i = { e: document.querySelector('#projects'), x: 0, y: 0 };
let tX = 0, tY = 0, decelerate = false;

function init() {
  r();
  ['mousemove', 'touchmove', 'resize'].forEach(e => window.addEventListener(e, mV));
  document.body.style.overflow = 'hidden';
}

function r() {
  const { innerWidth: w, innerHeight: h } = window;
  i.xM = w - i.e.naturalWidth;
  i.yM = h - i.e.naturalHeight;
}

function mV(event) {
  const { clientX, clientY } = event.targetTouches?.[0] || event;
  [tX, tY] = [map(clientX, 0, window.innerWidth, 0, i.xM), map(clientY, 0, window.innerHeight, 0, i.yM)];
  decelerate = false;
}

const map = (x, a, b, c, d) => c + ((d - c) * (x - a)) / (b - a) || 0;
const l = (s, e, t) => s * (1 - t) + e * t;

function animate() {
  const factor = decelerate ? 0.08 : 0.03;
  [i.x, i.y] = [l(i.x, tX, factor), l(i.y, tY, factor)];
  i.e.style.transform = `translate(${i.x}px, ${i.y}px)`;
  requestAnimationFrame(animate);
}

window.addEventListener('load', () => { init(); animate(); });
window.addEventListener('beforeunload', () => cancelAnimationFrame(animate));

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
  const title = this.getAttribute('title');
  const link = this.getAttribute('href');
  const tooltipContent = link ? `${title} [VISIT]` : title;
  tooltip.innerHTML = tooltipContent;
  document.body.appendChild(tooltip);
  updateTooltipPosition(event, tooltip);
  window.addEventListener('mousemove', (event) => updateTooltipPosition(event, tooltip));
  this.removeAttribute('title');
}

function mouseOut() {
  if (mobile) return;
  const tooltip = document.getElementById('tooltip');
  const title = tooltip.innerText.replace(' [VISIT]', '');
  tooltip.remove();
  this.setAttribute('title', title);
}

function updateTooltipPosition(event, tooltip) {
  tooltip.style.top = `${event.pageY + 10}px`;
  tooltip.style.left = `${event.pageX + 10}px`;
}