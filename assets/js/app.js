/********** Loader **********/
const perf = window.performance.timing;
const EstimatedTime = -(perf.loadEventEnd - perf.navigationStart);
const time = parseInt((EstimatedTime / 1000) % 60) * 100 + 500;

const loader = document.createElement('div');
loader.id = 'loader';
loader.innerHTML = `<div id="loader--bar"></div>`;
document.body.appendChild(loader);
document.documentElement.style.cursor = 'wait';

const bar = document.getElementById('loader--bar');
const width = { value: 0 };
const int = setInterval(() => {
  if (width.value >= 100) return clearInterval(int);
  bar.style.width = `${++width.value}%`;
  bar.style.left = `${width.value}%`;
  bar.textContent = `${width.value}%`;
}, time / 100);

setTimeout(() => {
  const loader = document.getElementById('loader');
  const horseshoe = document.getElementById('horseshoe');
  const wallImage = document.getElementById('wall-image');
  setTimeout(() => fade(loader, 1500, 'out'), 0);
  setTimeout(() => {
    fade(horseshoe, 1500, 'in');
    fade(wallImage, 1500, 'in');
  }, 1500);
  setTimeout(() => wallImage.classList.remove('wall-image--filter'), 3000);
  document.documentElement.style.cursor = 'default';
}, time);

/********** Navigation **********/
const horseshoe = document.getElementById('horseshoe');
const main = document.getElementById('main');
const mainIframe = document.getElementById('main--iframe');
const mainCopy = document.getElementById('main--copy');
const wallImage = document.getElementById('wall-image');
const mainOpacity = window.getComputedStyle(main).getPropertyValue('opacity');
let isCooldownActive = false;

horseshoe.addEventListener('click', () => {
  if (!isCooldownActive) {
    isCooldownActive = true;
    const isWallImageFiltered = wallImage.classList.contains('wall-image--filter');
    if (!isWallImageFiltered) {
      mainCopy.style.visibility = 'visible';
      mainIframe.style.visibility = 'hidden';
      setTimeout(() => {
        fade(main, 1500, 'in');
        setTimeout(() => isCooldownActive = false, 1500);
      }, 200);
    } else {
      fade(main, 1500, 'out');
      setTimeout(() => isCooldownActive = false, 1500);
    }
    wallImage.classList.toggle('wall-image--filter');
    horseshoe.classList.toggle('horseshoe--cursor');
  }
});

/********** iFrame **********/
const targetElements = document.querySelectorAll('*[target="main--iframe"]');
targetElements.forEach((element) => {
  element.addEventListener('click', () => {
    if (!isCooldownActive) {
      isCooldownActive = true;
      horseshoe.disabled = true;
      mainCopy.style.visibility = 'hidden';
      setTimeout(() => {
        fade(main, 1500, 'in');
        fade(mainIframe, 1500, 'in');
        setTimeout(() => {
          isCooldownActive = false;
          horseshoe.disabled = false;
        }, 1500);
      }, 200);
      wallImage.classList.toggle('wall-image--filter');
      horseshoe.classList.toggle('horseshoe--cursor');
    }
  });
});

/********** Fade **********/
function fade(element, duration, direction) {
  const start = direction === 'in' ? 0 : 1;
  const end = direction === 'in' ? 1 : 0;
  let opacity = start;
  const interval = 50;
  const increment = (end - start) / (duration / interval);

  element.style.cssText = `opacity: ${start}; display: block`;

  const fadeInterval = setInterval(() => {
    opacity += increment;
    if ((direction === 'in' && opacity >= end) || (direction === 'out' && opacity <= end)) {
      clearInterval(fadeInterval);
      opacity = end;
      element.style.display = direction === 'out' ? 'none' : 'block';
    } else {
      element.style.opacity = opacity;
    }
  }, interval);
}

/********** Notion **********/
const latest = document.createElement('h1');

