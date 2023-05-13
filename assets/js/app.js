/***************************************** Loader *****************************************/
const loaderBarWidth = { value: 0 };
const perfData = window.performance.timing;
const EstimatedTime = -(perfData.loadEventEnd - perfData.navigationStart);
const time = parseInt((EstimatedTime / 1000) % 60) * 100 + 1000;

const loaderDiv = document.createElement('div');
loaderDiv.id = 'loader';
loaderDiv.innerHTML = `<div id="loader--bar"></div><div id="loader--percentage">0%</div>`;
document.body.appendChild(loaderDiv);

const loaderBar = document.getElementById('loader--bar');
const loaderPercentage = document.getElementById('loader--percentage');
const loaderInterval = setInterval(frame, time / 100);

function frame() {
  if (loaderBarWidth.value >= 100) return clearInterval(loaderInterval);
  loaderBar.style.width = `${++loaderBarWidth.value}%`;
  loaderPercentage.style.left = `${loaderBarWidth.value}%`;
  loaderPercentage.textContent = `${loaderBarWidth.value}%`;
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

/***************************************** Navigation *****************************************/
$('#horseshoe').click(function() {
  $('#main, #wall-image--cover').fadeToggle(1000);
  $('#main--iframe').fadeOut(1000);
  $('#main--copy').delay(200).fadeIn(3000);
  $('#wall-image').toggleClass('wall-image--filter');
  $('#horseshoe').toggleClass('horseshoe--cursor');
});

$('*[target="main--iframe"]').click(function() {
  $('#main, #main--iframe, #wall-image--cover').delay(200).fadeIn(3000);
  $('#main--copy').hide();
  $('#wall-image').toggleClass('wall-image--filter');
  $('#horseshoe').toggleClass('horseshoe--cursor');
});

/***************************************** Notion *****************************************/
const latestTitle = document.createElement('h1');

fetch("https://potion-api.now.sh/html?id=f97f1af964fe48989650aae62609bf37")
  .then(res => res.text())
  .then(text => {
    latestTitle.id = 'latest';
    latestTitle.innerHTML = `Latest`;
    latestTitle.insertAdjacentHTML('afterend', text);
    document.querySelectorAll('#latest + ul li a').forEach(link => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noreferrer');
    });
    latestTitle.style.display = text.trim().length === 0 ? 'none' : 'block';
  });

document.querySelector('section').appendChild(latestTitle);

/***************************************** Hours *****************************************/
var now = new Date();
var day = now.getUTCDay();
var hour = now.getUTCHours() + 1;
var message = "";

if (day === 0 || day === 6) {
  message = "We are currently out of office and will return Monday morning. Our hours of operation are Monday to Friday, 09:00—18:00 GMT.";
} else if (hour >= 9 && hour < 18) {
  message = "The studio is open today from 09:00-18:00 GMT.";
} else {
  message = "We are currently out of office, hours of operation are Monday—Friday, 09:00—18:00 GMT.";
}

document.querySelector('p').insertAdjacentHTML('beforeend', message);

/***************************************** Read More *****************************************/
const readMoreBtn = document.createElement('a');
readMoreBtn.textContent = 'Read More.';
readMoreBtn.style.display = 'block';
readMoreBtn.style.cursor = 's-resize';

const readMoreText = document.querySelectorAll('span');
readMoreText.forEach(element => element.style.display = 'none');

readMoreBtn.addEventListener('click', () => {
  const isReadLess = readMoreBtn.textContent === 'Read Less.';
  readMoreBtn.textContent = isReadLess ? 'Read More.' : 'Read Less.';
  readMoreBtn.style.cursor = isReadLess ? 's-resize' : 'n-resize';
  readMoreText.forEach(element => element.style.display = isReadLess ? 'none' : 'inline');
});

document.querySelector('h1 + p').appendChild(readMoreBtn);

/***************************************** Wall Image *****************************************/
const acceleration = 0.01;
const img = {
  element: document.querySelector('#wall-image'),
  xMax: 0,
  yMax: 0,
  x: 0,
  y: 0
};
const mouse = {
  x: 0,
  y: 0
};
let vw = 0,
  vh = 0;
let targetX = 0,
  targetY = 0;
let animationId = null;

function init() {
  resize();
  img.element.style.transform = 'translate(0px, 0px)';
  moveImage();
  window.addEventListener('mousemove', moveAction);
  window.addEventListener('touchmove', moveAction);
  window.addEventListener('resize', resize);
}

function map(x, a, b, c, d) {
  return c + ((d - c) * (x - a)) / (b - a) || 0;
}

function resize() {
  vw = window.innerWidth;
  vh = window.innerHeight;
  img.xMax = vw - img.element.naturalWidth;
  img.yMax = vh - img.element.naturalHeight;
}

function moveImage() {
  if (!isCoverVisible()) {
    img.x = lerp(img.x, targetX, acceleration);
    img.y = lerp(img.y, targetY, acceleration);
    img.element.style.transform = `translate(${img.x}px, ${img.y}px)`;
  }
  animationId = window.requestAnimationFrame(moveImage);
}

function moveAction(event) {
  const touch = event.targetTouches && event.targetTouches[0];
  mouse.x = touch ? touch.clientX : event.clientX;
  mouse.y = touch ? touch.clientY : event.clientY;
  targetX = map(mouse.x, 0, vw, 0, img.xMax);
  targetY = map(mouse.y, 0, vh, 0, img.yMax);
}

function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

function isCoverVisible() {
  const cover = document.querySelector('#wall-image--cover');
  return cover && cover.offsetParent !== null;
}

function cancelAnimation() {
  if (animationId) {
    window.cancelAnimationFrame(animationId);
    animationId = null;
  }
}

window.addEventListener('load', init);
window.addEventListener('beforeunload', cancelAnimation);

/***************************************** Tooltip *****************************************/
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

/***************************************** Cookie Notice *****************************************/
const createCookieNotice = () => {
  const cookieNotice = document.createElement('div');
  cookieNotice.id = 'cookie-notice';
  cookieNotice.innerHTML = `<p>We use cookies. <a href="https://www.iubenda.com/privacy-policy/86096520" target="_blank" rel="noreferrer">Read Policy.</a> <a onclick="acceptCookies()">Accept.</a></p>`;
  document.body.appendChild(cookieNotice);
  return cookieNotice;
};

const acceptCookies = () => {
  setCookie('HHcookienotice', 'true', 365);
  cookieNotice.style.display = 'none';
};

const setCookie = (cookieName, cookieValue, expirationDays) => {
  const expires = new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${cookieName}=${cookieValue};expires=${expires};path=/`;
};

const getCookie = (cookieName) => {
  const name = `${cookieName}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (const cookie of cookieArray) {
    const trimmedCookie = cookie.trim();
    if (trimmedCookie.indexOf(name) === 0) {
      return trimmedCookie.substring(name.length);
    }
  }
  return '';
};

const cookieNotice = createCookieNotice();
if (getCookie('HHcookienotice') === 'true') {
  cookieNotice.style.display = 'none';
}
