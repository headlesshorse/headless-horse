// Work
const i = { e: document.querySelector('#work'), x: 0, y: 0 };
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

// Tooltip
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
  if (!mobile) {
    this.setAttribute('title', document.getElementById('tooltip').innerText);
    document.getElementById('tooltip').remove();
  }
}

function createTooltip(area) {
  return Object.assign(document.createElement('div'), {
    id: 'tooltip',
    className: area.href ? 'marker' : '',
    style: 'position: absolute; min-width: 15em; padding: 1em; background: var(--corner), #000; background-size: 4px 4px; background-repeat: no-repeat; text-align: center; text-transform: uppercase',
    innerText: area.title
  });
}

function updateTooltipPosition(event, tooltip) {
  tooltip.style.top = `${event.pageY + 15}px`;
  tooltip.style.left = `${event.pageX + 15}px`;
}

// Cursor
document.body.insertBefore(
  (() => {
    const cursor = document.createElement('div');
    cursor.id = 'cursor';
    cursor.style.cssText = 'height: 100%; width: 100%; position: absolute; pointer-events: none; z-index: 1';
    cursor.innerHTML = `<div id="linex" style="position: relative; min-height: 1px; background: #999;"></div><div id="liney" style="position: relative; width: 1px; min-height: 100%; background: #999"></div><div id="datay" style="position: absolute; bottom: 1em"></div><div id="datax" style="position: absolute; right: 1em"></div>`;
    document.addEventListener('mousemove', ({ clientX, clientY, pageX, pageY }) => {
      const [dx, dy, lx, ly] = ['#datax', '#datay', '#linex', '#liney'].map(id => cursor.querySelector(id));
      dx.textContent = `[Y. ${pageY}]`;
      dy.textContent = `[X. ${pageX}]`;
      dx.style.top = `${clientY + 10}px`;
      dy.style.left = `${clientX + 15}px`;
      lx.style.top = `${clientY}px`;
      ly.style.left = `${clientX}px`;
    });
    return cursor;
  })(),
  document.getElementById('work')
);