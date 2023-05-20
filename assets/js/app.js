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

setTimeout(function() {
  $('#loader').fadeOut(3000);
  $('#horseshoe, #wall-image').delay(2000).fadeIn(3000);
  setTimeout(function() {
    $('#wall-image').removeClass('wall-image--filter');
  }, 3000);
  $('body').css({
    'cursor': 'default'
  });
}, time);

/********** Navigation **********/
$('#horseshoe').click(function() {
  $('#main').fadeToggle(1000);
  $('#main--iframe').fadeOut(1000);
  $('#main--copy').delay(200).fadeIn(3000);
  $('#wall-image').toggleClass('wall-image--filter');
  $('#horseshoe').toggleClass('horseshoe--cursor');
});

$('*[target="main--iframe"]').click(function() {
  $('#main, #main--iframe').delay(200).fadeIn(3000);
  $('#main--copy').hide();
  $('#wall-image').toggleClass('wall-image--filter');
  $('#horseshoe').toggleClass('horseshoe--cursor');
});

/********** Notion **********/
const latest = document.createElement('h1');

fetch("https://potion-api.now.sh/html?id=f97f1af964fe48989650aae62609bf37")
  .then(res => res.text())
  .then(text => {
    latest.id = 'latest';
    latest.innerHTML = `Latest`;
    latest.insertAdjacentHTML('afterend', text);
    document.querySelectorAll('#latest + ul li a').forEach(link => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noreferrer');
    });
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
moreBtn.textContent = 'Read More.';
moreBtn.style.display = 'block';
moreBtn.style.cursor = 's-resize';

const moreText = document.querySelectorAll('span');
moreText.forEach(element => element.style.display = 'none');

moreBtn.addEventListener('click', () => {
  const lessText = moreBtn.textContent === 'Read Less.';
  moreBtn.textContent = lessText ? 'Read More.' : 'Read Less.';
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
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

for (const area of areas) {
  const tooltip = document.createElement('div');
  tooltip.id = 'tooltip';
  tooltip.style.position = 'absolute';
  area.addEventListener('mouseover', handleMouseOver);
  area.addEventListener('mouseout', handleMouseOut);
}

function handleMouseOver(event) {
  if (isMobile) return;
  const tooltip = document.createElement('div');
  tooltip.id = 'tooltip';
  tooltip.style.position = 'absolute';
  tooltip.innerHTML = this.getAttribute('title');
  document.body.appendChild(tooltip);
  updateTooltipPosition(event, tooltip);
  window.addEventListener('mousemove', (event) => updateTooltipPosition(event, tooltip));
  this.removeAttribute('title');
}

function handleMouseOut() {
  if (isMobile) return;
  const tooltip = document.getElementById('tooltip');
  tooltip.remove();
  this.setAttribute('title', tooltip.innerHTML);
}

function updateTooltipPosition(event, tooltip) {
  tooltip.style.top = `${event.pageY + 10}px`;
  tooltip.style.left = `${event.pageX + 10}px`;
}

/********** Cookie Notice **********/
const createNotice = () => {
  const notice = document.createElement('div');
  notice.id = 'cookie-notice';
  notice.innerHTML = `<p>We use cookies. <a href="https://www.iubenda.com/privacy-policy/86096520" target="_blank" rel="noreferrer">Read Policy.</a> <a onclick="accept()">Accept.</a></p>`;
  document.body.appendChild(notice);
  return notice;
};

const accept = () => {
  set('notice', 'true', 365);
  cookie.style.display = 'none';
};

const set = (name, value, days) => {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value};expires=${expires};path=/`;
};

const get = (name) => {
  const decoded = decodeURIComponent(document.cookie);
  const cookieArray = decoded.split('; ');
  return cookieArray.find(cookie => cookie.startsWith(`${name}=`))?.split('=')[1] || '';
};

const cookie = createNotice();
if (get('notice') === 'true') cookie.style.display = 'none';
