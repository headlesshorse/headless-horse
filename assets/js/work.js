const i = { e: document.querySelector('#projects'), x: 0, y: 0 };
let tX = 0, tY = 0, decelerate = false;

function init() {
  updateMaxPositions();
  ['mousemove', 'touchmove', 'resize'].forEach(e => window.addEventListener(e, handleMove));
  document.body.style.overflow = 'hidden';
}

function updateMaxPositions() {
  const { innerWidth: w, innerHeight: h } = window;
  i.xM = w - i.e.naturalWidth;
  i.yM = h - i.e.naturalHeight;
}

function handleMove(event) {
  const { clientX, clientY } = event.targetTouches?.[0] || event;
  [tX, tY] = [mapRange(clientX, 0, window.innerWidth, 0, i.xM), mapRange(clientY, 0, window.innerHeight, 0, i.yM)];
  decelerate = false;
}

const mapRange = (x, a, b, c, d) => c + ((d - c) * (x - a)) / (b - a) || 0;
const lerp = (start, end, t) => start * (1 - t) + end * t;

function animate() {
  const factor = decelerate ? 0.08 : 0.03;
  [i.x, i.y] = [lerp(i.x, tX, factor), lerp(i.y, tY, factor)];
  i.e.style.transform = `translate(${i.x}px, ${i.y}px)`;
  requestAnimationFrame(animate);
}

window.addEventListener('load', () => { init(); animate(); });
window.addEventListener('beforeunload', () => cancelAnimationFrame(animate));

const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
Array.from(document.getElementsByTagName('area')).forEach(area => {
  area.addEventListener('mouseover', showTooltip);
  area.addEventListener('mouseout', hideTooltip);
});

function showTooltip(event) {
  if (mobile) return;
  const tooltip = createTooltip(this);
  document.body.appendChild(tooltip);
  updateTooltipPosition(event, tooltip);
  window.addEventListener('mousemove', (e) => updateTooltipPosition(e, tooltip));
  this.removeAttribute('title');
}

function hideTooltip() {
  if (mobile) return;
  const tooltip = document.getElementById('tooltip');
  const title = tooltip.innerText.replace('↳', '');
  tooltip.remove();
  this.setAttribute('title', title);
}

function createTooltip(area) {
  const tooltip = document.createElement('div');
  tooltip.id = 'tooltip';
  tooltip.style.position = 'absolute';
  const title = area.getAttribute('title');
  const link = area.getAttribute('href');
  tooltip.innerHTML = link ? `<span style="animation: blink 1.5s steps(4, start) infinite">↳</span> ${title}` : title;
  return tooltip;
}

function updateTooltipPosition(event, tooltip) {
  tooltip.style.top = `${event.pageY + 20}px`;
  tooltip.style.left = `${event.pageX + 20}px`;
}