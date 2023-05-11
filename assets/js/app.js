/***************************************** Loader *****************************************/
let loaderDiv = document.createElement('div');
loaderDiv.id = 'loader';

let loaderBarDiv = document.createElement('div');
loaderBarDiv.id = 'loader--bar';

loaderDiv.appendChild(loaderBarDiv);
document.body.appendChild(loaderDiv);

let width = 100;
let perfData = window.performance.timing;
let EstimatedTime = -(perfData.loadEventEnd - perfData.navigationStart);
let time = parseInt((EstimatedTime / 1000) % 60) * 100 + 2000;

let loaderBar = document.getElementById('loader--bar');
let loaderBarWidth = 0;
let loaderInterval = setInterval(frame, time / 100);

function frame() {
  if (loaderBarWidth >= width) {
    clearInterval(loaderInterval);
  } else {
    loaderBar.style.width = (++loaderBarWidth) + '%';
  }
}

setTimeout(function() {
  $('#loader').fadeOut(3000);
  $('#horseshoe, #wall-image').delay(2000).fadeIn(3000);
  setTimeout(function() {
    $('#wall-image').removeClass('wall-image--filter');
  }, 2000);
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
let previousSection = document.querySelector('h1 + p');
let latestTitle = document.createElement('h1');

previousSection.after(latestTitle);

fetch("https://potion-api.now.sh/html?id=f97f1af964fe48989650aae62609bf37")
  .then(res => res.text())
  .then(text => {
    latestTitle.id = 'latest';
    latestTitle.innerHTML = `Latest`;
    latestTitle.insertAdjacentHTML('afterend', text);
    document.querySelectorAll('#latest + ul li a').forEach(link => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noreferrer');
      latestTitle.style.display = 'block';
    });
  })

/***************************************** Office Hours *****************************************/
var now = new Date();
var day = now.getUTCDay(); // 0 = Sunday, 1 = Monday, etc.
var hour = now.getUTCHours(); // 0-23

if (day === 0 || day === 6) {
  document.querySelector('p').insertAdjacentHTML('beforeend', `We are currently out of office and will return Monday morning. Our hours of operation are Monday to Friday, 09:00—18:00 GMT.`);
} else {
  hour += 1; // Adjust for GMT+1 timezone
  if (hour >= 9 && hour < 18) {
    document.querySelector('p').insertAdjacentHTML('beforeend', `The studio is open today from 09:00-18:00 GMT.`);
  } else {
    document.querySelector('p').insertAdjacentHTML('beforeend', `We are currently out of office, hours of operation are Monday—Friday, 09:00—18:00 GMT.`);
  }
}

/***************************************** Read More *****************************************/
const readMoreBtn = document.createElement('a');
readMoreBtn.textContent = 'Read More.';
readMoreBtn.style.display = 'block';
readMoreBtn.style.cursor = 's-resize';

const readMoreText = document.querySelectorAll('span');
readMoreText.forEach(element => {
  element.style.display = 'none';
});

readMoreBtn.addEventListener('click', () => {
  const isReadLess = readMoreBtn.textContent === 'Read Less.';
  readMoreBtn.textContent = isReadLess ? 'Read More.' : 'Read Less.';
  readMoreBtn.style.cursor = isReadLess ? 's-resize' : 'n-resize';

  readMoreText.forEach(element => {
    element.style.display = isReadLess ? 'none' : 'inline';
  });
});

document.querySelector('h1 + p').insertAdjacentElement('beforeend', readMoreBtn);

/***************************************** Wall Image *****************************************/
var acceleration = 0.01;
var img = { element: document.querySelector('#wall-image'), xMax: 0, yMax: 0, x: 0, y: 0 };
var mouse = { x: 0, y: 0 };
var vw = 0, vh = 0;
var targetX = 0, targetY = 0;
var animationId = null;

function init() {
  resize();
  img.element.style.transform = 'translate(0px, 0px)';
  window.requestAnimationFrame(moveImage);
  window.addEventListener('mousemove', moveAction);
  window.addEventListener('touchmove', moveAction);
  window.addEventListener('resize', resize);
}

function map(x, a, b, c, d) { return c + ((d - c) * (x - a)) / (b - a) || 0; }
function resize() { vw = window.innerWidth; vh = window.innerHeight; img.xMax = vw - img.element.naturalWidth; img.yMax = vh - img.element.naturalHeight; }

function moveImage() {
  if (!isCoverVisible()) {
    img.x = lerp(img.x, targetX, acceleration);
    img.y = lerp(img.y, targetY, acceleration);
    img.element.style.transform = 'translate(' + img.x + 'px, ' + img.y + 'px)';
  }
  animationId = window.requestAnimationFrame(moveImage);
}

function moveAction(event) {
  var touch = event.targetTouches && event.targetTouches[0];
  mouse.x = touch ? touch.clientX : event.clientX;
  mouse.y = touch ? touch.clientY : event.clientY;
  targetX = map(mouse.x, 0, vw, 0, img.xMax);
  targetY = map(mouse.y, 0, vh, 0, img.yMax);
}

function lerp(start, end, t) { return start * (1 - t) + end * t; }

function isCoverVisible() {
  var cover = document.querySelector('#wall-image--cover');
  return cover && cover.offsetParent !== null;
}

function cancelAnimation() {
  if (animationId) {
    window.cancelAnimationFrame(animationId);
    animationId = null;
  }
}

window.addEventListener('load', function() {
  init();
});

window.addEventListener('beforeunload', function() {
  cancelAnimation();
});

/***************************************** Tooltip *****************************************/
const areas = document.getElementsByTagName('area');

for (let i = 0; i < areas.length; i++) {
  const tooltip = document.createElement('div');
  tooltip.id = 'tooltip';
  tooltip.style.position = 'absolute';

  areas[i].addEventListener('mouseover', function(event) {
    tooltip.innerHTML = this.getAttribute('title');
    document.body.appendChild(tooltip);
    updateTooltipPosition(event, tooltip);

    window.addEventListener('mousemove', function(event) {
      updateTooltipPosition(event, tooltip);
    });

    this.removeAttribute('title');
  });

  areas[i].addEventListener('mouseout', function() {
    tooltip.parentNode.removeChild(tooltip);
    this.setAttribute('title', tooltip.innerHTML);
  });
}

function updateTooltipPosition(event, tooltip) {
  tooltip.style.top = `${event.pageY + 10}px`;
  tooltip.style.left = `${event.pageX + 10}px`;
}

/***************************************** Cookie Notice *****************************************/
const cookieNotice = document.createElement('div');
cookieNotice.id = 'cookie-notice';
cookieNotice.innerHTML = `<p>We use cookies. <a href="https://www.iubenda.com/privacy-policy/86096520" target="_blank" rel="noreferrer">Read Policy.</a> <a onclick="acceptCookies()">Accept.</a></p>`;
document.body.appendChild(cookieNotice);

const acceptCookies = () => {
  setCookie('HHcookienotice', 'true', 365);
  cookieNotice.style.display = 'none';
};

const setCookie = (cookieName, cookieValue, expirationDays) => {
  const d = new Date();
  d.setTime(d.getTime() + expirationDays * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + d.toUTCString();
  document.cookie = `${cookieName}=${cookieValue};${expires};path=/`;
};

const getCookie = (cookieName) => {
  const name = `${cookieName}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return '';
};

if (getCookie('HHcookienotice') === 'true') {
  cookieNotice.style.display = 'none';
}