fetch('https://potion-api.now.sh/html?id=f97f1af964fe48989650aae62609bf37')
  .then(res => res.text())
  .then(text => {
    latest.innerHTML = `Latest`;
    latest.insertAdjacentHTML('afterend', text);
    const ul = latest.nextElementSibling;
    if (ul && ul.tagName.toLowerCase() === 'ul') {
      ul.querySelectorAll('li a').forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noreferrer');
      });
    }
    latest.style.display = text.trim().length === 0 ? 'none' : 'block';
  });

document.querySelector('section').appendChild(latest);

/********** Hours **********/
const now = new Date();
const day = now.getUTCDay();
const hour = now.getUTCHours() + 1;
let notice = '';

if ((day === 0 || day === 6) || (day === 5 && hour >= 18)) {
  notice = 'We are out of office and will return Monday morning.';
  wallImage.classList.add('wall-image--bw');
} else if (hour >= 9 && hour < 18) {
  notice = 'The studio is open today from 09:00-18:00.';
} else {
  notice = 'We are out of office; our hours are Monday–Friday, 09:00—18:00.';
  wallImage.classList.add('wall-image--bw');
}

document.querySelector('p').insertAdjacentHTML('beforeend', '<br>' + notice);

/********** Read More **********/
const moreBtn = document.createElement('a');
moreBtn.textContent = '[…]';
moreBtn.style.cssText = 'display: block; cursor: s-resize';

const moreText = document.querySelectorAll('span');
moreText.forEach(element => element.style.display = 'none');

moreBtn.addEventListener('click', () => {
  const lessText = moreBtn.textContent === '[Less]';
  moreBtn.textContent = lessText ? '[…]' : '[Less]';
  moreBtn.style.cursor = lessText ? 's-resize' : 'n-resize';
  moreText.forEach(element => element.style.display = lessText ? 'none' : 'inline');
});

document.querySelector('h1 + p').appendChild(moreBtn);

/********** Typing **********/
function typeWriter(element, speed) {
  var text = element.textContent;
  var i = 0;
  element.textContent = "";
  if (element.tagName.toLowerCase() === "p" || element.closest("p")) speed = 40;
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i++);
      setTimeout(type, speed);
    }
  }
  type();
}

document.getElementById("horseshoe").addEventListener("click", function() {
  var elements = document.querySelectorAll("section *");
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3 && !element.classList.contains("typewriter")) {
      element.classList.add("typewriter");
      typeWriter(element, 100);
    }
  }
});

/********** Wall Image **********/
const i = { e: document.querySelector('#wall-image'), x: 0, y: 0 };
let tX = 0, tY = 0;

function init() {
  r();
  i.e.style.transform = 'translate(0px, 0px)';
  window.addEventListener('mousemove', mV);
  window.addEventListener('touchmove', mV);
  window.addEventListener('resize', r);
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
}

function map(x, a, b, c, d) { return c + ((d - c) * (x - a)) / (b - a) || 0; }

function l(s, e, t) { return s * (1 - t) + e * t; }

function animate() {
  if (!cV()) {
    i.x = l(i.x, tX, 0.01);
    i.y = l(i.y, tY, 0.01);
    i.e.style.transform = `translate(${i.x}px, ${i.y}px)`;
  }
  requestAnimationFrame(animate);
}

function cV() { return !!(document.querySelector('#main')?.offsetParent); }

window.addEventListener('load', () => {
  init();
  animate();
});

window.addEventListener('beforeunload', () => {
  cancelAnimationFrame(animate);
});

/********** Tooltip **********/
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

/********** Notice **********/
function createNotice() {
  if (localStorage.noticeClose) return;

  const notice = document.createElement('div');
  notice.id = '🥠';
  notice.innerHTML = `<a href="./assets/site/privacy-policy.pdf" target="_blank">We don't use cookies.</a> <a href="#" id="close">[Close]</a>`;
  document.body.appendChild(notice);

  document.getElementById('close').addEventListener('click', (event) => {
    event.preventDefault();
    notice.remove();
    localStorage.noticeClose = true;
  });
}

createNotice();
