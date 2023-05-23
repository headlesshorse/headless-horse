/********** Loader **********/
const perf = window.performance.timing;
const width = { value: 0 };
const EstimatedTime = -(perf.loadEventEnd - perf.navigationStart);
const time = parseInt((EstimatedTime / 1000) % 60) * 100 + 1000;

const loader = document.createElement('div');
loader.id = 'loader';
loader.innerHTML = `<div id="loader--bar"></div><div id="loader--percentage">0%</div>`;
document.body.appendChild(loader);

const bar = document.getElementById('loader--bar');
const per = document.getElementById('loader--percentage');
const int = setInterval(frame, time / 100);

function frame() {
  if (width.value >= 100) return clearInterval(int);
  bar.style.width = `${++width.value}%`;
  per.style.left = `${width.value}%`;
  per.textContent = `${width.value}%`;
}

setTimeout(() => {
  const loader = document.getElementById('loader');
  const horseshoe = document.getElementById('horseshoe');
  const wallImage = document.getElementById('wall-image');
  const body = document.body;
  setTimeout(() => fade(loader, 1500, 'out'), 0);
  setTimeout(() => {
    fade(horseshoe, 1500, 'in');
    fade(wallImage, 1500, 'in');
  }, 1500);
  setTimeout(() => wallImage.classList.remove('wall-image--filter'), 3000);
  body.style.cursor = 'default';
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
      opacity = end; // Set the opacity to the exact end value
      element.style.display = direction === 'out' ? 'none' : 'block';
    } else {
      element.style.opacity = opacity;
    }
  }, interval);
}

/********** Notion **********/
const latest = document.createElement('h1');

fetch("https://potion-api.now.sh/html?id=f97f1af964fe48989650aae62609bf37")
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
var now = new Date();
var day = now.getUTCDay();
var hour = now.getUTCHours() + 1;
var notice = "";

if (day === 0 || day === 6) {
  notice = "We are out of office and will return Monday; our hours are Monday–Friday, 09:00—18:00.";
} else if (hour >= 9 && hour < 18) {
  notice = "The studio is open today from 09:00-18:00.";
} else {
  notice = "We are out of office; our hours are Monday–Friday, 09:00—18:00.";
}

document.querySelector('p').insertAdjacentHTML('beforeend', '<br>' + notice);

/********** Read More **********/
const moreBtn = document.createElement('a');
moreBtn.textContent = '[…]';
moreBtn.style.display = 'block';
moreBtn.style.cursor = 's-resize';

const moreText = document.querySelectorAll('span');
moreText.forEach(element => element.style.display = 'none');

moreBtn.addEventListener('click', () => {
  const lessText = moreBtn.textContent === '[Close]';
  moreBtn.textContent = lessText ? '[…]' : '[Close]';
  moreBtn.style.cursor = lessText ? 's-resize' : 'n-resize';
  moreText.forEach(element => element.style.display = lessText ? 'none' : 'inline');
});

document.querySelector('h1 + p').appendChild(moreBtn);

/********** Typing **********/
function typeWriter(element, speed) {
  var text = element.textContent;
  var i = 0;
  element.textContent = "";
  if (element.tagName.toLowerCase() === "p" || element.closest("p")) speed = 20;
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
      typeWriter(element, 80);
    }
  }
});

/********** Wall Image **********/
const a = 0.01;
const i = { e: document.querySelector('#wall-image'), xM: 0, yM: 0, x: 0, y: 0 };
const m = { x: 0, y: 0 };
let w = 0, h = 0, tX = 0, tY = 0, ani = null;

function init() {
  r();
  i.e.style.transform = 'translate(0px, 0px)';
  mI();
  window.addEventListener('mousemove', mV);
  window.addEventListener('touchmove', mV);
  window.addEventListener('resize', r);
}

function map(x, a, b, c, d) { return c + ((d - c) * (x - a)) / (b - a) || 0; }

function r() {
  w = window.innerWidth;
  h = window.innerHeight;
  i.xM = w - i.e.naturalWidth;
  i.yM = h - i.e.naturalHeight;
}

function mI() {
  if (!cV()) {
    i.x = l(i.x, tX, a);
    i.y = l(i.y, tY, a);
    i.e.style.transform = `translate(${i.x}px, ${i.y}px)`;
  }
  ani = window.requestAnimationFrame(mI);
}

function mV(event) {
  const t = event.targetTouches?.[0];
  m.x = t ? t.clientX : event.clientX;
  m.y = t ? t.clientY : event.clientY;
  tX = map(m.x, 0, w, 0, i.xM);
  tY = map(m.y, 0, h, 0, i.yM);
}

function l(s, e, t) { return s * (1 - t) + e * t; }

function cV() {
  const c = document.querySelector('#main');
  return c && c.offsetParent !== null;
}

function cA() {
  if (ani) {
    window.cancelAnimationFrame(ani);
    ani = null;
  }
}

window.addEventListener('load', init);
window.addEventListener('beforeunload', cA);

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
  if (document.cookie.includes("noticeClose")) return;

  const notice = document.createElement("div");
  notice.id = "🥠";
  notice.innerHTML = `<a href="https://withcabin.com/privacy/headless.horse" target="_blank" rel="noreferrer">We don't use advertising or tracking cookies.</a> <a href="#" id="🆗">[Close]</a>`;
  document.body.appendChild(notice);

  const close = document.getElementById("🆗");
  close.addEventListener("click", () => {
    event.preventDefault();
    notice.style.display = "none";
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    document.cookie = `noticeClose=true; expires=${expiryDate.toUTCString()}; path=/`;
  });
}

createNotice();
