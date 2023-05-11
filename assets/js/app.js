/***************************************** Loader *****************************************/
let loaderDiv = document.createElement('div');
loaderDiv.setAttribute('id', 'loader');

let loaderBarDiv = document.createElement('div');
loaderBarDiv.setAttribute('id', 'loader--bar');

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
    loaderBarWidth++;
    loaderBar.style.width = loaderBarWidth + '%';
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
    latestTitle.setAttribute('id', 'latest');
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
readMoreBtn.textContent = `Read More.`;
readMoreBtn.style.display = 'block';
readMoreBtn.style.cursor = 's-resize';

const readMoreTesat = document.querySelector('h1 + p');
readMoreTesat.insertAdjacentElement('beforeend', readMoreBtn);

const readMoreText = document.querySelectorAll('span');
for (let i = 0; i < readMoreText.length; i++) {
  readMoreText[i].style.display = 'none';
}

readMoreBtn.addEventListener('click', () => {
  if (readMoreBtn.textContent === `Read Less.`) {
    readMoreBtn.textContent = `Read More.`;
    readMoreBtn.style.cursor = 's-resize';
    for (let i = 0; i < readMoreText.length; i++) {
      readMoreText[i].style.display = 'none';
    }
  } else {
    readMoreBtn.textContent = `Read Less.`;
    readMoreBtn.style.cursor = 'n-resize';
    for (let i = 0; i < readMoreText.length; i++) {
      readMoreText[i].style.display = 'inline';
    }
  }
});

/***************************************** Wall Image *****************************************/
var acceleration = 0.01;

var img = {
  element: document.querySelector('#wall-image'),
  xMax: 0,
  yMax: 0,
  x: 0,
  y: 0
};

var mouse = {
  x: 0,
  y: 0
};

var vw = 0;
var vh = 0;

function init() {
  resize();
  TweenLite.set(img.element, {
    x: 0,
    y: 0
  });

  var pos = img.element._gsTransform;

  TweenMax.to(img.element, 1000, {
    x: 0,
    y: 0,
    repeat: -1,
    ease: Linear.easeNone,
    modifiers: {
      x: function() {
        img.x = map(mouse.x, 0, vw, 0, img.xMax);
        return pos.x + (img.x - pos.x) * acceleration;
      },
      y: function() {
        img.y = map(mouse.y, 0, vh, 0, img.yMax);
        return pos.y + (img.y - pos.y) * acceleration;
      }
    }
  });

  window.addEventListener('mousemove', moveAction);
  window.addEventListener('touchmove', moveAction);
  window.addEventListener('resize', resize);
}

function map(x, a, b, c, d) {
  return c + (d - c) * ((x - a) / (b - a)) || 0;
}

function resize() {
  vw = window.innerWidth;
  vh = window.innerHeight;
  img.xMax = vw - img.element.naturalWidth;
  img.yMax = vh - img.element.naturalHeight;
}

function moveAction(event) {
  if (event.targetTouches && event.targetTouches[0]) {
    event.preventDefault();
    mouse.x = event.targetTouches[0].clientX;
    mouse.y = event.targetTouches[0].clientY;
  } else {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  }
}

window.addEventListener('load', init);

/***************************************** Tooltip *****************************************/
const areas = document.getElementsByTagName('area');
for (let i = 0; i < areas.length; i++) {
  areas[i].addEventListener('mouseover', function(event) {
    const tooltip = document.createElement('div');
    tooltip.setAttribute('id', 'tooltip');
    tooltip.innerHTML = this.getAttribute('title');
    tooltip.style.position = 'absolute';
    document.body.appendChild(tooltip);
    updateTooltipPosition(event, tooltip);
    window.addEventListener('mousemove', function(event) {
      updateTooltipPosition(event, tooltip);
    });
    this.removeAttribute('title');
  });
  areas[i].addEventListener('mouseout', function() {
    const tooltip = document.querySelector('#tooltip');
    tooltip.parentNode.removeChild(tooltip);
    this.setAttribute('title', tooltip.innerHTML);
  });
}

function updateTooltipPosition(event, tooltip) {
  tooltip.style.top = (event.pageY + 10) + 'px';
  tooltip.style.left = (event.pageX + 10) + 'px';
}

/***************************************** Cookie Notice *****************************************/
const cookieNotice = document.createElement('div');
cookieNotice.setAttribute('id', 'cookie-notice');
cookieNotice.innerHTML = `<p>We use cookies. <a href="https://www.iubenda.com/privacy-policy/86096520" target="_blank" rel="noreferrer">Read Policy.</a> <a onclick="acceptCookies()">Accept.</a></p>`;
document.body.appendChild(cookieNotice);

function setCookie(cookieName, cookieValue, expirationDays) {
  const d = new Date();
  d.setTime(d.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
  const expires = 'expires=' + d.toUTCString();
  document.cookie = `${cookieName}=${cookieValue};${expires};path=/`;
}

function getCookie(cookieName) {
  const name = `${cookieName}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return '';
}

function acceptCookies() {
  setCookie('HHcookienotice', 'true', 365);
  const cookieNoticeDiv = document.getElementById('cookie-notice');
  cookieNoticeDiv.style.display = 'none';
}

if (getCookie('HHcookienotice') === 'true') {
  const cookieNoticeDiv = document.getElementById('cookie-notice');
  cookieNoticeDiv.style.display = 'none';
}
